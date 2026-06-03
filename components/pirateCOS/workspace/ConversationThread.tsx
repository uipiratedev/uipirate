"use client";

import React, { useState, useRef, useEffect } from "react";
import CosIcon from "../CosIcon";
import { AIWorkspaceMessage } from "@/hooks/useAIWorkspaceSession";
import { useAIModels } from "@/hooks/useAIModels";
import { AIEngine, AI_PROVIDERS } from "@/lib/pirateCOS/ai-registry";

interface ConversationThreadProps {
  messages: AIWorkspaceMessage[];
  loading: boolean;
  onSendMessage: (content: string) => void;
  onApply: (generationId: string, mode: "replace" | "insert-below" | "insert-above") => void;
  onSaveSnippet: (text: string) => void;
  onTriggerVariant: (generationId: string) => void;
  isProUser: boolean;
  onUpgradeClick?: () => void;
  selectedEngine: AIEngine;
  selectedModel: string;
  onEngineChange: (engine: AIEngine) => void;
  onModelChange: (model: string) => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  editorHasContent: boolean;
}

const POST_IDEA_PROMPTS = [
  { icon: "🛠", label: "Write a how-to guide", prompt: "Write a comprehensive how-to guide about [insert topic]. Break down the steps clearly, start with a hook explaining why this matters, and include practical examples for each step." },
  { icon: "📊", label: "Summarize a key insight", prompt: "Summarize the key takeaways and lessons learned from [insert experience/book/project]. Focus on actionable tips that a reader can implement immediately, and explain why these lessons are important." },
  { icon: "💡", label: "Share an opinion or take", prompt: "Draft a thought-leadership opinion post about the recent trends in [insert industry/field]. State a clear perspective, back it up with 2-3 reasons, and end with an engaging question to spark a discussion." },
  { icon: "📋", label: "Create a list article", prompt: "Create an engaging listicle detailing [insert number] best practices/tools/tips for [insert target audience]. For each item in the list, provide a brief description and a key takeaway." },
];

