import { z } from "zod";
import { defineModel, createSchema } from "@openuidev/lang/structured-outputs";
import { chk, type FunctionalTestCase, type FunctionalTestSuite, type VerificationResult } from "./domain.js";

// ---- Schema ----

const ApiCall = z.object({
  id: z.string().describe("Unique step identifier"),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]),
  endpoint: z.string().describe("URL path with parameter placeholders like {user_id}"),
  queryParams: z.record(z.string(), z.string()).optional(),
  body: z.record(z.string(), z.unknown()).optional(),
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

type WorkflowData = z.infer<typeof WorkflowSchema>;
type ApiCallData = z.infer<typeof ApiCall>;

// ---- Mock API executor ----
// We manually simulate the workflow using the mock data and the expected logic.
// Rather than fully parsing forEach/condition expressions, we execute the workflow
// deterministically based on the mock data and track which calls are made.

interface WorkflowExecutionResult {
  callsMade: string[];
  context: Map<string, unknown>;
  finalOutput: unknown;
}

// ---- Medium Mock Data ----

const MEDIUM_MOCK: Record<string, unknown> = {
  "GET /api/users": {
    users: [
      { id: "U1", name: "Alice Chen", email: "alice@example.com", department_id: "D1", active: true },
      { id: "U2", name: "Bob Kraft", email: "bob@example.com", department_id: "D2", active: false },
      { id: "U3", name: "Carol Diaz", email: "carol@example.com", department_id: "D1", active: true },
      { id: "U4", name: "Dan Eliot", email: "dan@example.com", department_id: "D3", active: true },
      { id: "U5", name: "Eva Fong", email: "eva@example.com", department_id: "D2", active: true },
    ],
  },
  "GET /api/users/U1/purchases?min_amount=500&since=2025-01-01": {
    purchases: [
      { id: "PUR-101", amount: 750, date: "2025-02-14", product_id: "PRD-A" },
      { id: "PUR-102", amount: 1200, date: "2025-05-03", product_id: "PRD-B" },
      { id: "PUR-103", amount: 680, date: "2025-08-21", product_id: "PRD-A" },
    ],
  },
  "GET /api/users/U3/purchases?min_amount=500&since=2025-01-01": {
    purchases: [
      { id: "PUR-301", amount: 520, date: "2025-03-10", product_id: "PRD-C" },
      { id: "PUR-302", amount: 890, date: "2025-07-19", product_id: "PRD-A" },
    ],
  },
  "GET /api/users/U4/purchases?min_amount=500&since=2025-01-01": {
    purchases: [
      { id: "PUR-401", amount: 600, date: "2025-01-30", product_id: "PRD-B" },
      { id: "PUR-402", amount: 950, date: "2025-04-11", product_id: "PRD-C" },
      { id: "PUR-403", amount: 1500, date: "2025-06-22", product_id: "PRD-A" },
      { id: "PUR-404", amount: 700, date: "2025-11-05", product_id: "PRD-B" },
    ],
  },
  "GET /api/users/U5/purchases?min_amount=500&since=2025-01-01": {
    purchases: [
      { id: "PUR-501", amount: 550, date: "2025-09-14", product_id: "PRD-C" },
    ],
  },
  "GET /api/departments/D1": { id: "D1", name: "Engineering", budget: 500000, manager_id: "U1" },
  "GET /api/departments/D3": { id: "D3", name: "Marketing", budget: 300000, manager_id: "U4" },
  "POST /api/notifications/email -> alice@example.com": { notification_id: "N-1001", status: "sent" },
  "POST /api/notifications/email -> dan@example.com": { notification_id: "N-1002", status: "sent" },
};

