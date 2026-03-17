# Benchmark: Structured Output Extraction Accuracy

## Objective

Build a benchmark that measures extraction accuracy of two structured output formats — JSON and `@openuidev/lang` — across 5 documents of increasing schema complexity.

## What you're testing

Given a source text and a Zod schema, ask an LLM to extract structured data into that schema. Compare the extraction accuracy when the model outputs JSON vs when it outputs `@openuidev/lang` (line-oriented assignment syntax).

## Setup

- Model: GPT-5.4 (use OpenAI API, `gpt-4o` model string)
- Temperature: 0
- Runs: 5 per document per format (50 total API calls)
- Environment variable: `OPENAI_API_KEY`

## Two formats to test

### Format A: JSON

System prompt instructs the model to output valid JSON matching a JSON Schema (derived from the Zod schema). The model must output only JSON, no other text.

### Format B: `@openuidev/lang`

System prompt instructs the model to output in the line-oriented assignment syntax. Each line is `identifier = Expression`. Arguments are positional, mapped by Zod key order.

For `@openuidev/lang`, you need to:

1. Convert the Zod schema into component definitions (each nested object becomes a "component" with positional args)
2. Generate a system prompt that describes the syntax rules and component signatures
3. Parse the output back into a structured object for comparison against ground truth

### `@openuidev/lang` syntax rules for the system prompt

```
The output format is a line-oriented assignment syntax. Each line is:

identifier = Expression

Expressions can be:
- Component calls: TypeName(arg1, arg2, ...) — arguments are positional
- Strings: "text"
- Numbers: 42, 3.14, -1
- Booleans: true / false
- Null: null
- Arrays: [a, b, c]
- Objects: {key: value}
- References: identifier (reference to another assignment)

Rules:
- One statement per line
- First statement must assign to "root"
- Arguments map to schema fields by position (order of keys in schema)
- Forward references are allowed (use a name before defining it)
```

### Converting Zod schemas to `@openuidev/lang` component signatures

For each `z.object()` in the schema, create a component signature. The field names become positional arguments in key order.

Example — given this Zod schema:

```typescript
z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
});
```

The component signature is:

```
Address(street: string, city: string, state: string, zipCode: string)
```

And the model outputs:

```
addr = Address("174 Crescent Ridge Drive", "Asheville", "NC", "28801")
```

For arrays of objects, the model outputs multiple assignments and references them:

```
benefits = [b1, b2, b3]
b1 = Benefit("medical", "Medical insurance", 250, null)
b2 = Benefit("dental", "Dental insurance", 35, null)
b3 = Benefit("retirement", "401(k) plan with 4% employer match", null, null)
```

For the root schema, the top-level object becomes the root component.

## Evaluation logic

### Field-level comparison

For each field in the ground truth, check if the extracted value matches.

Matching rules:

- **Strings**: exact match (case-sensitive)
- **Numbers**: exact match
- **Booleans**: exact match
- **Enums**: exact match
- **Arrays of primitives**: order-sensitive exact match
- **Arrays of objects**: match by position (index 0 to 0, index 1 to 1, etc.)
- **Nested objects**: recursively compare each field
- **Optional fields**: if ground truth has the field, extracted must have it. If ground truth doesn't have it (undefined), extracted having it is acceptable (not penalized). Extracted having null/undefined when ground truth has a value IS an error.

### Metrics to compute

Per document per format (across 5 runs):

- Mean field-level accuracy
- Complete accuracy rate (X out of 5 runs fully correct)
- List of fields that failed in any run with failure count

Overall (across all documents):

- Mean field-level accuracy per format
- Mean complete accuracy per format
- Total field errors per format

## Report output

Generate a comprehensive markdown report (`report.md`) with the following sections:

### 1. Executive Summary

A short paragraph summarizing the overall findings: which format performed better, by how much, and whether the gap widened with complexity.

### 2. Overall Results Table

Aggregated across all documents:

```
| Metric                          | JSON     | `@openuidev/lang` |
|---------------------------------|----------|----------|
| Mean field-level accuracy       | X%       | X%       |
| Mean complete accuracy rate     | X/5      | X/5      |
| Total fields evaluated          | N        | N        |
| Total field errors              | N        | N        |
| Total parse/syntax failures     | N        | N        |
```

