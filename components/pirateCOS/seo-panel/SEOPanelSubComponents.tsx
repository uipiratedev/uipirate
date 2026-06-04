"use client";

import React from "react";
import CosIcon from "@/components/pirateCOS/CosIcon";

// ─── Shared Types ─────────────────────────────────────────────────────────────
export interface PostSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterHandle?: string;
  twitterCard?: "summary" | "summary_large_image";
  focusKeyword?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

// ─── Shared Styles ────────────────────────────────────────────────────────────
const inputCls =
  "w-full text-sm font-geist text-gray-700 bg-black/5 rounded-xl px-3 py-2.5 outline-none placeholder-gray-400 focus:ring-1 focus:ring-[#FF5B04]/30 transition-all";
const labelCls =
  "text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider text-gray-500 block";
const hintCls = "text-[9px] text-gray-400 font-geist mt-0.5";

// ─── AI Button (full-width solid, matches Content Settings) ──────────────────
interface AIBtnProps {
  loading: boolean;
  loadingLabel: string;
  idleLabel: string;
  onClick: () => void;
}
export function AIBtn({ loading, loadingLabel, idleLabel, onClick }: AIBtnProps) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-[#FF5B04] text-white hover:bg-[#e04f03] transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          <CosIcon name="sparkles" size={12} className="text-white" />
          <span>{idleLabel}</span>
        </>
      )}
    </button>
  );
}

// ─── Suggestion Strip ─────────────────────────────────────────────────────────
interface SuggestionStripProps {
  value: string;
  multiline?: boolean;
  onApply: () => void;
  applyLabel?: string;
}
export function SuggestionStrip({ value, multiline, onApply, applyLabel = "Apply" }: SuggestionStripProps) {
  if (!value) return null;
  return (
    <div className={`mt-1 p-2 bg-orange-50 border border-[#FF5B04]/20 rounded-lg flex ${multiline ? "flex-col gap-1" : "items-center justify-between gap-2"}`}>
      <span className={`text-[11px] font-geist text-gray-700 ${multiline ? "leading-normal" : "truncate"}`}>{value}</span>
      <button type="button" onClick={onApply} className={`text-[10px] font-semibold text-[#FF5B04] hover:underline flex-shrink-0 ${multiline ? "self-end" : ""}`}>
        {applyLabel}
      </button>
    </div>
  );
}

// ─── Badge Helpers ────────────────────────────────────────────────────────────
type BadgeResult = { badge: string; color: string };

export function getFocusKeywordBadge(kw?: string): BadgeResult {
  return kw?.trim()
    ? { badge: kw.trim().slice(0, 20), color: "bg-green-50 text-green-600" }
    : { badge: "Not set", color: "bg-gray-100 text-gray-400" };
}

export function getMetaTitleBadge(val?: string): BadgeResult {
  const len = (val || "").length;
  if (len === 0) return { badge: "0/60", color: "bg-gray-100 text-gray-400" };
  if (len > 60) return { badge: `${len}/60 · Too long`, color: "bg-red-50 text-red-500" };
  if (len >= 50) return { badge: `${len}/60 · Good`, color: "bg-green-50 text-green-600" };
  return { badge: `${len}/60`, color: "bg-amber-50 text-amber-600" };
}

export function getMetaDescriptionBadge(val?: string): BadgeResult {
  const len = (val || "").length;
  if (len === 0) return { badge: "0/160", color: "bg-gray-100 text-gray-400" };
  if (len > 160) return { badge: `${len}/160 · Too long`, color: "bg-red-50 text-red-500" };
  if (len >= 140) return { badge: `${len}/160 · Good`, color: "bg-green-50 text-green-600" };
  return { badge: `${len}/160`, color: "bg-amber-50 text-amber-600" };
}

export function getKeywordsBadge(kws?: string[]): BadgeResult {
  const count = kws?.length || 0;
  return count > 0
    ? { badge: `${count} keyword${count > 1 ? "s" : ""}`, color: "bg-orange-50 text-orange-600" }
    : { badge: "None", color: "bg-gray-100 text-gray-400" };
}

export function getSocialBadge(seo?: PostSEO): BadgeResult {
  const hasCustom = !!(seo?.ogImage || seo?.ogTitle || seo?.ogDescription);
  return hasCustom
    ? { badge: "Custom", color: "bg-green-50 text-green-600" }
    : { badge: "Default", color: "bg-gray-100 text-gray-400" };
}

export function getAdvancedBadge(slug?: string, canonical?: string): BadgeResult {
  return slug || canonical
    ? { badge: "Configured", color: "bg-blue-50 text-blue-600" }
    : { badge: "Default", color: "bg-gray-100 text-gray-400" };
}

// ─── Shared card wrapper ──────────────────────────────────────────────────────
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 space-y-2">
      {children}
    </div>
  );
}

export { inputCls, labelCls, hintCls };

