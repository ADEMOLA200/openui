"use client";

import type { IssueWithRelations } from "@/data/types";
import { PriorityIcon } from "./PriorityIcon";
import { StateIcon } from "./StateIcon";

interface IssueRowProps {
  issue: IssueWithRelations;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  if (d.getFullYear() === now.getFullYear()) {
    return `${months[d.getMonth()]} ${d.getDate()}`;
  }
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_COLORS = ["#8b5cf6", "#3b82f6", "#ec4899", "#f59e0b", "#10b981", "#ef4444", "#6366f1"];

export default function IssueRow({ issue }: IssueRowProps) {
  return (
    <div className="issue-row">
      <div className="issue-row-left">
        <PriorityIcon priority={issue.priority} />
        <span className="issue-identifier">{issue.identifier}</span>
        <StateIcon state={issue.state} />
        <span className="issue-title">{issue.title}</span>
        {issue.project && (
          <span className="issue-project">
            <span className="issue-project-icon">{issue.project.icon}</span>
            {issue.project.name}
          </span>
        )}
      </div>
      <div className="issue-row-right">
        {issue.labels.map((label) => (
          <span key={label.id} className="issue-label" style={{ borderColor: label.color, color: label.color }}>
            <span className="issue-label-dot" style={{ background: label.color }} />
            {label.name}
          </span>
        ))}
        {issue.estimate != null && (
          <span className="issue-estimate">{issue.estimate}</span>
        )}
        {issue.assignee && (
          <span
            className="issue-avatar"
            title={issue.assignee.name}
            style={{ background: AVATAR_COLORS[parseInt(issue.assignee.id.replace("u", ""), 10) % AVATAR_COLORS.length] }}
          >
            {getInitials(issue.assignee.name)}
          </span>
        )}
        <span className="issue-date">{formatDate(issue.createdAt)}</span>
      </div>
    </div>
  );
}
