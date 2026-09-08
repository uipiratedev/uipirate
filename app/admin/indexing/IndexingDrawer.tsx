"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@/components/admin/icons";
import { StatePanel } from "@/components/admin/ui";
import { fmtDateTime } from "@/components/admin/format";
import { mapCoverageState, mapBingState } from "@/lib/indexing/coverage";
import { type IndexedUrlItem } from "@/lib/indexing/types";

export function IndexingDrawer({
  itemId,
  onClose,
  onChanged,
}: {
  itemId: string;
  onClose: () => void;
  onChanged: (item: IndexedUrlItem) => void;
}) {
  const [item, setItem] = useState<IndexedUrlItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    setFeedback(null);

    fetch(`/api/admin/indexing/${itemId}`)
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Failed to load details");
        return j;
      })
      .then((j) => {
        if (!alive) return;
        setItem(j.item);
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [itemId]);

  async function submitGoogle() {
    if (!item) return;
    setActionLoading("google");
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/indexing/submit-google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: [item.url] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google submit failed");
      const msg = data.results?.[0]?.message || "Google submission dispatched";
      setFeedback(msg);
      // Reload item
      const fresh = await fetch(`/api/admin/indexing/${itemId}`).then((r) => r.json());
      if (fresh.item) {
        setItem(fresh.item);
        onChanged(fresh.item);
      }
    } catch (e: any) {
      setFeedback(`Error: ${e.message}`);
    } finally {
      setActionLoading(null);
    }
  }

  async function submitBing() {
    if (!item) return;
    setActionLoading("bing");
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/indexing/submit-bing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: [item.url] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bing submit failed");
      const msg = data.results?.[0]?.message || "Bing & IndexNow submitted";
      setFeedback(msg);
      const fresh = await fetch(`/api/admin/indexing/${itemId}`).then((r) => r.json());
      if (fresh.item) {
        setItem(fresh.item);
        onChanged(fresh.item);
      }
    } catch (e: any) {
      setFeedback(`Error: ${e.message}`);
    } finally {
      setActionLoading(null);
    }
  }

  async function runInspect() {
    if (!item) return;
    setActionLoading("inspect");
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/indexing/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: [item.url] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Inspection failed");
      setFeedback("Inspection completed.");
      const fresh = await fetch(`/api/admin/indexing/${itemId}`).then((r) => r.json());
      if (fresh.item) {
        setItem(fresh.item);
        onChanged(fresh.item);
      }
    } catch (e: any) {
      setFeedback(`Error: ${e.message}`);
    } finally {
      setActionLoading(null);
    }
  }

  async function toggleNoindex() {
    if (!item) return;
    setActionLoading("noindex");
    try {
      const nextVal = !item.noindexIntentional;
      const res = await fetch(`/api/admin/indexing/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noindexIntentional: nextVal }),
      });
      const data = await res.json();
      if (res.ok && data.item) {
        setItem(data.item);
        onChanged(data.item);
        setFeedback(
          nextVal
            ? "Marked as intentional noindex (alerts silenced)."
            : "Intentional noindex flag removed.",
        );
      }
    } catch (e: any) {
      setFeedback(`Error: ${e.message}`);
    } finally {
      setActionLoading(null);
    }
  }

  const googleCov = mapCoverageState(
    item?.google.coverageState,
    item?.google.verdict,
  );
  const bingCov = mapBingState(item?.bing.indexed, item?.bing.lastError);
  const canonicalMismatch =
    item?.google.googleCanonical &&
    item.google.userCanonical &&
    item.google.googleCanonical !== item.google.userCanonical;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        role="presentation"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="min-w-0 pr-4">
            <h2 className="text-base font-semibold text-gray-900">URL Indexing Dossier</h2>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {item?.type}
              </span>
              {item?.isDraft ? (
                <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                  Draft — Held
                </span>
              ) : null}
              {item?.inSitemap ? (
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  In Sitemap
                </span>
              ) : (
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-400">
                  Not in sitemap
                </span>
              )}
            </div>
          </div>
          <button
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            onClick={onClose}
          >
            <Icon.x className="h-5 w-5" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <StatePanel error={error} loading={loading}>
            {item ? (
              <div className="space-y-6">
                {/* URL Bar */}
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Canonical Target
                      </span>
                      <p className="mt-1 break-all text-sm font-mono font-medium text-gray-900">
                        {item.url}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        href={item.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Visit <Icon.external className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  {canonicalMismatch ? (
                    <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 ring-1 ring-amber-200">
                      <Icon.alertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                      <div>
                        <strong className="font-semibold">Canonical Mismatch:</strong> Google chose{" "}
                        <code className="font-mono">{item.google.googleCanonical}</code> instead of{" "}
                        <code className="font-mono">{item.google.userCanonical}</code>.
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Feedback Notification */}
                {feedback ? (
                  <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800 ring-1 ring-blue-200">
                    {feedback}
                  </div>
                ) : null}

                {/* Actions Toolbar */}
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Engine Actions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      color="primary"
                      isDisabled={item.isDraft || actionLoading !== null}
                      isLoading={actionLoading === "google"}
                      size="sm"
                      variant="solid"
                      onClick={submitGoogle}
                    >
                      Publish to Google
                    </Button>
                    <Button
                      isDisabled={item.isDraft || actionLoading !== null}
                      isLoading={actionLoading === "bing"}
                      size="sm"
                      variant="bordered"
                      onClick={submitBing}
                    >
                      Submit Bing + IndexNow
                    </Button>
                    <Button
                      isDisabled={actionLoading !== null}
                      isLoading={actionLoading === "inspect"}
                      size="sm"
                      variant="flat"
                      onClick={runInspect}
                    >
                      Re-inspect Now
                    </Button>
                    <Button
                      color={item.noindexIntentional ? "warning" : "default"}
                      isDisabled={actionLoading !== null}
                      isLoading={actionLoading === "noindex"}
                      size="sm"
                      variant="light"
                      onClick={toggleNoindex}
                    >
                      {item.noindexIntentional ? "Marked Noindex (Undo)" : "Mark Intentional Noindex"}
                    </Button>
                  </div>
                  {item.isDraft ? (
                    <p className="mt-1.5 text-xs text-amber-700">
                      Draft guard is active: Submission is disabled to prevent leaking draft content.
                    </p>
                  ) : null}
                </div>

                {/* Google Inspection Panel */}
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">Google Search Console</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          googleCov.tone === "success"
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                            : googleCov.tone === "warning"
                            ? "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
                            : googleCov.tone === "danger"
                            ? "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {googleCov.chipLabel}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {item.google.lastInspectedAt
                        ? `Inspected ${fmtDateTime(item.google.lastInspectedAt)}`
                        : "Never inspected"}
                    </span>
                  </div>

                  <dl className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <dt className="text-gray-400">Coverage State</dt>
                      <dd className="mt-0.5 font-medium text-gray-800">
                        {item.google.coverageState || "Unknown / Not inspected"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Indexing Verdict</dt>
                      <dd className="mt-0.5 font-medium text-gray-800">
                        {item.google.verdict || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Robots.txt</dt>
                      <dd className="mt-0.5 font-medium text-gray-800">
                        {item.google.robotsTxtState || "ALLOWED"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Last Crawl Time</dt>
                      <dd className="mt-0.5 font-medium text-gray-800">
                        {item.google.lastCrawlTime ? fmtDateTime(item.google.lastCrawlTime) : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Submitted at</dt>
                      <dd className="mt-0.5 font-medium text-gray-800">
                        {item.google.submittedAt ? fmtDateTime(item.google.submittedAt) : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Indexing API Response</dt>
                      <dd className="mt-0.5 font-medium text-gray-800">
                        {item.google.lastResponseCode ? `${item.google.lastResponseCode} OK` : "—"}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Bing & IndexNow Panel */}
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">Bing & IndexNow</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          bingCov.tone === "success"
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                            : bingCov.tone === "warning"
                            ? "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {bingCov.chipLabel}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {item.bing.lastInspectedAt
                        ? `Checked ${fmtDateTime(item.bing.lastInspectedAt)}`
                        : "—"}
                    </span>
                  </div>

                  <dl className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <dt className="text-gray-400">Bing Webmaster Submitted</dt>
                      <dd className="mt-0.5 font-medium text-gray-800">
                        {item.bing.submittedAt ? fmtDateTime(item.bing.submittedAt) : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">IndexNow Ping</dt>
                      <dd className="mt-0.5 font-medium text-gray-800">
                        {item.indexnow.submittedAt ? fmtDateTime(item.indexnow.submittedAt) : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Bing Crawled</dt>
                      <dd className="mt-0.5 font-medium text-gray-800">
                        {item.bing.lastCrawlTime ? fmtDateTime(item.bing.lastCrawlTime) : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Bing Response Code</dt>
                      <dd className="mt-0.5 font-medium text-gray-800">
                        {item.bing.lastResponseCode || item.indexnow.statusCode || "—"}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* History Timeline */}
                <div>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Audit Timeline & History
                  </h4>
                  {item.history && item.history.length > 0 ? (
                    <ul className="relative space-y-4 border-l border-gray-200 pl-4 text-xs">
                      {item.history.map((ev, i) => (
                        <li key={i} className="relative">
                          <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-gray-400" />
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-gray-100 px-1.5 py-0.5 font-semibold uppercase tracking-wider text-[10px] text-gray-600">
                              {ev.source}
                            </span>
                            <span className="font-medium text-gray-700">{ev.action}</span>
                            <span className="text-gray-400">{fmtDateTime(ev.ts)}</span>
                          </div>
                          <p className="mt-1 text-gray-600">{ev.result}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-400">No events recorded yet.</p>
                  )}
                </div>
              </div>
            ) : null}
          </StatePanel>
        </div>
      </aside>
    </div>
  );
}
