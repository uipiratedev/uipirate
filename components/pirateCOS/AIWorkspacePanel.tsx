"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Editor } from "@tiptap/react";
import { useAuth } from "@/hooks/useAuth";
import { useEditorSelection } from "@/hooks/useEditorSelection";
import { useAIWorkspaceSession } from "@/hooks/useAIWorkspaceSession";
import { AIEngine } from "@/lib/pirateCOS/ai-registry";
import { getChatSuggestions, getFeatures } from "@/lib/pirateCOS/postTypeConfig";
import { CTA_TEMPLATES, renderCTAHtml } from "@/lib/pirateCOS/cta-template";

import FocusKeywordStrip from "./workspace/ContextDisplay";
import ActionChips from "./workspace/QuickActions";
import ConversationThread from "./workspace/ConversationThread";
import GenerationHistory from "./workspace/GenerationHistory";
import CosIcon from "./CosIcon";
import UpgradePrompt from "./UpgradePrompt";
import { HelpTutorialCarousel } from "./WorkspaceTutorialCarousel";
import { ModelSelectorPill } from "./ModelSelectorPill";
import TransformTab from "./TransformTab";

interface AIWorkspacePanelProps {
  postId: string | null;
  postType: string;
  contentGoal: string;
  editor: Editor | null;
  brandBrain?: any;
  onApplyToEditor: (text: string, mode: "replace" | "insert-below" | "insert-above") => void;
  onOpenRepurposingDrawer?: () => void;
  onInsertCTA?: (html: string) => void;

  // Unified Sidebar Props
  activeTab: "ai" | "rewrite" | "content" | "seo" | "health" | "distribute" | "version" | "transform" | null;
  onTabChange: (tab: "ai" | "rewrite" | "content" | "seo" | "health" | "distribute" | "version" | "transform" | null) => void;
  renderContentTab: () => React.ReactNode;
  renderSEOTab?: () => React.ReactNode;
  renderHealthTab: () => React.ReactNode;
  renderDistributeTab: () => React.ReactNode;
  renderVersionTab?: () => React.ReactNode;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;

  // Spinoff / Transform Props
  postTitle?: string;
  repurposedOutputs?: Record<string, string>;
  onUpdateRepurposedOutputs?: (outputs: Record<string, string>) => void;
  selectedTransformFormat?: string | null;
  setSelectedTransformFormat?: (format: string | null) => void;

  // SEO focus keyword sync
  seoFocusKeyword?: string;
  onSetFocusKeyword?: (kw: string) => void;
}

const PANEL_DESCRIPTIONS: Record<string, string> = {
  ai:       "Chat with AI to write, edit, and improve your content",
  rewrite:  "Apply quick presets and custom directions to selected text",
  content:  "Configure platform settings, tags, and excerpt",
  seo:      "Set keywords and metadata for search engines",
  health:   "Real-time scores for writing quality and readiness",
  distribute: "Publish to connected platforms and create spin-offs",
  version:  "View, compare, and restore previous versions of your post",
  transform: "Repurpose your post into 8 distinct formats with high-fidelity previews",
};


const HELP_TAB_ICONS: Record<string, string> = {
  ai: "chat",
  history: "list",
  snippets: "heart",
  rewrite: "edit",
  content: "traffic",
  seo: "search",
  health: "traffic",
  distribute: "bolt",
  version: "clock",
  transform: "bolt",
};

const HELP_TAB_COLORS: Record<string, { bgClass: string; textClass: string; accentColor: string }> = {
  ai: { bgClass: "bg-[#FF5B04]/10", textClass: "text-[#FF5B04]", accentColor: "#FF5B04" },
  history: { bgClass: "bg-purple-50", textClass: "text-purple-600", accentColor: "#9333ea" },
  snippets: { bgClass: "bg-pink-50", textClass: "text-pink-600", accentColor: "#ec4899" },
  rewrite: { bgClass: "bg-amber-50", textClass: "text-amber-600", accentColor: "#d97706" },
  content: { bgClass: "bg-blue-50", textClass: "text-blue-600", accentColor: "#2563eb" },
  seo: { bgClass: "bg-emerald-50", textClass: "text-emerald-600", accentColor: "#059669" },
  health: { bgClass: "bg-teal-50", textClass: "text-teal-600", accentColor: "#0d9488" },
  distribute: { bgClass: "bg-indigo-50", textClass: "text-indigo-600", accentColor: "#4f46e5" },
  version: { bgClass: "bg-gray-50", textClass: "text-gray-600", accentColor: "#6b7280" },
  transform: { bgClass: "bg-violet-50", textClass: "text-violet-600", accentColor: "#7c3aed" },
};


