"use client";

import { useState, useEffect } from "react";
import VersionCompareOverlay, {
  VersionMeta,
} from "./VersionCompareOverlay";

interface Version {
  version: number;
  snapshot: string;
  diff?: string;
  charDelta?: number;
  changedBy: string;
  changeType: string;
  commitMessage?: string;
  timestamp: string;
  title?: string;
  postType?: string;
}

interface VersionHistoryModalProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
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
      <p className="text-xs italic font-geist text-gray-400 py-1">
        No diff recorded — this is likely the initial version.
      </p>
    );
  }

  const lines = diff.split("\n").filter((l) => l.trim().length > 0);

  return (
    <div className="rounded-lg border border-gray-200 overflow-auto max-h-60 text-[11px] font-geist leading-relaxed divide-y divide-gray-100">
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

/** Dedicated modal that shows the stored diff for a single version. */
function DiffViewModal({
  version: ver,
  onClose,
  onRestoreFull,
  onCompareWithCurrent,
}: {
  version: Version;
  onClose: () => void;
  onRestoreFull: () => void;
  onCompareWithCurrent?: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-base font-bold font-geist text-gray-900">
                Version {ver.version}
              </h3>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold font-geist uppercase tracking-wider">
                {ver.changeType}
              </span>
              {ver.charDelta !== undefined && (
                <span
                  className={`text-[11px] font-medium font-jetbrains-mono ${ver.charDelta > 0
                    ? "text-green-600"
                    : ver.charDelta < 0
                      ? "text-red-600"
                      : "text-gray-500"
                    }`}
                >
                  {ver.charDelta > 0 ? "+" : ""}
                  {ver.charDelta} chars
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 font-geist">
              {new Date(ver.timestamp).toLocaleString()}
            </p>
            {ver.commitMessage && (
              <p className="text-sm text-gray-700 font-geist mt-1.5">
                {ver.commitMessage}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Diff body */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider font-jetbrains-mono mb-3">
            What changed in this version
          </p>
          {renderDiff(ver.diff)}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between gap-3 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold font-geist text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            {onCompareWithCurrent && (
              <button
                onClick={onCompareWithCurrent}
                className="px-3 py-1.5 text-xs font-semibold font-geist text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
              >
                Compare with Current →
              </button>
            )}
            <button
              onClick={onRestoreFull}
              className="px-3 py-1.5 text-xs font-semibold font-geist text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
            >
              Restore this Version
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VersionHistoryModal({
  postId,
  isOpen,
  onClose,
  onRestore,
  currentContent,
}: VersionHistoryModalProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [diffModalVersion, setDiffModalVersion] = useState<Version | null>(null);
  const [compareVersion, setCompareVersion] = useState<VersionMeta | null>(
    null,
  );

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
    if (isOpen && postId) {
      fetchVersionHistory();
    }
  }, [isOpen, postId]);

  const fetchVersionHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/pirateCOS/content-history/${postId}`);
      const data = await response.json();

      if (data.success) {
        setVersions(data.data.versions);
      }
    } catch (error) {
      console.error("Failed to fetch version history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (version: number) => {
    if (!confirm(`Restore to version ${version}? This will create a new version.`)) {
      return;
    }

    setRestoring(true);
    try {
      const response = await fetch("/api/pirateCOS/content-history/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, version }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Successfully restored to version ${version}`);
        onRestore(version);
        onClose();
        // Reload page to show restored content
        window.location.reload();
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

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case "manual":
        return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" };
      case "ai-generation":
      case "ai-rewrite":
      case "ai-continue":
      case "ai-improve":
        return { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" };
      case "restore":
        return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" };
      default:
        return { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };
    }
  };

  const getChangeTypeLabel = (type: string) => {
    switch (type) {
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
      default:
        return type;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-geist text-gray-900">Version History</h2>
              <p className="text-sm text-gray-500 font-geist mt-1">
                View and restore previous versions
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4" />
                <p className="text-sm font-geist">Loading version history...</p>
              </div>
            ) : versions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-geist">No version history available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {versions.map((version) => {
                  const colors = getChangeTypeColor(version.changeType);
                  const isSelected = selectedVersion === version.version;

                  return (
                    <div
                      key={version.version}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${isSelected
                        ? "border-purple-300 bg-purple-50/30"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      onClick={() => setSelectedVersion(isSelected ? null : version.version)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold font-geist text-gray-900">
                              v{version.version}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium font-jetbrains-mono uppercase ${colors.bg} ${colors.text} ${colors.border} border`}>
                              {getChangeTypeLabel(version.changeType)}
                            </span>
                            {version.charDelta !== undefined && (
                              <span className={`text-xs font-medium ${version.charDelta > 0 ? "text-green-600" : version.charDelta < 0 ? "text-red-600" : "text-gray-500"}`}>
                                {version.charDelta > 0 ? "+" : ""}{version.charDelta} chars
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 font-geist mb-1">
                            {version.commitMessage || "No message"}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-gray-400 font-geist">
                            <span>{new Date(version.timestamp).toLocaleString()}</span>
                            <span>•</span>
                            <span>by {version.changedBy === "ai" ? "AI" : "You"}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                          {/* What changed IN this version → opens diff modal */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDiffModalVersion(version);
                            }}
                            title="Show what changed within this specific save"
                            className="px-3 py-1.5 text-xs font-semibold font-geist text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                          >
                            View Changes
                          </button>
                          {/* How this snapshot compares to the live draft (full overlay) */}
                          {currentContent !== undefined && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openCompare(version);
                              }}
                              title="Compare this snapshot side-by-side with your current draft"
                              className="px-3 py-1.5 text-xs font-semibold font-geist text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                            >
                              Compare with Current
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestore(version.version);
                            }}
                            disabled={restoring}
                            className="px-3 py-1.5 text-xs font-semibold font-geist text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200 disabled:opacity-50"
                          >
                            {restoring ? "Restoring..." : "Restore"}
                          </button>
                        </div>
                      </div>


                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {diffModalVersion && (
        <DiffViewModal
          version={diffModalVersion}
          onClose={() => setDiffModalVersion(null)}
          onRestoreFull={() => handleRestore(diffModalVersion.version)}
          onCompareWithCurrent={
            currentContent !== undefined
              ? () => {
                openCompare(diffModalVersion);
                setDiffModalVersion(null);
              }
              : undefined
          }
        />
      )}

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
    </>
  );
}
