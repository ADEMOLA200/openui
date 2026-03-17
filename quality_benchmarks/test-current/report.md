# Structured Output Format Benchmark Report

**Run date:** 2026-03-17
**Models:** gpt-5.4, gpt-4o, gpt-5-mini (temperature=0 (except: gpt-5-mini use default))
**Documents:** 5 | **Formats:** JSON, Lang | **Runs per combo:** 5
**Total API calls:** 150
**Total run time:** 1016.2s

## Summary

| Model | Doc | JSON Acc | Lang Acc | JSON Prompt | JSON Completion | Lang Prompt | Lang Completion |
|-------|-----|----------|----------|------------|----------------|------------|----------------|
| gpt-5.4 | Real Estate Listing | 100.0% | 100.0% | 1030 | 192 | 995 | 151 |
| gpt-5.4 | Job Posting | 100.0% | 100.0% | 1371 | 264 | 1175 | 303 |
| gpt-5.4 | Service Agreement | 100.0% | 100.0% | 2293 | 431 | 1700 | 411 |
| gpt-5.4 | Earnings Report | 100.0% | 100.0% | 3156 | 685 | 2167 | 502 |
| gpt-5.4 | System Architecture | 99.1% | 99.3% | 3323 | 1005 | 2354 | 1097 |
| gpt-4o | Real Estate Listing | 100.0% | 100.0% | 1031 | 270 | 996 | 149 |
| gpt-4o | Job Posting | 100.0% | 100.0% | 1372 | 432 | 1176 | 259 |
| gpt-4o | Service Agreement | 96.9% | 100.0% | 2294 | 665 | 1701 | 403 |
| gpt-4o | Earnings Report | 100.0% | 100.0% | 3157 | 1010 | 2168 | 492 |
| gpt-4o | System Architecture | 100.0% | 99.6% | 3324 | 1682 | 2355 | 1174 |
| gpt-5-mini | Real Estate Listing | 100.0% | 100.0% | 1030 | 279 | 995 | 160 |
| gpt-5-mini | Job Posting | 100.0% | 100.0% | 1371 | 441 | 1175 | 316 |
| gpt-5-mini | Service Agreement | 99.3% | 97.9% | 2293 | 688 | 1700 | 419 |
| gpt-5-mini | Earnings Report | 99.3% | 98.8% | 3156 | 1011 | 2167 | 510 |
| gpt-5-mini | System Architecture | 99.5% | 96.6% | 3323 | 1700 | 2354 | 1095 |

## Results

