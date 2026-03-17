# Structured Output Format Benchmark Report

**Run date:** 2026-03-16
**Models:** gpt-5-mini (temperature=0 (except: gpt-5-mini use default))
**Documents:** 1 | **Formats:** JSON, Lang | **Runs per combo:** 5
**Total API calls:** 10

## 1. Executive Summary

| Model | JSON Acc | Lang Acc | JSON Parse Fails | Lang Parse Fails | JSON Completion Tokens | Lang Completion Tokens |
|-------|----------|----------|-----------------|-----------------|----------------------|----------------------|
| gpt-5-mini | 97.2% | 94.9% | 0/5 | 0/5 | 1717 | 1365 |

## 2. Accuracy by Model × Document

### gpt-5-mini (reasoning_effort=minimal)

| Doc | Fields | JSON Acc | Lang Acc | JSON Fails | Lang Fails |
|-----|--------|----------|----------|-----------|-----------|
| System Architecture | 112 | 97.2% | 94.9% | 0/5 | 0/5 |

## 3. Format Comparison (JSON vs Lang) per Model

| Model | Doc | JSON Acc | Lang Acc | Delta (Lang-JSON) | JSON Tokens | Lang Tokens |
|-------|-----|----------|----------|------------------|------------|------------|
| gpt-5-mini | System Architecture | 97.2% | 94.9% | -2.3% | 1717 | 1365 |

## 4. Per-Document Detailed Breakdown

### Model: gpt-5-mini

#### System Architecture (`system-architecture`)
**Fields:** 112

##### Format: JSON

| Run | Accuracy | Correct/Total | Parse Error |
|-----|----------|--------------|-------------|
| 1 | 94.6% | 140/148 | — |
| 2 | 99.3% | 147/148 | — |
| 3 | 98.0% | 145/148 | — |
| 4 | 94.6% | 140/148 | — |
| 5 | 99.3% | 147/148 | — |

**Top field errors (across 5 runs):**

| Field Path | Error Count | Error Type (last) |
|-----------|------------|------------------|
| `services[3].language` | 5/5 | wrong_value |
| `services[4].dependencies[0].name` | 3/5 | wrong_value |
| `services[1].dependencies[0].name` | 2/5 | wrong_value |
| `services[1].dependencies[1].name` | 2/5 | wrong_value |
| `services[2].dependencies[0].name` | 2/5 | wrong_value |
| `services[2].dependencies[1].name` | 2/5 | wrong_value |
| `services[3].dependencies[0].name` | 2/5 | wrong_value |
| `services[3].dependencies[1].name` | 2/5 | wrong_value |
| `project.name` | 1/5 | wrong_value |

##### Format: LANG

| Run | Accuracy | Correct/Total | Parse Error |
|-----|----------|--------------|-------------|
| 1 | 95.3% | 141/148 | — |
| 2 | 94.6% | 140/148 | — |
| 3 | 94.6% | 140/148 | — |
| 4 | 95.3% | 141/148 | — |
| 5 | 94.6% | 140/148 | — |

**Top field errors (across 5 runs):**

| Field Path | Error Count | Error Type (last) |
|-----------|------------|------------------|
| `services[1].dependencies[0].name` | 5/5 | wrong_value |
| `services[1].dependencies[1].name` | 5/5 | wrong_value |
| `services[2].dependencies[0].name` | 5/5 | wrong_value |
| `services[2].dependencies[1].name` | 5/5 | wrong_value |
| `services[3].dependencies[0].name` | 5/5 | wrong_value |
| `services[3].dependencies[1].name` | 5/5 | wrong_value |
| `services[4].dependencies[0].name` | 5/5 | wrong_value |
| `services[3].language` | 3/5 | wrong_value |

## 5. Consistency Analysis (Identical Runs at Temperature=0)

| Model | Doc | JSON Identical | Lang Identical |
|-------|-----|---------------|---------------|
| gpt-5-mini | System Architecture | ✗ Differences found | ✗ Differences found |

## 6. Token Usage

| Model | Doc | JSON Prompt | JSON Completion | Lang Prompt | Lang Completion | Completion Δ |
|-------|-----|------------|----------------|------------|----------------|-------------|
| gpt-5-mini | System Architecture | 3308 | 1717 | 2350 | 1365 | -352 |

## 7. Parse Failures

_No parse failures across all runs._

## 8. Raw Data Reference

Raw LLM outputs saved to `test-future/results/` directory (`{model}-{doc}-{format}-run{n}.txt`):

- `test-future/results/gpt-5-mini-system-architecture-json-run1.txt`
- `test-future/results/gpt-5-mini-system-architecture-json-run2.txt`
- `test-future/results/gpt-5-mini-system-architecture-json-run3.txt`
- `test-future/results/gpt-5-mini-system-architecture-json-run4.txt`
- `test-future/results/gpt-5-mini-system-architecture-json-run5.txt`
- `test-future/results/gpt-5-mini-system-architecture-lang-run1.txt`
- `test-future/results/gpt-5-mini-system-architecture-lang-run2.txt`
- `test-future/results/gpt-5-mini-system-architecture-lang-run3.txt`
- `test-future/results/gpt-5-mini-system-architecture-lang-run4.txt`
- `test-future/results/gpt-5-mini-system-architecture-lang-run5.txt`