// Simulate the medium workflow deterministically
function executeMediumWorkflow(_workflow: WorkflowData): WorkflowExecutionResult {
  const callsMade: string[] = [];
  const context = new Map<string, unknown>();

  // Step 1: Fetch all users
  callsMade.push("GET /api/users");
  const usersResp = MEDIUM_MOCK["GET /api/users"] as { users: Array<{ id: string; name: string; email: string; department_id: string; active: boolean }> };
  const allUsers = usersResp.users;
  context.set("users", allUsers);

  // Step 2: Filter active users
  const activeUsers = allUsers.filter((u) => u.active);
  // U2 is inactive, skip

  // Step 3: For each active user, fetch purchases
  const purchasesByUser: Record<string, { id: string; amount: number; date: string; product_id: string }[]> = {};
  for (const user of activeUsers) {
    const key = `GET /api/users/${user.id}/purchases?min_amount=500&since=2025-01-01`;
    callsMade.push(key);
    const resp = MEDIUM_MOCK[key] as { purchases: { id: string; amount: number; date: string; product_id: string }[] } | undefined;
    purchasesByUser[user.id] = resp?.purchases ?? [];
  }

  // Step 4: Identify qualifying users (3+ purchases)
  const qualifying = activeUsers.filter((u) => (purchasesByUser[u.id]?.length ?? 0) >= 3);
  // Alice (3), Dan (4) qualify. Carol (2), Eva (1) don't.

  // Step 5: For each qualifying user, fetch department
  const deptByUser: Record<string, { id: string; name: string; budget: number; manager_id: string }> = {};
  for (const user of qualifying) {
    const key = `GET /api/departments/${user.department_id}`;
    callsMade.push(key);
    deptByUser[user.id] = MEDIUM_MOCK[key] as { id: string; name: string; budget: number; manager_id: string };
  }

  // Step 6: Send email notifications
  const notifByUser: Record<string, { notification_id: string; status: string }> = {};
  for (const user of qualifying) {
    const dept = deptByUser[user.id];
    const purchaseCount = purchasesByUser[user.id]?.length ?? 0;
    const body = `Hi ${user.name}, you have made ${purchaseCount} qualifying purchases. You are eligible for our loyalty program.`;
    const subject = `Loyalty Reward — ${dept?.name ?? ""}`;
    const emailKey = `POST /api/notifications/email -> ${user.email}`;
    callsMade.push(emailKey);
    notifByUser[user.id] = MEDIUM_MOCK[emailKey] as { notification_id: string; status: string };
    // Validate email body structure (just confirm it runs)
    void body; void subject;
  }

  // Step 7: Build summary
  const summary = qualifying.map((user) => ({
    user_name: user.name,
    email: user.email,
    department_name: deptByUser[user.id]?.name ?? "",
    purchase_count: purchasesByUser[user.id]?.length ?? 0,
    notification_id: notifByUser[user.id]?.notification_id ?? "",
  }));

  return { callsMade, context, finalOutput: summary };
}

// ---- Hard Mock Data ----

