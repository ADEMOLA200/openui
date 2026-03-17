# Test 2B: API Orchestration Workflows

## Domain: API Orchestration
## Execution: Mock HTTP server with predefined endpoints. Workflow runner executes generated steps against it.

---

## Test Case 1: Medium Complexity

### Problem Description (given to the model)

```
You have access to the following API endpoints. Generate a workflow that accomplishes the goal described below.

Available endpoints:

GET /api/users
  Response: { "users": [{ "id": string, "name": string, "email": string, "department_id": string, "active": boolean }] }

GET /api/departments/{id}
  Response: { "id": string, "name": string, "budget": number, "manager_id": string }

GET /api/users/{id}/purchases
  Query params: since (ISO date string), min_amount (number)
  Response: { "purchases": [{ "id": string, "amount": number, "date": string, "product_id": string }] }

POST /api/notifications/email
  Body: { "to": string, "subject": string, "body": string }
  Response: { "notification_id": string, "status": "sent" }

Goal:
1. Fetch all users
2. Filter to only active users
3. For each active user, fetch their purchases since 2025-01-01 with a minimum amount of 500
4. Identify users who have made 3 or more qualifying purchases
5. For each qualifying user, fetch their department information
6. Send each qualifying user an email with:
   - to: the user's email
   - subject: "Loyalty Reward — {department name}"
   - body: "Hi {user name}, you have made {purchase count} qualifying purchases. You are eligible for our loyalty program."
7. Return a summary: array of objects with user_name, email, department_name, purchase_count, notification_id
```

### Mock API Data

```json
{
  "GET /api/users": {
    "users": [
      { "id": "U1", "name": "Alice Chen", "email": "alice@example.com", "department_id": "D1", "active": true },
      { "id": "U2", "name": "Bob Kraft", "email": "bob@example.com", "department_id": "D2", "active": false },
      { "id": "U3", "name": "Carol Diaz", "email": "carol@example.com", "department_id": "D1", "active": true },
      { "id": "U4", "name": "Dan Eliot", "email": "dan@example.com", "department_id": "D3", "active": true },
      { "id": "U5", "name": "Eva Fong", "email": "eva@example.com", "department_id": "D2", "active": true }
    ]
  },
  "GET /api/users/U1/purchases?since=2025-01-01&min_amount=500": {
    "purchases": [
      { "id": "PUR-101", "amount": 750, "date": "2025-02-14", "product_id": "PRD-A" },
      { "id": "PUR-102", "amount": 1200, "date": "2025-05-03", "product_id": "PRD-B" },
      { "id": "PUR-103", "amount": 680, "date": "2025-08-21", "product_id": "PRD-A" }
    ]
  },
  "GET /api/users/U3/purchases?since=2025-01-01&min_amount=500": {
    "purchases": [
      { "id": "PUR-301", "amount": 520, "date": "2025-03-10", "product_id": "PRD-C" },
      { "id": "PUR-302", "amount": 890, "date": "2025-07-19", "product_id": "PRD-A" }
    ]
  },
  "GET /api/users/U4/purchases?since=2025-01-01&min_amount=500": {
    "purchases": [
      { "id": "PUR-401", "amount": 600, "date": "2025-01-30", "product_id": "PRD-B" },
      { "id": "PUR-402", "amount": 950, "date": "2025-04-11", "product_id": "PRD-C" },
      { "id": "PUR-403", "amount": 1500, "date": "2025-06-22", "product_id": "PRD-A" },
      { "id": "PUR-404", "amount": 700, "date": "2025-11-05", "product_id": "PRD-B" }
    ]
  },
  "GET /api/users/U5/purchases?since=2025-01-01&min_amount=500": {
    "purchases": [
      { "id": "PUR-501", "amount": 550, "date": "2025-09-14", "product_id": "PRD-C" }
    ]
  },
  "GET /api/departments/D1": {
    "id": "D1", "name": "Engineering", "budget": 500000, "manager_id": "U1"
  },
  "GET /api/departments/D3": {
    "id": "D3", "name": "Marketing", "budget": 300000, "manager_id": "U4"
  },
  "POST /api/notifications/email -> alice@example.com": {
    "notification_id": "N-1001", "status": "sent"
  },
  "POST /api/notifications/email -> dan@example.com": {
    "notification_id": "N-1002", "status": "sent"
  }
}
```