// ─── Focus Keyword Content ────────────────────────────────────────────────────
interface FocusKeywordContentProps {
  value: string;
  loading: boolean;
  onChange: (v: string) => void;
  onGenerate: () => void;
}
export function FocusKeywordContent({ value, loading, onChange, onGenerate }: FocusKeywordContentProps) {
  return (
    <div className="space-y-3">
      <p className={hintCls}>The main term you want to rank for in Google</p>
      <input className={inputCls} placeholder="e.g. react performance tips" value={value} onChange={(e) => onChange(e.target.value)} />
      <AIBtn loading={loading} loadingLabel="Suggesting..." idleLabel="AI Suggest" onClick={onGenerate} />
    </div>
  );
}

// ─── Meta Title Content ───────────────────────────────────────────────────────
interface MetaTitleContentProps {
  value: string;
  loading: boolean;
  suggested: string;
  onChange: (v: string) => void;
  onGenerate: () => void;
  onApplySuggested: () => void;
}
export function MetaTitleContent({ value, loading, suggested, onChange, onGenerate, onApplySuggested }: MetaTitleContentProps) {
  const len = value.length;
  const charColor = len > 60 ? "text-red-400" : len >= 50 ? "text-green-500" : "text-gray-400";
  return (
    <div className="space-y-3">
      <p className={hintCls}>Shown as the clickable title in Google search results — 50–60 chars is ideal</p>
      <input className={inputCls} maxLength={60} placeholder="SEO page title…" value={value} onChange={(e) => onChange(e.target.value)} />
      <p className={`text-right text-[9px] font-semibold font-geist -mt-1.5 ${charColor}`}>{len}/60</p>
      <SuggestionStrip value={suggested} onApply={onApplySuggested} />
      <AIBtn loading={loading} loadingLabel="Generating..." idleLabel="Generate Meta Title" onClick={onGenerate} />
    </div>
  );
}

// ─── Meta Description Content ─────────────────────────────────────────────────
interface MetaDescriptionContentProps {
  value: string;
  loading: boolean;
  suggested: string;
  onChange: (v: string) => void;
  onGenerate: () => void;
  onApplySuggested: () => void;
}
export function MetaDescriptionContent({ value, loading, suggested, onChange, onGenerate, onApplySuggested }: MetaDescriptionContentProps) {
  const len = value.length;
  const charColor = len > 160 ? "text-red-400" : len >= 140 ? "text-green-500" : "text-gray-400";
  return (
    <div className="space-y-3">
      <p className={hintCls}>Shown below the title in search results — 140–160 chars is ideal</p>
      <textarea className={`${inputCls} resize-none`} maxLength={160} placeholder="Brief description for search results…" rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      <p className={`text-right text-[9px] font-semibold font-geist -mt-1.5 ${charColor}`}>{len}/160</p>
      <SuggestionStrip value={suggested} multiline onApply={onApplySuggested} applyLabel="Apply Description" />
      <AIBtn loading={loading} loadingLabel="Generating..." idleLabel="Generate Meta Description" onClick={onGenerate} />
    </div>
  );
}

// ─── Related Keywords Content ─────────────────────────────────────────────────
interface RelatedKeywordsContentProps {
  keywords: string[];
  loading: boolean;
  onGenerate: () => void;
  onSetFocus: (kw: string) => void;
  onRemove: (idx: number) => void;
}
export function RelatedKeywordsContent({ keywords, loading, onGenerate, onSetFocus, onRemove }: RelatedKeywordsContentProps) {
  return (
    <div className="space-y-3">
      <p className={hintCls}>Supporting terms that boost topical relevance — tap any to set it as your Focus Keyword</p>
      {keywords.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((kw, idx) => (
            <span key={idx} onClick={() => onSetFocus(kw)} className="px-2 py-0.5 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-bold font-geist border border-orange-100 flex items-center gap-1 cursor-pointer hover:bg-orange-100 transition-all select-none" title="Set as Focus Keyword">
              {kw}
              <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(idx); }} className="text-orange-400 hover:text-orange-600 font-bold pl-0.5">×</button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[10px] text-gray-400 italic font-geist">No keywords yet — generate some or add them manually.</p>
      )}
      <AIBtn loading={loading} loadingLabel="Generating..." idleLabel="Generate Related Keywords" onClick={onGenerate} />
    </div>
  );
}