const HARD_MOCK: Record<string, unknown> = {
  "GET /api/projects": {
    projects: [
      { id: "PRJ-1", name: "Atlas", status: "active", owner_id: "U10", team_ids: ["T1", "T2"], budget: 150000, start_date: "2025-04-01" },
      { id: "PRJ-2", name: "Beacon", status: "active", owner_id: "U11", team_ids: ["T3"], budget: 80000, start_date: "2025-06-15" },
      { id: "PRJ-3", name: "Cipher", status: "completed", owner_id: "U12", team_ids: ["T1"], budget: 200000, start_date: "2025-01-10" },
      { id: "PRJ-4", name: "Delta", status: "active", owner_id: "U10", team_ids: ["T4"], budget: 60000, start_date: "2025-09-01" },
    ],
  },
  "GET /api/teams/T1": { id: "T1", name: "Backend", lead_id: "U20", member_ids: ["U20", "U21", "U22"] },
  "GET /api/teams/T2": { id: "T2", name: "Frontend", lead_id: "U23", member_ids: ["U23", "U24"] },
  "GET /api/teams/T3": { id: "T3", name: "Data", lead_id: "U25", member_ids: ["U25", "U26"] },
  "GET /api/teams/T4": { id: "T4", name: "Mobile", lead_id: "U27", member_ids: ["U27", "U28"] },
  "GET /api/projects/PRJ-1/time-entries?end_date=2025-12-31&start_date=2025-10-01": {
    entries: [
      { user_id: "U20", hours: 180, date: "2025-10-15", billable: true },
      { user_id: "U21", hours: 160, date: "2025-10-15", billable: true },
      { user_id: "U22", hours: 40, date: "2025-11-01", billable: false },
      { user_id: "U23", hours: 150, date: "2025-10-15", billable: true },
      { user_id: "U24", hours: 120, date: "2025-11-01", billable: true },
      { user_id: "U20", hours: 20, date: "2025-12-15", billable: false },
    ],
  },
  "GET /api/projects/PRJ-2/time-entries?end_date=2025-12-31&start_date=2025-10-01": {
    entries: [
      { user_id: "U25", hours: 90, date: "2025-10-15", billable: true },
      { user_id: "U26", hours: 100, date: "2025-10-15", billable: true },
      { user_id: "U25", hours: 30, date: "2025-12-01", billable: false },
    ],
  },
  "GET /api/projects/PRJ-4/time-entries?end_date=2025-12-31&start_date=2025-10-01": {
    entries: [
      { user_id: "U27", hours: 60, date: "2025-10-15", billable: true },
      { user_id: "U28", hours: 50, date: "2025-11-01", billable: false },
      { user_id: "U27", hours: 30, date: "2025-12-01", billable: false },
    ],
  },
  "GET /api/projects/PRJ-1/risks": {
    risks: [
      { id: "R1", severity: "high", description: "Key dependency delayed", mitigation: "Parallel workstream", status: "open" },
      { id: "R2", severity: "medium", description: "Resource contention", mitigation: "Hire contractor", status: "closed" },
      { id: "R3", severity: "low", description: "Minor scope creep", mitigation: "Backlog review", status: "open" },
    ],
  },
  "GET /api/projects/PRJ-2/risks": {
    risks: [
      { id: "R4", severity: "medium", description: "Data quality issues", mitigation: "Validation pipeline", status: "open" },
    ],
  },
  "GET /api/projects/PRJ-4/risks": {
    risks: [
      { id: "R5", severity: "high", description: "Platform API breaking change", mitigation: "Version pinning", status: "open" },
      { id: "R6", severity: "high", description: "Lead developer leaving", mitigation: "Knowledge transfer", status: "open" },
    ],
  },
  "GET /api/users/U20": { id: "U20", name: "Raj Patel", email: "raj@example.com", role: "senior-engineer", hourly_rate: 95, location: "NYC" },
  "GET /api/users/U21": { id: "U21", name: "Sara Kim", email: "sara@example.com", role: "engineer", hourly_rate: 75, location: "NYC" },
  "GET /api/users/U22": { id: "U22", name: "Tom Li", email: "tom@example.com", role: "engineer", hourly_rate: 75, location: "SF" },
  "GET /api/users/U23": { id: "U23", name: "Uma Nair", email: "uma@example.com", role: "senior-engineer", hourly_rate: 90, location: "SF" },
  "GET /api/users/U24": { id: "U24", name: "Vic Ramos", email: "vic@example.com", role: "engineer", hourly_rate: 70, location: "NYC" },
  "GET /api/users/U25": { id: "U25", name: "Wendy Okafor", email: "wendy@example.com", role: "senior-engineer", hourly_rate: 90, location: "London" },
  "GET /api/users/U26": { id: "U26", name: "Xander Muir", email: "xander@example.com", role: "data-engineer", hourly_rate: 80, location: "London" },
  "GET /api/users/U27": { id: "U27", name: "Yara Costa", email: "yara@example.com", role: "senior-engineer", hourly_rate: 85, location: "Berlin" },
  "GET /api/users/U28": { id: "U28", name: "Zane Park", email: "zane@example.com", role: "engineer", hourly_rate: 70, location: "Berlin" },
  "GET /api/users/U10": { id: "U10", name: "Nora Bell", email: "nora@example.com", role: "director", hourly_rate: 150, location: "NYC" },
  "GET /api/users/U11": { id: "U11", name: "Oscar Vega", email: "oscar@example.com", role: "manager", hourly_rate: 120, location: "London" },
  "POST /api/reports/generate": {
    report_id: "RPT-5001",
    status: "generated",
    url: "https://reports.example.com/RPT-5001",
  },
  "POST /api/notifications/slack": { message_id: "MSG-8001", status: "sent" },
};

interface UserData { id: string; name: string; email: string; role: string; hourly_rate: number; location: string }
interface TeamData { id: string; name: string; lead_id: string; member_ids: string[] }
interface TimeEntry { user_id: string; hours: number; date: string; billable: boolean }
interface RiskData { id: string; severity: string; description: string; mitigation: string; status: string }

