"use client";

import Link from "next/link";

import { useApi } from "@/lib/admin/useApi";
import { useDashboard } from "@/lib/admin/DashboardContext";
import {
  PageHeader,
  Card,
  StatePanel,
  StatusChip,
} from "@/components/admin/ui";
import { KpiRow } from "@/components/admin/KpiRow";
import { TrendChart, Donut } from "@/components/admin/charts";
import { Icon } from "@/components/admin/icons";
import {
  fmtInt,
  fmtCompact,
  fmtDuration,
  fmtPct,
  fmtDate,
} from "@/components/admin/format";

interface OverviewData {
  summary: {
    visitors: number;
    sessions: number;
    pageviews: number;
    avgSessionDurationMs: number;
    bounceRate: number;
    pagesPerSession: number;
    newLeads: number;
  };
  series: Array<{
    bucket: string;
    pageviews: number;
    visitors: number;
    sessions: number;
  }>;
  sources: Array<{ key: string; sessions: number; visitors: number }>;
  topPages: Array<{
    path: string;
    views: number;
    uniqueVisitors: number;
    avgDwellMs: number;
  }>;
  topClicks: Array<{
    label: string;
    path: string;
    clicks: number;
    ctr: number;
  }>;
  recentLeads: Array<{
    id: string;
    kind: string;
    name: string;
    email: string;
    status: string;
    createdAt: string;
    detail: string;
  }>;
  canViewLeads: boolean;
}

