"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import type { IssueWithRelations, WorkflowState } from "@/data/types";
import IssueRow from "./IssueRow";
import { StateIcon } from "./StateIcon";

interface IssueGroup {
  state: WorkflowState;
  issues: IssueWithRelations[];
}

interface IssueListProps {
  issues: IssueWithRelations[];
  states: WorkflowState[];
}

function groupByState(issues: IssueWithRelations[], states: WorkflowState[]): IssueGroup[] {
  const stateOrder = ["started", "unstarted", "triage", "backlog", "completed", "cancelled"];
  const sorted = [...states].sort((a, b) => {
    const ai = stateOrder.indexOf(a.type);
    const bi = stateOrder.indexOf(b.type);
    if (ai !== bi) return ai - bi;
    return a.position - b.position;
  });

  return sorted
    .map((state) => ({
      state,
      issues: issues.filter((i) => i.stateId === state.id),
    }))
    .filter((g) => g.issues.length > 0);
}

export default function IssueList({ issues, states }: IssueListProps) {
  const groups = groupByState(issues, states);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  return (
    <div className="issue-list">
      {groups.map((group) => {
        const isCollapsed = collapsed[group.state.id] ?? false;
        return (
          <div key={group.state.id} className="issue-group">
            <button
              className="issue-group-header"
              onClick={() => setCollapsed((prev) => ({ ...prev, [group.state.id]: !isCollapsed }))}
            >
              {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
              <StateIcon state={group.state} />
              <span className="issue-group-name">{group.state.name}</span>
              <span className="issue-group-count">{group.issues.length}</span>
              <button className="issue-group-add" onClick={(e) => { e.stopPropagation(); }}>
                <Plus size={14} />
              </button>
            </button>
            {!isCollapsed && (
              <div className="issue-group-body">
                {group.issues.map((issue) => (
                  <IssueRow key={issue.id} issue={issue} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
