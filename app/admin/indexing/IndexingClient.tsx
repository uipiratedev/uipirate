"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button, Chip, Pagination } from "@heroui/react";
import { useApi } from "@/lib/admin/useApi";
import { PageHeader, Card, StatePanel } from "@/components/admin/ui";
import { KpiRow, type Kpi } from "@/components/admin/KpiRow";
import { Icon } from "@/components/admin/icons";
import { fmtDateTime, fmtInt } from "@/components/admin/format";
import { mapCoverageState, mapBingState } from "@/lib/indexing/coverage";
import { type IndexedUrlItem, type QuotaSummary } from "@/lib/indexing/types";
import { IndexingDrawer } from "./IndexingDrawer";

interface IndexingResponse {
  rows: IndexedUrlItem[];
  total: number;
  page: number;
  pageSize: number;
  kpis: {
    total: number;
    googleIndexedCount: number;
    googleIndexedPct: number;
    bingIndexedCount: number;
    bingIndexedPct: number;
    unsubmittedCount: number;
    errorCount: number;
  };
}

export default function IndexingClient({
  user,
}: {
  user: { id: string; name: string; role: string };
}) {
  const [q, setQ] = useState("");
  const [engine, setEngine] = useState("all");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [inSitemap, setInSitemap] = useState("all");
  const [isDraft, setIsDraft] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openId, setOpenId] = useState<string | null>(null);

  const [bulkActionLoading, setBulkActionLoading] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Fetch index list & KPIs
  const { data, loading, error, refetch } = useApi<IndexingResponse>(
    "/api/admin/indexing",
    {
      q,
      engine,
      status,
      type,
      inSitemap,
      isDraft,
      page,
      pageSize: 25,
    },
  );

  // Fetch real-time quota stats
  const { data: quotaData, refetch: refetchQuota } = useApi<{ quotas: QuotaSummary[] }>(
    "/api/admin/indexing/quota",
  );

  const googleQuota = quotaData?.quotas?.find((q) => q.provider === "google-indexing");
  const inspectionQuota = quotaData?.quotas?.find((q) => q.provider === "google-inspection");
  const bingQuota = quotaData?.quotas?.find((q) => q.provider === "bing-submit");

  // KPI items for top metric strip
  const kpis: Kpi[] = useMemo(() => {
    const k = data?.kpis;
    return [
      {
        label: "Google Indexed",
        value: `${k?.googleIndexedPct ?? 0}%`,
        hint: `${fmtInt(k?.googleIndexedCount ?? 0)} / ${fmtInt(k?.total ?? 0)} URLs`,
      },
      {
        label: "Bing Indexed",
        value: `${k?.bingIndexedPct ?? 0}%`,
        hint: `${fmtInt(k?.bingIndexedCount ?? 0)} / ${fmtInt(k?.total ?? 0)} URLs`,
      },
      {
        label: "Unsubmitted",
        value: fmtInt(k?.unsubmittedCount ?? 0),
        hint: "Ready for search queue",
      },
      {
        label: "Index Alerts",
        value: fmtInt(k?.errorCount ?? 0),
        hint: "404, blocked or dropped",
      },
      {
        label: "Google Publish Quota",
        value: `${googleQuota?.used ?? 0} / ${googleQuota?.limit ?? 200}`,
        hint: `${googleQuota?.remaining ?? 200} remaining today`,
      },
      {
        label: "Inspection Quota",
        value: `${inspectionQuota?.used ?? 0} / ${inspectionQuota?.limit ?? 2000}`,
        hint: `${inspectionQuota?.remaining ?? 2000} remaining today`,
      },
    ];
  }, [data, googleQuota, inspectionQuota]);

  // Bulk Actions
  const selectedUrls = useMemo(() => {
    if (!data?.rows) return [];
    return data.rows.filter((r) => selectedIds.has(r.id)).map((r) => r.url);
  }, [data, selectedIds]);

  async function handleBulkGoogle() {
    if (!selectedUrls.length) return;
    setBulkActionLoading("google");
    setActionFeedback(null);
    try {
      const res = await fetch("/api/admin/indexing/submit-google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: selectedUrls }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Submission failed");
      setActionFeedback(
        `Dispatched: ${json.summary?.submitted ?? 0} submitted, ${json.summary?.skippedDrafts ?? 0} drafts held, ${json.summary?.queued ?? 0} queued.`,
      );
      refetch();
      refetchQuota();
      setSelectedIds(new Set());
    } catch (e: any) {
      setActionFeedback(`Error: ${e.message}`);
    } finally {
      setBulkActionLoading(null);
    }
  }

  async function handleBulkBing() {
    if (!selectedUrls.length) return;
    setBulkActionLoading("bing");
    setActionFeedback(null);
    try {
      const res = await fetch("/api/admin/indexing/submit-bing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: selectedUrls }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Bing submission failed");
      setActionFeedback(
        `Dispatched: ${json.summary?.submitted ?? 0} submitted to Bing & IndexNow.`,
      );
      refetch();
      refetchQuota();
      setSelectedIds(new Set());
    } catch (e: any) {
      setActionFeedback(`Error: ${e.message}`);
    } finally {
      setBulkActionLoading(null);
    }
  }

  async function handleBulkInspect() {
    if (!selectedUrls.length) return;
    setBulkActionLoading("inspect");
    setActionFeedback(null);
    try {
      const res = await fetch("/api/admin/indexing/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: selectedUrls }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Inspection failed");
      setActionFeedback(
        `Inspection finished: ${json.summary?.inspected ?? 0} inspected, ${json.summary?.queued ?? 0} queued.`,
      );
      refetch();
      refetchQuota();
      setSelectedIds(new Set());
    } catch (e: any) {
      setActionFeedback(`Error: ${e.message}`);
    } finally {
      setBulkActionLoading(null);
    }
  }

  async function handleSyncSitemap() {
    setBulkActionLoading("sync");
    setActionFeedback(null);
    try {
      const res = await fetch("/api/admin/indexing/sync", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Sync failed");
      setActionFeedback(json.message || "Sitemap synchronized successfully.");
      refetch();
    } catch (e: any) {
      setActionFeedback(`Sync Error: ${e.message}`);
    } finally {
      setBulkActionLoading(null);
    }
  }

  const toggleSelectAll = () => {
    if (!data?.rows) return;
    if (selectedIds.size === data.rows.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.rows.map((r) => r.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader
        actions={
          <div className="flex items-center gap-2">
            <Button
              isDisabled={bulkActionLoading !== null}
              isLoading={bulkActionLoading === "sync"}
              size="sm"
              variant="bordered"
              onClick={handleSyncSitemap}
            >
              <Icon.refresh className="h-4 w-4" /> Sync Sitemap
            </Button>
            <Link
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              href="/admin/indexing/sitemap"
            >
              <Icon.radar className="h-4 w-4 text-gray-500" /> Sitemap Diff
            </Link>
          </div>
        }
        description="Submit canonical URLs to Google and Bing, monitor live indexing coverage, catch regressions, and protect unreleased drafts."
        title="Indexing Management"
      />

      {/* KPI Cards */}
      <KpiRow items={kpis} />

      {/* Action Notification */}
      {actionFeedback ? (
        <div className="flex items-center justify-between rounded-xl bg-blue-50/90 px-4 py-3 text-xs font-medium text-blue-800 ring-1 ring-blue-200">
          <span>{actionFeedback}</span>
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => setActionFeedback(null)}
          >
            <Icon.x className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {/* Filters Strip */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[240px] flex-1">
          <Icon.search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-xl border border-gray-200/80 bg-white py-2 pl-10 pr-3.5 text-xs text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5 transition-all"
            placeholder="Search URL, pattern or slug..."
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
          <option value="all">All Coverage Statuses</option>
          <option value="indexed">Indexed (Live on Search)</option>
          <option value="crawled_not_indexed">Crawled, not indexed</option>
          <option value="discovered">Discovered (Pending crawl)</option>
          <option value="excluded">Excluded / Noindex</option>
          <option value="unsubmitted">Unsubmitted</option>
          <option value="error">Errors & Alerts</option>
        </select>

        <select
          className="rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-all focus:border-gray-400 focus:outline-none"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All Types</option>
          <option value="page">Page</option>
          <option value="case-study">Case Study</option>
          <option value="blog">Blog</option>
          <option value="tool">Tool</option>
          <option value="bot">Bot Dossier</option>
        </select>

        <select
          className="rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-all focus:border-gray-400 focus:outline-none"
          value={inSitemap}
          onChange={(e) => {
            setInSitemap(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">Sitemap: All</option>
          <option value="yes">In Sitemap</option>
          <option value="no">Not in Sitemap</option>
        </select>

        <select
          className="rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-all focus:border-gray-400 focus:outline-none"
          value={isDraft}
          onChange={(e) => {
            setIsDraft(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">Drafts: All</option>
          <option value="no">Live Only</option>
          <option value="yes">Drafts Held Only</option>
        </select>
      </div>

      {/* Bulk Action Bar (when rows selected) */}
      {selectedIds.size > 0 ? (
        <div className="flex items-center justify-between rounded-xl border border-gray-900 bg-gray-900 px-4 py-2.5 text-xs text-white shadow-lg">
          <span className="font-medium">
            {selectedIds.size} URL{selectedIds.size > 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              color="primary"
              isDisabled={bulkActionLoading !== null}
              isLoading={bulkActionLoading === "google"}
              size="sm"
              variant="solid"
              onClick={handleBulkGoogle}
            >
              Submit to Google ({selectedIds.size})
            </Button>
            <Button
              className="bg-white/10 text-white hover:bg-white/20"
              isDisabled={bulkActionLoading !== null}
              isLoading={bulkActionLoading === "bing"}
              size="sm"
              variant="flat"
              onClick={handleBulkBing}
            >
              Submit Bing + IndexNow
            </Button>
            <Button
              className="bg-white/10 text-white hover:bg-white/20"
              isDisabled={bulkActionLoading !== null}
              isLoading={bulkActionLoading === "inspect"}
              size="sm"
              variant="flat"
              onClick={handleBulkInspect}
            >
              Inspect Status
            </Button>
            <button
              className="ml-2 text-gray-400 hover:text-white"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear
            </button>
          </div>
        </div>
      ) : null}

      {/* Data Table */}
      <StatePanel error={error} loading={loading && !data} onRetry={refetch}>
        <Card bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50/80 text-xs uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      checked={
                        Boolean(data?.rows.length) &&
                        selectedIds.size === data?.rows.length
                      }
                      className="rounded border-gray-300"
                      type="checkbox"
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-600">URL & Path</th>
                  <th className="px-3 py-3 font-semibold text-gray-600">Type</th>
                  <th className="px-3 py-3 font-semibold text-gray-600">Sitemap</th>
                  <th className="px-3 py-3 font-semibold text-gray-600">Google Coverage</th>
                  <th className="px-3 py-3 font-semibold text-gray-600">Bing</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">
                    Last Checked
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {!data?.rows?.length ? (
                  <tr>
                    <td className="px-4 py-12 text-center text-gray-400" colSpan={7}>
                      No indexed URLs found matching criteria.
                    </td>
                  </tr>
                ) : (
                  data.rows.map((row) => {
                    const isSelected = selectedIds.has(row.id);
                    const googleCov = mapCoverageState(
                      row.google.coverageState,
                      row.google.verdict,
                    );
                    const bingCov = mapBingState(
                      row.bing.indexed,
                      row.bing.lastError,
                    );

                    return (
                      <tr
                        key={row.id}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-blue-50/40" : "hover:bg-gray-50/70"
                        } ${row.isDraft ? "opacity-75" : ""}`}
                        onClick={() => setOpenId(row.id)}
                      >
                        {/* Checkbox */}
                        <td
                          className="px-4 py-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectRow(row.id);
                          }}
                        >
                          <input
                            checked={isSelected}
                            className="rounded border-gray-300"
                            type="checkbox"
                            onChange={() => {}}
                          />
                        </td>

                        {/* URL & Path */}
                        <td className="max-w-[280px] px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="truncate font-mono text-xs font-medium text-gray-900">
                              {row.path}
                            </span>
                            {row.isDraft ? (
                              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                                Draft — Held
                              </span>
                            ) : null}
                            {row.noindexIntentional ? (
                              <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                                Noindex
                              </span>
                            ) : null}
                          </div>
                          <span className="block truncate font-mono text-[11px] text-gray-400">
                            {row.url}
                          </span>
                        </td>

                        {/* Type */}
                        <td className="px-3 py-3">
                          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            {row.type}
                          </span>
                        </td>

                        {/* Sitemap Status */}
                        <td className="px-3 py-3">
                          {row.inSitemap ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                              <Icon.checkCircle className="h-3.5 w-3.5" /> In sitemap
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>

                        {/* Google Coverage Chip */}
                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              googleCov.tone === "success"
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                                : googleCov.tone === "warning"
                                ? "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
                                : googleCov.tone === "danger"
                                ? "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                                : "bg-gray-100 text-gray-600 ring-1 ring-gray-400/20"
                            }`}
                          >
                            {googleCov.chipLabel}
                          </span>
                        </td>

                        {/* Bing Status Chip */}
                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              bingCov.tone === "success"
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                                : bingCov.tone === "warning"
                                ? "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {bingCov.chipLabel}
                          </span>
                        </td>

                        {/* Last Checked */}
                        <td className="px-4 py-3 text-right text-xs tabular-nums text-gray-500">
                          {row.google.lastInspectedAt
                            ? fmtDateTime(row.google.lastInspectedAt)
                            : row.google.submittedAt
                            ? `Sub ${fmtDateTime(row.google.submittedAt)}`
                            : "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pagination Bar */}
        {totalPages > 1 ? (
          <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
            <span>
              Showing {(page - 1) * 25 + 1}–{Math.min(page * 25, data?.total ?? 0)} of{" "}
              {fmtInt(data?.total ?? 0)} URLs
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

      {/* Drawer */}
      {openId ? (
        <IndexingDrawer
          itemId={openId}
          onChanged={() => {
            refetch();
            refetchQuota();
          }}
          onClose={() => setOpenId(null)}
        />
      ) : null}
    </div>
  );
}