### Schema

```typescript
const ApiCall = z.object({
  id: z.string().describe("Unique step identifier"),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]),
  endpoint: z.string().describe("URL path with parameter placeholders like {user_id}"),
  queryParams: z.record(z.string()).optional(),
  body: z.record(z.unknown()).optional(),
  dependsOn: z.array(z.string()).optional().describe("Step IDs that must complete before this step"),
  forEach: z.string().optional().describe("Reference to an array from a previous step's output to iterate over"),
  condition: z.string().optional().describe("Boolean expression; skip this step if false"),
  extract: z.string().optional().describe("JSONPath or expression to extract from response for use by later steps"),
});

const WorkflowSchema = z.object({
  steps: z.array(ApiCall),
  output: z.object({
    format: z.string().describe("Expression describing how to assemble the final output from step results"),
  }),
});
```

### Expected Results

Qualifying users (3+ purchases since 2025-01-01 with min_amount 500):
- Alice Chen (U1): 3 purchases → qualifies
- Carol Diaz (U3): 2 purchases → does NOT qualify
- Dan Eliot (U4): 4 purchases → qualifies
- Eva Fong (U5): 1 purchase → does NOT qualify

API calls that should be made (in valid order):
1. GET /api/users
2. GET /api/users/U1/purchases?since=2025-01-01&min_amount=500
3. GET /api/users/U3/purchases?since=2025-01-01&min_amount=500
4. GET /api/users/U4/purchases?since=2025-01-01&min_amount=500
5. GET /api/users/U5/purchases?since=2025-01-01&min_amount=500
   (Note: U2 is inactive, should NOT be fetched)
6. GET /api/departments/D1 (for Alice)
7. GET /api/departments/D3 (for Dan)
   (Note: D2 should NOT be fetched — no qualifying users from D2)
8. POST /api/notifications/email (for Alice)
9. POST /api/notifications/email (for Dan)

Expected final output:
```json
[
  {
    "user_name": "Alice Chen",
    "email": "alice@example.com",
    "department_name": "Engineering",
    "purchase_count": 3,
    "notification_id": "N-1001"
  },
  {
    "user_name": "Dan Eliot",
    "email": "dan@example.com",
    "department_name": "Marketing",
    "purchase_count": 4,
    "notification_id": "N-1002"
  }
]
```

### Verification

1. Execute the generated workflow against the mock server
2. Verify correct API calls were made (no extra, no missing)
3. Verify inactive user (U2) was NOT queried for purchases
4. Verify non-qualifying users did NOT trigger department lookups or notifications
5. Verify final output matches expected result
6. Verify email body content matches the template with correct substitutions

---

## Test Case 2: Hard Complexity

### Problem Description (given to the model)