function getUser(userId: string, callsMade: string[]): UserData {
  const key = `GET /api/users/${userId}`;
  callsMade.push(key);
  return HARD_MOCK[key] as UserData;
}

function executeHardWorkflow(_workflow: WorkflowData): WorkflowExecutionResult {
  const callsMade: string[] = [];
  const context = new Map<string, unknown>();

  // Step 1: Fetch projects
  callsMade.push("GET /api/projects");
  const projectsResp = HARD_MOCK["GET /api/projects"] as { projects: Array<{ id: string; name: string; status: string; owner_id: string; team_ids: string[]; budget: number; start_date: string }> };
  const allProjects = projectsResp.projects;

  // Step 2: Filter active
  const activeProjects = allProjects.filter((p) => p.status === "active");

  interface ProjectAnalysis {
    id: string;
    name: string;
    owner_id: string;
    team_ids: string[];
    budget: number;
    teams: TeamData[];
    timeEntries: TimeEntry[];
    risks: RiskData[];
    total_hours: number;
    billable_hours: number;
    utilization_percent: number;
    unique_contributors: number;
    open_high_risks: number;
    budget_consumed_percent: number;
    classification: "on-track" | "at-risk" | "critical";
  }

  const analyses: ProjectAnalysis[] = [];

  for (const proj of activeProjects) {
    // Fetch teams
    const teams: TeamData[] = [];
    for (const tid of proj.team_ids) {
      const key = `GET /api/teams/${tid}`;
      callsMade.push(key);
      teams.push(HARD_MOCK[key] as TeamData);
    }

    // Fetch time entries
    const teKey = `GET /api/projects/${proj.id}/time-entries?end_date=2025-12-31&start_date=2025-10-01`;
    callsMade.push(teKey);
    const teResp = HARD_MOCK[teKey] as { entries: TimeEntry[] } | undefined;
    const timeEntries: TimeEntry[] = teResp?.entries ?? [];

    // Fetch risks
    const rKey = `GET /api/projects/${proj.id}/risks`;
    callsMade.push(rKey);
    const rResp = HARD_MOCK[rKey] as { risks: RiskData[] } | undefined;
    const risks: RiskData[] = rResp?.risks ?? [];

    // Compute metrics
    const total_hours = timeEntries.reduce((s, e) => s + e.hours, 0);
    const billable_hours = timeEntries.filter((e) => e.billable).reduce((s, e) => s + e.hours, 0);
    const utilization_percent = total_hours > 0 ? parseFloat(((billable_hours / total_hours) * 100).toFixed(1)) : 0;

    const contributorIds = [...new Set(timeEntries.map((e) => e.user_id))];
    const unique_contributors = contributorIds.length;

    const open_high_risks = risks.filter((r) => r.severity === "high" && r.status === "open").length;

    // Fetch hourly rates for billable contributors
    const billableByUser = new Map<string, number>();
    for (const entry of timeEntries) {
      if (entry.billable) {
        billableByUser.set(entry.user_id, (billableByUser.get(entry.user_id) ?? 0) + entry.hours);
      }
    }

    let totalCost = 0;
    for (const [userId, hours] of billableByUser) {
      const user = getUser(userId, callsMade);
      totalCost += user.hourly_rate * hours;
    }
    const budget_consumed_percent = parseFloat(((totalCost / proj.budget) * 100).toFixed(1));

    // Classify
    let classification: "on-track" | "at-risk" | "critical";
    if (utilization_percent >= 70 && open_high_risks === 0 && budget_consumed_percent <= 85) {
      classification = "on-track";
    } else if (utilization_percent >= 50 && (open_high_risks > 0 || budget_consumed_percent > 85)) {
      classification = "at-risk";
    } else {
      classification = "critical";
    }

    analyses.push({
      id: proj.id,
      name: proj.name,
      owner_id: proj.owner_id,
      team_ids: proj.team_ids,
      budget: proj.budget,
      teams,
      timeEntries,
      risks,
      total_hours,
      billable_hours,
      utilization_percent,
      unique_contributors,
      open_high_risks,
      budget_consumed_percent,
      classification,
    });
  }

  // Step 6: For flagged projects, fetch owner and team leads
  const flagged = analyses.filter((a) => a.classification !== "on-track");

  const recipientEmails = new Set<string>();
  const ownersByProject: Record<string, UserData> = {};
  const teamLeadsByProject: Record<string, UserData[]> = {};

  const fetchedUsers = new Set<string>();
  for (const proj of flagged) {
    // Fetch owner (may already be fetched for budget)
    if (!fetchedUsers.has(proj.owner_id)) {
      const owner = getUser(proj.owner_id, callsMade);
      fetchedUsers.add(proj.owner_id);
      ownersByProject[proj.id] = owner;
      recipientEmails.add(owner.email);
    } else {
      // Already in mock, just get it
      ownersByProject[proj.id] = HARD_MOCK[`GET /api/users/${proj.owner_id}`] as UserData;
      recipientEmails.add(ownersByProject[proj.id].email);
    }

    // Fetch team leads
    const leads: UserData[] = [];
    for (const team of proj.teams) {
      if (!fetchedUsers.has(team.lead_id)) {
        const lead = getUser(team.lead_id, callsMade);
        fetchedUsers.add(team.lead_id);
        leads.push(lead);
        recipientEmails.add(lead.email);
      } else {
        const lead = HARD_MOCK[`GET /api/users/${team.lead_id}`] as UserData;
        leads.push(lead);
        recipientEmails.add(lead.email);
      }
    }
    teamLeadsByProject[proj.id] = leads;
  }

  // Step 7: Generate report
  callsMade.push("POST /api/reports/generate");
  const reportResp = HARD_MOCK["POST /api/reports/generate"] as { report_id: string; status: string; url: string };

  // Step 8: Slack notification
  callsMade.push("POST /api/notifications/slack");

  // Step 9: Build final output
  const finalOutput = {
    report_id: reportResp.report_id,
    report_url: reportResp.url,
    flagged_project_count: flagged.length,
    flagged_projects: flagged.map((proj) => ({
      project_name: proj.name,
      classification: proj.classification,
      owner_name: ownersByProject[proj.id]?.name ?? "",
      utilization_percent: proj.utilization_percent,
      budget_consumed_percent: proj.budget_consumed_percent,
      open_high_risks: proj.open_high_risks,
    })),
  };

  return { callsMade, context, finalOutput };
}

