import { z } from "zod";
import { defineModel, createSchema, type Schema } from "@openuidev/lang/structured-outputs";

export interface BenchmarkDocument {
  id: string;
  name: string;
  sourceText: string;
  zodSchema: z.ZodType;
  langSchema: Schema;
  groundTruth: unknown;
  fieldCount: number;
}

// ─── Document 1: Real Estate ──────────────────────────────────────────────────

export const PropertyListingSchema = z.object({
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  }),
  mlsNumber: z.string(),
  askingPrice: z.number(),
  listingDate: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
  listingBrokerage: z.string(),
  propertyType: z.enum(["single-family", "multi-family", "condo", "townhouse"]),
  yearBuilt: z.number(),
  lastRenovationYear: z.number(),
  lotSizeAcres: z.number(),
  livingAreaSqFt: z.number(),
  stories: z.number(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  garageCapacity: z.number(),
  annualPropertyTax: z.number(),
  heatingSystem: z.enum(["natural-gas-forced-air", "electric-forced-air", "heat-pump", "radiant", "baseboard"]),
  coolingSystem: z.enum(["central-air", "window-units", "heat-pump", "evaporative", "none"]),
  hoaMonthlyDues: z.number(),
  listingAgent: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string().describe("Format: (XXX) XXX-XXXX"),
  }),
});

const Doc1Address = defineModel({
  name: "Doc1Address",
  description: "Property address",
  schema: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  }),
});

const Doc1ListingAgent = defineModel({
  name: "Doc1ListingAgent",
  description: "Listing agent contact info",
  schema: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string().describe("Format: (XXX) XXX-XXXX"),
  }),
});

const Doc1PropertyListing = defineModel({
  name: "Doc1PropertyListing",
  description: "Real estate property listing",
  schema: z.object({
    address: Doc1Address.ref,
    mlsNumber: z.string(),
    askingPrice: z.number(),
    listingDate: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
    listingBrokerage: z.string(),
    propertyType: z.enum(["single-family", "multi-family", "condo", "townhouse"]),
    yearBuilt: z.number(),
    lastRenovationYear: z.number(),
    lotSizeAcres: z.number(),
    livingAreaSqFt: z.number(),
    stories: z.number(),
    bedrooms: z.number(),
    bathrooms: z.number(),
    garageCapacity: z.number(),
    annualPropertyTax: z.number(),
    heatingSystem: z.enum(["natural-gas-forced-air", "electric-forced-air", "heat-pump", "radiant", "baseboard"]),
    coolingSystem: z.enum(["central-air", "window-units", "heat-pump", "evaporative", "none"]),
    hoaMonthlyDues: z.number(),
    listingAgent: Doc1ListingAgent.ref,
  }),
});

export const propertyListingLangSchema = createSchema([Doc1PropertyListing]);

export const doc1GroundTruth = {
  address: {
    street: "174 Crescent Ridge Drive",
    city: "Asheville",
    state: "NC",
    zipCode: "28801",
  },
  mlsNumber: "BMR-2026-04417",
  askingPrice: 685000,
  listingDate: "2026-02-12",
  listingBrokerage: "Blue Mountain Realty",
  propertyType: "single-family",
  yearBuilt: 1997,
  lastRenovationYear: 2019,
  lotSizeAcres: 0.43,
  livingAreaSqFt: 2340,
  stories: 2,
  bedrooms: 4,
  bathrooms: 3,
  garageCapacity: 2,
  annualPropertyTax: 4870,
  heatingSystem: "natural-gas-forced-air",
  coolingSystem: "central-air",
  hoaMonthlyDues: 175,
  listingAgent: {
    name: "Diane Cowell",
    email: "diane.cowell@bluemtnrealty.com",
    phone: "(828) 555-0193",
  },
};

export const doc1Source = `174 Crescent Ridge Drive, Asheville, NC 28801 — Listed by Blue Mountain Realty on February 12, 2026, at an asking price of $685,000. This single-family residence was originally built in 1997 and underwent a full kitchen and bathroom renovation in 2019. The property sits on a 0.43-acre lot and offers 2,340 square feet of living space across two stories. It has 4 bedrooms and 3 full bathrooms. The attached two-car garage was added during a 2012 expansion. Annual property taxes are $4,870 based on the 2025 Buncombe County assessment. The home is heated by a natural gas forced-air system and cooled by central air conditioning. HOA dues are $175 per month, covering road maintenance, snow removal, and access to the community pool. The listing agent is Diane Cowell, reachable at diane.cowell@bluemtnrealty.com or (828) 555-0193. The MLS number is BMR-2026-04417.`;

// ─── Document 2: Job Posting ──────────────────────────────────────────────────

export const JobPostingSchema = z.object({
  requisitionId: z.string(),
  company: z.string(),
  title: z.string(),
  postedDate: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
  closingDate: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
  location: z.object({
    street: z.string(),
    suite: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  }),
  employmentType: z.enum(["full-time", "part-time", "contract", "internship"]),
  positionType: z.enum(["permanent", "temporary", "fixed-term"]),
  workModel: z.enum(["on-site", "hybrid", "remote"]),
  onsiteDaysPerWeek: z.number(),
  reportingTo: z.object({
    name: z.string(),
    title: z.string(),
  }),
  level: z.string(),
  compensation: z.object({
    salaryMin: z.number(),
    salaryMax: z.number(),
    bonusMaxPercent: z.number(),
  }),
  requirements: z.object({
    minYearsExperience: z.number(),
    mandatorySkills: z.array(z.string()),
    preferredSkills: z.array(z.string()),
    visaSponsorship: z.boolean(),
  }),
  benefits: z.array(
    z.object({
      type: z.enum(["medical", "dental", "retirement", "pto", "education", "relocation"]),
      monthlyEmployeeCost: z.number().optional().describe("Monthly cost in dollars, if applicable"),
      annualValue: z.number().optional().describe("Annual value (dollars for financial benefits, days for PTO), if applicable"),
    })
  ),
});

const Doc2Location = defineModel({
  name: "Doc2Location",
  description: "Job office location",
  schema: z.object({
    street: z.string(),
    suite: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  }),
});

