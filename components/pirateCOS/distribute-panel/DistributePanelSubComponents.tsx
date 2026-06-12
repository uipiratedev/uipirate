"use client";

import React from "react";
import Link from "next/link";
import CosIcon from "@/components/pirateCOS/CosIcon";
import {
  ContentGoal,
  getPostTypeConfig,
  DISTRIBUTION_CHAINS,
  DistributionChain,
} from "@/lib/pirateCOS/postTypeConfig";
import { PreflightCheck } from "@/lib/pirateCOS/distribution/transform/content-preflight";

// ─── Shared Types ─────────────────────────────────────────────────────────────
export interface DistributionRecord {
  platform: string;
  externalId: string;
  url: string;
  distributedAt: string | Date;
  status: "success" | "failed" | "pending";
  errorMessage?: string;
}
export interface Integration {
  platform: string;
  isActive: boolean;
  isConnected: boolean;
  siteUrl?: string;
  wpUsername?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
export const PLATFORM_LABELS: Record<string, string> = {
  wordpress: "WordPress",
  medium: "Medium",
  ghost: "Ghost",
  buffer: "Buffer (X/LinkedIn)",
  linkedin: "LinkedIn Direct",
};

// ─── Badge Helpers ────────────────────────────────────────────────────────────
export const getPresetsBadge = (activeChain: string | null) => {
  const chain = DISTRIBUTION_CHAINS.find((c) => c.value === activeChain);
  return {
    badge: chain?.label || "None",
    badgeColor: activeChain ? "bg-orange-50 text-orange-600" : "bg-gray-100 text-gray-400",
  };
};
export const getPreflightBadge = (checks: PreflightCheck[]) => {
  const errors = checks.filter((c) => !c.passed && c.severity === "error").length;
  const warnings = checks.filter((c) => !c.passed && c.severity === "warning").length;
  if (errors > 0) return { badge: `${errors} error${errors > 1 ? "s" : ""}`, badgeColor: "bg-red-50 text-red-600" };
  if (warnings > 0) return { badge: `${warnings} warning${warnings > 1 ? "s" : ""}`, badgeColor: "bg-amber-50 text-amber-600" };
  if (checks.length === 0) return { badge: undefined as string | undefined, badgeColor: "" };
  return { badge: "Ready ✓", badgeColor: "bg-green-50 text-green-600" };
};
export const getChannelsBadge = (selected: string[]) => ({
  badge: selected.length > 0 ? `${selected.length} selected` : "None",
  badgeColor: selected.length > 0 ? "bg-orange-50 text-orange-600" : "bg-gray-100 text-gray-400",
});
export const getSpinoffsBadge = (selected: string[], outputs: Record<string, string> = {}) => {
  const generated = Object.keys(outputs).length;
  const badge = generated > 0 ? `${generated} generated` : selected.length > 0 ? `${selected.length} selected` : "None";
  const badgeColor = generated > 0 ? "bg-green-50 text-green-600" : selected.length > 0 ? "bg-orange-50 text-orange-600" : "bg-gray-100 text-gray-400";
  return { badge, badgeColor };
};

// ─── Quick Presets Content ────────────────────────────────────────────────────
interface QuickPresetsContentProps {
  activeChain: string | null;
  onSelectChain: (chain: DistributionChain) => void;
}
export function QuickPresetsContent({ activeChain, onSelectChain }: QuickPresetsContentProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 leading-relaxed">
        Tap a preset to instantly configure the best channels and content formats for your goal.
      </p>
      <div className="space-y-2">
        {DISTRIBUTION_CHAINS.map((chain) => {
          const isActive = activeChain === chain.value;
          return (
            <button
              key={chain.value}
              type="button"
              className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-start gap-3 group cursor-pointer ${
                isActive
                  ? "border-[#FF5B04] bg-white shadow-sm"
                  : "border-black/5 bg-black/[0.01] hover:bg-black/[0.03] hover:border-black/10"
              }`}
              onClick={() => onSelectChain(chain)}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                isActive ? "bg-[#FF5B04]/10 text-[#FF5B04]" : "bg-black/[0.04] text-gray-400 group-hover:text-gray-600"
              }`}>
                <CosIcon name={chain.icon} size={18} className="shrink-0" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-bold ${isActive ? "text-[#FF5B04]" : "text-gray-700"}`}>{chain.label}</p>
                  {isActive && (
                    <span className="text-[8px] font-extrabold uppercase tracking-wider font-jetbrains-mono bg-[#FF5B04] text-white px-2 py-0.5 rounded">Active</span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">{chain.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {chain.defaultChannels.map((c) => (
                    <span key={c} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                      isActive ? "bg-[#FF5B04]/5 text-[#FF5B04] border-[#FF5B04]/10" : "bg-black/[0.02] text-gray-500 border-black/5"
                    }`}>
                      <CosIcon name="megaphone" size={10} className="text-gray-400" /> {PLATFORM_LABELS[c] || c}
                    </span>
                  ))}
                  {chain.recommendedRepurposing.map((r) => (
                    <span key={r} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                      isActive ? "bg-[#FF5B04]/10 text-[#FF5B04] border-[#FF5B04]/20" : "bg-black/[0.03] text-orange-600 border-black/5"
                    }`}>
                      <CosIcon name="refresh" size={10} className="text-orange-500" /> {r.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Channel Fit Content ──────────────────────────────────────────────────────
interface ChannelFitContentProps {
  postType: string;
  contentGoal: ContentGoal;
}
export function ChannelFitContent({ postType, contentGoal }: ChannelFitContentProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">Best channels for this post type based on your content goal.</p>
      <div className="flex flex-wrap gap-2">
        {Object.keys(PLATFORM_LABELS).map((platform) => {
          const isRecommended = getPostTypeConfig(postType)?.distributionChannels.includes(platform) || false;
          return (
            <span
              key={platform}
              title={isRecommended ? "Ideal fit for this post type!" : "Not recommended as primary channel"}
              className={`text-[9px] font-bold font-jetbrains-mono uppercase px-2 py-0.5 rounded-full border ${
                isRecommended ? "bg-green-50 text-green-700 border-green-200" : "bg-black/[0.02] text-gray-400 border-black/5"
              }`}
            >
              <span className="flex items-center gap-1">
                <CosIcon name={isRecommended ? "check" : "cross"} size={10} className={isRecommended ? "text-green-500" : "text-gray-400"} />
                {PLATFORM_LABELS[platform] || platform}
              </span>
            </span>
          );
        })}
      </div>
      <div className="text-xs leading-relaxed font-geist text-gray-600 bg-black/[0.02] rounded-xl p-3 border border-black/[0.04] space-y-1">
        <span className="font-bold text-gray-800 text-[10px] uppercase tracking-wider block">AI Tip:</span>
        <p>
          {contentGoal === "traffic" && "Drive organic traffic by targeting high-intent keywords. Publish first on your SEO-optimized blog."}
          {contentGoal === "authority" && "Establish thought leadership with detailed citations. Great fit for LinkedIn and Medium!"}
          {contentGoal === "conversion" && "Structure the post around solving problems with clear CTAs. Embed lead capture forms."}
          {contentGoal === "engagement" && "Create high curiosity with a strong opening hook. Ideal for Twitter threads or LinkedIn carousels!"}
          {contentGoal === "lead-generation" && "Offer actionable checklists or templates gated behind a newsletter subscription."}
          {contentGoal === "retention" && "Provide step-by-step instructions. Ideal for internal newsletters and education portals."}
        </p>
        <p className="text-[9px] font-semibold text-[#FF5B04] mt-1.5 font-jetbrains-mono italic">
          Best time: Tuesday & Thursday, 9:00 AM – 11:30 AM
        </p>
      </div>
    </div>
  );
}

// ─── Preflight Content ────────────────────────────────────────────────────────
interface PreflightContentProps {
  preflight: PreflightCheck[];
  autofixing: Record<string, boolean>;
  onAutofix: (checkId: string) => void;
  onAction: (action?: string) => void;
}
export function PreflightContent({ preflight, autofixing, onAutofix, onAction }: PreflightContentProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">Make sure everything is ready before publishing.</p>
      {preflight.map((check) => (
        <div
          key={check.id}
          className={`flex items-center justify-between gap-2 text-xs p-2 rounded-lg border-l-2 ${
            check.passed ? "border-transparent" : check.severity === "error" ? "border-red-400 bg-red-50/40" : "border-amber-400 bg-amber-50/30"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {check.passed ? (
              <CosIcon name="check" size={12} className="text-green-500 shrink-0" />
            ) : check.severity === "error" ? (
              <CosIcon name="cross" size={12} className="text-red-500 shrink-0" />
            ) : (
              <CosIcon name="warning" size={12} className="text-amber-500 shrink-0" />
            )}
            <span className={`truncate ${check.passed ? "text-gray-500" : "text-gray-900 font-medium"}`}>{check.label}</span>
          </div>
          {!check.passed && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {["excerpt", "tags", "focusKeyword", "metaTitle", "metaDescription"].includes(check.id) && (
                <button
                  type="button"
                  disabled={autofixing[check.id]}
                  onClick={() => onAutofix(check.id)}
                  className="h-7 px-2.5 bg-orange-50 hover:bg-orange-100/70 border border-orange-200/50 text-[#FF5B04] rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {autofixing[check.id] ? (
                    <>
                      <svg className="animate-spin h-2.5 w-2.5 text-[#FF5B04]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
                      </svg>
                      Fixing...
                    </>
                  ) : (
                    <span className="flex items-center gap-1"><CosIcon name="bolt" size={10} className="fill-current text-[#FF5B04]" /> Autofix</span>
                  )}
                </button>
              )}
              {check.action && (
                <button type="button" onClick={() => onAction(check.action)} className="h-7 px-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-black/5 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer shadow-sm">
                  {check.action}
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Target Channels Content ──────────────────────────────────────────────────
interface TargetChannelsContentProps {
  integrations: Integration[];
  selectedPlatforms: string[];
  loadingIntegrations: boolean;
  integrationsUrl: string;
  onToggle: (platform: string) => void;
}
export function TargetChannelsContent({ integrations, selectedPlatforms, loadingIntegrations, integrationsUrl, onToggle }: TargetChannelsContentProps) {
  const sorted = [...integrations].sort((a, b) => {
    const aOk = a.isConnected && a.isActive;
    const bOk = b.isConnected && b.isActive;
    return aOk === bOk ? 0 : aOk ? -1 : 1;
  });
  if (loadingIntegrations) return <p className="text-xs text-gray-400 py-2">Loading connected platforms...</p>;
  if (integrations.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-xs text-gray-400">No channels set up yet.</p>
        <Link href={integrationsUrl} className="text-[10px] font-semibold text-[#FF5B04] hover:underline mt-2 inline-block">Configure Integrations</Link>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {sorted.map((platform) => {
        const isSelected = selectedPlatforms.includes(platform.platform);
        const disabled = !platform.isConnected || !platform.isActive;
        return (
          <div
            key={platform.platform}
            className={`flex items-center justify-between p-2.5 rounded-xl border-2 transition-all ${
              disabled ? "opacity-50 bg-black/[0.01] border-transparent" : isSelected ? "border-[#FF5B04] bg-white shadow-sm" : "border-black/5 bg-white hover:border-black/10"
            }`}
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800">{PLATFORM_LABELS[platform.platform] || platform.platform}</p>
              <p className="text-[9px] text-gray-400 truncate">{disabled ? "Not connected" : platform.siteUrl || "Ready to distribute"}</p>
            </div>
            {disabled ? (
              <Link href={integrationsUrl} className="text-[9px] font-semibold text-[#FF5B04] hover:underline">Connect</Link>
            ) : (
              <button
                type="button"
                onClick={() => onToggle(platform.platform)}
                className={`w-8 h-4 rounded-full p-0.5 transition-colors relative flex items-center ${isSelected ? "bg-[#FF5B04]" : "bg-gray-200"}`}
              >
                <span className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 block ${isSelected ? "translate-x-4" : "translate-x-0"}`} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Spinoffs Content ─────────────────────────────────────────────────────────
const SPINOFF_FORMATS = [
  { id: "linkedin-thread", label: "LinkedIn Thread", icon: "link", hint: "10-slide carousel script" },
  { id: "twitter-thread", label: "Twitter Thread", icon: "social-post", hint: "8-12 sequential tweets" },
  { id: "newsletter", label: "Email Newsletter", icon: "envelope", hint: "Friendly HTML campaign template" },
  { id: "summary", label: "Executive Summary", icon: "listicle", hint: "200-word digest + bullet takeaways" },
  { id: "seo-meta", label: "SEO Meta Package", icon: "traffic", hint: "Focus slugs, tags and description limits" },
  { id: "cta-blocks", label: "CTA Action Blocks", icon: "bolt", hint: "Soft, medium and hard CTA variations" },
  { id: "faq-schema", label: "FAQ Schema", icon: "case-study", hint: "Structured Q&A schema" },
  { id: "infographic", label: "Infographic Blueprint", icon: "comparison", hint: "Visual blueprint scripts" },
];

interface SpinoffsContentProps {
  repurposedOutputs?: Record<string, string>;
  onNavigateToTransform?: (formatId: string) => void;
}

export function SpinoffsContent({ repurposedOutputs = {}, onNavigateToTransform }: SpinoffsContentProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 leading-relaxed">
        Let AI transform this post into other formats. Select an asset format to generate or view:
      </p>
      <div className="space-y-2">
        {SPINOFF_FORMATS.map((format) => {
          const isGenerated = !!repurposedOutputs?.[format.id];
          return (
            <button
              key={format.id}
              type="button"
              onClick={() => onNavigateToTransform?.(format.id)}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-black/5 bg-white hover:border-[#FF5B04]/30 hover:bg-orange-50/5 text-left transition-all cursor-pointer shadow-sm group"
            >
              <div className="flex-1 min-w-0 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-800 group-hover:text-[#FF5B04] transition-colors flex items-center gap-1.5">
                    <CosIcon name={format.icon} size={14} className="text-gray-500 group-hover:text-[#FF5B04] transition-colors" /> {format.label}
                  </span>
                  <span className="text-[9px] text-gray-400 font-geist block mt-0.5">{format.hint}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isGenerated && (
                    <span className="text-[9px] font-semibold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
                      ✓ Generated
                    </span>
                  )}
                  <span className="text-gray-300 group-hover:text-[#FF5B04] transition-colors font-bold text-xs">
                    →
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Repurposed Assets ────────────────────────────────────────────────────────
interface RepurposedAssetsContentProps {
  outputs: Record<string, string>;
  showPreview: boolean;
  copiedId: string | null;
  onTogglePreview: () => void;
  onCopy: (id: string, text: string) => void;
}
export function RepurposedAssetsContent({ outputs, showPreview, copiedId, onTogglePreview, onCopy }: RepurposedAssetsContentProps) {
  if (Object.keys(outputs).length === 0) return null;
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <CosIcon name="sparkles" size={12} className="text-[#FF5B04]" /> Repurposed Assets
        </p>
        <button type="button" onClick={onTogglePreview} className="text-[10px] font-bold text-[#FF5B04] hover:underline">
          {showPreview ? "Hide" : "Show Previews"}
        </button>
      </div>
      {showPreview && (
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
          {Object.entries(outputs).map(([formatId, text]) => (
            <div key={formatId} className="bg-gray-50 border border-black/5 rounded-xl p-3 space-y-2 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center border-b border-black/[0.04] pb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5B04] font-jetbrains-mono">{formatId.replace("_", " ")}</span>
                <button type="button" onClick={() => onCopy(formatId, text)} className="text-[9px] font-bold uppercase tracking-wider text-gray-400 hover:text-gray-600 transition-colors">
                  {copiedId === formatId ? "✓ Copied!" : "Copy"}
                </button>
              </div>
              <pre className="text-[11px] text-gray-600 font-geist leading-relaxed whitespace-pre-wrap select-all">{text}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Platform Errors ──────────────────────────────────────────────────────────
interface PlatformErrorsProps {
  errors: Record<string, string>;
  integrationsUrl: string;
  onRetry: (platform: string) => void;
}
export function PlatformErrors({ errors, integrationsUrl, onRetry }: PlatformErrorsProps) {
  if (Object.keys(errors).length === 0) return null;
  return (
    <div className="space-y-2">
      {Object.entries(errors).map(([platform, errMsg]) => (
        <div key={platform} className="bg-red-50/50 border border-red-200 rounded-2xl p-4 space-y-3 shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-start gap-2.5">
            <CosIcon name="warning" size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-red-800 uppercase tracking-wide">{PLATFORM_LABELS[platform] || platform} Publishing Failure</h4>
              <p className="text-[11px] text-red-700 leading-normal mt-1 bg-red-100/30 p-2.5 rounded-lg border border-red-200/40">{errMsg}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1 border-t border-red-100">
            <Link href={integrationsUrl} className="text-[10px] font-bold text-[#FF5B04] hover:text-orange-700 bg-white border border-[#FF5B04]/20 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1">
              <CosIcon name="link" size={10} className="mr-1" /> Reconnect
            </Link>
            <button type="button" onClick={() => onRetry(platform)} className="text-[10px] font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1">
              <CosIcon name="refresh" size={10} className="mr-1" /> Retry
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Repurposing Progress ─────────────────────────────────────────────────────
interface RepurposingProgressProps {
  progress: { active: boolean; currentFormat: string; percent: number };
}
export function RepurposingProgress({ progress }: RepurposingProgressProps) {
  return (
    <div className="bg-gradient-to-r from-[#FF5B04]/10 to-[#FF7B34]/5 border border-orange-500/20 rounded-2xl p-4 space-y-3 animate-pulse shadow-sm">
      <div className="flex justify-between items-center text-xs">
        <span className="font-bold text-orange-600 flex items-center gap-1.5">
          <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
          </svg>
          AI Repurposing in Progress...
        </span>
        <span className="font-jetbrains-mono font-bold text-[#FF5B04]">{progress.percent}%</span>
      </div>
      <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#FF5B04] to-[#FF7B34] transition-all duration-500" style={{ width: `${progress.percent}%` }} />
      </div>
      <p className="text-[10px] text-gray-500 font-medium">
        Generating: <span className="font-mono text-gray-700 capitalize">{progress.currentFormat.replace("_", " ")}</span>
      </p>
    </div>
  );
}

// ─── Distribution History ─────────────────────────────────────────────────────
interface DistributionHistoryProps {
  records: DistributionRecord[];
  verifyingPlatform: string | null;
  onVerify: (platform: string) => void;
  onReset: (platform: string) => void;
}
export function DistributionHistory({ records, verifyingPlatform, onVerify, onReset }: DistributionHistoryProps) {
  if (records.length === 0) return null;
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
      <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-3">Distribution History</p>
      <div className="space-y-2">
        {records.map((rec) => (
          <div key={rec.platform} className="flex items-center justify-between text-xs py-2 border-b border-black/[0.03] last:border-0 last:pb-0">
            <span className="font-semibold text-gray-800 uppercase text-[10px] font-jetbrains-mono">{rec.platform}</span>
            <div className="flex items-center gap-1.5 min-w-0 max-w-[70%]">
              {rec.status === "success" ? (
                <>
                  <a href={rec.url || "#"} target="_blank" rel="noopener noreferrer" className="h-7 px-2 bg-orange-50 hover:bg-orange-100/80 text-[#FF5B04] rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all border border-orange-100/50 whitespace-nowrap shadow-sm">View ↗</a>
                  <button type="button" disabled={verifyingPlatform !== null} onClick={() => onVerify(rec.platform)} className="h-7 px-2 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-black/5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50 shadow-sm">
                    <CosIcon name="refresh" size={10} className={verifyingPlatform === rec.platform ? "animate-spin text-[#FF5B04]" : "text-gray-500"} /> Sync
                  </button>
                </>
              ) : (
                <span className="inline-flex text-[10px] font-semibold font-jetbrains-mono px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100/50" title={rec.errorMessage || "Distribution failed"}>
                  <CosIcon name="cross" size={9} className="text-red-500 shrink-0 mt-0.5 mr-1" /> Failed
                </span>
              )}
              <button type="button" disabled={verifyingPlatform !== null} onClick={() => onReset(rec.platform)} title="Reset distribution status" className="h-7 px-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/40 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50 shadow-sm">
                <CosIcon name="cross" size={10} className="text-red-500" /> Reset
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Post-Publish Actions ─────────────────────────────────────────────────────
interface PostPublishActionsProps {
  records: DistributionRecord[];
  postType: string;
  onTriggerCopilotAI: () => void;
}
export function PostPublishActions({ records, postType, onTriggerCopilotAI }: PostPublishActionsProps) {
  if (postType === "social-post" || !records.some((r) => r.status === "success")) return null;
  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-2">
      <p className="text-[10px] font-jetbrains-mono text-green-700 uppercase tracking-widest font-bold flex items-center gap-1.5">
        <CosIcon name="celebrate" size={12} className="text-green-600" /> Successfully Distributed! What's next?
      </p>
      <p className="text-xs text-green-600 leading-relaxed font-geist">Your post is live! Amplify its reach immediately:</p>
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onTriggerCopilotAI} className="text-[9px] font-bold uppercase tracking-wider bg-green-600 text-white hover:bg-green-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
          Generate Social Thread
        </button>
        <button type="button" onClick={() => alert("Setting up newsletter draft...")} className="text-[9px] font-bold uppercase tracking-wider bg-white text-green-700 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
          Create Newsletter Digest
        </button>
      </div>
    </div>
  );
}

// ─── Distribute CTA ───────────────────────────────────────────────────────────
interface DistributeCTAProps {
  distributing: boolean;
  blogPublished: boolean;
  selectedPlatforms: string[];
  selectedFormats: string[];
  hasPreflightErrors: boolean;
  repurposingActive: boolean;
  distributionError: string | null;
  onDistribute: () => void;
}
export function DistributeCTA({ distributing, blogPublished, selectedPlatforms, selectedFormats, hasPreflightErrors, repurposingActive, distributionError, onDistribute }: DistributeCTAProps) {
  return (
    <div className="pt-2">
      {!blogPublished && (
        <p className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 p-2.5 rounded-xl mb-3 leading-relaxed flex items-start gap-1.5 font-geist">
          <CosIcon name="warning" size={12} className="text-amber-500 shrink-0 mt-0.5" />
          <span>Please publish the blog locally (via the "Publish" button at the top right) to enable multi-channel distribution.</span>
        </p>
      )}
      {distributionError && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-100 p-2.5 rounded-xl mb-3 leading-relaxed">{distributionError}</p>
      )}
      <button
        type="button"
        style={{ background: "#FF5B04" }}
        disabled={distributing || !blogPublished || (selectedPlatforms.length === 0 && selectedFormats.length === 0) || hasPreflightErrors}
        onClick={onDistribute}
        className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white h-10 px-6 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {distributing ? (
          <>
            <svg className="animate-spin" fill="none" height="14" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="14">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            {repurposingActive ? "Repurposing..." : "Distributing…"}
          </>
        ) : (
          "Distribute Now"
        )}
      </button>
    </div>
  );
}
