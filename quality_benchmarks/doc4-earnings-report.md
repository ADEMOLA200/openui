# Document 4: Quarterly Earnings Report

## Domain: Finance
## Schema Complexity: ~65 fields, deep nesting, multiple segments with parallel metrics

---

## Source Text

VANTAGE MATERIALS CORPORATION — FOURTH QUARTER AND FULL YEAR 2025 EARNINGS REPORT

Vantage Materials Corporation (NASDAQ: VTGM) reported its financial results for the fourth quarter and fiscal year ending December 31, 2025. The report was filed on February 6, 2026. The company's fiscal year runs from January 1 to December 31.

CONSOLIDATED RESULTS — FOURTH QUARTER 2025

Total revenue for Q4 2025 was $1,284 million, compared to $1,157 million in Q4 2024, representing a year-over-year increase of 11.0%. Cost of goods sold was $743 million, yielding a gross profit of $541 million and a gross margin of 42.1%. Operating expenses totaled $312 million, broken down as follows: research and development $124 million, selling and marketing $108 million, and general and administrative $80 million. Operating income was $229 million, resulting in an operating margin of 17.8%. Net income for the quarter was $168 million, or $2.14 per diluted share, based on 78.5 million weighted average diluted shares outstanding. The effective tax rate for the quarter was 22.3%.

CONSOLIDATED RESULTS — FULL YEAR 2025

Full year revenue was $4,891 million, compared to $4,420 million in fiscal 2024, a year-over-year increase of 10.7%. Full year cost of goods sold was $2,836 million, yielding a gross profit of $2,055 million and a gross margin of 42.0%. Full year operating expenses totaled $1,183 million: research and development $469 million, selling and marketing $411 million, and general and administrative $303 million. Full year operating income was $872 million with an operating margin of 17.8%. Full year net income was $641 million, or $8.17 per diluted share, based on 78.5 million weighted average diluted shares. The full year effective tax rate was 22.1%.

SEGMENT RESULTS — FOURTH QUARTER 2025

The company reports results in three operating segments.

Advanced Polymers: Q4 revenue was $586 million, up from $521 million in Q4 2024, a year-over-year increase of 12.5%. Segment operating income was $117 million with a segment operating margin of 20.0%. The segment employed 4,820 people as of December 31, 2025. Capital expenditures for Q4 were $38 million.

Specialty Coatings: Q4 revenue was $412 million, up from $384 million in Q4 2024, a year-over-year increase of 7.3%. Segment operating income was $66 million with a segment operating margin of 16.0%. The segment employed 3,150 people as of December 31, 2025. Capital expenditures for Q4 were $22 million.

Industrial Films: Q4 revenue was $286 million, up from $252 million in Q4 2024, a year-over-year increase of 13.5%. Segment operating income was $46 million with a segment operating margin of 16.1%. The segment employed 2,470 people as of December 31, 2025. Capital expenditures for Q4 were $17 million.

BALANCE SHEET AND CASH FLOW

As of December 31, 2025, total cash and cash equivalents were $892 million. Total debt was $1,340 million, consisting of $540 million in short-term borrowings and $800 million in long-term debt. Accounts receivable stood at $674 million, and inventory was $531 million.

Operating cash flow for Q4 2025 was $287 million. Capital expenditures for Q4 were $77 million. Free cash flow for Q4 was $210 million.

GUIDANCE

For Q1 2026, the company expects revenue in the range of $1,310 million to $1,360 million and diluted earnings per share of $2.20 to $2.35. For full year 2026, the company expects revenue in the range of $5,250 million to $5,450 million and diluted earnings per share of $8.80 to $9.20. The full year 2026 guidance assumes an effective tax rate of 22.0% and capital expenditures of $340 million to $370 million.

---

## Schema

```typescript
const EarningsReportSchema = z.object({
  company: z.object({
    name: z.string(),
    ticker: z.string(),
    exchange: z.string(),
    fiscalYearEnd: z.string().describe("Month and day: MM-DD"),
  }),
  reportDate: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
  reportingPeriod: z.object({
    quarter: z.number(),
    year: z.number(),
  }),
  quarterlyResults: z.object({
    revenueMln: z.number(),
    priorYearRevenueMln: z.number(),
    revenueGrowthPercent: z.number(),
    cogsMln: z.number(),
    grossProfitMln: z.number(),
    grossMarginPercent: z.number(),
    operatingExpenses: z.object({
      totalMln: z.number(),
      rdMln: z.number(),
      salesMarketingMln: z.number(),
      gaMln: z.number(),
    }),
    operatingIncomeMln: z.number(),
    operatingMarginPercent: z.number(),
    netIncomeMln: z.number(),
    dilutedEps: z.number(),
    dilutedSharesMln: z.number(),
    effectiveTaxRatePercent: z.number(),
  }),
  fullYearResults: z.object({
    revenueMln: z.number(),
    priorYearRevenueMln: z.number(),
    revenueGrowthPercent: z.number(),
    cogsMln: z.number(),
    grossProfitMln: z.number(),
    grossMarginPercent: z.number(),
    operatingExpenses: z.object({
      totalMln: z.number(),
      rdMln: z.number(),
      salesMarketingMln: z.number(),
      gaMln: z.number(),
    }),
    operatingIncomeMln: z.number(),
    operatingMarginPercent: z.number(),
    netIncomeMln: z.number(),
    dilutedEps: z.number(),
    dilutedSharesMln: z.number(),
    effectiveTaxRatePercent: z.number(),
  }),
  segments: z.array(
    z.object({
      name: z.string(),
      quarterlyRevenueMln: z.number(),
      priorYearQuarterlyRevenueMln: z.number(),
      revenueGrowthPercent: z.number(),
      operatingIncomeMln: z.number(),
      operatingMarginPercent: z.number(),
      headcount: z.number(),
      capexMln: z.number(),
    })
  ),
  balanceSheet: z.object({
    cashMln: z.number(),
    totalDebtMln: z.number(),
    shortTermDebtMln: z.number(),
    longTermDebtMln: z.number(),
    accountsReceivableMln: z.number(),
    inventoryMln: z.number(),
  }),
  cashFlow: z.object({
    operatingCashFlowMln: z.number(),
    capexMln: z.number(),
    freeCashFlowMln: z.number(),
  }),
  guidance: z.object({
    nextQuarter: z.object({
      revenueMinMln: z.number(),
      revenueMaxMln: z.number(),
      epsMin: z.number(),
      epsMax: z.number(),
    }),
    fullYear: z.object({
      revenueMinMln: z.number(),
      revenueMaxMln: z.number(),
      epsMin: z.number(),
      epsMax: z.number(),
      effectiveTaxRatePercent: z.number(),
      capexMinMln: z.number(),
      capexMaxMln: z.number(),
    }),
  }),
});
```

