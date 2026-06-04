"use client";

import React from "react";
import CosIcon from "@/components/pirateCOS/CosIcon";

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

export const TitleOptimizerCard: React.FC<TitleOptimizerCardProps> = ({
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
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 mt-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest">
            AI Title Optimizer
          </p>
          {title && (
            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
              title.length <= 60 ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
            }`}>
              {title.length} chars
            </span>
          )}
        </div>
      </div>
      
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
            className="w-full text-xs font-geist text-gray-700 bg-black/5 rounded-xl p-3 resize-none outline-none focus:ring-1 focus:ring-[#FF5B04]/30 placeholder-gray-400"
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
    </div>
  );
};

// ─── Excerpt Card ────────────────────────────────────────────────────────────

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

export const ExcerptCard: React.FC<ExcerptCardProps> = ({
  excerpt,
  excerptInstructions = "",
  showExcerptAIGuidelines = false,
  suggestedExcerpt = "",
  isGeneratingExcerpt = false,
  onExcerptChange,
  onExcerptInstructionsChange,
  onToggleExcerptAI,
  onGenerateExcerpt,
  onApplySuggestedExcerpt,
  onDismissSuggestedExcerpt,
  onDirtyChange,
}) => {
  return (
    <div id="excerpt-section" className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 mt-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest">
            Excerpt
          </p>
          {excerpt && (
            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
              excerpt.length >= 120 && excerpt.length <= 160
                ? "bg-green-50 text-green-600"
                : excerpt.length > 160
                ? "bg-red-50 text-red-600"
                : "bg-amber-50 text-amber-600"
            }`}>
              {excerpt.length}/160
            </span>
          )}
        </div>
        {onToggleExcerptAI && (
          <button
            type="button"
            className={`text-[10px] font-geist font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
              showExcerptAIGuidelines ? "text-gray-500 hover:text-gray-700" : "text-[#FF5B04] hover:text-[#e04f03]"
            }`}
            onClick={onToggleExcerptAI}
          >
            <CosIcon name="sparkles" size={10} className="text-current" />
            {showExcerptAIGuidelines ? "Hide AI" : "AI Assistant"}
          </button>
        )}
      </div>

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
        <div className="mt-2">
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
        </div>
      )}

      {showExcerptAIGuidelines && onExcerptInstructionsChange && onGenerateExcerpt && (
        <div className="mt-3 pt-3 border-t border-black/5 space-y-2 animate-in slide-in-from-top-2">
          {/* Quick Preset Buttons */}
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

          <textarea
            className="w-full text-xs font-geist text-gray-700 bg-black/5 rounded-xl p-2.5 resize-none outline-none focus:ring-1 focus:ring-[#FF5B04]/30 placeholder-gray-400"
            placeholder="Custom guidelines (optional)..."
            rows={2}
            value={excerptInstructions}
            onChange={(e) => onExcerptInstructionsChange(e.target.value)}
          />
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
        </div>
      )}

      {suggestedExcerpt && onApplySuggestedExcerpt && onDismissSuggestedExcerpt && (
        <div className="mt-3 p-3 bg-gradient-to-br from-orange-50 to-orange-100/30 border border-[#FF5B04]/30 rounded-xl space-y-2 animate-in slide-in-from-bottom-2 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#FF5B04] uppercase tracking-wider font-jetbrains-mono flex items-center gap-1">
              <CosIcon name="sparkles" size={10} className="text-[#FF5B04]" />
              AI Suggestion
            </p>
            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
              suggestedExcerpt.length >= 120 && suggestedExcerpt.length <= 160
                ? "bg-green-100 text-green-600"
                : "bg-amber-100 text-amber-600"
            }`}>
              {suggestedExcerpt.length} chars
            </span>
          </div>
          <p className="text-xs font-geist text-gray-700 leading-relaxed">
            {suggestedExcerpt}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onApplySuggestedExcerpt}
              className="flex-1 text-xs font-semibold py-1.5 px-3 rounded-lg bg-white border border-[#FF5B04]/30 text-[#FF5B04] hover:bg-orange-100/50 transition-all hover:shadow-sm flex items-center justify-center gap-1"
            >
              <CosIcon name="check" size={10} />
              Apply
            </button>
            <button
              type="button"
              onClick={onDismissSuggestedExcerpt}
              className="text-xs font-semibold py-1.5 px-3 rounded-lg bg-white/50 text-gray-600 hover:bg-white transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
