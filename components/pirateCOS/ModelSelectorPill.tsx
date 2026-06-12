"use client";

import React, { useState, useEffect, useRef } from "react";
import { AIEngine, AI_PROVIDERS } from "@/lib/pirateCOS/ai-registry";
import { useAIModels } from "@/hooks/useAIModels";

interface ModelSelectorPillProps {
  selectedEngine: AIEngine;
  selectedModel: string;
  onEngineChange: (engine: AIEngine) => void;
  onModelChange: (model: string) => void;
}

export function ModelSelectorPill({
  selectedEngine,
  selectedModel,
  onEngineChange,
  onModelChange,
}: ModelSelectorPillProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">("bottom");
  const [horizontalAlign, setHorizontalAlign] = useState<"left" | "right">("left");
  const containerRef = useRef<HTMLDivElement>(null);
  const { models, isLoading, enabledProviders, enabledEngines } = useAIModels(selectedEngine);

  // Fall back to first enabled engine if current is disabled
  useEffect(() => {
    if (enabledEngines && enabledEngines[selectedEngine] === false) {
      const fallbackEngine = enabledProviders[0]?.id;
      if (fallbackEngine) {
        onEngineChange(fallbackEngine);
      }
    }
  }, [selectedEngine, enabledEngines, enabledProviders, onEngineChange]);

  // Auto-detect position when opening
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const spaceRight = window.innerWidth - rect.left;

      // Dropdown width is 256px (w-64), check horizontal space
      if (spaceRight < 256) {
        setHorizontalAlign("right");
      } else {
        setHorizontalAlign("left");
      }

      // Dropdown needs ~350px height, prefer opening downward
      if (spaceBelow >= 350 || spaceBelow > spaceAbove) {
        setDropdownPosition("bottom");
      } else {
        setDropdownPosition("top");
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Find label of active model
  const activeModel = models.find((m) => m.id === selectedModel) || { label: selectedModel.split("/").pop() || selectedModel };
  const activeLabel = activeModel.label;

  return (
    <div className="relative font-geist" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-6 px-2 rounded-lg bg-black/[0.04] hover:bg-black/[0.08] text-gray-500 hover:text-gray-800 text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1 border border-black/[0.02] shadow-sm select-none"
      >
        <span className="truncate max-w-[120px]">{activeLabel}</span>
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="3"
          className={`w-2.5 h-2.5 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute w-64 bg-white border border-black/5 rounded-xl shadow-xl z-50 p-2 flex flex-col gap-2 animate-in fade-in duration-150 ${
          dropdownPosition === "top"
            ? "bottom-full mb-1.5 slide-in-from-bottom-2"
            : "top-full mt-1.5 slide-in-from-top-2"
        } ${
          horizontalAlign === "right" ? "right-0" : "left-0"
        }`}>
          <div className="text-[9px] font-bold text-gray-400 font-jetbrains-mono uppercase tracking-wider px-1">
            AI Engine
          </div>
          {/* Engine tabs switcher */}
          <div className="flex bg-black/[0.03] p-0.5 rounded-lg gap-0.5 border border-black/[0.01]">
            {enabledProviders.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => onEngineChange(provider.id)}
                className={`flex-1 py-1 rounded-md text-[9px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  selectedEngine === provider.id
                    ? "bg-white text-gray-900 shadow-sm border border-black/5"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <img
                  src={provider.logo}
                  alt={provider.name}
                  className="w-2.5 h-2.5 object-contain"
                />
                <span className="hidden xs:inline">{provider.shortName}</span>
              </button>
            ))}
          </div>

          <div className="h-px bg-black/5" />

          <div className="text-[9px] font-bold text-gray-400 font-jetbrains-mono uppercase tracking-wider px-1">
            Model Version
          </div>
          {/* Models list */}
          <div className="flex flex-col gap-0.5 max-h-64 overflow-y-auto pr-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-4 text-[10px] text-gray-400 gap-1.5">
                <svg className="animate-spin h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Loading models...</span>
              </div>
            ) : (
              models.map((m) => {
                const isSelected = m.id === selectedModel;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onModelChange(m.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg flex flex-col gap-0.5 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-black/[0.04]"
                        : "hover:bg-black/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-semibold ${isSelected ? "text-gray-900" : "text-gray-600"}`}>
                        {m.label}
                      </span>
                      {isSelected && (
                        <svg className="w-3 h-3 text-[#FF5B04] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
