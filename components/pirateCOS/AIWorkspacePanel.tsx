"use client";

import React, { useState, useEffect, useRef } from "react";
import { Editor } from "@tiptap/react";
import { useAuth } from "@/hooks/useAuth";
import { useEditorSelection } from "@/hooks/useEditorSelection";
import { useAIWorkspaceSession } from "@/hooks/useAIWorkspaceSession";
import { AIEngine } from "@/lib/pirateCOS/ai-registry";

import ContextDisplay from "./workspace/ContextDisplay";
import QuickActions from "./workspace/QuickActions";
import ConversationThread from "./workspace/ConversationThread";
import GenerationHistory from "./workspace/GenerationHistory";
import CosIcon from "./CosIcon";
import UpgradePrompt from "./UpgradePrompt";

interface AIWorkspacePanelProps {
  postId: string | null;
  postType: string;
  contentGoal: string;
  editor: Editor | null;
  brandBrain?: any;
  onApplyToEditor: (text: string, mode: "replace" | "insert-below" | "insert-above") => void;
  onOpenRepurposingDrawer: () => void;
  
  // Unified Sidebar Props
  activeTab: "ai" | "content" | "seo" | "health" | "distribute" | null;
  onTabChange: (tab: "ai" | "content" | "seo" | "health" | "distribute" | null) => void;
  renderContentTab: () => React.ReactNode;
  renderSEOTab?: () => React.ReactNode;
  renderHealthTab: () => React.ReactNode;
  renderDistributeTab: () => React.ReactNode;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export default function AIWorkspacePanel({
  postId,
  postType,
  contentGoal,
  editor,
  brandBrain,
  onApplyToEditor,
  onOpenRepurposingDrawer,
  activeTab,
  onTabChange,
  renderContentTab,
  renderSEOTab,
  renderHealthTab,
  renderDistributeTab,
  initialPrompt,
  onClearInitialPrompt,
}: AIWorkspacePanelProps) {
  const { user } = useAuth();
  const isProUser = user ? ["pro", "enterprise", "starter"].includes(user.plan) : false;

  const { selectedText } = useEditorSelection(editor);
  const wordCount = selectedText ? selectedText.split(/\s+/).filter(Boolean).length : 0;

  const {
    messages,
    generations,
    snippetLibrary,
    uiPreferences,
    loading,
    error,
    sendMessage,
    triggerQuickAction,
    applyGeneration,
    saveSnippet,
    deleteSnippet,
    saveUIPreference,
    triggerVariant,
    clearSession,
  } = useAIWorkspaceSession(postId, null, onApplyToEditor);

  // View state & AI engine/model settings
  const [activeView, setActiveView] = useState<"chat" | "history" | "snippets">("chat");
  const [selectedEngine, setSelectedEngine] = useState<AIEngine>("gemini");
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // Width & resizing state
  const [width, setWidth] = useState(288);
  const [isResizing, setIsResizing] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Sync width to/from preferences
  useEffect(() => {
    if (uiPreferences?.panelWidth) {
      setWidth(uiPreferences.panelWidth);
    }
  }, [uiPreferences]);

  // Resizing mouse mousemove/mouseup handlers
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!panelRef.current) return;
      const rect = panelRef.current.getBoundingClientRect();
      // resizing is on the left edge of panel, so delta = rect.right - mouseX - 56 (rail width)
      const newWidth = Math.max(240, Math.min(400, rect.right - e.clientX - 56));
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      saveUIPreference({ panelWidth: width });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, width, saveUIPreference]);

  // Apply quick action handler
  const handleTriggerQuickAction = (actionId: string, tone?: string) => {
    triggerQuickAction(actionId, selectedText, tone, selectedEngine, selectedModel);
  };

  // Handle snippet click insertion
  const handleInsertSnippet = (snippet: string) => {
    if (editor) {
      editor.chain().focus().insertContent(snippet).run();
    }
  };

  const handleTabClick = (tab: "ai" | "content" | "seo" | "health" | "distribute") => {
    if (activeTab === tab) {
      onTabChange(null);
    } else {
      onTabChange(tab);
    }
  };

  const modelLabel = selectedModel.split("/").pop() || selectedModel;

  return (
    <>
      <div
        ref={panelRef}
        style={{ width: activeTab === null ? "56px" : `${width + 56}px` }}
        className="flex-shrink-0 flex items-stretch transition-all duration-300 relative border-l border-black/5 bg-[#F7F7F6] rounded-r-2xl"
      >
        {/* Resize Handler Handle */}
        {activeTab !== null && (
          <div
            ref={resizeRef}
            onMouseDown={startResizing}
            className="absolute top-0 left-0 bottom-0 w-1 cursor-col-resize hover:bg-[#FF5B04]/50 transition-colors z-30"
          />
        )}

        {/* Drawer content (visible only when expanded) */}
        {activeTab !== null && (
          <div style={{ width: `${width}px` }} className="flex-1 flex flex-col h-full overflow-hidden border-r border-black/5 bg-[#F7F7F6]">
            {activeTab === "ai" ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* AI Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 bg-white flex-shrink-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5B04]"></span>
                    </span>
                    <span className="text-xs font-bold text-gray-700 font-geist tracking-wide truncate">
                      {activeView === "chat" && "AI Co-pilot"}
                      {activeView === "history" && "Generation History"}
                      {activeView === "snippets" && "Snippet Library"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* New Chat (+) */}
                    <button
                      onClick={() => {
                        clearSession();
                        setActiveView("chat");
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-black/5 transition-all cursor-pointer"
                      title="New Chat Session"
                    >
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>

                    {/* Toggle History (clock) */}
                    <button
                      onClick={() => setActiveView(activeView === "history" ? "chat" : "history")}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        activeView === "history"
                          ? "text-[#FF5B04] bg-orange-50/50"
                          : "text-gray-400 hover:text-gray-700 hover:bg-black/5"
                      }`}
                      title="Generation History"
                    >
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>

                    {/* Toggle Snippets (...) */}
                    <button
                      onClick={() => setActiveView(activeView === "snippets" ? "chat" : "snippets")}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        activeView === "snippets"
                          ? "text-[#FF5B04] bg-orange-50/50"
                          : "text-gray-400 hover:text-gray-700 hover:bg-black/5"
                      }`}
                      title="Snippet Library"
                    >
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                      </svg>
                    </button>


                  </div>
                </div>

                {/* AI Body */}
                <div className="flex-1 flex flex-col min-h-0 overflow-y-auto p-4 space-y-4">
                  {activeView === "chat" && (
                    <>
                      {/* strategy context display */}
                      <ContextDisplay
                        postType={postType}
                        contentGoal={contentGoal}
                        brandVoice={brandBrain?.brandVoice}
                        focusKeyword={brandBrain?.targetKeywords?.[0]}
                        selectedTextLength={wordCount}
                      />

                      {/* quick actions grid */}
                      <QuickActions
                        selectedText={selectedText}
                        onTriggerAction={handleTriggerQuickAction}
                        onOpenRepurposingDrawer={onOpenRepurposingDrawer}
                        loading={loading}
                      />

                      {/* conversational chat card */}
                      <ConversationThread
                        messages={messages}
                        loading={loading}
                        onSendMessage={(content) => sendMessage(content, selectedText, selectedEngine, selectedModel)}
                        onApply={applyGeneration}
                        onSaveSnippet={saveSnippet}
                        onTriggerVariant={(genId) => triggerVariant(genId, selectedEngine, selectedModel)}
                        isProUser={isProUser}
                        onUpgradeClick={() => setUpgradeOpen(true)}
                        selectedEngine={selectedEngine}
                        selectedModel={selectedModel}
                        onEngineChange={setSelectedEngine}
                        onModelChange={setSelectedModel}
                        initialPrompt={initialPrompt}
                        onClearInitialPrompt={onClearInitialPrompt}
                      />
                    </>
                  )}

                  {activeView === "history" && (
                    <div className="flex-1 flex flex-col min-h-0">
                      <div className="flex items-center gap-2 mb-3">
                        <button
                          onClick={() => setActiveView("chat")}
                          className="text-[10px] font-bold text-[#FF5B04] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                          </svg>
                          Back to Chat
                        </button>
                      </div>
                      <div className="flex-1 min-h-0">
                        <GenerationHistory
                          generations={generations}
                          onApply={applyGeneration}
                          isProUser={isProUser}
                          onUpgradeClick={() => setUpgradeOpen(true)}
                          alwaysOpen={true}
                        />
                      </div>
                    </div>
                  )}

                  {activeView === "snippets" && (
                    <div className="flex-1 flex flex-col min-h-0">
                      <div className="flex items-center gap-2 mb-3">
                        <button
                          onClick={() => setActiveView("chat")}
                          className="text-[10px] font-bold text-[#FF5B04] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                          </svg>
                          Back to Chat
                        </button>
                      </div>

                      <div className="flex-1 flex flex-col min-h-[300px] bg-white rounded-2xl border border-black/5 shadow-sm p-4 space-y-4 overflow-hidden relative">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 font-geist">
                          <CosIcon name="tasks" size={14} className="text-gray-500" />
                          <span>Snippet Library</span>
                        </div>
                        {isProUser ? (
                          <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
                            {snippetLibrary.length === 0 ? (
                              <p className="text-[10px] text-gray-400 font-geist text-center py-6">
                                Snippet library is empty. Save generated outputs or selections as snippets.
                              </p>
                            ) : (
                              snippetLibrary.map((snip, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between gap-2 p-2.5 bg-gray-50 hover:bg-orange-50/10 border border-black/5 hover:border-[#FF5B04]/30 rounded-lg group transition-all"
                                >
                                  <button
                                    onClick={() => handleInsertSnippet(snip)}
                                    className="text-left text-[11px] text-gray-700 truncate font-geist flex-1"
                                    title="Click to insert at cursor"
                                  >
                                    {snip.replace(/<[^>]*>/g, "")}
                                  </button>
                                  <button
                                    onClick={() => deleteSnippet(snip)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all flex-shrink-0"
                                    title="Delete Snippet"
                                  >
                                    <CosIcon name="trash" size={12} />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        ) : (
                          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 bg-white/70 backdrop-blur-md">
                            <span className="text-xs font-bold text-gray-800 font-geist flex items-center gap-1.5">
                              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-[#FF5B04]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              Snippets Locked
                            </span>
                            <button
                              onClick={() => setUpgradeOpen(true)}
                              className="text-[10px] font-bold text-[#FF5B04] hover:underline mt-1"
                            >
                              Unlock with Pro
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Unified Settings Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 bg-white flex-shrink-0">
                  <span className="text-xs font-bold text-gray-700 font-geist tracking-wide">
                    {activeTab === "content" && (postType === "social-post" ? "Narrative Settings" : "Content Settings")}
                    {activeTab === "seo" && "SEO Configuration"}
                    {activeTab === "health" && "Content Health"}
                    {activeTab === "distribute" && "Distribution Settings"}
                  </span>

                </div>
                {/* Unified Settings Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeTab === "content" && renderContentTab()}
                  {activeTab === "seo" && renderSEOTab && renderSEOTab()}
                  {activeTab === "health" && renderHealthTab()}
                  {activeTab === "distribute" && renderDistributeTab()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Persistent Activity Rail on the right edge */}
        <div className="w-14 flex flex-col items-center py-4 gap-4 bg-[#F7F7F6] h-full flex-shrink-0 select-none border-l border-black/[0.03] rounded-r-2xl">
          {/* AI Collaborator (bot) */}
          <button
            onClick={() => handleTabClick("ai")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeTab === "ai"
                ? "bg-[#FF5B04] text-white shadow-md shadow-orange-500/10 scale-105"
                : "text-gray-400 hover:text-gray-700 hover:bg-black/5"
            }`}
            title="AI Co-pilot"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <rect height="12" rx="2" width="18" x="3" y="9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9V5m-4 0h8m-7 9h.01m5.99 0h.01M12 17h.01" />
            </svg>
          </button>

          <div className="h-px w-6 bg-black/[0.06]" />

          {/* Content / Narrative Settings */}
          <button
            onClick={() => handleTabClick("content")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeTab === "content"
                ? "bg-[#FF5B04] text-white shadow-md shadow-orange-500/10 scale-105"
                : "text-gray-400 hover:text-gray-700 hover:bg-black/5"
            }`}
            title={postType === "social-post" ? "Narrative Settings" : "Content Settings"}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

          {/* SEO (if renderSEOTab is provided) */}
          {renderSEOTab && (
            <button
              onClick={() => handleTabClick("seo")}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeTab === "seo"
                  ? "bg-[#FF5B04] text-white shadow-md shadow-orange-500/10 scale-105"
                  : "text-gray-400 hover:text-gray-700 hover:bg-black/5"
              }`}
              title="SEO Configuration"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
              </svg>
            </button>
          )}

          {/* Content Health */}
          <button
            onClick={() => handleTabClick("health")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeTab === "health"
                ? "bg-[#FF5B04] text-white shadow-md shadow-orange-500/10 scale-105"
                : "text-gray-400 hover:text-gray-700 hover:bg-black/5"
            }`}
            title="Content Health"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </button>

          {/* Share / Distribute */}
          <button
            onClick={() => handleTabClick("distribute")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeTab === "distribute"
                ? "bg-[#FF5B04] text-white shadow-md shadow-orange-500/10 scale-105"
                : "text-gray-400 hover:text-gray-700 hover:bg-black/5"
            }`}
            title="Distribution Settings"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* billing/upgrade prompt modal */}
      <UpgradePrompt
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        requiredCredits={1.0}
        currentCredits={0.0}
      />
    </>
  );
}
