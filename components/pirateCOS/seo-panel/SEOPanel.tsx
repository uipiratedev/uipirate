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
        <div className="px-3 py-2 bg-red-50 border border-red-100 rounded-xl flex gap-2 text-[11px] text-red-600 font-medium font-geist">
          <CosIcon name="warning" size={12} className="text-red-500 shrink-0 mt-0.5" />
          <p className="flex-1">{seoError}</p>
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