// ─── Google Preview Content ───────────────────────────────────────────────────
interface GooglePreviewContentProps {
  metaTitle: string;
  metaDescription: string;
  slug: string;
  title: string;
}
export function GooglePreviewContent({ metaTitle, metaDescription, slug, title }: GooglePreviewContentProps) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider text-gray-400">Google Search Preview</p>
      <div className="p-3.5 bg-white border border-black/5 rounded-xl text-left">
        <p className="text-[11px] text-[#202124] truncate leading-tight">uipirate.com/posts/<span className="font-semibold">{slug || "..."}</span></p>
        <h4 className="text-sm text-[#1a0dab] font-semibold hover:underline cursor-pointer leading-snug line-clamp-2 mt-0.5">{metaTitle || title || "Untitled Post"}</h4>
        <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed mt-1">{metaDescription || "Add a meta description to see how your post will appear in Google results."}</p>
      </div>

      <p className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider text-gray-400 pt-1">Social Card Preview</p>
      <div className="bg-white border border-black/5 rounded-xl overflow-hidden shadow-sm">
        <div className="aspect-[1.91/1] bg-gray-100 flex items-center justify-center">
          <div className="text-gray-300 flex flex-col items-center justify-center gap-1">
            <svg fill="none" height="24" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><rect height="18" rx="2" width="18" x="3" y="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
            <span className="text-[8px] font-bold uppercase tracking-widest">Set OG Image below</span>
          </div>
        </div>
        <div className="p-3 bg-gray-50/50 border-t border-black/5 text-left">
          <p className="text-[8px] text-gray-400 uppercase font-bold font-jetbrains-mono mb-1">UIPIRATE.COM</p>
          <h4 className="text-xs font-bold text-gray-900 line-clamp-1 mb-1">{metaTitle || title || "Untitled Post"}</h4>
          <p className="text-[10px] text-gray-500 line-clamp-2 leading-snug">{metaDescription || "No description provided."}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Social Overrides Content ─────────────────────────────────────────────────
interface SocialOverridesContentProps {
  seo: PostSEO;
  title: string;
  onPatch: (patch: Partial<PostSEO>) => void;
}
export function SocialOverridesContent({ seo, title, onPatch }: SocialOverridesContentProps) {
  return (
    <div className="space-y-3">
      {/* OG Image preview if set */}
      {seo.ogImage && (
        <div className="bg-white border border-black/5 rounded-xl overflow-hidden shadow-sm">
          <div className="aspect-[1.91/1] bg-gray-100 overflow-hidden">
            <img alt="OG Preview" className="w-full h-full object-cover" src={seo.ogImage} />
          </div>
          <div className="p-3 bg-gray-50/50 border-t border-black/5">
            <p className="text-[8px] text-gray-400 uppercase font-bold font-jetbrains-mono mb-1">UIPIRATE.COM</p>
            <h4 className="text-xs font-bold text-gray-900 line-clamp-1 mb-1">{seo.ogTitle || seo.metaTitle || title || "Untitled Post"}</h4>
            <p className="text-[10px] text-gray-500 line-clamp-2 leading-snug">{seo.ogDescription || seo.metaDescription || "No description provided."}</p>
          </div>
        </div>
      )}

      <div className="space-y-1">
        <label className={labelCls}>Social Share Image URL</label>
        <p className={hintCls}>Appears when someone shares this link on LinkedIn, X, etc.</p>
        <input className={inputCls} placeholder="https://cloudinary.com/..." value={seo.ogImage || ""} onChange={(e) => onPatch({ ogImage: e.target.value })} />
      </div>

      <div className="space-y-1">
        <label className={labelCls}>Social Title Override</label>
        <p className={hintCls}>Optional: use a different title for Facebook/LinkedIn shares</p>
        <input className={inputCls} placeholder="Defaults to Meta Title if blank…" value={seo.ogTitle || ""} onChange={(e) => onPatch({ ogTitle: e.target.value })} />
      </div>

      <div className="space-y-1">
        <label className={labelCls}>Social Description Override</label>
        <p className={hintCls}>Optional: use a different description for social shares</p>
        <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Defaults to Meta Description if blank…" value={seo.ogDescription || ""} onChange={(e) => onPatch({ ogDescription: e.target.value })} />
      </div>

      <div className="flex items-center gap-3 bg-white rounded-xl border border-black/5 p-3">
        <input id="seo-panel-noindex" type="checkbox" checked={seo.noIndex || false} onChange={(e) => onPatch({ noIndex: e.target.checked })} className="w-4 h-4 rounded border-black/10 text-[#FF5B04] focus:ring-[#FF5B04]/30 cursor-pointer" />
        <div>
          <label htmlFor="seo-panel-noindex" className="text-xs font-bold font-geist text-gray-700 cursor-pointer select-none block">Hide from search engines</label>
          <p className="text-[9px] text-gray-400 font-geist">Adds a no-index tag so Google won't index this page</p>
        </div>
      </div>
    </div>
  );
}

// ─── Advanced SEO Content ─────────────────────────────────────────────────────
interface AdvancedSEOContentProps {
  slug: string;
  canonicalUrl: string;
  onSlugChange: (v: string) => void;
  onCanonicalChange: (v: string) => void;
}
export function AdvancedSEOContent({ slug, canonicalUrl, onSlugChange, onCanonicalChange }: AdvancedSEOContentProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className={labelCls}>URL Slug</label>
        <input className={inputCls} placeholder="url-slug-here" value={slug} onChange={(e) => { const val = e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""); onSlugChange(val); }} />
      </div>
      <div className="space-y-1">
        <label className={labelCls}>Canonical URL</label>
        <input className={inputCls} placeholder="https://yourdomain.com/posts/..." value={canonicalUrl} onChange={(e) => onCanonicalChange(e.target.value)} />
      </div>
    </div>
  );
}
