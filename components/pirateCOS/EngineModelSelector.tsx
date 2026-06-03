"use client";

import React, { useEffect } from "react";
import {
  AIEngine,
  AI_PROVIDERS,
  getModelsForEngine,
  getDefaultModelForEngine,
} from "@/lib/pirateCOS/ai-registry";

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
  // Auto-sync model to default when engine changes
  useEffect(() => {
    const models = getModelsForEngine(selectedEngine);
    if (!models.some((m) => m.id === selectedModel)) {
      onModelChange(getDefaultModelForEngine(selectedEngine));
    }
  }, [selectedEngine, selectedModel, onModelChange]);

  return (
    <>
      {/* Engine selector */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-semibold font-geist text-gray-700">
            AI Engine
          </span>
          <span className="text-[10px] text-gray-400 font-geist">
            Select the provider model pool
          </span>
        </div>
        <div className="flex bg-black/[0.04] p-1 rounded-xl gap-1">
          {AI_PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedEngine === provider.id
                  ? "bg-white text-gray-900 shadow-sm border border-black/5"
                  : "text-gray-500 hover:text-gray-900"
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
      <div className="h-px bg-black/5" />

      {/* Model selector */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-semibold font-geist text-gray-700">
            Model Version
          </span>
          <span className="text-[10px] text-gray-400 font-geist">
            Choose the specific model capability
          </span>
        </div>
        <select
          className="text-xs font-semibold font-geist bg-white hover:bg-black/[0.02] border border-black/5 text-gray-700 px-3 py-2 rounded-xl outline-none transition-all cursor-pointer shadow-sm"
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
        >
          {getModelsForEngine(selectedEngine).map((m) => (
            <option key={m.id} value={m.id}>
              {m.label} {m.description ? `(${m.description})` : ""}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};
