"use client";

import { useState } from "react";

import { useApi } from "@/lib/admin/useApi";
import { PageHeader, Card, StatePanel } from "@/components/admin/ui";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { fmtDuration, fmtInt, fmtPct } from "@/components/admin/format";
import { BreakdownBars } from "@/components/admin/charts";

interface PageRow {
  path: string;
  views: number;
  uniqueVisitors: number;
  avgDwellMs: number;
  avgScrollDepth: number;
  entrances: number;
  exits: number;
  bounceRate: number;
}

interface ClickRow {
  label: string;
  clicks: number;
  ctr: number;
}

export default function PagesClient() {
  const { data, loading, error, refetch } = useApi<{ rows: PageRow[] }>(
    "/api/admin/analytics/pages",
  );
  const [selected, setSelected] = useState<string | null>(null);

  const clicks = useApi<{ rows: ClickRow[] }>(
    selected ? "/api/admin/analytics/clicks" : null,
    selected ? { path: selected } : undefined,
  );

  const columns: Column<PageRow>[] = [
    {
      key: "path",
      header: "Page",
      render: (r) => <span className="text-gray-700">{r.path}</span>,
      sortValue: (r) => r.path,
    },
    {
      key: "views",
      header: "Views",
      align: "right",
      render: (r) => fmtInt(r.views),
      sortValue: (r) => r.views,
    },
    {
      key: "uniqueVisitors",
      header: "Unique",
      align: "right",
      render: (r) => fmtInt(r.uniqueVisitors),
      sortValue: (r) => r.uniqueVisitors,
    },
    {
      key: "avgDwellMs",
      header: "Avg time",
      align: "right",
      render: (r) => fmtDuration(r.avgDwellMs),
      sortValue: (r) => r.avgDwellMs,
    },
    {
      key: "avgScrollDepth",
      header: "Scroll",
      align: "right",
      render: (r) => `${r.avgScrollDepth}%`,
      sortValue: (r) => r.avgScrollDepth,
    },
    {
      key: "bounceRate",
      header: "Bounce",
      align: "right",
      render: (r) => fmtPct(r.bounceRate, 0),
      sortValue: (r) => r.bounceRate,
    },
    {
      key: "entrances",
      header: "Entr.",
      align: "right",
      render: (r) => fmtInt(r.entrances),
      sortValue: (r) => r.entrances,
    },
    {
      key: "exits",
      header: "Exits",
      align: "right",
      render: (r) => fmtInt(r.exits),
      sortValue: (r) => r.exits,
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        description="Every page by views, time on page, scroll depth, and bounce."
        title="Pages"
      />

      <StatePanel error={error} loading={loading && !data} onRetry={refetch}>
        <Card
          bodyClassName="p-0"
          subtitle="Click a row to see what visitors clicked on that page"
          title={`${data?.rows.length || 0} pages`}
        >
          <DataTable
            columns={columns}
            initialSort={{ key: "views", dir: "desc" }}
            maxHeight={560}
            rowKey={(r) => r.path}
            rows={data?.rows || []}
            onRowClick={(r) => setSelected(r.path)}
          />
        </Card>

        {selected ? (
          <Card
            actions={
              <button
                className="text-xs text-gray-400 hover:text-gray-600"
                onClick={() => setSelected(null)}
              >
                Clear
              </button>
            }
            subtitle={selected}
            title="Clicks on this page"
          >
            <StatePanel
              empty={!clicks.data?.rows.length}
              error={clicks.error}
              loading={clicks.loading}
            >
              <BreakdownBars
                labelKey="label"
                rows={(clicks.data?.rows || []).map((r) => ({
                  label: r.label || "(unlabeled)",
                  clicks: r.clicks,
                }))}
                valueKey="clicks"
              />
            </StatePanel>
          </Card>
        ) : null}
      </StatePanel>
    </div>
  );
}
