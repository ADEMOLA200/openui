import type { IssuePriority } from "@/data/types";

const PRIORITY_CONFIG: Record<IssuePriority, { label: string; bars: number; color: string }> = {
  0: { label: "No priority", bars: 0, color: "#6b7280" },
  1: { label: "Urgent", bars: 4, color: "#ef4444" },
  2: { label: "High", bars: 3, color: "#f59e0b" },
  3: { label: "Medium", bars: 2, color: "#6b7280" },
  4: { label: "Low", bars: 1, color: "#6b7280" },
};

export function PriorityIcon({ priority }: { priority: IssuePriority }) {
  const config = PRIORITY_CONFIG[priority];

  if (priority === 0) {
    return (
      <span className="priority-icon" title={config.label}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <line x1="3" y1="7" x2="11" y2="7" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1.5 2" />
        </svg>
      </span>
    );
  }

  return (
    <span className="priority-icon" title={config.label}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={2 + i * 3}
            y={10 - (i + 1) * 2}
            width="2"
            height={(i + 1) * 2}
            rx="0.5"
            fill={i < config.bars ? config.color : "#3f3f46"}
          />
        ))}
      </svg>
    </span>
  );
}
