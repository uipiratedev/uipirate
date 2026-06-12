"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface AuditEntry {
  _id: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  targetId?: string;
  targetType?: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const ACTION_LABELS: Record<string, string> = {
  "post.create": "Created post",
  "post.update": "Updated post",
  "post.delete": "Deleted post",
  "post.publish": "Published post",
  "post.unpublish": "Unpublished post",
  "post.request_review": "Submitted for review",
  "post.approve": "Approved post",
  "post.reject": "Rejected post",
  "team.member_add": "Added team member",
  "team.member_remove": "Removed team member",
  "team.member_role_change": "Changed member role",
  "team.create": "Created team",
  "team.delete": "Deleted team",
  "billing.checkout": "Started checkout",
  "billing.portal": "Opened billing portal",
  "ai_config.update": "Updated AI config",
  "org.convert": "Converted to organization",
  "member.role_change": "Changed member role",
};

const ACTION_COLORS: Record<string, string> = {
  "post.delete": "bg-red-50 text-red-600",
  "post.reject": "bg-red-50 text-red-600",
  "post.approve": "bg-blue-50 text-blue-600",
  "post.publish": "bg-green-50 text-green-700",
  "post.request_review": "bg-yellow-50 text-yellow-700",
  "post.create": "bg-gray-50 text-gray-600",
  "post.update": "bg-gray-50 text-gray-600",
  "billing.checkout": "bg-purple-50 text-purple-700",
  "billing.portal": "bg-purple-50 text-purple-700",
  "team.member_add": "bg-teal-50 text-teal-700",
  "team.member_remove": "bg-orange-50 text-orange-600",
  "ai_config.update": "bg-indigo-50 text-indigo-700",
};

function actionBadgeClass(action: string) {
  return ACTION_COLORS[action] ?? "bg-gray-50 text-gray-500";
}

const ALL_ACTIONS = Object.keys(ACTION_LABELS);
const LIMIT = 25;

