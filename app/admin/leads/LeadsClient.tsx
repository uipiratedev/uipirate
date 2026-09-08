"use client";

import { useState } from "react";

import { LeadDrawer } from "./LeadDrawer";

import { useApi } from "@/lib/admin/useApi";
import { useDashboard } from "@/lib/admin/DashboardContext";
import {
  PageHeader,
  Card,
  StatePanel,
  StatusChip,
} from "@/components/admin/ui";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { fmtDateTime, fmtInt } from "@/components/admin/format";
import { LEAD_STATUSES } from "@/lib/leads/constants";

interface UnifiedLead {
  id: string;
  kind: string;
  name: string;
  email: string;
  status: string;
  source: string;
  detail: string;
  visitorId?: string | null;
  createdAt: string;
}

interface LeadsResponse {
  rows: UnifiedLead[];
  total: number;
  page: number;
  pageSize: number;
  statusCounts: Record<string, number>;
}

export default function LeadsClient({
  canManage,
  canExport,
}: {
  canManage: boolean;
  canExport: boolean;
}) {
  const { rangeQuery } = useDashboard();
  const [status, setStatus] = useState("all");
  const [kind, setKind] = useState("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useApi<LeadsResponse>(
    "/api/admin/leads",
    {
      status,
      kind,
      q,
      page,
    },
  );

  const columns: Column<UnifiedLead>[] = [
    {
      key: "name",
      header: "Name",
      render: (r) => (
        <div className="min-w-0">
          <span className="block truncate font-medium text-gray-900">
            {r.name}
          </span>
          <span className="block truncate text-xs text-gray-400">
            {r.email}
          </span>
        </div>
      ),
      sortValue: (r) => r.name.toLowerCase(),
    },
    {
      key: "kind",
      header: "Type",
      render: (r) => r.kind,
      sortValue: (r) => r.kind,
    },
    {
      key: "detail",
      header: "Detail",
      render: (r) => <span className="text-gray-500">{r.detail || "—"}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusChip status={r.status} />,
      sortValue: (r) => r.status,
    },
    {
      key: "visit",
      header: "Visits",
      align: "right",
      render: (r) => (r.visitorId ? "linked" : "—"),
    },
    {
      key: "createdAt",
      header: "Received",
      align: "right",
      render: (r) => (
        <span className="text-gray-500">{fmtDateTime(r.createdAt)}</span>
      ),
      sortValue: (r) => r.createdAt,
    },
  ];

  const counts = data?.statusCounts || {};
  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.pageSize))
    : 1;

  return (
    <div className="space-y-5">
      <PageHeader
        actions={
          canExport ? (
            <a
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              href={`/api/admin/export?type=leads&${rangeQuery}`}
            >
              Export CSV
            </a>
          ) : null
        }
        description="Contact-form and project-estimate submissions, with each person's visit history."
        title="Leads"
      />

      <div className="flex flex-wrap items-center gap-2">
        <select
          className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">
            All statuses{data ? ` (${fmtInt(data.total)})` : ""}
          </option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s} {counts[s] ? `(${counts[s]})` : ""}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm"
          value={kind}
          onChange={(e) => {
            setKind(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All types</option>
          <option value="contact">Contact form</option>
          <option value="estimate">Project estimate</option>
        </select>
        <input
          className="min-w-[200px] flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
          placeholder="Search name or email…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <StatePanel error={error} loading={loading && !data} onRetry={refetch}>
        <Card bodyClassName="p-0">
          <DataTable
            columns={columns}
            initialSort={{ key: "createdAt", dir: "desc" }}
            maxHeight={560}
            rowKey={(r) => r.id}
            rows={data?.rows || []}
            onRowClick={(r) => setOpenId(r.id)}
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

      {openId ? (
        <LeadDrawer
          canManage={canManage}
          leadId={openId}
          onChanged={() => refetch()}
          onClose={() => setOpenId(null)}
        />
      ) : null}
    </div>
  );
}
