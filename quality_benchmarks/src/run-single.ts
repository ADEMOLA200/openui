import "dotenv/config";
import { mkdirSync, writeFileSync } from "fs";
import { documents } from "./schemas.js";
import { runBenchmark, MODELS } from "./runner.js";
import { generateReport } from "./reporter.js";

const docId = process.argv[2];
const modelArg = process.argv[3]; // optional: single model id to test
const testDir = process.argv[4]; // optional: output dir (e.g. test-current or test-future)

if (!docId) { console.error("Usage: tsx src/run-single.ts <doc-id> [model-id] [test-dir]"); process.exit(1); }

const filtered = documents.filter((d) => d.id === docId);
if (!filtered.length) { console.error(`No document found with id: ${docId}`); process.exit(1); }

const models = modelArg
  ? MODELS.filter((m) => m.id === modelArg)
  : MODELS;

if (modelArg && !models.length) {
  console.error(`No model config found for: ${modelArg}`);
  console.error(`Available: ${MODELS.map((m) => m.id).join(", ")}`);
  process.exit(1);
}

const resultsDir = testDir ? `${testDir}/results` : "results";
const reportFile = testDir ? `${testDir}/report.md` : "report.md";

mkdirSync(resultsDir, { recursive: true });
const results = await runBenchmark(filtered, models, resultsDir);
const report = generateReport(results, filtered, models, undefined, resultsDir);
writeFileSync(reportFile, report, "utf-8");
console.log(`Done! Report written to ${reportFile}`);
