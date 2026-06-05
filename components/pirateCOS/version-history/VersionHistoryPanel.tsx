"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VersionCompareOverlay, {
  VersionMeta,
} from "./VersionCompareOverlay";

interface Version {
  version: number;
  timestamp: string;
  changeType: string;
  preview?: string;
  diff?: string;
  charDelta?: number;
  commitMessage?: string;
  snapshot?: string;
}

interface VersionHistoryPanelProps {
  postId: string;
  onRestore: (version: number) => void;
  currentContent?: string;
}

/**
 * Strip HTML markup from a diff line so we display readable prose,
 * not a wall of tags. Base64 image data is replaced with a short
 * placeholder before tag-stripping to avoid kilobyte-long lines.
 */
const cleanDiffContent = (raw: string): string =>
  raw
    .replace(/src="data:[^"]{10,}"/gi, 'src="[image]"')
    .replace(/href="data:[^"]{10,}"/gi, 'href="[data]"')
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Inline unified-diff renderer for "View Changes" (what changed *in* this version). */
const renderDiff = (diff?: string) => {
  if (!diff || diff === "No changes") {
    return (
      <p className="text-[11px] italic font-geist text-gray-400 py-1">
        No diff recorded — this is likely the initial version.
      </p>
    );
  }

  const lines = diff.split("\n").filter((l) => l.trim().length > 0);

  return (
    <div className="rounded-lg border border-gray-200 overflow-auto max-h-52 text-[11px] font-geist leading-relaxed divide-y divide-gray-100">
      {lines.map((line, idx) => {
        const isAdded = line.startsWith("+ ");
        const isRemoved = line.startsWith("- ");
        const content = cleanDiffContent(
          isAdded || isRemoved ? line.slice(2) : line,
        );
        if (!content) return null;
        return (
          <div
            key={idx}
            className={`flex gap-2 px-3 py-1.5 ${isAdded
                ? "bg-green-50 border-l-2 border-green-400"
                : isRemoved
                  ? "bg-red-50 border-l-2 border-red-400"
                  : "bg-white"
              }`}
          >
            <span
              className={`select-none shrink-0 font-jetbrains-mono font-bold ${isAdded
                  ? "text-green-500"
                  : isRemoved
                    ? "text-red-500"
                    : "text-gray-300"
                }`}
            >
              {isAdded ? "+" : isRemoved ? "−" : " "}
            </span>
            <span
              className={`break-words min-w-0 ${isAdded
                  ? "text-green-900"
                  : isRemoved
                    ? "text-red-900"
                    : "text-gray-500"
                }`}
            >
              {content}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const renderCharDelta = (delta?: number) => {
  if (delta === undefined || delta === null) return null;
  const sign = delta > 0 ? "+" : "";
  const color =
    delta > 0
      ? "text-green-600"
      : delta < 0
        ? "text-red-600"
        : "text-gray-500";
  return (
    <span className={`text-[10px] font-medium font-jetbrains-mono ${color}`}>
      {sign}
      {delta} chars
    </span>
  );
};

export default function VersionHistoryPanel({
  postId,
  onRestore,
  currentContent,
}: VersionHistoryPanelProps) {
  const router = useRouter();
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [diffOpen, setDiffOpen] = useState<Set<number>>(new Set());
  const [compareVersion, setCompareVersion] = useState<VersionMeta | null>(
    null,
  );

  const toggleDiff = (versionNum: number) => {
    setDiffOpen((prev) => {
      const next = new Set(prev);
      if (next.has(versionNum)) next.delete(versionNum);
      else next.add(versionNum);
      return next;
    });
  };

  const openCompare = (ver: Version) => {
    setCompareVersion({
      version: ver.version,
      timestamp: ver.timestamp,
      changeType: ver.changeType,
      commitMessage: ver.commitMessage,
      snapshot: ver.snapshot ?? "",
    });
  };

  useEffect(() => {
    fetchVersions();
  }, [postId]);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pirateCOS/content-history/${postId}`);
      const data = await res.json();
      if (data.success) {
        setVersions(data.data.versions || []);
      }
    } catch (error) {
      console.error("Failed to fetch versions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (version: number) => {
    if (!confirm(`Are you sure you want to restore to version ${version}?`)) {
      return;
    }

    setRestoring(true);
    try {
      const res = await fetch(`/api/pirateCOS/content-history/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, version }),
      });
      const data = await res.json();

      if (data.success) {
        onRestore(version);
        router.refresh();
      } else {
        alert("Failed to restore version: " + data.error);
      }
    } catch (error) {
      console.error("Failed to restore version:", error);
      alert("Failed to restore version");
    } finally {
      setRestoring(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="w-8 h-8 border-2 border-[#FF5B04] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-sm font-geist text-gray-500">No versions saved yet</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-2 p-4">
        {versions.map((ver) => (
          <div
            key={ver.version}
            className={`border rounded-lg p-3 transition-all cursor-pointer ${selectedVersion === ver.version
              ? "border-[#FF5B04] bg-orange-50/30"
              : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            onClick={() => setSelectedVersion(selectedVersion === ver.version ? null : ver.version)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0">
                <p className="text-xs font-bold font-geist text-gray-900">
                  Version {ver.version}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <p className="text-[10px] text-gray-500 font-geist">
                    {new Date(ver.timestamp).toLocaleString()}
                  </p>
                  {renderCharDelta(ver.charDelta)}
                </div>
              </div>
              <span
                className="text-[9px] px-2 py-0.5 rounded-full font-semibold font-geist uppercase tracking-wider shrink-0"
                style={{
                  background: ver.changeType === "major" ? "rgba(255,91,4,0.1)" : "rgba(0,0,0,0.05)",
                  color: ver.changeType === "major" ? "#FF5B04" : "#6b7280",
                }}
              >
                {ver.changeType}
              </span>
            </div>

            {ver.commitMessage && (
              <p className="text-xs text-gray-600 font-geist line-clamp-2 mb-2">
                {ver.commitMessage}
              </p>
            )}

            {ver.preview && !ver.commitMessage && (
              <p className="text-xs text-gray-600 font-geist line-clamp-2 mb-2">
                {ver.preview}
              </p>
            )}

            <div className="flex gap-1.5 mt-2 flex-wrap">
              {/* What changed IN this version (inline diff from stored diff string) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDiff(ver.version);
                }}
                title="Show what changed within this specific save"
                className="px-2.5 py-1 text-[11px] font-semibold font-geist text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors"
              >
                {diffOpen.has(ver.version) ? "Hide Changes" : "View Changes"}
              </button>
              {/* How this snapshot compares to the live draft (full overlay) */}
              {currentContent !== undefined && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openCompare(ver);
                  }}
                  title="Compare this snapshot side-by-side with your current draft"
                  className="px-2.5 py-1 text-[11px] font-semibold font-geist text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
                >
                  vs. Current
                </button>
              )}
              {selectedVersion === ver.version && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestore(ver.version);
                  }}
                  disabled={restoring}
                  className="ml-auto px-3 py-1 bg-[#FF5B04] text-white text-[11px] font-semibold font-geist rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {restoring ? "Restoring..." : "Restore"}
                </button>
              )}
            </div>

            {/* Inline diff — "what happened in this version" */}
            {diffOpen.has(ver.version) && (
              <div
                className="mt-3 pt-3 border-t border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider font-jetbrains-mono mb-1.5">
                  What changed in this version
                </p>
                {renderDiff(ver.diff)}
              </div>
            )}
          </div>
        ))}
      </div>

      {compareVersion && currentContent !== undefined && (
        <VersionCompareOverlay
          postId={postId}
          version={compareVersion}
          currentContent={currentContent}
          onClose={() => setCompareVersion(null)}
          onApplied={() => {
            onRestore(compareVersion.version);
          }}
        />
      )}
    </div>
  );
}
