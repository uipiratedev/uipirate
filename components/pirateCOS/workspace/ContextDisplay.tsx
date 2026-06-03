"use client";

import React, { useRef, useState } from "react";

interface FocusKeywordStripProps {
  postType: string;
  focusKeyword?: string;
  onSetFocusKeyword?: (kw: string) => void;
  selectedTextLength: number;
}

const POST_TYPE_ICONS: Record<string, string> = {
  "blog-post": "📝",
  "social-post": "💬",
  "product-review": "⭐",
  "listicle": "📋",
  "how-to": "🛠",
  "case-study": "📊",
  "comparison": "⚖️",
  "news": "📰",
  "opinion": "💡",
  "newsletter": "✉️",
};

export default function FocusKeywordStrip({
  postType,
  focusKeyword,
  onSetFocusKeyword,
  selectedTextLength,
}: FocusKeywordStripProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localKw, setLocalKw] = useState(focusKeyword || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const typeIcon = POST_TYPE_ICONS[postType] || "📝";
  const typeLabel = postType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const handleSave = () => {
    setIsEditing(false);
    if (onSetFocusKeyword && localKw.trim() !== (focusKeyword || "")) {
      onSetFocusKeyword(localKw.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setLocalKw(focusKeyword || "");
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 px-1 py-0.5">
      {/* Post type badge */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="text-xs">{typeIcon}</span>
        <span className="text-[10px] font-bold text-gray-400 font-geist capitalize">
          {typeLabel}
        </span>
      </div>

      {/* Divider */}
      <div className="h-3 w-px bg-black/10 flex-shrink-0" />

      {/* Focus keyword inline editor */}
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider font-jetbrains-mono flex-shrink-0">
          Focus:
        </span>
        {isEditing ? (
          <input
            ref={inputRef}
            autoFocus
            value={localKw}
            onChange={(e) => setLocalKw(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder="e.g. react performance"
            className="flex-1 text-[10px] font-geist bg-orange-50 border border-[#FF5B04]/30 rounded-md px-1.5 py-0.5 outline-none text-gray-700 placeholder-gray-300 min-w-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setLocalKw(focusKeyword || "");
              setIsEditing(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            className="flex-1 text-left text-[10px] font-geist text-gray-500 hover:text-[#FF5B04] transition-colors truncate min-w-0 cursor-text"
            title="Click to set focus keyword"
          >
            {focusKeyword ? (
              <span className="font-semibold text-gray-700">{focusKeyword}</span>
            ) : (
              <span className="text-gray-300 italic">tap to set keyword…</span>
            )}
          </button>
        )}
      </div>

      {/* Selected text count */}
      {selectedTextLength > 0 && (
        <>
          <div className="h-3 w-px bg-black/10 flex-shrink-0" />
          <span className="text-[9px] font-bold text-[#FF5B04] font-jetbrains-mono flex-shrink-0">
            {selectedTextLength}w
          </span>
        </>
      )}
    </div>
  );
}