const Doc2ReportingTo = defineModel({
  name: "Doc2ReportingTo",
  description: "Reporting manager details",
  schema: z.object({
    name: z.string(),
    title: z.string(),
  }),
});

const Doc2Compensation = defineModel({
  name: "Doc2Compensation",
  description: "Compensation details",
  schema: z.object({
    salaryMin: z.number(),
    salaryMax: z.number(),
    bonusMaxPercent: z.number(),
  }),
});

const Doc2Requirements = defineModel({
  name: "Doc2Requirements",
  description: "Job requirements",
  schema: z.object({
    minYearsExperience: z.number(),
    mandatorySkills: z.array(z.string()),
    preferredSkills: z.array(z.string()),
    visaSponsorship: z.boolean(),
  }),
});

const Doc2Benefit = defineModel({
  name: "Doc2Benefit",
  description: "Employee benefit",
  schema: z.object({
    type: z.enum(["medical", "dental", "retirement", "pto", "education", "relocation"]),
    monthlyEmployeeCost: z.number().optional().describe("Monthly cost in dollars, if applicable"),
    annualValue: z.number().optional().describe("Annual value (dollars for financial benefits, days for PTO), if applicable"),
  }),
});

const Doc2JobPosting = defineModel({
  name: "Doc2JobPosting",
  description: "Job posting",
  schema: z.object({
    requisitionId: z.string(),
    company: z.string(),
    title: z.string(),
    postedDate: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
    closingDate: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
    location: Doc2Location.ref,
    employmentType: z.enum(["full-time", "part-time", "contract", "internship"]),
    positionType: z.enum(["permanent", "temporary", "fixed-term"]),
    workModel: z.enum(["on-site", "hybrid", "remote"]),
    onsiteDaysPerWeek: z.number(),
    reportingTo: Doc2ReportingTo.ref,
    level: z.string(),
    compensation: Doc2Compensation.ref,
    requirements: Doc2Requirements.ref,
    benefits: z.array(Doc2Benefit.ref),
  }),
});

export const jobPostingLangSchema = createSchema([Doc2JobPosting]);

export const doc2GroundTruth = {
  requisitionId: "MHS-ENG-2026-0087",
  company: "Meridian Health Systems",
  title: "Senior Data Engineer",
  postedDate: "2026-03-03",
  closingDate: "2026-04-18",
  location: {
    street: "200 Clarendon Street",
    suite: "Suite 1400",
    city: "Boston",
    state: "MA",
    zipCode: "02116",
  },
  employmentType: "full-time",
  positionType: "permanent",
  workModel: "hybrid",
  onsiteDaysPerWeek: 3,
  reportingTo: {
    name: "Priya Nair",
    title: "Director of Data Infrastructure",
  },
  level: "IC4",
  compensation: {
    salaryMin: 145000,
    salaryMax: 178000,
    bonusMaxPercent: 15,
  },
  requirements: {
    minYearsExperience: 6,
    mandatorySkills: ["Apache Spark", "Apache Kafka", "Python", "SQL", "AWS"],
    preferredSkills: ["dbt", "Terraform", "Apache Airflow"],
    visaSponsorship: false,
  },
  benefits: [
    { type: "medical", monthlyEmployeeCost: 250 },
    { type: "dental", monthlyEmployeeCost: 35 },
    { type: "retirement" },
    { type: "pto", annualValue: 22 },
    { type: "education", annualValue: 3000 },
    { type: "relocation", annualValue: 12000 },
  ],
};

export const doc2Source = `Meridian Health Systems is hiring a Senior Data Engineer for its Boston, MA office at 200 Clarendon Street, Suite 1400, Boston, MA 02116. The position was posted on March 3, 2026, and applications close on April 18, 2026. The requisition ID is MHS-ENG-2026-0087.

This is a full-time, permanent role reporting to Priya Nair, Director of Data Infrastructure. The position is hybrid, requiring 3 days per week on-site. The salary range is $145,000 to $178,000 annually, with an annual performance bonus of up to 15% of base salary. The role is classified at level IC4 on Meridian's internal engineering ladder.

Candidates must have a minimum of 6 years of professional experience in data engineering. A bachelor's degree in Computer Science, Software Engineering, or a related field is required. The following technical skills are mandatory: Apache Spark, Apache Kafka, Python, SQL, and AWS. Preferred but not required skills include dbt, Terraform, and Apache Airflow. Candidates must be authorized to work in the United States; visa sponsorship is not available for this role.

The benefits package includes medical insurance with a $250 monthly employee contribution, dental insurance with a $35 monthly employee contribution, a 401(k) plan with 4% employer match, 22 days of paid time off per year, and a $3,000 annual education reimbursement. Relocation assistance of up to $12,000 is available for candidates outside the Greater Boston area.`;

// ─── Document 3: Service Agreement ───────────────────────────────────────────

export const ServiceAgreementSchema = z.object({
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

const Doc3ProviderAddress = defineModel({
  name: "Doc3ProviderAddress",
  description: "Provider address",
  schema: z.object({
    street: z.string(),
    floor: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  }),
});

const Doc3Representative = defineModel({
  name: "Doc3Representative",
  description: "Party representative",
  schema: z.object({
    name: z.string(),
    title: z.string(),
  }),
});

const Doc3Provider = defineModel({
  name: "Doc3Provider",
  description: "Service provider party",
  schema: z.object({
    name: z.string(),
    entityType: z.enum(["llc", "corporation", "partnership", "sole-proprietorship"]),
    stateOfIncorporation: z.string(),
    address: Doc3ProviderAddress.ref,
    representative: Doc3Representative.ref,
  }),
});

const Doc3ClientAddress = defineModel({
  name: "Doc3ClientAddress",
  description: "Client address",
  schema: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  }),
});

const Doc3ClientRepresentative = defineModel({
  name: "Doc3ClientRepresentative",
  description: "Client representative",
  schema: z.object({
    name: z.string(),
    title: z.string(),
  }),
});

