import type {
  User,
  Label,
  Project,
  Cycle,
  Team,
  WorkflowState,
  Issue,
} from "./types";

// ── Users ──────────────────────────────────────────────────────────────────

export const users: User[] = [
  { id: "u1", name: "Alex Chen", displayName: "Alex", email: "alex@tangential.dev", active: true },
  { id: "u2", name: "Mira Patel", displayName: "Mira", email: "mira@tangential.dev", active: true },
  { id: "u3", name: "Jordan Silva", displayName: "Jordan", email: "jordan@tangential.dev", active: true },
  { id: "u4", name: "Sam Wright", displayName: "Sam", email: "sam@tangential.dev", active: true },
  { id: "u5", name: "Nina Okoro", displayName: "Nina", email: "nina@tangential.dev", active: true },
  { id: "u6", name: "Leo Tanaka", displayName: "Leo", email: "leo@tangential.dev", active: true },
  { id: "u7", name: "Priya Sharma", displayName: "Priya", email: "priya@tangential.dev", active: false },
];

// ── Labels ─────────────────────────────────────────────────────────────────

export const labels: Label[] = [
  { id: "l1", name: "Feature", color: "#8b5cf6" },
  { id: "l2", name: "Bug", color: "#ef4444" },
  { id: "l3", name: "Improvement", color: "#3b82f6" },
  { id: "l4", name: "Design", color: "#ec4899" },
  { id: "l5", name: "Infrastructure", color: "#f59e0b" },
  { id: "l6", name: "Documentation", color: "#10b981" },
  { id: "l7", name: "Performance", color: "#f97316" },
  { id: "l8", name: "Security", color: "#dc2626" },
  { id: "l9", name: "DevEx", color: "#06b6d4" },
  { id: "l10", name: "Mobile", color: "#8b5cf6" },
  { id: "l11", name: "API", color: "#6366f1" },
  { id: "l12", name: "Growth", color: "#22c55e" },
];

// ── Workflow States ────────────────────────────────────────────────────────

const engineeringStates: WorkflowState[] = [
  { id: "ws1", name: "Triage", color: "#94a3b8", type: "triage", position: 0 },
  { id: "ws2", name: "Backlog", color: "#94a3b8", type: "backlog", position: 1 },
  { id: "ws3", name: "Todo", color: "#94a3b8", type: "unstarted", position: 2 },
  { id: "ws4", name: "In Progress", color: "#f59e0b", type: "started", position: 3 },
  { id: "ws5", name: "In Review", color: "#3b82f6", type: "started", position: 4 },
  { id: "ws6", name: "Done", color: "#8b5cf6", type: "completed", position: 5 },
  { id: "ws7", name: "Cancelled", color: "#6b7280", type: "cancelled", position: 6 },
];

const designStates: WorkflowState[] = [
  { id: "ws8", name: "Backlog", color: "#94a3b8", type: "backlog", position: 0 },
  { id: "ws9", name: "In Design", color: "#f59e0b", type: "started", position: 1 },
  { id: "ws10", name: "Design Review", color: "#3b82f6", type: "started", position: 2 },
  { id: "ws11", name: "Ready for Dev", color: "#10b981", type: "completed", position: 3 },
  { id: "ws12", name: "Cancelled", color: "#6b7280", type: "cancelled", position: 4 },
];

// ── Cycles ──────────────────────────────────────────────────────────────────

const engineeringCycles: Cycle[] = [
  { id: "c1", number: 23, name: "Sprint 23", startsAt: "2026-03-23T00:00:00Z", endsAt: "2026-04-05T00:00:00Z" },
  { id: "c2", number: 24, name: "Sprint 24", startsAt: "2026-04-06T00:00:00Z", endsAt: "2026-04-19T00:00:00Z" },
  { id: "c3", number: 25, name: "Sprint 25", startsAt: "2026-04-20T00:00:00Z", endsAt: "2026-05-03T00:00:00Z" },
];

// ── Projects ───────────────────────────────────────────────────────────────

