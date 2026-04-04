import { issues, teams, users, labels, projects } from "./seed";
import type { Issue, IssueWithRelations } from "./types";

export function getTeams() {
  return teams;
}

export function getTeam(id: string) {
  return teams.find((t) => t.id === id);
}

export function getUsers() {
  return users;
}

export function getUser(id: string) {
  return users.find((u) => u.id === id);
}

export function getLabels() {
  return labels;
}

export function getProjects() {
  return projects;
}

export function getProject(id: string) {
  return projects.find((p) => p.id === id);
}

export function getCycles(teamId?: string) {
  const team = teamId ? teams.find((t) => t.id === teamId) : teams[0];
  return team?.cycles ?? [];
}

export function getIssues(filters?: {
  teamId?: string;
  stateId?: string;
  assigneeId?: string;
  labelId?: string;
  projectId?: string;
  cycleId?: string;
}): IssueWithRelations[] {
  let filtered = [...issues];

  if (filters?.teamId) filtered = filtered.filter((i) => i.teamId === filters.teamId);
  if (filters?.stateId) filtered = filtered.filter((i) => i.stateId === filters.stateId);
  if (filters?.assigneeId) filtered = filtered.filter((i) => i.assigneeId === filters.assigneeId);
  if (filters?.labelId) filtered = filtered.filter((i) => i.labelIds.includes(filters.labelId!));
  if (filters?.projectId) filtered = filtered.filter((i) => i.projectId === filters.projectId);
  if (filters?.cycleId) filtered = filtered.filter((i) => i.cycleId === filters.cycleId);

  return filtered.map(hydrate);
}

export function getIssue(id: string): IssueWithRelations | undefined {
  const issue = issues.find((i) => i.id === id || i.identifier === id);
  return issue ? hydrate(issue) : undefined;
}

export function createIssue(
  input: Pick<Issue, "title" | "teamId"> & Partial<Issue>,
): IssueWithRelations {
  const team = teams.find((t) => t.id === input.teamId) ?? teams[0];
  const number = issues.filter((i) => i.teamId === team.id).length + 1;
  const backlogState = team.states.find((s) => s.type === "backlog") ?? team.states[0];

  const newIssue: Issue = {
    id: `issue-${Date.now()}`,
    identifier: `${team.key}-${number}`,
    number,
    title: input.title,
    description: input.description,
    priority: input.priority ?? 0,
    stateId: input.stateId ?? backlogState.id,
    teamId: team.id,
    assigneeId: input.assigneeId,
    labelIds: input.labelIds ?? [],
    projectId: input.projectId,
    cycleId: input.cycleId,
    sortOrder: issues.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  issues.push(newIssue);
  return hydrate(newIssue);
}

export function updateIssue(
  id: string,
  input: Partial<Issue>,
): IssueWithRelations | undefined {
  console.log("updateIssue", id, input);
  const idx = issues.findIndex((i) => i.id === id || i.identifier === id);
  if (idx === -1) return undefined;

  const updated = { ...issues[idx], ...input, updatedAt: new Date().toISOString() };
  issues[idx] = updated;
  return hydrate(updated);
}

function hydrate(issue: Issue): IssueWithRelations {
  const team = teams.find((t) => t.id === issue.teamId)!;
  const state = team.states.find((s) => s.id === issue.stateId) ?? team.states[0];
  const assignee = issue.assigneeId ? users.find((u) => u.id === issue.assigneeId) : undefined;
  const issueLabels = issue.labelIds.map((lid) => labels.find((l) => l.id === lid)!).filter(Boolean);
  const project = issue.projectId ? projects.find((p) => p.id === issue.projectId) : undefined;
  const cycle = issue.cycleId ? team.cycles.find((c) => c.id === issue.cycleId) : undefined;
  const children = issues.filter((i) => i.parentId === issue.id);

  return {
    ...issue,
    state,
    team,
    assignee,
    labels: issueLabels,
    project,
    cycle,
    children: children.length > 0 ? children : undefined,
  };
}
