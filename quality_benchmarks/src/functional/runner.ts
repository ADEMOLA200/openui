import "dotenv/config";
import { mkdirSync, writeFileSync } from "fs";
import OpenAI from "openai";
import { z } from "zod";
import { MODELS } from "../runner.js";
import type { FunctionalTestCase, FunctionalTestSuite } from "./domain.js";
import { parseLangOutput } from "../formats/lang.js";
import { suite2a } from "./2a.js";
import { suite2b } from "./2b.js";
import { suite2c } from "./2c.js";
import { suite2d } from "./2d.js";

const RUNS = 3;
const SUITES: FunctionalTestSuite[] = [suite2a, suite2b, suite2c, suite2d];

// System prompt for all functional tests
function buildSystemPrompt(schema: z.ZodType): string {
  const jsonSchema = z.toJSONSchema(schema);
  return `You are an expert software engineer and system architect.
Generate a structured plan, configuration, or specification based on the requirements provided.
Output ONLY valid JSON that conforms to this schema. No markdown, no code fences, no explanation.

Schema:
${JSON.stringify(jsonSchema, null, 2)}`;
}

interface TestRunResult {
  suiteId: string;
  caseId: string;
  model: string;
  format: "json" | "lang";
  run: number;
  rawOutput: string;
  parsed: unknown | null;
  parseError: string | null;
  verificationResult: import("./domain.js").VerificationResult | null;
  pass: boolean;
  promptTokens: number;
  completionTokens: number;
}

async function runAll(): Promise<TestRunResult[]> {
  const client = new OpenAI();
  const results: TestRunResult[] = [];

  for (const model of MODELS) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`MODEL: ${model.id}${model.reasoningEffort ? ` (reasoning_effort=${model.reasoningEffort})` : ""}`);
    console.log("=".repeat(60));

    for (const suite of SUITES) {
      console.log(`\n[${suite.id}] ${suite.name}`);

      for (const testCase of suite.cases) {
        console.log(`  [${testCase.id}] ${testCase.name} (${testCase.complexity})`);

        for (const format of ["json", "lang"] as const) {
          // Skip lang if no langSchema defined
          if (format === "lang" && !testCase.langSchema) continue;

          const systemPrompt = format === "json"
            ? buildSystemPrompt(testCase.schema)
            : testCase.langSchema!.prompt({
                preamble: "You are an expert software engineer and system architect. Generate a structured plan, configuration, or specification based on the requirements provided.",
              });

          for (let run = 1; run <= RUNS; run++) {
            let parsed: unknown | null = null;
            let parseError: string | null = null;
            let rawOutput = "";
            let promptTokens = 0;
            let completionTokens = 0;

            try {
              const requestParams: Record<string, unknown> = {
                model: model.id,
                ...(model.omitTemperature ? {} : { temperature: 0 }),
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: testCase.prompt },
                ],
              };
              if (model.reasoningEffort) requestParams.reasoning_effort = model.reasoningEffort;

              const response = await (client.chat.completions.create as any)(requestParams) as any;
              rawOutput = response.choices[0]?.message?.content ?? "";
              promptTokens = response.usage?.prompt_tokens ?? 0;
              completionTokens = response.usage?.completion_tokens ?? 0;

              if (format === "json") {
                // Parse JSON
                const stripped = rawOutput.trim()
                  .replace(/^```(?:json)?\s*\n?/, "")
                  .replace(/\n?```\s*$/, "");
                const json = JSON.parse(stripped);
                const result = testCase.schema.safeParse(json);
                if (!result.success) {
                  parseError = `Schema validation: ${result.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; ")}`;
                  parsed = json; // still attempt verification with partial data
                } else {
                  parsed = result.data;
                }
              } else {
                // Parse lang output
                const langResult = parseLangOutput(rawOutput, testCase.langSchema!);
                if (langResult.error) {
                  parseError = langResult.error + (langResult.validationErrors.length > 0 ? `: ${langResult.validationErrors.join("; ")}` : "");
                }
                parsed = langResult.parsed;
              }
            } catch (e) {
              parseError = e instanceof Error ? e.message : String(e);
            }

            let verificationResult: import("./domain.js").VerificationResult | null = null;
            if (parsed !== null) {
              try {
                verificationResult = testCase.verify(parsed);
              } catch (e) {
                parseError = (parseError ? parseError + "; " : "") + `Verify error: ${e instanceof Error ? e.message : String(e)}`;
              }
            }

            const pass = verificationResult !== null && verificationResult.pass && parseError === null;

            results.push({
              suiteId: suite.id,
              caseId: testCase.id,
              model: model.id,
              format,
              run,
              rawOutput,
              parsed,
              parseError,
              verificationResult,
              pass,
              promptTokens,
              completionTokens,
            });

            const checksPass = verificationResult?.checks.filter(c => c.pass).length ?? 0;
            const checksTotal = verificationResult?.checks.length ?? 0;
            const status = parseError && !verificationResult
              ? `PARSE FAIL: ${parseError.slice(0, 60)}`
              : `${checksPass}/${checksTotal} checks${pass ? " ✓" : " ✗"}`;
            console.log(`    [${format}] run ${run}: ${status} | tokens: ${promptTokens}p ${completionTokens}c`);
          }
        }
      }
    }
  }

  return results;
}

