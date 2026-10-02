"use client";

import { useState } from "react";
import { Pagination } from "@heroui/react";

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
import { Icon } from "@/components/admin/icons";
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
      width: "26%",
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
      width: "110px",
      render: (r) => (
        <span className="inline-flex rounded bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600 capitalize">
          {r.kind}
        </span>
      ),
      sortValue: (r) => r.kind,
    },
    {
      key: "detail",
      header: "Detail",
      render: (r) => (
        <span className="block truncate text-gray-500" title={r.detail || "—"}>
          {r.detail || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "120px",
      render: (r) => <StatusChip status={r.status} />,
      sortValue: (r) => r.status,
    },
    {
      key: "visit",
      header: "Visits",
      align: "right",
      width: "80px",
      render: (r) => (r.visitorId ? "linked" : "—"),
    },
    {
      key: "createdAt",
      header: "Received",
      align: "right",
      width: "140px",
      render: (r) => (
        <span className="text-gray-500 font-mono text-xs">{fmtDateTime(r.createdAt)}</span>
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

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[240px] flex-1">
          <Icon.search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-xl border border-gray-200/80 bg-white py-2 pl-10 pr-3.5 text-xs text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5 transition-all"
            placeholder="Search name, email or message content…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          className="rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-all focus:border-gray-400 focus:outline-none"
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
          className="rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-all focus:border-gray-400 focus:outline-none"
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
      </div>

      <StatePanel error={error} loading={loading && !data} onRetry={refetch}>
        <Card bodyClassName="p-0">
          <DataTable
            columns={columns}
            initialSort={{ key: "createdAt", dir: "desc" }}
            rowKey={(r) => r.id}
            rows={data?.rows || []}
            onRowClick={(r) => setOpenId(r.id)}
          />
        </Card>

        {totalPages > 1 ? (
          <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
            <span>
              Showing {(page - 1) * (data?.pageSize || 30) + 1}–
              {Math.min(page * (data?.pageSize || 30), data?.total || 0)} of{" "}
              {fmtInt(data?.total || 0)} leads
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
