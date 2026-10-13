"use client";

import type { Capability, Role } from "@/lib/auth/roles";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  type DateRange,
  type RangePreset,
  rangeFromPreset,
} from "@/lib/admin/dateRange";

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

interface DashboardContextValue {
  user: DashboardUser;
  capabilities: Capability[];
  can: (c: Capability) => boolean;
  range: DateRange;
  setPreset: (p: RangePreset) => void;
  setCustomRange: (from: string, to: string) => void;
  /** Cache-busting key that changes whenever the range changes. */
  rangeKey: string;
  /** Ready-to-append query string: `from=…&to=…&preset=…`. */
  rangeQuery: string;
}

const Ctx = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({
  user,
  capabilities,
  children,
}: {
  user: DashboardUser;
  capabilities: Capability[];
  children: React.ReactNode;
}) {
  const [range, setRange] = useState<DateRange>(() => rangeFromPreset("28d"));

  const setPreset = useCallback((p: RangePreset) => {
    setRange(rangeFromPreset(p));
  }, []);

  const setCustomRange = useCallback((from: string, to: string) => {
    const fromDate = from.includes("T")
      ? new Date(from)
      : new Date(`${from}T00:00:00.000Z`);
    let toDate = to.includes("T")
      ? new Date(to)
      : new Date(`${to}T23:59:59.999Z`);

    if (toDate.getTime() <= fromDate.getTime()) {
      toDate = new Date(fromDate.getTime() + 24 * 60 * 60 * 1000 - 1);
    }

    setRange({
      preset: "custom",
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
    });
  }, []);

  const value = useMemo<DashboardContextValue>(() => {
    const rangeQuery = new URLSearchParams({
      from: range.from,
      to: range.to,
      preset: range.preset,
    }).toString();

    return {
      user,
      capabilities,
      can: (c: Capability) => capabilities.includes(c),
      range,
      setPreset,
      setCustomRange,
      rangeKey: `${range.from}|${range.to}`,
      rangeQuery,
    };
  }, [user, capabilities, range, setPreset, setCustomRange]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(Ctx);

  if (!ctx)
    throw new Error("useDashboard must be used within DashboardProvider");

  return ctx;
}