export const projects: Project[] = [
  { id: "p1", name: "Auth Overhaul", icon: "🔐", color: "#8b5cf6", state: "started", lead: users[0], startDate: "2026-02-01", targetDate: "2026-05-15" },
  { id: "p2", name: "Dashboard v2", icon: "📊", color: "#3b82f6", state: "started", lead: users[1], startDate: "2026-03-01", targetDate: "2026-06-01" },
  { id: "p3", name: "Mobile App", icon: "📱", color: "#ec4899", state: "planned", lead: users[2], startDate: "2026-04-15", targetDate: "2026-08-01" },
  { id: "p4", name: "API v3", icon: "⚡", color: "#f59e0b", state: "started", lead: users[3], startDate: "2026-01-15", targetDate: "2026-04-30" },
  { id: "p5", name: "Performance Sprint", icon: "🚀", color: "#ef4444", state: "completed", lead: users[4], startDate: "2026-01-01", targetDate: "2026-03-01" },
  { id: "p6", name: "Design System", icon: "🎨", color: "#10b981", state: "started", lead: users[5], startDate: "2026-02-15", targetDate: "2026-07-01" },
  { id: "p7", name: "Billing & Payments", icon: "💳", color: "#6366f1", state: "planned", lead: users[0], startDate: "2026-05-01", targetDate: "2026-08-15" },
];

// ── Teams ───────────────────────────────────────────────────────────────────

export const teams: Team[] = [
  { id: "t1", name: "Tangential", key: "TAN", icon: "🔺", color: "#8b5cf6", states: engineeringStates, cycles: engineeringCycles },
  { id: "t2", name: "Design", key: "DES", icon: "🎨", color: "#ec4899", states: designStates, cycles: [] },
];

// ── Issues ──────────────────────────────────────────────────────────────────

let issueCounter = 0;
function makeIssue(
  partial: Partial<Issue> & Pick<Issue, "title" | "stateId" | "teamId">,
): Issue {
  issueCounter++;
  const teamKey = teams.find((t) => t.id === partial.teamId)?.key ?? "TAN";
  return {
    id: `issue-${issueCounter}`,
    identifier: `${teamKey}-${1800 - issueCounter}`,
    number: 1800 - issueCounter,
    priority: 2,
    labelIds: [],
    sortOrder: issueCounter,
    createdAt: "2026-03-15T10:00:00Z",
    updatedAt: "2026-04-01T10:00:00Z",
    ...partial,
  };
}

