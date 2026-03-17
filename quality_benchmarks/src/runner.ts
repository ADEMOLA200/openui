import OpenAI from "openai";
import { writeFileSync } from "fs";
import type { BenchmarkDocument } from "./schemas.js";
import { buildJsonSystemPrompt, parseJsonOutput } from "./formats/json.js";
import { buildLangSystemPrompt, parseLangOutput } from "./formats/lang.js";
import { evaluateExtraction, type EvalResult } from "./evaluator.js";

export interface ModelConfig {
  id: string;
  /** reasoning_effort value to pass, or undefined if not supported */
  reasoningEffort?: string;
  /** if true, omit temperature (reasoning models that don't accept temperature=0) */
  omitTemperature?: boolean;
}

export const MODELS: ModelConfig[] = [
  { id: "gpt-5.4", reasoningEffort: "none" },
  { id: "gpt-4o" },
  { id: "gpt-5-mini", reasoningEffort: "minimal", omitTemperature: true },
];

export interface RunResult {
  model: string;
  docId: string;
  format: "json" | "lang";
  run: number;
  rawOutput: string;
  parsed: unknown | null;
  parseError: string | null;
  evalResult: EvalResult | null;
  completionTokens: number;
  promptTokens: number;
}

const RUNS = 5;

export async function runBenchmark(
  docs: BenchmarkDocument[],
  models: ModelConfig[] = MODELS,
  outDir: string = "results",
): Promise<RunResult[]> {
  const client = new OpenAI();
  const results: RunResult[] = [];

  for (const modelConfig of models) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`MODEL: ${modelConfig.id}${modelConfig.reasoningEffort ? ` (reasoning_effort=${modelConfig.reasoningEffort})` : ""}`);
    console.log("=".repeat(60));

    for (const doc of docs) {
      for (const format of ["json", "lang"] as const) {
        const systemPrompt =
          format === "json"
            ? buildJsonSystemPrompt(doc.zodSchema)
            : buildLangSystemPrompt(doc.langSchema);

        console.log(`\n[${doc.id}] format=${format} — building prompts...`);

        for (let run = 1; run <= RUNS; run++) {
          console.log(`  run ${run}/${RUNS}...`);
          let parseResult: ReturnType<typeof parseJsonOutput> | null = null;
          let parseError: string | null = null;
          let parsed: unknown | null = null;
          let completionTokens = 0;
          let promptTokens = 0;

          try {
            const requestParams: Record<string, unknown> = {
              model: modelConfig.id,
              ...(modelConfig.omitTemperature ? {} : { temperature: 0 }),
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: doc.sourceText },
              ],
            };

            if (modelConfig.reasoningEffort) {
              requestParams.reasoning_effort = modelConfig.reasoningEffort;
            }

            const response = await (client.chat.completions.create as any)(requestParams) as Awaited<ReturnType<typeof client.chat.completions.create>> & { choices: any[]; usage?: any };

            const apiOutput = response.choices[0]?.message?.content ?? "";
            completionTokens = response.usage?.completion_tokens ?? 0;
            promptTokens = response.usage?.prompt_tokens ?? 0;

            parseResult =
              format === "json"
                ? parseJsonOutput(apiOutput, doc.zodSchema)
                : parseLangOutput(apiOutput, doc.langSchema);

            const outFile = `${outDir}/${modelConfig.id}-${doc.id}-${format}-run${run}.txt`;
            writeFileSync(outFile, parseResult.original, "utf-8");

            parsed = parseResult.parsed;
            parseError = parseResult.error;
          } catch (e) {
            parseError = `API error: ${e instanceof Error ? e.message : String(e)}`;
            const outFile = `${outDir}/${modelConfig.id}-${doc.id}-${format}-run${run}.txt`;
            writeFileSync(outFile, `ERROR: ${parseError}`, "utf-8");
          }

          const evalResult =
            parsed !== null
              ? evaluateExtraction(doc.groundTruth, parsed, run, format)
              : null;

          results.push({
            model: modelConfig.id,
            docId: doc.id,
            format,
            run,
            rawOutput: parseResult?.original ?? "",
            parsed,
            parseError,
            evalResult,
            completionTokens,
            promptTokens,
          });

          const acc = evalResult ? `acc=${(evalResult.accuracy * 100).toFixed(1)}%` : `PARSE FAIL`;
          console.log(`    ${acc} | tokens: prompt=${promptTokens} completion=${completionTokens}`);
        }
      }
    }
  }

  return results;
}
