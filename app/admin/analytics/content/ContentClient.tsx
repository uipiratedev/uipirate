"use client";

import { useMemo, useState } from "react";

import { useApi } from "@/lib/admin/useApi";
import { PageHeader, Card, StatePanel } from "@/components/admin/ui";
import { KpiRow } from "@/components/admin/KpiRow";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { fmtInt, fmtPct } from "@/components/admin/format";

type ContentFlag =
  | "traffic-not-indexed"
  | "ranks-low-ctr"
  | "impressions-no-clicks"
  | "indexed-no-traffic";

interface ContentRow {
  path: string;
  hits: number;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number | null;
  indexed: boolean | null;
  flags: ContentFlag[];
}

/** Ordered by urgency — the first flag on a row is its headline issue. */
const FLAG_META: Record<
  ContentFlag,
  { label: string; tone: string; why: string }
> = {
  "traffic-not-indexed": {
    label: "Traffic, not indexed",
    tone: "bg-red-50 text-red-700 ring-red-200",
    why: "People find this page without Google. Getting it indexed is the single biggest win available.",
  },
  "ranks-low-ctr": {
    label: "Ranks, low CTR",
    tone: "bg-amber-50 text-amber-800 ring-amber-200",
    why: "It ranks on page one but few click. The title and description are not earning the click.",
  },
  "impressions-no-clicks": {
    label: "Shown, never clicked",
    tone: "bg-orange-50 text-orange-700 ring-orange-200",
    why: "Google shows it but nobody clicks — usually the page does not match what they searched for.",
  },
  "indexed-no-traffic": {
    label: "Indexed, no traffic",
    tone: "bg-sky-50 text-sky-700 ring-sky-200",
    why: "Indexed but nobody arrives. Thin or off-target content.",
  },
};

function FlagChip({ flag }: { flag: ContentFlag }) {
  const m = FLAG_META[flag];

  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${m.tone}`}
      title={m.why}
    >
      {m.label}
    </span>
  );
}

export default function ContentClient() {
  const { data, loading, error, refetch } = useApi<{
    rows: ContentRow[];
    searchMocked: boolean;
    hasTrafficData: boolean;
  }>("/api/admin/analytics/content");

  const [onlyFlagged, setOnlyFlagged] = useState(false);

  const rows = useMemo(() => {
    const all = data?.rows || [];

    return onlyFlagged ? all.filter((r) => r.flags.length > 0) : all;
  }, [data, onlyFlagged]);

  const counts = useMemo(() => {
    const c = { flagged: 0, notIndexed: 0, lowCtr: 0 };

    for (const r of data?.rows || []) {
      if (r.flags.length) c.flagged++;
      if (r.flags.includes("traffic-not-indexed")) c.notIndexed++;
      if (r.flags.includes("ranks-low-ctr")) c.lowCtr++;
    }

    return c;
  }, [data]);

  const columns: Column<ContentRow>[] = [
    {
      key: "path",
      header: "Page",
      render: (r) => (
        <span className="block max-w-[22rem] truncate font-medium" title={r.path}>
          {r.path}
        </span>
      ),
      sortValue: (r) => r.path,
    },
    {
      key: "hits",
      header: "Visits",
      align: "right",
      render: (r) => fmtInt(r.hits),
      sortValue: (r) => r.hits,
    },
    {
      key: "impressions",
      header: "Impressions",
      align: "right",
      render: (r) => fmtInt(r.impressions),
      sortValue: (r) => r.impressions,
    },
    {
      key: "clicks",
      header: "Clicks",
      align: "right",
      render: (r) => fmtInt(r.clicks),
      sortValue: (r) => r.clicks,
    },
    {
      key: "ctr",
      header: "CTR",
      align: "right",
      render: (r) => (r.impressions ? fmtPct(r.ctr) : "—"),
      sortValue: (r) => r.ctr,
    },
    {
      key: "position",
      header: "Position",
      align: "right",
      render: (r) => (r.position == null ? "—" : r.position.toFixed(1)),
      // Unranked pages sort last, not first.
      sortValue: (r) => r.position ?? 9999,
    },
    {
      key: "indexed",
      header: "Indexed",
      render: (r) =>
        r.indexed == null ? (
          <span className="text-gray-400" title="Not yet inspected">
            —
          </span>
        ) : r.indexed ? (
          <span className="text-emerald-600">Yes</span>
        ) : (
          <span className="font-semibold text-red-600">No</span>
        ),
      sortValue: (r) => (r.indexed === false ? 0 : r.indexed === true ? 2 : 1),
    },
    {
      key: "flags",
      header: "Needs attention",
      render: (r) => (
        <span className="flex flex-wrap gap-1">
          {r.flags.map((f) => (
            <FlagChip key={f} flag={f} />
          ))}
        </span>
      ),
      sortValue: (r) => -r.flags.length,
    },
  ];

  return (
    <>
      <PageHeader
        description="Your traffic, Search Console and index status on one row — so a page that earns visits without being indexed cannot hide."
        title="Content performance"
      />

      <StatePanel
        empty={!loading && !error && (data?.rows?.length ?? 0) === 0}
        emptyText="No content data yet. Server-side counting must be enabled and Search Console connected."
        error={error}
        loading={loading}
        onRetry={refetch}
      >
        {data && !data.hasTrafficData && (
          <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50/70 p-3.5 text-xs text-sky-800">
            <span className="font-semibold">
              Server-side counting has not recorded anything yet.
            </span>{" "}
            The Visits column reads zero and traffic-based flags are withheld
            until data arrives. Set <code>CRON_SECRET</code> (or{" "}
            <code>INTERNAL_ANALYTICS_SECRET</code>) in the environment to turn
            it on.
          </div>
        )}

        {data?.searchMocked && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-800">
            <span className="font-semibold">Search data is placeholder.</span>{" "}
            Impressions, clicks, CTR and position below are sample values —
            Search Console returned no rows for this range.
          </div>
        )}

        <KpiRow
          items={[
            {
              label: "Pages",
              value: fmtInt(data?.rows?.length ?? 0),
              hint: "With traffic or search activity",
            },
            {
              label: "Need attention",
              value: fmtInt(counts.flagged),
              hint: "At least one flag raised",
            },
            {
              label: "Traffic, not indexed",
              value: fmtInt(counts.notIndexed),
              hint: "Highest-priority fix",
            },
            {
              label: "Ranks, low CTR",
              value: fmtInt(counts.lowCtr),
              hint: "Rewrite title & description",
            },
          ]}
        />

        <div className="mt-5">
          <Card
            actions={
              <label className="flex cursor-pointer select-none items-center gap-2 text-xs font-medium text-gray-600">
                <input
                  checked={onlyFlagged}
                  className="h-3.5 w-3.5 rounded border-gray-300"
                  type="checkbox"
                  onChange={(e) => setOnlyFlagged(e.target.checked)}
                />
                Only pages needing attention
              </label>
            }
            subtitle="Hover a flag to see what it means"
            title="Pages"
          >
            <DataTable
              columns={columns}
              initialSort={{ key: "hits", dir: "desc" }}
              rowKey={(r) => r.path}
              rows={rows}
            />
          </Card>
        </div>
      </StatePanel>
    </>
  );
}