export const issues: Issue[] = [
  // ── In Review (ws5) ─────────────────────────────────────────────────────
  makeIssue({ title: "Artifact API review and support in all shell", stateId: "ws5", teamId: "t1", priority: 1, assigneeId: "u1", labelIds: ["l1"], projectId: "p4", createdAt: "2026-02-18T09:00:00Z" }),
  makeIssue({ title: "Share Chat on Standalone shell", stateId: "ws5", teamId: "t1", priority: 1, assigneeId: "u2", labelIds: ["l1"], projectId: "p4", createdAt: "2026-02-18T11:00:00Z" }),
  makeIssue({ title: "New metering and pricing model", stateId: "ws5", teamId: "t1", priority: 2, assigneeId: "u3", labelIds: ["l1", "l11"], createdAt: "2025-10-15T09:00:00Z" }),
  makeIssue({ title: "Ambassador Program launch", stateId: "ws5", teamId: "t1", priority: 3, assigneeId: "u4", labelIds: ["l12"], createdAt: "2025-06-10T09:00:00Z", estimate: 3 }),
  makeIssue({ title: "FAQ knowledge base", stateId: "ws5", teamId: "t1", priority: 2, assigneeId: "u5", labelIds: ["l6"], createdAt: "2025-05-20T09:00:00Z", estimate: 7 }),
  makeIssue({ title: "Shell Redesign and Additional ability", stateId: "ws5", teamId: "t1", priority: 1, assigneeId: "u1", labelIds: ["l1"], projectId: "p2", createdAt: "2026-02-18T09:00:00Z", estimate: 1 }),
  makeIssue({ title: "Lists (Unordered & Numbered) component", stateId: "ws5", teamId: "t1", priority: 2, assigneeId: "u6", labelIds: ["l1"], cycleId: "c1", createdAt: "2025-09-05T09:00:00Z", estimate: 1 }),
  makeIssue({ title: "Theme-provider resilience improvements", stateId: "ws5", teamId: "t1", priority: 2, assigneeId: "u2", labelIds: ["l3"], createdAt: "2026-03-19T09:00:00Z" }),
  makeIssue({ title: "Redirect mobile users directly to playground", stateId: "ws5", teamId: "t1", priority: 3, assigneeId: "u3", labelIds: ["l12", "l10"], createdAt: "2025-11-18T09:00:00Z" }),
  makeIssue({ title: "Composer Redesign — Shell Redesign", stateId: "ws5", teamId: "t1", priority: 1, assigneeId: "u4", labelIds: ["l1"], projectId: "p2", createdAt: "2026-02-18T09:00:00Z" }),
  makeIssue({ title: "Setup stripe invoice reconciliation", stateId: "ws5", teamId: "t1", priority: 2, assigneeId: "u5", labelIds: ["l5"], projectId: "p7", createdAt: "2025-08-10T09:00:00Z" }),
  makeIssue({ title: "Report — Generative UI benchmark", stateId: "ws5", teamId: "t1", priority: 3, assigneeId: "u6", labelIds: ["l6"], createdAt: "2025-07-15T09:00:00Z", estimate: 4 }),
  makeIssue({ title: "Vercel AI SDK first-hand support in react-headless", stateId: "ws5", teamId: "t1", priority: 1, assigneeId: "u1", labelIds: ["l1"], createdAt: "2026-03-19T09:00:00Z" }),
  makeIssue({ title: "Making Blog — Template Repo, Blog, & Webinar", stateId: "ws5", teamId: "t1", priority: 3, assigneeId: "u2", labelIds: ["l6"], createdAt: "2025-06-05T09:00:00Z" }),
  makeIssue({ title: "Making Template Repo — Blog & Webinar", stateId: "ws5", teamId: "t1", priority: 3, assigneeId: "u3", labelIds: ["l6"], createdAt: "2025-06-05T09:00:00Z" }),
  makeIssue({ title: "Generative UI Report final review", stateId: "ws5", teamId: "t1", priority: 2, assigneeId: "u4", labelIds: ["l6"], createdAt: "2025-06-01T09:00:00Z", estimate: 23 }),

  // ── In Progress (ws4) ───────────────────────────────────────────────────
  makeIssue({ title: "Billing Page Updates", stateId: "ws4", teamId: "t1", priority: 1, assigneeId: "u1", labelIds: ["l1"], projectId: "p7", createdAt: "2025-11-26T09:00:00Z", estimate: 2 }),
  makeIssue({ title: "OAuth 2.0 PKCE flow implementation", stateId: "ws4", teamId: "t1", priority: 1, assigneeId: "u2", labelIds: ["l1", "l8"], projectId: "p1", createdAt: "2026-03-01T09:00:00Z" }),
  makeIssue({ title: "Dashboard chart animations", stateId: "ws4", teamId: "t1", priority: 2, assigneeId: "u3", labelIds: ["l4", "l7"], projectId: "p2", createdAt: "2026-03-20T09:00:00Z" }),
  makeIssue({ title: "WebSocket connection pooling", stateId: "ws4", teamId: "t1", priority: 1, assigneeId: "u4", labelIds: ["l5", "l7"], createdAt: "2026-04-01T09:00:00Z" }),
  makeIssue({ title: "Mobile responsive breakpoints audit", stateId: "ws4", teamId: "t1", priority: 2, assigneeId: "u5", labelIds: ["l10", "l4"], projectId: "p3", createdAt: "2026-04-02T09:00:00Z" }),
  makeIssue({ title: "GraphQL query batching layer", stateId: "ws4", teamId: "t1", priority: 2, assigneeId: "u6", labelIds: ["l11", "l7"], projectId: "p4", createdAt: "2026-03-25T09:00:00Z" }),
  makeIssue({ title: "Rate limiter middleware", stateId: "ws4", teamId: "t1", priority: 1, assigneeId: "u1", labelIds: ["l5", "l8"], projectId: "p4", createdAt: "2026-03-28T09:00:00Z" }),
  makeIssue({ title: "Notification system redesign", stateId: "ws4", teamId: "t1", priority: 2, assigneeId: "u2", labelIds: ["l1", "l4"], projectId: "p2", createdAt: "2026-03-15T09:00:00Z" }),
  makeIssue({ title: "CLI scaffolding — init command", stateId: "ws4", teamId: "t1", priority: 3, assigneeId: "u3", labelIds: ["l9"], createdAt: "2026-04-01T09:00:00Z" }),
  makeIssue({ title: "E2E test suite for auth flow", stateId: "ws4", teamId: "t1", priority: 2, assigneeId: "u4", labelIds: ["l1", "l8"], projectId: "p1", createdAt: "2026-03-10T09:00:00Z" }),
  makeIssue({ title: "Design tokens — spacing and typography", stateId: "ws4", teamId: "t1", priority: 2, assigneeId: "u5", labelIds: ["l4"], projectId: "p6", createdAt: "2026-03-12T09:00:00Z" }),
  makeIssue({ title: "Webhook delivery retry with exponential backoff", stateId: "ws4", teamId: "t1", priority: 1, assigneeId: "u6", labelIds: ["l5", "l11"], projectId: "p4", createdAt: "2026-03-22T09:00:00Z" }),

  // ── Todo (ws3) ──────────────────────────────────────────────────────────
  makeIssue({ title: "Implement dark mode toggle persistence", stateId: "ws3", teamId: "t1", priority: 3, assigneeId: "u1", labelIds: ["l3"], projectId: "p6", createdAt: "2026-04-01T09:00:00Z" }),
  makeIssue({ title: "Add keyboard shortcuts overlay", stateId: "ws3", teamId: "t1", priority: 3, assigneeId: "u2", labelIds: ["l9"], createdAt: "2026-04-02T09:00:00Z" }),
  makeIssue({ title: "Audit logging for admin actions", stateId: "ws3", teamId: "t1", priority: 2, assigneeId: "u3", labelIds: ["l8", "l5"], projectId: "p1", createdAt: "2026-04-03T09:00:00Z" }),
  makeIssue({ title: "CSV import/export for issues", stateId: "ws3", teamId: "t1", priority: 4, labelIds: ["l1"], createdAt: "2026-04-01T09:00:00Z" }),
  makeIssue({ title: "Custom field types for issues", stateId: "ws3", teamId: "t1", priority: 3, labelIds: ["l1"], createdAt: "2026-03-28T09:00:00Z" }),
  makeIssue({ title: "Dependency graph visualization", stateId: "ws3", teamId: "t1", priority: 4, labelIds: ["l1", "l4"], projectId: "p2", createdAt: "2026-03-25T09:00:00Z" }),
  makeIssue({ title: "API documentation site refresh", stateId: "ws3", teamId: "t1", priority: 3, labelIds: ["l6", "l11"], projectId: "p4", createdAt: "2026-04-02T09:00:00Z" }),
  makeIssue({ title: "Slack integration — thread sync", stateId: "ws3", teamId: "t1", priority: 2, labelIds: ["l1"], createdAt: "2026-04-03T09:00:00Z" }),

  // ── Backlog (ws2) ───────────────────────────────────────────────────────
  makeIssue({ title: "Figma plugin for design hand-off", stateId: "ws2", teamId: "t1", priority: 4, labelIds: ["l4", "l9"], createdAt: "2026-03-10T09:00:00Z" }),
  makeIssue({ title: "Jira migration script", stateId: "ws2", teamId: "t1", priority: 4, labelIds: ["l9"], createdAt: "2026-03-05T09:00:00Z" }),
  makeIssue({ title: "Email digest — weekly summary", stateId: "ws2", teamId: "t1", priority: 4, labelIds: ["l1"], createdAt: "2026-02-28T09:00:00Z" }),
  makeIssue({ title: "Multi-workspace support", stateId: "ws2", teamId: "t1", priority: 4, labelIds: ["l1", "l5"], createdAt: "2026-02-20T09:00:00Z" }),
  makeIssue({ title: "Two-factor authentication", stateId: "ws2", teamId: "t1", priority: 3, labelIds: ["l8"], projectId: "p1", createdAt: "2026-02-15T09:00:00Z" }),

  // ── Done (ws6) ──────────────────────────────────────────────────────────
  makeIssue({ title: "Session token rotation", stateId: "ws6", teamId: "t1", priority: 1, assigneeId: "u1", labelIds: ["l8"], projectId: "p1", createdAt: "2026-02-01T09:00:00Z", completedAt: "2026-03-15T09:00:00Z" }),
  makeIssue({ title: "Database connection pool tuning", stateId: "ws6", teamId: "t1", priority: 1, assigneeId: "u4", labelIds: ["l7", "l5"], projectId: "p5", createdAt: "2026-01-15T09:00:00Z", completedAt: "2026-02-28T09:00:00Z" }),
  makeIssue({ title: "Image lazy loading across all pages", stateId: "ws6", teamId: "t1", priority: 2, assigneeId: "u5", labelIds: ["l7"], projectId: "p5", createdAt: "2026-01-20T09:00:00Z", completedAt: "2026-02-25T09:00:00Z" }),
  makeIssue({ title: "Onboarding wizard — step 1 & 2", stateId: "ws6", teamId: "t1", priority: 2, assigneeId: "u3", labelIds: ["l1", "l4"], createdAt: "2026-02-10T09:00:00Z", completedAt: "2026-03-20T09:00:00Z" }),
  makeIssue({ title: "CI pipeline caching improvements", stateId: "ws6", teamId: "t1", priority: 2, assigneeId: "u6", labelIds: ["l5", "l7"], createdAt: "2026-01-25T09:00:00Z", completedAt: "2026-02-20T09:00:00Z" }),

  // ── Triage (ws1) ────────────────────────────────────────────────────────
  makeIssue({ title: "Safari 18 flexbox rendering issue", stateId: "ws1", teamId: "t1", priority: 0, labelIds: ["l2"], createdAt: "2026-04-04T09:00:00Z" }),
  makeIssue({ title: "SSO login loop on edge cases", stateId: "ws1", teamId: "t1", priority: 0, labelIds: ["l2", "l8"], createdAt: "2026-04-04T08:00:00Z" }),
  makeIssue({ title: "Customer request: custom webhook headers", stateId: "ws1", teamId: "t1", priority: 0, labelIds: ["l1", "l11"], createdAt: "2026-04-03T15:00:00Z" }),

  // ── Design team issues ──────────────────────────────────────────────────
  makeIssue({ title: "Component library — button variants", stateId: "ws9", teamId: "t2", priority: 2, assigneeId: "u5", labelIds: ["l4"], projectId: "p6", createdAt: "2026-03-20T09:00:00Z" }),
  makeIssue({ title: "Icon set update — 48 new icons", stateId: "ws9", teamId: "t2", priority: 3, assigneeId: "u5", labelIds: ["l4"], projectId: "p6", createdAt: "2026-03-25T09:00:00Z" }),
  makeIssue({ title: "Dashboard v2 final mockups", stateId: "ws10", teamId: "t2", priority: 1, assigneeId: "u5", labelIds: ["l4"], projectId: "p2", createdAt: "2026-03-15T09:00:00Z" }),
  makeIssue({ title: "Mobile onboarding flow designs", stateId: "ws8", teamId: "t2", priority: 2, labelIds: ["l4", "l10"], projectId: "p3", createdAt: "2026-04-01T09:00:00Z" }),
];
