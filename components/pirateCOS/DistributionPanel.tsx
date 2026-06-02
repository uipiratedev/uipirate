"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

import {
  runPreflight,
  PreflightCheck,
} from "@/lib/pirateCOS/distribution/transform/content-preflight";
import {
  ContentGoal,
  getPostTypeConfig,
  getGoalConfig,
} from "@/lib/pirateCOS/postTypeConfig";

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
  postType: string;
  contentGoal: ContentGoal;
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
  postType,
  contentGoal,
}: DistributionPanelProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [loadingIntegrations, setLoadingIntegrations] = useState(true);
  const [distributing, setDistributing] = useState(false);
  const [verifyingPlatform, setVerifyingPlatform] = useState<string | null>(
    null,
  );
  const [distributionError, setDistributionError] = useState<string | null>(
    null,
  );
  const [preflight, setPreflight] = useState<PreflightCheck[]>([]);

  const isSubdomain =
    typeof window !== "undefined" &&
    (window.location.hostname.startsWith("cos.") ||
      window.location.hostname === "cos.uipirate.com");
  const integrationsUrl = isSubdomain
    ? "/settings/integrations"
    : "/pirateCOS/settings/integrations";

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
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
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
          const idx = updatedRecords.findIndex(
            (r) => r.platform === newRec.platform,
          );

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

  const handleVerify = async (platform: string) => {
    if (!blogId) return;
    setVerifyingPlatform(platform);
    try {
      const res = await fetch("/api/pirateCOS/distribution/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: blogId, platform }),
      });
      const data = await res.json();

      if (data.success && data.distributionRecords) {
        onUpdateRecords(data.distributionRecords);
        if (!data.exists) {
          alert(
            `Sync complete: The post was deleted on ${PLATFORM_LABELS[platform] || platform}. Status has been updated so you can re-publish.`,
          );
        } else {
          alert(
            `Sync complete: Post verified successfully on ${PLATFORM_LABELS[platform] || platform}!`,
          );
        }
      }
    } catch (err) {
      console.error("Link verification failed", err);
    } finally {
      setVerifyingPlatform(null);
    }
  };

  const handleReset = async (platform: string) => {
    if (!blogId) return;
    if (
      !confirm(
        `Are you sure you want to reset distribution status for ${
          PLATFORM_LABELS[platform] || platform
        }? This will allow you to re-publish.`,
      )
    ) {
      return;
    }

    setVerifyingPlatform(platform);
    try {
      const res = await fetch("/api/pirateCOS/distribution/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: blogId, platform, action: "reset" }),
      });
      const data = await res.json();

      if (data.success && data.distributionRecords) {
        onUpdateRecords(data.distributionRecords);
        alert(
          `Distribution status reset successfully for ${
            PLATFORM_LABELS[platform] || platform
          }. You can now select it to re-publish.`,
        );
      }
    } catch (err) {
      console.error("Reset failed", err);
    } finally {
      setVerifyingPlatform(null);
    }
  };

  // Sort integrations: connected/active channels come first
  const sortedIntegrations = [...integrations].sort((a, b) => {
    const aConnected = a.isConnected && a.isActive;
    const bConnected = b.isConnected && b.isActive;

    if (aConnected && !bConnected) return -1;
    if (!aConnected && bConnected) return 1;

    return 0;
  });

  // Has errors that prevent distribution?
  const hasPreflightErrors = preflight.some(
    (c) => !c.passed && c.severity === "error",
  );

  return (
    <div className="space-y-4 font-geist text-gray-700">
      {/* SECTION: AI Distribution Intelligence */}
      <div className="bg-gradient-to-br from-orange-50/70 to-purple-50/50 rounded-2xl border border-[#FF5B04]/10 p-4 space-y-3 shadow-sm">
        <p className="text-[10px] font-jetbrains-mono text-[#FF5B04] uppercase tracking-widest font-bold">
          🤖 AI Distribution Intelligence
        </p>

        {/* Channel Fit Matrix */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            Channel Recommendations
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(PLATFORM_LABELS).map((platform) => {
              const isRecommended = getPostTypeConfig(postType)?.distributionChannels.includes(platform) || false;
              return (
                <span
                  key={platform}
                  className={`text-[9px] font-bold font-jetbrains-mono uppercase px-2 py-0.5 rounded-full border ${
                    isRecommended
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-black/[0.02] text-gray-400 border-black/5"
                  }`}
                  title={isRecommended ? "Ideal fit for this post type!" : "Not recommended as primary channel"}
                >
                  {isRecommended ? "✅" : "❌"} {PLATFORM_LABELS[platform] || platform}
                </span>
              );
            })}
          </div>
        </div>

        {/* Advisor Guidance Text */}
        <div className="text-xs leading-relaxed font-geist text-gray-600 bg-white/60 rounded-xl p-3 border border-black/[0.02] space-y-1">
          <span className="font-bold text-gray-800 text-[10px] uppercase tracking-wider block">
            AI Advisor Guidance:
          </span>
          <p>
            {contentGoal === "traffic" && "Drive organic traffic by targeting high-intent long-tail keywords. Share first on your SEO optimized WordPress or Ghost blog. 📈"}
            {contentGoal === "authority" && "Establish thought leadership with detailed framework citations. Great fit for publishing directly to LinkedIn and Medium! 🏛️"}
            {contentGoal === "conversion" && "Structure the post around solving problems with benefit-driven CTAs. Embed lead capture forms in your primary blog post. 💰"}
            {contentGoal === "engagement" && "Create high visual curiosity with a strong opening hook. Ideal for Twitter threads or LinkedIn slide carousels! 🔥"}
            {contentGoal === "lead-generation" && "Offer actionable checklists or templates. Gate the deep-dive portion with a newsletter subscription form. 🧲"}
            {contentGoal === "retention" && "Provide highly practical step-by-step instructions. Ideal for internal newsletters and education portals. 🤝"}
          </p>
          <p className="text-[9px] font-semibold text-[#FF5B04] mt-1.5 font-jetbrains-mono italic">
            Suggested Timing: Tuesday & Thursday, 9:00 AM – 11:30 AM (Peak Engagement window)
          </p>
        </div>

        {/* Content Repurposing Shortcuts */}
        <div className="pt-1.5 border-t border-black/5 space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            Repurposing Actions
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="text-[10px] font-semibold text-gray-600 hover:text-gray-900 bg-white border border-black/5 hover:border-black/10 rounded-xl py-2 px-2.5 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
              type="button"
              onClick={onTriggerCopilotAI}
            >
              <span>🔗</span> LinkedIn Promo Post
            </button>
            <button
              className="text-[10px] font-semibold text-gray-600 hover:text-gray-900 bg-white border border-black/5 hover:border-black/10 rounded-xl py-2 px-2.5 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
              type="button"
              onClick={onTriggerCopilotAI}
            >
              <span>🐦</span> Twitter Thread
            </button>
          </div>
        </div>
      </div>

      {/* SECTION: Post-Publish Actions */}
      {distributionRecords.some((r) => r.status === "success") && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-2">
          <p className="text-[10px] font-jetbrains-mono text-green-700 uppercase tracking-widest font-bold flex items-center gap-1.5">
            🎉 Successfully Distributed! What's next?
          </p>
          <p className="text-xs text-green-600 leading-relaxed font-geist">
            Your post is live! Amplify its reach immediately:
          </p>
          <div className="flex gap-2 pt-1">
            <button
              className="text-[9px] font-bold uppercase tracking-wider bg-green-600 text-white hover:bg-green-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              onClick={onTriggerCopilotAI}
            >
              Generate Social Thread
            </button>
            <button
              className="text-[9px] font-bold uppercase tracking-wider bg-white text-green-700 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              onClick={() => alert("Setting up newsletter draft...")}
            >
              Create Newsletter Digest
            </button>
          </div>
        </div>
      )}

      {/* SECTION: Active Distribution Chain */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest">
            Operational Chain
          </p>
          <span className="text-[9px] font-extrabold font-jetbrains-mono uppercase bg-orange-50 text-[#FF5B04] px-2.5 py-0.5 rounded-full border border-orange-100 animate-pulse">
            ✨ {contentGoal === "traffic" ? "SEO Growth Chain" :
                contentGoal === "authority" ? "Founder Authority Chain" :
                contentGoal === "conversion" ? "Product Launch Chain" :
                contentGoal === "engagement" ? "Community Expansion Chain" :
                contentGoal === "lead-generation" ? "Newsletter Growth Chain" :
                "Customer Education Chain"}
          </span>
        </div>

        {/* Dynamic Vertical Timeline */}
        <div className="relative pl-6 space-y-5 border-l-2 border-orange-500/20 ml-2.5">
          {/* Step 1: Local / Website Publish */}
          <div className="relative">
            <span className={`absolute -left-[22px] top-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center text-[7px] font-bold ${
              blogPublished ? "bg-green-500 border-green-500 text-white" : "bg-white border-orange-500 text-orange-500"
            }`}>
              {blogPublished ? "✓" : "1"}
            </span>
            <div>
              <p className="text-xs font-bold text-gray-800">
                1. Primary Hub Publish
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {blogPublished ? "Published live on primary site" : "Draft ready. Click 'Publish' at top right to launch first."}
              </p>
            </div>
          </div>

          {/* Step 2: Goal-Specific Social Post */}
          <div className="relative">
            <span className="absolute -left-[22px] top-0.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center text-[7px] font-bold">
              2
            </span>
            <div className="space-y-1.5">
              <div>
                <p className="text-xs font-bold text-gray-800">
                  {contentGoal === "traffic" ? "2. SEO Meta Package" :
                   contentGoal === "authority" ? "2. Founder LinkedIn Post" :
                   contentGoal === "conversion" ? "2. LinkedIn Product Announcement" :
                   "2. Engagement Post Variant"}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Repurpose content into a platform-native social thread optimized for your goal.
                </p>
              </div>
              <button
                className="text-[9px] font-bold uppercase tracking-wider bg-black/5 text-gray-700 hover:bg-black/10 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                type="button"
                onClick={onTriggerCopilotAI}
              >
                Generate Variant
              </button>
            </div>
          </div>

          {/* Step 3: Multi-format Repurposing */}
          <div className="relative">
            <span className="absolute -left-[22px] top-0.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center text-[7px] font-bold">
              3
            </span>
            <div className="space-y-1.5">
              <div>
                <p className="text-xs font-bold text-gray-800">
                  {contentGoal === "traffic" ? "3. Twitter Thread Generation" :
                   contentGoal === "authority" ? "3. Extract Social Quote Snippets" :
                   contentGoal === "conversion" ? "3. Email Broadcast Version" :
                   "3. Summary Version"}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Extract actionable takeaways to amplify narrative virality on search and social feeds.
                </p>
              </div>
              <button
                className="text-[9px] font-bold uppercase tracking-wider bg-black/5 text-gray-700 hover:bg-black/10 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                type="button"
                onClick={onTriggerCopilotAI}
              >
                Trigger Repurpose
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Pre-flight Checklist */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
        <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-3">
          Pre-flight Checklist
        </p>
        <div className="space-y-2">
          {preflight.map((check) => (
            <div
              key={check.id}
              className="flex items-start justify-between gap-2 text-xs"
            >
              <div className="flex items-start gap-2 min-w-0">
                {check.passed ? (
                  <span className="text-green-500 font-bold flex-shrink-0">
                    ✓
                  </span>
                ) : check.severity === "error" ? (
                  <span className="text-red-500 font-bold flex-shrink-0">
                    ✗
                  </span>
                ) : (
                  <span className="text-amber-500 font-bold flex-shrink-0">
                    ⚠
                  </span>
                )}
                <span
                  className={`truncate ${check.passed ? "text-gray-500" : "text-gray-900 font-medium"}`}
                >
                  {check.label}
                </span>
              </div>
              {!check.passed && check.action && (
                <button
                  className="text-[10px] font-semibold text-[#FF5B04] hover:underline flex-shrink-0"
                  type="button"
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
          <p className="text-xs text-gray-400 py-2">
            Loading connected platforms...
          </p>
        ) : integrations.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-xs text-gray-400">No channels set up yet.</p>
            <Link
              className="text-[10px] font-semibold text-[#FF5B04] hover:underline mt-2 inline-block"
              href={integrationsUrl}
            >
              Configure Integrations
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedIntegrations.map((platform) => {
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
                      className="text-[9px] font-semibold text-[#FF5B04] hover:underline"
                      href={integrationsUrl}
                    >
                      Connect
                    </Link>
                  ) : (
                    <button
                      className={`w-8 h-4 rounded-full p-0.5 transition-colors relative flex items-center ${
                        isSelected ? "bg-[#FF5B04]" : "bg-gray-200"
                      }`}
                      type="button"
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
              <div
                key={rec.platform}
                className="flex items-center justify-between text-xs py-1 border-b border-black/[0.03] last:border-0 last:pb-0"
              >
                <span className="font-semibold text-gray-800 uppercase text-[10px] font-jetbrains-mono">
                  {rec.platform}
                </span>

                <div className="flex items-center gap-2 min-w-0 max-w-[65%]">
                  {rec.status === "success" ? (
                    <>
                      <a
                        className="text-[#FF5B04] hover:underline truncate inline-block text-[11px]"
                        href={rec.url || "#"}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        View External Link ↗
                      </a>
                      <button
                        className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center p-0.5"
                        disabled={verifyingPlatform !== null}
                        title="Verify / Sync external link status"
                        type="button"
                        onClick={() => handleVerify(rec.platform)}
                      >
                        {verifyingPlatform === rec.platform ? (
                          <svg
                            className="animate-spin h-3 w-3 text-[#FF5B04]"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              fill="currentColor"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors animate-fade-in"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    </>
                  ) : (
                    <span
                      className="text-red-500 font-medium text-[10px] truncate"
                      title={rec.errorMessage || "Distribution failed"}
                    >
                      ✗ Failed
                    </span>
                  )}
                  <button
                    className="text-[10px] text-gray-400 hover:text-[#FF5B04] transition-colors flex items-center justify-center p-0.5"
                    disabled={verifyingPlatform !== null}
                    title="Reset distribution status to Re-Publish"
                    type="button"
                    onClick={() => handleReset(rec.platform)}
                  >
                    <svg
                      className="w-3.5 h-3.5 text-gray-400 hover:text-[#FF5B04] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
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
            ⚠ Please publish the blog locally (via the "Publish" button at the
            top right) to enable multi-channel distribution.
          </p>
        )}
        {distributionError && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-100 p-2.5 rounded-xl mb-3 leading-relaxed">
            {distributionError}
          </p>
        )}

        <button
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white h-10 px-6 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={
            distributing ||
            !blogPublished ||
            selectedPlatforms.length === 0 ||
            hasPreflightErrors
          }
          style={{ background: "#FF5B04" }}
          type="button"
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