```
You have access to the following API endpoints. Generate a workflow that accomplishes the goal described below.

Available endpoints:

GET /api/projects
  Response: { "projects": [{ "id": string, "name": string, "status": string, "owner_id": string, "team_ids": string[], "budget": number, "start_date": string }] }

GET /api/teams/{id}
  Response: { "id": string, "name": string, "lead_id": string, "member_ids": string[] }

GET /api/users/{id}
  Response: { "id": string, "name": string, "email": string, "role": string, "hourly_rate": number, "location": string }

GET /api/projects/{id}/time-entries
  Query params: start_date (ISO date), end_date (ISO date)
  Response: { "entries": [{ "user_id": string, "hours": number, "date": string, "billable": boolean }] }

GET /api/projects/{id}/risks
  Response: { "risks": [{ "id": string, "severity": string, "description": string, "mitigation": string, "status": string }] }

POST /api/reports/generate
  Body: { "title": string, "sections": [{ "heading": string, "content": string }], "recipients": string[] }
  Response: { "report_id": string, "status": "generated", "url": string }

POST /api/notifications/slack
  Body: { "channel": string, "message": string }
  Response: { "message_id": string, "status": "sent" }

Goal:
1. Fetch all projects
2. Filter to projects with status "active"
3. For each active project:
   a. Fetch all teams assigned to the project
   b. Fetch time entries from 2025-10-01 to 2025-12-31
   c. Fetch project risks
4. For each active project, compute:
   - total_hours: sum of all time entry hours
   - billable_hours: sum of hours where billable is true
   - utilization_percent: (billable_hours / total_hours) * 100, rounded to 1 decimal
   - unique_contributors: count of distinct user_ids in time entries
   - open_high_risks: count of risks where severity is "high" and status is "open"
   - budget_consumed_percent: compute by fetching each unique contributor's hourly_rate, multiplying by their billable hours, summing the cost, and dividing by project budget * 100, rounded to 1 decimal
5. Classify each project:
   - "on-track" if utilization_percent >= 70 AND open_high_risks == 0 AND budget_consumed_percent <= 85
   - "at-risk" if utilization_percent >= 50 AND (open_high_risks > 0 OR budget_consumed_percent > 85)
   - "critical" otherwise
6. For each project classified as "at-risk" or "critical":
   - Fetch the project owner's user details
   - Fetch the team lead's user details for each team
7. Generate a report via POST /api/reports/generate with:
   - title: "Q4 2025 Project Health Report"
   - one section per flagged project containing: project name, classification, total_hours, utilization_percent, open_high_risks, budget_consumed_percent, and the names of the owner and team leads
   - recipients: email addresses of all owners and team leads of flagged projects (deduplicated)
8. Send a Slack notification to channel "#project-health" with message: "Q4 Project Health Report generated: {report_url}. {count} projects flagged."
9. Return: report_id, report_url, flagged_project_count, and an array of flagged project summaries (project_name, classification, owner_name, utilization_percent, budget_consumed_percent, open_high_risks)
```

### Mock API Data

