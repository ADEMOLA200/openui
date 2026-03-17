# Document 2: Job Posting

## Domain: HR / Recruiting
## Schema Complexity: ~30 fields, moderate nesting with arrays

---

## Source Text

Meridian Health Systems is hiring a Senior Data Engineer for its Boston, MA office at 200 Clarendon Street, Suite 1400, Boston, MA 02116. The position was posted on March 3, 2026, and applications close on April 18, 2026. The requisition ID is MHS-ENG-2026-0087.

This is a full-time, permanent role reporting to Priya Nair, Director of Data Infrastructure. The position is hybrid, requiring 3 days per week on-site. The salary range is $145,000 to $178,000 annually, with an annual performance bonus of up to 15% of base salary. The role is classified at level IC4 on Meridian's internal engineering ladder.

Candidates must have a minimum of 6 years of professional experience in data engineering. A bachelor's degree in Computer Science, Software Engineering, or a related field is required. The following technical skills are mandatory: Apache Spark, Apache Kafka, Python, SQL, and AWS. Preferred but not required skills include dbt, Terraform, and Apache Airflow. Candidates must be authorized to work in the United States; visa sponsorship is not available for this role.

The benefits package includes medical insurance with a $250 monthly employee contribution, dental insurance with a $35 monthly employee contribution, a 401(k) plan with 4% employer match, 22 days of paid time off per year, and a $3,000 annual education reimbursement. Relocation assistance of up to $12,000 is available for candidates outside the Greater Boston area.

---

## Schema

```typescript
const JobPostingSchema = z.object({
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
    degree: z.string(),
    mandatorySkills: z.array(z.string()),
    preferredSkills: z.array(z.string()),
    visaSponsorship: z.boolean(),
  }),
  benefits: z.array(
    z.object({
      type: z.enum(["medical", "dental", "retirement", "pto", "education", "relocation"]),
      description: z.string(),
      monthlyEmployeeCost: z.number().optional().describe("Monthly cost in dollars, if applicable"),
      annualValue: z.number().optional().describe("Annual value in dollars, if applicable"),
    })
  ),
});
```

---

## Ground Truth

```json
{
  "requisitionId": "MHS-ENG-2026-0087",
  "company": "Meridian Health Systems",
  "title": "Senior Data Engineer",
  "postedDate": "2026-03-03",
  "closingDate": "2026-04-18",
  "location": {
    "street": "200 Clarendon Street",
    "suite": "Suite 1400",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02116"
  },
  "employmentType": "full-time",
  "positionType": "permanent",
  "workModel": "hybrid",
  "onsiteDaysPerWeek": 3,
  "reportingTo": {
    "name": "Priya Nair",
    "title": "Director of Data Infrastructure"
  },
  "level": "IC4",
  "compensation": {
    "salaryMin": 145000,
    "salaryMax": 178000,
    "bonusMaxPercent": 15
  },
  "requirements": {
    "minYearsExperience": 6,
    "degree": "Bachelor's degree in Computer Science, Software Engineering, or a related field",
    "mandatorySkills": ["Apache Spark", "Apache Kafka", "Python", "SQL", "AWS"],
    "preferredSkills": ["dbt", "Terraform", "Apache Airflow"],
    "visaSponsorship": false
  },
  "benefits": [
    {
      "type": "medical",
      "description": "Medical insurance",
      "monthlyEmployeeCost": 250
    },
    {
      "type": "dental",
      "description": "Dental insurance",
      "monthlyEmployeeCost": 35
    },
    {
      "type": "retirement",
      "description": "401(k) plan with 4% employer match"
    },
    {
      "type": "pto",
      "description": "Paid time off",
      "annualValue": 22
    },
    {
      "type": "education",
      "description": "Annual education reimbursement",
      "annualValue": 3000
    },
    {
      "type": "relocation",
      "description": "Relocation assistance for candidates outside Greater Boston area",
      "annualValue": 12000
    }
  ]
}
```

---

## Field Count: ~38 (including nested and array item fields)
## Nesting Depth: 3 levels (benefits array → object → fields)
## Arrays: 4 (mandatorySkills, preferredSkills, benefits with 6 items)
