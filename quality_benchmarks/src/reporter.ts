import type { RunResult, ModelConfig } from "./runner.js";
import type { BenchmarkDocument } from "./schemas.js";

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function generateReport(
  results: RunResult[],
  documents: BenchmarkDocument[],
  models: ModelConfig[],
  elapsedSeconds?: string,
  resultsDir: string = "results",
): string {
  const modelIds = models.map((m) => m.id);
  const runsPerCombo = results.length > 0
    ? results.filter((r) => r.model === modelIds[0] && r.docId === documents[0]?.id && r.format === "json").length
    : 5;

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────────
  lines.push("# Structured Output Format Benchmark Report");
  lines.push("");
  lines.push(`**Run date:** ${new Date().toISOString().split("T")[0]}`);
  const tempNote = models.some((m) => m.omitTemperature)
    ? `temperature=0 (except: ${models.filter((m) => m.omitTemperature).map((m) => m.id).join(", ")} use default)`
    : "temperature=0";
  lines.push(`**Models:** ${modelIds.join(", ")} (${tempNote})`);
  lines.push(`**Documents:** ${documents.length} | **Formats:** JSON, Lang | **Runs per combo:** ${runsPerCombo}`);
  lines.push(`**Total API calls:** ${results.length}`);
  if (elapsedSeconds) lines.push(`**Total run time:** ${elapsedSeconds}s`);
  lines.push("");

  // ── Summary comparison table ────────────────────────────────────────────────
  lines.push("## Summary");
  lines.push("");
  lines.push(`| Model | Doc | JSON Acc | Lang Acc | JSON Prompt | JSON Completion | Lang Prompt | Lang Completion |`);
  lines.push(`|-------|-----|----------|----------|------------|----------------|------------|----------------|`);

  for (const modelId of modelIds) {
    for (const doc of documents) {
      const getAvg = (format: "json" | "lang") => {
        const runs = results.filter((r) => r.model === modelId && r.docId === doc.id && r.format === format);
        const evalRuns = runs.filter((r) => r.evalResult !== null);
        return {
          acc: avg(evalRuns.map((r) => r.evalResult!.accuracy)),
          prompt: avg(runs.map((r) => r.promptTokens)).toFixed(0),
          completion: avg(runs.map((r) => r.completionTokens)).toFixed(0),
          failures: runs.filter((r) => r.parseError !== null && r.parsed === null).length,
        };
      };
      const js = getAvg("json");
      const la = getAvg("lang");
      const jAcc = js.failures === 5 ? "FAIL" : pct(js.acc);
      const lAcc = la.failures === 5 ? "FAIL" : pct(la.acc);
      lines.push(`| ${modelId} | ${doc.name} | ${jAcc} | ${lAcc} | ${js.prompt} | ${js.completion} | ${la.prompt} | ${la.completion} |`);
    }
  }
  lines.push("");

  // ── Single results table ────────────────────────────────────────────────────
  lines.push("## Results");
  lines.push("");
  lines.push(`| Model | Doc | Format | Run | Accuracy | Correct/Total | Prompt Tokens | Completion Tokens | Parse Error |`);
  lines.push(`|-------|-----|--------|-----|----------|--------------|--------------|------------------|-------------|`);

  for (const modelId of modelIds) {
    for (const doc of documents) {
      for (const format of ["json", "lang"] as const) {
        const runs = results
          .filter((r) => r.model === modelId && r.docId === doc.id && r.format === format)
          .sort((a, b) => a.run - b.run);

        for (const r of runs) {
          const acc = r.evalResult ? pct(r.evalResult.accuracy) : "—";
          const fraction = r.evalResult
            ? `${r.evalResult.correctFields}/${r.evalResult.totalFields}`
            : "—";
          const err = r.parseError ? `\`${r.parseError.slice(0, 60)}\`` : "—";
          lines.push(
            `| ${modelId} | ${doc.name} | ${format} | ${r.run} | ${acc} | ${fraction} | ${r.promptTokens} | ${r.completionTokens} | ${err} |`,
          );
        }

        // Avg row
        const evalRuns = runs.filter((r) => r.evalResult !== null);
        const avgAcc = avg(evalRuns.map((r) => r.evalResult!.accuracy));
        const avgPrompt = avg(runs.map((r) => r.promptTokens)).toFixed(0);
        const avgCompletion = avg(runs.map((r) => r.completionTokens)).toFixed(0);
        const parseFailures = runs.filter((r) => r.parseError !== null && r.parsed === null).length;
        lines.push(
          `| | | | **avg** | **${pct(avgAcc)}** | | **${avgPrompt}** | **${avgCompletion}** | ${parseFailures > 0 ? `${parseFailures} failures` : "—"} |`,
        );
      }
    }
  }

  lines.push("");

  // ── Raw data reference ──────────────────────────────────────────────────────
  lines.push(`_Raw outputs saved to \`${resultsDir}/\` — \`{model}-{doc}-{format}-run{n}.txt\`_`);
  lines.push("");

  return lines.join("\n");
}
