"use client";

import React, { useState, useRef, useEffect } from "react";
import CosIcon from "../CosIcon";
import { AIWorkspaceMessage } from "@/hooks/useAIWorkspaceSession";
import { useAIModels } from "@/hooks/useAIModels";
import { AIEngine, AI_PROVIDERS } from "@/lib/pirateCOS/ai-registry";
import { ChatIdeaSuggestion } from "@/lib/pirateCOS/postTypeConfig";

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
  thinkingStatus?: string;
  onStop?: () => void;
  suggestions?: ChatIdeaSuggestion[];
  dynamicSuggestions: ChatIdeaSuggestion[] | null;
  suggestionsLoading: boolean;
  onSuggestMore: (brief: string, keywords: string) => void;
  onClearDynamicSuggestions: () => void;
  activeBrief: string;
  activeKeywords: string;
  postType: string;
  contentGoal: string;
}

// Phase 5.2: Feedback state type
type FeedbackStatus = "pending" | "accepted" | "rejected";

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
  thinkingStatus,
  onStop,
  suggestions = [],
  dynamicSuggestions,
  suggestionsLoading,
  onSuggestMore,
  onClearDynamicSuggestions,
  activeBrief,
  activeKeywords,
  postType,
  contentGoal,
}: ConversationThreadProps) {
  const [inputValue, setInputValue] = useState("");
  const [showBuilderForm, setShowBuilderForm] = useState(false);
  const [brief, setBrief] = useState("");
  const [keywords, setKeywords] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef(messages.length);

  // Phase 5.2: Feedback state - track feedback status per generation
  const [feedbackStatus, setFeedbackStatus] = useState<Record<string, FeedbackStatus>>({});

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
    const container = scrollContainerRef.current;
    if (!container) return;

    const isNewMessageAdded = messages.length !== lastMessageCountRef.current;
    lastMessageCountRef.current = messages.length;

    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 120;

    if (isNewMessageAdded || isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  // Phase 5.2: Submit feedback to RLHF API
  const submitFeedback = async (
    generationId: string,
    action: "accepted" | "rejected"
  ) => {
    // Optimistically update UI
    setFeedbackStatus((prev) => ({ ...prev, [generationId]: action }));

    try {
      const response = await fetch("/api/pirateCOS/ai-generation-log/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generationId, action }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      // Revert optimistic update on error
      setFeedbackStatus((prev) => ({ ...prev, [generationId]: "pending" }));
    }
  };

  // Phase 5.2: Handle accept feedback (and apply)
  const handleAcceptAndApply = (
    generationId: string,
    mode: "replace" | "insert-below" | "insert-above"
  ) => {
    submitFeedback(generationId, "accepted");
    onApply(generationId, mode);
  };

  return (
    <div className="relative flex-1 flex flex-col h-full min-h-0 w-full bg-white">
      {/* Messages list */}
      <div
        ref={scrollContainerRef}
        className={`flex-1 overflow-y-auto p-4 space-y-4 min-h-0 ${!isProUser ? "filter blur-sm select-none pointer-events-none" : ""}`}
      >
        {activeBrief && (
          <div className="bg-orange-50/40 border border-orange-100/30 rounded-xl p-3 flex items-center justify-between text-[11px] font-geist text-gray-700 animate-in fade-in duration-200 shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <CosIcon name="sparkles" size={13} className="text-[#FF5B04] shrink-0 animate-pulse" />
              <div className="truncate">
                <span className="font-bold text-gray-800">Chat Focus:</span> {activeBrief}
                {activeKeywords && (
                  <span className="text-gray-400"> (Keywords: {activeKeywords})</span>
                )}
              </div>
            </div>
            <button
              onClick={onClearDynamicSuggestions}
              className="text-gray-400 hover:text-gray-600 font-bold px-1.5 cursor-pointer bg-transparent border-none text-xs leading-none"
              title="Clear topic focus"
            >
              &times;
            </button>
          </div>
        )}

        {messages.length === 0 && !editorHasContent ? (
          <div className="space-y-5 py-4 max-w-sm mx-auto">
            <div className="text-center space-y-2 text-gray-400">
              <CosIcon name="bot" size={32} className="text-gray-300 mx-auto animate-bounce" />
              <p className="text-xs font-semibold font-geist text-gray-700">AI Conversation</p>
              <p className="text-[10px] leading-relaxed font-geist text-gray-500">
                Ask specific editing questions, request formatting tweaks, or draft inline sections.
              </p>
            </div>
            
            {showBuilderForm ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!brief.trim()) return;
                  onSuggestMore(brief, keywords);
                  setShowBuilderForm(false);
                }}
                className="bg-gray-50 border border-black/5 rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-geist">
                    What is this post about?
                  </label>
                  <input
                    type="text"
                    required
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    placeholder={getBriefPlaceholder(postType, contentGoal)}
                    className="w-full text-xs font-geist bg-white border border-black/5 rounded-lg px-3 py-2 outline-none focus:border-[#FF5B04]/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-geist">
                    Keywords (optional)
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder={getKeywordPlaceholder(postType)}
                    className="w-full text-xs font-geist bg-white border border-black/5 rounded-lg px-3 py-2 outline-none focus:border-[#FF5B04]/30"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={!brief.trim() || suggestionsLoading}
                    className="flex-1 text-[10px] font-bold text-white bg-[#FF5B04] hover:bg-orange-600 rounded-lg py-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Generate Ideas (0.1 credits)
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBuilderForm(false)}
                    className="text-[10px] font-semibold text-gray-500 hover:text-gray-700 bg-gray-200/60 hover:bg-gray-200 rounded-lg px-3 py-2 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : suggestionsLoading ? (
              <div className="p-6 bg-orange-50/5 border border-orange-100/30 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 animate-pulse">
                <svg className="animate-spin h-5 w-5 text-[#FF5B04]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-xs font-semibold text-gray-700 font-geist">Curating ideas...</span>
              </div>
            ) : (
              <div className="space-y-2.5 pt-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-jetbrains-mono px-1">
                  {dynamicSuggestions ? "Get started with custom ideas" : "Get started with an idea"}
                </p>
                <div className="space-y-1.5">
                  {(dynamicSuggestions || suggestions).map((idea) => (
                    <button
                      key={idea.label}
                      type="button"
                      disabled={loading}
                      onClick={() => setInputValue(idea.prompt)}
                      className="w-full text-left flex items-center gap-2.5 p-2.5 bg-white border border-black/5 rounded-xl hover:border-[#FF5B04]/30 hover:bg-orange-50/10 transition-all group cursor-pointer shadow-sm disabled:opacity-40"
                    >
                      <span className="text-xs font-medium font-geist text-gray-600 group-hover:text-[#FF5B04] transition-colors">
                        {idea.label}
                      </span>
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 ml-auto text-gray-300 group-hover:text-[#FF5B04] transition-colors flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  ))}
                </div>

                <div className="flex gap-2.5 pt-2 justify-center">
                  {dynamicSuggestions !== null ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowBuilderForm(true)}
                        className="text-[10px] font-bold text-[#FF5B04] hover:underline flex items-center gap-1 cursor-pointer border-none bg-transparent"
                      >
                        Suggest more ideas
                      </button>
                      <span className="text-gray-300 text-[10px]">•</span>
                      <button
                        type="button"
                        onClick={onClearDynamicSuggestions}
                        className="text-[10px] font-semibold text-gray-500 hover:underline flex items-center gap-1 cursor-pointer border-none bg-transparent"
                      >
                        Reset to default
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowBuilderForm(true)}
                      className="text-[10px] font-bold text-[#FF5B04] hover:underline flex items-center gap-1 cursor-pointer border-none bg-transparent"
                    >
                      Suggest custom ideas
                    </button>
                  )}
                </div>
              </div>
            )}
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

                  {/* Phase 4F: Change Summary Badge */}
                  {!isUser && msg.changeSummary && (
                    <div className="mb-2 p-2 bg-emerald-50/60 border border-emerald-200/60 rounded-lg flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold animate-in fade-in duration-200">
                      <span className="text-emerald-600">✏️</span>
                      <span>{msg.changeSummary}</span>
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
                  <div className="flex flex-col gap-2 mt-1 max-w-[90%]">
                    {/* Phase 5.2: Feedback buttons */}
                    {feedbackStatus[msg.associatedGenerationId] ? (
                      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50 rounded-md border border-gray-200">
                        <span className="text-[10px] font-semibold text-gray-600 font-geist">
                          {feedbackStatus[msg.associatedGenerationId] === "accepted" ? (
                            <>
                              <span className="text-green-600">✓</span> Accepted
                            </>
                          ) : (
                            <>
                              <span className="text-red-600">✗</span> Rejected
                            </>
                          )}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1 animate-in slide-in-from-top-1 duration-200">
                        {/* Accept/Reject feedback buttons */}
                        <button
                          onClick={() => submitFeedback(msg.associatedGenerationId!, "accepted")}
                          className="px-2 py-1 text-[10px] font-semibold font-geist text-green-700 bg-green-50 hover:bg-green-100 rounded-md transition-colors border border-green-200 flex items-center gap-1"
                          title="This output is good"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Accept
                        </button>
                        <button
                          onClick={() => submitFeedback(msg.associatedGenerationId!, "rejected")}
                          className="px-2 py-1 text-[10px] font-semibold font-geist text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors border border-red-200 flex items-center gap-1"
                          title="This output is not good"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </button>
                      </div>
                    )}

                    {/* Apply actions */}
                    <div className="flex flex-wrap gap-1 animate-in slide-in-from-top-1 duration-200">
                      {/* Phase 4F: Show "Recommended" badge on suggested apply mode */}
                      <button
                        onClick={() => handleAcceptAndApply(msg.associatedGenerationId!, "replace")}
                        className={`px-2 py-1 text-[10px] font-bold font-geist rounded-md transition-colors shadow-sm flex items-center gap-1 ${
                          msg.suggestedApplyMode === "replace"
                            ? "text-white bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-200"
                            : "text-white bg-black hover:bg-gray-800"
                        }`}
                      >
                        Replace selection
                        {msg.suggestedApplyMode === "replace" && (
                          <span className="text-[8px] px-1 py-0.5 bg-emerald-800/30 rounded-sm font-bold">REC</span>
                        )}
                      </button>
                      <button
                        onClick={() => handleAcceptAndApply(msg.associatedGenerationId!, "insert-below")}
                        className={`px-2 py-1 text-[10px] font-semibold font-geist rounded-md transition-colors flex items-center gap-1 ${
                          msg.suggestedApplyMode === "insert-below"
                            ? "text-white bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-200 font-bold"
                            : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        Insert below
                        {msg.suggestedApplyMode === "insert-below" && (
                          <span className="text-[8px] px-1 py-0.5 bg-emerald-800/30 rounded-sm font-bold">REC</span>
                        )}
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
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loading Spinner */}
        {loading && thinkingStatus && (
          <div className="flex flex-col gap-2 p-3 bg-orange-50/10 border border-orange-100/30 rounded-2xl max-w-[90%] animate-pulse">
            <div className="flex items-center gap-2 text-[11px] font-semibold font-geist text-gray-600">
              <svg className="animate-spin h-3.5 w-3.5 text-[#FF5B04]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="truncate max-w-[180px]">{thinkingStatus}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Container */}
      {!(showBuilderForm || suggestionsLoading) && (
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
              placeholder={getDynamicPlaceholder(postType, contentGoal)}
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
                {loading ? (
                  <button
                    type="button"
                    onClick={onStop}
                    className="w-7 h-7 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
                    title="Stop generating"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                      <rect x="6" y="6" width="12" height="12" rx="1.5" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="w-7 h-7 rounded-xl bg-[#FF5B04] hover:opacity-95 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      )}

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

function getDynamicPlaceholder(postType: string, contentGoal: string): string {
  const typeLabels: Record<string, string> = {
    blog: "blog post",
    tutorial: "step-by-step tutorial",
    "case-study": "case study",
    "community-insight": "community post",
    "corporate-post": "corporate announcement",
    "product-review": "product review",
    "product-launch": "product launch update",
    listicle: "listicle article",
    comparison: "comparison guide",
    newsletter: "newsletter digest",
    "social-post": "social media post",
  };

  const label = typeLabels[postType] || "content";

  switch (contentGoal) {
    case "traffic":
      return `Ask AI to optimize this ${label} for SEO keywords, write an FAQ schema, or improve heading readability...`;
    case "authority":
      return `Ask AI to cite statistics, insert credible data points, or refine the expert voice in this ${label}...`;
    case "conversion":
      return `Ask AI to write a high-converting CTA, outline product benefits, or address objections in this ${label}...`;
    case "engagement":
      return `Ask AI to write an attention-grabbing hook, draft open-ended questions, or rewrite this ${label} to drive shares...`;
    case "lead-generation":
      return `Ask AI to draft a teaser for a lead magnet, add a newsletter sign-up prompt, or design a downloadable checklist for this ${label}...`;
    case "retention":
      return `Ask AI to add advanced user tips, write step-by-step troubleshooting notes, or highlight help center links in this ${label}...`;
    default:
      return `Ask AI Co-pilot to write, edit, or optimize this ${label} based on your strategic goals...`;
  }
}

function getBriefPlaceholder(postType: string, contentGoal: string): string {
  switch (postType) {
    case "tutorial":
      return "e.g. Next.js App Router API caching tutorial";
    case "product-review":
      return "e.g. In-depth review of Apple AirPods Pro 2";
    case "comparison":
      return "e.g. comparison between Slack and Microsoft Teams";
    case "newsletter":
      return "e.g. Weekly tech roundup newsletter covering AI news";
    case "social-post":
      return "e.g. LinkedIn post sharing lessons from a startup launch";
    case "listicle":
      return "e.g. 7 best productivity tools for remote developers";
    case "case-study":
      return "e.g. How we helped client X increase sales by 40%";
    default:
      return "e.g. A comprehensive guide on [your topic]";
  }
}

function getKeywordPlaceholder(postType: string): string {
  switch (postType) {
    case "tutorial":
      return "e.g. nextjs, api, cache, react";
    case "product-review":
      return "e.g. review, airpods, apple, audio";
    case "social-post":
      return "e.g. startup, leadership, startup-lessons";
    default:
      return "e.g. keyword1, keyword2";
  }
}