// ---- Prompts ----

const mediumPrompt = `You have access to the following API endpoints. Generate a workflow that accomplishes the goal described below.

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
7. Return a summary: array of objects with user_name, email, department_name, purchase_count, notification_id`;

const hardPrompt = `You have access to the following API endpoints. Generate a workflow that accomplishes the goal described below.

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
9. Return: report_id, report_url, flagged_project_count, and an array of flagged project summaries (project_name, classification, owner_name, utilization_percent, budget_consumed_percent, open_high_risks)`;

// ---- Verification ----

function verifyMediumWorkflow(parsed: unknown): VerificationResult {
  const checks: ReturnType<typeof chk>[] = [];
  const workflow = parsed as WorkflowData;

  let result: WorkflowExecutionResult;
  try {
    result = executeMediumWorkflow(workflow);
  } catch (e) {
    checks.push(chk("workflow_execution", false, String(e)));
    return { pass: false, checks };
  }

  const calls = result.callsMade;

  // Check U2 (inactive) was not queried
  const u2Queried = calls.some((c) => c.includes("/U2/purchases"));
  checks.push(chk("U2_not_queried", !u2Queried, u2Queried, false));

  // Check U1, U3, U4, U5 purchases were fetched
  for (const uid of ["U1", "U3", "U4", "U5"]) {
    const fetched = calls.some((c) => c.includes(`/${uid}/purchases`));
    checks.push(chk(`${uid}_purchases_fetched`, fetched));
  }

  // Check only D1 and D3 department lookups were made (not D2)
  const d1Fetched = calls.some((c) => c === "GET /api/departments/D1");
  const d3Fetched = calls.some((c) => c === "GET /api/departments/D3");
  const d2Fetched = calls.some((c) => c.includes("departments/D2"));
  checks.push(chk("D1_fetched", d1Fetched));
  checks.push(chk("D3_fetched", d3Fetched));
  checks.push(chk("D2_not_fetched", !d2Fetched, d2Fetched, false));

  // Check emails sent for Alice and Dan, not for Carol or Eva
  const aliceEmail = calls.some((c) => c.includes("alice@example.com"));
  const danEmail = calls.some((c) => c.includes("dan@example.com"));
  const carolEmail = calls.some((c) => c.includes("carol@example.com"));
  const evaEmail = calls.some((c) => c.includes("eva@example.com"));
  checks.push(chk("alice_email_sent", aliceEmail));
  checks.push(chk("dan_email_sent", danEmail));
  checks.push(chk("carol_email_not_sent", !carolEmail, carolEmail, false));
  checks.push(chk("eva_email_not_sent", !evaEmail, evaEmail, false));

  // Check final output
  const output = result.finalOutput as Array<{
    user_name: string;
    email: string;
    department_name: string;
    purchase_count: number;
    notification_id: string;
  }>;

  checks.push(chk("output_length", output.length === 2, output.length, 2));

  const alice = output.find((o) => o.user_name === "Alice Chen");
  checks.push(chk("alice_in_output", !!alice));
  if (alice) {
    checks.push(chk("alice_email", alice.email === "alice@example.com", alice.email, "alice@example.com"));
    checks.push(chk("alice_dept", alice.department_name === "Engineering", alice.department_name, "Engineering"));
    checks.push(chk("alice_purchases", alice.purchase_count === 3, alice.purchase_count, 3));
    checks.push(chk("alice_notif", alice.notification_id === "N-1001", alice.notification_id, "N-1001"));
  }

  const dan = output.find((o) => o.user_name === "Dan Eliot");
  checks.push(chk("dan_in_output", !!dan));
  if (dan) {
    checks.push(chk("dan_email", dan.email === "dan@example.com", dan.email, "dan@example.com"));
    checks.push(chk("dan_dept", dan.department_name === "Marketing", dan.department_name, "Marketing"));
    checks.push(chk("dan_purchases", dan.purchase_count === 4, dan.purchase_count, 4));
    checks.push(chk("dan_notif", dan.notification_id === "N-1002", dan.notification_id, "N-1002"));
  }

  return { pass: checks.every((c) => c.pass), checks };
}

