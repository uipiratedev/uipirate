"use client";

import React, { useState } from "react";
import CosIcon from "../CosIcon";

interface QuickActionsProps {
  selectedText: string;
  onTriggerAction: (action: string, tone?: string) => void;
  onOpenRepurposingDrawer: () => void;
  loading: boolean;
}

export default function QuickActions({
  selectedText,
  onTriggerAction,
  onOpenRepurposingDrawer,
  loading,
}: QuickActionsProps) {
  const [showTones, setShowTones] = useState(false);

  const actions = [
    {
      id: "improve",
      label: "Improve",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-1.813-5.096L2.096 15 7.187 13.187 9 8.096l1.813 5.091L15.904 15l-5.091 1.813zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "Polishes writing flow & clarity",
    },
    {
      id: "shorten",
      label: "Shorten",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      ),
      description: "Condenses text by ~40%",
    },
    {
      id: "expand",
      label: "Expand",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      ),
      description: "Elaborates on key concepts",
    },
    {
      id: "tone",
      label: "Change Tone",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      description: "Applies voice variant flyout",
      onClick: () => setShowTones(!showTones),
    },
    {
      id: "seo-optimize",
      label: "SEO Optimize",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      description: "Integrates focus keywords",
    },
    {
      id: "generate-cta",
      label: "Generate CTA",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      ),
      description: "Inserts Call-to-Action block",
    },
    {
      id: "continue",
      label: "Continue Writing",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      ),
      description: "Generates continuation from cursor",
    },
    {
      id: "rewrite-linkedin",
      label: "LinkedIn Rewrite",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
        </svg>
      ),
      description: "Creates LinkedIn variant draft",
      onClick: () => {
        if (selectedText.trim()) {
          onTriggerAction("rewrite-linkedin");
        } else {
          onOpenRepurposingDrawer();
        }
      },
    },
  ];

  const toneVariants = [
    "Professional",
    "Conversational",
    "Bold",
    "Technical",
    "Empathetic",
    "Provocative",
  ];

  const handleActionClick = (act: typeof actions[0]) => {
    if (loading) return;
    if (act.onClick) {
      act.onClick();
    } else {
      onTriggerAction(act.id);
    }
  };

  return (
    <div className="space-y-2">
      {selectedText && (
        <div className="flex items-center gap-1 px-1 py-0.5 text-[10px] font-medium text-[#FF5B04] uppercase tracking-wider font-jetbrains-mono">
          <CosIcon name="check" size={10} className="stroke-[3]" />
          <span>{selectedText.split(/\s+/).length} words selected</span>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        {actions.map((act) => (
          <div
            key={act.id}
            className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-black/5 hover:border-[#FF5B04]/30 hover:bg-orange-50/10 transition-all duration-200 group relative shadow-sm"
          >
            {/* Clickable action area */}
            <button
              disabled={loading}
              onClick={() => handleActionClick(act)}
              className="flex-1 flex items-center gap-2.5 text-left disabled:opacity-50 disabled:pointer-events-none outline-none cursor-pointer"
            >
              <div className="text-gray-400 group-hover:text-[#FF5B04] transition-colors flex-shrink-0">
                {act.icon}
              </div>
              <span className="text-xs font-bold text-gray-700 font-geist group-hover:text-[#FF5B04] transition-colors truncate">
                {act.label}
              </span>
            </button>

            {/* Info Tooltip */}
            <div className="relative group/info ml-2 flex-shrink-0 flex items-center">
              <button
                type="button"
                className="text-gray-300 hover:text-[#FF5B04] transition-colors cursor-help outline-none p-0.5"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.085 1.086L12.5 13H13.75a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75V11.25zM12 9a.75.75 0 110-1.5.75.75 0 010 1.5zM22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" />
                </svg>
              </button>
              
              {/* Tooltip Content Box */}
              <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 hidden group-hover/info:block bg-gray-900/95 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-40 border border-white/10 select-none pointer-events-none animate-in fade-in slide-in-from-right-1 duration-150">
                {act.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showTones && (
        <div className="p-3.5 bg-gray-50 border border-black/5 rounded-xl space-y-2.5 animate-in fade-in duration-200">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-jetbrains-mono block">
            Select Tone Variant
          </span>
          <div className="flex flex-wrap gap-1.5">
            {toneVariants.map((tone) => (
              <button
                key={tone}
                disabled={loading}
                onClick={() => {
                  onTriggerAction("change-tone", tone);
                  setShowTones(false);
                }}
                className="px-2.5 py-1 text-xs font-medium font-geist bg-white border border-black/5 hover:border-[#FF5B04] hover:text-[#FF5B04] text-gray-700 rounded-lg shadow-sm transition-all duration-150"
              >
                {tone}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
