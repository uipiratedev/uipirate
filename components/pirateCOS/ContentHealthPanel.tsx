import React, { useState, useMemo } from "react";
import {
  ContentGoal,
  getGoalConfig,
  getPostTypeConfig,
  calculateHealthScore,
} from "@/lib/pirateCOS/postTypeConfig";
import CosIcon from "./CosIcon";

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

interface MetricDetails {
  name: string;
  score: number;
  description: string;
  tips: string[];
}

export default function ContentHealthPanel({
  contentHtml = "",
  title = "",
  excerpt = "",
  featuredImage = "",
  bannerImage = "",
  tags = [],
  seo = {},
  postType,
  goal,
}: ContentHealthPanelProps) {
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  // ─── Real-Time Text Analysis ───
  const analysis = useMemo(() => {
    // 1. Basic text stats
    const tempDiv = typeof document !== "undefined" ? document.createElement("div") : null;
    if (tempDiv) {
      tempDiv.innerHTML = contentHtml;
    }
    const plainText = tempDiv?.textContent || tempDiv?.innerText || "";
    const words = plainText.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Sentence count
    const sentences = plainText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const sentenceCount = sentences.length;
    const wordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;

    // Paragraphs
    const paragraphs = contentHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
    const paragraphCount = paragraphs.length;
    const wordsPerParagraph = paragraphCount > 0 ? wordCount / paragraphCount : 0;

    // Headings
    const h1Count = (contentHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || []).length;
    const h2Count = (contentHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || []).length;
    const h3Count = (contentHtml.match(/<h3[^>]*>([\s\S]*?)<\/h3>/gi) || []).length;
    const headingCount = h2Count + h3Count;

    // Links & CTAs
    const links = contentHtml.match(/<a[^>]* href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi) || [];
    const linkCount = links.length;

    // 2. SEO Score Calculation
    let seoScore = 0;
    const seoTips: string[] = [];
    const focusKeyword = seo.focusKeyword?.trim().toLowerCase();

    if (focusKeyword) {
      const keywordInTitle = title.toLowerCase().includes(focusKeyword);
      const keywordInIntro = plainText.substring(0, 500).toLowerCase().includes(focusKeyword);
      const keywordInHeadings = contentHtml.toLowerCase().includes(`<h2`) && contentHtml.toLowerCase().includes(focusKeyword);
      
      // Density
      const keywordOccurrences = (plainText.toLowerCase().match(new RegExp(focusKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
      const density = wordCount > 0 ? (keywordOccurrences / wordCount) * 100 : 0;
      const goodDensity = density >= 0.5 && density <= 2.5;

      if (keywordInTitle) {
        seoScore += 15;
      } else {
        seoTips.push(`Add your focus keyword "${seo.focusKeyword}" to your post title.`);
      }

      if (keywordInIntro) {
        seoScore += 15;
      } else {
        seoTips.push("Include your focus keyword in the introductory paragraph.");
      }

      if (keywordInHeadings) {
        seoScore += 10;
      } else {
        seoTips.push("Use the focus keyword in at least one H2 or H3 heading.");
      }

      if (goodDensity) {
        seoScore += 10;
      } else if (density > 0) {
        seoTips.push(`Keyword density is ${density.toFixed(1)}%. Aim for 0.5%–2.5% (current occurrences: ${keywordOccurrences}).`);
      } else {
        seoTips.push("Integrate the focus keyword naturally throughout the body content.");
      }
    } else {
      seoTips.push("Set a Focus Keyword in the SEO tab to unlock detailed SEO scoring.");
    }

    if (seo.metaTitle) {
      seoScore += 20;
    } else {
      seoTips.push("Add a meta title in the SEO tab.");
    }

    if (seo.metaDescription) {
      seoScore += 20;
    } else {
      seoTips.push("Add a meta description in the SEO tab.");
    }

    if (headingCount > 0) {
      seoScore += 10;
    } else {
      seoTips.push("Add H2 headings to organize content and improve crawlability.");
    }
    seoScore = Math.min(100, seoScore);

    // 3. Readability Score Calculation
    let readability = 0;
    const readTips: string[] = [];

    if (wordCount > 0) {
      if (wordsPerSentence > 0 && wordsPerSentence < 16) {
        readability += 40;
      } else if (wordsPerSentence >= 16 && wordsPerSentence <= 22) {
        readability += 30;
        readTips.push("Some sentences are long. Try breaking them into shorter, punchier thoughts.");
      } else {
        readability += 15;
        readTips.push("High average sentence length. Keep sentences under 15 words for maximum readability.");
      }

      if (wordsPerParagraph > 0 && wordsPerParagraph < 65) {
        readability += 30;
      } else if (wordsPerParagraph >= 65 && wordsPerParagraph <= 100) {
        readability += 20;
        readTips.push("Paragraphs are a bit dense. Aim for 2-3 sentences per paragraph.");
      } else {
        readability += 10;
        readTips.push("Paragraphs are too blocky. Add line breaks to create breathing room.");
      }

      const hasLists = contentHtml.includes("<li>");
      if (hasLists) {
        readability += 30;
      } else {
        readability += 10;
        readTips.push("Use bullet points or numbered lists to make the content scannable.");
      }
      readability = Math.min(100, readability);
    } else {
      readTips.push("Write some content in the editor to calculate readability.");
    }

    // 4. Engagement Likelihood
    let engagementLikelihood = 0;
    const engageTips: string[] = [];

    if (wordCount > 0) {
      // Hook detection (first 250 characters)
      const introText = plainText.substring(0, 250).toLowerCase();
      const hasHookWord = /\b(how|why|secret|reveal|ultimate|surprising|learn|discover|bootstrap|mistake|avoid|boost|grow|proven|guide)\b/.test(introText);
      const hasNumber = /\b\d+\b/.test(introText);
      const hasIntroQuestion = introText.includes("?");

      if (hasHookWord || hasNumber || hasIntroQuestion) {
        engagementLikelihood += 40;
      } else {
        engageTips.push("Start with an attention-grabbing hook: ask a question, share a stat, or use powerful action verbs.");
      }

      // Question count
      const totalQuestions = (plainText.match(/\?/g) || []).length;
      if (totalQuestions >= 2) {
        engagementLikelihood += 30;
      } else if (totalQuestions === 1) {
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

    // 5. Conversion Strength
    let conversionStrength = 0;
    const convTips: string[] = [];

    if (wordCount > 0) {
      // Benefit language (you/your vs we/I)
      const textLower = plainText.toLowerCase();
      const youCount = (textLower.match(/\b(you|your|yours)\b/g) || []).length;
      const weCount = (textLower.match(/\b(we|i|our|us|my|me)\b/g) || []).length;

      if (youCount > weCount && youCount > 0) {
        conversionStrength += 35;
      } else {
        convTips.push("Shift language to be reader-centric. Use 'you' and 'your' more than 'we' or 'I'.");
      }

      // Benefit verbs / value words
      const benefitCount = (textLower.match(/\b(save|boost|improve|grow|free|easy|guarantee|increase|reduce|efficient|solve|transform)\b/g) || []).length;
      if (benefitCount >= 3) {
        conversionStrength += 35;
      } else {
        convTips.push("Incorporate benefit-driven terms (e.g. 'save', 'grow', 'improve') to articulate value.");
      }

      // Check for CTA buttons/links or styled boxes
      const hasCTA = linkCount > 0 || contentHtml.includes("cta-block") || contentHtml.includes("border-orange-500");
      if (hasCTA) {
        conversionStrength += 30;
      } else {
        convTips.push("Insert a clear CTA button or high-contrast box promoting your primary action.");
      }
      conversionStrength = Math.min(100, conversionStrength);
    } else {
      convTips.push("Write some content to analyze conversion strength.");
    }

    // 6. CTA Strength
    let ctaStrength = 0;
    const ctaTips: string[] = [];

    if (wordCount > 0) {
      if (linkCount >= 1 && linkCount <= 4) {
        ctaStrength += 40;
      } else if (linkCount > 4) {
        ctaStrength += 20;
        ctaTips.push("Too many links. Consolidate your call-to-actions to focus the reader's attention.");
      } else {
        ctaTips.push("Add at least one prominent link or call-to-action button.");
      }

      // Action verbs in link text
      let linkHasActionVerb = false;
      const ctaActionRegex = /\b(get|start|download|join|buy|try|sign|subscribe|unlock|launch|register)\b/i;
      const linkTexts = contentHtml.match(/>([^<]+)<\/a>/g) || [];
      for (const lt of linkTexts) {
        if (ctaActionRegex.test(lt)) {
          linkHasActionVerb = true;
          break;
        }
      }

      if (linkHasActionVerb) {
        ctaStrength += 40;
      } else if (linkCount > 0) {
        ctaTips.push("Make your CTA link anchor text action-oriented (e.g. 'Get Started' instead of 'Click Here').");
      }

      // Closing CTA (in last 20% of text)
      const closingText = plainText.substring(Math.round(plainText.length * 0.8)).toLowerCase();
      const hasClosingLink = contentHtml.substring(Math.round(contentHtml.length * 0.8)).includes("</a>");
      if (hasClosingLink || closingText.includes("subscribe") || closingText.includes("join")) {
        ctaStrength += 20;
      } else {
        ctaTips.push("Provide a final, clear next step or call-to-action in the conclusion.");
      }
      ctaStrength = Math.min(100, ctaStrength);
    } else {
      ctaTips.push("Write some content to analyze CTA strength.");
    }

    // 7. Structure Quality
    let structureQuality = 0;
    const structTips: string[] = [];

    if (wordCount > 0) {
      if (h2Count >= 2) {
        structureQuality += 35;
      } else {
        structTips.push("Add at least two H2 headings to divide your content logically.");
      }

      // Balance (under 350 words per section)
      const wordsPerHeading = headingCount > 0 ? wordCount / headingCount : wordCount;
      if (wordsPerHeading < 350 && headingCount > 0) {
        structureQuality += 35;
      } else if (headingCount > 0) {
        structureQuality += 20;
        structTips.push("Some sections are too long. Insert H3 sub-headings to break up large walls of text.");
      } else {
        structTips.push("Structure your article with headings so it is not a single giant block of text.");
      }

      // Rich styling
      let richCount = 0;
      if (contentHtml.includes("<strong>") || contentHtml.includes("<b>")) richCount++;
      if (contentHtml.includes("<em>") || contentHtml.includes("<i>")) richCount++;
      if (contentHtml.includes("<blockquote>")) richCount++;
      if (contentHtml.includes("<li>")) richCount++;

      structureQuality += richCount * 7.5; // Up to 30 points
      if (richCount < 2) {
        structTips.push("Use formatting like bold text, italics, or blockquotes to emphasize key points.");
      }
      structureQuality = Math.min(100, structureQuality);
    } else {
      structTips.push("Structure your content to analyze structure quality.");
    }

    // 8. Distribution Readiness
    let distributionReadiness = 0;
    const distTips: string[] = [];

    if (excerpt && excerpt.trim().length > 10) {
      distributionReadiness += 30;
    } else {
      distTips.push("Write a short, engaging excerpt (meta description equivalent) in the sidebar.");
    }

    if (featuredImage || bannerImage) {
      distributionReadiness += 30;
    } else {
      distTips.push("Add a featured image or banner image to boost social sharing visual appeal.");
    }

    if (tags && tags.length >= 2) {
      distributionReadiness += 20;
    } else if (tags && tags.length === 1) {
      distributionReadiness += 10;
      distTips.push("Add at least one more descriptive tag.");
    } else {
      distTips.push("Add at least 2 relevant tags for indexing and filtering.");
    }

    if (seo.focusKeyword && seo.metaTitle && seo.metaDescription) {
      distributionReadiness += 20;
    } else {
      distTips.push("Complete all SEO metadata fields (focus keyword, title, description).");
    }
    distributionReadiness = Math.min(100, distributionReadiness);

    return {
      seoScore,
      seoTips,
      readability,
      readTips,
      engagementLikelihood,
      engageTips,
      conversionStrength,
      convTips,
      ctaStrength,
      ctaTips,
      structureQuality,
      structTips,
      distributionReadiness,
      distTips,
      wordCount,
    };
  }, [contentHtml, title, excerpt, featuredImage, bannerImage, tags, seo]);

  // Overall goal-weighted health score
  const rawScores = {
    seoScore: analysis.seoScore,
    readability: analysis.readability,
    engagementLikelihood: analysis.engagementLikelihood,
    conversionStrength: analysis.conversionStrength,
    ctaStrength: analysis.ctaStrength,
    structureQuality: analysis.structureQuality,
    distributionReadiness: analysis.distributionReadiness,
  };

  const overallScore = useMemo(() => {
    return calculateHealthScore(rawScores, goal);
  }, [rawScores, goal]);

  const goalConfig = getGoalConfig(goal);
  const typeConfig = getPostTypeConfig(postType);

  const getScoreColor = (score: number) => {
    if (score <= 40) return "#ef4444"; // red
    if (score <= 70) return "#f59e0b"; // amber
    return "#10b981"; // green
  };

  const metrics: MetricDetails[] = [
    {
      name: "SEO Optimization",
      score: analysis.seoScore,
      description: "How well optimized this post is for organic search and keywords.",
      tips: analysis.seoTips,
    },
    {
      name: "Readability & Scannability",
      score: analysis.readability,
      description: "Structure of sentences, paragraphs, and list items for easy reading.",
      tips: analysis.readTips,
    },
    {
      name: "Engagement Likelihood",
      score: analysis.engagementLikelihood,
      description: "Hook strength, questions, and conversational elements.",
      tips: analysis.engageTips,
    },
    {
      name: "Conversion Strength",
      score: analysis.conversionStrength,
      description: "Reader-centric language and benefit-oriented vocabulary.",
      tips: analysis.convTips,
    },
    {
      name: "CTA Clear Placement",
      score: analysis.ctaStrength,
      description: "Compelling call-to-actions, action-verbs, and layout density.",
      tips: analysis.ctaTips,
    },
    {
      name: "Structure Quality",
      score: analysis.structureQuality,
      description: "Use of diverse heading hierarchies and markdown formatting elements.",
      tips: analysis.structTips,
    },
    {
      name: "Distribution Readiness",
      score: analysis.distributionReadiness,
      description: "Checking if meta assets (tags, image, excerpt) are complete.",
      tips: analysis.distTips,
    },
  ];

  return (
    <div className="space-y-4">
      {/* ── Overall Score Circle ── */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 flex flex-col items-center text-center">
        <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-4">
          Content Health Dashboard
        </p>

        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              className="text-gray-100"
              cx="50"
              cy="50"
              fill="transparent"
              r="42"
              stroke="currentColor"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              fill="transparent"
              r="42"
              stroke={getScoreColor(overallScore)}
              strokeDasharray={263.89}
              strokeDashoffset={263.89 - (263.89 * overallScore) / 100}
              strokeLinecap="round"
              strokeWidth="8"
              style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-extrabold text-gray-900 font-geist">
              {overallScore}
            </span>
            <span className="text-[9px] font-jetbrains-mono text-gray-400 uppercase tracking-wider mt-0.5">
              Health
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center">
          <div className="flex items-center gap-1.5 bg-orange-50 text-[#FF5B04] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            {goalConfig?.icon && <CosIcon name={goalConfig.icon} size={14} className="text-[#FF5B04]" />}
            <span>Goal: {goalConfig?.label}</span>
          </div>
          <p className="text-xs text-gray-400 font-geist text-center mt-2 px-2">
            AI is prioritizing: <span className="font-medium text-gray-600">"{goalConfig?.description}"</span>
          </p>
        </div>
      </div>

      {/* ── Metric Details List ── */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 space-y-3.5">
        <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest">
          Score Breakdown
        </p>

        <div className="space-y-3">
          {metrics.map((m) => {
            const isExpanded = expandedMetric === m.name;
            const weight = goalConfig?.healthWeights[
              m.name === "SEO Optimization" ? "seoScore" :
              m.name === "Readability & Scannability" ? "readability" :
              m.name === "Engagement Likelihood" ? "engagementLikelihood" :
              m.name === "Conversion Strength" ? "conversionStrength" :
              m.name === "CTA Clear Placement" ? "ctaStrength" :
              m.name === "Structure Quality" ? "structureQuality" :
              "distributionReadiness"
            ] || 0.5;

            return (
              <div
                key={m.name}
                className="border border-black/[0.03] rounded-xl p-2.5 hover:bg-black/[0.01] transition-all cursor-pointer"
                onClick={() => setExpandedMetric(isExpanded ? null : m.name)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold font-geist text-gray-800">
                      {m.name}
                    </span>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full bg-black/5 font-jetbrains-mono text-gray-400 font-medium"
                      title="Importance weight for your active goal"
                    >
                      w:{weight}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold font-geist"
                    style={{ color: getScoreColor(m.score) }}
                  >
                    {m.score}/100
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-black/[0.04] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${m.score}%`,
                      backgroundColor: getScoreColor(m.score),
                    }}
                  />
                </div>

                {/* Expanded Details & Tips */}
                {isExpanded && (
                  <div className="mt-3 space-y-2 border-t border-black/5 pt-2 text-xs font-geist animate-in slide-in-from-top-1 duration-150">
                    <p className="text-gray-500 italic leading-snug">{m.description}</p>
                    {m.tips.length > 0 ? (
                      <div className="space-y-1.5 mt-2">
                        <p className="font-bold text-gray-700 text-[10px] uppercase tracking-wider">
                          Recommendations to Improve:
                        </p>
                        <ul className="space-y-1.5 pl-3 list-disc text-gray-600">
                          {m.tips.map((t, idx) => (
                            <li key={idx} className="leading-snug">
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-green-600 font-semibold flex items-center gap-1 mt-1 text-[10px] uppercase tracking-wider">
                        <CosIcon name="sparkles" size={12} className="text-green-600" /> Perfect! No recommendations. Keep it up!
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Word Count Guide ── */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
        <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-2.5">
          Read Time & Word Count
        </p>
        <div className="flex items-center justify-between text-xs font-geist">
          <div>
            <p className="text-gray-500">Current Word Count</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">
              {analysis.wordCount} words
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">Target Range</p>
            <p className="text-sm font-semibold text-gray-700 mt-1">
              {typeConfig ? `${typeConfig.minWordCount} – ${typeConfig.maxWordCount} words` : "600 – 1500 words"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
