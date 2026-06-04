"use client";

import React, { useMemo } from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
import {
  ContentGoal,
  calculateHealthScore,
} from "@/lib/pirateCOS/postTypeConfig";
import {
  OverallHealthHeader,
  SEOHealthContent,
  ReadabilityContent,
  EngagementContent,
  StructureContent,
  ConversionContent,
  CTAContent,
  DistributionContent,
  getMetricBadge,
} from "./ContentHealthSubComponents";

// ─── Accordion Title Helper ───────────────────────────────────────────────────

const AccordionTitle: React.FC<{
  title: string;
  badge?: string;
  badgeColor?: string;
}> = ({ title, badge, badgeColor }) => (
  <div className="flex items-center gap-2 px-0">
    <span className="text-[10px] font-jetbrains-mono text-gray-700 uppercase tracking-widest font-bold">
      {title}
    </span>
    {badge && (
      <span
        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${badgeColor || "bg-gray-100 text-gray-500"}`}
      >
        {badge}
      </span>
    )}
  </div>
);

// ─── Props ────────────────────────────────────────────────────────────────────

interface ContentHealthPanelProps {
  contentHtml: string;
  title: string;
  excerpt?: string;
  featuredImage?: string;
  bannerImage?: string;
  tags?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
  };
  postType: string;
  goal: ContentGoal;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ContentHealthPanel: React.FC<ContentHealthPanelProps> = ({
  contentHtml = "",
  title = "",
  excerpt = "",
  featuredImage = "",
  bannerImage = "",
  tags = [],
  seo = {},
  postType: _postType,
  goal,
}) => {
  const analysis = useMemo(() => {
    // ── Basic text stats ──
    const tempDiv =
      typeof document !== "undefined" ? document.createElement("div") : null;
    if (tempDiv) tempDiv.innerHTML = contentHtml;
    const plainText = tempDiv?.textContent || tempDiv?.innerText || "";
    const words = plainText.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const sentences = plainText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const sentenceCount = sentences.length;
    const wordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    const paragraphs = contentHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
    const paragraphCount = paragraphs.length;
    const wordsPerParagraph = paragraphCount > 0 ? wordCount / paragraphCount : 0;
    const h2Count = (contentHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || []).length;
    const h3Count = (contentHtml.match(/<h3[^>]*>([\s\S]*?)<\/h3>/gi) || []).length;
    const headingCount = h2Count + h3Count;
    const links = contentHtml.match(/<a[^>]* href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi) || [];
    const linkCount = links.length;

    // ── 1. SEO Score ──
    let seoScore = 0;
    const seoTips: string[] = [];
    const focusKeyword = seo.focusKeyword?.trim().toLowerCase();
    if (focusKeyword) {
      const keywordInTitle = title.toLowerCase().includes(focusKeyword);
      const keywordInIntro = plainText.substring(0, 500).toLowerCase().includes(focusKeyword);
      const keywordInHeadings =
        contentHtml.toLowerCase().includes("<h2") &&
        contentHtml.toLowerCase().includes(focusKeyword);
      const keywordOccurrences = (
        plainText
          .toLowerCase()
          .match(new RegExp(focusKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []
      ).length;
      const density = wordCount > 0 ? (keywordOccurrences / wordCount) * 100 : 0;
      if (keywordInTitle) seoScore += 15;
      else seoTips.push(`Add your focus keyword "${seo.focusKeyword}" to your post title.`);
      if (keywordInIntro) seoScore += 15;
      else seoTips.push("Include your focus keyword in the introductory paragraph.");
      if (keywordInHeadings) seoScore += 10;
      else seoTips.push("Use the focus keyword in at least one H2 or H3 heading.");
      if (density >= 0.5 && density <= 2.5) seoScore += 10;
      else if (density > 0)
        seoTips.push(`Keyword density is ${density.toFixed(1)}%. Aim for 0.5%–2.5%.`);
      else seoTips.push("Integrate the focus keyword naturally throughout the body content.");
    } else {
      seoTips.push("Set a Focus Keyword in the SEO tab to unlock detailed SEO scoring.");
    }
    if (seo.metaTitle) seoScore += 20;
    else seoTips.push("Add a meta title in the SEO tab.");
    if (seo.metaDescription) seoScore += 20;
    else seoTips.push("Add a meta description in the SEO tab.");
    if (headingCount > 0) seoScore += 10;
    else seoTips.push("Add H2 headings to organize content and improve crawlability.");
    seoScore = Math.min(100, seoScore);

    // ── 2. Readability ──
    let readability = 0;
    const readTips: string[] = [];
    if (wordCount > 0) {
      if (wordsPerSentence > 0 && wordsPerSentence < 16) readability += 40;
      else if (wordsPerSentence <= 22) {
        readability += 30;
        readTips.push("Some sentences are long. Try breaking them into shorter, punchier thoughts.");
      } else {
        readability += 15;
        readTips.push("High average sentence length. Keep sentences under 15 words for maximum readability.");
      }
      if (wordsPerParagraph > 0 && wordsPerParagraph < 65) readability += 30;
      else if (wordsPerParagraph <= 100) {
        readability += 20;
        readTips.push("Paragraphs are a bit dense. Aim for 2–3 sentences per paragraph.");
      } else {
        readability += 10;
        readTips.push("Paragraphs are too blocky. Add line breaks to create breathing room.");
      }
      const hasLists = contentHtml.includes("<li>");
      if (hasLists) readability += 30;
      else {
        readability += 10;
        readTips.push("Use bullet points or numbered lists to make the content scannable.");
      }
      readability = Math.min(100, readability);
    } else {
      readTips.push("Write some content in the editor to calculate readability.");
    }


    // ── 3. Engagement Likelihood ──
    let engagementLikelihood = 0;
    const engageTips: string[] = [];
    if (wordCount > 0) {
      const introText = plainText.substring(0, 250).toLowerCase();
      const hasHookWord =
        /\b(how|why|secret|reveal|ultimate|surprising|learn|discover|bootstrap|mistake|avoid|boost|grow|proven|guide)\b/.test(
          introText
        );
      const hasNumber = /\b\d+\b/.test(introText);
      const hasIntroQuestion = introText.includes("?");
      if (hasHookWord || hasNumber || hasIntroQuestion) engagementLikelihood += 40;
      else
        engageTips.push(
          "Start with an attention-grabbing hook: ask a question, share a stat, or use powerful action verbs."
        );
      const totalQuestions = (plainText.match(/\?/g) || []).length;
      if (totalQuestions >= 2) engagementLikelihood += 30;
      else if (totalQuestions === 1) {
        engagementLikelihood += 15;
        engageTips.push("Add another question to invite active reflection or community discussion.");
      } else {
        engageTips.push("Ask 1 or 2 direct questions to the reader to spark engagement.");
      }
      engagementLikelihood += Math.round(readability * 0.3);
      engagementLikelihood = Math.min(100, engagementLikelihood);
    } else {
      engageTips.push("Write some content to analyze engagement likelihood.");
    }

    // ── 4. Conversion Strength ──
    let conversionStrength = 0;
    const convTips: string[] = [];
    if (wordCount > 0) {
      const textLower = plainText.toLowerCase();
      const youCount = (textLower.match(/\b(you|your|yours)\b/g) || []).length;
      const weCount = (textLower.match(/\b(we|i|our|us|my|me)\b/g) || []).length;
      if (youCount > weCount && youCount > 0) conversionStrength += 35;
      else convTips.push("Shift language to be reader-centric. Use 'you' and 'your' more than 'we' or 'I'.");
      const benefitCount = (
        textLower.match(
          /\b(save|boost|improve|grow|free|easy|guarantee|increase|reduce|efficient|solve|transform)\b/g
        ) || []
      ).length;
      if (benefitCount >= 3) conversionStrength += 35;
      else convTips.push("Incorporate benefit-driven terms (e.g. 'save', 'grow', 'improve') to articulate value.");
      const hasCTA =
        linkCount > 0 ||
        contentHtml.includes("cta-block") ||
        contentHtml.includes("border-orange-500");
      if (hasCTA) conversionStrength += 30;
      else convTips.push("Insert a clear CTA button or high-contrast box promoting your primary action.");
      conversionStrength = Math.min(100, conversionStrength);
    } else {
      convTips.push("Write some content to analyze conversion strength.");
    }

    // ── 5. CTA Strength ──
    let ctaStrength = 0;
    const ctaTips: string[] = [];
    if (wordCount > 0) {
      if (linkCount >= 1 && linkCount <= 4) ctaStrength += 40;
      else if (linkCount > 4) {
        ctaStrength += 20;
        ctaTips.push("Too many links. Consolidate your CTAs to focus the reader's attention.");
      } else {
        ctaTips.push("Add at least one prominent link or call-to-action button.");
      }
      const ctaActionRegex =
        /\b(get|start|download|join|buy|try|sign|subscribe|unlock|launch|register)\b/i;
      const linkTexts = contentHtml.match(/>([^<]+)<\/a>/g) || [];
      const linkHasActionVerb = linkTexts.some((lt) => ctaActionRegex.test(lt));
      if (linkHasActionVerb) ctaStrength += 40;
      else if (linkCount > 0)
        ctaTips.push(
          "Make your CTA anchor text action-oriented (e.g. 'Get Started' instead of 'Click Here')."
        );
      const hasClosingLink = contentHtml
        .substring(Math.round(contentHtml.length * 0.8))
        .includes("</a>");
      const closingText = plainText
        .substring(Math.round(plainText.length * 0.8))
        .toLowerCase();
      if (hasClosingLink || closingText.includes("subscribe") || closingText.includes("join"))
        ctaStrength += 20;
      else ctaTips.push("Provide a final, clear next step or CTA in the conclusion.");
      ctaStrength = Math.min(100, ctaStrength);
    } else {
      ctaTips.push("Write some content to analyze CTA strength.");
    }

    // ── 6. Structure Quality ──
    let structureQuality = 0;
    const structTips: string[] = [];
    if (wordCount > 0) {
      if (h2Count >= 2) structureQuality += 35;
      else structTips.push("Add at least two H2 headings to divide your content logically.");
      const wordsPerHeading = headingCount > 0 ? wordCount / headingCount : wordCount;
      if (wordsPerHeading < 350 && headingCount > 0) structureQuality += 35;
      else if (headingCount > 0) {
        structureQuality += 20;
        structTips.push("Some sections are too long. Insert H3 sub-headings to break up large walls of text.");
      } else {
        structTips.push("Structure your article with headings so it is not a single giant block of text.");
      }
      let richCount = 0;
      if (contentHtml.includes("<strong>") || contentHtml.includes("<b>")) richCount++;
      if (contentHtml.includes("<em>") || contentHtml.includes("<i>")) richCount++;
      if (contentHtml.includes("<blockquote>")) richCount++;
      if (contentHtml.includes("<li>")) richCount++;
      structureQuality += richCount * 7.5;
      if (richCount < 2)
        structTips.push("Use formatting like bold text, italics, or blockquotes to emphasize key points.");
      structureQuality = Math.min(100, structureQuality);
    } else {
      structTips.push("Structure your content to analyze structure quality.");
    }

    // ── 7. Distribution Readiness ──
    let distributionReadiness = 0;
    const distTips: string[] = [];
    if (excerpt && excerpt.trim().length > 10) distributionReadiness += 30;
    else distTips.push("Write a short, engaging excerpt (meta description equivalent) in the sidebar.");
    if (featuredImage || bannerImage) distributionReadiness += 30;
    else distTips.push("Add a featured image or banner image to boost social sharing visual appeal.");
    if (tags && tags.length >= 2) distributionReadiness += 20;
    else if (tags && tags.length === 1) {
      distributionReadiness += 10;
      distTips.push("Add at least one more descriptive tag.");
    } else {
      distTips.push("Add at least 2 relevant tags for indexing and filtering.");
    }
    if (seo.focusKeyword && seo.metaTitle && seo.metaDescription) distributionReadiness += 20;
    else distTips.push("Complete all SEO metadata fields (focus keyword, title, description).");
    distributionReadiness = Math.min(100, distributionReadiness);

    return {
      seoScore, seoTips,
      readability, readTips,
      engagementLikelihood, engageTips,
      conversionStrength, convTips,
      ctaStrength, ctaTips,
      structureQuality, structTips,
      distributionReadiness, distTips,
      wordCount,
    };
  }, [contentHtml, title, excerpt, featuredImage, bannerImage, tags, seo]);

  // ── Overall goal-weighted health score ──
  const overallScore = useMemo(
    () =>
      calculateHealthScore(
        {
          seoScore: analysis.seoScore,
          readability: analysis.readability,
          engagementLikelihood: analysis.engagementLikelihood,
          conversionStrength: analysis.conversionStrength,
          ctaStrength: analysis.ctaStrength,
          structureQuality: analysis.structureQuality,
          distributionReadiness: analysis.distributionReadiness,
        },
        goal
      ),
    [analysis, goal]
  );

  // ── Build accordion items (direct children pattern — no wrapper FCs) ──
  const items = (() => {
    const arr: React.ReactElement[] = [];
    const b = (score: number) => getMetricBadge(score);

    arr.push(
      <AccordionItem
        key="seo"
        title={<AccordionTitle title="Search Ranking" {...b(analysis.seoScore)} />}
      >
        <SEOHealthContent score={analysis.seoScore} tips={analysis.seoTips} />
      </AccordionItem>
    );
    arr.push(
      <AccordionItem
        key="readability"
        title={<AccordionTitle title="Readability" {...b(analysis.readability)} />}
      >
        <ReadabilityContent score={analysis.readability} tips={analysis.readTips} />
      </AccordionItem>
    );
    arr.push(
      <AccordionItem
        key="engagement"
        title={<AccordionTitle title="Engagement" {...b(analysis.engagementLikelihood)} />}
      >
        <EngagementContent score={analysis.engagementLikelihood} tips={analysis.engageTips} />
      </AccordionItem>
    );
    arr.push(
      <AccordionItem
        key="structure"
        title={<AccordionTitle title="Structure" {...b(analysis.structureQuality)} />}
      >
        <StructureContent score={analysis.structureQuality} tips={analysis.structTips} />
      </AccordionItem>
    );
    arr.push(
      <AccordionItem
        key="conversion"
        title={<AccordionTitle title="Conversion" {...b(analysis.conversionStrength)} />}
      >
        <ConversionContent score={analysis.conversionStrength} tips={analysis.convTips} />
      </AccordionItem>
    );
    arr.push(
      <AccordionItem
        key="cta"
        title={<AccordionTitle title="Call to Action" {...b(analysis.ctaStrength)} />}
      >
        <CTAContent score={analysis.ctaStrength} tips={analysis.ctaTips} />
      </AccordionItem>
    );
    arr.push(
      <AccordionItem
        key="distribution"
        title={<AccordionTitle title="Publish Ready" {...b(analysis.distributionReadiness)} />}
      >
        <DistributionContent
          score={analysis.distributionReadiness}
          tips={analysis.distTips}
        />
      </AccordionItem>
    );
    return arr;
  })();

  return (
    <div className="space-y-4">
      <OverallHealthHeader overallScore={overallScore} goal={goal} />
      <Accordion
        variant="splitted"
        selectionMode="single"
        className="px-0"
        itemClasses={{
          base: "shadow-sm mb-3",
          title:
            "text-[10px] font-jetbrains-mono text-gray-700 uppercase tracking-widest font-bold",
          trigger: "px-0 py-2.5 hover:bg-black/[0.02]",
          content: "px-0 pb-3",
        }}
      >
        {items}
      </Accordion>
    </div>
  );
};

export default ContentHealthPanel;
