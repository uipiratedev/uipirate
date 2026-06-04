"use client";

import { useState, useEffect } from "react";

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
}

export default function VersionHistoryModal({
  postId,
  isOpen,
  onClose,
  onRestore,
}: VersionHistoryModalProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [restoring, setRestoring] = useState(false);

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
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
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

                    {/* Expanded content */}
                    {isSelected && version.diff && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-jetbrains-mono mb-2">
                          Changes
                        </p>
                        <pre className="text-xs font-mono bg-gray-50 p-3 rounded-lg overflow-x-auto max-h-60 overflow-y-auto border border-gray-200">
                          {version.diff}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
