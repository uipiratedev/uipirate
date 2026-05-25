"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { runPreflight, PreflightCheck } from "@/lib/pirateCOS/distribution/transform/content-preflight";

interface DistributionRecord {
  platform: string;
  externalId: string;
  url: string;
  distributedAt: string | Date;
  status: "success" | "failed" | "pending";
  errorMessage?: string;
}

interface Integration {
  platform: string;
  isActive: boolean;
  isConnected: boolean;
  siteUrl?: string;
  wpUsername?: string;
}

interface DistributionPanelProps {
  blogId: string | null;
  blogPublished: boolean;
  blogContent: string;
  blogExcerpt: string;
  blogTags: string[];
  blogSeo: any;
  distributionRecords: DistributionRecord[];
  onEnsureSaved: () => Promise<string>;
  onUpdateRecords: (records: DistributionRecord[]) => void;
  onNavigateToSEO: () => void;
  onTriggerExcerptAI: () => void;
  onTriggerTagsAI: () => void;
  onTriggerCopilotAI: () => void;
}

const PLATFORM_LABELS: Record<string, string> = {
  wordpress: "WordPress",
  medium: "Medium",
  ghost: "Ghost",
  buffer: "Buffer (X/LinkedIn)",
  linkedin: "LinkedIn Direct",
};

