export type WorkflowStateType =
  | "triage"
  | "backlog"
  | "unstarted"
  | "started"
  | "completed"
  | "cancelled";

export type IssuePriority = 0 | 1 | 2 | 3 | 4;

export interface WorkflowState {
  id: string;
  name: string;
  color: string;
  type: WorkflowStateType;
  position: number;
}

export interface User {
  id: string;
  name: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  active: boolean;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  icon?: string;
  color: string;
  state: "planned" | "started" | "paused" | "completed" | "cancelled";
  lead?: User;
  startDate?: string;
  targetDate?: string;
}

export interface Cycle {
  id: string;
  number: number;
  name?: string;
  startsAt: string;
  endsAt: string;
  completedAt?: string;
}

export interface Team {
  id: string;
  name: string;
  key: string;
  icon?: string;
  color: string;
  states: WorkflowState[];
  cycles: Cycle[];
}

export interface Issue {
  id: string;
  identifier: string;
  title: string;
  description?: string;
  priority: IssuePriority;
  stateId: string;
  teamId: string;
  assigneeId?: string;
  labelIds: string[];
  projectId?: string;
  cycleId?: string;
  parentId?: string;
  estimate?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelledAt?: string;
  archivedAt?: string;
  subIssueSortOrder?: number;
  sortOrder: number;
  number: number;
}

export interface IssueWithRelations extends Issue {
  state: WorkflowState;
  team: Team;
  assignee?: User;
  labels: Label[];
  project?: Project;
  cycle?: Cycle;
  children?: Issue[];
}
