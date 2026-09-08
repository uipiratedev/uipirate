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

  return (
    <div className="space-y-5">
      <PageHeader
        description={`Welcome back, ${userName.split(" ")[0]}. First-party analytics for the marketing site.`}
        title="Overview"
      />

      <StatePanel error={error} loading={loading && !data} onRetry={refetch}>
        {s ? (
          <KpiRow
            items={[
              { label: "Visitors", value: fmtCompact(s.visitors) },
              { label: "Sessions", value: fmtCompact(s.sessions) },
              { label: "Pageviews", value: fmtCompact(s.pageviews) },
              {
                label: "Avg. visit",
                value: fmtDuration(s.avgSessionDurationMs),
              },
              { label: "Bounce rate", value: fmtPct(s.bounceRate, 0) },
              { label: "New leads", value: fmtInt(s.newLeads) },
            ]}
          />
        ) : null}

        <div className="mt-5">
          <Card subtitle="Visitors · Sessions · Pageviews" title="Traffic">
            <TrendChart
              data={data?.series || []}
              series={[
                { key: "visitors", label: "Visitors" },
                { key: "sessions", label: "Sessions" },
                { key: "pageviews", label: "Pageviews" },
              ]}
            />
          </Card>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Card
            actions={
              <Link
                className="text-xs font-medium text-blue-600"
                href="/admin/analytics/pages"
              >
                All pages →
              </Link>
            }
            title="Top pages"
          >
            <ul className="divide-y divide-gray-100 text-sm">
              {(data?.topPages || []).map((p) => (
                <li
                  key={p.path}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <span className="truncate text-gray-700" title={p.path}>
                    {p.path}
                  </span>
                  <span className="flex shrink-0 items-center gap-4 tabular-nums text-gray-500">
                    <span title="avg time on page">
                      {fmtDuration(p.avgDwellMs)}
                    </span>
                    <span className="font-medium text-gray-900">
                      {fmtInt(p.views)}
                    </span>
                  </span>
                </li>
              ))}
              {!data?.topPages?.length ? (
                <li className="py-6 text-center text-gray-400">
                  No pageviews yet.
                </li>
              ) : null}
            </ul>
          </Card>

          <Card
            actions={
              <Link
                className="text-xs font-medium text-blue-600"
                href="/admin/analytics/clicks"
              >
                All clicks →
              </Link>
            }
            title="Most clicked"
          >
            <ul className="divide-y divide-gray-100 text-sm">
              {(data?.topClicks || []).map((c, i) => (
                <li
                  key={`${c.label}-${i}`}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <span className="min-w-0">
                    <span
                      className="block truncate text-gray-700"
                      title={c.label}
                    >
                      {c.label || "(unlabeled)"}
                    </span>
                    <span
                      className="block truncate text-xs text-gray-400"
                      title={c.path}
                    >
                      {c.path}
                    </span>
                  </span>
                  <span className="shrink-0 font-medium tabular-nums text-gray-900">
                    {fmtInt(c.clicks)}
                  </span>
                </li>
              ))}
              {!data?.topClicks?.length ? (
                <li className="py-6 text-center text-gray-400">
                  No clicks tracked yet.
                </li>
              ) : null}
            </ul>
          </Card>

          <Card subtitle="Sessions by channel" title="Traffic sources">
            <Donut
              data={(data?.sources || []).map((r) => ({
                name: r.key,
                value: r.sessions,
              }))}
            />
            <ul className="mt-2 space-y-1 text-sm">
              {(data?.sources || []).map((r) => (
                <li key={r.key} className="flex justify-between text-gray-600">
                  <span className="capitalize">{r.key}</span>
                  <span className="tabular-nums">{fmtInt(r.sessions)}</span>
                </li>
              ))}
            </ul>
          </Card>

          {can("view:leads") ? (
            <Card
              actions={
                <Link
                  className="text-xs font-medium text-blue-600"
                  href="/admin/leads"
                >
                  Inbox →
                </Link>
              }
              title="Recent leads"
            >
              <ul className="divide-y divide-gray-100 text-sm">
                {(data?.recentLeads || []).map((l) => (
                  <li
                    key={l.id}
                    className="flex items-center justify-between gap-3 py-2"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-gray-900">
                        {l.name}
                      </span>
                      <span className="block truncate text-xs text-gray-400">
                        {l.kind} · {fmtDate(l.createdAt)}
                      </span>
                    </span>
                    <StatusChip status={l.status} />
                  </li>
                ))}
                {!data?.recentLeads?.length ? (
                  <li className="py-6 text-center text-gray-400">
                    No leads yet.
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
