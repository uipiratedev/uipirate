"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import {
  ContentGoal,
  DISTRIBUTION_CHAINS,
  DistributionChain,
} from "@/lib/pirateCOS/postTypeConfig";
import {
  runPreflight,
  PreflightCheck,
} from "@/lib/pirateCOS/distribution/transform/content-preflight";
import {
  DistributionRecord,
  Integration,
  PLATFORM_LABELS,
  getPresetsBadge,
  getPreflightBadge,
  getChannelsBadge,
  getSpinoffsBadge,
  QuickPresetsContent,
  ChannelFitContent,
  PreflightContent,
  TargetChannelsContent,
  SpinoffsContent,
  RepurposedAssetsContent,
  PlatformErrors,
  RepurposingProgress,
  DistributionHistory,
  PostPublishActions,
  DistributeCTA,
} from "./DistributePanelSubComponents";

// ─── Props ────────────────────────────────────────────────────────────────────
export interface DistributePanelProps {
  postId: string | null;
  postPublished: boolean;
  postContent: string;
  postExcerpt: string;
  postTags: string[];
  postSeo: any;
  distributionRecords: DistributionRecord[];
  onEnsureSaved: () => Promise<string>;
  onUpdateRecords?: (records: DistributionRecord[]) => void;
  onNavigateToSEO: () => void;
  onTriggerExcerptAI?: () => void;
  onTriggerTagsAI?: () => void;
  onTriggerCopilotAI: (preset?: string, initialPrompt?: string) => void;
  postType: string;
  contentGoal: ContentGoal;
  postTitle: string;
  socialDestination?: "linkedin" | "x";
  postRepurposedOutputs?: Record<string, string>;
  onUpdateRepurposedOutputs?: (outputs: Record<string, string>) => void;
  onUpdateExcerpt?: (excerpt: string) => void;
  onUpdateTags?: (tags: string[]) => void;
  onUpdateSeo?: (seo: any) => void;
  onNavigateToTransform?: (formatId: string) => void;
}

