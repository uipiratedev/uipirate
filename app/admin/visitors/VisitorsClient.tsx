"use client";

import { useEffect, useState } from "react";

import { useApi } from "@/lib/admin/useApi";
import { PageHeader, Card, StatePanel } from "@/components/admin/ui";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Icon } from "@/components/admin/icons";
import {
  JourneyTimeline,
  type Journey,
} from "@/components/admin/JourneyTimeline";
import { fmtDateTime, fmtDuration, fmtInt } from "@/components/admin/format";

interface VisitorRow {
  visitorId: string;
  identified: boolean;
  email: string | null;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
  sessionCount: number;
  pageViewCount: number;
  totalDurationMs: number;
  country: string | null;
  device: string | null;
  referrerType: string | null;
}

interface VisitorsResponse {
  rows: VisitorRow[];
  total: number;
  page: number;
  pageSize: number;
}

function VisitorDrawer({
  visitorId,
  onClose,
}: {
  visitorId: string;
  onClose: () => void;
}) {
  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    fetch(`/api/admin/visitors/${encodeURIComponent(visitorId)}`, {
      credentials: "same-origin",
    })
      .then(async (r) => {
        const j = await r.json();

        if (!r.ok) throw new Error(j.error || "Failed to load");

        return j;
      })
      .then((j) => alive && setJourney(j.journey))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [visitorId]);

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/30"
        role="presentation"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h2 className="truncate text-sm font-semibold text-gray-900">
            Visitor {journey?.identifiedEmail || visitorId.slice(0, 8)}
          </h2>
          <button
            className="rounded p-1 text-gray-400 hover:bg-gray-100"
            onClick={onClose}
          >
            <Icon.x className="h-5 w-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <StatePanel error={error} loading={loading}>
            <JourneyTimeline journey={journey} />
          </StatePanel>
        </div>
      </aside>
    </div>
  );
}

export default function VisitorsClient() {
  const [identifiedOnly, setIdentifiedOnly] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<string | null>(null);

  const { data, loading, error, refetch } = useApi<VisitorsResponse>(
    "/api/admin/visitors",
    {
      identified: identifiedOnly ? "1" : "",
      q,
      page,
    },
  );

  const columns: Column<VisitorRow>[] = [
    {
      key: "who",
      header: "Visitor",
      render: (r) => (
        <div className="min-w-0">
          <span className="block truncate font-medium text-gray-900">
            {r.email || `anon ${r.visitorId.slice(0, 8)}`}
          </span>
          <span className="block truncate text-xs text-gray-400">
            {r.referrerType || "direct"}
            {r.country ? ` · ${r.country}` : ""}
            {r.device ? ` · ${r.device}` : ""}
          </span>
        </div>
      ),
    },
    {
      key: "sessionCount",
      header: "Visits",
      align: "right",
      render: (r) => fmtInt(r.sessionCount),
      sortValue: (r) => r.sessionCount,
    },
    {
      key: "pageViewCount",
      header: "Pages",
      align: "right",
      render: (r) => fmtInt(r.pageViewCount),
      sortValue: (r) => r.pageViewCount,
    },
    {
      key: "totalDurationMs",
      header: "Time",
      align: "right",
      render: (r) => fmtDuration(r.totalDurationMs),
      sortValue: (r) => r.totalDurationMs,
    },
    {
      key: "lastSeenAt",
      header: "Last seen",
      align: "right",
      render: (r) => (r.lastSeenAt ? fmtDateTime(r.lastSeenAt) : "—"),
      sortValue: (r) => r.lastSeenAt || "",
    },
  ];

  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.pageSize))
    : 1;

  return (
    <div className="space-y-5">
      <PageHeader
        description="Every visitor tracked with consent — identified (submitted a form) or anonymous. Click a row for the full journey."
        title="Visitors"
      />

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            checked={identifiedOnly}
            type="checkbox"
            onChange={(e) => {
              setIdentifiedOnly(e.target.checked);
              setPage(1);
            }}
          />
          Identified only
        </label>
        <input
          className="min-w-[220px] flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
          placeholder="Search email or visitor id…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <StatePanel error={error} loading={loading && !data} onRetry={refetch}>
        <Card
          bodyClassName="p-0"
          title={data ? `${fmtInt(data.total)} visitors` : "Visitors"}
        >
          <DataTable
            columns={columns}
            initialSort={{ key: "lastSeenAt", dir: "desc" }}
            maxHeight={560}
            rowKey={(r) => r.visitorId}
            rows={data?.rows || []}
            onRowClick={(r) => setOpen(r.visitorId)}
          />
        </Card>

        {totalPages > 1 ? (
          <div className="flex items-center justify-end gap-2 text-sm">
            <button
              className="rounded border border-gray-200 px-2 py-1 disabled:opacity-40"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>
            <span className="text-gray-500">
              {page} / {totalPages}
            </span>
            <button
              className="rounded border border-gray-200 px-2 py-1 disabled:opacity-40"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        ) : null}
      </StatePanel>

      {open ? (
        <VisitorDrawer visitorId={open} onClose={() => setOpen(null)} />
      ) : null}
    </div>
  );
}
