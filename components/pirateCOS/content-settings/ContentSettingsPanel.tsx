"use client";

import React, { useState } from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
import CosIcon from "@/components/pirateCOS/CosIcon";
import { getPostTypeConfig } from "@/lib/pirateCOS/postTypeConfig";
import {
  TitleOptimizerContent,
  ExcerptContent,
  getTitleOptimizerBadge,
  getExcerptBadge,
} from "./ContentSettingsSubComponents";
import {
  TagsContent,
  HashtagAssistantContent,
  getTagsBadge,
  getHashtagAssistantBadge,
} from "./ContentSettingsTags";

// ─── Types ───────────────────────────────────────────────────────────────────
interface EditorStats {
  words: number;
  characters: number;
  paragraphs: number;
  readTime: number;
}

interface SocialDestination {
  label: string;
  characterLimit: number;
  warningAt: number;
  suggestions: string[];
}

interface ContentSettingsPanelProps {
  // Post data
  postType: string;
  title: string;
  excerpt: string;
  tags: string[];
  editorStats: EditorStats;
  
  // Social post specific
  socialDestination?: "linkedin" | "x";
  onSocialDestinationChange?: (dest: "linkedin" | "x") => void;
  
  // Title optimizer
  titleInstructions?: string;
  titleSuggestions?: string[];
  isOptimizingTitle?: boolean;
  onTitleInstructionsChange?: (val: string) => void;
  onGenerateTitleSuggestions?: () => void;
  
  // Excerpt
  excerptInstructions?: string;
  showExcerptAIGuidelines?: boolean;
  suggestedExcerpt?: string;
  isGeneratingExcerpt?: boolean;
  onExcerptInstructionsChange?: (val: string) => void;
  onToggleExcerptAI?: () => void;
  onGenerateExcerpt?: () => void;
  onApplySuggestedExcerpt?: () => void;
  onDismissSuggestedExcerpt?: () => void;
  
  // Tags
  tagInput?: string;
  suggestedTags?: string[];
  isGeneratingTags?: boolean;
  onTagInputChange?: (val: string) => void;
  onAddTag?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveTag?: (tag: string) => void;
  onGenerateTags?: () => void;
  onAppendHashtag?: (tag: string) => void;
  
  // Callbacks
  onTitleChange: (val: string) => void;
  onExcerptChange: (val: string) => void;
  onTagsChange: (tags: string[]) => void;
  onDirtyChange: () => void;
  
  // Optional features to show/hide
  showAnalytics?: boolean;
  showTitleOptimizer?: boolean;
  showExcerpt?: boolean;
  showTags?: boolean;
  showProgressChecklist?: boolean;
  
  // Social destinations config
  socialDestinations?: Record<string, SocialDestination>;
}