export default function DistributionPanel({
  blogId,
  blogPublished,
  blogContent,
  blogExcerpt,
  blogTags,
  blogSeo,
  distributionRecords = [],
  onEnsureSaved,
  onUpdateRecords,
  onNavigateToSEO,
  onTriggerExcerptAI,
  onTriggerTagsAI,
  onTriggerCopilotAI,
}: DistributionPanelProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [loadingIntegrations, setLoadingIntegrations] = useState(true);
  const [distributing, setDistributing] = useState(false);
  const [distributionError, setDistributionError] = useState<string | null>(null);
  const [preflight, setPreflight] = useState<PreflightCheck[]>([]);

  const isSubdomain = typeof window !== "undefined" && 
    (window.location.hostname.startsWith("cos.") || window.location.hostname === "cos.uipirate.com");
  const integrationsUrl = isSubdomain ? "/settings/integrations" : "/pirateCOS/settings/integrations";

  // Fetch connected channels
  const fetchIntegrations = useCallback(async () => {
    try {
      const res = await fetch("/api/pirateCOS/integrations");
      const data = await res.json();
      if (data.success) {
        setIntegrations(data.integrations || []);
      }
    } catch (err) {
      console.error("Failed to load integrations", err);
    } finally {
      setLoadingIntegrations(false);
    }
  }, []);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  // Run preflight evaluation
  useEffect(() => {
    const checks = runPreflight({
      content: blogContent,
      excerpt: blogExcerpt,
      tags: blogTags,
      featuredImage: blogSeo?.ogImage || "", // Map from ogImage or fallback
      seo: blogSeo,
    });
    setPreflight(checks);
  }, [blogContent, blogExcerpt, blogTags, blogSeo]);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform],
    );
  };

  const handlePreflightAction = (action?: string) => {
    if (!action) return;
    if (action === "Open SEO Editor") onNavigateToSEO();
    if (action === "Generate Excerpt") onTriggerExcerptAI();
    if (action === "Generate Tags") onTriggerTagsAI();
    if (action === "AI Copilot") onTriggerCopilotAI();
  };

  const handleDistribute = async () => {
    if (selectedPlatforms.length === 0) return;
    setDistributing(true);
    setDistributionError(null);

    try {
      // 1. Ensure blog post is saved to the local database
      const savedId = await onEnsureSaved();

      // 2. Trigger distribution publish request
      const res = await fetch("/api/pirateCOS/distribution/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId: savedId,
          platforms: selectedPlatforms,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Distribution publish failed");
      }

      // 3. Update distribution history and trigger success badge feedback
      if (data.results) {
        // Merge fresh results into parent state
        const updatedRecords = [...distributionRecords];
        data.results.forEach((newRec: DistributionRecord) => {
          const idx = updatedRecords.findIndex((r) => r.platform === newRec.platform);
          if (idx > -1) {
            updatedRecords[idx] = newRec;
          } else {
            updatedRecords.push(newRec);
          }
        });
        onUpdateRecords(updatedRecords);
        // Clear selected platforms on success
        setSelectedPlatforms([]);
      }
    } catch (err: any) {
      setDistributionError(err.message || "Failed to publish distribution");
    } finally {
      setDistributing(false);
    }
  };

  // Has errors that prevent distribution?
  const hasPreflightErrors = preflight.some((c) => !c.passed && c.severity === "error");

  return (
    <div className="space-y-4 font-geist text-gray-700">
      {/* SECTION: Pre-flight Checklist */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
        <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-3">
          Pre-flight Checklist
        </p>
        <div className="space-y-2">
          {preflight.map((check) => (
            <div key={check.id} className="flex items-start justify-between gap-2 text-xs">
              <div className="flex items-start gap-2 min-w-0">
                {check.passed ? (
                  <span className="text-green-500 font-bold flex-shrink-0">✓</span>
                ) : check.severity === "error" ? (
                  <span className="text-red-500 font-bold flex-shrink-0">✗</span>
                ) : (
                  <span className="text-amber-500 font-bold flex-shrink-0">⚠</span>
                )}
                <span className={`truncate ${check.passed ? "text-gray-500" : "text-gray-900 font-medium"}`}>
                  {check.label}
                </span>
              </div>
              {!check.passed && check.action && (
                <button
                  type="button"
                  className="text-[10px] font-semibold text-[#FF5B04] hover:underline flex-shrink-0"
                  onClick={() => handlePreflightAction(check.action)}
                >
                  {check.action}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: Target Platforms */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
        <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-3">
          Target Channels
        </p>

        {loadingIntegrations ? (
          <p className="text-xs text-gray-400 py-2">Loading connected platforms...</p>
        ) : integrations.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-xs text-gray-400">No channels set up yet.</p>
            <Link
              href={integrationsUrl}
              className="text-[10px] font-semibold text-[#FF5B04] hover:underline mt-2 inline-block"
            >
              Configure Integrations
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {integrations.map((platform) => {
              const isSelected = selectedPlatforms.includes(platform.platform);
              const disabled = !platform.isConnected || !platform.isActive;

              return (
                <div
                  key={platform.platform}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    disabled
                      ? "opacity-50 bg-black/[0.01] border-transparent"
                      : isSelected
                        ? "border-[#FF5B04]/30 bg-orange-50/20"
                        : "border-black/5 bg-white hover:border-black/10"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800">
                      {PLATFORM_LABELS[platform.platform] || platform.platform}
                    </p>
                    <p className="text-[9px] text-gray-400 truncate">
                      {disabled
                        ? "Not connected"
                        : platform.siteUrl || "Ready to distribute"}
                    </p>
                  </div>

                  {disabled ? (
                    <Link
                      href={integrationsUrl}
                      className="text-[9px] font-semibold text-[#FF5B04] hover:underline"
                    >
                      Connect
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={`w-8 h-4 rounded-full p-0.5 transition-colors relative flex items-center ${
                        isSelected ? "bg-[#FF5B04]" : "bg-gray-200"
                      }`}
                      onClick={() => togglePlatform(platform.platform)}
                    >
                      <span
                        className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 block ${
                          isSelected ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION: History */}
      {distributionRecords.length > 0 && (
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
          <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-3">
            Distribution History
          </p>
          <div className="space-y-2">
            {distributionRecords.map((rec) => (
              <div key={rec.platform} className="flex items-center justify-between text-xs py-1 border-b border-black/[0.03] last:border-0 last:pb-0">
                <span className="font-semibold text-gray-800 uppercase text-[10px] font-jetbrains-mono">
                  {rec.platform}
                </span>

                <div className="flex items-center gap-1.5 min-w-0 max-w-[65%]">
                  {rec.status === "success" ? (
                    <a
                      href={rec.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF5B04] hover:underline truncate inline-block text-[11px]"
                    >
                      View External Link ↗
                    </a>
                  ) : (
                    <span
                      className="text-red-500 font-medium text-[10px] truncate"
                      title={rec.errorMessage || "Distribution failed"}
                    >
                      ✗ Failed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: Distribute Now CTA */}
      <div className="pt-2">
        {!blogPublished && (
          <p className="text-[10px] text-amber-500 bg-amber-50 border border-amber-100 p-2.5 rounded-xl mb-3 leading-relaxed">
            ⚠ Please publish the blog locally (via the "Publish" button at the top right) to enable multi-channel distribution.
          </p>
        )}
        {distributionError && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-100 p-2.5 rounded-xl mb-3 leading-relaxed">
            {distributionError}
          </p>
        )}

        <button
          type="button"
          disabled={
            distributing ||
            !blogPublished ||
            selectedPlatforms.length === 0 ||
            hasPreflightErrors
          }
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white h-10 px-6 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "#FF5B04" }}
          onClick={handleDistribute}
        >
          {distributing ? (
            <>
              <svg
                className="animate-spin"
                fill="none"
                height="14"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                width="14"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Distributing…
            </>
          ) : (
            "Distribute Now"
          )}
        </button>
      </div>
    </div>
  );
}
