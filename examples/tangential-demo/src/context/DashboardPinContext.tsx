"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export interface PinnedDashboard {
  code: string;
  messageId: string;
}

interface DashboardPinContextValue {
  pinnedDashboards: PinnedDashboard[];
  pinDashboard: (code: string, messageId: string) => void;
  unpinDashboard: (messageId: string) => void;
  isPinned: (messageId: string) => boolean;
}

const DashboardPinContext = createContext<DashboardPinContextValue | null>(null);

export function DashboardPinProvider({ children }: { children: React.ReactNode }) {
  const [pinnedDashboards, setPinnedDashboards] = useState<PinnedDashboard[]>([]);

  const pinDashboard = useCallback((code: string, messageId: string) => {
    setPinnedDashboards((prev) => {
      if (prev.some((d) => d.messageId === messageId)) return prev;
      return [...prev, { code, messageId }];
    });
  }, []);

  const unpinDashboard = useCallback((messageId: string) => {
    setPinnedDashboards((prev) => prev.filter((d) => d.messageId !== messageId));
  }, []);

  const isPinned = useCallback(
    (messageId: string) => pinnedDashboards.some((d) => d.messageId === messageId),
    [pinnedDashboards],
  );

  const value = useMemo(
    () => ({ pinnedDashboards, pinDashboard, unpinDashboard, isPinned }),
    [pinnedDashboards, pinDashboard, unpinDashboard, isPinned],
  );

  return <DashboardPinContext.Provider value={value}>{children}</DashboardPinContext.Provider>;
}

export function useDashboardPin() {
  const context = useContext(DashboardPinContext);
  if (!context) {
    throw new Error("useDashboardPin must be used within DashboardPinProvider");
  }
  return context;
}