| Model | Doc | Format | Run | Accuracy | Correct/Total | Prompt Tokens | Completion Tokens | Parse Error |
|-------|-----|--------|-----|----------|--------------|--------------|------------------|-------------|
| gpt-5.4 | Real Estate Listing | json | 1 | 100.0% | 24/24 | 1030 | 192 | — |
| gpt-5.4 | Real Estate Listing | json | 2 | 100.0% | 24/24 | 1030 | 192 | — |
| gpt-5.4 | Real Estate Listing | json | 3 | 100.0% | 24/24 | 1030 | 192 | — |
| gpt-5.4 | Real Estate Listing | json | 4 | 100.0% | 24/24 | 1030 | 192 | — |
| gpt-5.4 | Real Estate Listing | json | 5 | 100.0% | 24/24 | 1030 | 192 | — |
| | | | **avg** | **100.0%** | | **1030** | **192** | — |
| gpt-5.4 | Real Estate Listing | lang | 1 | 100.0% | 24/24 | 995 | 152 | — |
| gpt-5.4 | Real Estate Listing | lang | 2 | 100.0% | 24/24 | 995 | 152 | — |
| gpt-5.4 | Real Estate Listing | lang | 3 | 100.0% | 24/24 | 995 | 150 | — |
| gpt-5.4 | Real Estate Listing | lang | 4 | 100.0% | 24/24 | 995 | 150 | — |
| gpt-5.4 | Real Estate Listing | lang | 5 | 100.0% | 24/24 | 995 | 152 | — |
| | | | **avg** | **100.0%** | | **995** | **151** | — |
| gpt-5.4 | Job Posting | json | 1 | 100.0% | 41/41 | 1371 | 264 | — |
| gpt-5.4 | Job Posting | json | 2 | 100.0% | 41/41 | 1371 | 264 | — |
| gpt-5.4 | Job Posting | json | 3 | 100.0% | 41/41 | 1371 | 264 | — |
| gpt-5.4 | Job Posting | json | 4 | 100.0% | 41/41 | 1371 | 264 | — |
| gpt-5.4 | Job Posting | json | 5 | 100.0% | 41/41 | 1371 | 264 | — |
| | | | **avg** | **100.0%** | | **1371** | **264** | — |
| gpt-5.4 | Job Posting | lang | 1 | 100.0% | 41/41 | 1175 | 305 | — |
| gpt-5.4 | Job Posting | lang | 2 | 100.0% | 41/41 | 1175 | 305 | — |
| gpt-5.4 | Job Posting | lang | 3 | 100.0% | 41/41 | 1175 | 305 | — |
| gpt-5.4 | Job Posting | lang | 4 | 100.0% | 41/41 | 1175 | 305 | — |
| gpt-5.4 | Job Posting | lang | 5 | 100.0% | 41/41 | 1175 | 297 | — |
| | | | **avg** | **100.0%** | | **1175** | **303** | — |
| gpt-5.4 | Service Agreement | json | 1 | 100.0% | 57/57 | 2293 | 431 | — |
| gpt-5.4 | Service Agreement | json | 2 | 100.0% | 57/57 | 2293 | 431 | — |
| gpt-5.4 | Service Agreement | json | 3 | 100.0% | 57/57 | 2293 | 431 | — |
| gpt-5.4 | Service Agreement | json | 4 | 100.0% | 57/57 | 2293 | 431 | — |
| gpt-5.4 | Service Agreement | json | 5 | 100.0% | 57/57 | 2293 | 431 | — |
| | | | **avg** | **100.0%** | | **2293** | **431** | — |
| gpt-5.4 | Service Agreement | lang | 1 | 100.0% | 57/57 | 1700 | 411 | — |
| gpt-5.4 | Service Agreement | lang | 2 | 100.0% | 57/57 | 1700 | 411 | — |
| gpt-5.4 | Service Agreement | lang | 3 | 100.0% | 57/57 | 1700 | 411 | — |
| gpt-5.4 | Service Agreement | lang | 4 | 100.0% | 57/57 | 1700 | 411 | — |
| gpt-5.4 | Service Agreement | lang | 5 | 100.0% | 57/57 | 1700 | 411 | — |
| | | | **avg** | **100.0%** | | **1700** | **411** | — |
| gpt-5.4 | Earnings Report | json | 1 | 100.0% | 83/83 | 3156 | 685 | — |
| gpt-5.4 | Earnings Report | json | 2 | 100.0% | 83/83 | 3156 | 685 | — |
| gpt-5.4 | Earnings Report | json | 3 | 100.0% | 83/83 | 3156 | 685 | — |
| gpt-5.4 | Earnings Report | json | 4 | 100.0% | 83/83 | 3156 | 685 | — |
| gpt-5.4 | Earnings Report | json | 5 | 100.0% | 83/83 | 3156 | 685 | — |
| | | | **avg** | **100.0%** | | **3156** | **685** | — |
| gpt-5.4 | Earnings Report | lang | 1 | 100.0% | 83/83 | 2167 | 500 | — |
| gpt-5.4 | Earnings Report | lang | 2 | 100.0% | 83/83 | 2167 | 511 | — |
| gpt-5.4 | Earnings Report | lang | 3 | 100.0% | 83/83 | 2167 | 500 | — |
| gpt-5.4 | Earnings Report | lang | 4 | 100.0% | 83/83 | 2167 | 500 | — |
| gpt-5.4 | Earnings Report | lang | 5 | 100.0% | 83/83 | 2167 | 500 | — |
| | | | **avg** | **100.0%** | | **2167** | **502** | — |
| gpt-5.4 | System Architecture | json | 1 | 98.0% | 145/148 | 3323 | 1002 | — |
| gpt-5.4 | System Architecture | json | 2 | 99.3% | 147/148 | 3323 | 992 | — |
| gpt-5.4 | System Architecture | json | 3 | 99.3% | 147/148 | 3323 | 1014 | — |
| gpt-5.4 | System Architecture | json | 4 | 99.3% | 147/148 | 3323 | 992 | — |
| gpt-5.4 | System Architecture | json | 5 | 99.3% | 147/148 | 3323 | 1026 | — |
| | | | **avg** | **99.1%** | | **3323** | **1005** | — |
| gpt-5.4 | System Architecture | lang | 1 | 99.3% | 147/148 | 2354 | 1140 | — |
| gpt-5.4 | System Architecture | lang | 2 | 99.3% | 147/148 | 2354 | 1063 | — |
| gpt-5.4 | System Architecture | lang | 3 | 99.3% | 147/148 | 2354 | 1048 | — |
| gpt-5.4 | System Architecture | lang | 4 | 99.3% | 147/148 | 2354 | 1063 | — |
| gpt-5.4 | System Architecture | lang | 5 | 99.3% | 147/148 | 2354 | 1171 | — |
| | | | **avg** | **99.3%** | | **2354** | **1097** | — |
| gpt-4o | Real Estate Listing | json | 1 | 100.0% | 24/24 | 1031 | 270 | — |
| gpt-4o | Real Estate Listing | json | 2 | 100.0% | 24/24 | 1031 | 270 | — |
| gpt-4o | Real Estate Listing | json | 3 | 100.0% | 24/24 | 1031 | 270 | — |
| gpt-4o | Real Estate Listing | json | 4 | 100.0% | 24/24 | 1031 | 270 | — |
| gpt-4o | Real Estate Listing | json | 5 | 100.0% | 24/24 | 1031 | 270 | — |
| | | | **avg** | **100.0%** | | **1031** | **270** | — |
| gpt-4o | Real Estate Listing | lang | 1 | 100.0% | 24/24 | 996 | 149 | — |
| gpt-4o | Real Estate Listing | lang | 2 | 100.0% | 24/24 | 996 | 149 | — |
| gpt-4o | Real Estate Listing | lang | 3 | 100.0% | 24/24 | 996 | 149 | — |
| gpt-4o | Real Estate Listing | lang | 4 | 100.0% | 24/24 | 996 | 149 | — |
| gpt-4o | Real Estate Listing | lang | 5 | 100.0% | 24/24 | 996 | 149 | — |
| | | | **avg** | **100.0%** | | **996** | **149** | — |
| gpt-4o | Job Posting | json | 1 | 100.0% | 41/41 | 1372 | 432 | — |
| gpt-4o | Job Posting | json | 2 | 100.0% | 41/41 | 1372 | 432 | — |
| gpt-4o | Job Posting | json | 3 | 100.0% | 41/41 | 1372 | 432 | — |
| gpt-4o | Job Posting | json | 4 | 100.0% | 41/41 | 1372 | 432 | — |
| gpt-4o | Job Posting | json | 5 | 100.0% | 41/41 | 1372 | 432 | — |
| | | | **avg** | **100.0%** | | **1372** | **432** | — |
| gpt-4o | Job Posting | lang | 1 | 100.0% | 41/41 | 1176 | 260 | — |
| gpt-4o | Job Posting | lang | 2 | 100.0% | 41/41 | 1176 | 257 | — |
| gpt-4o | Job Posting | lang | 3 | 100.0% | 41/41 | 1176 | 260 | — |
| gpt-4o | Job Posting | lang | 4 | 100.0% | 41/41 | 1176 | 257 | — |
| gpt-4o | Job Posting | lang | 5 | 100.0% | 41/41 | 1176 | 260 | — |
| | | | **avg** | **100.0%** | | **1176** | **259** | — |
| gpt-4o | Service Agreement | json | 1 | 94.7% | 54/57 | 2294 | 671 | `Validation errors` |
| gpt-4o | Service Agreement | json | 2 | 100.0% | 57/57 | 2294 | 660 | — |
| gpt-4o | Service Agreement | json | 3 | 100.0% | 57/57 | 2294 | 660 | — |
| gpt-4o | Service Agreement | json | 4 | — | — | 2294 | 663 | `JSON parse error: Expected double-quoted property name in JS` |
| gpt-4o | Service Agreement | json | 5 | 93.0% | 53/57 | 2294 | 672 | `Validation errors` |
| | | | **avg** | **96.9%** | | **2294** | **665** | 1 failures |
| gpt-4o | Service Agreement | lang | 1 | 100.0% | 57/57 | 1701 | 413 | — |
| gpt-4o | Service Agreement | lang | 2 | 100.0% | 57/57 | 1701 | 416 | — |
| gpt-4o | Service Agreement | lang | 3 | 100.0% | 57/57 | 1701 | 395 | — |
| gpt-4o | Service Agreement | lang | 4 | 100.0% | 57/57 | 1701 | 395 | — |
| gpt-4o | Service Agreement | lang | 5 | 100.0% | 57/57 | 1701 | 395 | — |
| | | | **avg** | **100.0%** | | **1701** | **403** | — |
| gpt-4o | Earnings Report | json | 1 | 100.0% | 83/83 | 3157 | 1010 | — |
| gpt-4o | Earnings Report | json | 2 | 100.0% | 83/83 | 3157 | 1010 | — |
| gpt-4o | Earnings Report | json | 3 | 100.0% | 83/83 | 3157 | 1010 | — |
| gpt-4o | Earnings Report | json | 4 | 100.0% | 83/83 | 3157 | 1010 | — |
| gpt-4o | Earnings Report | json | 5 | 100.0% | 83/83 | 3157 | 1010 | — |
| | | | **avg** | **100.0%** | | **3157** | **1010** | — |
| gpt-4o | Earnings Report | lang | 1 | 100.0% | 83/83 | 2168 | 487 | — |
| gpt-4o | Earnings Report | lang | 2 | 100.0% | 83/83 | 2168 | 487 | — |
| gpt-4o | Earnings Report | lang | 3 | 100.0% | 83/83 | 2168 | 487 | — |
| gpt-4o | Earnings Report | lang | 4 | 100.0% | 83/83 | 2168 | 514 | — |
| gpt-4o | Earnings Report | lang | 5 | 100.0% | 83/83 | 2168 | 487 | — |
| | | | **avg** | **100.0%** | | **2168** | **492** | — |
| gpt-4o | System Architecture | json | 1 | 100.0% | 148/148 | 3324 | 1690 | — |
| gpt-4o | System Architecture | json | 2 | 100.0% | 148/148 | 3324 | 1671 | — |
| gpt-4o | System Architecture | json | 3 | 100.0% | 148/148 | 3324 | 1690 | — |
| gpt-4o | System Architecture | json | 4 | 100.0% | 148/148 | 3324 | 1690 | — |
| gpt-4o | System Architecture | json | 5 | 100.0% | 148/148 | 3324 | 1671 | — |
| | | | **avg** | **100.0%** | | **3324** | **1682** | — |
| gpt-4o | System Architecture | lang | 1 | 98.0% | 145/148 | 2355 | 1168 | — |
| gpt-4o | System Architecture | lang | 2 | 100.0% | 148/148 | 2355 | 1174 | — |
| gpt-4o | System Architecture | lang | 3 | 100.0% | 148/148 | 2355 | 1179 | — |
| gpt-4o | System Architecture | lang | 4 | 100.0% | 148/148 | 2355 | 1174 | — |
| gpt-4o | System Architecture | lang | 5 | 100.0% | 148/148 | 2355 | 1175 | — |
| | | | **avg** | **99.6%** | | **2355** | **1174** | — |
| gpt-5-mini | Real Estate Listing | json | 1 | 100.0% | 24/24 | 1030 | 279 | — |
| gpt-5-mini | Real Estate Listing | json | 2 | 100.0% | 24/24 | 1030 | 279 | — |
| gpt-5-mini | Real Estate Listing | json | 3 | 100.0% | 24/24 | 1030 | 279 | — |
| gpt-5-mini | Real Estate Listing | json | 4 | 100.0% | 24/24 | 1030 | 279 | — |
| gpt-5-mini | Real Estate Listing | json | 5 | 100.0% | 24/24 | 1030 | 279 | — |
| | | | **avg** | **100.0%** | | **1030** | **279** | — |
| gpt-5-mini | Real Estate Listing | lang | 1 | 100.0% | 24/24 | 995 | 158 | — |
| gpt-5-mini | Real Estate Listing | lang | 2 | 100.0% | 24/24 | 995 | 162 | — |
| gpt-5-mini | Real Estate Listing | lang | 3 | 100.0% | 24/24 | 995 | 158 | — |
| gpt-5-mini | Real Estate Listing | lang | 4 | 100.0% | 24/24 | 995 | 158 | — |
| gpt-5-mini | Real Estate Listing | lang | 5 | 100.0% | 24/24 | 995 | 162 | — |
| | | | **avg** | **100.0%** | | **995** | **160** | — |
| gpt-5-mini | Job Posting | json | 1 | 100.0% | 41/41 | 1371 | 441 | — |
| gpt-5-mini | Job Posting | json | 2 | 100.0% | 41/41 | 1371 | 441 | — |
| gpt-5-mini | Job Posting | json | 3 | 100.0% | 41/41 | 1371 | 441 | — |
| gpt-5-mini | Job Posting | json | 4 | 100.0% | 41/41 | 1371 | 441 | — |
| gpt-5-mini | Job Posting | json | 5 | 100.0% | 41/41 | 1371 | 441 | — |
| | | | **avg** | **100.0%** | | **1371** | **441** | — |
| gpt-5-mini | Job Posting | lang | 1 | 100.0% | 41/41 | 1175 | 312 | — |
| gpt-5-mini | Job Posting | lang | 2 | 100.0% | 41/41 | 1175 | 312 | — |
| gpt-5-mini | Job Posting | lang | 3 | 100.0% | 41/41 | 1175 | 312 | — |
| gpt-5-mini | Job Posting | lang | 4 | 100.0% | 41/41 | 1175 | 312 | — |
| gpt-5-mini | Job Posting | lang | 5 | 100.0% | 41/41 | 1175 | 330 | — |
| | | | **avg** | **100.0%** | | **1175** | **316** | — |
| gpt-5-mini | Service Agreement | json | 1 | 100.0% | 57/57 | 2293 | 688 | — |
| gpt-5-mini | Service Agreement | json | 2 | 96.5% | 55/57 | 2293 | 686 | — |
| gpt-5-mini | Service Agreement | json | 3 | 100.0% | 57/57 | 2293 | 688 | — |
| gpt-5-mini | Service Agreement | json | 4 | 100.0% | 57/57 | 2293 | 688 | — |
| gpt-5-mini | Service Agreement | json | 5 | 100.0% | 57/57 | 2293 | 688 | — |
| | | | **avg** | **99.3%** | | **2293** | **688** | — |
| gpt-5-mini | Service Agreement | lang | 1 | 96.5% | 55/57 | 1700 | 420 | — |
| gpt-5-mini | Service Agreement | lang | 2 | 100.0% | 57/57 | 1700 | 417 | — |
| gpt-5-mini | Service Agreement | lang | 3 | 98.2% | 56/57 | 1700 | 423 | — |
| gpt-5-mini | Service Agreement | lang | 4 | 98.2% | 56/57 | 1700 | 418 | — |
| gpt-5-mini | Service Agreement | lang | 5 | 96.5% | 55/57 | 1700 | 415 | — |
| | | | **avg** | **97.9%** | | **1700** | **419** | — |
| gpt-5-mini | Earnings Report | json | 1 | 98.8% | 82/83 | 3156 | 1012 | — |
| gpt-5-mini | Earnings Report | json | 2 | 98.8% | 82/83 | 3156 | 1012 | — |
| gpt-5-mini | Earnings Report | json | 3 | 100.0% | 83/83 | 3156 | 1009 | — |
| gpt-5-mini | Earnings Report | json | 4 | 98.8% | 82/83 | 3156 | 1012 | — |
| gpt-5-mini | Earnings Report | json | 5 | 100.0% | 83/83 | 3156 | 1009 | — |
| | | | **avg** | **99.3%** | | **3156** | **1011** | — |
| gpt-5-mini | Earnings Report | lang | 1 | 98.8% | 82/83 | 2167 | 508 | — |
| gpt-5-mini | Earnings Report | lang | 2 | 98.8% | 82/83 | 2167 | 513 | — |
| gpt-5-mini | Earnings Report | lang | 3 | 98.8% | 82/83 | 2167 | 512 | — |
| gpt-5-mini | Earnings Report | lang | 4 | 98.8% | 82/83 | 2167 | 506 | — |
| gpt-5-mini | Earnings Report | lang | 5 | 98.8% | 82/83 | 2167 | 513 | — |
| | | | **avg** | **98.8%** | | **2167** | **510** | — |
| gpt-5-mini | System Architecture | json | 1 | 99.3% | 147/148 | 3323 | 1721 | — |
| gpt-5-mini | System Architecture | json | 2 | 100.0% | 148/148 | 3323 | 1688 | — |
| gpt-5-mini | System Architecture | json | 3 | 99.3% | 147/148 | 3323 | 1681 | — |
| gpt-5-mini | System Architecture | json | 4 | 99.3% | 147/148 | 3323 | 1728 | — |
| gpt-5-mini | System Architecture | json | 5 | 99.3% | 147/148 | 3323 | 1681 | — |
| | | | **avg** | **99.5%** | | **3323** | **1700** | — |
| gpt-5-mini | System Architecture | lang | 1 | 94.6% | 140/148 | 2354 | 1132 | — |
| gpt-5-mini | System Architecture | lang | 2 | 94.6% | 140/148 | 2354 | 1097 | — |
| gpt-5-mini | System Architecture | lang | 3 | 97.3% | 144/148 | 2354 | 1078 | — |
| gpt-5-mini | System Architecture | lang | 4 | 97.3% | 144/148 | 2354 | 1068 | — |
| gpt-5-mini | System Architecture | lang | 5 | 99.3% | 147/148 | 2354 | 1098 | — |
| | | | **avg** | **96.6%** | | **2354** | **1095** | — |

_Raw outputs saved to `test-current/results/` — `{model}-{doc}-{format}-run{n}.txt`_
