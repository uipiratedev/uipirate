"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Chip,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Input,
  Pagination,
} from "@heroui/react";

import { useApi } from "@/lib/admin/useApi";
import { PageHeader, Card, StatePanel } from "@/components/admin/ui";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Icon } from "@/components/admin/icons";
import {
  JourneyTimeline,
  type Journey,
} from "@/components/admin/JourneyTimeline";
import { fmtDateTime, fmtDuration, fmtInt } from "@/components/admin/format";
import { useDrawerScrollLock } from "@/hooks/useDrawerScrollLock";

interface VisitorRow {
  visitorId: string;
  identified: boolean;
  email: string | null;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
  sessionCount: number;
  pageViewCount: number;
  clickCount?: number;
  totalDurationMs: number;
  country: string | null;
  region: string | null;
  city: string | null;
  device: string | null;
  os: string | null;
  browser: string | null;
  referrerType: string | null;
  firstReferrer: string | null;
  firstLandingPath: string | null;
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
  useDrawerScrollLock({ enabled: true, onClose });

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
    <Drawer
      backdrop="blur"
      classNames={{
        base: "max-h-screen bg-white shadow-2xl",
        body: "p-0",
      }}
      isOpen={Boolean(visitorId)}
      placement="right"
      size="2xl"
      onOpenChange={(open) => !open && onClose()}
    >
      <DrawerContent>
        {() => (
          <>
            <DrawerHeader className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white/95 px-6 py-4 backdrop-blur">
              <div className="min-w-0 pr-3">
                <h2 className="truncate text-base font-semibold tracking-tight text-gray-900">
                  Visitor Dossier: {journey?.identifiedEmail || visitorId.slice(0, 8)}
                </h2>
                <p className="text-xs text-gray-400">
                  Complete multi-session journey, location attribution and events
                </p>
              </div>
            </DrawerHeader>
            <DrawerBody
              className="overflow-y-auto overscroll-contain px-6 py-5 scrollbar-thin"
              data-lenis-prevent="true"
            >
              <StatePanel error={error} loading={loading}>
                <JourneyTimeline journey={journey} />
              </StatePanel>
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
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
      header: "Visitor Profile",
      width: "24%",
      render: (r) => (
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-semibold text-xs text-gray-900">
              {r.email || `anon ${r.visitorId.slice(0, 8)}`}
            </span>
            {r.identified ? (
              <span className="shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                Identified
              </span>
            ) : (
              <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                Anon
              </span>
            )}
          </div>
          <span className="block truncate font-mono text-[11px] text-gray-400 mt-0.5">
            ID: {r.visitorId.slice(0, 16)}…
          </span>
        </div>
      ),
      sortValue: (r) => r.email || r.visitorId,
    },
    {
      key: "location",
      header: "Location",
      width: "18%",
      render: (r) => {
        const parts = [r.city, r.region, r.country].filter(Boolean);
        const text = parts.join(", ");
        return (
          <div className="min-w-0">
            <span className="block font-medium text-xs text-gray-800 truncate" title={text}>
              {r.city ? `${r.city}, ${r.country || ""}` : r.country || "—"}
            </span>
            {r.region && r.city ? (
              <span className="block text-[10px] text-gray-400 truncate">
                {r.region}
              </span>
            ) : null}
          </div>
        );
      },
      sortValue: (r) => r.country || "",
    },
    {
      key: "device",
      header: "Device & Browser",
      width: "16%",
      render: (r) => {
        const sw = [r.browser, r.os].filter(Boolean).join(" · ");
        return (
          <div className="min-w-0">
            <span className="block font-medium text-xs capitalize text-gray-800 truncate">
              {r.device || "Desktop"}
            </span>
            <span className="block text-[10px] text-gray-400 truncate">
              {sw || "Standard Client"}
            </span>
          </div>
        );
      },
      sortValue: (r) => r.device || "",
    },
    {
      key: "landing",
      header: "First Touch / Entry",
      width: "16%",
      render: (r) => (
        <div className="min-w-0">
          <span className="block truncate font-mono text-[11px] text-gray-800" title={r.firstLandingPath || "/"}>
            {r.firstLandingPath || "/"}
          </span>
          <span className="block truncate text-[10px] text-gray-400 capitalize">
            {r.referrerType || "direct"}
          </span>
        </div>
      ),
      sortValue: (r) => r.firstLandingPath || "",
    },
    {
      key: "sessionCount",
      header: "Visits",
      align: "right",
      width: "65px",
      render: (r) => (
        <span className="font-bold text-gray-900">
          {fmtInt(r.sessionCount)}
        </span>
      ),
      sortValue: (r) => r.sessionCount,
    },
    {
      key: "pageViewCount",
      header: "Pages",
      align: "right",
      width: "65px",
      render: (r) => fmtInt(r.pageViewCount),
      sortValue: (r) => r.pageViewCount,
    },
    {
      key: "totalDurationMs",
      header: "Total Time",
      align: "right",
      width: "80px",
      render: (r) => fmtDuration(r.totalDurationMs),
      sortValue: (r) => r.totalDurationMs,
    },
    {
      key: "lastSeenAt",
      header: "Last Seen",
      align: "right",
      width: "110px",
      render: (r) => (
        <div className="text-right">
          <span className="block font-mono text-xs text-gray-800">
            {r.lastSeenAt ? fmtDateTime(r.lastSeenAt).split(",")[0] : "—"}
          </span>
          {r.lastSeenAt ? (
            <span className="block text-[10px] text-gray-400">
              {fmtDateTime(r.lastSeenAt).split(",")[1] || ""}
            </span>
          ) : null}
        </div>
      ),
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
        <div className="relative min-w-[240px] flex-1">
          <Icon.search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-xl border border-gray-200/80 bg-white py-2 pl-10 pr-3.5 text-xs text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5 transition-all"
            placeholder="Search email, visitor ID or geo…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <label className="flex items-center gap-2 rounded-xl border border-gray-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 cursor-pointer">
          <input
            checked={identifiedOnly}
            className="rounded border-gray-300 text-gray-900 focus:ring-gray-900/20"
            type="checkbox"
            onChange={(e) => {
              setIdentifiedOnly(e.target.checked);
              setPage(1);
            }}
          />
          Identified Only
        </label>
      </div>

      <StatePanel error={error} loading={loading && !data} onRetry={refetch}>
        <Card
          bodyClassName="p-0"
          title={data ? `${fmtInt(data.total)} visitors` : "Visitors"}
        >
          <DataTable
            columns={columns}
            initialSort={{ key: "lastSeenAt", dir: "desc" }}
            rowKey={(r) => r.visitorId}
            rows={data?.rows || []}
            onRowClick={(r) => setOpen(r.visitorId)}
          />
        </Card>

        {totalPages > 1 ? (
          <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
            <span>
              Showing {(page - 1) * (data?.pageSize || 30) + 1}–
              {Math.min(page * (data?.pageSize || 30), data?.total || 0)} of{" "}
              {fmtInt(data?.total || 0)} visitors
            </span>
            <Pagination
              showControls
              classNames={{
                cursor: "bg-gray-900 text-white font-bold",
              }}
              page={page}
              size="sm"
              total={totalPages}
              variant="flat"
              onChange={setPage}
            />
          </div>
        ) : null}
      </StatePanel>

      {open ? (
        <VisitorDrawer visitorId={open} onClose={() => setOpen(null)} />
      ) : null}
    </div>
  );
}
