"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { useApi } from "@/lib/admin/useApi";
import { PageHeader, Card, StatePanel } from "@/components/admin/ui";
import { Icon } from "@/components/admin/icons";
import { fmtDateTime, fmtInt } from "@/components/admin/format";
import { mapCoverageState } from "@/lib/indexing/coverage";
import { type IndexedUrlItem } from "@/lib/indexing/types";

interface IndexingListResponse {
  rows: IndexedUrlItem[];
  total: number;
}

export default function SitemapDiffClient({
  user,
}: {
  user: { id: string; name: string; role: string };
}) {
  const [activeTab, setActiveTab] = useState<"in_and_indexed" | "unindexed" | "orphans" | "drafts">(
    "unindexed",
  );
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch all rows for three-way diff
  const { data, loading, error, refetch } = useApi<IndexingListResponse>(
    "/api/admin/indexing",
    {
      pageSize: 500,
    },
  );

  const rows = data?.rows || [];

  const inSitemapAndIndexed = rows.filter(
    (r) =>
      r.inSitemap &&
      !r.isDraft &&
      (r.google.verdict === "PASS" ||
        (r.google.coverageState &&
          r.google.coverageState.toLowerCase().includes("indexed") &&
          !r.google.coverageState.toLowerCase().includes("not indexed")) ||
        r.bing.indexed === true),
  );

  const inSitemapUnindexed = rows.filter(
    (r) =>
      r.inSitemap &&
      !r.isDraft &&
      !(
        r.google.verdict === "PASS" ||
        (r.google.coverageState &&
          r.google.coverageState.toLowerCase().includes("indexed") &&
          !r.google.coverageState.toLowerCase().includes("not indexed")) ||
        r.bing.indexed === true
      ),
  );

  const orphans = rows.filter((r) => !r.inSitemap && !r.isDraft);

  const drafts = rows.filter((r) => r.isDraft);

  async function handleSync() {
    setActionLoading("sync");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/indexing/sync", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Sync failed");
      setMessage(json.message || "Sitemap synchronized successfully.");
      refetch();
    } catch (e: any) {
      setMessage(`Error: ${e.message}`);
    } finally {
      setActionLoading(null);
    }
  }

  async function handlePingSitemap() {
    setActionLoading("ping");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/indexing/ping-sitemap", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Resubmit failed");
      setMessage(json.message || "Sitemap successfully resubmitted to Google & Bing.");
      refetch();
    } catch (e: any) {
      setMessage(`Error: ${e.message}`);
    } finally {
      setActionLoading(null);
    }
  }

  const currentList =
    activeTab === "in_and_indexed"
      ? inSitemapAndIndexed
      : activeTab === "unindexed"
      ? inSitemapUnindexed
      : activeTab === "orphans"
      ? orphans
      : drafts;

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <div className="flex items-center gap-2">
            <Link
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              href="/admin/indexing"
            >
              ← Back to Indexing
            </Link>
            <Button
              isDisabled={actionLoading !== null}
              isLoading={actionLoading === "sync"}
              size="sm"
              variant="bordered"
              onClick={handleSync}
            >
              <Icon.refresh className="h-4 w-4" /> Reconcile Sitemap
            </Button>
            <Button
              color="primary"
              isDisabled={actionLoading !== null}
              isLoading={actionLoading === "ping"}
              size="sm"
              variant="solid"
              onClick={handlePingSitemap}
            >
              Resubmit to Engines
            </Button>
          </div>
        }
        description="Three-way matrix diff comparing sitemap.ts ∩ Tracked URLs ∩ Live Search Indexes."
        title="Sitemap Reconciliation"
      />

      {/* Notification */}
      {message ? (
        <div className="rounded-xl bg-blue-50 px-4 py-3 text-xs font-medium text-blue-800 ring-1 ring-blue-200">
          {message}
        </div>
      ) : null}

      {/* 4 Summary Matrix Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <button
          className={`rounded-xl border p-4 text-left transition-all ${
            activeTab === "in_and_indexed"
              ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20"
              : "border-gray-200 bg-white hover:bg-gray-50/50"
          }`}
          onClick={() => setActiveTab("in_and_indexed")}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              In Sitemap & Indexed
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">
            {fmtInt(inSitemapAndIndexed.length)}
          </div>
          <p className="mt-1 text-xs text-gray-500">Live pages successfully indexed</p>
        </button>

        <button
          className={`rounded-xl border p-4 text-left transition-all ${
            activeTab === "unindexed"
              ? "border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20"
              : "border-gray-200 bg-white hover:bg-gray-50/50"
          }`}
          onClick={() => setActiveTab("unindexed")}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              In Sitemap (Unindexed)
            </span>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">
            {fmtInt(inSitemapUnindexed.length)}
          </div>
          <p className="mt-1 text-xs text-gray-500">In sitemap but crawl pending or dropped</p>
        </button>

        <button
          className={`rounded-xl border p-4 text-left transition-all ${
            activeTab === "orphans"
              ? "border-purple-500 bg-purple-50/40 ring-2 ring-purple-500/20"
              : "border-gray-200 bg-white hover:bg-gray-50/50"
          }`}
          onClick={() => setActiveTab("orphans")}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700">
              Orphan URLs
            </span>
            <span className="h-2 w-2 rounded-full bg-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">
            {fmtInt(orphans.length)}
          </div>
          <p className="mt-1 text-xs text-gray-500">Tracked/indexed but removed from sitemap</p>
        </button>

        <button
          className={`rounded-xl border p-4 text-left transition-all ${
            activeTab === "drafts"
              ? "border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20"
              : "border-gray-200 bg-white hover:bg-gray-50/50"
          }`}
          onClick={() => setActiveTab("drafts")}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              Drafts Protected
            </span>
            <span className="h-2 w-2 rounded-full bg-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">
            {fmtInt(drafts.length)}
          </div>
          <p className="mt-1 text-xs text-gray-500">Unreleased case studies safely held</p>
        </button>
      </div>

      {/* Detail Table */}
      <StatePanel error={error} loading={loading && !data} onRetry={refetch}>
        <Card
          bodyClassName="p-0"
          subtitle={
            activeTab === "in_and_indexed"
              ? "Pages listed in sitemap.ts that are confirmed indexed on Google or Bing."
              : activeTab === "unindexed"
              ? "Pages listed in sitemap.ts that have not yet been crawled or indexed."
              : activeTab === "orphans"
              ? "URLs in database that are no longer part of sitemap.ts."
              : "Unreleased drafts strictly prevented from entering the search index."
          }
          title={
            activeTab === "in_and_indexed"
              ? "In Sitemap & Indexed"
              : activeTab === "unindexed"
              ? "In Sitemap but Not Indexed (Pending / Dropped)"
              : activeTab === "orphans"
              ? "Sitemap Orphans"
              : "Draft Protection List"
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50/80 text-xs uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600">URL & Path</th>
                  <th className="px-3 py-3 font-semibold text-gray-600">Type</th>
                  <th className="px-3 py-3 font-semibold text-gray-600">Google Status</th>
                  <th className="px-3 py-3 font-semibold text-gray-600">Bing Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">
                    Last Verified
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentList.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-center text-gray-400" colSpan={5}>
                      No URLs in this category.
                    </td>
                  </tr>
                ) : (
                  currentList.map((row) => {
                    const googleCov = mapCoverageState(
                      row.google.coverageState,
                      row.google.verdict,
                    );

                    return (
                      <tr key={row.id} className="hover:bg-gray-50/60">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-medium text-gray-900">
                            {row.path}
                          </span>
                          <span className="block truncate font-mono text-[11px] text-gray-400">
                            {row.url}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            {row.type}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              googleCov.tone === "success"
                                ? "bg-emerald-50 text-emerald-700"
                                : googleCov.tone === "warning"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {googleCov.chipLabel}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          {row.bing.indexed === true ? (
                            <span className="text-xs font-medium text-emerald-600">
                              Indexed
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">
                              {row.bing.indexed === false ? "Not indexed" : "Unchecked"}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-xs tabular-nums text-gray-400">
                          {row.google.lastInspectedAt
                            ? fmtDateTime(row.google.lastInspectedAt)
                            : row.updatedAt
                            ? fmtDateTime(row.updatedAt)
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
      </StatePanel>
    </div>
  );
}
