"use client";

import React from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
import CosIcon from "@/components/pirateCOS/CosIcon";
import {
  PostSEO,
  getFocusKeywordBadge,
  getMetaTitleBadge,
  getMetaDescriptionBadge,
  getKeywordsBadge,
  getSocialBadge,
  getAdvancedBadge,
  FocusKeywordContent,
  MetaTitleContent,
  MetaDescriptionContent,
  RelatedKeywordsContent,
  GooglePreviewContent,
  SocialOverridesContent,
  AdvancedSEOContent,
} from "./SEOPanelSubComponents";

// ─── Props ────────────────────────────────────────────────────────────────────
export interface SEOPanelProps {
  seo: PostSEO;
  title: string;
  currentSlug: string;
  onSeoChange: (patch: Partial<PostSEO>) => void;
  onSlugChange: (slug: string) => void;
  onDirtyChange: () => void;
  seoError?: string;
  // AI — Focus Keyword
  isSuggestingFocusKeyword?: boolean;
  onGenerateFocusKeyword?: () => void;
  // AI — Meta Title
  isGeneratingMetaTitle?: boolean;
  suggestedMetaTitle?: string;
  onGenerateMetaTitle?: () => void;
  onApplySuggestedMetaTitle?: () => void;
  // AI — Meta Description
  isGeneratingMetaDescription?: boolean;
  suggestedMetaDescription?: string;
  onGenerateMetaDescription?: () => void;
  onApplySuggestedMetaDescription?: () => void;
  // AI — Keywords
  isGeneratingKeywords?: boolean;
  onGenerateKeywords?: () => void;
}

// ─── Accordion Title ──────────────────────────────────────────────────────────
function AccordionTitle({ title, badge, color }: { title: string; badge: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-jetbrains-mono text-gray-700 uppercase tracking-widest font-bold">
        {title}
      </span>
      {badge && (
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${color}`}>{badge}</span>
      )}
    </div>
  );
}

// ─── SEOPanel ─────────────────────────────────────────────────────────────────
export function SEOPanel({
  seo,
  title,
  currentSlug,
  onSeoChange,
  onSlugChange,
  onDirtyChange,
  seoError,
  isSuggestingFocusKeyword = false,
  onGenerateFocusKeyword = () => {},
  isGeneratingMetaTitle = false,
  suggestedMetaTitle = "",
  onGenerateMetaTitle = () => {},
  onApplySuggestedMetaTitle = () => {},
  isGeneratingMetaDescription = false,
  suggestedMetaDescription = "",
  onGenerateMetaDescription = () => {},
  onApplySuggestedMetaDescription = () => {},
  isGeneratingKeywords = false,
  onGenerateKeywords = () => {},
}: SEOPanelProps) {

  const patch = (p: Partial<PostSEO>) => { onSeoChange(p); onDirtyChange(); };

  const items = (() => {
    const arr: React.ReactElement[] = [];

    arr.push(
      <AccordionItem key="focus-kw" title={<AccordionTitle title="Focus Keyword" {...getFocusKeywordBadge(seo.focusKeyword)} />}>
        <FocusKeywordContent
          value={seo.focusKeyword || ""}
          loading={isSuggestingFocusKeyword}
          onChange={(v) => patch({ focusKeyword: v })}
          onGenerate={onGenerateFocusKeyword}
        />
      </AccordionItem>
    );

    arr.push(
      <AccordionItem key="meta-title" title={<AccordionTitle title="Meta Title" {...getMetaTitleBadge(seo.metaTitle)} />}>
        <MetaTitleContent
          value={seo.metaTitle || ""}
          loading={isGeneratingMetaTitle}
          suggested={suggestedMetaTitle}
          onChange={(v) => patch({ metaTitle: v })}
          onGenerate={onGenerateMetaTitle}
          onApplySuggested={onApplySuggestedMetaTitle}
        />
      </AccordionItem>
    );

    arr.push(
      <AccordionItem key="meta-desc" title={<AccordionTitle title="Meta Description" {...getMetaDescriptionBadge(seo.metaDescription)} />}>
        <MetaDescriptionContent
          value={seo.metaDescription || ""}
          loading={isGeneratingMetaDescription}
          suggested={suggestedMetaDescription}
          onChange={(v) => patch({ metaDescription: v })}
          onGenerate={onGenerateMetaDescription}
          onApplySuggested={onApplySuggestedMetaDescription}
        />
      </AccordionItem>
    );

    arr.push(
      <AccordionItem key="keywords" title={<AccordionTitle title="Related Keywords" {...getKeywordsBadge(seo.keywords)} />}>
        <RelatedKeywordsContent
          keywords={seo.keywords || []}
          loading={isGeneratingKeywords}
          onGenerate={onGenerateKeywords}
          onSetFocus={(kw) => patch({ focusKeyword: kw })}
          onRemove={(idx) => patch({ keywords: (seo.keywords || []).filter((_, i) => i !== idx) })}
        />
      </AccordionItem>
    );

    arr.push(
      <AccordionItem key="preview" title={<AccordionTitle title="Search & Social Preview" badge="Preview" color="bg-gray-100 text-gray-500" />}>
        <GooglePreviewContent
          metaTitle={seo.metaTitle || ""}
          metaDescription={seo.metaDescription || ""}
          slug={currentSlug}
          title={title}
        />
      </AccordionItem>
    );

    arr.push(
      <AccordionItem key="social" title={<AccordionTitle title="Social Overrides" {...getSocialBadge(seo)} />}>
        <SocialOverridesContent seo={seo} title={title} onPatch={patch} />
      </AccordionItem>
    );

    arr.push(
      <AccordionItem key="advanced" title={<AccordionTitle title="Advanced" {...getAdvancedBadge(currentSlug, seo.canonicalUrl)} />}>
        <AdvancedSEOContent
          slug={currentSlug}
          canonicalUrl={seo.canonicalUrl || ""}
          onSlugChange={(v) => { onSlugChange(v); onDirtyChange(); }}
          onCanonicalChange={(v) => patch({ canonicalUrl: v })}
        />
      </AccordionItem>
    );

    return arr;
  })();

  return (
    <div className="space-y-2">
      {seoError && (
        <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex gap-3 animate-in slide-in-from-top-1 duration-200">
          <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg fill="none" height="14" stroke="#ef4444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="14">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-red-700 mb-0.5">SEO Analysis Failed</p>
            <p className="text-[10px] text-red-600 leading-relaxed">{seoError}</p>
            <p className="text-[10px] text-red-400 mt-1.5">Try switching to a different AI model using the selector above.</p>
          </div>
        </div>
      )}
      <Accordion
        variant="splitted"
        selectionMode="single"
        className="px-0"
        itemClasses={{
          base: "shadow-sm mb-3",
          title: "text-[10px] font-jetbrains-mono text-gray-700 uppercase tracking-widest font-bold",
          trigger: " py-3 hover:bg-black/[0.02]",
          content: " pb-3",
        }}
      >
        {items}
      </Accordion>
    </div>
  );
}

export default SEOPanel;
