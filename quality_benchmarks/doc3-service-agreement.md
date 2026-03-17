# Document 3: Service Agreement

## Domain: Legal
## Schema Complexity: ~45 fields, arrays of objects with cross-references

---

## Source Text

SERVICE AGREEMENT NO. SA-2026-03-1184

This Service Agreement ("Agreement") is entered into on January 8, 2026, by and between Castellan Consulting Group, LLC, a Delaware limited liability company with its principal office at 900 Market Street, Floor 6, Wilmington, DE 19801, represented by its Managing Partner, Victor Haines (hereinafter "Provider"), and Foxworth Industrial Supply, Inc., a Pennsylvania corporation with its principal office at 3420 Liberty Avenue, Pittsburgh, PA 15201, represented by its Chief Operating Officer, Andrea Marsh (hereinafter "Client").

The Agreement becomes effective on February 1, 2026, and continues through January 31, 2028, for an initial term of 24 months. Either party may terminate the Agreement with 90 days' written notice. In the event of termination for cause, the non-breaching party may terminate with 30 days' written notice. Upon early termination by the Client without cause, an early termination fee equal to 3 months of the base retainer shall apply.

The Provider agrees to deliver the following services under this Agreement:

Phase 1 — Operational Assessment: A comprehensive review of the Client's warehouse operations, inventory management, and logistics workflow. This phase begins on February 1, 2026, and is expected to conclude by April 30, 2026. The fixed fee for Phase 1 is $85,000. Deliverables include a written assessment report and an executive presentation.

Phase 2 — Process Redesign: Design and documentation of optimized workflows based on Phase 1 findings. This phase begins on May 1, 2026, and is expected to conclude by August 31, 2026. The fixed fee for Phase 2 is $120,000. Deliverables include a process redesign document, updated SOPs, and a change management plan.

Phase 3 — Implementation Support: On-site advisory support during rollout of the redesigned processes. This phase begins on September 1, 2026, and is expected to conclude by January 31, 2027. The hourly rate for Phase 3 is $295 per hour, with a cap of $175,000. Deliverables include weekly progress reports and a final implementation summary.

In addition to phase fees, the Client shall pay a monthly retainer of $8,500 for ongoing advisory access throughout the Agreement term. Payment terms are net 45 days from invoice date. Late payments accrue interest at a rate of 1.5% per month.

The Provider shall maintain professional liability insurance with a minimum coverage of $2,000,000 per occurrence and $5,000,000 aggregate. The Provider's total liability under this Agreement shall not exceed $500,000, excluding cases of gross negligence or willful misconduct.

The governing law for this Agreement is the State of Delaware. Any disputes shall be resolved through binding arbitration administered by the American Arbitration Association in Wilmington, Delaware. The prevailing party in any dispute shall be entitled to recover reasonable attorney's fees.

---

## Schema

```typescript
const ServiceAgreementSchema = z.object({
  agreementNumber: z.string(),
  effectiveDate: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
  executionDate: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
  endDate: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
  termMonths: z.number(),
  provider: z.object({
    name: z.string(),
    entityType: z.enum(["llc", "corporation", "partnership", "sole-proprietorship"]),
    stateOfIncorporation: z.string(),
    address: z.object({
      street: z.string(),
      floor: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
    }),
    representative: z.object({
      name: z.string(),
      title: z.string(),
    }),
  }),
  client: z.object({
    name: z.string(),
    entityType: z.enum(["llc", "corporation", "partnership", "sole-proprietorship"]),
    stateOfIncorporation: z.string(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
    }),
    representative: z.object({
      name: z.string(),
      title: z.string(),
    }),
  }),
  termination: z.object({
    noticePeriodDays: z.number(),
    forCauseNoticeDays: z.number(),
    earlyTerminationFeeMonths: z.number(),
  }),
  phases: z.array(
    z.object({
      number: z.number(),
      name: z.string(),
      startDate: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
      endDate: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
      feeType: z.enum(["fixed", "hourly"]),
      feeAmount: z.number().describe("Fixed fee in dollars, or hourly rate in dollars"),
      feeCap: z.number().optional().describe("Maximum fee cap in dollars, if hourly"),
      deliverables: z.array(z.string()),
    })
  ),
  monthlyRetainer: z.number(),
  paymentTerms: z.object({
    netDays: z.number(),
    lateInterestMonthlyPercent: z.number(),
  }),
  insurance: z.object({
    perOccurrence: z.number(),
    aggregate: z.number(),
  }),
  liabilityCap: z.number(),
  governingLaw: z.string(),
  disputeResolution: z.object({
    method: z.enum(["arbitration", "litigation", "mediation"]),
    administrator: z.string(),
    venue: z.string(),
    attorneyFeesRecoverable: z.boolean(),
  }),
});
```

---

## Ground Truth

```json
{
  "agreementNumber": "SA-2026-03-1184",
  "effectiveDate": "2026-02-01",
  "executionDate": "2026-01-08",
  "endDate": "2028-01-31",
  "termMonths": 24,
  "provider": {
    "name": "Castellan Consulting Group, LLC",
    "entityType": "llc",
    "stateOfIncorporation": "Delaware",
    "address": {
      "street": "900 Market Street",
      "floor": "Floor 6",
      "city": "Wilmington",
      "state": "DE",
      "zipCode": "19801"
    },
    "representative": {
      "name": "Victor Haines",
      "title": "Managing Partner"
    }
  },
  "client": {
    "name": "Foxworth Industrial Supply, Inc.",
    "entityType": "corporation",
    "stateOfIncorporation": "Pennsylvania",
    "address": {
      "street": "3420 Liberty Avenue",
      "city": "Pittsburgh",
      "state": "PA",
      "zipCode": "15201"
    },
    "representative": {
      "name": "Andrea Marsh",
      "title": "Chief Operating Officer"
    }
  },
  "termination": {
    "noticePeriodDays": 90,
    "forCauseNoticeDays": 30,
    "earlyTerminationFeeMonths": 3
  },
  "phases": [
    {
      "number": 1,
      "name": "Operational Assessment",
      "startDate": "2026-02-01",
      "endDate": "2026-04-30",
      "feeType": "fixed",
      "feeAmount": 85000,
      "deliverables": ["Written assessment report", "Executive presentation"]
    },
    {
      "number": 2,
      "name": "Process Redesign",
      "startDate": "2026-05-01",
      "endDate": "2026-08-31",
      "feeType": "fixed",
      "feeAmount": 120000,
      "deliverables": ["Process redesign document", "Updated SOPs", "Change management plan"]
    },
    {
      "number": 3,
      "name": "Implementation Support",
      "startDate": "2026-09-01",
      "endDate": "2027-01-31",
      "feeType": "hourly",
      "feeAmount": 295,
      "feeCap": 175000,
      "deliverables": ["Weekly progress reports", "Final implementation summary"]
    }
  ],
  "monthlyRetainer": 8500,
  "paymentTerms": {
    "netDays": 45,
    "lateInterestMonthlyPercent": 1.5
  },
  "insurance": {
    "perOccurrence": 2000000,
    "aggregate": 5000000
  },
  "liabilityCap": 500000,
  "governingLaw": "Delaware",
  "disputeResolution": {
    "method": "arbitration",
    "administrator": "American Arbitration Association",
    "venue": "Wilmington, Delaware",
    "attorneyFeesRecoverable": true
  }
}
```

---

## Field Count: ~55 (including nested and array item fields)
## Nesting Depth: 4 levels (provider → address → fields; phases array → object → deliverables array → strings)
## Arrays: 5 (phases with 3 items, deliverables within each phase)
