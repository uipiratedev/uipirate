"use client";

import React from "react";
import CosIcon from "@/components/pirateCOS/CosIcon";

// ─── Badge helpers (used by parent ContentSettingsPanel for AccordionItem titles) ──
export const getTagsBadge = (tags: string[]) => ({
  badge: tags.length > 0 ? `${tags.length} ${tags.length === 1 ? "tag" : "tags"}` : undefined,
  badgeColor: "bg-blue-50 text-blue-600",
});

export const getHashtagAssistantBadge = (tags: string[]) => ({
  badge: tags.length > 0 ? `${tags.length} ${tags.length === 1 ? "hashtag" : "hashtags"}` : undefined,
  badgeColor: tags.length >= 5 ? "bg-green-100 text-green-700" : "bg-blue-50 text-blue-600",
});

// ─── Tags Card (Blog Posts) ──────────────────────────────────────────────────

interface TagsCardProps {
  tags: string[];
  tagInput?: string;
  suggestedTags?: string[];
  isGeneratingTags?: boolean;
  onTagInputChange?: (val: string) => void;
  onAddTag?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveTag?: (tag: string) => void;
  onGenerateTags?: () => void;
  onTagsChange?: (tags: string[]) => void;
  onDirtyChange: () => void;
}

export const TagsContent: React.FC<TagsCardProps> = ({
  tags,
  tagInput = "",
  suggestedTags = [],
  isGeneratingTags = false,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onGenerateTags,
  onTagsChange,
  onDirtyChange,
}) => {
  return (
    <div className="space-y-3">
      {/* Current tags */}
      <div className="flex flex-wrap gap-1.5 min-h-[24px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 text-xs font-geist px-2.5 py-1 rounded-full transition-all hover:shadow-sm"
            style={{ background: "#FFF0E8", color: "#FF5B04" }}
          >
            {tag}
            {onRemoveTag && (
              <button
                type="button"
                className="opacity-60 hover:opacity-100 leading-none flex items-center transition-opacity"
                onClick={() => {
                  onRemoveTag(tag);
                  onDirtyChange();
                }}
              >
                <svg fill="none" height="9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" width="9">
                  <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            )}
          </span>
        ))}
        {tags.length === 0 && (
          <p className="text-xs text-gray-300 italic">No tags yet. Add some below or use AI suggestions.</p>
        )}
      </div>

      {/* Tag input */}
      {onTagInputChange && onAddTag && (
        <div className="relative">
          <input
            className="w-full text-sm font-geist text-gray-700 bg-black/5 rounded-xl px-3 py-2.5 outline-none placeholder-gray-400 focus:ring-1 focus:ring-[#FF5B04]/30 transition-all"
            placeholder="Type tag and press Enter…"
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyDown={(e) => {
              onAddTag(e);
              onDirtyChange();
            }}
          />
          {tagInput && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-gray-400 font-semibold">
              Press Enter
            </div>
          )}
        </div>
      )}

      {/* Generate AI Tags button - styled to match Title Optimizer */}
      {onGenerateTags && (
        <button
          type="button"
          disabled={isGeneratingTags}
          onClick={onGenerateTags}
          className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-[#FF5B04] text-white hover:bg-[#e04f03] transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
        >
          {isGeneratingTags ? (
            <>
              <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Generating Tags...</span>
            </>
          ) : (
            <>
              <CosIcon name="sparkles" size={12} className="text-white fill-current" />
              <span>Generate AI Tags</span>
            </>
          )}
        </button>
      )}

      {/* AI Suggestions - styled to match Title Optimizer */}
      {suggestedTags && suggestedTags.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-black/5 animate-in slide-in-from-top-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-jetbrains-mono flex items-center gap-1">
            <CosIcon name="check" size={10} className="text-green-500" />
            AI Suggestions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedTags.map((tag) => {
              const isSelected = tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  disabled={isSelected}
                  onClick={() => {
                    if (isSelected) return;
                    if (onTagsChange) {
                      onTagsChange([...tags, tag]);
                      onDirtyChange();
                    }
                  }}
                  className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
                    isSelected
                      ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed line-through"
                      : "bg-black/[0.01] border-black/5 text-gray-700 hover:border-[#FF5B04]/50 hover:bg-[#FF5B04]/5 hover:text-[#FF5B04]"
                  }`}
                >
                  {isSelected && <CosIcon name="check" size={8} className="inline mr-0.5" />}
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Hashtag Assistant Content (Social Posts) ───────────────────────────────

interface HashtagAssistantCardProps {
  tags: string[];
  tagInput?: string;
  socialDestination: "linkedin" | "x";
  socialDestinations: Record<string, { label: string; suggestions: string[] }>;
  onTagInputChange?: (val: string) => void;
  onAddTag?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveTag?: (tag: string) => void;
  onAppendHashtag?: (tag: string) => void;
  onDirtyChange: () => void;
}

export const HashtagAssistantContent: React.FC<HashtagAssistantCardProps> = ({
  tags,
  tagInput = "",
  socialDestination,
  socialDestinations,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onAppendHashtag,
  onDirtyChange,
}) => {
  return (
    <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5 min-h-[24px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 text-xs font-geist px-2.5 py-1 rounded-full transition-all hover:shadow-sm"
            style={{ background: "#FFF0E8", color: "#FF5B04" }}
          >
            {tag}
            {onRemoveTag && (
              <button
                type="button"
                className="opacity-60 hover:opacity-100 leading-none flex items-center transition-opacity"
                onClick={() => {
                  onRemoveTag(tag);
                  onDirtyChange();
                }}
              >
                <svg fill="none" height="9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" width="9">
                  <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            )}
          </span>
        ))}
        {tags.length === 0 && (
          <p className="text-xs text-gray-300 italic">No hashtags yet. Add some below or use AI suggestions.</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-jetbrains-mono">
            Popular for {socialDestinations[socialDestination].label}
          </p>
          <span className="text-[8px] text-gray-400">Click to add</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {socialDestinations[socialDestination].suggestions.map((suggestion) => {
            const isSelected = tags.includes(suggestion);
            return (
              <button
                key={suggestion}
                type="button"
                disabled={isSelected}
                onClick={() => {
                  if (onAppendHashtag) {
                    onAppendHashtag(suggestion);
                    onDirtyChange();
                  }
                }}
                className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
                  isSelected
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                    : "bg-black/[0.03] text-gray-600 hover:bg-[#FF5B04]/10 hover:text-[#FF5B04] hover:shadow-sm"
                }`}
              >
                {isSelected && <CosIcon name="check" size={8} className="inline mr-0.5" />}
                {suggestion}
              </button>
            );
          })}
        </div>
      </div>

      {onTagInputChange && onAddTag && (
        <div className="relative">
          <input
            className="w-full text-sm font-geist text-gray-700 bg-black/5 rounded-xl px-3 py-2.5 outline-none placeholder-gray-400 focus:ring-1 focus:ring-[#FF5B04]/30 transition-all"
            placeholder="Type hashtag and press Enter…"
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyDown={(e) => {
              onAddTag(e);
              onDirtyChange();
            }}
          />
          {tagInput && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-gray-400 font-semibold">
              Press Enter
            </div>
          )}
        </div>
      )}
    </div>
  );
};
