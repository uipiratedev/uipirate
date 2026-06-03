"use client";

import React, { useState } from "react";
import CosIcon from "../CosIcon";
import { GenerationRecord } from "@/hooks/useAIWorkspaceSession";

interface GenerationHistoryProps {
  generations: GenerationRecord[];
  onApply: (generationId: string, mode: "replace" | "insert-below" | "insert-above") => void;
  isProUser: boolean;
  onUpgradeClick?: () => void;
  alwaysOpen?: boolean;
}

export default function GenerationHistory({
  generations,
  onApply,
  isProUser,
  onUpgradeClick,
  alwaysOpen = false,
}: GenerationHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<GenerationRecord | null>(null);

  const handleApplyClick = (mode: "replace" | "insert-below" | "insert-above") => {
    if (!selectedRecord) return;
    onApply(selectedRecord.id, mode);
    setSelectedRecord(null);
  };

  const showContent = alwaysOpen || isOpen;

  return (
    <div className={alwaysOpen ? "h-full flex flex-col bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden p-4" : "bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden transition-all duration-200"}>
      {!alwaysOpen && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-gray-700 bg-gray-50/50 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-geist">Generation History ({generations.length})</span>
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
      )}

      {showContent && (
        <div className={`relative ${alwaysOpen ? "flex-1 flex flex-col min-h-0" : "border-t border-black/5 min-h-[150px]"}`}>
          {isProUser ? (
            <div className={`space-y-2 text-xs font-geist text-gray-600 bg-white overflow-y-auto ${alwaysOpen ? "flex-1 p-1" : "p-3.5 max-h-[300px]"}`}>
              {generations.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  No generations captured in this session yet.
                </div>
              ) : (
                generations.map((gen) => (
                  <div
                    key={gen.id}
                    className="group border border-black/5 hover:border-[#FF5B04]/30 rounded-xl p-3 bg-gray-50/50 hover:bg-orange-50/5 transition-all duration-150 cursor-pointer"
                    onClick={() => setSelectedRecord(gen)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-jetbrains-mono block capitalize">
                          {gen.mode.replace("-", " ")}
                        </span>
                        <p className="text-[11px] text-gray-700 font-medium truncate mt-1">
                          {gen.prompt}
                        </p>
                      </div>

                      {gen.isAccepted ? (
                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600" title="Applied to editor">
                          <CosIcon name="check" size={10} className="stroke-[3]" />
                        </span>
                      ) : (
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-300 mt-1" title="Discarded / Not applied" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 bg-white/60 backdrop-blur-md">
              <div className="w-9 h-9 bg-orange-50 rounded-full flex items-center justify-center border border-orange-100 mb-2 shadow-sm animate-pulse">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25" className="w-4.5 h-4.5 text-[#FF5B04]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-800 text-[11px] font-geist tracking-wide">
                History Gated
              </h4>
              <p className="text-[9px] text-gray-400 font-geist max-w-[180px] leading-relaxed mt-0.5 mb-2.5">
                Pro accounts get complete post-scoped version logs and restoration hooks.
              </p>
              <button
                onClick={onUpgradeClick}
                className="px-3 py-1.5 rounded-xl text-[9px] font-bold font-geist text-white bg-[#FF5B04] hover:bg-orange-600 shadow-md transition-colors"
              >
                Upgrade to Pro
              </button>
            </div>
          )}
        </div>
      )}

      {/* Preview Modal for selected history item */}
      {selectedRecord && (
        <div
          className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-black/5 p-5 w-full max-w-md animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3 border-b border-black/5 pb-2">
              <div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-jetbrains-mono block capitalize">
                  {selectedRecord.mode.replace("-", " ")} Output
                </span>
                <span className="text-xs font-bold text-gray-700 mt-1 block">
                  Prompt: {selectedRecord.prompt}
                </span>
              </div>
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-black/5 transition-all"
                onClick={() => setSelectedRecord(null)}
              >
                <CosIcon name="cross" size={12} className="stroke-[2.5]" />
              </button>
            </div>

            <div className="max-h-[250px] overflow-y-auto p-3 bg-gray-50 border border-black/5 rounded-xl text-xs text-gray-700 leading-relaxed font-geist mb-4">
              <div dangerouslySetInnerHTML={{ __html: selectedRecord.output }} />
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => handleApplyClick("replace")}
                className="px-3 py-2 text-xs font-bold font-geist text-white bg-black hover:bg-gray-800 rounded-xl transition-colors shadow-sm"
              >
                Replace selection
              </button>
              <button
                onClick={() => handleApplyClick("insert-below")}
                className="px-3 py-2 text-xs font-semibold font-geist text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Insert below
              </button>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-3 py-2 text-xs font-semibold font-geist text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