const helpContent: Record<string, { title: string; badge: string; description: React.ReactNode }> = {
  ai: {
    title: "AI Co-pilot Guide",
    badge: "Chat Assistant",
    description: (
      <div className="space-y-2.5 text-[11px] font-geist">
        <p className="text-gray-500 font-medium">The <strong>AI Co-pilot</strong> is your interactive writing partner. Key capabilities:</p>
        <div className="space-y-2">
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="chat" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">Contextual Writing</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Chat with AI to draft articles, outline ideas, or continue writing sections of your editor content.</p>
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="sparkles" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">Dynamic Suggestions</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Click tailored suggestion chips generated dynamically based on your content type and goal.</p>
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="bolt" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">Multi-Engine Access</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Switch between major model pools (like Google Gemini) using the engine selectors.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  history: {
    title: "Generation History Guide",
    badge: "Session Log",
    description: (
      <div className="space-y-2.5 text-[11px] font-geist">
        <p className="text-gray-500 font-medium">The <strong>Generation History</strong> tab tracks all texts generated by the AI during this session:</p>
        <div className="space-y-2">
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="list" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">Browse History</p>
              <p className="text-gray-400 mt-0.5 leading-snug">View previous outputs chronologically to review previous ideas or copy alternative text.</p>
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="check" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">One-Click Insert</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Re-insert or replace editor text with any historical generation item instantly.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  snippets: {
    title: "Snippet Library Guide",
    badge: "Saved Snippets",
    description: (
      <div className="space-y-2.5 text-[11px] font-geist">
        <p className="text-gray-500 font-medium">The <strong>Snippet Library</strong> lets you save and reuse generated content:</p>
        <div className="space-y-2">
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="heart" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">Save Outputs</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Save custom paragraphs, CTAs, or definitions by clicking the bookmark/snippet icon on any generated chat message.</p>
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="sparkles" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">Quick Insert</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Insert saved snippets anywhere in your editor with a single tap.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  rewrite: {
    title: "Quick Suggestions Guide",
    badge: "Rewrite Tool",
    description: (
      <div className="space-y-2.5 text-[11px] font-geist">
        <p className="text-gray-500 font-medium">The <strong>Rewrite Tool</strong> polishes and modifies highlighted editor text instantly:</p>
        <div className="space-y-2">
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="edit" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">Select Text First</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Select any block of text in the editor to activate this panel.</p>
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="briefcase" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">Directives & Tone</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Toggle presets (Improve flow, shorten, expand) or select a custom writing voice (Professional, Conversational, Technical, Bold, Empathetic).</p>
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="check" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">Apply Options</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Replace your selection directly, or insert the result below it.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  content: {
    title: "Content Settings Guide",
    badge: "Metadata Config",
    description: (
      <div className="space-y-2.5 text-[11px] font-geist">
        <p className="text-gray-500 font-medium">The <strong>Content Settings</strong> tab manages structural metrics and attributes:</p>
        <div className="space-y-2">
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="traffic" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">Real-time Analytics</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Keep track of live word counts, character limits, paragraph structures, and estimated read times.</p>
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="sparkles" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">AI Title Optimizer</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Use instructions and constraints to generate optimized, highly-clickable headlines.</p>
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="list" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">Tags & Excerpts</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Write summary descriptions or ask the AI to recommend tags for the post.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  seo: {
    title: "SEO & Metadata Guide",
    badge: "Google Optimization",
    description: (
      <div className="space-y-2.5 text-[11px] font-geist">
        <p className="text-gray-500 font-medium">The <strong>SEO & Metadata</strong> tab helps optimize your search engine footprint:</p>
        <div className="space-y-2">
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="search" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">Focus Keyword</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Target a search term and monitor how well your post title, headings, and intro text integrate it.</p>
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="megaphone" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">Google Preview</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Enter SEO titles and descriptions, keeping an eye on the character length indicators.</p>
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="sparkles" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">AI Metadata Generation</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Ask the AI to read your post and automatically suggest highly optimized titles, descriptions, and keywords.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  health: {
    title: "Content Health Guide",
    badge: "Health Score",
    description: (
      <div className="space-y-2.5 text-[11px] font-geist">
        <p className="text-gray-500 font-medium">The <strong>Content Health</strong> panel monitors publication readiness in real time:</p>
        <div className="space-y-2">
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="traffic" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">Weighted Scoring</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Calculates a score from 0-100 based on strategic priorities (traffic, conversion, engagement, etc.).</p>
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="edit" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">Granular Metrics</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Click Readability, Engagement, Structure, SEO, or CTA categories to view specific optimization recommendations.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  distribute: {
    title: "Distribute Guide",
    badge: "Amplify Content",
    description: (
      <div className="space-y-2.5 text-[11px] font-geist">
        <p className="text-gray-500 font-medium">The <strong>Distribute</strong> tab helps publish your content to external platforms:</p>
        <div className="space-y-2">
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="bolt" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">Publish Presets</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Tap a preset growth chain (like SEO Growth or Founder Authority) to auto-configure channels.</p>
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="refresh" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">AI Repurposing</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Automatically generate promotional spin-offs (like LinkedIn posts, Twitter threads, or digests) to maximize post reach.</p>
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="check" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">Publishing Status</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Connect integrations, push posts live, or retry failed transfers.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  version: {
    title: "Version History Guide",
    badge: "Time Travel",
    description: (
      <div className="space-y-2.5 text-[11px] font-geist">
        <p className="text-gray-500 font-medium">The <strong>Version History</strong> tab tracks all saved versions of your post:</p>
        <div className="space-y-2">
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="clock" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">Automatic Snapshots</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Every time you save or publish, a new version is automatically created with a timestamp and preview.</p>
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="refresh" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">Restore Previous Versions</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Click any version to expand it, then click "Restore" to revert your post to that exact state.</p>
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-orange-50 text-[#FF5B04] flex items-center justify-center shrink-0">
              <CosIcon name="list" size={11} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[11px]">Version Timeline</p>
              <p className="text-gray-400 mt-0.5 leading-snug">Browse the complete history chronologically, with each version showing major or minor change indicators.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
};

export default function AIWorkspacePanel({
  postId,
  postType,
  contentGoal,
  editor,
  brandBrain,
  onApplyToEditor,
  onOpenRepurposingDrawer,
  onInsertCTA,
  activeTab,
  onTabChange,
  renderContentTab,
  renderSEOTab,
  renderHealthTab,
  renderDistributeTab,
  renderVersionTab,
  initialPrompt,
  onClearInitialPrompt,
  seoFocusKeyword,
  onSetFocusKeyword,
  repurposedOutputs = {},
  onUpdateRepurposedOutputs,
  selectedTransformFormat = null,
  setSelectedTransformFormat,
  postTitle = "",
}: AIWorkspacePanelProps) {
  const { user } = useAuth();
  const isSubdomain =
    typeof window !== "undefined" &&
    (window.location.hostname.startsWith("cos.") ||
      window.location.hostname === "cos.uipirate.com");
  const getHref = (path: string) => (isSubdomain ? path : `/pirateCOS${path}`);
  const isProUser = user ? ["pro", "enterprise", "starter"].includes(user.plan) : false;

  const { selectedText } = useEditorSelection(editor);
  const wordCount = selectedText ? selectedText.split(/\s+/).filter(Boolean).length : 0;

  // Workspace-level actions (consolidated from former editor toolbar)
  const panelFeatures = getFeatures(postType);
  const showTransformAction = postType !== "social-post";
  const showInsertCtaAction = !!panelFeatures?.ctaBlocks && !!onInsertCTA;
  const showWorkspaceActions = showTransformAction || showInsertCtaAction;

  const [ctaPickerOpen, setCtaPickerOpen] = useState(false);
  const ctaPickerRef = useRef<HTMLDivElement>(null);
  const [activeQuickTab, setActiveQuickTab] = useState<"edits" | "transform" | "cta">("edits");


  useEffect(() => {
    if (!ctaPickerOpen) return;
    const handler = (e: MouseEvent) => {
      if (ctaPickerRef.current && !ctaPickerRef.current.contains(e.target as Node)) {
        setCtaPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ctaPickerOpen]);

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
    // Decoupled Rewrite quick action states
    rewriteOutput,
    rewriteLoading,
    rewriteError,
    runRewriteAction,
    clearRewriteOutput,
    // Thinking & Streaming
    thinkingStatus,
    stopGeneration,
    // Dynamic suggestions
    dynamicSuggestions,
    suggestionsLoading,
    loadDynamicSuggestions,
    clearDynamicSuggestions,
    activeBrief,
    activeKeywords,
  } = useAIWorkspaceSession(postId, null, onApplyToEditor);

  // View state & AI engine/model settings
  const [activeView, setActiveView] = useState<"chat" | "history" | "snippets">("chat");
  const [selectedEngine, setSelectedEngine] = useState<AIEngine>("gemini");
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [helpTab, setHelpTab] = useState<string | null>(null);

  // Track whether editor has content (reactive)
  const [editorHasContent, setEditorHasContent] = useState(false);

  useEffect(() => {
    if (!editor) { setEditorHasContent(false); return; }
    const update = () => setEditorHasContent(!editor.isEmpty);
    editor.on("update", update);
    update();
    return () => { editor.off("update", update); };
  }, [editor]);

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

  // Resizing handlers
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    // Set cursor to col-resize on body during resize
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      if (!panelRef.current) return;

      // Direct DOM manipulation for instant response
      const rect = panelRef.current.getBoundingClientRect();
      const newWidth = Math.max(260, Math.min(420, rect.right - e.clientX - 56));

      // Update width directly via style for instant visual feedback
      panelRef.current.style.width = `${newWidth + 56}px`;
    };

    const handleMouseUp = () => {
      if (!panelRef.current) return;

      // Calculate final width and update React state once
      const rect = panelRef.current.getBoundingClientRect();
      const finalWidth = Math.max(260, Math.min(420, rect.right - rect.left - 56));

      setWidth(finalWidth);
      setIsResizing(false);
      saveUIPreference({ panelWidth: finalWidth });

      // Reset cursor
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      // Cleanup cursor
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, saveUIPreference]);

  const handleTriggerRewriteAction = (actionId: string | string[], tone?: string, instruction?: string) => {
    runRewriteAction(actionId, selectedText, tone, selectedEngine, selectedModel, instruction);
  };

  const handleInsertSnippet = (snippet: string) => {
    if (editor) {
      editor.chain().focus().insertContent(snippet).run();
    }
  };

  const handleTabClick = (tab: "ai" | "rewrite" | "content" | "seo" | "health" | "distribute" | "version" | "transform") => {
    if (activeTab === tab) {
      onTabChange(null);
    } else {
      onTabChange(tab);
    }
  };

  return (
    <>
      <div
        ref={panelRef}
        style={{ width: activeTab === null ? "56px" : `${width + 56}px` }}
        className={`flex-shrink-0 flex items-stretch relative border-l border-black/5 bg-[#F7F7F6] rounded-r-2xl h-full ${isResizing ? '' : 'transition-all duration-300'}`}
      >
        {/* Resize Handle */}
        {activeTab !== null && (
          <div
            ref={resizeRef}
            onMouseDown={startResizing}
            className="absolute top-0 left-0 bottom-0 w-1 cursor-col-resize bg-black/10 hover:bg-[#FF5B04]/60 active:bg-[#FF5B04] transition-colors z-30"
          />
        )}

        {/* Drawer content */}
        <div
          style={{
            width: `${width}px`,
            opacity: activeTab === null ? 0 : 1,
            pointerEvents: activeTab === null ? 'none' : 'auto'
          }}
          className="flex-1 flex flex-col h-full overflow-hidden border-r border-black/5 bg-[#F7F7F6] transition-opacity duration-300"
        >
            {activeTab === "rewrite" ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Rewrite Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 bg-white flex-shrink-0 h-[52px]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-bold text-gray-700 font-geist tracking-wide truncate">
                      Quick Suggestions
                    </span>
                    <button
                      type="button"
                      onClick={() => setHelpTab("rewrite")}
                      className="w-5 h-5 rounded-full flex items-center justify-center border border-black/5 bg-white text-gray-500 hover:text-[#FF5B04] hover:bg-orange-50 hover:border-orange-200 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer font-bold text-[10px] shrink-0"
                      title="Open help"
                    >
                      ?
                    </button>
                  </div>
                  <ModelSelectorPill
                    selectedEngine={selectedEngine}
                    selectedModel={selectedModel}
                    onEngineChange={setSelectedEngine}
                    onModelChange={setSelectedModel}
                  />
                </div>
                {/* Rewrite Body */}
                <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                  {/* Tabs Header */}
                  <div className="flex items-center gap-1 px-4 py-2 border-b border-black/5 bg-gray-50/50 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveQuickTab("edits")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold font-geist transition-all ${
                        activeQuickTab === "edits"
                          ? "bg-[#FF5B04] text-white shadow-sm"
                          : "text-gray-600 hover:bg-white hover:text-gray-900"
                      }`}
                    >
                      <CosIcon name="edit" size={12} />
                      Quick Edits
                    </button>
                    {showTransformAction && (
                      <button
                        type="button"
                        onClick={() => setActiveQuickTab("transform")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold font-geist transition-all ${
                          activeQuickTab === "transform"
                            ? "bg-[#FF5B04] text-white shadow-sm"
                            : "text-gray-600 hover:bg-white hover:text-gray-900"
                        }`}
                      >
                        <CosIcon name="bolt" size={12} />
                        Transform
                      </button>
                    )}
                    {showInsertCtaAction && (
                      <button
                        type="button"
                        onClick={() => setActiveQuickTab("cta")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold font-geist transition-all ${
                          activeQuickTab === "cta"
                            ? "bg-[#FF5B04] text-white shadow-sm"
                            : "text-gray-600 hover:bg-white hover:text-gray-900"
                        }`}
                      >
                        <CosIcon name="megaphone" size={12} />
                        Insert CTA
                      </button>
                    )}
                  </div>

                  {/* Tab Content */}
                  <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 min-h-0">
                    {/* Quick Edits Tab */}
                    {activeQuickTab === "edits" && (
                      <div className="space-y-3 animate-in fade-in duration-200 pb-20">
                        <FocusKeywordStrip
                          postType={postType}
                          focusKeyword={seoFocusKeyword}
                          onSetFocusKeyword={onSetFocusKeyword}
                          selectedTextLength={wordCount}
                        />

                        <ActionChips
                          editorHasContent={editorHasContent}
                          onTriggerAction={handleTriggerRewriteAction}
                          loading={rewriteLoading}
                          selectedText={selectedText}
                          onSwitchToChat={() => onTabChange("ai")}
                        />
                      </div>
                    )}

                    {/* Transform Tab — redirects to dedicated sidebar tab */}
                    {activeQuickTab === "transform" && showTransformAction && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <div className="p-4 bg-orange-50/40 border border-orange-100/50 rounded-2xl space-y-3 shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-500/10" style={{ background: "#FF5B04" }}>
                              <CosIcon name="bolt" size={16} className="text-white fill-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="text-sm font-bold text-gray-900 font-geist">
                                  Transformation Hub
                                </h3>
                                <span className="text-[9px] font-extrabold text-[#FF5B04] bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                  New
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-600 leading-relaxed mt-1">
                                Repurpose your content into 8 formats — Twitter threads, newsletters, LinkedIn posts, and more — with rich previews right here in the sidebar.
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => onTabChange("transform")}
                            className="w-full px-4 py-3 rounded-xl text-white text-sm font-bold font-geist shadow-md hover:shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                            style={{ background: "#FF5B04" }}
                          >
                            <CosIcon name="bolt" size={14} className="text-white fill-white group-hover:scale-110 transition-transform" />
                            Open Transformation Hub
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CTA Tab */}
                    {activeQuickTab === "cta" && showInsertCtaAction && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="px-1 py-0.5">
                          <p className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-widest text-gray-400">
                            Choose a Template
                          </p>
                        </div>
                        <div className="space-y-2">
                          {CTA_TEMPLATES.map((tpl) => (
                            <button
                              key={tpl.id}
                              type="button"
                              onClick={() => {
                                onInsertCTA?.(renderCTAHtml(tpl));
                              }}
                              className="w-full text-left p-4 rounded-2xl bg-white hover:bg-orange-50 border border-black/5 hover:border-[#FF5B04]/30 transition-all group cursor-pointer shadow-sm hover:shadow-md"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center flex-shrink-0 transition-colors">
                                  <CosIcon name="megaphone" size={16} className="text-[#FF5B04]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-bold font-geist text-gray-900 group-hover:text-[#FF5B04] transition-colors mb-1">
                                    {tpl.name}
                                  </div>
                                  <div className="text-[11px] font-geist text-gray-600 leading-relaxed">
                                    {tpl.description}
                                  </div>
                                  <div className="mt-2 pt-2 border-t border-black/5">
                                    <div className="text-[10px] text-gray-500">
                                      <span className="font-bold">Preview:</span> {tpl.title}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Common outputs - sticky at bottom */}
                  <div className="flex-shrink-0 border-t border-black/5 bg-white p-4">
                  {/* Rewrite Loading State */}
                  {rewriteLoading && thinkingStatus && (
                    <div className="p-4 bg-gray-50 border border-black/5 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center space-y-3.5 animate-pulse">
                      <svg className="animate-spin h-5 w-5 text-[#FF5B04]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-xs font-semibold text-gray-700 font-geist">{thinkingStatus}</span>
                    </div>
                  )}

                  {/* Rewrite Error State */}
                  {rewriteError && (
                    <div className="p-3.5 bg-red-50/50 border border-red-100 rounded-2xl space-y-2 text-red-600">
                      <div className="flex items-center gap-1.5 text-xs font-bold font-geist text-red-600">
                        <CosIcon name="warning" size={12} className="text-red-500 shrink-0" />
                        <span>Rewrite Failed</span>
                      </div>
                      <p className="text-[10px] leading-relaxed font-geist text-red-500">{rewriteError}</p>
                    </div>
                  )}

                  {/* Rewrite Output Card */}
                  {rewriteOutput !== null && (
                    <div className="bg-white border border-black/5 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col max-h-[400px]">
                      <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
                        <div className="flex items-center gap-1.5">
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-[#FF5B04]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-1.813-5.096L2.096 15 7.187 13.187 9 8.096l1.813 5.091L15.904 15l-5.091 1.813z" />
                          </svg>
                          <span className="text-xs font-bold text-gray-700 font-geist tracking-wide">
                            AI Suggested Rewrite
                          </span>
                        </div>

                        {!rewriteLoading && (
                          <button
                            onClick={clearRewriteOutput}
                            className="w-5 h-5 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-black/5 transition-colors cursor-pointer"
                            title="Discard suggestion"
                          >
                            &times;
                          </button>
                        )}
                      </div>

                      <div
                        className="ai-prose bg-orange-50/5 p-3 mx-4 rounded-xl border border-orange-100/30 flex-1 overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: rewriteOutput }}
                      />

                      {rewriteLoading ? (
                        <div className="flex items-center gap-2 px-4 py-3 border-t border-black/5 bg-gray-50/50 flex-shrink-0">
                          <button
                            type="button"
                            onClick={stopGeneration}
                            className="px-3 py-1.5 text-[10px] font-bold font-geist text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                          >
                            <span className="h-1.5 w-1.5 bg-white rounded-full animate-ping" />
                            Stop Generating
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 items-center px-4 py-3 border-t border-black/5 bg-gray-50/50 flex-shrink-0">
                          <button
                            onClick={() => {
                              onApplyToEditor(rewriteOutput, "replace");
                              clearRewriteOutput();
                            }}
                            className="px-2.5 py-1 text-[10px] font-bold font-geist text-white bg-black hover:bg-gray-800 rounded-md transition-colors shadow-sm cursor-pointer"
                          >
                            Replace selection
                          </button>
                          <button
                            onClick={() => {
                              onApplyToEditor(rewriteOutput, "insert-below");
                              clearRewriteOutput();
                            }}
                            className="px-2.5 py-1 text-[10px] font-semibold font-geist text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
                          >
                            Insert below
                          </button>
                          
                          {/* Copy button */}
                          <button
                            onClick={() => {
                              const plainText = rewriteOutput.replace(/<[^>]*>/g, "");
                              navigator.clipboard.writeText(plainText);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer border border-black/5"
                            title={copied ? "Copied!" : "Copy to clipboard"}
                          >
                            {copied ? (
                              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" className="w-3 h-3 text-green-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            ) : (
                              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                              </svg>
                            )}
                          </button>

                          {/* Save snippet */}
                          <button
                            onClick={() => {
                              saveSnippet(rewriteOutput);
                            }}
                            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-[#FF5B04] hover:bg-orange-50 transition-colors cursor-pointer border border-black/5"
                            title="Save as snippet"
                          >
                            <CosIcon name="tasks" size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  </div>
                </div>
              </div>
            ) : activeTab === "ai" ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* AI Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 bg-white flex-shrink-0 h-[52px]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {activeView === "chat" && (
                      <span className="relative flex h-2 w-2 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5B04]"></span>
                      </span>
                    )}
                    <span className="text-xs font-bold text-gray-700 font-geist tracking-wide truncate">
                      {activeView === "chat" && "AI Co-pilot"}
                      {activeView === "history" && "Generation History"}
                      {activeView === "snippets" && "Snippet Library"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setHelpTab(activeView === "chat" ? "ai" : activeView === "history" ? "history" : "snippets")}
                      className="w-5 h-5 rounded-full flex items-center justify-center border border-black/5 bg-white text-gray-500 hover:text-[#FF5B04] hover:bg-orange-50 hover:border-orange-200 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer font-bold text-[10px] shrink-0"
                      title="Open help"
                    >
                      ?
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* New Chat (+) */}
                    <button
                      onClick={() => { clearSession(); setActiveView("chat"); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-black/5 transition-all cursor-pointer"
                      title="New Chat Session"
                    >
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>

                    {/* History */}
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

                    {/* Snippets */}
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
                <div className={`flex-1 flex flex-col min-h-0 ${activeView === "chat" ? "overflow-hidden" : "overflow-y-auto p-4 space-y-3"}`}>
                  {activeView === "chat" && (
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
                      editorHasContent={editorHasContent}
                      thinkingStatus={thinkingStatus}
                      onStop={stopGeneration}
                      suggestions={getChatSuggestions(postType, contentGoal as any)}
                      dynamicSuggestions={dynamicSuggestions}
                      suggestionsLoading={suggestionsLoading}
                      onSuggestMore={(brief: string, keywords: string) => loadDynamicSuggestions(brief, keywords, selectedEngine, selectedModel)}
                      onClearDynamicSuggestions={clearDynamicSuggestions}
                      activeBrief={activeBrief}
                      activeKeywords={activeKeywords}
                      postType={postType}
                      contentGoal={contentGoal}
                    />
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
                                Snippet library is empty. Save generated outputs as snippets to reuse them.
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
                <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 bg-white flex-shrink-0 h-[52px]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-bold text-gray-700 font-geist tracking-wide truncate">
                      {activeTab === "content" && (postType === "social-post" ? "Narrative Settings" : "Content Settings")}
                      {activeTab === "seo" && "SEO & Metadata"}
                      {activeTab === "health" && "Content Health"}
                      {activeTab === "distribute" && "Distribute"}
                      {activeTab === "version" && "Version History"}
                      {activeTab === "transform" && "Transform"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setHelpTab(activeTab)}
                      className="w-5 h-5 rounded-full flex items-center justify-center border border-black/5 bg-white text-gray-500 hover:text-[#FF5B04] hover:bg-orange-50 hover:border-orange-200 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer font-bold text-[10px] shrink-0"
                      title="Open help"
                    >
                      ?
                    </button>
                  </div>
                  {activeTab !== "version" && activeTab !== "transform" && (
                    <ModelSelectorPill
                      selectedEngine={selectedEngine}
                      selectedModel={selectedModel}
                      onEngineChange={setSelectedEngine}
                      onModelChange={setSelectedModel}
                    />
                  )}
                </div>
                {/* Unified Settings Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeTab === "content" && renderContentTab()}
                  {activeTab === "seo" && renderSEOTab && renderSEOTab()}
                  {activeTab === "health" && renderHealthTab()}
                  {activeTab === "distribute" && renderDistributeTab()}
                  {activeTab === "version" && renderVersionTab && renderVersionTab()}
                  {activeTab === "transform" && (
                    <TransformTab
                      postId={postId}
                      postTitle={postTitle}
                      repurposedOutputs={repurposedOutputs}
                      onUpdateRepurposedOutputs={onUpdateRepurposedOutputs}
                      selectedFormat={selectedTransformFormat}
                      setSelectedFormat={setSelectedTransformFormat || (() => {})}
                    />
                  )}
                </div>
              </div>
            )}
        </div>

        {/* Persistent Activity Rail on the right edge */}
        <div className="w-14 flex flex-col items-center py-4 gap-4 bg-[#F7F7F6] h-full flex-shrink-0 select-none border-l border-black/[0.03] rounded-r-2xl">
          {/* AI Co-pilot */}
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

          {/* Quick Suggestions / Rewrite */}
          <button
            onClick={() => handleTabClick("rewrite")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeTab === "rewrite"
                ? "bg-[#FF5B04] text-white shadow-md shadow-orange-500/10 scale-105"
                : "text-gray-400 hover:text-gray-700 hover:bg-black/5"
            }`}
            title="Quick Suggestions"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-1.813-5.096L2.096 15 7.187 13.187 9 8.096l1.813 5.091L15.904 15l-5.091 1.813z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 5.5L16 8l2.5 2.5L21 8l-2.5-2.5zM6 4L4.5 5.5L6 7l1.5-1.5L6 4z" />
            </svg>
          </button>

          <div className="h-px w-6 bg-black/[0.06]" />

          {/* Content Settings */}
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

          {/* SEO */}
          {renderSEOTab && (
            <button
              onClick={() => handleTabClick("seo")}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeTab === "seo"
                  ? "bg-[#FF5B04] text-white shadow-md shadow-orange-500/10 scale-105"
                  : "text-gray-400 hover:text-gray-700 hover:bg-black/5"
              }`}
              title="SEO & Metadata"
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

          {/* Distribute */}
          <button
            onClick={() => handleTabClick("distribute")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeTab === "distribute"
                ? "bg-[#FF5B04] text-white shadow-md shadow-orange-500/10 scale-105"
                : "text-gray-400 hover:text-gray-700 hover:bg-black/5"
            }`}
            title="Distribute"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
              <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
            </svg>
          </button>

          {/* Transform Tab Button */}
          {showTransformAction && (
            <button
              onClick={() => handleTabClick("transform")}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeTab === "transform"
                  ? "text-white shadow-md shadow-orange-500/10 scale-105"
                  : "text-gray-400 hover:text-[#FF5B04] hover:bg-orange-50/50"
              }`}
              style={activeTab === "transform" ? { background: "#FF5B04" } : {}}
              title="Transform / Spinoffs"
            >
              <CosIcon name="bolt" size={20} className={activeTab === "transform" ? "text-white" : "text-gray-400"} />
            </button>
          )}

          {/* Version History */}
          {renderVersionTab && (
            <button
              onClick={() => handleTabClick("version")}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeTab === "version"
                  ? "bg-[#FF5B04] text-white shadow-md shadow-orange-500/10 scale-105"
                  : "text-gray-400 hover:text-gray-700 hover:bg-black/5"
              }`}
              title="Version History"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}

          <div className="flex-1" />

          {/* Help icon */}
          <button
            onClick={() => setHelpTab(activeTab)}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer text-gray-400 hover:text-gray-700 hover:bg-black/5"
            title="Help & Guide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Help Tutorial Modal */}
      {helpTab && helpContent[helpTab] && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300"
          onClick={() => setHelpTab(null)}
        >
          <div
            className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-black/5 p-6 w-full max-w-2xl animate-in fade-in zoom-in duration-300 text-left font-geist"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-orange-100 text-[#FF5B04] text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider">
                  Quick Guide
                </span>
                <h3 className="text-base font-bold font-geist text-gray-800">
                  {helpContent[helpTab].title}
                </h3>
              </div>
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-black/5 transition-all cursor-pointer"
                onClick={() => setHelpTab(null)}
              >
                <svg
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  width="16"
                >
                  <line x1="18" x2="6" y1="6" y2="18" />
                  <line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            </div>
            
            {/* Tutorial Carousel */}
            <div className="bg-white/50 p-1.5 rounded-3xl border border-black/[0.02]">
              <HelpTutorialCarousel tab={helpTab} />
            </div>
          </div>
        </div>
      )}

      {/* Upgrade prompt modal */}
      <UpgradePrompt
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        requiredCredits={1.0}
        currentCredits={0.0}
      />
    </>
  );
}