const Doc3Client = defineModel({
  name: "Doc3Client",
  description: "Client party",
  schema: z.object({
    name: z.string(),
    entityType: z.enum(["llc", "corporation", "partnership", "sole-proprietorship"]),
    stateOfIncorporation: z.string(),
    address: Doc3ClientAddress.ref,
    representative: Doc3ClientRepresentative.ref,
  }),
});

const Doc3Termination = defineModel({
  name: "Doc3Termination",
  description: "Termination terms",
  schema: z.object({
    noticePeriodDays: z.number(),
    forCauseNoticeDays: z.number(),
    earlyTerminationFeeMonths: z.number(),
  }),
});

const Doc3Phase = defineModel({
  name: "Doc3Phase",
  description: "Service phase",
  schema: z.object({
    number: z.number(),
    name: z.string(),
    startDate: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
    endDate: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
    feeType: z.enum(["fixed", "hourly"]),
    feeAmount: z.number().describe("Fixed fee in dollars, or hourly rate in dollars"),
    feeCap: z.number().optional().describe("Maximum fee cap in dollars, if hourly"),
  }),
});

const Doc3PaymentTerms = defineModel({
  name: "Doc3PaymentTerms",
  description: "Payment terms",
  schema: z.object({
    netDays: z.number(),
    lateInterestMonthlyPercent: z.number(),
  }),
});

const Doc3Insurance = defineModel({
  name: "Doc3Insurance",
  description: "Insurance requirements",
  schema: z.object({
    perOccurrence: z.number(),
    aggregate: z.number(),
  }),
});

const Doc3DisputeResolution = defineModel({
  name: "Doc3DisputeResolution",
  description: "Dispute resolution terms",
  schema: z.object({
    method: z.enum(["arbitration", "litigation", "mediation"]),
    administrator: z.string(),
    venue: z.string(),
    attorneyFeesRecoverable: z.boolean(),
  }),
});

const Doc3ServiceAgreement = defineModel({
  name: "Doc3ServiceAgreement",
  description: "Service agreement",
  schema: z.object({
    agreementNumber: z.string(),
    effectiveDate: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
    executionDate: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
    endDate: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
    termMonths: z.number(),
    provider: Doc3Provider.ref,
    client: Doc3Client.ref,
    termination: Doc3Termination.ref,
    phases: z.array(Doc3Phase.ref),
    monthlyRetainer: z.number(),
    paymentTerms: Doc3PaymentTerms.ref,
    insurance: Doc3Insurance.ref,
    liabilityCap: z.number(),
    governingLaw: z.string(),
    disputeResolution: Doc3DisputeResolution.ref,
  }),
});

export const serviceAgreementLangSchema = createSchema([Doc3ServiceAgreement]);

export const doc3GroundTruth = {
  agreementNumber: "SA-2026-03-1184",
  effectiveDate: "2026-02-01",
  executionDate: "2026-01-08",
  endDate: "2028-01-31",
  termMonths: 24,
  provider: {
    name: "Castellan Consulting Group, LLC",
    entityType: "llc",
    stateOfIncorporation: "Delaware",
    address: {
      street: "900 Market Street",
      floor: "Floor 6",
      city: "Wilmington",
      state: "DE",
      zipCode: "19801",
    },
    representative: {
      name: "Victor Haines",
      title: "Managing Partner",
    },
  },
  client: {
    name: "Foxworth Industrial Supply, Inc.",
    entityType: "corporation",
    stateOfIncorporation: "Pennsylvania",
    address: {
      street: "3420 Liberty Avenue",
      city: "Pittsburgh",
      state: "PA",
      zipCode: "15201",
    },
    representative: {
      name: "Andrea Marsh",
      title: "Chief Operating Officer",
    },
  },
  termination: {
    noticePeriodDays: 90,
    forCauseNoticeDays: 30,
    earlyTerminationFeeMonths: 3,
  },
  phases: [
    {
      number: 1,
      name: "Operational Assessment",
      startDate: "2026-02-01",
      endDate: "2026-04-30",
      feeType: "fixed",
      feeAmount: 85000,
    },
    {
      number: 2,
      name: "Process Redesign",
      startDate: "2026-05-01",
      endDate: "2026-08-31",
      feeType: "fixed",
      feeAmount: 120000,
    },
    {
      number: 3,
      name: "Implementation Support",
      startDate: "2026-09-01",
      endDate: "2027-01-31",
      feeType: "hourly",
      feeAmount: 295,
      feeCap: 175000,
    },
  ],
  monthlyRetainer: 8500,
  paymentTerms: {
    netDays: 45,
    lateInterestMonthlyPercent: 1.5,
  },
  insurance: {
    perOccurrence: 2000000,
    aggregate: 5000000,
  },
  liabilityCap: 500000,
  governingLaw: "Delaware",
  disputeResolution: {
    method: "arbitration",
    administrator: "American Arbitration Association",
    venue: "Wilmington, Delaware",
    attorneyFeesRecoverable: true,
  },
};

