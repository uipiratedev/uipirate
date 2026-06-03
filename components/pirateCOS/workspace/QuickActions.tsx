"use client";

import React, { useState } from "react";

interface ActionChipsProps {
  editorHasContent: boolean;
  onTriggerAction: (action: string, tone?: string) => void;
  loading: boolean;
}

export default function ActionChips({
  editorHasContent,
  onTriggerAction,
  loading,
}: ActionChipsProps) {
  const [showTones, setShowTones] = useState(false);

  if (!editorHasContent) return null;

  const toneVariants = [
    { id: "Professional", icon: "💼" },
    { id: "Conversational", icon: "💬" },
    { id: "Bold", icon: "⚡" },
    { id: "Technical", icon: "🔬" },
    { id: "Empathetic", icon: "🤝" },
  ];

  const actions = [
    {
      id: "improve",
      label: "Improve writing",
      description: "Polishes flow and clarity",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-1.813-5.096L2.096 15 7.187 13.187 9 8.096l1.813 5.091L15.904 15l-5.091 1.813z" />
        </svg>
      ),
    },
    {
      id: "shorten",
      label: "Make it shorter",
      description: "Condenses by ~40%",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h9M8 18h5" />
        </svg>
      ),
    },
    {
      id: "expand",
      label: "Expand ideas",
      description: "Elaborates on key concepts",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      ),
    },
    {
      id: "tone",
      label: "Change tone",
      description: "Apply a voice variant",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      ),
      isTone: true,
    },
    {
      id: "continue",
      label: "Continue writing",
      description: "Continues from where you left off",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-1.5">
      {actions.map((act) => (
        <div key={act.id}>
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              if (act.isTone) {
                setShowTones((v) => !v);
              } else {
                onTriggerAction(act.id);
                setShowTones(false);
              }
            }}
            className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer group ${
              act.isTone && showTones
                ? "bg-orange-50/50 border-[#FF5B04]/30 text-[#FF5B04]"
                : "bg-white border-black/5 hover:border-[#FF5B04]/30 hover:bg-orange-50/10 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`flex-shrink-0 transition-colors ${act.isTone && showTones ? "text-[#FF5B04]" : "text-gray-400 group-hover:text-[#FF5B04]"}`}>
                {act.icon}
              </span>
              <div className="min-w-0">
                <span className={`text-xs font-bold font-geist block transition-colors ${act.isTone && showTones ? "text-[#FF5B04]" : "text-gray-700 group-hover:text-[#FF5B04]"}`}>
                  {act.label}
                </span>
                <span className="text-[9px] text-gray-400 font-geist">
                  {act.description}
                </span>
              </div>
            </div>
            {act.isTone && (
              <svg
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
                className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${showTones ? "rotate-180 text-[#FF5B04]" : "text-gray-300"}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>

          {/* Tone variant picker — inline below the Tone row */}
          {act.isTone && showTones && (
            <div className="mt-1 p-3 bg-gray-50 border border-black/5 rounded-xl space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-jetbrains-mono">
                Select voice
              </p>
              <div className="flex flex-wrap gap-1.5">
                {toneVariants.map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      onTriggerAction("change-tone", tone.id);
                      setShowTones(false);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold font-geist bg-white border border-black/5 hover:border-[#FF5B04]/40 hover:text-[#FF5B04] hover:bg-orange-50/20 text-gray-700 rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    <span>{tone.icon}</span>
                    {tone.id}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