export default function ConversationThread({
  messages,
  loading,
  onSendMessage,
  onApply,
  onSaveSnippet,
  onTriggerVariant,
  isProUser,
  onUpgradeClick,
  selectedEngine,
  selectedModel,
  onEngineChange,
  onModelChange,
  initialPrompt,
  onClearInitialPrompt,
  editorHasContent,
}: ConversationThreadProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
  }, [inputValue]);

  useEffect(() => {
    if (initialPrompt) {
      setInputValue((prev) => (prev ? prev + "\n" + initialPrompt : initialPrompt));
      onClearInitialPrompt?.();
    }
  }, [initialPrompt, onClearInitialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="relative flex-1 flex flex-col h-full min-h-0 w-full bg-white">
      {/* Messages list */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 min-h-0 ${!isProUser ? "filter blur-sm select-none pointer-events-none" : ""}`}>
        {messages.length === 0 && !editorHasContent ? (
          <div className="space-y-5 py-4 max-w-sm mx-auto">
            <div className="text-center space-y-2 text-gray-400">
              <CosIcon name="bot" size={32} className="text-gray-300 mx-auto animate-bounce" />
              <p className="text-xs font-semibold font-geist text-gray-700">AI Conversation</p>
              <p className="text-[10px] leading-relaxed font-geist text-gray-500">
                Ask specific editing questions, request formatting tweaks, or draft inline sections.
              </p>
            </div>
            
            <div className="space-y-2.5 pt-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-jetbrains-mono px-1">
                Get started with an idea
              </p>
              <div className="space-y-1.5">
                {POST_IDEA_PROMPTS.map((idea) => (
                  <button
                    key={idea.label}
                    type="button"
                    disabled={loading}
                    onClick={() => setInputValue(idea.prompt)}
                    className="w-full text-left flex items-center gap-2.5 p-2.5 bg-white border border-black/5 rounded-xl hover:border-[#FF5B04]/30 hover:bg-orange-50/10 transition-all group cursor-pointer shadow-sm disabled:opacity-40"
                  >
                    <span className="text-base flex-shrink-0">{idea.icon}</span>
                    <span className="text-xs font-medium font-geist text-gray-600 group-hover:text-[#FF5B04] transition-colors">
                      {idea.label}
                    </span>
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 ml-auto text-gray-300 group-hover:text-[#FF5B04] transition-colors flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-2">
            <CosIcon name="bot" size={28} className="text-gray-300 animate-bounce" />
            <p className="text-xs font-semibold font-geist text-gray-700">AI Conversation</p>
            <p className="text-[10px] leading-relaxed max-w-[200px] font-geist">
              Ask specific editing questions, request formatting tweaks, or draft inline sections.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1.5`}
              >
                {/* Header info */}
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400 font-geist">
                  <span>{isUser ? "You" : "✦ AI"}</span>
                  <span>·</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed font-geist ${
                    isUser
                      ? "bg-gray-100 text-gray-800 rounded-tr-sm"
                      : "bg-orange-50/20 border border-orange-100/50 text-gray-800 rounded-tl-sm"
                  }`}
                >
                  {/* Context indicator */}
                  {msg.selectedTextContext && (
                    <div className="mb-2 p-1.5 bg-black/5 rounded-lg text-[10px] text-gray-500 font-jetbrains-mono border-l-2 border-[#FF5B04]">
                      Context: {msg.selectedTextContext.substring(0, 60)}
                      {msg.selectedTextContext.length > 60 && "..."}
                    </div>
                  )}
                  {/* Content (HTML wrapper check) */}
                  <div
                    className="ai-prose"
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                  />
                </div>

                {/* Apply Actions for assistant outputs */}
                {!isUser && msg.associatedGenerationId && (
                  <div className="flex flex-wrap gap-1 mt-1 justify-start max-w-[90%] animate-in slide-in-from-top-1 duration-200">
                    <button
                      onClick={() => onApply(msg.associatedGenerationId!, "replace")}
                      className="px-2 py-1 text-[10px] font-bold font-geist text-white bg-black hover:bg-gray-800 rounded-md transition-colors shadow-sm"
                    >
                      Replace selection
                    </button>
                    <button
                      onClick={() => onApply(msg.associatedGenerationId!, "insert-below")}
                      className="px-2 py-1 text-[10px] font-semibold font-geist text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      Insert below
                    </button>
                    <button
                      onClick={() => onSaveSnippet(msg.content)}
                      className="px-2 py-1 text-[10px] font-semibold font-geist text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      title="Save output to Workflow Snippets"
                    >
                      Save snippet
                    </button>
                    <button
                      onClick={() => onTriggerVariant(msg.associatedGenerationId!)}
                      className="px-2 py-1 text-[10px] font-semibold font-geist text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors border border-orange-100"
                    >
                      Try a variant
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex items-center gap-2 p-3 text-[11px] font-geist text-gray-400">
            <svg className="animate-spin h-3.5 w-3.5 text-[#FF5B04]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Streaming suggestion...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Container */}
      <div className={`p-4 border-t border-black/5 bg-white flex flex-col flex-shrink-0 relative sticky bottom-0 z-10 ${
        !isProUser ? "filter blur-sm select-none pointer-events-none" : ""
      }`}>
        <form onSubmit={handleSend} className="bg-white border border-black/5 rounded-2xl p-2.5 flex flex-col gap-2.5 focus-within:ring-1 focus-within:ring-[#FF5B04]/20 transition-all shadow-sm">
          <textarea
            ref={textareaRef}
            disabled={loading}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Ask AI Co-pilot anything..."
            className="w-full text-xs font-geist bg-transparent outline-none resize-none placeholder-gray-400 text-gray-800"
            style={{ maxHeight: "112px", overflowY: "hidden" }}
          />
          <div className="flex items-center justify-between border-t border-black/[0.03] pt-2">
            <div className="flex items-center gap-1.5 relative">
              {/* Plus icon (commented out for now)
              <button
                type="button"
                className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-black/5 transition-all cursor-pointer"
                title="Add attachment"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
              */}

              {/* Model Pill Trigger */}
              <ModelSelectorPill
                selectedEngine={selectedEngine}
                selectedModel={selectedModel}
                onEngineChange={onEngineChange}
                onModelChange={onModelChange}
              />
            </div>

            <div className="flex items-center gap-1.5">
              {/* Microphone icon (commented out for now)
              <button
                type="button"
                className="w-7 h-7 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-black/5 transition-all cursor-pointer"
                title="Voice input"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              </button>
              */}

              {/* Send Button */}
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="w-7 h-7 rounded-xl bg-[#FF5B04] hover:opacity-95 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Frosted glass tier gate overlay */}
      {!isProUser && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 bg-white/60 backdrop-blur-md">
          <div className="w-11 h-11 bg-orange-50 rounded-full flex items-center justify-center border border-orange-100 mb-3 shadow-sm animate-pulse">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25" className="w-5 h-5 text-[#FF5B04]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h4 className="font-bold text-gray-800 text-xs font-geist tracking-wide">
            AI Conversation Thread
          </h4>
          <p className="text-[10px] text-gray-400 font-geist max-w-[200px] leading-relaxed mt-1 mb-4">
            Unlock bidirectional chat sessions, custom directives, and context persistence.
          </p>
          <button
            onClick={onUpgradeClick}
            className="px-4 py-2 rounded-xl text-[10px] font-bold font-geist text-white bg-[#FF5B04] hover:bg-orange-600 shadow-md transition-colors"
          >
            Upgrade to Pro
          </button>
        </div>
      )}
    </div>
  );
}

function ModelSelectorPill({
  selectedEngine,
  selectedModel,
  onEngineChange,
  onModelChange,
}: {
  selectedEngine: AIEngine;
  selectedModel: string;
  onEngineChange: (engine: AIEngine) => void;
  onModelChange: (model: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { models, isLoading } = useAIModels(selectedEngine);

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
        <div className="absolute bottom-full left-0 mb-1.5 w-64 bg-white border border-black/5 rounded-xl shadow-xl z-50 p-2 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="text-[9px] font-bold text-gray-400 font-jetbrains-mono uppercase tracking-wider px-1">
            AI Engine
          </div>
          {/* Engine tabs switcher */}
          <div className="flex bg-black/[0.03] p-0.5 rounded-lg gap-0.5 border border-black/[0.01]">
            {AI_PROVIDERS.map((provider) => (
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
