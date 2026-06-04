"use client";

import React from "react";
import CosIcon from "@/components/pirateCOS/CosIcon";
import { ContentGoal, getGoalConfig } from "@/lib/pirateCOS/postTypeConfig";

// ─── Score Color & Badge Utilities ───────────────────────────────────────────

export const getScoreColor = (score: number): string =>
  score <= 40 ? "#ef4444" : score <= 70 ? "#f59e0b" : "#10b981";

const scoreClasses = (score: number): string =>
  score > 70
    ? "bg-green-50 text-green-600"
    : score > 40
    ? "bg-amber-50 text-amber-600"
    : "bg-red-50 text-red-600";

export const getMetricBadge = (score: number) => ({
  badge: `${score}/100`,
  badgeColor: scoreClasses(score),
});

// Named badge helper aliases
export const getSEOHealthBadge = getMetricBadge;
export const getReadabilityBadge = getMetricBadge;
export const getEngagementBadge = getMetricBadge;
export const getStructureBadge = getMetricBadge;
export const getConversionBadge = getMetricBadge;
export const getCTABadge = getMetricBadge;
export const getDistributionBadge = getMetricBadge;

// ─── MetricContent ────────────────────────────────────────────────────────────

interface MetricContentProps {
  score: number;
  description: string;
  tips: string[];
}

export const MetricContent: React.FC<MetricContentProps> = ({ score, description, tips }) => {
  const color = getScoreColor(score);
  const scoreLabel = score > 70 ? "Good" : score > 40 ? "Fair" : "Needs Work";
  const badgeClasses =
    score > 70
      ? "bg-green-50 text-green-700"
      : score > 40
      ? "bg-amber-50 text-amber-700"
      : "bg-red-50 text-red-600";

  return (
    <div className="px-0 pb-1 space-y-3">
      {/* Progress bar + score badge */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-black/[0.04] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${score}%`, backgroundColor: color }}
          />
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 font-jetbrains-mono ${badgeClasses}`}
        >
          {score}/100 · {scoreLabel}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs font-geist text-gray-400 leading-snug">{description}</p>

      {/* Tips or success state */}
      {tips.length > 0 ? (
        <div className="space-y-1.5 pt-2 border-t border-black/5">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-jetbrains-mono">
            How to improve
          </p>
          <div className="space-y-1.5">
            {tips.map((t, i) => (
              <div
                key={i}
                className="flex items-start gap-2 bg-black/[0.02] rounded-xl px-2.5 py-2"
              >
                <span className="text-[#FF5B04] font-bold text-xs mt-px shrink-0">›</span>
                <p className="text-xs font-geist text-gray-600 leading-snug">{t}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2.5">
          <CosIcon name="sparkles" size={12} className="text-green-500 shrink-0" />
          <p className="text-xs font-geist text-green-700 font-semibold">
            Looks great — no improvements needed!
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Named Content Components ─────────────────────────────────────────────────

type MetricProps = { score: number; tips: string[] };

const mkMetric = (description: string): React.FC<MetricProps> =>
  function MetricWrapper({ score, tips }) {
    return <MetricContent score={score} description={description} tips={tips} />;
  };

export const SEOHealthContent = mkMetric(
  "How well this post is optimized to appear in Google search results."
);
export const ReadabilityContent = mkMetric(
  "Sentence length, paragraph size, and use of lists for easy skimming."
);
export const EngagementContent = mkMetric(
  "How well the opening hook, questions, and tone draw readers in."
);
export const StructureContent = mkMetric(
  "Use of headings, bold text, quotes, and lists to organize content."
);
export const ConversionContent = mkMetric(
  "Reader-centric language and benefit-driven vocabulary."
);
export const CTAContent = mkMetric(
  "Whether there's a clear, compelling next step for the reader."
);
export const DistributionContent = mkMetric(
  "Whether meta assets (image, excerpt, tags, and SEO metadata) are all complete."
);

// ─── Overall Health Header ────────────────────────────────────────────────────

interface OverallHealthHeaderProps {
  overallScore: number;
  goal: ContentGoal;
}

const CIRCUMFERENCE = 263.89;

export const OverallHealthHeader: React.FC<OverallHealthHeaderProps> = ({ overallScore, goal }) => {
  const goalConfig = getGoalConfig(goal);
  const color = getScoreColor(overallScore);
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 flex flex-col items-center text-center">
      <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-4">
        Content Health Dashboard
      </p>

      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-gray-100"
            cx="50" cy="50" fill="transparent" r="42"
            stroke="currentColor" strokeWidth="8"
          />
          <circle
            cx="50" cy="50" fill="transparent" r="42"
            stroke={color}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE - (CIRCUMFERENCE * overallScore) / 100}
            strokeLinecap="round" strokeWidth="8"
            style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-extrabold text-gray-900 font-geist">{overallScore}</span>
          <span className="text-[9px] font-jetbrains-mono text-gray-400 uppercase tracking-wider mt-0.5">
            Health
          </span>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center">
        <div className="flex items-center gap-1.5 bg-orange-50 text-[#FF5B04] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          {goalConfig?.icon && (
            <CosIcon name={goalConfig.icon} size={14} className="text-[#FF5B04]" />
          )}
          <span>Goal: {goalConfig?.label}</span>
        </div>
        <p className="text-xs text-gray-400 font-geist text-center mt-2 px-2">
          AI is prioritizing:{" "}
          <span className="font-medium text-gray-600">"{goalConfig?.description}"</span>
        </p>
      </div>
    </div>
  );
};
