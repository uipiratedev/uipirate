"use client";

import React from "react";
import CosIcon from "@/components/pirateCOS/CosIcon";

// ─── Badge helpers (used by parent ContentSettingsPanel for AccordionItem titles) ──
export const getTitleOptimizerBadge = (title: string) => ({
  badge: title ? `${title.length} chars` : undefined,
  badgeColor: title && title.length <= 60 ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600",
});

export const getExcerptBadge = (excerpt: string) => ({
  badge: excerpt ? `${excerpt.length}/160` : undefined,
  badgeColor:
    excerpt && excerpt.length >= 120 && excerpt.length <= 160
      ? "bg-green-50 text-green-600"
      : excerpt && excerpt.length > 160
      ? "bg-red-50 text-red-600"
      : "bg-amber-50 text-amber-600",
});

// ─── Title Optimizer Card ────────────────────────────────────────────────────

interface TitleOptimizerCardProps {
  title: string;
  titleInstructions?: string;
  titleSuggestions?: string[];
  isOptimizingTitle?: boolean;
  onTitleInstructionsChange?: (val: string) => void;
  onGenerateTitleSuggestions?: () => void;
  onTitleChange: (val: string) => void;
  onDirtyChange: () => void;
}

export const TitleOptimizerContent: React.FC<TitleOptimizerCardProps> = ({
  title,
  titleInstructions = "",
  titleSuggestions = [],
  isOptimizingTitle = false,
  onTitleInstructionsChange,
  onGenerateTitleSuggestions,
  onTitleChange,
  onDirtyChange,
}) => {
  return (
    <div className="space-y-3">
        {/* Quick Preset Buttons */}
        {onTitleInstructionsChange && (
          <div className="flex flex-wrap gap-1.5">
            {["SEO-Focused", "Engaging", "Professional", "Casual"].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  const presetInstructions: Record<string, string> = {
                    "SEO-Focused": "SEO-optimized, include target keyword, under 60 characters",
                    "Engaging": "Clickable, curiosity-driven, compelling hook",
                    "Professional": "Professional tone, clear value proposition",
                    "Casual": "Conversational, friendly, approachable"
                  };
                  onTitleInstructionsChange(presetInstructions[preset] || "");
                }}
                className={`text-[9px] font-semibold px-2 py-1 rounded-lg transition-all ${
                  titleInstructions.includes(preset.toLowerCase())
                    ? "bg-[#FF5B04] text-white"
                    : "bg-black/5 text-gray-600 hover:bg-black/10"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        )}
        
        {onTitleInstructionsChange && (
          <textarea
            className="w-full text-sm font-geist text-gray-700 bg-black/5 rounded-xl p-3 resize-none outline-none focus:ring-1 focus:ring-[#FF5B04]/30 placeholder-gray-400"
            placeholder="Custom guidelines (optional)..."
            rows={2}
            value={titleInstructions}
            onChange={(e) => onTitleInstructionsChange(e.target.value)}
          />
        )}
        
        {onGenerateTitleSuggestions && (
          <button
            type="button"
            disabled={isOptimizingTitle}
            onClick={onGenerateTitleSuggestions}
            className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-[#FF5B04] text-white hover:bg-[#e04f03] transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            {isOptimizingTitle ? (
              <>
                <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Optimizing Title...</span>
              </>
            ) : (
              <>
                <CosIcon name="sparkles" size={12} className="text-white fill-current" />
                <span>Generate Title Variations</span>
              </>
            )}
          </button>
        )}

        {titleSuggestions.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-black/5 animate-in slide-in-from-top-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-jetbrains-mono flex items-center gap-1">
              <CosIcon name="check" size={10} className="text-green-500" />
              AI Suggestions
            </p>
            <div className="space-y-1.5">
              {titleSuggestions.map((suggestion, idx) => {
                const isActive = title === suggestion;
                const charCount = suggestion.length;
                const isOptimal = charCount <= 60;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onTitleChange(suggestion);
                      onDirtyChange();
                    }}
                    className={`w-full text-left text-xs font-geist p-2.5 rounded-xl border transition-all group relative ${
                      isActive
                        ? "bg-orange-50 border-[#FF5B04] text-[#FF5B04] shadow-sm"
                        : "bg-black/[0.01] border-black/5 hover:border-[#FF5B04]/50 hover:bg-black/[0.03] text-gray-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex-1">{suggestion}</span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${
                          isOptimal ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                        }`}>
                          {charCount}
                        </span>
                        {isActive && (
                          <CosIcon name="check" size={10} className="text-[#FF5B04]" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
    </div>
  );
};

// ─── Excerpt Content ─────────────────────────────────────────────────────────

interface ExcerptCardProps {
  excerpt: string;
  excerptInstructions?: string;
  showExcerptAIGuidelines?: boolean;
  suggestedExcerpt?: string;
  isGeneratingExcerpt?: boolean;
  onExcerptChange: (val: string) => void;
  onExcerptInstructionsChange?: (val: string) => void;
  onToggleExcerptAI?: () => void;
  onGenerateExcerpt?: () => void;
  onApplySuggestedExcerpt?: () => void;
  onDismissSuggestedExcerpt?: () => void;
  onDirtyChange: () => void;
}

export const ExcerptContent: React.FC<ExcerptCardProps> = ({
  excerpt,
  excerptInstructions = "",
  showExcerptAIGuidelines: _showExcerptAIGuidelines = false,
  suggestedExcerpt = "",
  isGeneratingExcerpt = false,
  onExcerptChange,
  onExcerptInstructionsChange,
  onToggleExcerptAI: _onToggleExcerptAI,
  onGenerateExcerpt,
  onApplySuggestedExcerpt,
  onDismissSuggestedExcerpt,
  onDirtyChange,
}) => {
  return (
    <div className="space-y-3">
      {/* Excerpt textarea */}
      <div className="relative">
        <textarea
          className="w-full text-sm font-geist text-gray-700 bg-black/5 rounded-xl p-3 resize-none outline-none focus:ring-1 focus:ring-[#FF5B04]/30 placeholder-gray-400"
          placeholder="Write a compelling summary (120-160 characters optimal for SEO)..."
          style={{ minHeight: 80 }}
          value={excerpt}
          onChange={(e) => {
            onExcerptChange(e.target.value);
            onDirtyChange();
          }}
        />
        {excerpt.length > 160 && (
          <div className="absolute top-2 right-2">
            <CosIcon name="warning" size={12} className="text-red-500" />
          </div>
        )}
      </div>

      {/* Character count progress bar */}
      {excerpt && (
        <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              excerpt.length >= 120 && excerpt.length <= 160
                ? "bg-green-500"
                : excerpt.length > 160
                ? "bg-red-500"
                : "bg-amber-500"
            }`}
            style={{ width: `${Math.min(100, (excerpt.length / 160) * 100)}%` }}
          />
        </div>
      )}

      {/* Quick Preset Buttons */}
      {onExcerptInstructionsChange && (
        <div className="flex flex-wrap gap-1.5">
          {["Concise", "Detailed", "Engaging", "Technical"].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                const presetInstructions: Record<string, string> = {
                  "Concise": "Brief and to the point, focus on key takeaway",
                  "Detailed": "Comprehensive summary covering main points",
                  "Engaging": "Compelling and curiosity-driven",
                  "Technical": "Technical accuracy, clear terminology"
                };
                onExcerptInstructionsChange(presetInstructions[preset] || "");
              }}
              className={`text-[9px] font-semibold px-2 py-1 rounded-lg transition-all ${
                excerptInstructions.includes(preset.toLowerCase())
                  ? "bg-[#FF5B04] text-white"
                  : "bg-black/5 text-gray-600 hover:bg-black/10"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      )}

      {onExcerptInstructionsChange && (
        <textarea
          className="w-full text-sm font-geist text-gray-700 bg-black/5 rounded-xl p-3 resize-none outline-none focus:ring-1 focus:ring-[#FF5B04]/30 placeholder-gray-400"
          placeholder="Custom guidelines (optional)..."
          rows={2}
          value={excerptInstructions}
          onChange={(e) => onExcerptInstructionsChange(e.target.value)}
        />
      )}

      {onGenerateExcerpt && (
        <button
          type="button"
          disabled={isGeneratingExcerpt}
          onClick={onGenerateExcerpt}
          className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-[#FF5B04] text-white hover:bg-[#e04f03] transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
        >
          {isGeneratingExcerpt ? (
            <>
              <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Generating Excerpt...</span>
            </>
          ) : (
            <>
              <CosIcon name="sparkles" size={12} className="text-white fill-current" />
              <span>Generate Excerpt</span>
            </>
          )}
        </button>
      )}

      {/* AI Suggestion - styled like Title Optimizer suggestion list */}
      {suggestedExcerpt && onApplySuggestedExcerpt && (
        <div className="space-y-2 pt-2 border-t border-black/5 animate-in slide-in-from-top-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-jetbrains-mono flex items-center gap-1">
            <CosIcon name="check" size={10} className="text-green-500" />
            AI Suggestion
          </p>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                onApplySuggestedExcerpt();
                onDirtyChange();
              }}
              className="w-full text-left text-xs font-geist p-2.5 pr-8 rounded-xl border transition-all bg-black/[0.01] border-black/5 hover:border-[#FF5B04]/50 hover:bg-black/[0.03] text-gray-700"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex-1 leading-relaxed">{suggestedExcerpt}</span>
                <span className={`text-[8px] font-bold px-1 py-0.5 rounded flex-shrink-0 ${
                  suggestedExcerpt.length >= 120 && suggestedExcerpt.length <= 160
                    ? "bg-green-100 text-green-600"
                    : "bg-amber-100 text-amber-600"
                }`}>
                  {suggestedExcerpt.length}
                </span>
              </div>
            </button>
            {onDismissSuggestedExcerpt && (
              <button
                type="button"
                onClick={onDismissSuggestedExcerpt}
                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-black/5 transition-all flex items-center justify-center"
                aria-label="Dismiss suggestion"
              >
                <svg fill="none" height="10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="10">
                  <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