```json
{
  "GET /api/projects": {
    "projects": [
      { "id": "PRJ-1", "name": "Atlas", "status": "active", "owner_id": "U10", "team_ids": ["T1", "T2"], "budget": 150000, "start_date": "2025-04-01" },
      { "id": "PRJ-2", "name": "Beacon", "status": "active", "owner_id": "U11", "team_ids": ["T3"], "budget": 80000, "start_date": "2025-06-15" },
      { "id": "PRJ-3", "name": "Cipher", "status": "completed", "owner_id": "U12", "team_ids": ["T1"], "budget": 200000, "start_date": "2025-01-10" },
      { "id": "PRJ-4", "name": "Delta", "status": "active", "owner_id": "U10", "team_ids": ["T4"], "budget": 60000, "start_date": "2025-09-01" }
    ]
  },
  "GET /api/teams/T1": { "id": "T1", "name": "Backend", "lead_id": "U20", "member_ids": ["U20", "U21", "U22"] },
  "GET /api/teams/T2": { "id": "T2", "name": "Frontend", "lead_id": "U23", "member_ids": ["U23", "U24"] },
  "GET /api/teams/T3": { "id": "T3", "name": "Data", "lead_id": "U25", "member_ids": ["U25", "U26"] },
  "GET /api/teams/T4": { "id": "T4", "name": "Mobile", "lead_id": "U27", "member_ids": ["U27", "U28"] },
  "GET /api/projects/PRJ-1/time-entries?start_date=2025-10-01&end_date=2025-12-31": {
    "entries": [
      { "user_id": "U20", "hours": 180, "date": "2025-10-15", "billable": true },
      { "user_id": "U21", "hours": 160, "date": "2025-10-15", "billable": true },
      { "user_id": "U22", "hours": 40, "date": "2025-11-01", "billable": false },
      { "user_id": "U23", "hours": 150, "date": "2025-10-15", "billable": true },
      { "user_id": "U24", "hours": 120, "date": "2025-11-01", "billable": true },
      { "user_id": "U20", "hours": 20, "date": "2025-12-15", "billable": false }
    ]
  },
  "GET /api/projects/PRJ-2/time-entries?start_date=2025-10-01&end_date=2025-12-31": {
    "entries": [
      { "user_id": "U25", "hours": 90, "date": "2025-10-15", "billable": true },
      { "user_id": "U26", "hours": 100, "date": "2025-10-15", "billable": true },
      { "user_id": "U25", "hours": 30, "date": "2025-12-01", "billable": false }
    ]
  },
  "GET /api/projects/PRJ-4/time-entries?start_date=2025-10-01&end_date=2025-12-31": {
    "entries": [
      { "user_id": "U27", "hours": 60, "date": "2025-10-15", "billable": true },
      { "user_id": "U28", "hours": 50, "date": "2025-11-01", "billable": false },
      { "user_id": "U27", "hours": 30, "date": "2025-12-01", "billable": false }
    ]
  },
  "GET /api/projects/PRJ-1/risks": {
    "risks": [
      { "id": "R1", "severity": "high", "description": "Key dependency delayed", "mitigation": "Parallel workstream", "status": "open" },
      { "id": "R2", "severity": "medium", "description": "Resource contention", "mitigation": "Hire contractor", "status": "closed" },
      { "id": "R3", "severity": "low", "description": "Minor scope creep", "mitigation": "Backlog review", "status": "open" }
    ]
  },
  "GET /api/projects/PRJ-2/risks": {
    "risks": [
      { "id": "R4", "severity": "medium", "description": "Data quality issues", "mitigation": "Validation pipeline", "status": "open" }
    ]
  },
  "GET /api/projects/PRJ-4/risks": {
    "risks": [
      { "id": "R5", "severity": "high", "description": "Platform API breaking change", "mitigation": "Version pinning", "status": "open" },
      { "id": "R6", "severity": "high", "description": "Lead developer leaving", "mitigation": "Knowledge transfer", "status": "open" }
    ]
  },
  "GET /api/users/U20": { "id": "U20", "name": "Raj Patel", "email": "raj@example.com", "role": "senior-engineer", "hourly_rate": 95, "location": "NYC" },
  "GET /api/users/U21": { "id": "U21", "name": "Sara Kim", "email": "sara@example.com", "role": "engineer", "hourly_rate": 75, "location": "NYC" },
  "GET /api/users/U22": { "id": "U22", "name": "Tom Li", "email": "tom@example.com", "role": "engineer", "hourly_rate": 75, "location": "SF" },
  "GET /api/users/U23": { "id": "U23", "name": "Uma Nair", "email": "uma@example.com", "role": "senior-engineer", "hourly_rate": 90, "location": "SF" },
  "GET /api/users/U24": { "id": "U24", "name": "Vic Ramos", "email": "vic@example.com", "role": "engineer", "hourly_rate": 70, "location": "NYC" },
  "GET /api/users/U25": { "id": "U25", "name": "Wendy Okafor", "email": "wendy@example.com", "role": "senior-engineer", "hourly_rate": 90, "location": "London" },
  "GET /api/users/U26": { "id": "U26", "name": "Xander Muir", "email": "xander@example.com", "role": "data-engineer", "hourly_rate": 80, "location": "London" },
  "GET /api/users/U27": { "id": "U27", "name": "Yara Costa", "email": "yara@example.com", "role": "senior-engineer", "hourly_rate": 85, "location": "Berlin" },
  "GET /api/users/U28": { "id": "U28", "name": "Zane Park", "email": "zane@example.com", "role": "engineer", "hourly_rate": 70, "location": "Berlin" },
  "GET /api/users/U10": { "id": "U10", "name": "Nora Bell", "email": "nora@example.com", "role": "director", "hourly_rate": 150, "location": "NYC" },
  "GET /api/users/U11": { "id": "U11", "name": "Oscar Vega", "email": "oscar@example.com", "role": "manager", "hourly_rate": 120, "location": "London" },
  "POST /api/reports/generate": {
    "report_id": "RPT-5001",
    "status": "generated",
    "url": "https://reports.example.com/RPT-5001"
  },
  "POST /api/notifications/slack": {
    "message_id": "MSG-8001",
    "status": "sent"
  }
}
```

### Expected Results

