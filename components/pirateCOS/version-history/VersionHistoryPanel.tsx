"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Version {
  version: number;
  timestamp: string;
  changeType: string;
  preview: string;
}

interface VersionHistoryPanelProps {
  postId: string;
  onRestore: (version: number) => void;
}

export default function VersionHistoryPanel({
  postId,
  onRestore,
}: VersionHistoryPanelProps) {
  const router = useRouter();
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    fetchVersions();
  }, [postId]);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pirateCOS/posts/${postId}/versions`);
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
      const res = await fetch(`/api/pirateCOS/posts/${postId}/versions/${version}/restore`, {
        method: "POST",
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
            className={`border rounded-lg p-3 transition-all cursor-pointer ${
              selectedVersion === ver.version
                ? "border-[#FF5B04] bg-orange-50/30"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
            onClick={() => setSelectedVersion(selectedVersion === ver.version ? null : ver.version)}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs font-bold font-geist text-gray-900">
                  Version {ver.version}
                </p>
                <p className="text-[10px] text-gray-500 font-geist mt-0.5">
                  {new Date(ver.timestamp).toLocaleString()}
                </p>
              </div>
              <span
                className="text-[9px] px-2 py-0.5 rounded-full font-semibold font-geist uppercase tracking-wider"
                style={{
                  background: ver.changeType === "major" ? "rgba(255,91,4,0.1)" : "rgba(0,0,0,0.05)",
                  color: ver.changeType === "major" ? "#FF5B04" : "#6b7280",
                }}
              >
                {ver.changeType}
              </span>
            </div>

            {ver.preview && (
              <p className="text-xs text-gray-600 font-geist line-clamp-2 mb-2">
                {ver.preview}
              </p>
            )}

            {selectedVersion === ver.version && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestore(ver.version);
                  }}
                  disabled={restoring}
                  className="flex-1 px-3 py-1.5 bg-[#FF5B04] text-white text-xs font-semibold font-geist rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {restoring ? "Restoring..." : "Restore"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
