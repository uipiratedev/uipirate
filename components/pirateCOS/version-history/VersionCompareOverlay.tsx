"use client";

/**
 * Phase 4F.2: Side-by-side version compare overlay.
 *
 * Renders a full-screen split view comparing a historical snapshot (left)
 * with the current draft (right). The diff is computed locally via an
 * LCS-based block-level tokenizer so the user can pick individual hunks
 * to merge into a new revision.
 */

import { useMemo, useState } from "react";

export interface VersionMeta {
  version: number;
  timestamp: string;
  changeType: string;
  commitMessage?: string;
  snapshot: string;
}

interface VersionCompareOverlayProps {
  postId: string;
  version: VersionMeta;
  currentContent: string;
  onClose: () => void;
  onApplied?: () => void;
}

type HunkKind = "unchanged" | "changed" | "added" | "removed";

interface Hunk {
  id: string;
  kind: HunkKind;
  oldLines: string[];
  newLines: string[];
}

// Split HTML into block-level chunks so diffing operates on logical blocks
// rather than the entire document as a single string.
function tokenizeHtml(html: string): string[] {
  if (!html) return [];
  const normalized = html
    .replace(
      /(<\/(p|h[1-6]|li|ul|ol|blockquote|pre|figure|hr|table|tr|td|th|div)>)/gi,
      "$1\n",
    )
    .replace(/(<br\s*\/?>)/gi, "$1\n")
    .replace(/\n+/g, "\n")
    .trim();
  const lines = normalized
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  return lines.length > 0 ? lines : [html];
}