function generateReport(results: TestRunResult[]): string {
  const lines: string[] = [];
  lines.push("# Functional Tests Report");
  lines.push("");
  lines.push(`**Run date:** ${new Date().toISOString().split("T")[0]}`);
  lines.push(`**Models:** ${MODELS.map(m => m.id).join(", ")}`);
  lines.push(`**Runs per test:** ${RUNS}`);
  lines.push("");

  // Summary table
  lines.push("## Summary");
  lines.push("");
  const modelIds = MODELS.map(m => m.id);
  const formats = ["json", "lang"] as const;

  // Collect all test cases
  const cases = SUITES.flatMap(s => s.cases.map(c => ({ suiteId: s.id, suiteName: s.name, case: c })));

  const modelFormatCols = modelIds.flatMap(m => formats.map(f => `${m} ${f.toUpperCase()}`));
  lines.push(`| Suite | Test | Complexity | ${modelFormatCols.join(" | ")} |`);
  lines.push(`|-------|------|------------|${modelFormatCols.map(() => "---").join("|")}|`);

  for (const { suiteId, suiteName, case: tc } of cases) {
    const hasLang = !!tc.langSchema;
    const cells = modelIds.flatMap(modelId => formats.map(format => {
      if (format === "lang" && !hasLang) return "N/A";
      const runs = results.filter(r => r.model === modelId && r.suiteId === suiteId && r.caseId === tc.id && r.format === format);
      const passed = runs.filter(r => r.pass).length;
      const parseFails = runs.filter(r => r.parseError !== null && r.parsed === null).length;
      if (parseFails === RUNS) return "PARSE FAIL";
      return `${passed}/${RUNS} pass`;
    }));
    lines.push(`| ${suiteName} | ${tc.name.slice(0, 30)} | ${tc.complexity} | ${cells.join(" | ")} |`);
  }
  lines.push("");

  // Detailed breakdown per test case
  lines.push("## Detailed Results");
  lines.push("");

  for (const { suiteId, suiteName, case: tc } of cases) {
    lines.push(`### ${suiteName} — ${tc.name} (${tc.complexity})`);
    lines.push("");

    // Get sample checks from first successful run
    const sampleChecks = results.find(r => r.suiteId === suiteId && r.caseId === tc.id && r.verificationResult !== null)
      ?.verificationResult?.checks ?? [];

    if (sampleChecks.length > 0) {
      const checkHeaders = sampleChecks.map(c => c.label.slice(0, 30));
      lines.push(`| Model | Format | Run | Parse | ${checkHeaders.join(" | ")} | Tokens |`);
      lines.push(`|-------|--------|-----|-------|${checkHeaders.map(() => "---").join("|")}|--------|`);

      for (const modelId of modelIds) {
        for (const format of formats) {
          const runs = results.filter(r => r.model === modelId && r.suiteId === suiteId && r.caseId === tc.id && r.format === format);
          for (const r of runs) {
            const parseCell = r.parseError ? `✗` : "✓";
            const checkCells = sampleChecks.map(sc => {
              const c = r.verificationResult?.checks.find(c => c.label === sc.label);
              if (!c) return "—";
              return c.pass ? "✓" : `✗`;
            });
            lines.push(`| ${modelId} | ${format} | ${r.run} | ${parseCell} | ${checkCells.join(" | ")} | ${r.promptTokens}p ${r.completionTokens}c |`);
          }
        }
      }
    } else {
      lines.push(`| Model | Format | Run | Parse Error | Tokens |`);
      lines.push(`|-------|--------|-----|-------------|--------|`);
      for (const modelId of modelIds) {
        for (const format of formats) {
          const runs = results.filter(r => r.model === modelId && r.suiteId === suiteId && r.caseId === tc.id && r.format === format);
          for (const r of runs) {
            const err = r.parseError?.slice(0, 80) ?? "—";
            lines.push(`| ${modelId} | ${format} | ${r.run} | ${err} | ${r.promptTokens}p ${r.completionTokens}c |`);
          }
        }
      }
    }
    lines.push("");

    // Show failing output for first failing run per model+format
    for (const modelId of modelIds) {
      for (const format of formats) {
        const failRun = results.find(r => r.model === modelId && r.suiteId === suiteId && r.caseId === tc.id && r.format === format && !r.pass);
        if (failRun) {
          lines.push(`<details><summary>${modelId} [${format}] — failing run ${failRun.run}</summary>`);
          lines.push("");
          if (failRun.parseError) lines.push(`**Error:** ${failRun.parseError}`);
          if (failRun.verificationResult) {
            const failing = failRun.verificationResult.checks.filter(c => !c.pass);
            if (failing.length > 0) {
              lines.push("**Failed checks:**");
              for (const c of failing) {
                lines.push(`- ${c.label}: expected \`${JSON.stringify(c.expected)}\`, got \`${JSON.stringify(c.actual)}\``);
              }
            }
          }
          lines.push("");
          lines.push("```");
          lines.push(failRun.rawOutput.slice(0, 1000));
          lines.push("```");
          lines.push("</details>");
          lines.push("");
        }
      }
    }
  }

  return lines.join("\n");
}

// Main
mkdirSync("functional-results", { recursive: true });
const results = await runAll();

// Save raw outputs
for (const r of results) {
  writeFileSync(
    `functional-results/${r.model}-${r.suiteId}-${r.caseId}-${r.format}-run${r.run}.txt`,
    r.rawOutput,
    "utf-8",
  );
}

const report = generateReport(results);
writeFileSync("functional-report.md", report, "utf-8");
console.log("\nDone! Report written to functional-report.md");