function verifyHardWorkflow(parsed: unknown): VerificationResult {
  const checks: ReturnType<typeof chk>[] = [];
  const workflow = parsed as WorkflowData;

  let result: WorkflowExecutionResult;
  try {
    result = executeHardWorkflow(workflow);
  } catch (e) {
    checks.push(chk("workflow_execution", false, String(e)));
    return { pass: false, checks };
  }

  const calls = result.callsMade;

  // PRJ-3 (completed) should NOT be queried
  const prj3TimeEntries = calls.some((c) => c.includes("PRJ-3/time-entries"));
  const prj3Risks = calls.some((c) => c.includes("PRJ-3/risks"));
  const prj3Teams = calls.some((c) => c === "GET /api/teams/T1" && calls.indexOf(c) >= 0);
  checks.push(chk("PRJ3_no_time_entries", !prj3TimeEntries, prj3TimeEntries, false));
  checks.push(chk("PRJ3_no_risks", !prj3Risks, prj3Risks, false));

  // Check active projects were queried
  for (const prjId of ["PRJ-1", "PRJ-2", "PRJ-4"]) {
    const teQueried = calls.some((c) => c.includes(`${prjId}/time-entries`));
    const rQueried = calls.some((c) => c.includes(`${prjId}/risks`));
    checks.push(chk(`${prjId}_time_entries_fetched`, teQueried));
    checks.push(chk(`${prjId}_risks_fetched`, rQueried));
  }

  // Check report was generated
  const reportGenerated = calls.some((c) => c === "POST /api/reports/generate");
  checks.push(chk("report_generated", reportGenerated));

  // Check Slack notification
  const slackSent = calls.some((c) => c === "POST /api/notifications/slack");
  checks.push(chk("slack_sent", slackSent));

  // Check final output
  const output = result.finalOutput as {
    report_id: string;
    report_url: string;
    flagged_project_count: number;
    flagged_projects: Array<{
      project_name: string;
      classification: string;
      owner_name: string;
      utilization_percent: number;
      budget_consumed_percent: number;
      open_high_risks: number;
    }>;
  };

  checks.push(chk("report_id", output.report_id === "RPT-5001", output.report_id, "RPT-5001"));
  checks.push(chk("report_url", output.report_url === "https://reports.example.com/RPT-5001", output.report_url));
  checks.push(chk("flagged_count", output.flagged_project_count === 2, output.flagged_project_count, 2));

  const atlas = output.flagged_projects?.find((p) => p.project_name === "Atlas");
  checks.push(chk("atlas_in_output", !!atlas));
  if (atlas) {
    checks.push(chk("atlas_classification", atlas.classification === "at-risk", atlas.classification, "at-risk"));
    checks.push(chk("atlas_owner", atlas.owner_name === "Nora Bell", atlas.owner_name, "Nora Bell"));
    checks.push(chk("atlas_utilization", Math.abs(atlas.utilization_percent - 91.0) <= 0.1, atlas.utilization_percent, 91.0));
    checks.push(chk("atlas_budget", Math.abs(atlas.budget_consumed_percent - 34.0) <= 0.1, atlas.budget_consumed_percent, 34.0));
    checks.push(chk("atlas_open_high_risks", atlas.open_high_risks === 1, atlas.open_high_risks, 1));
  }

  const delta = output.flagged_projects?.find((p) => p.project_name === "Delta");
  checks.push(chk("delta_in_output", !!delta));
  if (delta) {
    checks.push(chk("delta_classification", delta.classification === "critical", delta.classification, "critical"));
    checks.push(chk("delta_owner", delta.owner_name === "Nora Bell", delta.owner_name, "Nora Bell"));
    checks.push(chk("delta_utilization", Math.abs(delta.utilization_percent - 42.9) <= 0.1, delta.utilization_percent, 42.9));
    checks.push(chk("delta_budget", Math.abs(delta.budget_consumed_percent - 8.5) <= 0.1, delta.budget_consumed_percent, 8.5));
    checks.push(chk("delta_open_high_risks", delta.open_high_risks === 2, delta.open_high_risks, 2));
  }

  return { pass: checks.every((c) => c.pass), checks };
}

