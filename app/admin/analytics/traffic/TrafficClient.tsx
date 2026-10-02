"use client";

import { useApi } from "@/lib/admin/useApi";
import { PageHeader, Card, StatePanel } from "@/components/admin/ui";
import { KpiRow } from "@/components/admin/KpiRow";
import { TrendChart, BreakdownBars } from "@/components/admin/charts";
import { DataTable, type Column } from "@/components/admin/DataTable";
import {
  fmtCompact,
  fmtDuration,
  fmtInt,
  fmtPct,
} from "@/components/admin/format";

interface Row {
  key: string;
  sessions: number;
  visitors: number;
}

interface TrafficData {
  summary: {
    visitors: number;
    sessions: number;
    pageviews: number;
    avgSessionDurationMs: number;
    bounceRate: number;
    pagesPerSession: number;
  };
  series: Array<{
    bucket: string;
    pageviews: number;
    visitors: number;
    sessions: number;
  }>;
  source: Row[];
  country: Row[];
  deviceType: Row[];
  browser: Row[];
  os: Row[];
  landing: Row[];
  newReturning: { new: number; returning: number };
  referrers: Array<{ referrer: string; sessions: number }>;
}

const breakdownCols: Column<Row>[] = [
  {
    key: "key",
    header: "",
    render: (r) => r.key || "(none)",
    sortValue: (r) => r.key,
  },
  {
    key: "sessions",
    header: "Sessions",
    align: "right",
    render: (r) => fmtInt(r.sessions),
    sortValue: (r) => r.sessions,
  },
  {
    key: "visitors",
    header: "Visitors",
    align: "right",
    render: (r) => fmtInt(r.visitors),
    sortValue: (r) => r.visitors,
  },
];

export default function TrafficClient() {
  const { data, loading, error, refetch } = useApi<TrafficData>(
    "/api/admin/analytics/traffic",
  );

  return (
    <div className="space-y-5">
      <PageHeader
        description="Where visitors come from and what they use."
        title="Traffic"
      />

      <StatePanel error={error} loading={loading && !data} onRetry={refetch}>
        {data ? (
          <KpiRow
            items={[
              { label: "Visitors", value: fmtCompact(data.summary.visitors) },
              { label: "Sessions", value: fmtCompact(data.summary.sessions) },
              { label: "Pageviews", value: fmtCompact(data.summary.pageviews) },
              {
                label: "Avg. visit",
                value: fmtDuration(data.summary.avgSessionDurationMs),
              },
              { label: "Bounce", value: fmtPct(data.summary.bounceRate, 0) },
              {
                label: "New / returning",
                value: `${fmtInt(data.newReturning.new)} / ${fmtInt(data.newReturning.returning)}`,
              },
            ]}
          />
        ) : null}

        <div className="mt-5">
          <Card title="Sessions & visitors over time">
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
          <Card subtitle="How sessions arrived" title="Channels">
            <BreakdownBars rows={data?.source || []} />
          </Card>
          <Card title="Top referrers">
            <BreakdownBars
              labelKey="referrer"
              rows={data?.referrers || []}
              valueKey="sessions"
            />
          </Card>
          <Card title="Countries">
            <DataTable
              columns={breakdownCols}
              initialSort={{ key: "sessions", dir: "desc" }}
              rowKey={(r) => r.key}
              rows={data?.country || []}
            />
          </Card>
          <Card title="Landing pages">
            <DataTable
              columns={breakdownCols}
              initialSort={{ key: "sessions", dir: "desc" }}
              rowKey={(r) => r.key}
              rows={data?.landing || []}
            />
          </Card>
          <Card title="Devices">
            <BreakdownBars rows={data?.deviceType || []} />
          </Card>
          <Card title="Browsers">
            <BreakdownBars rows={data?.browser || []} />
          </Card>
        </div>
      </StatePanel>
    </div>
  );
}
