import "dotenv/config";
import { mkdirSync, writeFileSync } from "fs";
import { documents } from "./schemas.js";
import { runBenchmark, MODELS } from "./runner.js";
import { generateReport } from "./reporter.js";

const testDir = process.argv[2] ?? "results";
const resultsDir = testDir === "results" ? "results" : `${testDir}/results`;
const reportFile = testDir === "results" ? "report.md" : `${testDir}/report.md`;

mkdirSync(resultsDir, { recursive: true });
const totalCalls = documents.length * 2 * 5 * MODELS.length;
console.log(`Output directory: ${testDir}`);
console.log(`Starting benchmark: ${MODELS.length} models × ${documents.length} docs × 2 formats × 5 runs = ${totalCalls} API calls`);
console.log(`Models: ${MODELS.map((m) => m.id).join(", ")}`);

const startTime = Date.now();
const results = await runBenchmark(documents, MODELS, resultsDir);
const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

const report = generateReport(results, documents, MODELS, elapsed, resultsDir);
writeFileSync(reportFile, report, "utf-8");
console.log(`\nDone in ${elapsed}s. Report written to ${reportFile}`);
