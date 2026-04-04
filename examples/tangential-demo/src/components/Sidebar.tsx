"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  Inbox,
  CircleUser,
  Layers3,
  FolderKanban,
  LayoutDashboard,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  CircleDot,
  CalendarRange,
  Eye,
  Plus,
  Settings,
} from "lucide-react";
import type { Team } from "@/data/types";

interface SidebarProps {
  teams: Team[];
  activeTeamId: string;
  onTeamChange: (teamId: string) => void;
}

export default function Sidebar({ teams, activeTeamId, onTeamChange }: SidebarProps) {
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>(
    () => Object.fromEntries(teams.map((t) => [t.id, true])),
  );
  const [expandedCycles, setExpandedCycles] = useState(false);

  const activeTeam = teams.find((t) => t.id === activeTeamId);

  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <button className="sidebar-workspace-btn">
          <span className="sidebar-workspace-icon">T</span>
          <span className="sidebar-workspace-name">Tangential</span>
          <ChevronDown size={12} />
        </button>
        <div className="sidebar-header-actions">
          <button className="sidebar-icon-btn"><Search size={16} /></button>
          <button className="sidebar-icon-btn sidebar-notif-btn">
            <Bell size={16} />
            <span className="sidebar-notif-badge">12</span>
          </button>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="sidebar-nav">
        <a className="sidebar-nav-item" href="#">
          <Inbox size={16} />
          <span>Inbox</span>
        </a>
        <a className="sidebar-nav-item" href="#">
          <CircleUser size={16} />
          <span>My Issues</span>
        </a>
      </nav>

      {/* Workspace */}
      <div className="sidebar-section">
        <div className="sidebar-section-label">Workspace</div>
        <a className="sidebar-nav-item" href="#"><Layers3 size={16} /><span>Initiatives</span></a>
        <a className="sidebar-nav-item" href="#"><FolderKanban size={16} /><span>Projects</span></a>
        <a className="sidebar-nav-item" href="#"><Eye size={16} /><span>Views</span></a>
        <a className="sidebar-nav-item" href="#"><MoreHorizontal size={16} /><span>More</span></a>
      </div>

      {/* Teams */}
      <div className="sidebar-section">
        <div className="sidebar-section-label">
          Your teams
          <button className="sidebar-icon-btn sidebar-add-btn"><Plus size={14} /></button>
        </div>
        {teams.map((team) => (
          <div key={team.id}>
            <button
              className="sidebar-team-header"
              onClick={() => setExpandedTeams((prev) => ({ ...prev, [team.id]: !prev[team.id] }))}
            >
              {expandedTeams[team.id] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              <span className="sidebar-team-icon" style={{ background: team.color }}>{team.key[0]}</span>
              <span className="sidebar-team-name">{team.name}</span>
            </button>
            {expandedTeams[team.id] && (
              <div className="sidebar-team-items">
                <button
                  className={`sidebar-nav-item ${activeTeamId === team.id ? "active" : ""}`}
                  onClick={() => onTeamChange(team.id)}
                >
                  <CircleDot size={16} />
                  <span>Issues</span>
                </button>
                <div>
                  <button
                    className="sidebar-nav-item"
                    onClick={() => setExpandedCycles(!expandedCycles)}
                  >
                    <CalendarRange size={16} />
                    <span>Cycles</span>
                    {expandedCycles ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  </button>
                  {expandedCycles && team.cycles.length > 0 && (
                    <div className="sidebar-team-items">
                      {team.cycles.map((cycle) => (
                        <a key={cycle.id} className="sidebar-nav-item sub" href="#">
                          <span>{cycle.name ?? `Cycle ${cycle.number}`}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <a className="sidebar-nav-item" href="#"><FolderKanban size={16} /><span>Projects</span></a>
                <a className="sidebar-nav-item" href="#"><Eye size={16} /><span>Views</span></a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="sidebar-icon-btn"><Settings size={16} /></button>
      </div>
    </aside>
  );
}
