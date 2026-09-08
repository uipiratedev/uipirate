"use client";

import { useMemo, useState } from "react";

import { useApi } from "@/lib/admin/useApi";
import { PageHeader, Card, StatePanel } from "@/components/admin/ui";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { fmtInt, fmtPct } from "@/components/admin/format";

interface ClickRow {
  label: string;
  path: string;
  tag?: string;
  href?: string;
  analyticsId?: string;
  section?: string;
  clicks: number;
  uniqueVisitors: number;
  pageViews: number;
  ctr: number;
}

function kindOf(r: ClickRow): string {
  if (
    r.analyticsId &&
    /cta|book|contact|estimate|start|join|buy|demo/i.test(r.analyticsId)
  )
    return "CTA";
  if (r.tag === "button") return "button";
  if (r.tag === "a" || r.href) return "link";

  return "other";
}

export default function ClicksClient() {
  const { data, loading, error, refetch } = useApi<{ rows: ClickRow[] }>(
    "/api/admin/analytics/clicks",
  );
  const [pathFilter, setPathFilter] = useState("");

  const paths = useMemo(
    () => Array.from(new Set((data?.rows || []).map((r) => r.path))).sort(),
    [data],
  );

  const rows = useMemo(
    () =>
      pathFilter
        ? (data?.rows || []).filter((r) => r.path === pathFilter)
        : data?.rows || [],
    [data, pathFilter],
  );

  const columns: Column<ClickRow>[] = [
    {
      key: "label",
      header: "Element",
      render: (r) => (
        <div className="min-w-0">
          <span
            className="block truncate font-medium text-gray-800"
            title={r.label}
          >
            {r.label || "(unlabeled)"}
          </span>
          {r.href ? (
            <span
              className="block truncate text-xs text-gray-400"
              title={r.href}
            >
              → {r.href}
            </span>
          ) : null}
        </div>
      ),
      sortValue: (r) => r.label || "",
    },
    {
      key: "kind",
      header: "Type",
      render: (r) => kindOf(r),
      sortValue: (r) => kindOf(r),
    },
    {
      key: "section",
      header: "Section",
      render: (r) => <span className="text-gray-500">{r.section || "—"}</span>,
      sortValue: (r) => r.section || "",
    },
    {
      key: "path",
      header: "Page",
      render: (r) => <span className="text-gray-500">{r.path}</span>,
      sortValue: (r) => r.path,
    },
    {
      key: "clicks",
      header: "Clicks",
      align: "right",
      render: (r) => fmtInt(r.clicks),
      sortValue: (r) => r.clicks,
    },
    {
      key: "uniqueVisitors",
      header: "Unique",
      align: "right",
      render: (r) => fmtInt(r.uniqueVisitors),
      sortValue: (r) => r.uniqueVisitors,
    },
    {
      key: "ctr",
      header: "CTR",
      align: "right",
      render: (r) => (r.pageViews ? fmtPct(r.ctr, 1) : "—"),
      sortValue: (r) => r.ctr,
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        description="Every tracked click — buttons, links, and CTAs — ranked by volume. CTR is clicks ÷ views of the page it's on."
        title="Clicks & Buttons"
      />

      <StatePanel error={error} loading={loading && !data} onRetry={refetch}>
        <Card
          actions={
            <select
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600"
              value={pathFilter}
              onChange={(e) => setPathFilter(e.target.value)}
            >
              <option value="">All pages</option>
              {paths.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          }
          bodyClassName="p-0"
          title={`${rows.length} elements`}
        >
          <DataTable
            columns={columns}
            initialSort={{ key: "clicks", dir: "desc" }}
            maxHeight={620}
            rowKey={(r, i) => `${r.path}|${r.label}|${i}`}
            rows={rows}
          />
        </Card>
      </StatePanel>
    </div>
  );
}