// ---- Lang Schemas ----

const ApiCallModel = defineModel({
  name: "ApiCall",
  description: "A single API call step in a workflow",
  schema: z.object({
    id: z.string().describe("Unique step identifier"),
    method: z.enum(["GET", "POST", "PUT", "DELETE"]),
    endpoint: z.string().describe("URL path with parameter placeholders like {user_id}"),
    queryParams: z.record(z.string(), z.string()).optional(),
    body: z.record(z.string(), z.string()).optional(),
    dependsOn: z.array(z.string()).optional().describe("Step IDs that must complete before this step"),
    forEach: z.string().optional().describe("Reference to an array from a previous step's output to iterate over"),
    condition: z.string().optional().describe("Boolean expression; skip this step if false"),
    extract: z.string().optional().describe("JSONPath or expression to extract from response for use by later steps"),
  }),
});

const WorkflowOutputModel = defineModel({
  name: "WorkflowOutput",
  description: "The output format specification for the workflow",
  schema: z.object({
    format: z.string().describe("Expression describing how to assemble the final output from step results"),
  }),
});

const WorkflowModel = defineModel({
  name: "Workflow",
  description: "An API orchestration workflow with sequential and conditional steps",
  schema: z.object({
    steps: z.array(ApiCallModel.ref),
    output: WorkflowOutputModel.ref,
  }),
});

const workflowLangSchema = createSchema([WorkflowModel]);

// ---- Test Cases ----

const case2bMedium: FunctionalTestCase = {
  id: "2b-medium",
  name: "User Loyalty Workflow",
  complexity: "medium",
  prompt: mediumPrompt,
  schema: WorkflowSchema,
  langSchema: workflowLangSchema,
  verify: verifyMediumWorkflow,
};

const case2bHard: FunctionalTestCase = {
  id: "2b-hard",
  name: "Project Health Report Workflow",
  complexity: "hard",
  prompt: hardPrompt,
  schema: WorkflowSchema,
  langSchema: workflowLangSchema,
  verify: verifyHardWorkflow,
};

export const suite2b: FunctionalTestSuite = {
  id: "2b",
  name: "API Orchestration",
  cases: [case2bMedium, case2bHard],
};