export default function OverviewClient({ userName }: { userName: string }) {
  const { can } = useDashboard();
  const { data, loading, error, refetch } = useApi<OverviewData>(
    "/api/admin/overview",
  );

  const s = data?.summary;
  const firstName = userName.split(" ")[0] || "User";

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <button
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50"
            onClick={refetch}
          >
            <Icon.refresh className="h-3.5 w-3.5 text-gray-400" />
            Refresh Stats
          </button>
        }
        badge="Live Analytics"
        description={`Welcome back, ${firstName}. Real-time first-party analytics and search performance for UI Pirate.`}
        title="Overview"
      />

      <StatePanel error={error} loading={loading && !data} onRetry={refetch}>
        {s ? (
          <KpiRow
            items={[
              { label: "Visitors", value: fmtCompact(s.visitors), hint: "Unique users" },
              { label: "Sessions", value: fmtCompact(s.sessions), hint: "Total visits" },
              { label: "Pageviews", value: fmtCompact(s.pageviews), hint: "Content views" },
              {
                label: "Avg. Duration",
                value: fmtDuration(s.avgSessionDurationMs),
                hint: "Dwell per visit",
              },
              { label: "Bounce Rate", value: fmtPct(s.bounceRate, 0), hint: "Single-page exits" },
              { label: "New Leads", value: fmtInt(s.newLeads), hint: "Form submissions" },
            ]}
          />
        ) : null}

        <div className="mt-6">
          <Card
            actions={
              <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                <span>Pageviews</span>
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 ml-2" />
                <span>Visitors</span>
              </div>
            }
            subtitle="Traffic trends across selected period"
            title="Performance Trends"
          >
            <div className="pt-2">
              <TrendChart
                data={data?.series || []}
                series={[
                  { key: "visitors", label: "Visitors" },
                  { key: "sessions", label: "Sessions" },
                  { key: "pageviews", label: "Pageviews" },
                ]}
              />
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Top Pages */}
          <Card
            actions={
              <Link
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-black transition-colors"
                href="/admin/analytics/pages"
              >
                All pages <span aria-hidden="true">→</span>
              </Link>
            }
            subtitle="Highest volume destination URLs"
            title="Top Pages"
          >
            <ul className="divide-y divide-gray-100/90 text-sm">
              {(data?.topPages || []).map((p, idx) => (
                <li
                  key={p.path}
                  className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-slate-50/50 -mx-2 px-2 rounded-xl"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gray-100 font-mono text-[11px] font-bold text-gray-500">
                      {idx + 1}
                    </span>
                    <span className="truncate font-mono text-xs text-gray-800" title={p.path}>
                      {p.path}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-4 tabular-nums text-gray-500 text-xs font-mono">
                    <span title="Average dwell time">
                      {fmtDuration(p.avgDwellMs)}
                    </span>
                    <span className="font-bold text-gray-900 bg-gray-100/80 px-2 py-0.5 rounded-md">
                      {fmtInt(p.views)}
                    </span>
                  </div>
                </li>
              ))}
              {!data?.topPages?.length ? (
                <li className="py-8 text-center text-xs text-gray-400">
                  No pageviews recorded yet.
                </li>
              ) : null}
            </ul>
          </Card>

          {/* Top Clicks */}
          <Card
            actions={
              <Link
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-black transition-colors"
                href="/admin/analytics/clicks"
              >
                All clicks <span aria-hidden="true">→</span>
              </Link>
            }
            subtitle="Most engaged CTAs & interactive elements"
            title="Most Clicked"
          >
            <ul className="divide-y divide-gray-100/90 text-sm">
              {(data?.topClicks || []).map((c, i) => (
                <li
                  key={`${c.label}-${i}`}
                  className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-slate-50/50 -mx-2 px-2 rounded-xl"
                >
                  <div className="min-w-0">
                    <span
                      className="block truncate font-medium text-xs text-gray-900"
                      title={c.label}
                    >
                      {c.label || "(unlabeled)"}
                    </span>
                    <span
                      className="block truncate font-mono text-[11px] text-gray-400"
                      title={c.path}
                    >
                      {c.path}
                    </span>
                  </div>
                  <span className="shrink-0 font-mono text-xs font-bold tabular-nums text-gray-900 bg-gray-100/80 px-2 py-0.5 rounded-md">
                    {fmtInt(c.clicks)} clicks
                  </span>
                </li>
              ))}
              {!data?.topClicks?.length ? (
                <li className="py-8 text-center text-xs text-gray-400">
                  No click events recorded yet.
                </li>
              ) : null}
            </ul>
          </Card>

          {/* Traffic Sources */}
          <Card subtitle="Session breakdown by acquisition channel" title="Traffic Channels">
            <div className="flex flex-col items-center">
              <Donut
                data={(data?.sources || []).map((r) => ({
                  name: r.key,
                  value: r.sessions,
                }))}
              />
            </div>
            <ul className="mt-4 space-y-1.5 border-t border-gray-100 pt-3 text-xs">
              {(data?.sources || []).map((r) => (
                <li key={r.key} className="flex justify-between items-center text-gray-600">
                  <span className="capitalize font-medium text-gray-700">{r.key}</span>
                  <span className="tabular-nums font-mono font-bold text-gray-900">
                    {fmtInt(r.sessions)}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Recent Leads */}
          {can("view:leads") ? (
            <Card
              actions={
                <Link
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-black transition-colors"
                  href="/admin/leads"
                >
                  Inbox <span aria-hidden="true">→</span>
                </Link>
              }
              subtitle="Latest submissions and contact inquiries"
              title="Recent Leads"
            >
              <ul className="divide-y divide-gray-100/90 text-sm">
                {(data?.recentLeads || []).map((l) => (
                  <li
                    key={l.id}
                    className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-slate-50/50 -mx-2 px-2 rounded-xl"
                  >
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-semibold text-gray-900">
                        {l.name}
                      </span>
                      <span className="block truncate text-[11px] text-gray-400">
                        {l.kind} · {fmtDate(l.createdAt)}
                      </span>
                    </div>
                    <StatusChip status={l.status} />
                  </li>
                ))}
                {!data?.recentLeads?.length ? (
                  <li className="py-8 text-center text-xs text-gray-400">
                    No leads recorded yet.
                  </li>
                ) : null}
              </ul>
            </Card>
          ) : null}
        </div>
      </StatePanel>
    </div>
  );
}