export default function AuditLogPage() {
  const { user, isLoading } = useAuth(true);
  const router = useRouter();

  const isSubdomain =
    typeof window !== "undefined" &&
    (window.location.hostname.startsWith("cos.") ||
      window.location.hostname === "cos.uipirate.com");
  const getHref = (path: string) => (isSubdomain ? path : `/pirateCOS${path}`);

  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);
  const [filterAction, setFilterAction] = useState("");
  const [filterActor, setFilterActor] = useState("");

  const fetchLogs = useCallback(async () => {
    setFetching(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(LIMIT));
      if (filterAction) params.set("action", filterAction);
      if (filterActor.trim()) params.set("actor", filterActor.trim());

      const res = await fetch(`/api/pirateCOS/audit-log?${params}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
        setPagination(data.pagination);
      }
    } finally {
      setFetching(false);
    }
  }, [page, filterAction, filterActor]);

  useEffect(() => { setPage(1); }, [filterAction, filterActor]);
  useEffect(() => { if (!isLoading) fetchLogs(); }, [fetchLogs, isLoading]);

  useEffect(() => {
    if (!isLoading && user && user.accountType !== "individual" && user.orgRole !== "org-admin") {
      router.push(getHref("/dashboard"));
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-sm text-gray-400 font-geist">
        Loading audit log...
      </div>
    );
  }

  const hasFilters = filterAction || filterActor.trim();

  return (
    <div className="space-y-8 px-8 py-4 font-geist text-gray-700 w-full">

      {/* ── Page header ── */}
      <div className="pt-2 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p
            className="text-xs font-jetbrains-mono uppercase tracking-widest mb-1"
            style={{ color: "#FF5B04" }}
          >
            Organization Security
          </p>
          <h1 className="text-2xl font-bold font-geist text-gray-900 tracking-tight">
            Audit Log
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            A tamper-evident record of every privileged action taken by your organization members.
          </p>
        </div>

        {/* Event counter */}
        {pagination && (
          <div className="flex-shrink-0 bg-white rounded-2xl border border-black/5 shadow-sm px-5 py-3 text-right">
            <p className="text-[10px] font-jetbrains-mono uppercase tracking-widest text-gray-400 mb-0.5">Total Events</p>
            <p className="text-2xl font-black font-geist text-gray-900 tracking-tight">{pagination.total.toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm px-5 py-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-jetbrains-mono uppercase tracking-widest text-gray-400">Action</label>
          <select
            className="text-sm font-geist h-9 px-3 rounded-lg border border-black/10 bg-[#FAFAF9] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF5B04]/20 min-w-[180px]"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
          >
            <option value="">All actions</option>
            {ALL_ACTIONS.map((a) => (
              <option key={a} value={a}>{ACTION_LABELS[a]}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-jetbrains-mono uppercase tracking-widest text-gray-400">Actor</label>
          <input
            className="text-sm font-geist h-9 px-3 rounded-lg border border-black/10 bg-[#FAFAF9] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5B04]/20 w-52"
            placeholder="Filter by email"
            value={filterActor}
            onChange={(e) => setFilterActor(e.target.value)}
          />
        </div>

        {hasFilters && (
          <div className="flex flex-col gap-1">
            <div className="h-4" />
            <button
              className="text-sm font-geist h-9 px-4 rounded-lg border border-black/10 bg-[#FAFAF9] text-gray-500 hover:text-gray-800 transition-colors"
              onClick={() => { setFilterAction(""); setFilterActor(""); }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ── Log table ── */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        {fetching ? (
          <div className="flex items-center justify-center py-16 text-sm text-gray-400 font-geist">
            Loading events...
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <svg fill="none" height="32" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="32" className="text-gray-200">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
              <line x1="16" x2="8" y1="17" y2="17" />
            </svg>
            <p className="text-sm text-gray-400 font-geist">No audit events found.</p>
            {hasFilters && (
              <button
                className="text-xs text-[#FF5B04] hover:underline font-geist mt-1"
                onClick={() => { setFilterAction(""); setFilterActor(""); }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  {["Timestamp", "Actor", "Action", "Target", "Details"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[10px] font-semibold font-jetbrains-mono text-gray-400 uppercase tracking-widest whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((entry) => (
                  <tr
                    key={entry._id}
                    className="group transition-colors hover:bg-black/[0.015]"
                    style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
                  >
                    {/* Timestamp */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-xs font-jetbrains-mono text-gray-400">
                        {new Date(entry.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="text-[10px] font-jetbrains-mono text-gray-300 block">
                        {new Date(entry.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </span>
                    </td>

                    {/* Actor */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <p className="text-sm font-geist text-gray-800 font-medium">{entry.actorEmail}</p>
                      <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-wider">{entry.actorRole}</p>
                    </td>

                    {/* Action badge */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex text-[10px] font-semibold font-jetbrains-mono px-2.5 py-1 rounded-full ${actionBadgeClass(entry.action)}`}>
                        {ACTION_LABELS[entry.action] ?? entry.action}
                      </span>
                    </td>

                    {/* Target */}
                    <td className="px-5 py-3.5">
                      {entry.targetId ? (
                        <div>
                          <p className="text-xs font-geist text-gray-600 capitalize">{entry.targetType ?? "resource"}</p>
                          <p className="text-[10px] font-jetbrains-mono text-gray-400 truncate max-w-[140px]" title={entry.targetId}>
                            {entry.targetId}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-200 select-none">—</span>
                      )}
                    </td>

                    {/* Details */}
                    <td className="px-5 py-3.5 max-w-[240px]">
                      {entry.meta && Object.keys(entry.meta).length > 0 ? (
                        <p
                          className="text-xs font-geist text-gray-500 truncate"
                          title={JSON.stringify(entry.meta, null, 2)}
                        >
                          {Object.entries(entry.meta)
                            .filter(([, v]) => v !== undefined && v !== null && v !== "")
                            .map(([k, v]) => `${k}: ${String(v)}`)
                            .join(" · ")}
                        </p>
                      ) : (
                        <span className="text-gray-200 select-none">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination footer ── */}
        {pagination && pagination.pages > 1 && (
          <div
            className="flex items-center justify-between px-5 py-3.5 font-geist"
            style={{ borderTop: "1px solid rgba(0,0,0,0.05)", background: "#FAFAF9" }}
          >
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold">{(pagination.page - 1) * pagination.limit + 1}</span>
              {" "}–{" "}
              <span className="font-semibold">{Math.min(pagination.page * pagination.limit, pagination.total)}</span>
              {" "}of{" "}
              <span className="font-semibold">{pagination.total}</span> events
            </p>
            <div className="flex items-center gap-1.5">
              <button
                className="h-8 px-3 rounded-lg text-xs font-medium bg-black/5 hover:bg-black/10 text-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              <span className="text-xs text-gray-400 font-jetbrains-mono px-1">
                {page} / {pagination.pages}
              </span>
              <button
                className="h-8 px-3 rounded-lg text-xs font-medium bg-black/5 hover:bg-black/10 text-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