Active projects: PRJ-1 (Atlas), PRJ-2 (Beacon), PRJ-4 (Delta). PRJ-3 (Cipher) is completed — skip.

**PRJ-1 Atlas:**
- Time entries: U20(180h billable + 20h non), U21(160h billable), U22(40h non), U23(150h billable), U24(120h billable)
- total_hours = 180+160+40+150+120+20 = 670
- billable_hours = 180+160+150+120 = 610
- utilization_percent = (610/670)*100 = 91.0
- unique_contributors = 5 (U20, U21, U22, U23, U24)
- open_high_risks = 1 (R1)
- budget_consumed: U20 billable=180h * $95 = $17,100; U21 billable=160h * $75 = $12,000; U23 billable=150h * $90 = $13,500; U24 billable=120h * $70 = $8,400. Total cost = $51,000. budget_consumed_percent = (51000/150000)*100 = 34.0
- Classification: utilization >= 70 ✓, BUT open_high_risks > 0 → "at-risk"

**PRJ-2 Beacon:**
- Time entries: U25(90h billable + 30h non), U26(100h billable)
- total_hours = 90+100+30 = 220
- billable_hours = 90+100 = 190
- utilization_percent = (190/220)*100 = 86.4
- unique_contributors = 2 (U25, U26)
- open_high_risks = 0 (R4 is medium, not high)
- budget_consumed: U25 billable=90h * $90 = $8,100; U26 billable=100h * $80 = $8,000. Total cost = $16,100. budget_consumed_percent = (16100/80000)*100 = 20.1
- Classification: utilization >= 70 ✓, open_high_risks == 0 ✓, budget_consumed <= 85 ✓ → "on-track"

**PRJ-4 Delta:**
- Time entries: U27(60h billable + 30h non), U28(50h non)
- total_hours = 60+50+30 = 140
- billable_hours = 60
- utilization_percent = (60/140)*100 = 42.9
- unique_contributors = 2 (U27, U28)
- open_high_risks = 2 (R5, R6)
- budget_consumed: U27 billable=60h * $85 = $5,100. Total cost = $5,100. budget_consumed_percent = (5100/60000)*100 = 8.5
- Classification: utilization < 50 → "critical"

Flagged projects: Atlas (at-risk), Delta (critical). Beacon is on-track — skip.

People to fetch for flagged projects:
- Atlas owner: U10 (Nora Bell)
- Atlas team leads: U20 (Raj Patel, T1 lead), U23 (Uma Nair, T2 lead)
- Delta owner: U10 (Nora Bell — same as Atlas, should deduplicate)
- Delta team lead: U27 (Yara Costa, T4 lead)

Report recipients (deduplicated emails): nora@example.com, raj@example.com, uma@example.com, yara@example.com

Slack message: "Q4 Project Health Report generated: https://reports.example.com/RPT-5001. 2 projects flagged."

Expected final output:
```json
{
  "report_id": "RPT-5001",
  "report_url": "https://reports.example.com/RPT-5001",
  "flagged_project_count": 2,
  "flagged_projects": [
    {
      "project_name": "Atlas",
      "classification": "at-risk",
      "owner_name": "Nora Bell",
      "utilization_percent": 91.0,
      "budget_consumed_percent": 34.0,
      "open_high_risks": 1
    },
    {
      "project_name": "Delta",
      "classification": "critical",
      "owner_name": "Nora Bell",
      "utilization_percent": 42.9,
      "budget_consumed_percent": 8.5,
      "open_high_risks": 2
    }
  ]
}
```

### Verification

1. Execute the generated workflow against the mock server
2. Verify correct API calls were made:
   - Completed project (PRJ-3) should NOT be queried for time entries, risks, or teams
   - On-track project (Beacon) should NOT trigger owner/team lead lookups or report inclusion
   - User lookups should only happen for unique contributors' hourly rates and for flagged project owners/leads
3. Verify computed metrics match expected values (tolerance 0.1 for percentages)
4. Verify project classifications are correct
5. Verify report recipients are correct and deduplicated
6. Verify Slack message content matches expected format
7. Verify final output matches expected result
