"use client";

import React, { useState, useRef, useEffect } from "react";
import CosIcon from "../CosIcon";

interface ActionChipsProps {
  editorHasContent: boolean;
  onTriggerAction: (actionIds: string[], tone?: string, customInstruction?: string) => void;
  loading: boolean;
  selectedText?: string;
  onSwitchToChat: () => void;
}

export default function ActionChips({
  editorHasContent,
  onTriggerAction,
  loading,
  selectedText = "",
  onSwitchToChat,
}: ActionChipsProps) {
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedTone, setSelectedTone] = useState<string>("Professional");
  const [customInstruction, setCustomInstruction] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea up to 5 lines (112px) before scrolling
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const maxHeight = 112; // ~5 lines of text-xs
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.style.overflowY = "hidden";
    }
  }, [customInstruction]);

  if (!editorHasContent) {
    return (
      <div className="p-4 bg-white border border-black/5 rounded-2xl flex flex-col gap-3 shadow-sm text-gray-500 font-geist">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-100/50 flex-shrink-0 text-orange-600">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-bold text-gray-700 font-geist">Quick Rewrite Tool</p>
            <p className="text-[10px] leading-relaxed text-gray-500">
              This panel helps you quickly rewrite, edit, or adjust the tone of your text in the editor.
            </p>
          </div>
        </div>

        <div className="border-t border-black/[0.04] pt-3 flex flex-col gap-2">
          <p className="text-[10px] text-gray-400 leading-normal">
            To use this, first write some content in the editor (or generate it in the AI Chat) and then highlight the text you want to edit.
          </p>
          <button
            type="button"
            onClick={onSwitchToChat}
            className="w-full h-8 rounded-lg bg-[#FF5B04]/5 hover:bg-[#FF5B04]/10 border border-[#FF5B04]/10 text-[10px] font-bold text-[#FF5B04] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Write with AI Chat Co-pilot
          </button>
        </div>
      </div>
    );
  }

  const hasSelection = selectedText && selectedText.trim().length > 0;
  const wordCount = hasSelection ? selectedText.trim().split(/\s+/).filter(Boolean).length : 0;

  const toneVariants = [
    { id: "Professional", icon: "briefcase" },
    { id: "Conversational", icon: "chat" },
    { id: "Bold", icon: "bolt" },
    { id: "Technical", icon: "beaker" },
    { id: "Empathetic", icon: "heart" },
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

  if (!hasSelection) {
    return (
      <div className="p-4 bg-white border border-black/5 rounded-2xl flex flex-col gap-3 shadow-sm text-gray-500 font-geist">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-100/50 flex-shrink-0 text-orange-600">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-bold text-gray-700 font-geist">Quick Rewrite Tool</p>
            <p className="text-[10px] leading-relaxed text-gray-500">
              Highlight text in the editor to run quick edits (improve, shorten, change tone) directly.
            </p>
          </div>
        </div>
        
        <div className="border-t border-black/[0.04] pt-3 flex flex-col gap-2">
          <p className="text-[10px] text-gray-400 leading-normal">
            No text highlighted? Use the AI Co-pilot chat to generate content from scratch or get tailored ideas.
          </p>
          <button
            type="button"
            onClick={onSwitchToChat}
            className="w-full h-8 rounded-lg bg-gray-50 hover:bg-gray-100 border border-black/5 hover:border-black/10 text-[10px] font-bold text-gray-700 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-[#FF5B04]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Open AI Co-pilot Chat
          </button>
        </div>
      </div>
    );
  }

  const handleToggleAction = (actionId: string) => {
    setSelectedActions((prev) =>
      prev.includes(actionId)
        ? prev.filter((id) => id !== actionId)
        : [...prev, actionId]
    );
  };

  const handleRunActions = () => {
    if (selectedActions.length === 0 && !customInstruction.trim()) return;
    const toneVal = selectedActions.includes("tone") ? selectedTone : undefined;
    onTriggerAction(selectedActions, toneVal, customInstruction);
    setSelectedActions([]);
    setCustomInstruction("");
  };

  const canRun = selectedActions.length > 0 || customInstruction.trim().length > 0;

  return (
    <div className="p-3.5 bg-orange-50/10 border border-[#FF5B04]/10 rounded-2xl space-y-3.5 shadow-sm transition-all animate-in fade-in duration-200">
      {/* Title / Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-[#FF5B04]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-1.813-5.096L2.096 15 7.187 13.187 9 8.096l1.813 5.091L15.904 15l-5.091 1.813z" />
          </svg>
          <span className="text-xs font-bold text-gray-700 font-geist tracking-wide truncate">
            Quick Suggestions
          </span>
        </div>
        <span className="flex-shrink-0 text-[10px] font-bold font-geist px-2 py-0.5 rounded-full bg-[#FF5B04]/10 text-[#FF5B04]">
          {wordCount} words selected
        </span>
      </div>

      {/* Selected text preview */}
      <div className="bg-white/80 p-2.5 rounded-xl border border-black/5 text-[10px] text-gray-500 italic max-h-20 overflow-y-auto leading-relaxed">
        &ldquo;{selectedText.length > 220 ? `${selectedText.substring(0, 220)}...` : selectedText}&rdquo;
      </div>

      {/* Custom directions */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-jetbrains-mono block px-0.5">
          Custom directions (optional)
        </label>
        <div className="relative flex items-center">
          <textarea
            ref={textareaRef}
            disabled={loading}
            value={customInstruction}
            onChange={(e) => setCustomInstruction(e.target.value)}
            placeholder="e.g. use bullet points, make it witty, translate..."
            className="w-full text-xs font-geist bg-white border border-black/5 rounded-xl py-2 px-3 pr-8 outline-none resize-none placeholder-gray-400 text-gray-800 focus:ring-1 focus:ring-[#FF5B04]/20 shadow-sm leading-normal min-h-[36px]"
            style={{ maxHeight: "112px" }}
          />
          {customInstruction && (
            <button
              onClick={() => setCustomInstruction("")}
              className="absolute right-2.5 text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer w-4 h-4 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
              title="Clear text"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Quick Action Presets (Multi-select checkbox lists) */}
      <div className="space-y-1.5 pt-0.5">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-jetbrains-mono block px-0.5 mb-1.5">
          Choose preset directives (multi-select)
        </p>
        <div className="space-y-1.5">
          {actions.map((act) => {
            const isSelected = selectedActions.includes(act.id);
            return (
              <div key={act.id}>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleToggleAction(act.id)}
                  className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer group ${
                    isSelected
                      ? "bg-orange-50/60 border-[#FF5B04] text-[#FF5B04] shadow-sm shadow-orange-500/[0.03]"
                      : "bg-white border-black/5 hover:border-black/10 hover:bg-gray-50/50 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Checkbox indicator */}
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                      isSelected
                        ? "bg-[#FF5B04] border-[#FF5B04] text-white"
                        : "border-black/20 bg-white group-hover:border-black/35"
                    }`}>
                      {isSelected && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-2.5 h-2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className={`flex-shrink-0 transition-colors ${isSelected ? "text-[#FF5B04]" : "text-gray-400 group-hover:text-gray-600"}`}>
                      {act.icon}
                    </span>
                    <div className="min-w-0">
                      <span className={`text-xs font-bold font-geist block transition-colors ${isSelected ? "text-[#FF5B04]" : "text-gray-700 group-hover:text-gray-900"}`}>
                        {act.label}
                      </span>
                      <span className="text-[9px] text-gray-400 font-geist">
                        {act.description}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Tone variants */}
                {act.isTone && isSelected && (
                  <div className="mt-1.5 p-3 bg-gray-50 border border-black/5 rounded-xl space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-jetbrains-mono">
                      Select Tone Voice
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {toneVariants.map((tone) => (
                        <button
                          key={tone.id}
                          type="button"
                          disabled={loading}
                          onClick={() => setSelectedTone(tone.id)}
                          className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold font-geist rounded-lg shadow-sm transition-all cursor-pointer border ${
                            selectedTone === tone.id
                              ? "bg-[#FF5B04] border-[#FF5B04] text-white"
                              : "bg-white border-black/5 hover:border-[#FF5B04]/40 hover:text-[#FF5B04] text-gray-700"
                          }`}
                        >
                          <CosIcon
                            name={tone.icon}
                            size={11}
                            className={`shrink-0 ${
                              selectedTone === tone.id ? "text-white" : "text-gray-500 group-hover:text-[#FF5B04]"
                            }`}
                          />
                          {tone.id}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Apply Rewrite Button */}
      <button
        type="button"
        disabled={loading || !canRun}
        onClick={handleRunActions}
        className="w-full h-9 rounded-xl font-geist font-medium text-xs text-white bg-[#FF5B04] hover:bg-[#E54F00] shadow-md shadow-orange-500/10 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:bg-[#FF5B04]/70 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer mt-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Applying AI Suggestions...</span>
          </>
        ) : (
          <>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-1.813-5.096L2.096 15 7.187 13.187 9 8.096l1.813 5.091L15.904 15l-5.091 1.813z" />
            </svg>
            <span>Apply AI Suggestions</span>
          </>
        )}
      </button>
    </div>
  );
}
