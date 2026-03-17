# Quality Benchmark Implementation Plan

## Context

Build a benchmark (`quality_benchmarks/`) that measures extraction accuracy of two structured output formats — **JSON** and **`@openuidev/lang`** — across 5 documents of increasing schema complexity. The goal is to validate the hypothesis that `@openuidev/lang`'s compact positional syntax yields better or equal LLM extraction accuracy compared to JSON, while using fewer tokens.

- Model: `gpt-5.4` via OpenAI API
- 5 runs × 2 formats × 5 documents = 50 total API calls
- Uses Zod for JSON validation, `@openuidev/lang/structured-outputs` for lang format

---

## File Structure

```
quality_benchmarks/
├── package.json               -- New: standalone package
├── tsconfig.json              -- New: TypeScript config
├── benchmark-implementation-plan.md (this file)
├── src/
│   ├── index.ts               -- Entry point: orchestrates run → report
│   ├── schemas.ts             -- All 5 Zod schemas + defineModel wrappers + ground truths
│   ├── evaluator.ts           -- Field-level comparison logic
│   ├── runner.ts              -- OpenAI API calls + result collection
│   ├── reporter.ts            -- Markdown report generation
│   └── formats/
│       ├── json.ts            -- JSON format: prompt generation, parsing, validation
│       └── lang.ts            -- Lang format: prompt generation, parsing, validation
├── results/                   -- Created at runtime by runner
│   └── {doc}-{format}-run{N}.txt
└── report.md                  -- Generated after all runs
```

Also: add `quality_benchmarks` to `pnpm-workspace.yaml` so it can reference `@openuidev/lang` as `workspace:*`.

---

## Step 1: Package Setup

### `quality_benchmarks/package.json`
```json
{
  "name": "quality-benchmarks",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "run": "tsx src/index.ts",
    "format:fix": "prettier --write ."
  },
  "dependencies": {
    "@openuidev/lang": "workspace:*",
    "openai": "^6.22.0",
    "zod": "^4.0.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "tsx": "^4.20.3",
    "typescript": "^5.9.3"
  }
}
```

### `quality_benchmarks/tsconfig.json`
Extend root tsconfig if it exists, otherwise minimal `{ "compilerOptions": { "module": "ESNext", "moduleResolution": "bundler", "target": "ES2022", "strict": true } }`.

### `pnpm-workspace.yaml`
Add `- "quality_benchmarks"` to the packages list.

---

## Step 2: Schemas (`src/schemas.ts`)

Define both raw Zod schemas (for JSON format) and `defineModel` wrappers (for lang format) for all 5 documents.

### Key pattern for each document:
```typescript
// Raw Zod (used by JSON format)
export const PropertyListingSchema = z.object({ ... });

// defineModel wrappers (used by lang format) — nested objects become named models
const Address = defineModel({ name: "Address", schema: z.object({ street, city, state, zipCode }) });
const ListingAgent = defineModel({ name: "ListingAgent", schema: z.object({ name, email, phone }) });
const PropertyListing = defineModel({
  name: "PropertyListing",
  schema: z.object({
    address: Address.ref,
    mlsNumber: z.string(),
    // ... all flat fields unchanged
    listingAgent: ListingAgent.ref,
  }),
});
export const propertyListingLangSchema = createSchema([PropertyListing]);

// Ground truth
export const doc1GroundTruth: z.infer<typeof PropertyListingSchema> = { ... };

// Source text
export const doc1Source = `174 Crescent Ridge Drive ...`;
```

### Models needed per document:
| Doc | Root Model | Sub-models |
|-----|-----------|-----------|
| 1 Real Estate | PropertyListing | Address, ListingAgent |
| 2 Job Posting | JobPosting | Location, ReportingTo, Compensation, Requirements, Benefit |
| 3 Service Agreement | ServiceAgreement | ProviderAddress, ClientAddress, Representative, Provider, Client, Termination, Phase, PaymentTerms, Insurance, DisputeResolution |
| 4 Earnings Report | EarningsReport | (derived from doc4-earnings-report.md) |
| 5 System Architecture | SystemArchitecture | (derived from doc5-system-architecture.md) |

**Note**: For arrays of primitives (`z.array(z.string())`), no sub-model needed. For arrays of objects, define a sub-model.

### Exported interface per document:
```typescript
export interface BenchmarkDocument {
  id: string;               // e.g. "real-estate"
  name: string;             // Display name
  sourceText: string;
  zodSchema: z.ZodType;     // For JSON format
  langSchema: Schema;       // For lang format (createSchema result)
  groundTruth: unknown;     // JSON object
  fieldCount: number;       // For reporting
}
export const documents: BenchmarkDocument[] = [ doc1, doc2, doc3, doc4, doc5 ];
```

---

## Step 3: JSON Format (`src/formats/json.ts`)

```typescript
export function buildJsonSystemPrompt(schema: z.ZodType): string {
  const jsonSchema = z.toJSONSchema(schema);  // Zod v4 built-in
  return `You are a data extraction assistant. Extract structured data from the provided document text.
Output ONLY valid JSON that conforms to this schema. No markdown, no code fences, no explanation.

Schema:
${JSON.stringify(jsonSchema, null, 2)}`;
}

export function parseJsonOutput(output: string, schema: z.ZodType): {
  parsed: unknown | null;
  error: string | null;
  validationErrors: string[];
} {
  // 1. JSON.parse (catch syntax errors)
  // 2. schema.safeParse (catch semantic errors)
  // Return both parsed value and any errors
}
```