export const doc3Source = `SERVICE AGREEMENT NO. SA-2026-03-1184

This Service Agreement ("Agreement") is entered into on January 8, 2026, by and between Castellan Consulting Group, LLC, a Delaware limited liability company with its principal office at 900 Market Street, Floor 6, Wilmington, DE 19801, represented by its Managing Partner, Victor Haines (hereinafter "Provider"), and Foxworth Industrial Supply, Inc., a Pennsylvania corporation with its principal office at 3420 Liberty Avenue, Pittsburgh, PA 15201, represented by its Chief Operating Officer, Andrea Marsh (hereinafter "Client").

The Agreement becomes effective on February 1, 2026, and continues through January 31, 2028, for an initial term of 24 months. Either party may terminate the Agreement with 90 days' written notice. In the event of termination for cause, the non-breaching party may terminate with 30 days' written notice. Upon early termination by the Client without cause, an early termination fee equal to 3 months of the base retainer shall apply.

The Provider agrees to deliver the following services under this Agreement:

Phase 1 — Operational Assessment: A comprehensive review of the Client's warehouse operations, inventory management, and logistics workflow. This phase begins on February 1, 2026, and is expected to conclude by April 30, 2026. The fixed fee for Phase 1 is $85,000. Deliverables include a written assessment report and an executive presentation.

Phase 2 — Process Redesign: Design and documentation of optimized workflows based on Phase 1 findings. This phase begins on May 1, 2026, and is expected to conclude by August 31, 2026. The fixed fee for Phase 2 is $120,000. Deliverables include a process redesign document, updated SOPs, and a change management plan.

Phase 3 — Implementation Support: On-site advisory support during rollout of the redesigned processes. This phase begins on September 1, 2026, and is expected to conclude by January 31, 2027. The hourly rate for Phase 3 is $295 per hour, with a cap of $175,000. Deliverables include weekly progress reports and a final implementation summary.

In addition to phase fees, the Client shall pay a monthly retainer of $8,500 for ongoing advisory access throughout the Agreement term. Payment terms are net 45 days from invoice date. Late payments accrue interest at a rate of 1.5% per month.

The Provider shall maintain professional liability insurance with a minimum coverage of $2,000,000 per occurrence and $5,000,000 aggregate. The Provider's total liability under this Agreement shall not exceed $500,000, excluding cases of gross negligence or willful misconduct.

The governing law for this Agreement is the State of Delaware. Any disputes shall be resolved through binding arbitration administered by the American Arbitration Association in Wilmington, Delaware. The prevailing party in any dispute shall be entitled to recover reasonable attorney's fees.`;

// ─── Document 4: Earnings Report ──────────────────────────────────────────────

