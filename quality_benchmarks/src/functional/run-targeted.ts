import "dotenv/config";
import OpenAI from "openai";
import { MODELS } from "../runner.js";
import { parseLangOutput } from "../formats/lang.js";
import { suite2a } from "./2a.js";
import { suite2b } from "./2b.js";

const RUNS = 3;
const client = new OpenAI();

const targets = [
  { suite: suite2a, caseId: "2a-medium" },
  { suite: suite2a, caseId: "2a-hard" },
  { suite: suite2b, caseId: "2b-medium" },
  { suite: suite2b, caseId: "2b-hard" },
];

for (const model of MODELS) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`MODEL: ${model.id}${model.reasoningEffort ? ` (reasoning_effort=${model.reasoningEffort})` : ""}`);
  console.log("=".repeat(60));

  for (const { suite, caseId } of targets) {
    const tc = suite.cases.find(c => c.id === caseId);
    if (!tc?.langSchema) continue;

    console.log(`\n  [${tc.id}] ${tc.name} (${tc.complexity}) — lang`);

    const systemPrompt = tc.langSchema.prompt({
      preamble: "You are an expert software engineer and system architect. Generate a structured plan, configuration, or specification based on the requirements provided.",
    });

    for (let run = 1; run <= RUNS; run++) {
      let parseError: string | null = null;
      let parsed: unknown = null;
      let promptTokens = 0, completionTokens = 0;

      try {
        const requestParams: Record<string, unknown> = {
          model: model.id,
          ...(model.omitTemperature ? {} : { temperature: 0 }),
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: tc.prompt },
          ],
        };
        if (model.reasoningEffort) requestParams.reasoning_effort = model.reasoningEffort;

        const response = await (client.chat.completions.create as any)(requestParams) as any;
        const rawOutput = response.choices[0]?.message?.content ?? "";
        promptTokens = response.usage?.prompt_tokens ?? 0;
        completionTokens = response.usage?.completion_tokens ?? 0;

        const langResult = parseLangOutput(rawOutput, tc.langSchema!);
        if (langResult.error) {
          parseError = langResult.error + (langResult.validationErrors.length > 0 ? `: ${langResult.validationErrors.join("; ")}` : "");
        }
        parsed = langResult.parsed;
      } catch (e) {
        parseError = e instanceof Error ? e.message : String(e);
      }

      let verificationResult = null;
      if (parsed !== null) {
        try { verificationResult = tc.verify(parsed); } catch (e) {
          parseError = (parseError ? parseError + "; " : "") + `Verify error: ${e instanceof Error ? e.message : String(e)}`;
        }
      }

      const pass = verificationResult !== null && verificationResult.pass && parseError === null;
      const checksPass = verificationResult?.checks.filter(c => c.pass).length ?? 0;
      const checksTotal = verificationResult?.checks.length ?? 0;
      const status = parseError && !verificationResult
        ? `PARSE FAIL: ${parseError.slice(0, 80)}`
        : `${checksPass}/${checksTotal} checks${pass ? " ✓" : " ✗"}`;

      console.log(`    run ${run}: ${status} | tokens: ${promptTokens}p ${completionTokens}c`);
      if (!pass && verificationResult) {
        const failing = verificationResult.checks.filter(c => !c.pass).slice(0, 3);
        for (const c of failing) console.log(`      ✗ ${c.label}: expected ${JSON.stringify(c.expected)}, got ${JSON.stringify(c.actual)}`);
      }
      if (parseError) console.log(`      error: ${parseError.slice(0, 120)}`);
    }
  }
}
