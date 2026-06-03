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
  DISTRIBUTION_CHAINS,
  getDistributionChain,
  DistributionChain,
} from "@/lib/pirateCOS/postTypeConfig";
import CosIcon from "./CosIcon";

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
  onTriggerCopilotAI: (preset?: string, initialPrompt?: string) => void;
  postType: string;
  contentGoal: ContentGoal;
  blogTitle: string;
  socialDestination?: "linkedin" | "x";
  blogRepurposedOutputs?: Record<string, string>;
  onUpdateRepurposedOutputs?: (outputs: Record<string, string>) => void;
  onUpdateExcerpt?: (excerpt: string) => void;
  onUpdateTags?: (tags: string[]) => void;
  onUpdateSeo?: (seo: any) => void;
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
  blogTitle,
  socialDestination = "linkedin",
  blogRepurposedOutputs = {},
  onUpdateRepurposedOutputs,
  onUpdateExcerpt,
  onUpdateTags,
  onUpdateSeo,
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
  const [activeSocialDest, setActiveSocialDest] = useState<"linkedin" | "x">("linkedin");

  // Phase 4C States
  const [selectedRepurposeFormats, setSelectedRepurposeFormats] = useState<string[]>([]);
  const [autofixing, setAutofixing] = useState<Record<string, boolean>>({});
  const [repurposingProgress, setRepurposingProgress] = useState<{ active: boolean; currentFormat: string; percent: number } | null>(null);
  const [activeChain, setActiveChain] = useState<string | null>(null);
  const [showRepurposePreview, setShowRepurposePreview] = useState(false);
  const [platformErrors, setPlatformErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (socialDestination) {
      setActiveSocialDest(socialDestination);
    }
  }, [socialDestination]);

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
        const list = data.integrations || [];
        setIntegrations(list);
        
        // Auto-select linkedin by default if connected and active
        const linkedinActive = list.find(
          (i: Integration) => i.platform === "linkedin" && i.isConnected && i.isActive
        );
        if (linkedinActive) {
          setSelectedPlatforms((prev) =>
            prev.includes("linkedin") ? prev : [...prev, "linkedin"]
          );
        }
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
    const checks = runPreflight(
      {
        content: blogContent,
        excerpt: blogExcerpt,
        tags: blogTags,
        featuredImage: blogSeo?.ogImage || "", // Map from ogImage or fallback
        seo: blogSeo,
      },
      postType,
      activeSocialDest,
    );

    setPreflight(checks);
  }, [blogContent, blogExcerpt, blogTags, blogSeo, postType, activeSocialDest]);

  const handleAutofix = async (checkId: string) => {
    setAutofixing((prev) => ({ ...prev, [checkId]: true }));
    setDistributionError(null);

    try {
      const cleanContent = blogContent.replace(/<[^>]*>/g, " ").trim();
      const plainTextContent = cleanContent.slice(0, 15000);

      let actionApi = "";
      if (checkId === "excerpt") actionApi = "excerpt";
      else if (checkId === "tags") actionApi = "tags";
      else if (checkId === "focusKeyword") actionApi = "focusKeyword";
      else if (checkId === "metaTitle") actionApi = "metaTitle";
      else if (checkId === "metaDescription") actionApi = "metaDescription";

      if (!actionApi) throw new Error("Invalid autofix action");

      const response = await fetch("/api/pirateCOS/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionApi,
          title: blogTitle,
          content: plainTextContent,
          postType,
          contentGoal,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "AI autofix failed");
      }

      const generatedData = result.data;

      // Update local and parent states
      let payloadToSave: any = {};

      if (checkId === "excerpt") {
        const value = typeof generatedData === "string" ? generatedData.trim() : "";
        onUpdateExcerpt?.(value);
        payloadToSave = { excerpt: value };
      } else if (checkId === "tags") {
        const value = Array.isArray(generatedData) ? generatedData : [];
        onUpdateTags?.(value);
        payloadToSave = { tags: value };
      } else if (checkId === "focusKeyword") {
        const value = typeof generatedData === "string" ? generatedData.trim() : "";
        const nextSeo = { ...blogSeo, focusKeyword: value };
        onUpdateSeo?.(nextSeo);
        payloadToSave = { seo: nextSeo };
      } else if (checkId === "metaTitle") {
        const value = typeof generatedData === "string" ? generatedData.trim() : "";
        const nextSeo = { ...blogSeo, metaTitle: value };
        onUpdateSeo?.(nextSeo);
        payloadToSave = { seo: nextSeo };
      } else if (checkId === "metaDescription") {
        const value = typeof generatedData === "string" ? generatedData.trim() : "";
        const nextSeo = { ...blogSeo, metaDescription: value };
        onUpdateSeo?.(nextSeo);
        payloadToSave = { seo: nextSeo };
      }

      // Save to database instantly if post already has a saved ID
      if (blogId) {
        const putRes = await fetch(`/api/pirateCOS/posts/${blogId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadToSave),
        });
        if (!putRes.ok) {
          const putErr = await putRes.json();
          throw new Error(putErr.error || "Failed to save autofix to database");
        }
      }
    } catch (err: any) {
      setDistributionError(err.message || "Failed to run autofix");
    } finally {
      setAutofixing((prev) => ({ ...prev, [checkId]: false }));
    }
  };

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
    if (action === "AI Hook") {
      onTriggerCopilotAI(
        "linkedin-post",
        "Generate 3 scroll-stopping opening hooks for this post."
      );
    }
    if (action === "Hashtag Ideas") {
      onTriggerCopilotAI(
        "linkedin-post",
        "Generate high-engagement hashtags based on this post content."
      );
    }
  };

  const handleDistribute = async () => {
    if (selectedPlatforms.length === 0 && selectedRepurposeFormats.length === 0) return;
    setDistributing(true);
    setDistributionError(null);
    setPlatformErrors({});

    try {
      // 1. Ensure blog post is saved to the local database
      const savedId = await onEnsureSaved();

      // 2. Trigger distribution publish request if platforms are selected
      if (selectedPlatforms.length > 0) {
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

        if (data.results) {
          // Merge fresh results into parent state
          const updatedRecords = [...distributionRecords];
          const newPlatformErrors: Record<string, string> = {};

          data.results.forEach((newRec: DistributionRecord) => {
            if (newRec.status === "failed") {
              newPlatformErrors[newRec.platform] = newRec.errorMessage || "Unknown distribution error";
            }

            const idx = updatedRecords.findIndex(
              (r) => r.platform === newRec.platform,
            );

            if (idx > -1) {
              updatedRecords[idx] = newRec;
            } else {
              updatedRecords.push(newRec);
            }
          });

          setPlatformErrors(newPlatformErrors);
          onUpdateRecords(updatedRecords);
          // Clear selected platforms on success
          setSelectedPlatforms([]);
        }
      }

      // 3. Sequential Repurposing of checked formats
      if (selectedRepurposeFormats.length > 0 && savedId) {
        const nextRepurposedOutputs = { ...blogRepurposedOutputs };
        const REPURPOSE_FORMAT_MAP: Record<string, string> = {
          linkedin_promo: "linkedin-thread",
          twitter_thread: "twitter-thread",
          newsletter_summary: "newsletter",
          quote_snippets: "cta-blocks",
        };

        for (let i = 0; i < selectedRepurposeFormats.length; i++) {
          const formatId = selectedRepurposeFormats[i];
          const apiFormat = REPURPOSE_FORMAT_MAP[formatId] || formatId;

          setRepurposingProgress({
            active: true,
            currentFormat: formatId,
            percent: Math.round((i / selectedRepurposeFormats.length) * 100),
          });

          try {
            const repRes = await fetch(`/api/pirateCOS/posts/${savedId}/repurpose`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ format: apiFormat }),
            });
            const repData = await repRes.json();
            if (repData.success && repData.data) {
              nextRepurposedOutputs[formatId] = repData.data;
            } else {
              console.error(`Failed to repurpose format ${formatId}:`, repData.error);
            }
          } catch (e) {
            console.error(`Failed to repurpose format ${formatId}`, e);
          }
        }

        // Save gathered outputs to database
        try {
          const saveRes = await fetch(`/api/pirateCOS/posts/${savedId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ repurposedOutputs: nextRepurposedOutputs }),
          });
          if (saveRes.ok) {
            onUpdateRepurposedOutputs?.(nextRepurposedOutputs);
          }
        } catch (e) {
          console.error("Failed to save repurposed outputs to database", e);
        }

        setRepurposingProgress(null);
        setSelectedRepurposeFormats([]);
        setShowRepurposePreview(true); // Open the preview drawer automatically
      }
    } catch (err: any) {
      setDistributionError(err.message || "Failed to publish distribution");
    } finally {
      setDistributing(false);
      setRepurposingProgress(null);
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
      {/* SECTION: One-Click Distribution Chains */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl border border-white/10 p-4 space-y-3 shadow-md">
        <div>
          <p className="text-[10px] font-jetbrains-mono text-[#FF5B04] uppercase tracking-widest font-bold flex items-center gap-1.5">
            <CosIcon name="bolt" size={12} className="text-orange-500 fill-orange-500" /> One-Click Distribution Chains
          </p>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">
            Activate a preset chain matching your distribution strategy. This automatically configures channels and repurposing templates.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 pt-1">
          {DISTRIBUTION_CHAINS.map((chain) => {
            const isActive = activeChain === chain.value;
            return (
              <button
                key={chain.value}
                type="button"
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 group ${
                  isActive
                    ? "border-[#FF5B04] bg-[#FF5B04]/10 ring-1 ring-[#FF5B04]/30"
                    : "border-white/5 bg-white/5 hover:bg-white/10"
                }`}
                onClick={() => {
                  setActiveChain(chain.value);
                  setSelectedPlatforms(chain.defaultChannels);
                  setSelectedRepurposeFormats(chain.recommendedRepurposing);
                }}
              >
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-lg flex-shrink-0">
                  <CosIcon name={chain.icon} size={18} className="text-gray-300 group-hover:text-[#FF5B04]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-bold ${isActive ? "text-[#FF5B04]" : "text-gray-100"}`}>
                      {chain.label}
                    </p>
                    {isActive && (
                      <span className="text-[8px] font-extrabold uppercase tracking-wider font-jetbrains-mono bg-[#FF5B04] text-white px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">
                    {chain.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {chain.defaultChannels.map((c) => (
                      <span key={c} className="text-[9px] font-semibold bg-white/5 text-gray-300 px-1.5 py-0.5 rounded border border-white/5 flex items-center gap-1">
                        <CosIcon name="megaphone" size={10} className="text-gray-400" /> {PLATFORM_LABELS[c] || c}
                      </span>
                    ))}
                    {chain.recommendedRepurposing.map((r) => (
                      <span key={r} className="text-[9px] font-semibold bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/20 flex items-center gap-1">
                        <CosIcon name="refresh" size={10} className="text-purple-400 animate-spin-slow" /> {r.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION: AI Distribution Intelligence */}
      <div className="bg-gradient-to-br from-orange-50/70 to-purple-50/50 rounded-2xl border border-[#FF5B04]/10 p-4 space-y-3 shadow-sm">
        <p className="text-[10px] font-jetbrains-mono text-[#FF5B04] uppercase tracking-widest font-bold flex items-center gap-1.5">
          <CosIcon name="bot" size={12} className="text-orange-500" /> AI Distribution Intelligence
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
                  <span className="flex items-center gap-1">
                    <CosIcon name={isRecommended ? "check" : "cross"} size={10} className={isRecommended ? "text-green-500" : "text-gray-400"} />
                    {PLATFORM_LABELS[platform] || platform}
                  </span>
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
            {contentGoal === "traffic" && "Drive organic traffic by targeting high-intent long-tail keywords. Share first on your SEO optimized WordPress or Ghost blog. "}
            {contentGoal === "authority" && "Establish thought leadership with detailed framework citations. Great fit for publishing directly to LinkedIn and Medium! "}
            {contentGoal === "conversion" && "Structure the post around solving problems with benefit-driven CTAs. Embed lead capture forms in your primary blog post. "}
            {contentGoal === "engagement" && "Create high visual curiosity with a strong opening hook. Ideal for Twitter threads or LinkedIn slide carousels! "}
            {contentGoal === "lead-generation" && "Offer actionable checklists or templates. Gate the deep-dive portion with a newsletter subscription form. "}
            {contentGoal === "retention" && "Provide highly practical step-by-step instructions. Ideal for internal newsletters and education portals. "}
          </p>
          <p className="text-[9px] font-semibold text-[#FF5B04] mt-1.5 font-jetbrains-mono italic">
            Suggested Timing: Tuesday & Thursday, 9:00 AM – 11:30 AM (Peak Engagement window)
          </p>
        </div>
      </div>

      {/* SECTION: Post-Publish Actions */}
      {postType !== "social-post" && distributionRecords.some((r) => r.status === "success") && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-2">
          <p className="text-[10px] font-jetbrains-mono text-green-700 uppercase tracking-widest font-bold flex items-center gap-1.5">
            <CosIcon name="celebrate" size={12} className="text-green-600" /> Successfully Distributed! What's next?
          </p>
          <p className="text-xs text-green-600 leading-relaxed font-geist">
            Your post is live! Amplify its reach immediately:
          </p>
          <div className="flex gap-2 pt-1">
            <button
              className="text-[9px] font-bold uppercase tracking-wider bg-green-600 text-white hover:bg-green-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              onClick={() => onTriggerCopilotAI()}
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

      {/* SECTION: Pre-flight Checklist */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
        <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-3">
          Pre-flight Checklist
        </p>
        <div className="space-y-2">
          {preflight.map((check) => (
            <div
              key={check.id}
              className="flex items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
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
              {!check.passed && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  {["excerpt", "tags", "focusKeyword", "metaTitle", "metaDescription"].includes(check.id) && (
                    <button
                      className="text-[10px] font-bold text-[#FF5B04] hover:text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer"
                      type="button"
                      disabled={autofixing[check.id]}
                      onClick={() => handleAutofix(check.id)}
                    >
                      {autofixing[check.id] ? (
                        <>
                          <svg className="animate-spin h-2.5 w-2.5 text-[#FF5B04]" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
                          </svg>
                          Autofixing...
                        </>
                      ) : (
                        <span className="flex items-center gap-1">
                          <CosIcon name="bolt" size={10} className="fill-current text-[#FF5B04]" /> Autofix
                        </span>
                      )}
                    </button>
                  )}
                  {check.action && (
                    <button
                      className="text-[10px] font-semibold text-gray-500 hover:text-gray-900 hover:underline"
                      type="button"
                      onClick={() => handlePreflightAction(check.action)}
                    >
                      {check.action}
                    </button>
                  )}
                </div>
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

      {/* SECTION: Repurpose Output Checkboxes */}
      {postType !== "social-post" && (
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
          <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-3">
            Repurpose Content
          </p>
          <div className="space-y-2">
            {[
              { id: "linkedin_promo", label: "LinkedIn Promo (Carousel Slide Copy)", icon: "link" },
              { id: "twitter_thread", label: "X / Twitter Thread", icon: "social-post" },
              { id: "newsletter_summary", label: "Newsletter summary / Draft", icon: "envelope" },
              { id: "quote_snippets", label: "CTA / Quote snippets", icon: "community-insight" },
            ].map((format) => {
              const isSelected = selectedRepurposeFormats.includes(format.id);
              return (
                <label
                  key={format.id}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#FF5B04]/30 bg-orange-50/20"
                      : "border-black/5 bg-white hover:border-black/10"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="accent-[#FF5B04] h-4 w-4 rounded border-gray-300 text-[#FF5B04] focus:ring-[#FF5B04]/30"
                    checked={isSelected}
                    onChange={() => {
                      setSelectedRepurposeFormats((prev) =>
                        prev.includes(format.id)
                          ? prev.filter((x) => x !== format.id)
                          : [...prev, format.id]
                      );
                    }}
                  />
                  <span className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                    <CosIcon name={format.icon} size={14} className="text-gray-500" /> {format.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION: Platform Publishing Errors & Diagnostics */}
      {Object.keys(platformErrors).length > 0 && (
        <div className="space-y-2">
          {Object.entries(platformErrors).map(([platform, errMsg]) => (
            <div
              key={platform}
              className="bg-red-50/50 border border-red-200 rounded-2xl p-4 space-y-3 shadow-sm animate-in slide-in-from-top-2"
            >
              <div className="flex items-start gap-2.5">
                <CosIcon name="warning" size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-red-800 uppercase tracking-wide">
                    {PLATFORM_LABELS[platform] || platform} Publishing Failure
                  </h4>
                  <p className="text-[11px] text-red-700 leading-normal mt-1 bg-red-100/30 p-2.5 rounded-lg border border-red-200/40">
                    {errMsg}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-1 border-t border-red-100">
                <Link
                  className="text-[10px] font-bold text-[#FF5B04] hover:text-orange-700 bg-white border border-[#FF5B04]/20 hover:border-[#FF5B04]/40 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                  href={integrationsUrl}
                >
                  <CosIcon name="link" size={10} className="mr-1" /> Reconnect
                </Link>
                <button
                  className="text-[10px] font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                  type="button"
                  onClick={() => {
                    // Retry publishing specifically for this platform
                    setPlatformErrors(prev => {
                      const copy = { ...prev };
                      delete copy[platform];
                      return copy;
                    });
                    setSelectedPlatforms([platform]);
                    setTimeout(() => {
                      handleDistribute();
                    }, 0);
                  }}
                >
                  <CosIcon name="refresh" size={10} className="mr-1" /> Retry Publishing
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION: Repurposing Progress Loader */}
      {repurposingProgress?.active && (
        <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 rounded-2xl p-4 space-y-3 animate-pulse shadow-sm">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-orange-600 flex items-center gap-1.5">
              <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
              </svg>
              AI Repurposing in Progress...
            </span>
            <span className="font-jetbrains-mono font-bold text-purple-600">
              {repurposingProgress.percent}%
            </span>
          </div>
          <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-purple-500 transition-all duration-500"
              style={{ width: `${repurposingProgress.percent}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 font-medium">
            Generating format: <span className="font-mono text-gray-700 capitalize">{repurposingProgress.currentFormat.replace("_", " ")}</span>
          </p>
        </div>
      )}

      {/* SECTION: Generated Repurposed Previews */}
      {postType !== "social-post" && Object.keys(blogRepurposedOutputs).length > 0 && (
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <CosIcon name="sparkles" size={12} className="text-[#FF5B04]" /> Repurposed Promotional Assets
            </p>
            <button
              className="text-[10px] font-bold text-[#FF5B04] hover:underline"
              type="button"
              onClick={() => setShowRepurposePreview(!showRepurposePreview)}
            >
              {showRepurposePreview ? "Hide Previews" : "Show Previews"}
            </button>
          </div>
          
          {showRepurposePreview && (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
              {Object.entries(blogRepurposedOutputs).map(([formatId, text]) => (
                <div key={formatId} className="bg-gray-50 border border-black/5 rounded-xl p-3 space-y-2 animate-in fade-in zoom-in duration-200">
                  <div className="flex justify-between items-center border-b border-black/[0.04] pb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 font-jetbrains-mono">
                      {formatId.replace("_", " ")}
                    </span>
                    <button
                      className="text-[9px] font-bold uppercase tracking-wider text-gray-400 hover:text-gray-600 transition-colors"
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(text);
                        alert("Copied to clipboard!");
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="text-[11px] text-gray-600 font-geist leading-relaxed whitespace-pre-wrap select-all">
                    {text}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
                            className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors"
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
            (selectedPlatforms.length === 0 && selectedRepurposeFormats.length === 0) ||
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
              {repurposingProgress?.active ? "Repurposing..." : "Distributing…"}
            </>
          ) : (
            "Distribute Now"
          )}
        </button>
      </div>
    </div>
  );
}