---

## Step 4: Lang Format (`src/formats/lang.ts`)

```typescript
import { type Schema } from "@openuidev/lang/structured-outputs";

export function buildLangSystemPrompt(schema: Schema): string {
  return schema.prompt({
    preamble: "You are a data extraction assistant. Extract structured data from the provided document text using the format below.",
  });
}

export function parseLangOutput(output: string, schema: Schema): {
  parsed: unknown | null;
  error: string | null;
  validationErrors: string[];
} {
  const result = schema.parse(output);
  if (!result.root) return { parsed: null, error: "No root assignment found", validationErrors: [] };
  return {
    parsed: result.root,
    error: result.meta.validationErrors.length > 0 ? "Validation errors" : null,
    validationErrors: result.meta.validationErrors.map(e => `${e.path}: ${e.message}`),
  };
}
```

---

## Step 5: Evaluator (`src/evaluator.ts`)

Implements field-level recursive comparison per the spec's matching rules.

```typescript
type ErrorType = "wrong_value" | "missing_field" | "extra_field" | "wrong_type" | "null_instead_of_value";

interface FieldError {
  run: number;
  format: "json" | "lang";
  fieldPath: string;
  expected: unknown;
  actual: unknown;
  errorType: ErrorType;
}

interface EvalResult {
  totalFields: number;      // count of leaf fields in ground truth
  correctFields: number;
  accuracy: number;         // correctFields / totalFields
  isComplete: boolean;      // accuracy === 1.0
  errors: FieldError[];
}

export function evaluateExtraction(
  groundTruth: unknown,
  extracted: unknown,
  run: number,
  format: "json" | "lang",
  path?: string
): EvalResult
```

### Counting logic:
- Count leaf fields only (strings, numbers, booleans, enums)
- Arrays of primitives: each element is one field
- Arrays of objects: recurse into each element
- Optional field absent from ground truth: not counted (skip)
- Optional field present in ground truth but missing in output: error

---

## Step 6: Runner (`src/runner.ts`)

```typescript
interface RunResult {
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

export async function runBenchmark(documents: BenchmarkDocument[]): Promise<RunResult[]>
```

### Algorithm:
```
for each doc in documents:
  for each format in ["json", "lang"]:
    systemPrompt = buildSystemPrompt(format, doc)
    for run in [1..5]:
      response = openai.chat.completions.create({
        model: "gpt-5.4",
        temperature: 0,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: doc.sourceText }
        ],
        stream: false
      })
      rawOutput = response.choices[0].message.content
      save rawOutput to results/{docId}-{format}-run{run}.txt
      parsed = parseOutput(format, rawOutput, doc)
      evalResult = parsed ? evaluateExtraction(doc.groundTruth, parsed, run, format) : null
      collect RunResult
```

---

## Step 7: Reporter (`src/reporter.ts`)

Generates all 9 sections from `RunResult[]`. Key computations:

- **Per-doc per-format stats**: aggregate across 5 runs
- **Identical runs check**: compare `rawOutput` strings across all 5 runs per doc/format
- **Token usage**: mean `completionTokens` per doc/format
- **Parse failures**: runs where `parseError !== null`
- **Field error inventory**: group errors by `fieldPath`, show count per format

```typescript
export function generateReport(results: RunResult[], documents: BenchmarkDocument[]): string
```

Report sections:
1. Executive Summary
2. Overall Results Table
3. Per-Document Summary Table
4. Accuracy vs Complexity Analysis
5. Per-Document Detailed Breakdown (run-by-run + field error inventory + error details)
6. Consistency Analysis (identical runs)
7. Token Usage
8. Parse Failures
9. Raw Data reference

---

## Step 8: Entry Point (`src/index.ts`)

```typescript
import 'dotenv/config';
import { documents } from './schemas.js';
import { runBenchmark } from './runner.js';
import { generateReport } from './reporter.js';
import { mkdirSync, writeFileSync } from 'fs';

mkdirSync('results', { recursive: true });
const results = await runBenchmark(documents);
const report = generateReport(results, documents);
writeFileSync('report.md', report);
console.log('Done! Report written to report.md');
```

---

## Key Dependencies/Utilities

- `@openuidev/lang/structured-outputs`: `defineModel`, `createSchema`, `Schema` type
- `z.toJSONSchema(schema)` — Zod v4 built-in
- `openai` npm package
- `.env` in `quality_benchmarks/` already has `OPENAI_API_KEY`

## Important Implementation Notes

1. **Schema mirroring**: `schemas.ts` defines BOTH the raw Zod schema (for JSON) AND the `defineModel` version (for lang). They must be semantically equivalent — same field names, types, and optionality.

2. **defineModel for arrays of objects**: Each object type used in an array needs its own `defineModel` with a unique name. E.g., `Benefit`, `Phase`.

3. **Optional fields in lang**: The prompt generator handles this automatically. Pass `null` positionally for absent optional fields.

4. **Field counting**: Count ALL leaf fields present in the ground truth object. Arrays contribute `length × fields_per_item` to the total.

5. **Consistency analysis**: At temp=0, compare raw `rawOutput` strings across 5 runs. Differences should be flagged.

6. **Error handling**: Wrap each API call in try/catch. Network errors count as parse failures.

## Verification

```bash
cd quality_benchmarks
pnpm install
pnpm run run
# → creates results/*.txt (50 files: 5 docs × 2 formats × 5 runs)
# → creates report.md
```
