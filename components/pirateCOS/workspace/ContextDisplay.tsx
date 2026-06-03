"use client";

import React, { useState } from "react";
import CosIcon from "../CosIcon";

interface ContextDisplayProps {
  postType: string;
  contentGoal: string;
  brandVoice?: string;
  focusKeyword?: string;
  selectedTextLength: number;
}

export default function ContextDisplay({
  postType,
  contentGoal,
  brandVoice = "Professional",
  focusKeyword = "Not configured",
  selectedTextLength,
}: ContextDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-gray-700 bg-gray-50/50 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <CosIcon name="bot" size={14} className="text-gray-500" />
          <span className="font-geist">Active AI Context</span>
        </div>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-3.5 py-3 border-t border-black/5 space-y-2 text-[11px] font-geist text-gray-600 bg-white">
          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-400 font-medium">Post Archetype</span>
            <span className="font-semibold text-gray-800 capitalize flex items-center gap-1">
              <CosIcon name={postType} size={11} className="text-orange-500" />
              {postType.replace("-", " ")}
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-400 font-medium">Content Goal</span>
            <span className="font-semibold text-gray-800 capitalize flex items-center gap-1">
              <CosIcon name={contentGoal} size={11} className="text-orange-500" />
              {contentGoal.replace("-", " ")}
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-400 font-medium">Brand Voice</span>
            <span className="font-semibold text-gray-800 truncate max-w-[120px]" title={brandVoice}>
              {brandVoice}
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-400 font-medium">Focus Keyword</span>
            <span className="font-semibold text-gray-800 truncate max-w-[120px]" title={focusKeyword}>
              {focusKeyword}
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-400 font-medium">Active Selection</span>
            <span
              className={`font-semibold ${
                selectedTextLength > 0 ? "text-[#FF5B04]" : "text-gray-400"
              }`}
            >
              {selectedTextLength > 0 ? `${selectedTextLength} words` : "None (uses focus paragraph)"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
