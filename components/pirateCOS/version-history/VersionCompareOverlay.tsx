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
            <div className="flex items-center gap-3 text-xs text-gray-500 font-geist mt-1">
              <span>{new Date(version.timestamp).toLocaleString()}</span>
              <span>•</span>
              <span className="font-jetbrains-mono text-green-600">
                +{stats.added}
              </span>
              <span className="font-jetbrains-mono text-red-600">
                -{stats.removed}
              </span>
              <span>•</span>
              <span>
                {changeableHunks} hunk{changeableHunks === 1 ? "" : "s"}
              </span>
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

        {/* Split panes */}
        <div className="flex-1 grid grid-cols-2 overflow-hidden">
          <div className="border-r border-gray-200 overflow-auto bg-red-50/20">
            <div className="px-4 py-2 sticky top-0 bg-white border-b border-gray-200 z-10">
              <p className="text-xs font-bold font-jetbrains-mono uppercase tracking-wider text-red-700">
                Historical · v{version.version}
              </p>
            </div>
            <div className="p-4 space-y-1">
              {hunks.map((h) => renderPane(h, "old", selections, setPick))}
            </div>
          </div>
          <div className="overflow-auto bg-green-50/20">
            <div className="px-4 py-2 sticky top-0 bg-white border-b border-gray-200 z-10">
              <p className="text-xs font-bold font-jetbrains-mono uppercase tracking-wider text-green-700">
                Current Draft
              </p>
            </div>
            <div className="p-4 space-y-1">
              {hunks.map((h) => renderPane(h, "new", selections, setPick))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between gap-3 bg-gray-50">
          <div className="text-xs text-gray-600 font-geist">
            {changeableHunks === 0 ? (
              <span>No differences between this version and the current draft.</span>
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
            <button
              onClick={restoreFull}
              disabled={applying || changeableHunks === 0}
              className="px-3 py-1.5 text-xs font-semibold font-geist text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 disabled:opacity-50"
            >
              {applying ? "Working..." : "Restore Full Version"}
            </button>
            <button
              onClick={applySelective}
              disabled={applying || pickedCount === 0}
              className="px-3 py-1.5 text-xs font-semibold font-geist text-white bg-[#FF5B04] hover:opacity-90 rounded-lg disabled:opacity-50"
            >
              {applying
                ? "Applying..."
                : `Apply Picked (${pickedCount})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderPane(
  h: Hunk,
  side: "old" | "new",
  selections: Record<string, "current" | "historical">,
  setPick: (id: string, side: "current" | "historical") => void,
) {
  const isOld = side === "old";
  const lines = isOld ? h.oldLines : h.newLines;
  if (h.kind === "unchanged") {
    return (
      <div key={`${side}-${h.id}`} className="opacity-60 px-2">
        <div
          className="prose prose-sm max-w-none text-gray-700 font-geist"
          dangerouslySetInnerHTML={{ __html: lines.join("\n") }}
        />
      </div>
    );
  }

  // For changed/added/removed hunks: show a picker on the side that has content
  const picked = selections[h.id] === "historical";
  const showOnThisSide =
    (isOld && h.oldLines.length > 0) || (!isOld && h.newLines.length > 0);
  if (!showOnThisSide) {
    return (
      <div
        key={`${side}-${h.id}`}
        className="text-[10px] font-jetbrains-mono italic text-gray-400 px-2 py-2 border border-dashed border-gray-200 rounded-md"
      >
        (no content on this side)
      </div>
    );
  }
  const tone = isOld
    ? "bg-red-50 border-red-200 text-red-900"
    : "bg-green-50 border-green-200 text-green-900";
  return (
    <div
      key={`${side}-${h.id}`}
      className={`border rounded-md ${tone} ${picked && isOld ? "ring-2 ring-red-400" : ""} ${!picked && !isOld ? "ring-2 ring-green-400" : ""}`}
    >
      <div className="flex items-center justify-between px-2 py-1 border-b border-current/10">
        <span className="text-[10px] font-jetbrains-mono font-bold uppercase tracking-wider">
          {isOld ? "− Historical" : "+ Current"}
        </span>
        <button
          onClick={() => setPick(h.id, isOld ? "historical" : "current")}
          className={`text-[10px] font-semibold font-geist px-2 py-0.5 rounded border ${(isOld && picked) || (!isOld && !picked)
            ? "bg-white border-current/30"
            : "bg-transparent border-current/20 opacity-70 hover:opacity-100"
            }`}
        >
          {(isOld && picked) || (!isOld && !picked) ? "Picked" : "Pick this"}
        </button>
      </div>
      <div className="p-2 space-y-1">
        <div
          className="prose prose-sm max-w-none font-geist"
          dangerouslySetInnerHTML={{ __html: lines.join("\n") }}
        />
        <details className="mt-1">
          <summary className="text-[10px] font-jetbrains-mono cursor-pointer opacity-60 hover:opacity-100">
            view source
          </summary>
          <pre className="text-[10px] font-jetbrains-mono whitespace-pre-wrap break-all bg-white/60 rounded p-1 mt-1 border border-current/10">
            {lines.join("\n")}
          </pre>
        </details>
      </div>
    </div>
  );
}
