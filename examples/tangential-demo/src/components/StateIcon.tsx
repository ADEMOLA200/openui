import type { WorkflowState } from "@/data/types";

export function StateIcon({ state }: { state: WorkflowState }) {
  const size = 14;
  const cx = size / 2;
  const cy = size / 2;
  const r = 5;

  switch (state.type) {
    case "triage":
      return (
        <span className="state-icon" title={state.name}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <polygon points="7,2 12,12 2,12" fill="none" stroke={state.color} strokeWidth="1.5" />
          </svg>
        </span>
      );
    case "backlog":
      return (
        <span className="state-icon" title={state.name}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={state.color} strokeWidth="1.5" strokeDasharray="2 2" />
          </svg>
        </span>
      );
    case "unstarted":
      return (
        <span className="state-icon" title={state.name}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={state.color} strokeWidth="1.5" />
          </svg>
        </span>
      );
    case "started":
      return (
        <span className="state-icon" title={state.name}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={state.color} strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={state.color} strokeWidth="1.5"
              strokeDasharray={`${Math.PI * r}`}
              strokeDashoffset={`${Math.PI * r * 0.5}`}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          </svg>
        </span>
      );
    case "completed":
      return (
        <span className="state-icon" title={state.name}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={cx} cy={cy} r={r} fill={state.color} />
            <polyline points="4.5,7 6.5,9 9.5,5" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      );
    case "cancelled":
      return (
        <span className="state-icon" title={state.name}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={state.color} strokeWidth="1.5" />
            <line x1="5" y1="5" x2="9" y2="9" stroke={state.color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="9" y1="5" x2="5" y2="9" stroke={state.color} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      );
  }
}