// Helper component for accordion titles with badges
const AccordionTitle: React.FC<{ title: string; badge?: string; badgeColor?: string }> = ({ title, badge, badgeColor }) => (
  <div className="flex items-center gap-2">
    <span className="text-[10px] font-jetbrains-mono text-gray-700 uppercase tracking-widest font-bold">
      {title}
    </span>
    {badge && (
      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${badgeColor || "bg-blue-100 text-blue-700"}`}>
        {badge}
      </span>
    )}
  </div>
);

export const ContentSettingsPanel: React.FC<ContentSettingsPanelProps> = ({
  postType,
  title,
  excerpt,
  tags,
  editorStats,
  socialDestination = "linkedin",
  onSocialDestinationChange,
  titleInstructions = "",
  titleSuggestions = [],
  isOptimizingTitle = false,
  onTitleInstructionsChange,
  onGenerateTitleSuggestions,
  excerptInstructions = "",
  showExcerptAIGuidelines = false,
  suggestedExcerpt = "",
  isGeneratingExcerpt = false,
  onExcerptInstructionsChange,
  onToggleExcerptAI,
  onGenerateExcerpt,
  onApplySuggestedExcerpt,
  onDismissSuggestedExcerpt,
  tagInput = "",
  suggestedTags = [],
  isGeneratingTags = false,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onGenerateTags,
  onAppendHashtag,
  onTitleChange,
  onExcerptChange,
  onTagsChange,
  onDirtyChange,
  showAnalytics = true,
  showTitleOptimizer = true,
  showExcerpt = true,
  showTags = true,
  showProgressChecklist = true,
  socialDestinations,
}) => {
  const isSocialPost = postType === "social-post";
  
  // Calculate completion status
  const completionStatus = (() => {
    const ptConfig = getPostTypeConfig(postType);
    const minGoal = ptConfig?.minWordCount ?? 500;
    const hasTitle = title.trim().length > 0;
    const hasContent = editorStats.words >= minGoal;
    const hasExcerpt = isSocialPost || excerpt.trim().length >= 120;
    const hasTags = tags.length >= 3;
    
    const completed = [hasTitle, hasContent, hasExcerpt, hasTags].filter(Boolean).length;
    const total = 4;
    const percentage = Math.round((completed / total) * 100);
    
    return { completed, total, percentage, hasTitle, hasContent, hasExcerpt, hasTags };
  })();

  const SOCIAL_DESTINATIONS = socialDestinations || {
    linkedin: {
      label: "LinkedIn",
      characterLimit: 3000,
      warningAt: 2700,
      suggestions: ["#linkedin", "#professional", "#career", "#business", "#networking"],
    },
    x: {
      label: "X (Twitter)",
      characterLimit: 280,
      warningAt: 260,
      suggestions: ["#tech", "#startup", "#ai", "#webdev", "#coding"],
    },
  };

  return (
    <>
      {/* Content Progress Checklist */}
      {showProgressChecklist && editorStats.words > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CosIcon name="check" size={14} className="text-blue-500" />
              <p className="text-xs font-bold text-gray-800">Content Checklist</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
              completionStatus.percentage === 100
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}>
              {completionStatus.completed}/{completionStatus.total} Complete
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${completionStatus.percentage}%` }}
            />
          </div>

          {/* Quick checklist */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className={`flex items-center gap-1.5 ${completionStatus.hasTitle ? "text-green-600" : "text-gray-400"}`}>
              <CosIcon name={completionStatus.hasTitle ? "check" : "circle"} size={10} />
              <span>Title</span>
            </div>
            <div className={`flex items-center gap-1.5 ${completionStatus.hasContent ? "text-green-600" : "text-gray-400"}`}>
              <CosIcon name={completionStatus.hasContent ? "check" : "circle"} size={10} />
              <span>Content</span>
            </div>
            <div className={`flex items-center gap-1.5 ${completionStatus.hasExcerpt ? "text-green-600" : "text-gray-400"}`}>
              <CosIcon name={completionStatus.hasExcerpt ? "check" : "circle"} size={10} />
              <span>{isSocialPost ? "Message" : "Excerpt"}</span>
            </div>
            <div className={`flex items-center gap-1.5 ${completionStatus.hasTags ? "text-green-600" : "text-gray-400"}`}>
              <CosIcon name={completionStatus.hasTags ? "check" : "circle"} size={10} />
              <span>{isSocialPost ? "Hashtags" : "Tags"} (3+)</span>
            </div>
          </div>

          {completionStatus.percentage === 100 && (
            <div className="mt-3 pt-3 border-t border-blue-200/50 text-center">
              <p className="text-xs font-semibold text-green-600 flex items-center justify-center gap-1.5">
                🎉 Ready to publish!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Unified Accordion for all settings */}
      {(() => {
        const items: React.ReactElement[] = [];

        if (showAnalytics) {
          if (isSocialPost) {
            items.push(
              <AccordionItem
                key="guardrails"
                title={
                  <AccordionTitle
                    title="Feed Guardrails"
                    badge={SOCIAL_DESTINATIONS[socialDestination].label}
                    badgeColor="bg-[#FF5B04]/10 text-[#FF5B04]"
                  />
                }
              >
                <div className="space-y-4">
                  {onSocialDestinationChange && (
                    <div className="flex bg-black/5 p-1 rounded-xl">
                      {(["linkedin", "x"] as const).map((dest) => (
                        <button
                          key={dest}
                          type="button"
                          onClick={() => onSocialDestinationChange(dest)}
                          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                            socialDestination === dest
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-500 hover:text-gray-800"
                          }`}
                        >
                          <CosIcon name={dest === "linkedin" ? "linkedin" : "twitter"} size={12} />
                          {SOCIAL_DESTINATIONS[dest].label}
                        </button>
                      ))}
                    </div>
                  )}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-geist text-gray-500 font-medium">Characters</span>
                      <span className={`text-[10px] font-jetbrains-mono font-semibold ${
                        editorStats.characters > SOCIAL_DESTINATIONS[socialDestination].characterLimit
                          ? "text-red-500 font-bold"
                          : editorStats.characters >= SOCIAL_DESTINATIONS[socialDestination].warningAt
                          ? "text-amber-500"
                          : "text-gray-400"
                      }`}>
                        {editorStats.characters} / {SOCIAL_DESTINATIONS[socialDestination].characterLimit}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          editorStats.characters > SOCIAL_DESTINATIONS[socialDestination].characterLimit
                            ? "bg-red-500"
                            : editorStats.characters >= SOCIAL_DESTINATIONS[socialDestination].warningAt
                            ? "bg-amber-500"
                            : "bg-[#FF5B04]"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            (editorStats.characters / SOCIAL_DESTINATIONS[socialDestination].characterLimit) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </AccordionItem>
            );
          } else {
            const analyticsBadge = getAnalyticsBadge(editorStats, postType);
            items.push(
              <AccordionItem
                key="analytics"
                title={<AccordionTitle title="Analytics" badge={analyticsBadge.badge} badgeColor={analyticsBadge.badgeColor} />}
              >
                <AnalyticsContent editorStats={editorStats} postType={postType} />
              </AccordionItem>
            );
          }
        }

        if (showTitleOptimizer) {
          const titleBadge = getTitleOptimizerBadge(title);
          items.push(
            <AccordionItem
              key="title"
              title={<AccordionTitle title="AI Title Optimizer" badge={titleBadge.badge} badgeColor={titleBadge.badgeColor} />}
            >
              <TitleOptimizerContent
                title={title}
                titleInstructions={titleInstructions}
                titleSuggestions={titleSuggestions}
                isOptimizingTitle={isOptimizingTitle}
                onTitleInstructionsChange={onTitleInstructionsChange}
                onGenerateTitleSuggestions={onGenerateTitleSuggestions}
                onTitleChange={onTitleChange}
                onDirtyChange={onDirtyChange}
              />
            </AccordionItem>
          );
        }

        if (showExcerpt && !isSocialPost) {
          const excerptBadge = getExcerptBadge(excerpt);
          items.push(
            <AccordionItem
              key="excerpt"
              title={<AccordionTitle title="Excerpt" badge={excerptBadge.badge} badgeColor={excerptBadge.badgeColor} />}
            >
              <ExcerptContent
                excerpt={excerpt}
                excerptInstructions={excerptInstructions}
                showExcerptAIGuidelines={showExcerptAIGuidelines}
                suggestedExcerpt={suggestedExcerpt}
                isGeneratingExcerpt={isGeneratingExcerpt}
                onExcerptChange={onExcerptChange}
                onExcerptInstructionsChange={onExcerptInstructionsChange}
                onToggleExcerptAI={onToggleExcerptAI}
                onGenerateExcerpt={onGenerateExcerpt}
                onApplySuggestedExcerpt={onApplySuggestedExcerpt}
                onDismissSuggestedExcerpt={onDismissSuggestedExcerpt}
                onDirtyChange={onDirtyChange}
              />
            </AccordionItem>
          );
        }

        if (showTags) {
          if (isSocialPost) {
            const hashtagBadge = getHashtagAssistantBadge(tags);
            items.push(
              <AccordionItem
                key="hashtags"
                title={<AccordionTitle title="Hashtag Assistant" badge={hashtagBadge.badge} badgeColor={hashtagBadge.badgeColor} />}
              >
                <HashtagAssistantContent
                  tags={tags}
                  tagInput={tagInput}
                  socialDestination={socialDestination}
                  socialDestinations={SOCIAL_DESTINATIONS}
                  onTagInputChange={onTagInputChange}
                  onAddTag={onAddTag}
                  onRemoveTag={onRemoveTag}
                  onAppendHashtag={onAppendHashtag}
                  onDirtyChange={onDirtyChange}
                />
              </AccordionItem>
            );
          } else {
            const tagsBadge = getTagsBadge(tags);
            items.push(
              <AccordionItem
                key="tags"
                title={<AccordionTitle title="Tags" badge={tagsBadge.badge} badgeColor={tagsBadge.badgeColor} />}
              >
                <TagsContent
                  tags={tags}
                  tagInput={tagInput}
                  suggestedTags={suggestedTags}
                  isGeneratingTags={isGeneratingTags}
                  onTagInputChange={onTagInputChange}
                  onAddTag={onAddTag}
                  onRemoveTag={onRemoveTag}
                  onGenerateTags={onGenerateTags}
                  onTagsChange={onTagsChange}
                  onDirtyChange={onDirtyChange}
                />
              </AccordionItem>
            );
          }
        }

        if (items.length === 0) return null;

        return (
          <Accordion
            variant="splitted"
            selectionMode="single"
            defaultExpandedKeys={showAnalytics ? (isSocialPost ? ["guardrails"] : ["analytics"]) : []}
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
        );
      })()}
    </>
  );
};

// ─── Sub-Components ──────────────────────────────────────────────────────────

interface AnalyticsCardProps {
  editorStats: EditorStats;
  postType: string;
}

const getAnalyticsBadge = (editorStats: EditorStats, postType: string) => {
  const ptConfig = getPostTypeConfig(postType);
  const minGoal = ptConfig?.minWordCount ?? 500;
  const progress = (editorStats.words / minGoal) * 100;
  const status = progress >= 100 ? "complete" : progress >= 50 ? "progress" : "start";
  return {
    badge: status === "complete" ? "Complete" : status === "progress" ? "In Progress" : "Getting Started",
    badgeColor: status === "complete"
      ? "bg-green-100 text-green-700"
      : status === "progress"
      ? "bg-amber-100 text-amber-700"
      : "bg-gray-100 text-gray-500",
  };
};

const AnalyticsContent: React.FC<AnalyticsCardProps> = ({ editorStats, postType }) => {
  const ptConfig = getPostTypeConfig(postType);
  const minGoal = ptConfig?.minWordCount ?? 500;
  const maxGoal = ptConfig?.maxWordCount ?? 1500;

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-black/[0.02] rounded-xl p-3 border border-black/5 hover:border-black/10 transition-all group">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-geist text-gray-900 group-hover:text-[#FF5B04] transition-colors">
              {editorStats.words}
            </div>
            {editorStats.words > 0 && (
              <svg className="text-green-500 opacity-60" fill="none" height="12" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="12">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              </svg>
            )}
          </div>
          <div className="text-[9px] font-jetbrains-mono uppercase text-gray-400 tracking-wider mt-1">
            Words
          </div>
        </div>

        <div className="bg-black/[0.02] rounded-xl p-3 border border-black/5 hover:border-black/10 transition-all group">
          <div className="text-2xl font-bold font-geist text-gray-900 group-hover:text-[#FF5B04] transition-colors">
            {editorStats.characters}
          </div>
          <div className="text-[9px] font-jetbrains-mono uppercase text-gray-400 tracking-wider mt-1">
            Characters
          </div>
        </div>

        <div className="bg-black/[0.02] rounded-xl p-3 border border-black/5 hover:border-black/10 transition-all group">
          <div className="text-2xl font-bold font-geist text-gray-900 group-hover:text-[#FF5B04] transition-colors">
            {editorStats.paragraphs}
          </div>
          <div className="text-[9px] font-jetbrains-mono uppercase text-gray-400 tracking-wider mt-1">
            Paragraphs
          </div>
        </div>

        <div className="bg-black/[0.02] rounded-xl p-3 border border-black/5 hover:border-black/10 transition-all group relative overflow-hidden">
          <div className="text-2xl font-bold font-geist text-[#FF5B04]">
            {editorStats.readTime} min
          </div>
          <div className="text-[9px] font-jetbrains-mono uppercase text-gray-400 tracking-wider mt-1">
            Read Time
          </div>
          {editorStats.readTime >= 5 && (
            <div className="absolute top-1 right-1">
              <CosIcon name="check" size={10} className="text-green-500" />
            </div>
          )}
        </div>
      </div>

        {/* Writing Goal Progress */}
        <div className="mt-3.5 pt-3 border-t border-black/5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-geist text-gray-500 font-medium">
              Writing Goal
            </span>
            <span className="text-[10px] font-jetbrains-mono text-gray-400 font-semibold">
              {Math.min(100, Math.round((editorStats.words / minGoal) * 100))}% ({editorStats.words} / {minGoal}–{maxGoal} words)
            </span>
          </div>
          <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(100, (editorStats.words / minGoal) * 100)}%`,
                background: "#FF5B04",
              }}
            />
          </div>
        </div>
    </>
  );
};
