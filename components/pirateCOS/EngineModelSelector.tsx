"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  AIEngine,
  AI_PROVIDERS,
  getDefaultModelForEngine,
} from "@/lib/pirateCOS/ai-registry";
import { useAIModels } from "@/hooks/useAIModels";

interface Props {
  selectedEngine: AIEngine;
  selectedModel: string;
  onEngineChange: (engine: AIEngine) => void;
  onModelChange: (model: string) => void;
}

export const EngineModelSelector: React.FC<Props> = ({
  selectedEngine,
  selectedModel,
  onEngineChange,
  onModelChange,
}) => {
  const { models, source, isLoading } = useAIModels(selectedEngine);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-sync model to default when engine changes
  useEffect(() => {
    if (!models.some((m) => m.id === selectedModel)) {
      onModelChange(getDefaultModelForEngine(selectedEngine));
    }
  }, [selectedEngine, selectedModel, models, onModelChange]);

  // Click outside to close
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown on engine change
  useEffect(() => {
    setIsOpen(false);
  }, [selectedEngine]);

  const activeModel = models.find((m) => m.id === selectedModel) || models[0];

  return (
    <div className="flex flex-col gap-3.5">
      {/* Engine selector */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-semibold font-geist text-gray-700 dark:text-gray-300">
            AI Engine
          </span>
          <span className="text-[10px] text-gray-400 font-geist">
            Select the provider model pool
          </span>
        </div>
        <div className="flex bg-black/[0.04] dark:bg-white/[0.04] p-1 rounded-xl gap-1 border border-black/[0.02] dark:border-white/[0.02]">
          {AI_PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedEngine === provider.id
                  ? "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm border border-black/5 dark:border-white/5"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
              type="button"
              onClick={() => onEngineChange(provider.id)}
            >
              <img
                src={provider.logo}
                alt={provider.name}
                className="w-3.5 h-3.5 object-contain"
              />{" "}
              {provider.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Separator line */}
      <div className="h-px bg-black/5 dark:bg-white/5" />

      {/* Model selector */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-semibold font-geist text-gray-700 dark:text-gray-300">
            Model Version
          </span>
          <span className="text-[10px] text-gray-400 font-geist">
            {isLoading
              ? "Checking provider models..."
              : source === "mixed"
                ? "Live provider models plus safe defaults"
                : "Choose the specific model capability"}
          </span>
        </div>

        <div className="relative" ref={containerRef}>
          {/* Custom Dropdown Trigger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-64 flex items-center justify-between text-xs font-semibold font-geist bg-white/70 dark:bg-zinc-800/70 hover:bg-white dark:hover:bg-zinc-800 border border-black/5 dark:border-white/5 text-gray-700 dark:text-gray-300 px-3.5 py-2.5 rounded-xl outline-none transition-all cursor-pointer shadow-sm backdrop-blur-md relative active:scale-98`}
          >
            <div className="flex items-center gap-2 truncate pr-2">
              {activeModel?.description === "live" && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              )}
              {activeModel?.description === "fast" && (
                <span className="text-[10px] shrink-0">⚡</span>
              )}
              {activeModel?.description === "capable" && (
                <span className="text-[10px] shrink-0">✨</span>
              )}
              <span className="truncate">{activeModel?.label || "Select Model"}</span>
            </div>

            {isLoading ? (
              <svg className="animate-spin h-3.5 w-3.5 text-gray-400 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>

          {/* Custom Dropdown List */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-2xl shadow-2xl z-50 p-1.5 flex flex-col gap-0.5">
              {models.map((m) => {
                const isSelected = m.id === selectedModel;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      onModelChange(m.id);
                      setIsOpen(false);
                    }}
                    type="button"
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex flex-col gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-black/[0.04] dark:bg-white/[0.08]"
                        : "hover:bg-black/[0.02] dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold font-geist ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                        {m.label}
                      </span>
                      {isSelected && (
                        <svg
                          className="w-3.5 h-3.5 text-[#FF5B04] dark:text-[#ff6b1e] shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {/* Badges row */}
                    <div className="flex flex-wrap gap-1 items-center">
                      {m.isDefault && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                          Default
                        </span>
                      )}
                      {m.description === "fast" && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                          ⚡ Fast
                        </span>
                      )}
                      {m.description === "capable" && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30">
                          ✨ Capable
                        </span>
                      )}
                      {m.description === "live" && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Live API
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