// LCS-based line diff that coalesces adjacent add/remove ops into hunks.
function buildHunks(oldLines: string[], newLines: string[]): Hunk[] {
  const m = oldLines.length;
  const n = newLines.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  );
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (oldLines[i] === newLines[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  type Op = { t: "eq" | "rem" | "add"; v: string };
  const ops: Op[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (oldLines[i] === newLines[j]) {
      ops.push({ t: "eq", v: oldLines[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ t: "rem", v: oldLines[i] });
      i++;
    } else {
      ops.push({ t: "add", v: newLines[j] });
      j++;
    }
  }
  while (i < m) ops.push({ t: "rem", v: oldLines[i++] });
  while (j < n) ops.push({ t: "add", v: newLines[j++] });

  const hunks: Hunk[] = [];
  let k = 0;
  let idx = 0;
  while (k < ops.length) {
    if (ops[k].t === "eq") {
      const start = k;
      while (k < ops.length && ops[k].t === "eq") k++;
      const lines = ops.slice(start, k).map((o) => o.v);
      hunks.push({
        id: `h${idx++}`,
        kind: "unchanged",
        oldLines: lines,
        newLines: lines,
      });
    } else {
      const start = k;
      while (k < ops.length && ops[k].t !== "eq") k++;
      const seg = ops.slice(start, k);
      const olds = seg.filter((o) => o.t === "rem").map((o) => o.v);
      const news = seg.filter((o) => o.t === "add").map((o) => o.v);
      const kind: HunkKind =
        olds.length && news.length
          ? "changed"
          : olds.length
            ? "removed"
            : "added";
      hunks.push({ id: `h${idx++}`, kind, oldLines: olds, newLines: news });
    }
  }
  return hunks;
}

const changeTypeLabel = (t: string) => {
  switch (t) {
    case "manual":
      return "Manual Edit";
    case "ai-generation":
      return "AI Generated";
    case "ai-rewrite":
      return "AI Rewrite";
    case "ai-continue":
      return "AI Continue";
    case "ai-improve":
      return "AI Improve";
    case "restore":
      return "Restored";
    case "import":
      return "Imported";
    default:
      return t;
  }
};

// ─── GitHub-style display rows ────────────────────────────────────────────────

/** Lines of unchanged context shown above and below each change hunk. */
const CONTEXT_LINES = 3;

type DisplayRow =
  | { kind: "context"; line: string; rowKey: string }
  | { kind: "collapse"; hiddenCount: number; hunkId: string; rowKey: string }
  | { kind: "removed"; line: string; rowKey: string }
  | { kind: "added"; line: string; rowKey: string }
  | {
    kind: "pick-strip";
    hunk: Hunk;
    changeNum: number;
    totalChanges: number;
    rowKey: string;
  };

/**
 * Convert raw hunks into a flat list of display rows.
 * Unchanged hunks are split into:
 *   • up to CONTEXT_LINES shown at top (after previous change)
 *   • a single "collapse" row for hidden middle lines
 *   • up to CONTEXT_LINES shown at bottom (before next change)
 * Expanded hunks (tracked in `expandedHunks`) show all lines.
 */
function buildDisplayRows(
  hunks: Hunk[],
  expandedHunks: Set<string>,
): DisplayRow[] {
  const rows: DisplayRow[] = [];
  let changeNum = 0;
  const totalChanges = hunks.filter((h) => h.kind !== "unchanged").length;

  for (let i = 0; i < hunks.length; i++) {
    const h = hunks[i];

    if (h.kind !== "unchanged") {
      changeNum++;
      rows.push({
        kind: "pick-strip",
        hunk: h,
        changeNum,
        totalChanges,
        rowKey: `ps-${h.id}`,
      });
      // Removed lines go on the left; show one row per token
      if (h.kind === "removed" || h.kind === "changed") {
        h.oldLines.forEach((line, j) =>
          rows.push({ kind: "removed", line, rowKey: `rem-${h.id}-${j}` }),
        );
      }
      // Added lines go on the right; show one row per token
      if (h.kind === "added" || h.kind === "changed") {
        h.newLines.forEach((line, j) =>
          rows.push({ kind: "added", line, rowKey: `add-${h.id}-${j}` }),
        );
      }
      continue;
    }

    // ── Unchanged hunk: apply context collapsing ──────────────────────────
    const lines = h.oldLines; // identical to newLines for "unchanged"
    const hasPrev = i > 0;
    const hasNext = i < hunks.length - 1;
    const showFirst = hasPrev ? CONTEXT_LINES : 0;
    const showLast = hasNext ? CONTEXT_LINES : 0;

    if (expandedHunks.has(h.id) || lines.length <= showFirst + showLast) {
      // Show everything — hunk is small or the user expanded it
      lines.forEach((line, j) =>
        rows.push({ kind: "context", line, rowKey: `ctx-${h.id}-${j}` }),
      );
    } else {
      // Top context (after previous change)
      lines
        .slice(0, showFirst)
        .forEach((line, j) =>
          rows.push({ kind: "context", line, rowKey: `top-${h.id}-${j}` }),
        );
      // Collapse indicator
      rows.push({
        kind: "collapse",
        hiddenCount: lines.length - showFirst - showLast,
        hunkId: h.id,
        rowKey: `col-${h.id}`,
      });
      // Bottom context (before next change)
      lines
        .slice(lines.length - showLast)
        .forEach((line, j) =>
          rows.push({ kind: "context", line, rowKey: `bot-${h.id}-${j}` }),
        );
    }
  }

  return rows;
}


export default function VersionCompareOverlay({
  postId,
  version,
  currentContent,
  onClose,
  onApplied,
}: VersionCompareOverlayProps) {
  const oldTokens = useMemo(
    () => tokenizeHtml(version.snapshot ?? ""),
    [version.snapshot],
  );
  const newTokens = useMemo(
    () => tokenizeHtml(currentContent ?? ""),
    [currentContent],
  );
  const hunks = useMemo(
    () => buildHunks(oldTokens, newTokens),
    [oldTokens, newTokens],
  );

  const [selections, setSelections] = useState<
    Record<string, "current" | "historical">
  >({});
  const [applying, setApplying] = useState(false);
  const [expandedHunks, setExpandedHunks] = useState<Set<string>>(new Set());

  const expandHunk = (id: string) =>
    setExpandedHunks((prev) => new Set([...prev, id]));

  const displayRows = useMemo(
    () => buildDisplayRows(hunks, expandedHunks),
    [hunks, expandedHunks],
  );

  const setPick = (id: string, side: "current" | "historical") =>
    setSelections((s) => ({ ...s, [id]: side }));

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    for (const h of hunks) {
      if (h.kind === "added") added += h.newLines.length;
      else if (h.kind === "removed") removed += h.oldLines.length;
      else if (h.kind === "changed") {
        added += h.newLines.length;
        removed += h.oldLines.length;
      }
    }
    return { added, removed };
  }, [hunks]);

  const buildMerged = (): string => {
    const out: string[] = [];
    for (const h of hunks) {
      if (h.kind === "unchanged") {
        out.push(...h.newLines);
      } else {
        const side = selections[h.id] ?? "current";
        out.push(...(side === "historical" ? h.oldLines : h.newLines));
      }
    }
    return out.join("\n");
  };

  const applySelective = async () => {
    setApplying(true);
    try {
      const merged = buildMerged();
      const res = await fetch(`/api/pirateCOS/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: merged,
          changeType: "restore",
          commitMessage: `Selective restore from v${version.version}`,
        }),
      });
      const data = await res.json();
      if (!data.success)
        throw new Error(data.error || "Failed to apply changes");
      onApplied?.();
      onClose();
      window.location.reload();
    } catch (e: any) {
      alert(e.message || "Failed to apply changes");
    } finally {
      setApplying(false);
    }
  };

  const restoreFull = async () => {
    if (!confirm(`Restore the entire content to version ${version.version}?`))
      return;
    setApplying(true);
    try {
      const res = await fetch("/api/pirateCOS/content-history/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, version: version.version }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to restore");
      onApplied?.();
      onClose();
      window.location.reload();
    } catch (e: any) {
      alert(e.message || "Failed to restore");
    } finally {
      setApplying(false);
    }
  };


  const pickedCount = Object.values(selections).filter(
    (s) => s === "historical",
  ).length;
  const changeableHunks = hunks.filter((h) => h.kind !== "unchanged").length;
  const isIdentical = hunks.length > 0 && changeableHunks === 0;
  const bothEmpty =
    hunks.length === 0 &&
    !version.snapshot &&
    !currentContent;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full h-full max-w-[1400px] max-h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold font-geist text-gray-900">
                Compare Version {version.version} with Current
              </h2>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold font-geist uppercase tracking-wider"
                style={{
                  background: version.changeType.startsWith("ai")
                    ? "rgba(168,85,247,0.1)"
                    : "rgba(255,91,4,0.1)",
                  color: version.changeType.startsWith("ai")
                    ? "#a855f7"
                    : "#FF5B04",
                }}
              >
                {changeTypeLabel(version.changeType)}
              </span>
            </div>
            {version.commitMessage && (
              <p className="text-sm text-gray-600 font-geist mt-1 line-clamp-2">
                {version.commitMessage}
              </p>
            )}
            <div className="flex items-center gap-3 text-xs text-gray-500 font-geist mt-1 flex-wrap">
              <span>{new Date(version.timestamp).toLocaleString()}</span>
              <span>•</span>
              {isIdentical || bothEmpty ? (
                <span className="font-semibold text-blue-600 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {bothEmpty ? "Both sides empty" : "Identical to current draft"}
                </span>
              ) : (
                <>
                  <span className="font-jetbrains-mono text-green-600">
                    +{stats.added} added
                  </span>
                  <span className="font-jetbrains-mono text-red-600">
                    -{stats.removed} removed
                  </span>
                  <span>•</span>
                  <span>
                    {changeableHunks} hunk{changeableHunks === 1 ? "" : "s"}
                  </span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none shrink-0"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* ── Diff body ─────────────────────────────────────────────────── */}
        {bothEmpty ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400 font-geist">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-semibold text-gray-600">Both sides are empty</p>
              <p className="text-sm mt-1">
                The historical snapshot and current draft both contain no content.
              </p>
            </div>
          </div>
        ) : isIdentical ? (
          /* ── Identical state: show content with blue banner ── */
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-200 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-blue-600 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm font-semibold font-geist text-blue-800">
                This version&apos;s content is identical to your current draft.
              </p>
              <p className="text-xs text-blue-600 font-geist ml-1">
                No changes have been made since this snapshot was saved.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 overflow-hidden">
              <div className="border-r border-gray-200 overflow-auto">
                <div className="px-4 py-2 sticky top-0 bg-white border-b border-gray-200 z-10">
                  <p className="text-xs font-bold font-jetbrains-mono uppercase tracking-wider text-gray-500">
                    Historical · v{version.version}
                  </p>
                </div>
                <div
                  className="p-4 prose prose-sm max-w-none text-gray-700 font-geist"
                  dangerouslySetInnerHTML={{ __html: version.snapshot }}
                />
              </div>
              <div className="overflow-auto">
                <div className="px-4 py-2 sticky top-0 bg-white border-b border-gray-200 z-10">
                  <p className="text-xs font-bold font-jetbrains-mono uppercase tracking-wider text-gray-500">
                    Current Draft
                  </p>
                </div>
                <div
                  className="p-4 prose prose-sm max-w-none text-gray-700 font-geist"
                  dangerouslySetInnerHTML={{ __html: currentContent }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* ── GitHub-style hunk view ── */
          <div className="flex-1 overflow-auto">
            {/* Sticky column headers */}
            <div className="grid grid-cols-2 sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
              <div className="px-4 py-2 border-r border-gray-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                <span className="text-xs font-bold font-jetbrains-mono uppercase tracking-wider text-red-600">
                  Historical · v{version.version}
                </span>
              </div>
              <div className="px-4 py-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                <span className="text-xs font-bold font-jetbrains-mono uppercase tracking-wider text-green-600">
                  Current Draft
                </span>
              </div>
            </div>

            {/* Diff rows */}
            {displayRows.map((row) => {
              /* ── Collapse indicator ── */
              if (row.kind === "collapse") {
                return (
                  <div
                    key={row.rowKey}
                    className="flex items-center gap-3 px-4 py-2 bg-gray-50 border-y border-gray-200 select-none"
                  >
                    <span className="text-gray-300 font-jetbrains-mono text-sm leading-none">
                      ⋯
                    </span>
                    <span className="text-xs font-jetbrains-mono text-gray-400">
                      {row.hiddenCount} unchanged{" "}
                      {row.hiddenCount === 1 ? "block" : "blocks"} hidden
                    </span>
                    <button
                      onClick={() => expandHunk(row.hunkId)}
                      className="text-[11px] font-semibold font-geist text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors"
                    >
                      Show all
                    </button>
                    <span className="text-gray-300 font-jetbrains-mono text-sm leading-none">
                      ⋯
                    </span>
                  </div>
                );
              }

              /* ── Pick-strip (hunk header) ── */
              if (row.kind === "pick-strip") {
                const h = row.hunk;
                const picked = selections[h.id] === "historical";
                const kindLabel =
                  h.kind === "added"
                    ? "addition"
                    : h.kind === "removed"
                      ? "deletion"
                      : "change";
                return (
                  <div
                    key={row.rowKey}
                    className="flex items-center gap-3 px-4 py-1.5 bg-gray-100 border-y border-gray-300"
                  >
                    <span className="text-[10px] font-jetbrains-mono text-gray-400 select-none shrink-0">
                      @@ {kindLabel} {row.changeNum}/{row.totalChanges}
                    </span>
                    <div className="ml-auto flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setPick(h.id, "historical")}
                        className={`text-[11px] font-semibold font-geist px-2.5 py-0.5 rounded border transition-colors ${picked
                          ? "bg-red-600 text-white border-red-600"
                          : "text-red-700 border-red-300 bg-white hover:bg-red-50"
                          }`}
                      >
                        Use Historical
                      </button>
                      <button
                        onClick={() => setPick(h.id, "current")}
                        className={`text-[11px] font-semibold font-geist px-2.5 py-0.5 rounded border transition-colors ${!picked
                          ? "bg-green-600 text-white border-green-600"
                          : "text-green-700 border-green-300 bg-white hover:bg-green-50"
                          }`}
                      >
                        Keep Current
                      </button>
                    </div>
                  </div>
                );
              }

              /* ── Unchanged context ── */
              if (row.kind === "context") {
                return (
                  <div
                    key={row.rowKey}
                    className="grid grid-cols-2 border-b border-gray-100"
                  >
                    <div
                      className="px-4 py-1.5 border-r border-gray-100 text-sm font-geist text-gray-400 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: row.line }}
                    />
                    <div
                      className="px-4 py-1.5 text-sm font-geist text-gray-400 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: row.line }}
                    />
                  </div>
                );
              }

              /* ── Removed line (left column only) ── */
              if (row.kind === "removed") {
                return (
                  <div
                    key={row.rowKey}
                    className="grid grid-cols-2 border-b border-red-100"
                  >
                    <div
                      className="px-4 py-1.5 border-r border-red-200 bg-red-50 text-sm font-geist text-red-900 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: row.line }}
                    />
                    <div
                      className="bg-gray-50 border-r-0"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,0.04) 5px,rgba(0,0,0,0.04) 10px)",
                      }}
                    />
                  </div>
                );
              }

              /* ── Added line (right column only) ── */
              if (row.kind === "added") {
                return (
                  <div
                    key={row.rowKey}
                    className="grid grid-cols-2 border-b border-green-100"
                  >
                    <div
                      className="border-r border-green-200 bg-gray-50"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,0.04) 5px,rgba(0,0,0,0.04) 10px)",
                      }}
                    />
                    <div
                      className="px-4 py-1.5 bg-green-50 text-sm font-geist text-green-900 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: row.line }}
                    />
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between gap-3 bg-gray-50">
          <div className="text-xs text-gray-600 font-geist">
            {isIdentical || bothEmpty ? (
              <span className="text-blue-600 font-medium">
                {bothEmpty
                  ? "Both sides are empty."
                  : "Content is identical — no changes to pick. You can still restore this version as a new entry."}
              </span>
            ) : (
              <span>
                <span className="font-semibold font-jetbrains-mono text-gray-900">
                  {pickedCount}
                </span>{" "}
                of{" "}
                <span className="font-semibold font-jetbrains-mono text-gray-900">
                  {changeableHunks}
                </span>{" "}
                hunk{changeableHunks === 1 ? "" : "s"} picked from history
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={applying}
              className="px-3 py-1.5 text-xs font-semibold font-geist text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            {!bothEmpty && (
              <button
                onClick={restoreFull}
                disabled={applying}
                className="px-3 py-1.5 text-xs font-semibold font-geist text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 disabled:opacity-50"
              >
                {applying ? "Working..." : "Restore Full Version"}
              </button>
            )}
            {!isIdentical && !bothEmpty && (
              <button
                onClick={applySelective}
                disabled={applying || pickedCount === 0}
                className="px-3 py-1.5 text-xs font-semibold font-geist text-white bg-[#FF5B04] hover:opacity-90 rounded-lg disabled:opacity-50"
              >
                {applying ? "Applying..." : `Apply Picked (${pickedCount})`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


