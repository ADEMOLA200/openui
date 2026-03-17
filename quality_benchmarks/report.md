# Structured Output Format Benchmark Report

**Run date:** 2026-03-16
**Models:** gpt-4o (temperature=0)
**Documents:** 1 | **Formats:** JSON, Lang | **Runs per combo:** 5
**Total API calls:** 10

## 1. Executive Summary

| Model | JSON Acc | Lang Acc | JSON Parse Fails | Lang Parse Fails | JSON Completion Tokens | Lang Completion Tokens |
|-------|----------|----------|-----------------|-----------------|----------------------|----------------------|
| gpt-4o | 100.0% | 99.7% | 0/5 | 0/5 | 1680 | 1178 |

## 2. Accuracy by Model × Document

### gpt-4o

| Doc | Fields | JSON Acc | Lang Acc | JSON Fails | Lang Fails |
|-----|--------|----------|----------|-----------|-----------|
| System Architecture | 112 | 100.0% | 99.7% | 0/5 | 0/5 |

## 3. Format Comparison (JSON vs Lang) per Model

| Model | Doc | JSON Acc | Lang Acc | Delta (Lang-JSON) | JSON Tokens | Lang Tokens |
|-------|-----|----------|----------|------------------|------------|------------|
| gpt-4o | System Architecture | 100.0% | 99.7% | -0.3% | 1680 | 1178 |

## 4. Per-Document Detailed Breakdown

### Model: gpt-4o

#### System Architecture (`system-architecture`)
**Fields:** 112

##### Format: JSON

| Run | Accuracy | Correct/Total | Parse Error |
|-----|----------|--------------|-------------|
| 1 | 100.0% | 148/148 | — |
| 2 | 100.0% | 148/148 | — |
| 3 | 100.0% | 148/148 | — |
| 4 | 100.0% | 148/148 | — |
| 5 | 100.0% | 148/148 | — |

_No field errors across all runs._

##### Format: LANG

| Run | Accuracy | Correct/Total | Parse Error |
|-----|----------|--------------|-------------|
| 1 | 99.3% | 147/148 | — |
| 2 | 99.3% | 147/148 | — |
| 3 | 100.0% | 148/148 | — |
| 4 | 100.0% | 148/148 | — |
| 5 | 100.0% | 148/148 | — |

**Top field errors (across 5 runs):**

| Field Path | Error Count | Error Type (last) |
|-----------|------------|------------------|
| `services[0].producesTopics[0]` | 2/5 | missing_field |

## 5. Consistency Analysis (Identical Runs at Temperature=0)

| Model | Doc | JSON Identical | Lang Identical |
|-------|-----|---------------|---------------|
| gpt-4o | System Architecture | ✗ Differences found | ✗ Differences found |

## 6. Token Usage

| Model | Doc | JSON Prompt | JSON Completion | Lang Prompt | Lang Completion | Completion Δ |
|-------|-----|------------|----------------|------------|----------------|-------------|
| gpt-4o | System Architecture | 3309 | 1680 | 2340 | 1178 | -502 |

## 7. Parse Failures

_No parse failures across all runs._

## 8. Raw Data Reference

Raw LLM outputs saved to `results/` directory (`{model}-{doc}-{format}-run{n}.txt`):

- `results/gpt-4o-system-architecture-json-run1.txt`
- `results/gpt-4o-system-architecture-json-run2.txt`
- `results/gpt-4o-system-architecture-json-run3.txt`
- `results/gpt-4o-system-architecture-json-run4.txt`
- `results/gpt-4o-system-architecture-json-run5.txt`
- `results/gpt-4o-system-architecture-lang-run1.txt`
- `results/gpt-4o-system-architecture-lang-run2.txt`
- `results/gpt-4o-system-architecture-lang-run3.txt`
- `results/gpt-4o-system-architecture-lang-run4.txt`
- `results/gpt-4o-system-architecture-lang-run5.txt`