export const EarningsReportSchema = z.object({
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

const Doc4Company = defineModel({
  name: "Doc4Company",
  description: "Company info",
  schema: z.object({
    name: z.string(),
    ticker: z.string(),
    exchange: z.string(),
    fiscalYearEnd: z.string().describe("Month and day: MM-DD"),
  }),
});

const Doc4ReportingPeriod = defineModel({
  name: "Doc4ReportingPeriod",
  description: "Reporting period",
  schema: z.object({
    quarter: z.number(),
    year: z.number(),
  }),
});

const Doc4OperatingExpenses = defineModel({
  name: "Doc4OperatingExpenses",
  description: "Operating expenses breakdown",
  schema: z.object({
    totalMln: z.number(),
    rdMln: z.number(),
    salesMarketingMln: z.number(),
    gaMln: z.number(),
  }),
});

const Doc4QuarterlyResults = defineModel({
  name: "Doc4QuarterlyResults",
  description: "Quarterly financial results",
  schema: z.object({
    revenueMln: z.number(),
    priorYearRevenueMln: z.number(),
    revenueGrowthPercent: z.number(),
    cogsMln: z.number(),
    grossProfitMln: z.number(),
    grossMarginPercent: z.number(),
    operatingExpenses: Doc4OperatingExpenses.ref,
    operatingIncomeMln: z.number(),
    operatingMarginPercent: z.number(),
    netIncomeMln: z.number(),
    dilutedEps: z.number(),
    dilutedSharesMln: z.number(),
    effectiveTaxRatePercent: z.number(),
  }),
});

const Doc4FullYearOpex = defineModel({
  name: "Doc4FullYearOpex",
  description: "Full year operating expenses breakdown",
  schema: z.object({
    totalMln: z.number(),
    rdMln: z.number(),
    salesMarketingMln: z.number(),
    gaMln: z.number(),
  }),
});

const Doc4FullYearResults = defineModel({
  name: "Doc4FullYearResults",
  description: "Full year financial results",
  schema: z.object({
    revenueMln: z.number(),
    priorYearRevenueMln: z.number(),
    revenueGrowthPercent: z.number(),
    cogsMln: z.number(),
    grossProfitMln: z.number(),
    grossMarginPercent: z.number(),
    operatingExpenses: Doc4FullYearOpex.ref,
    operatingIncomeMln: z.number(),
    operatingMarginPercent: z.number(),
    netIncomeMln: z.number(),
    dilutedEps: z.number(),
    dilutedSharesMln: z.number(),
    effectiveTaxRatePercent: z.number(),
  }),
});

const Doc4Segment = defineModel({
  name: "Doc4Segment",
  description: "Business segment results",
  schema: z.object({
    name: z.string(),
    quarterlyRevenueMln: z.number(),
    priorYearQuarterlyRevenueMln: z.number(),
    revenueGrowthPercent: z.number(),
    operatingIncomeMln: z.number(),
    operatingMarginPercent: z.number(),
    headcount: z.number(),
    capexMln: z.number(),
  }),
});

const Doc4BalanceSheet = defineModel({
  name: "Doc4BalanceSheet",
  description: "Balance sheet",
  schema: z.object({
    cashMln: z.number(),
    totalDebtMln: z.number(),
    shortTermDebtMln: z.number(),
    longTermDebtMln: z.number(),
    accountsReceivableMln: z.number(),
    inventoryMln: z.number(),
  }),
});

const Doc4CashFlow = defineModel({
  name: "Doc4CashFlow",
  description: "Cash flow summary",
  schema: z.object({
    operatingCashFlowMln: z.number(),
    capexMln: z.number(),
    freeCashFlowMln: z.number(),
  }),
});

const Doc4NextQuarterGuidance = defineModel({
  name: "Doc4NextQuarterGuidance",
  description: "Next quarter guidance",
  schema: z.object({
    revenueMinMln: z.number(),
    revenueMaxMln: z.number(),
    epsMin: z.number(),
    epsMax: z.number(),
  }),
});

const Doc4FullYearGuidance = defineModel({
  name: "Doc4FullYearGuidance",
  description: "Full year guidance",
  schema: z.object({
    revenueMinMln: z.number(),
    revenueMaxMln: z.number(),
    epsMin: z.number(),
    epsMax: z.number(),
    effectiveTaxRatePercent: z.number(),
    capexMinMln: z.number(),
    capexMaxMln: z.number(),
  }),
});

const Doc4Guidance = defineModel({
  name: "Doc4Guidance",
  description: "Forward guidance",
  schema: z.object({
    nextQuarter: Doc4NextQuarterGuidance.ref,
    fullYear: Doc4FullYearGuidance.ref,
  }),
});

const Doc4EarningsReport = defineModel({
  name: "Doc4EarningsReport",
  description: "Quarterly earnings report",
  schema: z.object({
    company: Doc4Company.ref,
    reportDate: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
    reportingPeriod: Doc4ReportingPeriod.ref,
    quarterlyResults: Doc4QuarterlyResults.ref,
    fullYearResults: Doc4FullYearResults.ref,
    segments: z.array(Doc4Segment.ref),
    balanceSheet: Doc4BalanceSheet.ref,
    cashFlow: Doc4CashFlow.ref,
    guidance: Doc4Guidance.ref,
  }),
});

export const earningsReportLangSchema = createSchema([Doc4EarningsReport]);

export const doc4GroundTruth = {
  company: {
    name: "Vantage Materials Corporation",
    ticker: "VTGM",
    exchange: "NASDAQ",
    fiscalYearEnd: "12-31",
  },
  reportDate: "2026-02-06",
  reportingPeriod: { quarter: 4, year: 2025 },
  quarterlyResults: {
    revenueMln: 1284,
    priorYearRevenueMln: 1157,
    revenueGrowthPercent: 11.0,
    cogsMln: 743,
    grossProfitMln: 541,
    grossMarginPercent: 42.1,
    operatingExpenses: { totalMln: 312, rdMln: 124, salesMarketingMln: 108, gaMln: 80 },
    operatingIncomeMln: 229,
    operatingMarginPercent: 17.8,
    netIncomeMln: 168,
    dilutedEps: 2.14,
    dilutedSharesMln: 78.5,
    effectiveTaxRatePercent: 22.3,
  },
  fullYearResults: {
    revenueMln: 4891,
    priorYearRevenueMln: 4420,
    revenueGrowthPercent: 10.7,
    cogsMln: 2836,
    grossProfitMln: 2055,
    grossMarginPercent: 42.0,
    operatingExpenses: { totalMln: 1183, rdMln: 469, salesMarketingMln: 411, gaMln: 303 },
    operatingIncomeMln: 872,
    operatingMarginPercent: 17.8,
    netIncomeMln: 641,
    dilutedEps: 8.17,
    dilutedSharesMln: 78.5,
    effectiveTaxRatePercent: 22.1,
  },
  segments: [
    { name: "Advanced Polymers", quarterlyRevenueMln: 586, priorYearQuarterlyRevenueMln: 521, revenueGrowthPercent: 12.5, operatingIncomeMln: 117, operatingMarginPercent: 20.0, headcount: 4820, capexMln: 38 },
    { name: "Specialty Coatings", quarterlyRevenueMln: 412, priorYearQuarterlyRevenueMln: 384, revenueGrowthPercent: 7.3, operatingIncomeMln: 66, operatingMarginPercent: 16.0, headcount: 3150, capexMln: 22 },
    { name: "Industrial Films", quarterlyRevenueMln: 286, priorYearQuarterlyRevenueMln: 252, revenueGrowthPercent: 13.5, operatingIncomeMln: 46, operatingMarginPercent: 16.1, headcount: 2470, capexMln: 17 },
  ],
  balanceSheet: {
    cashMln: 892,
    totalDebtMln: 1340,
    shortTermDebtMln: 540,
    longTermDebtMln: 800,
    accountsReceivableMln: 674,
    inventoryMln: 531,
  },
  cashFlow: {
    operatingCashFlowMln: 287,
    capexMln: 77,
    freeCashFlowMln: 210,
  },
  guidance: {
    nextQuarter: { revenueMinMln: 1310, revenueMaxMln: 1360, epsMin: 2.20, epsMax: 2.35 },
    fullYear: { revenueMinMln: 5250, revenueMaxMln: 5450, epsMin: 8.80, epsMax: 9.20, effectiveTaxRatePercent: 22.0, capexMinMln: 340, capexMaxMln: 370 },
  },
};

export const doc4Source = `VANTAGE MATERIALS CORPORATION — FOURTH QUARTER AND FULL YEAR 2025 EARNINGS REPORT

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

For Q1 2026, the company expects revenue in the range of $1,310 million to $1,360 million and diluted earnings per share of $2.20 to $2.35. For full year 2026, the company expects revenue in the range of $5,250 million to $5,450 million and diluted earnings per share of $8.80 to $9.20. The full year 2026 guidance assumes an effective tax rate of 22.0% and capital expenditures of $340 million to $370 million.`;

// ─── Document 5: System Architecture ──────────────────────────────────────────

export const SystemArchitectureSchema = z.object({
  document: z.object({
    id: z.string(),
    version: z.string(),
    author: z.object({
      name: z.string(),
      role: z.string(),
    }),
    reviewer: z.object({
      name: z.string(),
      role: z.string(),
    }),
    lastUpdated: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
  }),
  project: z.object({
    name: z.string(),
    architecture: z.enum(["event-driven", "microservices", "monolithic", "serverless"]),
    peakThroughput: z.number().describe("Orders per second"),
    uptimeSla: z.number().describe("Percentage, e.g., 99.95"),
    slaWindowDays: z.number(),
    maxLatencyMs: z.number().describe("99th percentile end-to-end latency in milliseconds"),
    monthlyInfrastructureCost: z.number(),
  }),
  deployment: z.object({
    provider: z.enum(["aws", "gcp", "azure"]),
    primaryRegion: z.string(),
    drRegion: z.string(),
  }),
  services: z.array(
    z.object({
      name: z.string(),
      language: z.string(),
      languageVersion: z.string(),
      compute: z.object({
        minReplicas: z.number(),
        maxReplicas: z.number(),
        scalingMetric: z.enum(["cpu", "memory", "queue-depth"]),
        scalingThreshold: z.number().describe("Percentage for cpu/memory, message count for queue-depth"),
        cpuPerReplica: z.number().describe("vCPUs"),
        memoryPerReplicaGb: z.number(),
      }),
      apis: z.array(
        z.object({
          protocol: z.enum(["rest", "grpc"]),
          port: z.number(),
        })
      ).optional(),
      healthCheck: z.object({
        intervalSeconds: z.number(),
        endpoint: z.string(),
      }),
      consumesTopics: z.array(z.string()),
      producesTopics: z.array(z.string()),
      dependencies: z.array(
        z.object({
          name: z.string(),
          type: z.enum(["database", "external-api", "cache"]),
          technology: z.string().optional(),
          version: z.string().optional(),
          instanceClass: z.string().optional(),
          readReplicas: z.number().optional(),
          shards: z.number().optional(),
          slaMs: z.number().optional().describe("SLA latency in milliseconds at 95th percentile"),
        })
      ),
    })
  ),
  messageBroker: z.object({
    technology: z.string(),
    version: z.string(),
    brokerCount: z.number(),
    brokerCpus: z.number(),
    brokerMemoryGb: z.number(),
    replicationFactor: z.number(),
    minInSyncReplicas: z.number(),
    retentionDays: z.number(),
    topics: z.array(
      z.object({
        name: z.string(),
        partitions: z.number(),
      })
    ),
  }),
  monitoring: z.object({
    metricsSystem: z.string(),
    scrapeIntervalSeconds: z.number(),
    dashboardTool: z.string(),
    alertingSystem: z.string(),
    escalationPolicy: z.array(
      z.object({
        priority: z.enum(["P1", "P2", "P3"]),
        responseTimeMinutes: z.number(),
      })
    ),
    logging: z.object({
      system: z.string(),
      retentionDays: z.number(),
    }),
  }),
});

const Doc5Author = defineModel({
  name: "Doc5Author",
  description: "Document author",
  schema: z.object({
    name: z.string(),
    role: z.string(),
  }),
});

const Doc5Reviewer = defineModel({
  name: "Doc5Reviewer",
  description: "Document reviewer",
  schema: z.object({
    name: z.string(),
    role: z.string(),
  }),
});

const Doc5DocumentInfo = defineModel({
  name: "Doc5DocumentInfo",
  description: "Document metadata",
  schema: z.object({
    id: z.string(),
    version: z.string(),
    author: Doc5Author.ref,
    reviewer: Doc5Reviewer.ref,
    lastUpdated: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
  }),
});

const Doc5Project = defineModel({
  name: "Doc5Project",
  description: "Project overview",
  schema: z.object({
    name: z.string(),
    architecture: z.enum(["event-driven", "microservices", "monolithic", "serverless"]),
    peakThroughput: z.number().describe("Orders per second"),
    uptimeSla: z.number().describe("Percentage, e.g., 99.95"),
    slaWindowDays: z.number(),
    maxLatencyMs: z.number().describe("99th percentile end-to-end latency in milliseconds"),
    monthlyInfrastructureCost: z.number(),
  }),
});

const Doc5Deployment = defineModel({
  name: "Doc5Deployment",
  description: "Deployment configuration",
  schema: z.object({
    provider: z.enum(["aws", "gcp", "azure"]),
    primaryRegion: z.string(),
    drRegion: z.string(),
  }),
});

const Doc5Compute = defineModel({
  name: "Doc5Compute",
  description: "Compute configuration for a service",
  schema: z.object({
    minReplicas: z.number(),
    maxReplicas: z.number(),
    scalingMetric: z.enum(["cpu", "memory", "queue-depth"]),
    scalingThreshold: z.number().describe("Percentage for cpu/memory, message count for queue-depth"),
    cpuPerReplica: z.number().describe("vCPUs"),
    memoryPerReplicaGb: z.number(),
  }),
});

const Doc5ApiEndpoint = defineModel({
  name: "Doc5ApiEndpoint",
  description: "API endpoint",
  schema: z.object({
    protocol: z.enum(["rest", "grpc"]),
    port: z.number(),
  }),
});

const Doc5HealthCheck = defineModel({
  name: "Doc5HealthCheck",
  description: "Health check configuration",
  schema: z.object({
    intervalSeconds: z.number(),
    endpoint: z.string(),
  }),
});

const Doc5Dependency = defineModel({
  name: "Doc5Dependency",
  description: "Service dependency",
  schema: z.object({
    name: z.string(),
    type: z.enum(["database", "external-api", "cache"]),
    technology: z.string().optional(),
    version: z.string().optional(),
    instanceClass: z.string().optional(),
    readReplicas: z.number().optional(),
    shards: z.number().optional(),
    slaMs: z.number().optional().describe("SLA latency in milliseconds at 95th percentile"),
  }),
});

const Doc5Service = defineModel({
  name: "Doc5Service",
  description: "Microservice",
  schema: z.object({
    name: z.string(),
    language: z.string(),
    languageVersion: z.string(),
    compute: Doc5Compute.ref,
    apis: z.array(Doc5ApiEndpoint.ref).optional(),
    healthCheck: Doc5HealthCheck.ref,
    consumesTopics: z.array(z.string()),
    producesTopics: z.array(z.string()),
    dependencies: z.array(Doc5Dependency.ref),
  }),
});

const Doc5KafkaTopic = defineModel({
  name: "Doc5KafkaTopic",
  description: "Kafka topic",
  schema: z.object({
    name: z.string(),
    partitions: z.number(),
  }),
});

const Doc5MessageBroker = defineModel({
  name: "Doc5MessageBroker",
  description: "Message broker configuration",
  schema: z.object({
    technology: z.string(),
    version: z.string(),
    brokerCount: z.number(),
    brokerCpus: z.number(),
    brokerMemoryGb: z.number(),
    replicationFactor: z.number(),
    minInSyncReplicas: z.number(),
    retentionDays: z.number(),
    topics: z.array(Doc5KafkaTopic.ref),
  }),
});

const Doc5EscalationLevel = defineModel({
  name: "Doc5EscalationLevel",
  description: "Escalation policy level",
  schema: z.object({
    priority: z.enum(["P1", "P2", "P3"]),
    responseTimeMinutes: z.number(),
  }),
});

const Doc5LoggingConfig = defineModel({
  name: "Doc5LoggingConfig",
  description: "Logging configuration",
  schema: z.object({
    system: z.string(),
    retentionDays: z.number(),
  }),
});

const Doc5Monitoring = defineModel({
  name: "Doc5Monitoring",
  description: "Monitoring configuration",
  schema: z.object({
    metricsSystem: z.string(),
    scrapeIntervalSeconds: z.number(),
    dashboardTool: z.string(),
    alertingSystem: z.string(),
    escalationPolicy: z.array(Doc5EscalationLevel.ref),
    logging: Doc5LoggingConfig.ref,
  }),
});

const Doc5SystemArchitecture = defineModel({
  name: "Doc5SystemArchitecture",
  description: "System architecture specification",
  schema: z.object({
    document: Doc5DocumentInfo.ref,
    project: Doc5Project.ref,
    deployment: Doc5Deployment.ref,
    services: z.array(Doc5Service.ref),
    messageBroker: Doc5MessageBroker.ref,
    monitoring: Doc5Monitoring.ref,
  }),
});

export const systemArchitectureLangSchema = createSchema([Doc5SystemArchitecture]);

export const doc5GroundTruth = {
  document: {
    id: "ARCH-2026-HELIOS-003",
    version: "2.1",
    author: { name: "Marcus Tan", role: "Principal Architect" },
    reviewer: { name: "Elena Voss", role: "VP of Engineering" },
    lastUpdated: "2026-01-22",
  },
  project: {
    name: "Project Helios",
    architecture: "event-driven",
    peakThroughput: 12000,
    uptimeSla: 99.95,
    slaWindowDays: 30,
    maxLatencyMs: 800,
    monthlyInfrastructureCost: 47500,
  },
  deployment: { provider: "aws", primaryRegion: "us-east-1", drRegion: "eu-west-1" },
  services: [
    {
      name: "Order Gateway",
      language: "Go",
      languageVersion: "1.22",
      compute: { minReplicas: 4, maxReplicas: 20, scalingMetric: "cpu", scalingThreshold: 70, cpuPerReplica: 2, memoryPerReplicaGb: 4 },
      apis: [{ protocol: "rest", port: 8080 }, { protocol: "grpc", port: 9090 }],
      healthCheck: { intervalSeconds: 15, endpoint: "/healthz" },
      consumesTopics: [],
      producesTopics: ["orders.submitted"],
      dependencies: [{ name: "Validation Service", type: "external-api" }],
    },
    {
      name: "Validation Service",
      language: "Java",
      languageVersion: "21",
      compute: { minReplicas: 3, maxReplicas: 15, scalingMetric: "cpu", scalingThreshold: 65, cpuPerReplica: 4, memoryPerReplicaGb: 8 },
      healthCheck: { intervalSeconds: 10, endpoint: "/health" },
      consumesTopics: ["orders.submitted"],
      producesTopics: ["orders.validated", "orders.rejected"],
      dependencies: [
        { name: "inventory database", type: "database", technology: "PostgreSQL", version: "16.2", instanceClass: "db.r6g.xlarge", readReplicas: 2 },
        { name: "fraud scoring API", type: "external-api", slaMs: 200 },
      ],
    },
    {
      name: "Fulfillment Engine",
      language: "Python",
      languageVersion: "3.12",
      compute: { minReplicas: 2, maxReplicas: 10, scalingMetric: "queue-depth", scalingThreshold: 500, cpuPerReplica: 2, memoryPerReplicaGb: 4 },
      healthCheck: { intervalSeconds: 20, endpoint: "/ready" },
      consumesTopics: ["orders.validated"],
      producesTopics: ["orders.fulfilled"],
      dependencies: [
        { name: "warehouse database", type: "database", technology: "PostgreSQL", version: "16.2", instanceClass: "db.r6g.large", readReplicas: 1 },
        { name: "shipping rates API", type: "external-api", slaMs: 350 },
      ],
    },
    {
      name: "Notification Service",
      language: "TypeScript",
      languageVersion: "22",
      compute: { minReplicas: 2, maxReplicas: 8, scalingMetric: "cpu", scalingThreshold: 75, cpuPerReplica: 1, memoryPerReplicaGb: 2 },
      healthCheck: { intervalSeconds: 30, endpoint: "/ping" },
      consumesTopics: ["orders.fulfilled", "orders.rejected"],
      producesTopics: [],
      dependencies: [
        { name: "customer preferences database", type: "cache", technology: "Redis", version: "7.2", shards: 3 },
        { name: "email delivery API", type: "external-api", slaMs: 500 },
      ],
    },
    {
      name: "Analytics Collector",
      language: "Scala",
      languageVersion: "3.4",
      compute: { minReplicas: 2, maxReplicas: 6, scalingMetric: "cpu", scalingThreshold: 80, cpuPerReplica: 2, memoryPerReplicaGb: 8 },
      healthCheck: { intervalSeconds: 15, endpoint: "/status" },
      consumesTopics: ["orders.submitted", "orders.validated", "orders.rejected", "orders.fulfilled"],
      producesTopics: [],
      dependencies: [{ name: "ClickHouse cluster", type: "database", technology: "ClickHouse", version: "24.1" }],
    },
  ],
  messageBroker: {
    technology: "Apache Kafka",
    version: "3.7",
    brokerCount: 5,
    brokerCpus: 8,
    brokerMemoryGb: 16,
    replicationFactor: 3,
    minInSyncReplicas: 2,
    retentionDays: 7,
    topics: [
      { name: "orders.submitted", partitions: 24 },
      { name: "orders.validated", partitions: 16 },
      { name: "orders.rejected", partitions: 8 },
      { name: "orders.fulfilled", partitions: 16 },
    ],
  },
  monitoring: {
    metricsSystem: "Prometheus",
    scrapeIntervalSeconds: 15,
    dashboardTool: "Grafana",
    alertingSystem: "PagerDuty",
    escalationPolicy: [
      { priority: "P1", responseTimeMinutes: 5 },
      { priority: "P2", responseTimeMinutes: 15 },
      { priority: "P3", responseTimeMinutes: 60 },
    ],
    logging: { system: "Datadog", retentionDays: 30 },
  },
};

export const doc5Source = `PROJECT HELIOS — SYSTEM ARCHITECTURE SPECIFICATION
Document ID: ARCH-2026-HELIOS-003
Version: 2.1
Author: Marcus Tan, Principal Architect
Reviewed by: Elena Voss, VP of Engineering
Last updated: January 22, 2026

OVERVIEW

Project Helios is an event-driven order processing platform designed to handle up to 12,000 orders per second at peak load. The system targets 99.95% uptime measured on a rolling 30-day window. Maximum acceptable end-to-end latency from order submission to confirmation is 800 milliseconds at the 99th percentile. The platform is deployed across two AWS regions: us-east-1 (primary) and eu-west-1 (disaster recovery). The estimated monthly infrastructure cost at full scale is $47,500.

SERVICES

The platform consists of five core services.

Order Gateway: This is the entry point for all incoming orders. It runs as a Kubernetes deployment with a minimum of 4 replicas and a maximum of 20 replicas, scaling based on a CPU utilization threshold of 70%. Each replica is allocated 2 vCPUs and 4 GB of memory. The service is implemented in Go, version 1.22. It exposes a REST API on port 8080 and a gRPC API on port 9090. Health checks run every 15 seconds on the /healthz endpoint. The service depends on the Validation Service and publishes events to the orders.submitted Kafka topic.

Validation Service: Responsible for order validation, fraud scoring, and inventory checks. It runs as a Kubernetes deployment with a minimum of 3 replicas and a maximum of 15 replicas, scaling based on a CPU utilization threshold of 65%. Each replica is allocated 4 vCPUs and 8 GB of memory. The service is implemented in Java, version 21. It consumes events from the orders.submitted topic and publishes validated orders to the orders.validated topic. Failed validations are published to the orders.rejected topic. The service connects to the inventory database (PostgreSQL, version 16.2, instance class db.r6g.xlarge with 2 read replicas) and the fraud scoring API (external, SLA of 200 milliseconds at the 95th percentile). Health checks run every 10 seconds on the /health endpoint.

Fulfillment Engine: Manages warehouse assignment, shipping carrier selection, and delivery scheduling. It runs as a Kubernetes deployment with a minimum of 2 replicas and a maximum of 10 replicas, scaling based on queue depth with a threshold of 500 messages. Each replica is allocated 2 vCPUs and 4 GB of memory. The service is implemented in Python, version 3.12. It consumes events from the orders.validated topic and publishes to the orders.fulfilled topic. The service connects to the warehouse database (PostgreSQL, version 16.2, instance class db.r6g.large with 1 read replica) and the shipping rates API (external, SLA of 350 milliseconds at the 95th percentile). Health checks run every 20 seconds on the /ready endpoint.

Notification Service: Handles customer notifications via email, SMS, and push. It runs as a Kubernetes deployment with a minimum of 2 replicas and a maximum of 8 replicas, scaling based on a CPU utilization threshold of 75%. Each replica is allocated 1 vCPU and 2 GB of memory. The service is implemented in TypeScript on Node.js, version 22. It consumes events from the orders.fulfilled topic and the orders.rejected topic. The service connects to the customer preferences database (Redis, version 7.2, cluster mode enabled with 3 shards) and the email delivery API (external, SLA of 500 milliseconds at the 95th percentile). Health checks run every 30 seconds on the /ping endpoint.

Analytics Collector: Ingests all order events for real-time dashboards and batch reporting. It runs as a Kubernetes deployment with a minimum of 2 replicas and a maximum of 6 replicas, scaling based on a CPU utilization threshold of 80%. Each replica is allocated 2 vCPUs and 8 GB of memory. The service is implemented in Scala, version 3.4. It consumes events from all four Kafka topics: orders.submitted, orders.validated, orders.rejected, and orders.fulfilled. The service writes to a ClickHouse cluster (version 24.1, 3-node cluster, each node with 8 vCPUs and 32 GB of memory). Health checks run every 15 seconds on the /status endpoint.

MESSAGE BROKER

The platform uses Apache Kafka version 3.7 as its central message broker, running on a dedicated 5-broker cluster. Each broker has 8 vCPUs and 16 GB of memory. The default replication factor is 3, minimum in-sync replicas is 2, and the default retention period is 7 days. There are four topics: orders.submitted with 24 partitions, orders.validated with 16 partitions, orders.rejected with 8 partitions, and orders.fulfilled with 16 partitions.

MONITORING

Metrics are collected via Prometheus (scrape interval 15 seconds) and visualized in Grafana. Alerts are routed through PagerDuty with the following escalation policy: P1 incidents (system down) have a 5-minute response time SLA, P2 incidents (degraded performance) have a 15-minute response time SLA, and P3 incidents (non-critical) have a 60-minute response time SLA. Log aggregation is handled by Datadog with a retention of 30 days.`;

// ─── Export all documents ──────────────────────────────────────────────────────

export const documents: BenchmarkDocument[] = [
  {
    id: "real-estate",
    name: "Real Estate Listing",
    sourceText: doc1Source,
    zodSchema: PropertyListingSchema,
    langSchema: propertyListingLangSchema,
    groundTruth: doc1GroundTruth,
    fieldCount: 22,
  },
  {
    id: "job-posting",
    name: "Job Posting",
    sourceText: doc2Source,
    zodSchema: JobPostingSchema,
    langSchema: jobPostingLangSchema,
    groundTruth: doc2GroundTruth,
    fieldCount: 31,
  },
  {
    id: "service-agreement",
    name: "Service Agreement",
    sourceText: doc3Source,
    zodSchema: ServiceAgreementSchema,
    langSchema: serviceAgreementLangSchema,
    groundTruth: doc3GroundTruth,
    fieldCount: 48,
  },
  {
    id: "earnings-report",
    name: "Earnings Report",
    sourceText: doc4Source,
    zodSchema: EarningsReportSchema,
    langSchema: earningsReportLangSchema,
    groundTruth: doc4GroundTruth,
    fieldCount: 75,
  },
  {
    id: "system-architecture",
    name: "System Architecture",
    sourceText: doc5Source,
    zodSchema: SystemArchitectureSchema,
    langSchema: systemArchitectureLangSchema,
    groundTruth: doc5GroundTruth,
    fieldCount: 112,
  },
];