// ─── AccordionTitle ───────────────────────────────────────────────────────────
function AccordionTitle({ label, badge, badgeColor }: { label: string; badge?: string; badgeColor?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-jetbrains-mono text-gray-700 uppercase tracking-widest font-bold">{label}</span>
      {badge && <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-jetbrains-mono ${badgeColor}`}>{badge}</span>}
    </div>
  );
}

// ─── DistributePanel ──────────────────────────────────────────────────────────
export function DistributePanel({
  postId, postPublished, postContent, postExcerpt, postTags, postSeo,
  distributionRecords = [], onEnsureSaved, onUpdateRecords, onNavigateToSEO,
  onTriggerExcerptAI, onTriggerTagsAI, onTriggerCopilotAI, postType, contentGoal,
  postTitle, socialDestination = "linkedin", postRepurposedOutputs = {},
  onUpdateRepurposedOutputs, onUpdateExcerpt, onUpdateTags, onUpdateSeo,
  onNavigateToTransform,
}: DistributePanelProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [loadingIntegrations, setLoadingIntegrations] = useState(true);
  const [distributing, setDistributing] = useState(false);
  const [verifyingPlatform, setVerifyingPlatform] = useState<string | null>(null);
  const [distributionError, setDistributionError] = useState<string | null>(null);
  const [preflight, setPreflight] = useState<PreflightCheck[]>([]);
  const [activeSocialDest, setActiveSocialDest] = useState<"linkedin" | "x">("linkedin");
  const [selectedRepurposeFormats, setSelectedRepurposeFormats] = useState<string[]>([]);
  const [autofixing, setAutofixing] = useState<Record<string, boolean>>({});
  const [repurposingProgress, setRepurposingProgress] = useState<{ active: boolean; currentFormat: string; percent: number } | null>(null);
  const [activeChain, setActiveChain] = useState<string | null>(null);
  const [showRepurposePreview, setShowRepurposePreview] = useState(false);
  const [platformErrors, setPlatformErrors] = useState<Record<string, string>>({});
  const [copiedFormatId, setCopiedFormatId] = useState<string | null>(null);

  const isSubdomain = typeof window !== "undefined" && (window.location.hostname.startsWith("cos.") || window.location.hostname === "cos.uipirate.com");
  const integrationsUrl = isSubdomain ? "/settings/integrations" : "/pirateCOS/settings/integrations";

  useEffect(() => { if (socialDestination) setActiveSocialDest(socialDestination); }, [socialDestination]);

  const fetchIntegrations = useCallback(async () => {
    try {
      const res = await fetch("/api/pirateCOS/integrations");
      const data = await res.json();
      if (data.success) {
        const list = data.integrations || [];
        setIntegrations(list);
        const linkedinActive = list.find((i: Integration) => i.platform === "linkedin" && i.isConnected && i.isActive);
        if (linkedinActive) setSelectedPlatforms((prev) => prev.includes("linkedin") ? prev : [...prev, "linkedin"]);
      }
    } catch (err) { console.error("Failed to load integrations", err); }
    finally { setLoadingIntegrations(false); }
  }, []);

  useEffect(() => { fetchIntegrations(); }, [fetchIntegrations]);

  useEffect(() => {
    const checks = runPreflight({ content: postContent, excerpt: postExcerpt, tags: postTags, featuredImage: postSeo?.ogImage || "", seo: postSeo }, postType, activeSocialDest);
    setPreflight(checks);
  }, [postContent, postExcerpt, postTags, postSeo, postType, activeSocialDest]);

  const hasPreflightErrors = useMemo(() => preflight.some((c) => !c.passed && c.severity === "error"), [preflight]);

  const handleAutofix = async (checkId: string) => {
    setAutofixing((prev) => ({ ...prev, [checkId]: true }));
    setDistributionError(null);
    try {
      const cleanContent = postContent.replace(/<[^>]*>/g, " ").trim().slice(0, 15000);
      const actionMap: Record<string, string> = { excerpt: "excerpt", tags: "tags", focusKeyword: "focusKeyword", metaTitle: "metaTitle", metaDescription: "metaDescription" };
      const actionApi = actionMap[checkId];
      if (!actionApi) throw new Error("Invalid autofix action");
      const response = await fetch("/api/pirateCOS/ai/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: actionApi, title: postTitle, content: cleanContent, postType, contentGoal }) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "AI autofix failed");
      const data = result.data;
      let payloadToSave: any = {};
      if (checkId === "excerpt") { const v = typeof data === "string" ? data.trim() : ""; onUpdateExcerpt?.(v); payloadToSave = { excerpt: v }; }
      else if (checkId === "tags") { const v = Array.isArray(data) ? data : []; onUpdateTags?.(v); payloadToSave = { tags: v }; }
      else if (checkId === "focusKeyword") { const v = typeof data === "string" ? data.trim() : ""; const next = { ...postSeo, focusKeyword: v }; onUpdateSeo?.(next); payloadToSave = { seo: next }; }
      else if (checkId === "metaTitle") { const v = typeof data === "string" ? data.trim() : ""; const next = { ...postSeo, metaTitle: v }; onUpdateSeo?.(next); payloadToSave = { seo: next }; }
      else if (checkId === "metaDescription") { const v = typeof data === "string" ? data.trim() : ""; const next = { ...postSeo, metaDescription: v }; onUpdateSeo?.(next); payloadToSave = { seo: next }; }
      if (postId) {
        const putRes = await fetch(`/api/pirateCOS/posts/${postId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payloadToSave) });
        if (!putRes.ok) { const err = await putRes.json(); throw new Error(err.error || "Failed to save autofix"); }
      }
    } catch (err: any) { setDistributionError(err.message || "Failed to run autofix"); }
    finally { setAutofixing((prev) => ({ ...prev, [checkId]: false })); }
  };

  const handlePreflightAction = (action?: string) => {
    if (!action) return;
    if (action === "Open SEO Editor") onNavigateToSEO();
    if (action === "Generate Excerpt") onTriggerExcerptAI?.();
    if (action === "Generate Tags") onTriggerTagsAI?.();
    if (action === "AI Copilot") onTriggerCopilotAI();
    if (action === "AI Hook") onTriggerCopilotAI("linkedin-post", "Generate 3 scroll-stopping opening hooks for this post.");
    if (action === "Hashtag Ideas") onTriggerCopilotAI("linkedin-post", "Generate high-engagement hashtags based on this post content.");
  };

  const handleDistribute = async () => {
    if (selectedPlatforms.length === 0 && selectedRepurposeFormats.length === 0) return;
    setDistributing(true); setDistributionError(null); setPlatformErrors({});
    try {
      const savedId = await onEnsureSaved();
      if (selectedPlatforms.length > 0) {
        const res = await fetch("/api/pirateCOS/distribution/publish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ postId: savedId, platforms: selectedPlatforms }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Distribution publish failed");
        if (data.results) {
          const updated = [...distributionRecords];
          const newErrors: Record<string, string> = {};
          data.results.forEach((r: DistributionRecord) => {
            if (r.status === "failed") newErrors[r.platform] = r.errorMessage || "Unknown error";
            const idx = updated.findIndex((x) => x.platform === r.platform);
            if (idx > -1) updated[idx] = r; else updated.push(r);
          });
          setPlatformErrors(newErrors); onUpdateRecords?.(updated); setSelectedPlatforms([]);
        }
      }
      if (selectedRepurposeFormats.length > 0 && savedId) {
        const nextOutputs = { ...postRepurposedOutputs };
        const FORMAT_MAP: Record<string, string> = { linkedin_promo: "linkedin-thread", twitter_thread: "twitter-thread", newsletter_summary: "newsletter", quote_snippets: "cta-blocks" };
        for (let i = 0; i < selectedRepurposeFormats.length; i++) {
          const fId = selectedRepurposeFormats[i];
          setRepurposingProgress({ active: true, currentFormat: fId, percent: Math.round((i / selectedRepurposeFormats.length) * 100) });
          try {
            const r = await fetch(`/api/pirateCOS/posts/${savedId}/repurpose`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ format: FORMAT_MAP[fId] || fId }) });
            const d = await r.json();
            if (d.success && d.data) nextOutputs[fId] = d.data;
          } catch (e) { console.error(`Failed to repurpose ${fId}`, e); }
        }
        try {
          const s = await fetch(`/api/pirateCOS/posts/${savedId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ repurposedOutputs: nextOutputs }) });
          if (s.ok) onUpdateRepurposedOutputs?.(nextOutputs);
        } catch (e) { console.error("Failed to save repurposed outputs", e); }
        setRepurposingProgress(null); setSelectedRepurposeFormats([]); setShowRepurposePreview(true);
      }
    } catch (err: any) { setDistributionError(err.message || "Failed to publish distribution"); }
    finally { setDistributing(false); setRepurposingProgress(null); }
  };

  const handleVerify = async (platform: string) => {
    if (!postId) return;
    setVerifyingPlatform(platform);
    try {
      const res = await fetch("/api/pirateCOS/distribution/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ postId: postId, platform }) });
      const data = await res.json();
      if (data.success && data.distributionRecords) {
        onUpdateRecords?.(data.distributionRecords);
        alert(data.exists ? `Sync complete: Post verified on ${PLATFORM_LABELS[platform] || platform}!` : `Sync complete: Post was deleted on ${PLATFORM_LABELS[platform] || platform}.`);
      }
    } catch (err) { console.error("Link verification failed", err); }
    finally { setVerifyingPlatform(null); }
  };

  const handleReset = async (platform: string) => {
    if (!postId || !confirm(`Reset distribution for ${PLATFORM_LABELS[platform] || platform}? This will allow re-publishing.`)) return;
    setVerifyingPlatform(platform);
    try {
      const res = await fetch("/api/pirateCOS/distribution/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ postId: postId, platform, action: "reset" }) });
      const data = await res.json();
      if (data.success && data.distributionRecords) { onUpdateRecords?.(data.distributionRecords); alert(`Distribution reset for ${PLATFORM_LABELS[platform] || platform}. You can now re-publish.`); }
    } catch (err) { console.error("Reset failed", err); }
    finally { setVerifyingPlatform(null); }
  };

  // ─── Accordion Items (IIFE) ────────────────────────────────────────────────
  const items = (() => {
    const { badge: psBadge, badgeColor: psColor } = getPresetsBadge(activeChain);
    const { badge: pfBadge, badgeColor: pfColor } = getPreflightBadge(preflight);
    const { badge: chBadge, badgeColor: chColor } = getChannelsBadge(selectedPlatforms);
    const { badge: spBadge, badgeColor: spColor } = getSpinoffsBadge(selectedRepurposeFormats, postRepurposedOutputs);

    const all: React.ReactElement[] = [
      <AccordionItem key="presets" title={<AccordionTitle label="Quick Presets" badge={psBadge} badgeColor={psColor} />}>
        <QuickPresetsContent
          activeChain={activeChain}
          onSelectChain={(chain: DistributionChain) => {
            setActiveChain(chain.value);
            setSelectedPlatforms(chain.defaultChannels);
            setSelectedRepurposeFormats(chain.recommendedRepurposing);
          }}
        />
      </AccordionItem>,

      <AccordionItem key="channelFit" title={<AccordionTitle label="Channel Fit" badge="AI Guided" badgeColor="bg-blue-50 text-blue-600" />}>
        <ChannelFitContent postType={postType} contentGoal={contentGoal} />
      </AccordionItem>,

      <AccordionItem key="preflight" title={<AccordionTitle label="Pre-flight Checklist" badge={pfBadge} badgeColor={pfColor} />}>
        <PreflightContent preflight={preflight} autofixing={autofixing} onAutofix={handleAutofix} onAction={handlePreflightAction} />
      </AccordionItem>,

      <AccordionItem key="channels" title={<AccordionTitle label="Target Channels" badge={chBadge} badgeColor={chColor} />}>
        <TargetChannelsContent
          integrations={integrations}
          selectedPlatforms={selectedPlatforms}
          loadingIntegrations={loadingIntegrations}
          integrationsUrl={integrationsUrl}
          onToggle={(p: string) => setSelectedPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p])}
        />
      </AccordionItem>,
    ];

    if (postType !== "social-post") {
      all.push(
        <AccordionItem key="spinoffs" title={<AccordionTitle label="Create Spin-offs" badge={spBadge} badgeColor={spColor} />}>
          <SpinoffsContent
            repurposedOutputs={postRepurposedOutputs}
            onNavigateToTransform={onNavigateToTransform}
          />
        </AccordionItem>
      );
    }

    return all;
  })();

  return (
    <div className="space-y-3 font-geist text-gray-700">
      <Accordion
        variant="splitted"
        selectionMode="single"
        itemClasses={{
          base: "shadow-sm mb-3",
          title: "text-[10px] font-jetbrains-mono text-gray-700 uppercase tracking-widest font-bold",
          trigger: " py-3 hover:bg-black/[0.02]",
          content: " pb-3",
        }}
      >
        {items}
      </Accordion>

      <PostPublishActions records={distributionRecords} postType={postType} onTriggerCopilotAI={onTriggerCopilotAI} />
      <PlatformErrors
        errors={platformErrors}
        integrationsUrl={integrationsUrl}
        onRetry={(platform) => {
          setPlatformErrors((prev) => { const c = { ...prev }; delete c[platform]; return c; });
          setSelectedPlatforms([platform]);
          setTimeout(() => handleDistribute(), 0);
        }}
      />
      {repurposingProgress?.active && <RepurposingProgress progress={repurposingProgress} />}
      <RepurposedAssetsContent
        outputs={postRepurposedOutputs}
        showPreview={showRepurposePreview}
        copiedId={copiedFormatId}
        onTogglePreview={() => setShowRepurposePreview((p) => !p)}
        onCopy={(id, text) => { navigator.clipboard.writeText(text); setCopiedFormatId(id); setTimeout(() => setCopiedFormatId(null), 2000); }}
      />
      <DistributionHistory records={distributionRecords} verifyingPlatform={verifyingPlatform} onVerify={handleVerify} onReset={handleReset} />
      <DistributeCTA
        distributing={distributing}
        postPublished={postPublished}
        selectedPlatforms={selectedPlatforms}
        selectedFormats={selectedRepurposeFormats}
        hasPreflightErrors={hasPreflightErrors}
        repurposingActive={repurposingProgress?.active || false}
        distributionError={distributionError}
        onDistribute={handleDistribute}
      />
    </div>
  );
}

export default DistributePanel;