### 3. Per-Document Summary Table

```
| Document          | Fields | JSON Accuracy | JSON Complete | `@openuidev/lang` Accuracy | `@openuidev/lang` Complete |
|-------------------|--------|---------------|---------------|-------------------|-------------------|
| Real Estate       | 22     | X%            | X/5           | X%                | X/5               |
| Job Posting       | 38     | X%            | X/5           | X%                | X/5               |
| Service Agreement | 55     | X%            | X/5           | X%                | X/5               |
| Earnings Report   | 75     | X%            | X/5           | X%                | X/5               |
| System Arch       | 120    | X%            | X/5           | X%                | X/5               |
```

(Numbers above are illustrative, not expected results.)

### 4. Accuracy vs Complexity Analysis

Show how accuracy changes as schema complexity increases:

```
| Fields | JSON Accuracy | `@openuidev/lang` Accuracy | Delta |
|--------|---------------|-------------------|-------|
| 22     | X%            | X%                | +X%   |
| 38     | X%            | X%                | +X%   |
| 55     | X%            | X%                | +X%   |
| 75     | X%            | X%                | +X%   |
| 120    | X%            | X%                | +X%   |
```

Add a note on whether the delta grows with complexity (the key hypothesis).

### 5. Per-Document Detailed Breakdown

For each of the 5 documents, include:

#### a. Run-by-run results

```
| Run | JSON Fields Correct | JSON Accuracy | `@openuidev/lang` Fields Correct | `@openuidev/lang` Accuracy |
|-----|---------------------|---------------|-------------------------|--------------------|
| 1   | 21/22               | 95.5%         | 22/22                   | 100%               |
| 2   | 22/22               | 100%          | 22/22                   | 100%               |
| ...
```

#### b. Field error inventory

For each field that had at least one error across any run or format:

```
| Field Path                        | JSON Errors (out of 5) | `@openuidev/lang` Errors (out of 5) | Common Error |
|-----------------------------------|------------------------|----------------------------|--------------|
| benefits[2].monthlyEmployeeCost   | 3                      | 0                          | null instead of 35 |
| phases[2].feeCap                  | 2                      | 1                          | Missing field |
| ...
```

#### c. Error details

For each error, log:

- Run number
- Format
- Field path (dot notation, e.g., `provider.address.zipCode`)
- Expected value
- Actual value
- Error type: `wrong_value`, `missing_field`, `extra_field`, `wrong_type`, `null_instead_of_value`

### 6. Consistency Analysis

Across the 5 runs at temperature 0, measure how consistent each format is:

```
| Document          | JSON: Identical Runs | `@openuidev/lang`: Identical Runs |
|-------------------|----------------------|--------------------------|
| Real Estate       | 5/5                  | 5/5                      |
| Job Posting       | 3/5                  | 5/5                      |
| ...
```

"Identical Runs" means all 5 runs produced exactly the same output (not just correct — identical). This tests determinism. If temperature is 0 and runs differ, that's worth flagging.

### 7. Token Usage

For each document per format, report the output token count from the API response:

```
| Document          | JSON Tokens (mean) | `@openuidev/lang` Tokens (mean) | Reduction |
|-------------------|--------------------|------------------------|-----------|
| Real Estate       | X                  | X                      | X%        |
| Job Posting       | X                  | X                      | X%        |
| ...
```

This validates the token efficiency claim alongside the accuracy data.

### 8. Parse Failures

If any run produces output that cannot be parsed at all (invalid JSON or invalid `@openuidev/lang` syntax), log it separately:

```
| Document          | Format   | Run | Error Type          | Raw output snippet (first 200 chars) |
|-------------------|----------|-----|---------------------|--------------------------------------|
| System Arch       | JSON     | 3   | Unexpected token    | {"document":{"id":"ARCH-...          |
| ...
```

If there are no parse failures, state that explicitly.

### 9. Raw Data

Save all raw model outputs to `results/` with naming convention:

```
results/{document}-{format}-run{N}.txt
```

e.g., `results/real-estate-json-run1.txt`, `results/system-arch-format-run3.txt`

The report should reference this directory for full reproducibility.

## Test documents

The 5 test documents (source text, Zod schema, ground truth) are provided in separate files. Read them and implement the schemas, source texts, and ground truth in the benchmark code.