---

## Ground Truth

```json
{
  "company": {
    "name": "Vantage Materials Corporation",
    "ticker": "VTGM",
    "exchange": "NASDAQ",
    "fiscalYearEnd": "12-31"
  },
  "reportDate": "2026-02-06",
  "reportingPeriod": {
    "quarter": 4,
    "year": 2025
  },
  "quarterlyResults": {
    "revenueMln": 1284,
    "priorYearRevenueMln": 1157,
    "revenueGrowthPercent": 11.0,
    "cogsMln": 743,
    "grossProfitMln": 541,
    "grossMarginPercent": 42.1,
    "operatingExpenses": {
      "totalMln": 312,
      "rdMln": 124,
      "salesMarketingMln": 108,
      "gaMln": 80
    },
    "operatingIncomeMln": 229,
    "operatingMarginPercent": 17.8,
    "netIncomeMln": 168,
    "dilutedEps": 2.14,
    "dilutedSharesMln": 78.5,
    "effectiveTaxRatePercent": 22.3
  },
  "fullYearResults": {
    "revenueMln": 4891,
    "priorYearRevenueMln": 4420,
    "revenueGrowthPercent": 10.7,
    "cogsMln": 2836,
    "grossProfitMln": 2055,
    "grossMarginPercent": 42.0,
    "operatingExpenses": {
      "totalMln": 1183,
      "rdMln": 469,
      "salesMarketingMln": 411,
      "gaMln": 303
    },
    "operatingIncomeMln": 872,
    "operatingMarginPercent": 17.8,
    "netIncomeMln": 641,
    "dilutedEps": 8.17,
    "dilutedSharesMln": 78.5,
    "effectiveTaxRatePercent": 22.1
  },
  "segments": [
    {
      "name": "Advanced Polymers",
      "quarterlyRevenueMln": 586,
      "priorYearQuarterlyRevenueMln": 521,
      "revenueGrowthPercent": 12.5,
      "operatingIncomeMln": 117,
      "operatingMarginPercent": 20.0,
      "headcount": 4820,
      "capexMln": 38
    },
    {
      "name": "Specialty Coatings",
      "quarterlyRevenueMln": 412,
      "priorYearQuarterlyRevenueMln": 384,
      "revenueGrowthPercent": 7.3,
      "operatingIncomeMln": 66,
      "operatingMarginPercent": 16.0,
      "headcount": 3150,
      "capexMln": 22
    },
    {
      "name": "Industrial Films",
      "quarterlyRevenueMln": 286,
      "priorYearQuarterlyRevenueMln": 252,
      "revenueGrowthPercent": 13.5,
      "operatingIncomeMln": 46,
      "operatingMarginPercent": 16.1,
      "headcount": 2470,
      "capexMln": 17
    }
  ],
  "balanceSheet": {
    "cashMln": 892,
    "totalDebtMln": 1340,
    "shortTermDebtMln": 540,
    "longTermDebtMln": 800,
    "accountsReceivableMln": 674,
    "inventoryMln": 531
  },
  "cashFlow": {
    "operatingCashFlowMln": 287,
    "capexMln": 77,
    "freeCashFlowMln": 210
  },
  "guidance": {
    "nextQuarter": {
      "revenueMinMln": 1310,
      "revenueMaxMln": 1360,
      "epsMin": 2.20,
      "epsMax": 2.35
    },
    "fullYear": {
      "revenueMinMln": 5250,
      "revenueMaxMln": 5450,
      "epsMin": 8.80,
      "epsMax": 9.20,
      "effectiveTaxRatePercent": 22.0,
      "capexMinMln": 340,
      "capexMaxMln": 370
    }
  }
}
```

---

## Field Count: ~75 (including nested and array item fields)
## Nesting Depth: 4 levels (quarterlyResults → operatingExpenses → fields; segments array → object → fields)
## Arrays: 1 (segments with 3 items, each with 8 fields)
## Parallel structures: quarterlyResults and fullYearResults mirror each other — tests whether model keeps values in the right section
