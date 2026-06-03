"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import Link from "@tiptap/extension-link";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { useSaveBlog } from "@/hooks/useSaveBlog";
import DistributionPanel from "@/components/pirateCOS/DistributionPanel";
import CosIcon from "@/components/pirateCOS/CosIcon";
import { loadAIConfig } from "@/components/pirateCOS/AIConfigPanel";
import RepurposingDrawer from "@/components/pirateCOS/RepurposingDrawer";
import { useAICopilot } from "@/hooks/useAICopilot";
import {
  ContentGoal,
  getPostTypeConfig,
  getGoalConfig,
  getFeatures,
  CONTENT_GOALS,
  getPostTypesByCategory,
} from "@/lib/pirateCOS/postTypeConfig";
import ContentHealthPanel from "@/components/pirateCOS/ContentHealthPanel";

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface PostSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterHandle?: string;
  twitterCard?: "summary" | "summary_large_image";
  focusKeyword?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

// ─── Modal helpers ───────────────────────────────────────────────────────────
const Modal = ({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div
    className="fixed inset-0 z-[200] flex items-center justify-center"
    style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
    onMouseDown={(e) => e.target === e.currentTarget && onClose()}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl p-6 w-[420px] max-w-[95vw]"
      style={{ border: "1px solid rgba(0,0,0,0.08)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold font-geist text-gray-800">
          {title}
        </p>
        <button
          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-black/5 transition-colors"
          onClick={onClose}
        >
          <svg
            fill="none"
            height="14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            width="14"
          >
            <line x1="18" x2="6" y1="6" y2="18" />
            <line x1="6" x2="18" y1="6" y2="18" />
          </svg>
        </button>
      </div>
      {children}
    </div>
  </div>
);

// ─── SEO Editor Modal ────────────────────────────────────────────────────────
const SEOEditorModal = ({
  isOpen,
  onClose,
  data: parentData,
  onApply,
  slug: parentSlug,
  postTitle,
  postContent,
  postType,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  onApply: (newData: any, newSlug: string) => void;
  slug: string;
  postTitle: string;
  postContent: string;
  postType: string;
}) => {
  type SupportedAIEngine = "openai" | "gemini" | "mistral" | "anthropic";
  type ModalTab = "general" | "social" | "analysis" | "performance";
  type SEOAction = "seo-analysis" | "titles" | "excerpt" | "tags";
  type SEOAnalysisResult = {
    score: number;
    strengths: string[];
    improvements: string[];
    keywordGap: string[];
    headingStructure: string;
    readability: string;
    imageOptimization?: string;
  };

  const modelOptions: Record<
    SupportedAIEngine,
    Array<{ value: string; label: string }>
  > = {
    openai: [
      { value: "gpt-4o-mini", label: "GPT-4o Mini (Default)" },
      { value: "gpt-4o", label: "GPT-4o" },
      { value: "gpt-5.4", label: "GPT-5.4" },
      { value: "gpt-5.4-mini", label: "GPT-5.4 Mini" },
      { value: "gpt-5.5", label: "GPT-5.5" },
    ],
    gemini: [
      { value: "gemini-flash-latest", label: "Gemini 1.5 Flash" },
      { value: "gemini-1.5-pro-latest", label: "Gemini 1.5 Pro" },
      { value: "gemini-2.0-flash-exp", label: "Gemini 2.0 Flash" },
    ],
    mistral: [
      { value: "mistral-large-latest", label: "Mistral Large" },
      { value: "mistral-small-latest", label: "Mistral Small" },
      { value: "mistral-nemo", label: "Mistral Nemo" },
      { value: "codestral-latest", label: "Codestral" },
    ],
    anthropic: [
      { value: "claude-3-5-sonnet-latest", label: "Claude 3.5 Sonnet" },
      { value: "claude-3-5-haiku-latest", label: "Claude 3.5 Haiku" },
      { value: "claude-3-opus-latest", label: "Claude 3 Opus" },
    ],
  };

  const getDefaultModelForEngine = (engine: SupportedAIEngine) =>
    engine === "gemini"
      ? "gemini-flash-latest"
      : engine === "anthropic"
        ? "claude-3-5-sonnet-latest"
        : engine === "mistral"
          ? "mistral-large-latest"
          : "gpt-4o-mini";

  const plainTextContent = postContent
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const [activeTab, setActiveTab] = useState<ModalTab>("general");
  const [isAnalyzing, setIsGenerating] = useState(false);
  const [generatingAction, setGeneratingAction] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SEOAnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [selectedEngine, setSelectedEngine] =
    useState<SupportedAIEngine>("openai");
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");

  const [localData, setLocalData] = useState<any>({});
  const [localSlug, setLocalSlug] = useState<string>("");

  const data = localData;
  const slug = localSlug;

  const updateField = (field: string, value: any) => {
    setLocalData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Performance calculation logic
  const getPerformanceStats = useCallback(() => {
    const stats = {
      contentDepth: 0,
      keywordDensity: 0,
      mobileReadiness: 95, // Default high for our template
      semanticRichness: 0,
      overallScore: 0,
      strategies: [] as { type: "check" | "alert"; text: string }[],
    };

    const wordCount = plainTextContent
      ? plainTextContent.split(/\s+/).length
      : 0;

    stats.contentDepth = Math.min(100, Math.floor((wordCount / 1000) * 100));

    if (data?.focusKeyword && plainTextContent) {
      const escapedKeyword = String(data.focusKeyword).replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );
      const regex = new RegExp(escapedKeyword, "gi");
      const matches = plainTextContent.match(regex);
      const count = matches ? matches.length : 0;
      const density = wordCount ? (count / wordCount) * 100 : 0;

      if (density >= 1 && density <= 2.5) stats.keywordDensity = 100;
      else if (density > 0) {
        stats.keywordDensity = Math.min(100, Math.floor((density / 1) * 100));
      }
    }

    if (data?.keywords && data.keywords.length > 0) {
      stats.semanticRichness = Math.min(100, data.keywords.length * 10);
    }

    if (wordCount < 500) {
      stats.strategies.push({
        type: "alert",
        text: "Increase content length to at least 800 words for better ranking.",
      });
    } else {
      stats.strategies.push({
        type: "check",
        text: "Excellent content depth for competitive search terms.",
      });
    }

    if (!data?.focusKeyword) {
      stats.strategies.push({
        type: "alert",
        text: "Define a focus keyword to enable density analysis.",
      });
    }

    if (!data?.metaDescription || data.metaDescription.length < 120) {
      stats.strategies.push({
        type: "alert",
        text: "Meta description is too short; aim for 150-160 characters.",
      });
    }

    stats.overallScore = Math.floor(
      (stats.contentDepth +
        stats.keywordDensity +
        stats.mobileReadiness +
        stats.semanticRichness) /
        4,
    );

    return stats;
  }, [plainTextContent, data]);

  const perfStats = getPerformanceStats();

  useEffect(() => {
    if (!isOpen) return;

    // Prevent background scrolling when the modal is open
    document.body.style.overflow = "hidden";

    const config = loadAIConfig();
    const nextEngine: SupportedAIEngine =
      config.defaultEngine === "gemini" ||
      config.defaultEngine === "anthropic" ||
      config.defaultEngine === "mistral" ||
      config.defaultEngine === "openai"
        ? config.defaultEngine
        : "openai";
    const nextModel =
      config.defaultModel &&
      modelOptions[nextEngine].some(
        (option) => option.value === config.defaultModel,
      )
        ? config.defaultModel
        : getDefaultModelForEngine(nextEngine);

    setSelectedEngine(nextEngine);
    setSelectedModel(nextModel);
    setActiveTab("general");
    setError("");
    setAnalysis(null);

    // Initialize local state buffer on open
    setLocalData(parentData ? { ...parentData } : {});
    setLocalSlug(parentSlug || "");

    return () => {
      // Restore background scrolling when modal closes or unmounts
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (
      !modelOptions[selectedEngine].some(
        (option) => option.value === selectedModel,
      )
    ) {
      setSelectedModel(getDefaultModelForEngine(selectedEngine));
    }
  }, [selectedEngine, selectedModel]);

  const runAIAnalysis = async (specificAction?: string) => {
    setIsGenerating(true);
    setGeneratingAction(specificAction || "seo-analysis");
    setError("");
    try {
      // Map metaTitle and metaDescription to the correct API action
      let apiAction: SEOAction = "seo-analysis";

      if (specificAction === "metaTitle") {
        apiAction = "titles";
      } else if (specificAction === "metaDescription") {
        apiAction = "excerpt";
      } else if (specificAction) {
        apiAction = specificAction as SEOAction;
      }

      const response = await fetch("/api/pirateCOS/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: apiAction,
          title: postTitle,
          content: plainTextContent.slice(0, 15000),
          postType,
          engine: selectedEngine,
          model: selectedModel,
        }),
      });

      const result = await response.json();

      if (!result.success) throw new Error(result.error);

      const aiData = result.data;

      if (apiAction === "seo-analysis") {
        const nextAnalysis =
          aiData?.analysis && typeof aiData.analysis === "object"
            ? {
                score:
                  typeof aiData.analysis.score === "number"
                    ? Math.max(0, Math.min(100, aiData.analysis.score))
                    : perfStats.overallScore,
                strengths: Array.isArray(aiData.analysis.strengths)
                  ? aiData.analysis.strengths
                  : [],
                improvements: Array.isArray(aiData.analysis.improvements)
                  ? aiData.analysis.improvements
                  : [],
                keywordGap: Array.isArray(aiData.analysis.keywordGap)
                  ? aiData.analysis.keywordGap
                  : [],
                headingStructure:
                  typeof aiData.analysis.headingStructure === "string"
                    ? aiData.analysis.headingStructure
                    : "Heading structure review unavailable.",
                readability:
                  typeof aiData.analysis.readability === "string"
                    ? aiData.analysis.readability
                    : "Readability review unavailable.",
                imageOptimization:
                  typeof aiData.analysis.imageOptimization === "string"
                    ? aiData.analysis.imageOptimization
                    : "",
              }
            : null;

        setAnalysis(nextAnalysis);
        const newData = { ...localData };

        if (!newData.metaTitle) newData.metaTitle = aiData.metaTitle;
        if (!newData.metaDescription)
          newData.metaDescription = aiData.metaDescription;
        if (!newData.focusKeyword) newData.focusKeyword = aiData.focusKeyword;
        if (!newData.keywords || newData.keywords.length === 0)
          newData.keywords = aiData.semanticKeywords;
        if (!newData.ogTitle) newData.ogTitle = aiData.ogTitle;
        if (!newData.ogDescription)
          newData.ogDescription = aiData.ogDescription;
        setLocalData(newData);
        if (!localSlug) setLocalSlug(aiData.slug);

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else if (specificAction === "metaTitle") {
        const nextTitle = Array.isArray(aiData)
          ? aiData.find((item) => typeof item === "string" && item.trim())
          : null;

        if (!nextTitle) {
          throw new Error("AI did not return a valid title suggestion.");
        }

        updateField("metaTitle", nextTitle.trim());
      } else if (specificAction === "metaDescription") {
        if (typeof aiData !== "string" || !aiData.trim()) {
          throw new Error("AI did not return a valid meta description.");
        }

        updateField("metaDescription", aiData.trim());
      } else if (specificAction === "tags") {
        const nextKeywords = Array.isArray(aiData)
          ? aiData
              .filter((item) => typeof item === "string" && item.trim())
              .map((item) => item.trim())
          : [];

        if (!nextKeywords.length) {
          throw new Error("AI did not return valid keyword suggestions.");
        }

        setLocalData((prev: any) => ({
          ...prev,
          keywords: nextKeywords,
          focusKeyword: prev?.focusKeyword || nextKeywords[0],
        }));
      } else if (specificAction) {
        // Handle specific workflow component generation
        updateField(specificAction, aiData);
      }
    } catch (err: any) {
      setError(err.message || "Failed to analyze SEO");
      const container = document.querySelector(".custom-scrollbar");

      if (container) {
        container.scrollTo({ top: 0, behavior: "smooth" });
      }
    } finally {
      setIsGenerating(false);
      setGeneratingAction(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      <div
        className={`bg-white shadow-2xl flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${
          isFullscreen
            ? "w-full h-full rounded-none"
            : "w-full max-w-6xl h-[90vh] rounded-[32px]"
        } animate-in fade-in zoom-in duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-black/5 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-orange-100 text-[#FF5B04] text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider">
                  SEO Suite 2.0
                </span>
                <h2 className="text-xl font-bold font-geist text-gray-900">
                  Search Optimization
                </h2>
              </div>
              <p className="text-xs text-gray-400 font-geist">
                AI-assisted comprehensive SEO & social management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-black/5 transition-all border border-black/5 bg-white"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <svg
                fill="none"
                height="18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                width="18"
              >
                {isFullscreen ? (
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                ) : (
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                )}
              </svg>
            </button>
            <button
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-black/5 transition-all border border-black/5 bg-white"
              onClick={onClose}
            >
              <svg
                fill="none"
                height="20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                width="20"
              >
                <line x1="18" x2="6" y1="6" y2="18" />
                <line x1="6" x2="18" y1="6" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col xl:flex-row xl:items-center gap-3 px-4 md:px-6 bg-gray-50/50 border-b border-black/5">
          <div className="flex overflow-x-auto no-scrollbar">
            {[
              {
                id: "general",
                label: "General SEO",
                icon: (
                  <svg
                    fill="none"
                    height="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="14"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                ),
              },
              {
                id: "social",
                label: "Social Media",
                icon: (
                  <svg
                    fill="none"
                    height="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="14"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                ),
              },
              {
                id: "analysis",
                label: "AI Analysis",
                icon: (
                  <svg
                    fill="none"
                    height="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="14"
                  >
                    <path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z" />
                  </svg>
                ),
              },
              {
                id: "performance",
                label: "Performance Evaluation",
                icon: (
                  <svg
                    fill="none"
                    height="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="14"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                ),
              },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-4 md:px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-[#FF5B04]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                onClick={() => setActiveTab(tab.id as ModalTab)}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5B04]" />
                )}
              </button>
            ))}
          </div>
          <div className="xl:ml-auto flex flex-col sm:flex-row gap-2 py-3 xl:py-0 xl:my-auto">
            <select
              className="h-9 rounded-xl border border-black/5 bg-white px-3 text-xs font-semibold text-gray-700 outline-none"
              value={selectedEngine}
              onChange={(e) =>
                setSelectedEngine(e.target.value as SupportedAIEngine)
              }
            >
              <option value="openai">OpenAI</option>
              <option value="gemini">Gemini</option>
              <option value="anthropic">Claude</option>
              <option value="mistral">Mistral</option>
            </select>
            <select
              className="h-9 min-w-[210px] rounded-xl border border-black/5 bg-white px-3 text-xs font-semibold text-gray-700 outline-none"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {modelOptions[selectedEngine].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-white">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 animate-in slide-in-from-top-2">
              <svg
                className="flex-shrink-0"
                fill="none"
                height="20"
                stroke="#ef4444"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                width="20"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              <p className="text-sm font-medium text-red-600 font-geist">
                {error}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {/* Left Column: Editor Sections */}
            <div className="space-y-8">
              {activeTab === "general" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Title & Slug Section */}
                  <div className="p-6 rounded-3xl border border-black/5 bg-gray-50/30">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center">
                          1
                        </span>
                        Title & Identity
                      </h3>
                      <button
                        className="text-[10px] font-bold text-orange-600 hover:underline"
                        disabled={isAnalyzing}
                        onClick={() => runAIAnalysis("metaTitle")}
                      >
                        {generatingAction === "metaTitle"
                          ? "Generating..."
                          : "Regenerate Title"}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <label className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider text-gray-400">
                            Meta Title
                          </label>
                          <span
                            className={`text-[10px] font-bold font-jetbrains-mono ${data?.metaTitle?.length && data.metaTitle.length > 60 ? "text-red-500" : "text-gray-400"}`}
                          >
                            {data?.metaTitle?.length || 0}/60
                          </span>
                        </div>
                        <input
                          className="w-full bg-white border border-black/5 rounded-2xl px-4 py-3.5 text-sm font-geist focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm"
                          placeholder="Enter search engine title..."
                          value={data?.metaTitle || ""}
                          onChange={(e) =>
                            updateField("metaTitle", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider text-gray-400">
                          URL Slug
                        </label>
                        <div className="flex items-center bg-white border border-black/5 rounded-2xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-orange-100 transition-all shadow-sm">
                          <span className="text-xs text-gray-300 pr-1">
                            uipirate.com/posts/
                          </span>
                          <input
                            className="flex-1 bg-transparent text-sm font-geist outline-none"
                            placeholder="url-slug-here"
                            value={slug}
                            onChange={(e) =>
                              setLocalSlug(
                                e.target.value
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")
                                  .replace(/[^a-z0-9-]/g, ""),
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="p-6 rounded-3xl border border-black/5 bg-gray-50/30">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center">
                          2
                        </span>
                        Search Snippet
                      </h3>
                      <button
                        className="text-[10px] font-bold text-orange-600 hover:underline"
                        disabled={isAnalyzing}
                        onClick={() => runAIAnalysis("metaDescription")}
                      >
                        {generatingAction === "metaDescription"
                          ? "Generating..."
                          : "Generate Description"}
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <label className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider text-gray-400">
                          Meta Description
                        </label>
                        <span
                          className={`text-[10px] font-bold font-jetbrains-mono ${data?.metaDescription?.length && data.metaDescription.length > 160 ? "text-red-500" : "text-gray-400"}`}
                        >
                          {data?.metaDescription?.length || 0}/160
                        </span>
                      </div>
                      <textarea
                        className="w-full bg-white border border-black/5 rounded-2xl px-4 py-3.5 text-sm font-geist focus:ring-2 focus:ring-orange-100 outline-none transition-all min-h-[120px] resize-none shadow-sm"
                        placeholder="Enter short summary for search results..."
                        value={data?.metaDescription || ""}
                        onChange={(e) =>
                          updateField("metaDescription", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Advanced SEO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-3xl border border-black/5 bg-gray-50/30 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider text-gray-400 block">
                          Focus Keyword
                        </label>
                        <button
                          className="text-[10px] font-bold text-orange-600 hover:underline disabled:opacity-40"
                          disabled={isAnalyzing}
                          onClick={() => runAIAnalysis("tags")}
                        >
                          {generatingAction === "tags"
                            ? "Generating..."
                            : "Generate Keywords"}
                        </button>
                      </div>
                      <input
                        className="w-full bg-white border border-black/5 rounded-xl px-4 py-3 text-sm font-geist focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm"
                        placeholder="e.g. Next.js SEO"
                        value={data?.focusKeyword || ""}
                        onChange={(e) =>
                          updateField("focusKeyword", e.target.value)
                        }
                      />

                      {/* Semantic Keywords Tag List */}
                      {data?.keywords && data.keywords.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <label className="text-[9px] font-bold font-jetbrains-mono uppercase tracking-wider text-gray-400 block">
                            Semantic Keywords
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {data.keywords.map((kw: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-bold font-geist border border-orange-100 flex items-center gap-1 cursor-pointer hover:bg-orange-100 transition-all select-none"
                                title="Set as Focus Keyword"
                                onClick={() => {
                                  // Click semantic keyword to set as Focus Keyword
                                  updateField("focusKeyword", kw);
                                }}
                              >
                                {kw}
                                <button
                                  className="text-orange-400 hover:text-orange-600 font-bold pl-0.5"
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const nextKws = data.keywords.filter(
                                      (_: any, i: number) => i !== idx,
                                    );

                                    updateField("keywords", nextKws);
                                  }}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-5 rounded-3xl border border-black/5 bg-gray-50/30 space-y-2">
                      <label className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider text-gray-400 block">
                        Canonical URL
                      </label>
                      <input
                        className="w-full bg-white border border-black/5 rounded-xl px-4 py-3 text-sm font-geist focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm"
                        placeholder="https://..."
                        value={data?.canonicalUrl || ""}
                        onChange={(e) =>
                          updateField("canonicalUrl", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "social" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="p-6 rounded-3xl border border-black/5 bg-gray-50/30">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center">
                          3
                        </span>
                        Social Appearance
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider text-gray-400 block">
                          OG Image URL
                        </label>
                        <input
                          className="w-full bg-white border border-black/5 rounded-2xl px-4 py-3.5 text-sm font-geist focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm"
                          placeholder="https://cloudinary.com/..."
                          value={data?.ogImage || ""}
                          onChange={(e) =>
                            updateField("ogImage", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider text-gray-400 block">
                          OG Title Override
                        </label>
                        <input
                          className="w-full bg-white border border-black/5 rounded-2xl px-4 py-3.5 text-sm font-geist focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm"
                          placeholder="Title for Facebook/LinkedIn..."
                          value={data?.ogTitle || ""}
                          onChange={(e) =>
                            updateField("ogTitle", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider text-gray-400 block">
                          OG Description Override
                        </label>
                        <textarea
                          className="w-full bg-white border border-black/5 rounded-2xl px-4 py-3.5 text-sm font-geist focus:ring-2 focus:ring-orange-100 outline-none transition-all min-h-[100px] resize-none shadow-sm"
                          placeholder="Description for social shares..."
                          value={data?.ogDescription || ""}
                          onChange={(e) =>
                            updateField("ogDescription", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 p-4 rounded-3xl bg-gray-50/50 border border-black/5">
                    <div className="flex items-center gap-2">
                      <input
                        checked={data?.noIndex || false}
                        className="w-4 h-4 rounded-md border-black/10 text-[#FF5B04] focus:ring-[#FF5B04]/30"
                        id="noIndex"
                        type="checkbox"
                        onChange={(e) =>
                          updateField("noIndex", e.target.checked)
                        }
                      />
                      <label
                        className="text-xs font-bold font-geist text-gray-600 cursor-pointer"
                        htmlFor="noIndex"
                      >
                        No-Index (Hide from Search)
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "performance" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="p-8 rounded-[40px] bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <svg
                        fill="none"
                        height="120"
                        stroke="currentColor"
                        strokeWidth="1"
                        viewBox="0 0 24 24"
                        width="120"
                      >
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      SEO Strategy Engine
                    </h3>
                    <div className="flex items-center justify-between mb-8">
                      <p className="text-gray-400 text-sm max-w-md">
                        Our performance evaluation tool assesses your content
                        against 40+ ranking factors to suggest high-impact
                        strategies.
                      </p>
                      <div className="flex items-center gap-3 shrink-0">
                        {showSuccess && (
                          <span className="text-emerald-400 text-xs font-bold animate-pulse flex items-center gap-1">
                            <svg
                              fill="none"
                              height="14"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                              width="14"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Refreshed!
                          </span>
                        )}
                        <button
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold transition-all disabled:opacity-40"
                          disabled={isAnalyzing}
                          onClick={() => runAIAnalysis("seo-analysis")}
                        >
                          {isAnalyzing ? (
                            <svg
                              className="animate-spin"
                              fill="none"
                              height="11"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                              width="11"
                            >
                              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                          ) : (
                            <svg
                              fill="none"
                              height="11"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                              width="11"
                            >
                              <path d="M3 12a9 9 0 1 0 9-9" />
                              <polyline points="3 3 3 12 12 12" />
                            </svg>
                          )}
                          {isAnalyzing ? "Analyzing..." : "Re-evaluate"}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          label: "Content Depth",
                          score: perfStats.contentDepth,
                          color: "bg-emerald-500",
                        },
                        {
                          label: "Keyword Density",
                          score: perfStats.keywordDensity,
                          color: "bg-orange-500",
                        },
                        {
                          label: "Mobile Readiness",
                          score: perfStats.mobileReadiness,
                          color: "bg-blue-500",
                        },
                        {
                          label: "Semantic Richness",
                          score: perfStats.semanticRichness,
                          color: "bg-red-500",
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="bg-white/5 border border-white/10 p-4 rounded-2xl"
                        >
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">
                              {stat.label}
                            </span>
                            <span className="text-xs font-bold">
                              {stat.score}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${stat.color} transition-all duration-1000`}
                              style={{ width: `${stat.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 p-6 rounded-3xl bg-white/5 border border-white/10">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-4">
                        Recommended Strategy
                      </h4>
                      <ul className="space-y-3">
                        {perfStats.strategies.map((strategy, i) => (
                          <li key={i} className="flex gap-3 text-sm">
                            <span
                              className={
                                strategy.type === "check"
                                  ? "text-emerald-500"
                                  : "text-orange-500"
                              }
                            >
                              {strategy.type === "check" ? "✓" : "!"}
                            </span>
                            <span
                              className={
                                strategy.type === "check"
                                  ? "text-gray-300"
                                  : "text-gray-300 font-medium"
                              }
                            >
                              {strategy.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "analysis" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="p-6 rounded-3xl border border-black/5 bg-gray-50/30">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center">
                          4
                        </span>
                        Final Review
                      </h3>
                      <button
                        className="text-[10px] font-bold text-orange-600 hover:underline disabled:opacity-40"
                        disabled={isAnalyzing}
                        onClick={() => runAIAnalysis("seo-analysis")}
                      >
                        Run Audit
                      </button>
                    </div>

                    {!analysis ? (
                      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-[28px] border border-dashed border-black/5">
                        <div className="w-16 h-16 rounded-3xl bg-orange-50 shadow-sm flex items-center justify-center text-orange-500 mb-4">
                          <svg
                            fill="none"
                            height="32"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="32"
                          >
                            <path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          AI Audit Ready
                        </h3>
                        <p className="text-gray-400 text-sm mb-6 text-center max-w-xs">
                          Run a manual audit when you want recommendations.
                          Opening the modal no longer auto-generates content.
                        </p>
                        <button
                          className="px-6 py-3 rounded-2xl bg-black text-white text-sm font-bold hover:scale-105 transition-all"
                          disabled={isAnalyzing}
                          onClick={() => runAIAnalysis("seo-analysis")}
                        >
                          Run Comprehensive Audit
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 p-5 rounded-[24px] bg-white border border-black/5 shadow-sm">
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                              <path
                                className="text-orange-100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeDasharray="100, 100"
                                strokeWidth="3"
                              />
                              <path
                                className="text-[#FF5B04]"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeDasharray={`${analysis.score}, 100`}
                                strokeLinecap="round"
                                strokeWidth="3"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold font-jetbrains-mono text-[#FF5B04]">
                              {analysis.score}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-1">
                              SEO Health Score
                            </h4>
                            <p className="text-[11px] text-gray-500 leading-relaxed">
                              {analysis.score >= 80
                                ? "Strong optimization profile with only minor refinements left."
                                : analysis.score >= 50
                                  ? "Good foundation, but several SEO improvements are still recommended."
                                  : "This page needs substantial SEO improvements before publishing."}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <p className="text-[11px] font-bold font-jetbrains-mono uppercase tracking-wider text-emerald-500">
                              Key Strengths
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {analysis.strengths.length ? (
                                analysis.strengths.map((item) => (
                                  <span
                                    key={item}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-[11px] font-medium border border-emerald-100 flex items-center gap-1.5"
                                  >
                                    <svg
                                      fill="none"
                                      height="10"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                      viewBox="0 0 24 24"
                                      width="10"
                                    >
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    {item}
                                  </span>
                                ))
                              ) : (
                                <p className="text-xs text-gray-500">
                                  No strengths were returned for this audit.
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-[11px] font-bold font-jetbrains-mono uppercase tracking-wider text-orange-500">
                              Suggested Improvements
                            </p>
                            <ul className="space-y-2">
                              {analysis.improvements.length ? (
                                analysis.improvements.map((item) => (
                                  <li
                                    key={item}
                                    className="text-xs text-gray-600 flex gap-2 items-start bg-gray-50 p-3 rounded-xl border border-black/5"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                                    {item}
                                  </li>
                                ))
                              ) : (
                                <li className="text-xs text-gray-500">
                                  No improvement suggestions were returned for
                                  this audit.
                                </li>
                              )}
                            </ul>
                          </div>

                          {!!analysis.keywordGap.length && (
                            <div className="space-y-2">
                              <p className="text-[11px] font-bold font-jetbrains-mono uppercase tracking-wider text-blue-500">
                                Keyword Gap Analysis
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {analysis.keywordGap.map((item) => (
                                  <span
                                    key={item}
                                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 text-[11px] font-medium border border-blue-100"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="p-4 rounded-2xl bg-gray-50 border border-black/5">
                              <p className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider text-gray-400 mb-2">
                                Structure
                              </p>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {analysis.headingStructure}
                              </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-gray-50 border border-black/5">
                              <p className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider text-gray-400 mb-2">
                                Readability
                              </p>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {analysis.readability}
                              </p>
                            </div>
                            {!!analysis.imageOptimization && (
                              <div className="p-4 rounded-2xl bg-gray-50 border border-black/5 sm:col-span-2">
                                <p className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider text-gray-400 mb-2">
                                  Images & Alt Text
                                </p>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  {analysis.imageOptimization}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Previews */}
            <div className="space-y-8 sticky top-0">
              <div className="space-y-4">
                <h3 className="text-[11px] font-bold font-jetbrains-mono uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <svg
                    fill="none"
                    height="14"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    width="14"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  Google Search Preview
                </h3>
                <div className="p-8 bg-white border border-black/5 rounded-[40px] shadow-sm group hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
                  <div className="space-y-1.5">
                    <p className="text-[13px] text-[#202124] line-clamp-1">
                      https://uipirate.com/posts/
                      <span className="font-medium">{slug || "..."}</span>
                    </p>
                    <h4 className="text-xl text-[#1a0dab] font-medium hover:underline cursor-pointer leading-tight line-clamp-2">
                      {generatingAction === "metaTitle" ||
                      generatingAction === "seo-analysis"
                        ? "Generating optimized title..."
                        : data?.metaTitle || postTitle || "Untitled Post"}
                    </h4>
                    <p className="text-[14px] text-[#4d5156] line-clamp-2 leading-relaxed">
                      {generatingAction === "metaDescription" ||
                      generatingAction === "seo-analysis"
                        ? "Generating optimized meta description..."
                        : data?.metaDescription ||
                          "Please provide a meta description to see how your post will appear in search results..."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[11px] font-bold font-jetbrains-mono uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <svg
                    fill="none"
                    height="14"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    width="14"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  Social Card Preview
                </h3>
                <div className="bg-white border border-black/5 rounded-[40px] overflow-hidden shadow-sm group hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
                  <div className="aspect-[1.91/1] bg-gray-100 relative overflow-hidden">
                    {data?.ogImage ? (
                      <img
                        alt="OG Preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                        src={data.ogImage}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-3">
                        <svg
                          fill="none"
                          height="48"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          width="48"
                        >
                          <rect height="18" rx="2" width="18" x="3" y="3" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          No Card Image Selected
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 bg-gray-50/50 border-t border-black/5">
                    <p className="text-[10px] text-gray-400 uppercase font-bold font-jetbrains-mono mb-2">
                      UIPIRATE.COM
                    </p>
                    <h4 className="text-base font-bold text-gray-900 line-clamp-1 mb-2">
                      {data?.ogTitle ||
                        data?.metaTitle ||
                        postTitle ||
                        "Untitled Post"}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {data?.ogDescription ||
                        data?.metaDescription ||
                        "No description provided."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-black/5 bg-gray-50/50 flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI Core Active
          </div>
          <button
            className="px-6 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-black/5 transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-10 py-3 rounded-2xl bg-black text-white text-sm font-bold hover:shadow-xl hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            onClick={() => {
              onApply(localData, localSlug);
              onClose();
            }}
          >
            Apply Optimization
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Image URL Modal ─────────────────────────────────────────────────────────
const ImageUrlModal = ({
  editor,
  onClose,
}: {
  editor: any;
  onClose: () => void;
}) => {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  const insert = () => {
    if (url.trim()) {
      editor
        .chain()
        .focus()
        .setImage({ src: url.trim(), alt: alt.trim() || undefined })
        .run();
      onClose();
    }
  };

  return (
    <Modal title="Insert Image from URL" onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-geist text-gray-500 mb-1 block">
            Image URL *
          </label>
          <input
            autoFocus
            className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-300"
            placeholder="https://example.com/image.png"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && insert()}
          />
        </div>
        <div>
          <label className="text-xs font-geist text-gray-500 mb-1 block">
            Alt text (optional)
          </label>
          <input
            className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-300"
            placeholder="Describe the image…"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
          />
        </div>
        <div className="flex gap-2 pt-1">
          <button
            className="flex-1 h-10 rounded-xl text-sm font-geist font-medium text-white disabled:opacity-40 transition-opacity"
            disabled={!url.trim()}
            style={{ background: "#FF5B04" }}
            onClick={insert}
          >
            Insert Image
          </button>
          <button
            className="h-10 px-4 rounded-xl text-sm font-geist font-medium text-gray-600 bg-black/5 hover:bg-black/10 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Video Embed Modal ────────────────────────────────────────────────────────
const VideoEmbedModal = ({
  editor,
  onClose,
}: {
  editor: any;
  onClose: () => void;
}) => {
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");

  const getEmbedUrl = (raw: string): string | null => {
    // YouTube
    const ytMatch = raw.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/,
    );

    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

    // Vimeo
    const vimeoMatch = raw.match(/vimeo\.com\/(\d+)/);

    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

    // Loom
    const loomMatch = raw.match(/loom\.com\/share\/([a-f0-9]+)/);

    if (loomMatch) return `https://www.loom.com/embed/${loomMatch[1]}`;

    // Direct iframe URL
    if (raw.startsWith("http")) return raw;

    return null;
  };

  const insert = () => {
    const embedUrl = getEmbedUrl(url.trim());

    if (embedUrl) {
      const captionHtml = caption
        ? `<p style="text-align:center;font-size:0.8rem;color:#9ca3af;margin-top:0.5rem">${caption}</p>`
        : "";

      editor
        .chain()
        .focus()
        .insertContent(
          `<div class="video-embed-wrapper" contenteditable="false">
            <div class="video-embed-ratio">
              <iframe src="${embedUrl}" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
            </div>
            ${captionHtml}
          </div><p></p>`,
        )
        .run();
      onClose();
    }
  };

  return (
    <Modal title="Embed Video" onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-geist text-gray-500 mb-1 block">
            Video URL (YouTube, Vimeo, Loom) *
          </label>
          <input
            autoFocus
            className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-300"
            placeholder="https://youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && insert()}
          />
        </div>
        <div>
          <label className="text-xs font-geist text-gray-500 mb-1 block">
            Caption (optional)
          </label>
          <input
            className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-300"
            placeholder="Add a caption…"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        <div className="flex gap-2 pt-1">
          <button
            className="flex-1 h-10 rounded-xl text-sm font-geist font-medium text-white disabled:opacity-40 transition-opacity"
            disabled={!url.trim()}
            style={{ background: "#FF5B04" }}
            onClick={insert}
          >
            Embed Video
          </button>
          <button
            className="h-10 px-4 rounded-xl text-sm font-geist font-medium text-gray-600 bg-black/5 hover:bg-black/10 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Link Modal ──────────────────────────────────────────────────────────────
const LinkModal = ({
  editor,
  onClose,
}: {
  editor: any;
  onClose: () => void;
}) => {
  const [url, setUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [ctaType, setCtaType] = useState<"none" | "primary" | "secondary">(
    "none",
  );

  useEffect(() => {
    if (editor) {
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to, " ");

      setLinkText(selectedText);

      const attrs = editor.getAttributes("link");

      if (attrs.href) {
        setUrl(attrs.href);
      }
      if (attrs.class && attrs.class.includes("blog-cta-btn-secondary")) {
        setCtaType("secondary");
      } else if (attrs.class && attrs.class.includes("blog-cta-btn")) {
        setCtaType("primary");
      }
    }
  }, [editor]);

  const insert = () => {
    const trimmedUrl = url.trim();
    const trimmedText = linkText.trim() || trimmedUrl;

    if (trimmedUrl) {
      if (ctaType === "primary") {
        editor
          .chain()
          .focus()
          .insertContent(
            `<a href="${trimmedUrl}" class="blog-cta-btn">${trimmedText}</a> `,
          )
          .run();
      } else if (ctaType === "secondary") {
        editor
          .chain()
          .focus()
          .insertContent(
            `<a href="${trimmedUrl}" class="blog-cta-btn-secondary">${trimmedText}</a> `,
          )
          .run();
      } else {
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${trimmedUrl}">${trimmedText}</a>`)
          .run();
      }
      onClose();
    }
  };

  return (
    <Modal title="Insert or Edit Link" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-geist text-gray-500 mb-1 block">
            Link Text *
          </label>
          <input
            className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-300"
            placeholder="Text to display…"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-geist text-gray-500 mb-1 block">
            Link URL *
          </label>
          <input
            autoFocus
            className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-300"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && insert()}
          />
        </div>
        <div className="flex flex-col gap-2 select-none">
          <label className="text-xs font-geist text-gray-600 font-semibold mb-1 block">
            Link Style
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              checked={ctaType === "none"}
              className="w-4 h-4 text-[#FF5B04] focus:ring-[#FF5B04] cursor-pointer"
              name="ctaType"
              type="radio"
              onChange={() => setCtaType("none")}
            />
            <span className="text-xs font-geist text-gray-700">
              Standard Link
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              checked={ctaType === "primary"}
              className="w-4 h-4 text-[#FF5B04] focus:ring-[#FF5B04] cursor-pointer"
              name="ctaType"
              type="radio"
              onChange={() => setCtaType("primary")}
            />
            <span className="text-xs font-geist text-gray-700">
              Primary CTA Button (Orange)
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              checked={ctaType === "secondary"}
              className="w-4 h-4 text-[#FF5B04] focus:ring-[#FF5B04] cursor-pointer"
              name="ctaType"
              type="radio"
              onChange={() => setCtaType("secondary")}
            />
            <span className="text-xs font-geist text-gray-700">
              Secondary CTA Button (Dark)
            </span>
          </label>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            className="flex-1 h-10 rounded-xl text-sm font-geist font-medium text-white disabled:opacity-40 transition-opacity cursor-pointer"
            disabled={!url.trim()}
            style={{ background: "#FF5B04" }}
            onClick={insert}
          >
            Save Link
          </button>
          <button
            className="h-10 px-4 rounded-xl text-sm font-geist font-medium text-gray-600 bg-black/5 hover:bg-black/10 transition-colors cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Custom Alert Modal ──────────────────────────────────────────────────────
const AlertModal = ({
  title,
  message,
  onClose,
}: {
  title: string;
  message: string;
  onClose: () => void;
}) => (
  <Modal title={title} onClose={onClose}>
    <div className="text-center py-4">
      <div className="w-12 h-12 bg-red-50 text-[#FF5B04] rounded-full flex items-center justify-center mx-auto mb-3">
        <svg
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
      </div>
      <p className="text-sm font-geist text-gray-600 mb-5">{message}</p>
      <button
        className="w-full h-10 rounded-xl text-sm font-geist font-medium text-white transition-opacity hover:opacity-90"
        style={{ background: "#FF5B04" }}
        onClick={onClose}
      >
        Okay
      </button>
    </div>
  </Modal>
);

// ─── Unsaved Changes Guard Modal ─────────────────────────────────────────────
const UnsavedChangesModal = ({
  onLeave,
  onStay,
}: {
  onLeave: () => void;
  onStay: () => void;
}) => (
  <div
    className="fixed inset-0 z-[300] flex items-center justify-center p-4"
    style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
    onClick={onStay}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl p-6 w-[400px] max-w-full relative"
      style={{
        border: "1px solid rgba(0,0,0,0.08)",
        animation: "fadeSlideIn 0.18s ease",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-black/5 transition-colors"
        onClick={onStay}
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

      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
          <svg
            fill="none"
            height="20"
            stroke="#d97706"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="20"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" x2="12" y1="9" y2="13" />
            <line x1="12" x2="12.01" y1="17" y2="17" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold font-geist text-gray-900 mb-1">
            Unsaved Changes
          </h3>
          <p className="text-xs font-geist text-gray-500 leading-relaxed">
            You have unsaved changes that will be lost if you leave this page.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          className="w-full h-10 rounded-xl text-sm font-geist font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "#FF5B04" }}
          onClick={onStay}
        >
          Keep Editing
        </button>
        <button
          className="w-full h-10 rounded-xl text-sm font-geist font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          onClick={onLeave}
        >
          Discard & Leave
        </button>
      </div>
    </div>
  </div>
);

// ─── Publish Confirm Modal ───────────────────────────────────────────────────
const PublishConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSaving,
  blogData,
  isSuccess,
  onViewBlogs,
  onKeepEditing,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSaving: boolean;
  blogData: {
    title: string;
    bannerImage: string;
    excerpt: string;
    tags: string[];
  };
  isSuccess: boolean;
  onViewBlogs: () => void;
  onKeepEditing: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
      onClick={() => {
        if (!isSaving) onClose();
      }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-[460px] max-w-full border border-black/5 relative"
        style={{ animation: "fadeSlideIn 0.2s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {!isSaving && (
          <button
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-black/5 transition-colors"
            onClick={onClose}
          >
            <svg
              fill="none"
              height="18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              width="18"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        )}
        {isSuccess ? (
          <div className="p-8 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative animate-pulse"
              style={{ background: "rgba(22, 163, 74, 0.1)" }}
            >
              <svg
                className="animate-bounce"
                fill="none"
                height="40"
                stroke="#16a34a"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                width="40"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold font-geist text-gray-900 mb-2">
              Post Published!
            </h3>
            <p className="text-sm font-geist text-gray-500 mb-6">
              Your post has been successfully published and is now live.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 h-11 rounded-xl text-sm font-geist font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: "#FF5B04" }}
                onClick={onViewBlogs}
              >
                Go to Post List
              </button>
              <button
                className="px-5 h-11 rounded-xl text-sm font-geist font-medium text-gray-600 bg-black/5 hover:bg-black/10 transition-colors"
                onClick={onKeepEditing}
              >
                Keep Editing
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header Preview */}
            <div
              className="h-36 bg-gray-100 relative bg-cover bg-center flex items-end p-5"
              style={{
                backgroundImage: blogData.bannerImage
                  ? `url(${blogData.bannerImage})`
                  : "linear-gradient(135deg, #FFF0E8 0%, #FFEBE0 100%)",
              }}
            >
              {!blogData.bannerImage && (
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <svg
                    fill="none"
                    height="48"
                    stroke="#FF5B04"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    width="48"
                  >
                    <rect height="18" rx="2" width="18" x="3" y="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
              <div className="relative z-10 text-white w-full">
                <p className="text-[10px] font-jetbrains-mono uppercase tracking-widest text-orange-400 font-semibold mb-1">
                  Publish Preview
                </p>
                <h4 className="text-lg font-bold font-geist line-clamp-1">
                  {blogData.title || "Untitled Post"}
                </h4>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-jetbrains-mono uppercase tracking-widest text-gray-400 font-semibold mb-1 block">
                  Excerpt Preview
                </label>
                <p className="text-xs font-geist text-gray-600 line-clamp-2 italic bg-black/5 rounded-xl p-3">
                  {blogData.excerpt ||
                    "No excerpt provided. A summary will be auto-generated from your content."}
                </p>
              </div>

              {blogData.tags.length > 0 && (
                <div>
                  <label className="text-[10px] font-jetbrains-mono uppercase tracking-widest text-gray-400 font-semibold mb-1.5 block">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {blogData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-geist px-2.5 py-0.5 rounded-full"
                        style={{ background: "#FFF0E8", color: "#FF5B04" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3.5 flex gap-2.5">
                <svg
                  className="flex-shrink-0 mt-0.5"
                  fill="none"
                  height="18"
                  stroke="#FF5B04"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="18"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="16" y2="12" />
                  <line x1="12" x2="12.01" y1="8" y2="8" />
                </svg>
                <p className="text-[11px] font-geist text-[#FF5B04]/90 leading-normal">
                  Publishing will make this post immediately live on your blog.
                  Make sure all your details are correct!
                </p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-black/5">
                <button
                  className="flex-1 h-11 rounded-xl text-sm font-geist font-medium text-white transition-opacity disabled:opacity-50 hover:opacity-90 flex items-center justify-center gap-2"
                  disabled={isSaving}
                  style={{ background: "#FF5B04" }}
                  onClick={onConfirm}
                >
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          fill="currentColor"
                        />
                      </svg>
                      Publishing...
                    </>
                  ) : (
                    "Confirm & Publish"
                  )}
                </button>
                <button
                  className="h-11 px-5 rounded-xl text-sm font-geist font-medium text-gray-600 bg-black/5 hover:bg-black/10 transition-colors disabled:opacity-50"
                  disabled={isSaving}
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Save Draft Modal ────────────────────────────────────────────────────────
const SaveDraftModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSaving,
  blogData,
  isSuccess,
  onViewBlogs,
  onKeepEditing,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSaving: boolean;
  blogData: { title: string; excerpt: string };
  isSuccess: boolean;
  onViewBlogs: () => void;
  onKeepEditing: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
      onClick={() => {
        if (!isSaving) onClose();
      }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-[400px] max-w-full border border-black/5 relative"
        style={{ animation: "fadeSlideIn 0.2s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {!isSaving && (
          <button
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-black/5 transition-colors"
            onClick={onClose}
          >
            <svg
              fill="none"
              height="18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              width="18"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        )}
        {isSuccess ? (
          <div className="p-8 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative animate-pulse"
              style={{ background: "rgba(99, 102, 241, 0.1)" }}
            >
              <svg
                className="animate-bounce"
                fill="none"
                height="40"
                stroke="#6366f1"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                width="40"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold font-geist text-gray-900 mb-2">
              Draft Saved!
            </h3>
            <p className="text-sm font-geist text-gray-500 mb-6">
              Your progress has been saved successfully as a draft.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 h-11 rounded-xl text-sm font-geist font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: "#FF5B04" }}
                onClick={onViewBlogs}
              >
                Go to Post List
              </button>
              <button
                className="px-5 h-11 rounded-xl text-sm font-geist font-medium text-gray-600 bg-black/5 hover:bg-black/10 transition-colors"
                onClick={onKeepEditing}
              >
                Keep Editing
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="text-center pb-2">
              <div className="w-12 h-12 bg-orange-50 text-[#FF5B04] rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
              </div>
              <h3 className="text-lg font-bold font-geist text-gray-900">
                Save Draft
              </h3>
              <p className="text-xs font-geist text-gray-500 mt-1">
                Save your current progress to finish editing later.
              </p>
            </div>

            <div className="bg-black/5 rounded-2xl p-4 space-y-2">
              <div className="text-[10px] font-jetbrains-mono uppercase tracking-widest text-gray-400 font-semibold">
                Post Title
              </div>
              <div className="text-sm font-geist text-gray-800 font-semibold line-clamp-1">
                {blogData.title || "Untitled Post"}
              </div>
              {blogData.excerpt && (
                <>
                  <div className="text-[10px] font-jetbrains-mono uppercase tracking-widest text-gray-400 font-semibold pt-1">
                    Excerpt
                  </div>
                  <div className="text-xs font-geist text-gray-500 line-clamp-2">
                    {blogData.excerpt}
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-black/5">
              <button
                className="flex-1 h-11 rounded-xl text-sm font-geist font-medium text-white transition-opacity disabled:opacity-50 hover:opacity-90 flex items-center justify-center gap-2"
                disabled={isSaving}
                style={{ background: "#FF5B04" }}
                onClick={onConfirm}
              >
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        fill="currentColor"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Draft"
                )}
              </button>
              <button
                className="h-11 px-5 rounded-xl text-sm font-geist font-medium text-gray-600 bg-black/5 hover:bg-black/10 transition-colors disabled:opacity-50"
                disabled={isSaving}
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── AI Excerpt Modal ────────────────────────────────────────────────────────
const AIExcerptModal = ({
  isOpen,
  onClose,
  editor,
  postTitle,
  postType,
  excerpt,
  setExcerpt,
}: {
  isOpen: boolean;
  onClose: () => void;
  editor: any;
  postTitle: string;
  postType: string;
  excerpt: string;
  setExcerpt: (val: string) => void;
}) => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [engine, setEngine] = useState<
    "openai" | "gemini" | "puter" | "mistral" | "anthropic"
  >(
    () =>
      (loadAIConfig().defaultEngine ?? "puter") as
        | "openai"
        | "gemini"
        | "puter"
        | "mistral"
        | "anthropic",
  );
  const [model, setModel] = useState<string>(
    () => loadAIConfig().defaultModel ?? "gpt-4o-mini",
  );

  // Sync default engine models when engine changes
  useEffect(() => {
    if (engine === "gemini") {
      if (!model.startsWith("gemini")) setModel("gemini-flash-latest");
    } else if (engine === "mistral") {
      if (!model.startsWith("mistral") && !model.startsWith("codestral"))
        setModel("mistral-large-latest");
    } else {
      if (!model.startsWith("gpt")) setModel("gpt-5.5");
    }
  }, [engine, model]);

  // Sync result with initial excerpt if any
  useEffect(() => {
    if (isOpen) {
      setResult(excerpt || "");
      setError("");
    }
  }, [isOpen, excerpt]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const plainText = editor ? editor.getText() : "";
      const textToSummarize = plainText.trim() || postTitle || "Untitled Post";

      if (engine === "puter") {
        let systemInstructions = `Draft a concise, high-converting SEO meta-description / excerpt (maximum 150-160 characters) summarizing the following content. Deliver ONLY the excerpt text. Do NOT wrap it in quotes, code blocks, or include introductory text. Content:\n\n${textToSummarize}`;

        if (prompt.trim()) {
          systemInstructions += `\n\nAlso incorporate the following custom instructions: "${prompt.trim()}"`;
        }

        const { puter } = await import("@heyputer/puter.js");
        const chatResponse = await puter.ai.chat(systemInstructions, { model });

        let text = "";

        if (chatResponse.message?.content) {
          text =
            typeof chatResponse.message.content === "string"
              ? chatResponse.message.content
              : String(chatResponse.message.content);
        } else {
          text = String(chatResponse);
        }

        text = text.trim();
        // Clean backticks
        if (text.startsWith("```json")) {
          text = text
            .replace(/^```json/, "")
            .replace(/```$/, "")
            .trim();
        } else if (text.startsWith("```html")) {
          text = text
            .replace(/^```html/, "")
            .replace(/```$/, "")
            .trim();
        } else if (text.startsWith("```")) {
          text = text.replace(/^```/, "").replace(/```$/, "").trim();
        }

        // Remove surrounding quotes if model added them
        if (text.startsWith('"') && text.endsWith('"')) {
          text = text.substring(1, text.length - 1);
        }

        setResult(text);
      } else {
        // Send a custom prompt for excerpt if prompt is provided
        const response = await fetch("/api/pirateCOS/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "excerpt",
            title: postTitle,
            content: prompt.trim()
              ? `${textToSummarize}\n\nCustom Instructions:\n${prompt.trim()}`
              : textToSummarize,
            postType,
            engine,
            model,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to generate excerpt.");
        }

        let cleanText = data.data.trim();

        if (cleanText.startsWith('"') && cleanText.endsWith('"')) {
          cleanText = cleanText.substring(1, cleanText.length - 1);
        }
        setResult(cleanText);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    setExcerpt(result);
    onClose();
  };

  if (!isOpen) return null;

  // SEO bounds helper
  const getCounterColor = (len: number) => {
    if (len === 0) return "text-gray-400";
    if (len >= 120 && len <= 160) return "text-emerald-500 font-bold";
    if (len > 200) return "text-red-500 font-bold animate-pulse";

    return "text-amber-500 font-semibold";
  };

  const getCounterBg = (len: number) => {
    if (len === 0) return "bg-gray-100 border-gray-200 text-gray-500";
    if (len >= 120 && len <= 160)
      return "bg-emerald-50 border-emerald-200 text-emerald-800";
    if (len > 200) return "bg-red-50 border-red-200 text-red-800";

    return "bg-amber-50 border-amber-200 text-amber-800";
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-[540px] max-w-[95vw] border border-black/5 flex flex-col max-h-[85vh] transition-all duration-300"
        style={{
          animation: "fadeSlideIn 0.2s ease",
          boxShadow:
            engine === "openai"
              ? "0 25px 50px -12px rgba(16, 185, 129, 0.15)"
              : engine === "gemini"
                ? "0 25px 50px -12px rgba(59, 130, 246, 0.15)"
                : "0 25px 50px -12px rgba(255, 91, 4, 0.15)",
        }}
      >
        {/* Header with beautiful gradient badge */}
        <div className="p-6 border-b border-black/5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-300"
              style={{
                background:
                  engine === "openai"
                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                    : engine === "gemini"
                      ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                      : "linear-gradient(135deg, #FF5B04 0%, #FF8C00 100%)",
              }}
            >
              <svg
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="16"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" x2="8" y1="13" y2="13" />
                <line x1="16" x2="8" y1="17" y2="17" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold font-geist text-gray-900">
                AI Excerpt Generator
              </h3>
              <p className="text-xs text-gray-400 font-geist">
                Draft perfectly summarized, SEO-friendly snippets
              </p>
            </div>
          </div>
          <button
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-black/5 transition-colors"
            type="button"
            onClick={onClose}
          >
            <svg
              fill="none"
              height="14"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              width="14"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 min-h-0">
          {/* Engine & Model Selector */}
          <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-4 space-y-3">
            {/* Engine selector */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex flex-col">
                <span className="text-xs font-semibold font-geist text-gray-700">
                  AI Intelligence Engine
                </span>
                <span className="text-[10px] text-gray-400 font-geist">
                  Select the AI brain for excerpting
                </span>
              </div>
              <div className="flex bg-black/[0.04] p-1 rounded-xl gap-1">
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "openai"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  type="button"
                  onClick={() => setEngine("openai")}
                >
                  <img src="/assets/logos/ai/openai.svg" alt="OpenAI" className="w-3.5 h-3.5 object-contain" /> OpenAI
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "gemini"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  type="button"
                  onClick={() => setEngine("gemini")}
                >
                  <img src="/assets/logos/ai/google-gemini-icon.svg" alt="Gemini" className="w-3.5 h-3.5 object-contain" /> Gemini
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "puter"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  type="button"
                  onClick={() => setEngine("puter")}
                >
                  <img src="/assets/logos/ai/puter.svg" alt="Puter" className="w-3.5 h-3.5 object-contain" /> Puter
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "mistral"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  type="button"
                  onClick={() => setEngine("mistral")}
                >
                  <img src="/assets/logos/ai/mistral-ai-icon.svg" alt="Mistral" className="w-3.5 h-3.5 object-contain" /> Mistral
                </button>
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
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                {engine === "gemini" ? (
                  <>
                    <option value="gemini-flash-latest">
                      Gemini 1.5 Flash (Super Fast)
                    </option>
                    <option value="gemini-1.5-pro-latest">
                      Gemini 1.5 Pro (Deep Reasoning)
                    </option>
                    <option value="gemini-2.0-flash-exp">
                      Gemini 2.0 Flash (Next-Gen Preview)
                    </option>
                  </>
                ) : engine === "mistral" ? (
                  <>
                    <option value="mistral-large-latest">
                      Mistral Large (Most Capable)
                    </option>
                    <option value="mistral-small-latest">
                      Mistral Small (Fast)
                    </option>
                    <option value="mistral-nemo">
                      Mistral Nemo (Lightweight)
                    </option>
                    <option value="codestral-latest">Codestral (Code)</option>
                  </>
                ) : (
                  <>
                    <option value="gpt-5.5-pro">
                      GPT-5.5 Pro (State-of-the-Art)
                    </option>
                    <option value="gpt-5.5">
                      GPT-5.5 Standard (Advanced &amp; Creative)
                    </option>
                    <option value="gpt-5.4-pro">
                      GPT-5.4 Pro (High Precision)
                    </option>
                    <option value="gpt-5.4">
                      GPT-5.4 Standard (Balanced &amp; Fast)
                    </option>
                    <option value="gpt-5.4-mini">
                      GPT-5.4 Mini (Lightweight &amp; Efficient)
                    </option>
                    <option value="gpt-5.4-nano">
                      GPT-5.4 Nano (Super Speed)
                    </option>
                    <option value="gpt-5.3-chat">
                      GPT-5.3 Chat (Conversational)
                    </option>
                    <option value="gpt-5.3-codex">
                      GPT-5.3 Codex (Programming &amp; Logic)
                    </option>
                    <option value="gpt-5.2-pro">
                      GPT-5.2 Pro (Professional)
                    </option>
                    <option value="gpt-5.2-chat">
                      GPT-5.2 Chat (Standard Chat)
                    </option>
                    <option value="gpt-5.2">GPT-5.2 Standard (General)</option>
                    <option value="gpt-5.1-chat-latest">
                      GPT-5.1 Chat (Legacy Chat)
                    </option>
                    <option value="gpt-5.1">
                      GPT-5.1 Standard (Legacy General)
                    </option>
                    <option value="gpt-4o">
                      GPT-4o Premium (Advanced &amp; Creative)
                    </option>
                    <option value="gpt-4o-mini">
                      GPT-4o Mini (Fast &amp; Efficient)
                    </option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Custom Focus Instructions */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-jetbrains-mono text-gray-400 uppercase tracking-wider block">
              Custom Focus Guidelines (Optional)
            </label>
            <input
              className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-400 border border-transparent focus:border-orange-100 transition-all"
              disabled={isGenerating}
              placeholder="e.g. 'Emphasize the coding aspect', 'Make it sound casual'"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          {/* Action Trigger */}
          <div className="flex justify-end pt-1">
            <button
              className="h-11 px-6 rounded-xl text-sm font-geist font-medium text-white transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99]"
              disabled={isGenerating}
              style={{
                background:
                  engine === "openai"
                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                    : engine === "gemini"
                      ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                      : "linear-gradient(135deg, #FF5B04 0%, #FF8C00 100%)",
              }}
              type="button"
              onClick={handleGenerate}
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin"
                    fill="none"
                    height="12"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    width="12"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  <span>Summarizing Post...</span>
                </>
              ) : (
                <>
                  <svg
                    fill="none"
                    height="12"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="12"
                  >
                    <path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z" />
                  </svg>
                  <span>Generate Excerpt</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex gap-2">
              <svg
                className="flex-shrink-0 mt-0.5"
                fill="none"
                height="16"
                stroke="#ef4444"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                width="16"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              <p className="text-xs font-geist text-red-600 font-medium">
                {error}
              </p>
            </div>
          )}

          {/* Result / Preview Box */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label
                className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider block transition-colors duration-300"
                style={{
                  color:
                    engine === "openai"
                      ? "#10B981"
                      : engine === "gemini"
                        ? "#3B82F6"
                        : "#FF5B04",
                }}
              >
                Draft Excerpt Preview
              </label>

              {/* Color-Coded SEO Character Counter */}
              <div
                className={`text-xs font-geist px-2 py-0.5 rounded-full border transition-all duration-300 ${getCounterBg(result.length)}`}
              >
                <span className={getCounterColor(result.length)}>
                  {result.length}
                </span>{" "}
                / 160 chars
                {result.length >= 120 && result.length <= 160 && (
                  <span className="ml-1 text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
                    <svg
                      fill="none"
                      height="9"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      width="9"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>{" "}
                    Perfect SEO Length
                  </span>
                )}
                {result.length > 200 && (
                  <span className="ml-1 text-[10px] font-bold text-red-600 flex items-center gap-0.5">
                    <svg
                      fill="none"
                      height="9"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      width="9"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" x2="12" y1="9" y2="13" />
                      <line x1="12" x2="12.01" y1="17" y2="17" />
                    </svg>{" "}
                    Truncated in search
                  </span>
                )}
              </div>
            </div>

            <textarea
              className={`w-full text-sm font-geist bg-gray-50 border rounded-2xl p-4 outline-none resize-none transition-all duration-300 ${
                isGenerating
                  ? engine === "openai"
                    ? "animate-pulse border-emerald-200"
                    : engine === "gemini"
                      ? "animate-pulse border-blue-200"
                      : "animate-pulse border-orange-200"
                  : "border-black/5 focus:border-orange-200 focus:ring-1 focus:ring-orange-100"
              }`}
              disabled={isGenerating}
              placeholder="Your AI excerpt will generate here, or you can type here to refine manually..."
              rows={4}
              value={result}
              onChange={(e) => setResult(e.target.value)}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-black/5 bg-gray-50 flex gap-2 flex-shrink-0">
          <button
            className="flex-1 h-11 rounded-xl text-sm font-geist font-medium text-white transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            disabled={!result.trim() || isGenerating}
            style={{
              background:
                engine === "openai"
                  ? "#10B981"
                  : engine === "gemini"
                    ? "#3B82F6"
                    : "#FF5B04",
            }}
            type="button"
            onClick={handleApply}
          >
            <span>Apply Excerpt</span>
            <svg
              fill="none"
              height="14"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              width="14"
            >
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </button>
          <button
            className="px-5 h-11 rounded-xl text-sm font-geist font-medium text-gray-600 bg-white border border-black/5 hover:bg-black/5 transition-colors cursor-pointer"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── AI Title Modal ─────────────────────────────────────────────────────────
const AITitleModal = ({
  isOpen,
  onClose,
  editor,
  title,
  setTitle,
  postType,
}: {
  isOpen: boolean;
  onClose: () => void;
  editor: any;
  title: string;
  setTitle: (val: string) => void;
  postType: string;
}) => {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [engine, setEngine] = useState<
    "openai" | "gemini" | "puter" | "mistral" | "anthropic"
  >(
    () =>
      (loadAIConfig().defaultEngine ?? "puter") as
        | "openai"
        | "gemini"
        | "puter"
        | "mistral"
        | "anthropic",
  );
  const [model, setModel] = useState<string>(
    () => loadAIConfig().defaultModel ?? "gpt-4o-mini",
  );

  // Sync default engine models when engine changes
  useEffect(() => {
    if (engine === "gemini") {
      if (!model.startsWith("gemini")) setModel("gemini-flash-latest");
    } else if (engine === "mistral") {
      if (!model.startsWith("mistral") && !model.startsWith("codestral"))
        setModel("mistral-large-latest");
    } else {
      if (!model.startsWith("gpt")) setModel("gpt-5.5");
    }
  }, [engine, model]);

  // Sync state on open
  useEffect(() => {
    if (isOpen) {
      setSelectedTitle("");
      setSuggestions([]);
      setError("");
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const plainText = editor ? editor.getText() : "";
      const textContext = plainText.trim().substring(0, 3000);

      if (engine === "puter") {
        let systemInstructions = `Suggest 3 high-impact, highly clickable, and search-optimized alternative titles for a post with the active title: "${title || ""}", category: "${postType || "blog"}", and content: "${textContext}". Format your response STRICTLY as a raw JSON array of strings, e.g. ["Optimized Title 1", "Optimized Title 2", "Optimized Title 3"]. Deliver ONLY the JSON array, no markdown backticks, no wrap text, and no leading/trailing spaces.`;

        if (prompt.trim()) {
          systemInstructions += `\n\nAlso incorporate the following custom instructions: "${prompt.trim()}"`;
        }

        const { puter } = await import("@heyputer/puter.js");
        const chatResponse = await puter.ai.chat(systemInstructions, { model });

        let text = "";

        if (chatResponse.message?.content) {
          text =
            typeof chatResponse.message.content === "string"
              ? chatResponse.message.content
              : String(chatResponse.message.content);
        } else {
          text = String(chatResponse);
        }

        text = text.trim();
        // Clean backticks
        if (text.startsWith("```json")) {
          text = text
            .replace(/^```json/, "")
            .replace(/```$/, "")
            .trim();
        } else if (text.startsWith("```html")) {
          text = text
            .replace(/^```html/, "")
            .replace(/```$/, "")
            .trim();
        } else if (text.startsWith("```")) {
          text = text.replace(/^```/, "").replace(/```$/, "").trim();
        }

        const parsed = JSON.parse(text);

        if (Array.isArray(parsed)) {
          setSuggestions(parsed);
        } else {
          throw new Error("Failed to parse array from response.");
        }
      } else {
        const response = await fetch("/api/pirateCOS/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "titles",
            title,
            content: prompt.trim()
              ? `${textContext}\n\nCustom Instructions:\n${prompt.trim()}`
              : textContext,
            postType,
            engine,
            model,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to generate titles.");
        }

        setSuggestions(data.data);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (selectedTitle) {
      setTitle(selectedTitle);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-[540px] max-w-[95vw] border border-black/5 flex flex-col max-h-[85vh] transition-all duration-300"
        style={{
          animation: "fadeSlideIn 0.2s ease",
          boxShadow:
            engine === "openai"
              ? "0 25px 50px -12px rgba(16, 185, 129, 0.15)"
              : engine === "gemini"
                ? "0 25px 50px -12px rgba(59, 130, 246, 0.15)"
                : "0 25px 50px -12px rgba(255, 91, 4, 0.15)",
        }}
      >
        <div className="p-6 border-b border-black/5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-300"
              style={{
                background:
                  engine === "openai"
                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                    : engine === "gemini"
                      ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                      : "linear-gradient(135deg, #FF5B04 0%, #FF8C00 100%)",
              }}
            >
              <svg
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="16"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold font-geist text-gray-900">
                AI Title Optimizer
              </h3>
              <p className="text-xs text-gray-400 font-geist">
                Generate high-impact headline recommendations
              </p>
            </div>
          </div>
          <button
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-black/5 transition-colors"
            type="button"
            onClick={onClose}
          >
            <svg
              fill="none"
              height="14"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              width="14"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 flex-1 min-h-0">
          <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex flex-col">
                <span className="text-xs font-semibold font-geist text-gray-700">
                  AI Intelligence Engine
                </span>
              </div>
              <div className="flex bg-black/[0.04] p-1 rounded-xl gap-1">
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "openai"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  type="button"
                  onClick={() => setEngine("openai")}
                >
                  <img src="/assets/logos/ai/openai.svg" alt="OpenAI" className="w-3.5 h-3.5 object-contain" /> OpenAI
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "gemini"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  type="button"
                  onClick={() => setEngine("gemini")}
                >
                  <img src="/assets/logos/ai/google-gemini-icon.svg" alt="Gemini" className="w-3.5 h-3.5 object-contain" /> Gemini
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "puter"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  type="button"
                  onClick={() => setEngine("puter")}
                >
                  <img src="/assets/logos/ai/puter.svg" alt="Puter" className="w-3.5 h-3.5 object-contain" /> Puter
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "mistral"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  type="button"
                  onClick={() => setEngine("mistral")}
                >
                  <img src="/assets/logos/ai/mistral-ai-icon.svg" alt="Mistral" className="w-3.5 h-3.5 object-contain" /> Mistral
                </button>
              </div>
            </div>

            <div className="h-px bg-black/5" />

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold font-geist text-gray-700">
                  Model Version
                </span>
              </div>
              <select
                className="text-xs font-semibold font-geist bg-white hover:bg-black/[0.02] border border-black/5 text-gray-700 px-3 py-2 rounded-xl outline-none transition-all cursor-pointer shadow-sm"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                {engine === "gemini" ? (
                  <>
                    <option value="gemini-flash-latest">
                      Gemini 1.5 Flash (Super Fast)
                    </option>
                    <option value="gemini-1.5-pro-latest">
                      Gemini 1.5 Pro (Deep Reasoning)
                    </option>
                    <option value="gemini-2.0-flash-exp">
                      Gemini 2.0 Flash (Next-Gen Preview)
                    </option>
                  </>
                ) : engine === "mistral" ? (
                  <>
                    <option value="mistral-large-latest">
                      Mistral Large (Most Capable)
                    </option>
                    <option value="mistral-small-latest">
                      Mistral Small (Fast)
                    </option>
                    <option value="mistral-nemo">
                      Mistral Nemo (Lightweight)
                    </option>
                    <option value="codestral-latest">Codestral (Code)</option>
                  </>
                ) : (
                  <>
                    <option value="gpt-5.5-pro">
                      GPT-5.5 Pro (State-of-the-Art)
                    </option>
                    <option value="gpt-5.5">
                      GPT-5.5 Standard (Advanced &amp; Creative)
                    </option>
                    <option value="gpt-5.4-pro">
                      GPT-5.4 Pro (High Precision)
                    </option>
                    <option value="gpt-5.4">
                      GPT-5.4 Standard (Balanced &amp; Fast)
                    </option>
                    <option value="gpt-4o">
                      GPT-4o Premium (Advanced &amp; Creative)
                    </option>
                    <option value="gpt-4o-mini">
                      GPT-4o Mini (Fast &amp; Efficient)
                    </option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-jetbrains-mono text-gray-400 uppercase tracking-wider block">
              Custom Guidelines / Key Focus Words (Optional)
            </label>
            <input
              className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-400 border border-transparent focus:border-orange-100 transition-all"
              disabled={isGenerating}
              placeholder="e.g. 'Make it sound casual', 'Focus on React performance'"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              className="h-11 px-6 rounded-xl text-sm font-geist font-medium text-white transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99]"
              disabled={isGenerating}
              style={{
                background:
                  engine === "openai"
                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                    : engine === "gemini"
                      ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                      : "linear-gradient(135deg, #FF5B04 0%, #FF8C00 100%)",
              }}
              type="button"
              onClick={handleGenerate}
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin"
                    fill="none"
                    height="12"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    width="12"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  <span>Generating headlines...</span>
                </>
              ) : (
                <>
                  <svg
                    fill="none"
                    height="12"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="12"
                  >
                    <path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z" />
                  </svg>
                  <span>Generate Alternatives</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex gap-2">
              <svg
                className="flex-shrink-0 mt-0.5"
                fill="none"
                height="16"
                stroke="#ef4444"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                width="16"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              <p className="text-xs font-geist text-red-600 font-medium">
                {error}
              </p>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="space-y-2.5">
              <label
                className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider block transition-colors duration-300"
                style={{
                  color:
                    engine === "openai"
                      ? "#10B981"
                      : engine === "gemini"
                        ? "#3B82F6"
                        : "#FF5B04",
                }}
              >
                Select Your Favorite Headline
              </label>

              <div className="space-y-2">
                {suggestions.map((t, idx) => (
                  <button
                    key={idx}
                    className={`w-full text-left text-sm font-geist p-3.5 rounded-2xl transition-all border flex items-start gap-3 cursor-pointer ${
                      selectedTitle === t
                        ? engine === "openai"
                          ? "bg-emerald-50/50 border-emerald-500 text-emerald-950 font-medium shadow-sm"
                          : engine === "gemini"
                            ? "bg-indigo-50/50 border-indigo-500 text-indigo-950 font-medium shadow-sm"
                            : "bg-orange-50/50 border-[#FF5B04] text-orange-950 font-medium shadow-sm"
                        : "bg-gray-50 border-black/5 hover:border-black/10 text-gray-800"
                    }`}
                    type="button"
                    onClick={() => setSelectedTitle(t)}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold border transition-colors ${
                        selectedTitle === t
                          ? engine === "openai"
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : engine === "gemini"
                              ? "bg-indigo-500 text-white border-indigo-500"
                              : "bg-[#FF5B04] text-white border-[#FF5B04]"
                          : "bg-white border-black/10 text-gray-400"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="flex-1 leading-snug">{t}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-black/5 bg-gray-50 flex gap-2 flex-shrink-0">
          <button
            className="flex-1 h-11 rounded-xl text-sm font-geist font-medium text-white transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            disabled={!selectedTitle || isGenerating}
            style={{
              background:
                engine === "openai"
                  ? "#10B981"
                  : engine === "gemini"
                    ? "#3B82F6"
                    : "#FF5B04",
            }}
            type="button"
            onClick={handleApply}
          >
            <span>Apply Selected Headline</span>
          </button>
          <button
            className="px-5 h-11 rounded-xl text-sm font-geist font-medium text-gray-600 bg-white border border-black/5 hover:bg-black/5 transition-colors cursor-pointer"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── AI Tags Modal ──────────────────────────────────────────────────────────
const AITagsModal = ({
  isOpen,
  onClose,
  editor,
  postTitle,
  postType,
  tags,
  setTags,
}: {
  isOpen: boolean;
  onClose: () => void;
  editor: any;
  postTitle: string;
  postType: string;
  tags: string[];
  setTags: (val: string[]) => void;
}) => {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [engine, setEngine] = useState<
    "openai" | "gemini" | "puter" | "mistral" | "anthropic"
  >(
    () =>
      (loadAIConfig().defaultEngine ?? "puter") as
        | "openai"
        | "gemini"
        | "puter"
        | "mistral"
        | "anthropic",
  );
  const [model, setModel] = useState<string>(
    () => loadAIConfig().defaultModel ?? "gpt-4o-mini",
  );

  // Sync default engine models when engine changes
  useEffect(() => {
    if (engine === "gemini") {
      if (!model.startsWith("gemini")) setModel("gemini-flash-latest");
    } else if (engine === "mistral") {
      if (!model.startsWith("mistral") && !model.startsWith("codestral"))
        setModel("mistral-large-latest");
    } else {
      if (!model.startsWith("gpt")) setModel("gpt-5.5");
    }
  }, [engine, model]);

  // Sync state on open
  useEffect(() => {
    if (isOpen) {
      setSelectedTags([]);
      setSuggestions([]);
      setError("");
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const plainText = editor ? editor.getText() : "";
      const textContext = plainText.trim().substring(0, 3000);

      if (engine === "puter") {
        let systemInstructions = `Suggest 5-8 highly relevant, lowercase, search-optimized tags / keywords for a post with the title: "${postTitle || ""}", category: "${postType || "blog"}", and content: "${textContext}". Format your response STRICTLY as a raw JSON array of strings, e.g. ["tech", "javascript", "react"]. Deliver ONLY the JSON array, no markdown backticks, no wrap text, and no leading/trailing spaces.`;

        if (prompt.trim()) {
          systemInstructions += `\n\nAlso incorporate the following custom instructions: "${prompt.trim()}"`;
        }

        const { puter } = await import("@heyputer/puter.js");
        const chatResponse = await puter.ai.chat(systemInstructions, { model });

        let text = "";

        if (chatResponse.message?.content) {
          text =
            typeof chatResponse.message.content === "string"
              ? chatResponse.message.content
              : String(chatResponse.message.content);
        } else {
          text = String(chatResponse);
        }

        text = text.trim();
        // Clean backticks
        if (text.startsWith("```json")) {
          text = text
            .replace(/^```json/, "")
            .replace(/```$/, "")
            .trim();
        } else if (text.startsWith("```html")) {
          text = text
            .replace(/^```html/, "")
            .replace(/```$/, "")
            .trim();
        } else if (text.startsWith("```")) {
          text = text.replace(/^```/, "").replace(/```$/, "").trim();
        }

        let parsedTags: string[] = [];

        try {
          const json = JSON.parse(text);

          if (Array.isArray(json)) {
            parsedTags = json.map((t) => String(t).toLowerCase());
          }
        } catch {
          // Fallback parsing: split by newlines, commas, or semicolons
          parsedTags = text
            .split(/[\n,;]+/)
            .map((t) =>
              t
                .replace(/^\d+\.\s*/, "")
                .replace(/[\[\]"']/g, "")
                .trim()
                .toLowerCase(),
            )
            .filter((t) => t.length > 1);
        }

        if (parsedTags.length > 0) {
          setSuggestions(parsedTags);
          setSelectedTags(parsedTags);
        } else {
          throw new Error("Failed to parse array or keywords from response.");
        }
      } else {
        const response = await fetch("/api/pirateCOS/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "tags",
            title: postTitle,
            content: prompt.trim()
              ? `${textContext}\n\nCustom Instructions:\n${prompt.trim()}`
              : textContext,
            postType,
            engine,
            model,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to generate tags.");
        }

        const parsedTags = data.data.map((t: string) => t.toLowerCase());

        setSuggestions(parsedTags);
        setSelectedTags(parsedTags);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleApply = () => {
    const combined = Array.from(new Set([...tags, ...selectedTags]));

    setTags(combined);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-[540px] max-w-[95vw] border border-black/5 flex flex-col max-h-[85vh] transition-all duration-300"
        style={{
          animation: "fadeSlideIn 0.2s ease",
          boxShadow:
            engine === "openai"
              ? "0 25px 50px -12px rgba(16, 185, 129, 0.15)"
              : engine === "gemini"
                ? "0 25px 50px -12px rgba(59, 130, 246, 0.15)"
                : "0 25px 50px -12px rgba(255, 91, 4, 0.15)",
        }}
      >
        <div className="p-6 border-b border-black/5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-300"
              style={{
                background:
                  engine === "openai"
                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                    : engine === "gemini"
                      ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                      : "linear-gradient(135deg, #FF5B04 0%, #FF8C00 100%)",
              }}
            >
              <svg
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="16"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" x2="7.01" y1="7" y2="7" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold font-geist text-gray-900">
                AI Tag Suggestor
              </h3>
              <p className="text-xs text-gray-400 font-geist">
                Generate optimized tags and taxonomies
              </p>
            </div>
          </div>
          <button
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-black/5 transition-colors"
            type="button"
            onClick={onClose}
          >
            <svg
              fill="none"
              height="14"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              width="14"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 flex-1 min-h-0">
          <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex flex-col">
                <span className="text-xs font-semibold font-geist text-gray-700">
                  AI Intelligence Engine
                </span>
              </div>
              <div className="flex bg-black/[0.04] p-1 rounded-xl gap-1">
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "openai"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-950"
                  }`}
                  type="button"
                  onClick={() => setEngine("openai")}
                >
                  <img src="/assets/logos/ai/openai.svg" alt="OpenAI" className="w-3.5 h-3.5 object-contain" /> OpenAI
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "gemini"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-955"
                  }`}
                  type="button"
                  onClick={() => setEngine("gemini")}
                >
                  <img src="/assets/logos/ai/google-gemini-icon.svg" alt="Gemini" className="w-3.5 h-3.5 object-contain" /> Gemini
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "puter"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  type="button"
                  onClick={() => setEngine("puter")}
                >
                  <img src="/assets/logos/ai/puter.svg" alt="Puter" className="w-3.5 h-3.5 object-contain" /> Puter
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "mistral"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  type="button"
                  onClick={() => setEngine("mistral")}
                >
                  <img src="/assets/logos/ai/mistral-ai-icon.svg" alt="Mistral" className="w-3.5 h-3.5 object-contain" /> Mistral
                </button>
              </div>
            </div>

            <div className="h-px bg-black/5" />

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold font-geist text-gray-700">
                  Model Version
                </span>
              </div>
              <select
                className="text-xs font-semibold font-geist bg-white hover:bg-black/[0.02] border border-black/5 text-gray-700 px-3 py-2 rounded-xl outline-none transition-all cursor-pointer shadow-sm"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                {engine === "gemini" ? (
                  <>
                    <option value="gemini-flash-latest">
                      Gemini 1.5 Flash (Super Fast)
                    </option>
                    <option value="gemini-1.5-pro-latest">
                      Gemini 1.5 Pro (Deep Reasoning)
                    </option>
                    <option value="gemini-2.0-flash-exp">
                      Gemini 2.0 Flash (Next-Gen Preview)
                    </option>
                  </>
                ) : engine === "mistral" ? (
                  <>
                    <option value="mistral-large-latest">
                      Mistral Large (Most Capable)
                    </option>
                    <option value="mistral-small-latest">
                      Mistral Small (Fast)
                    </option>
                    <option value="mistral-nemo">
                      Mistral Nemo (Lightweight)
                    </option>
                    <option value="codestral-latest">Codestral (Code)</option>
                  </>
                ) : (
                  <>
                    <option value="gpt-5.5-pro">
                      GPT-5.5 Pro (State-of-the-Art)
                    </option>
                    <option value="gpt-5.5">
                      GPT-5.5 Standard (Advanced &amp; Creative)
                    </option>
                    <option value="gpt-5.4-pro">
                      GPT-5.4 Pro (High Precision)
                    </option>
                    <option value="gpt-5.4">
                      GPT-5.4 Standard (Balanced &amp; Fast)
                    </option>
                    <option value="gpt-4o">
                      GPT-4o Premium (Advanced &amp; Creative)
                    </option>
                    <option value="gpt-4o-mini">
                      GPT-4o Mini (Fast &amp; Efficient)
                    </option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-jetbrains-mono text-gray-400 uppercase tracking-wider block">
              Custom Tag Guidelines (Optional)
            </label>
            <input
              className="w-full text-sm font-geist bg-black/5 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-400 border border-transparent focus:border-orange-100 transition-all"
              disabled={isGenerating}
              placeholder="e.g. 'Use web development tags', 'Include SEO'"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              className="h-11 px-6 rounded-xl text-sm font-geist font-medium text-white transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99]"
              disabled={isGenerating}
              style={{
                background:
                  engine === "openai"
                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                    : engine === "gemini"
                      ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                      : "linear-gradient(135deg, #FF5B04 0%, #FF8C00 100%)",
              }}
              type="button"
              onClick={handleGenerate}
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin"
                    fill="none"
                    height="12"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    width="12"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  <span>Generating tags...</span>
                </>
              ) : (
                <>
                  <svg
                    fill="none"
                    height="12"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="12"
                  >
                    <path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z" />
                  </svg>
                  <span>Generate Tags</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex gap-2">
              <svg
                className="flex-shrink-0 mt-0.5"
                fill="none"
                height="16"
                stroke="#ef4444"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                width="16"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              <p className="text-xs font-geist text-red-600 font-medium">
                {error}
              </p>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="space-y-2.5">
              <label
                className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider block transition-colors duration-300"
                style={{
                  color:
                    engine === "openai"
                      ? "#10B981"
                      : engine === "gemini"
                        ? "#3B82F6"
                        : "#FF5B04",
                }}
              >
                Select Tags to Apply
              </label>

              <div className="flex flex-wrap gap-2.5">
                {suggestions.map((t, idx) => {
                  const isSelected = selectedTags.includes(t);

                  return (
                    <button
                      key={idx}
                      className={`px-4 py-2 rounded-2xl text-xs font-semibold font-geist border transition-all flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? engine === "openai"
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm"
                            : engine === "gemini"
                              ? "bg-indigo-50 border-indigo-300 text-indigo-800 shadow-sm"
                              : "bg-orange-50 border-orange-300 text-orange-800 shadow-sm"
                          : "bg-gray-50 border-black/5 text-gray-600 hover:bg-gray-100"
                      }`}
                      type="button"
                      onClick={() => toggleTag(t)}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-md flex items-center justify-center text-[9px] border transition-colors ${
                          isSelected
                            ? engine === "openai"
                              ? "bg-emerald-500 text-white border-emerald-500"
                              : engine === "gemini"
                                ? "bg-indigo-500 text-white border-indigo-500"
                                : "bg-[#FF5B04] text-white border-[#FF5B04]"
                            : "bg-white border-black/10"
                        }`}
                      >
                        {isSelected && "✓"}
                      </span>
                      <span>#{t}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-black/5 bg-gray-50 flex gap-2 flex-shrink-0">
          <button
            className="flex-1 h-11 rounded-xl text-sm font-geist font-medium text-white transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            disabled={selectedTags.length === 0 || isGenerating}
            style={{
              background:
                engine === "openai"
                  ? "#10B981"
                  : engine === "gemini"
                    ? "#3B82F6"
                    : "#FF5B04",
            }}
            type="button"
            onClick={handleApply}
          >
            <span>Apply Selected Tags</span>
          </button>
          <button
            className="px-5 h-11 rounded-xl text-sm font-geist font-medium text-gray-600 bg-white border border-black/5 hover:bg-black/5 transition-colors cursor-pointer"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── AI Copilot Modal ────────────────────────────────────────────────────────
const AICopilotModal = ({
  isOpen,
  onClose,
  editor,
  postTitle,
  postType,
  preset,
  initialPrompt = "",
}: {
  isOpen: boolean;
  onClose: () => void;
  editor: any;
  postTitle: string;
  postType: string;
  preset?: string;
  initialPrompt?: string;
}) => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [engine, setEngine] = useState<
    "openai" | "gemini" | "puter" | "mistral" | "anthropic"
  >(
    () =>
      (loadAIConfig().defaultEngine ?? "puter") as
        | "openai"
        | "gemini"
        | "puter"
        | "mistral"
        | "anthropic",
  );
  const [model, setModel] = useState<string>(
    () => loadAIConfig().defaultModel ?? "gpt-4o-mini",
  );

  // Selection & Context states
  const [selectedText, setSelectedText] = useState("");
  const [hasSelection, setHasSelection] = useState(false);
  const [selectionRange, setSelectionRange] = useState<{
    from: number;
    to: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPrompt(initialPrompt || "");
      setResult("");
      setError("");
    }
  }, [isOpen, initialPrompt]);

  useEffect(() => {
    if (isOpen && editor) {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, " ");

      if (text.trim()) {
        setSelectedText(text.trim());
        setHasSelection(true);
        setSelectionRange({ from, to });
      } else {
        setSelectedText("");
        setHasSelection(false);
        setSelectionRange(null);
      }
    }
  }, [isOpen, editor]);

  useEffect(() => {
    if (engine === "gemini") {
      if (!model.startsWith("gemini")) setModel("gemini-flash-latest");
    } else if (engine === "mistral") {
      if (!model.startsWith("mistral") && !model.startsWith("codestral"))
        setModel("mistral-large-latest");
    } else {
      if (!model.startsWith("gpt")) setModel("gpt-5.5");
    }
  }, [engine]);

  const presets = postType === "social-post" ? [
    {
      label: "AI Hook",
      prompt: "Generate 3 scroll-stopping opening hooks for my social post.",
    },
    {
      label: "Shorten to Limit",
      prompt: "Intelligently compress my text to fit within social media character limits while retaining the key message.",
    },
    {
      label: "Hashtag Ideas",
      prompt: "Generate high-engagement hashtag recommendations matching the topic of this post.",
    },
    {
      label: "Professional Rewrite",
      prompt: "Rewrite this social post in a polished, engaging professional tone.",
    }
  ] : [
    {
      label: "Draft Introduction",
      prompt:
        "Write a high-converting, engaging introduction paragraph based on the post title and details.",
    },
    {
      label: "Step-by-Step Outline",
      prompt:
        "Generate a detailed, step-by-step structure/outline with subheadings.",
    },
    {
      label: "Make Professional",
      prompt:
        "Summarize the key ideas and rewrite them in a highly polished, professional tone.",
    },
    {
      label: "Write Key Takeaways",
      prompt:
        "Create a visual checklist of the top 5 key takeaways or learnings.",
    },
  ];

  const handleGenerate = async (customPrompt?: string) => {
    const activePrompt = customPrompt || prompt;

    if (!activePrompt.trim()) return;

    setIsGenerating(true);
    setError("");
    setResult("");

    try {
      const editorContent = editor ? editor.getHTML() : "";
      const surroundingText = editor ? editor.getText() : "";
      const surroundingContext =
        surroundingText.length > 2000
          ? surroundingText.slice(-2000)
          : surroundingText;

      if (engine === "puter") {
        let contextInfo = "";

        if (hasSelection && selectedText) {
          contextInfo += `\n\nTARGET TEXT FOR EDITING (Rewrite, expand, improve, or format this selected text directly based on the user prompt): "${selectedText}"`;
        }
        if (surroundingContext.trim()) {
          contextInfo += `\n\nSURROUNDING BLOG CONTEXT (Ensure your generated section matches this writing style, tone, and flow perfectly, without repeating existing paragraphs): \n... ${surroundingContext.trim()}`;
        }

        const systemInstructions = `You are a world-class professional copywriter and technical content author. The user wants you to write content based on the following prompt: "${activePrompt}". The context of the post is: title: "${postTitle || ""}", category: "${postType || "blog"}".${contextInfo}
Write a comprehensive, fully detailed, and substantial piece of content. Expand on the concepts deeply with rich explanations, multiple robust and fully-fleshed out paragraphs, structured subheadings, and thorough insights (aim for at least 300 to 600 words or a complete, deep-dive section, unless the prompt explicitly requests a short summary or brief answer). Output in standard clean HTML format (using <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote> as appropriate). Do NOT use markdown. Do NOT use <html>, <head>, or <body> tags. Deliver ONLY the raw HTML block, no backticks, no markdown formatting, and no wrapper comments.`;

        const { puter } = await import("@heyputer/puter.js");
        const chatResponse = await puter.ai.chat(systemInstructions, { model });

        let text = "";

        if (chatResponse.message?.content) {
          text =
            typeof chatResponse.message.content === "string"
              ? chatResponse.message.content
              : String(chatResponse.message.content);
        } else {
          text = String(chatResponse);
        }

        text = text.trim();
        if (text.startsWith("```json")) {
          text = text
            .replace(/^```json/, "")
            .replace(/```$/, "")
            .trim();
        } else if (text.startsWith("```html")) {
          text = text
            .replace(/^```html/, "")
            .replace(/```$/, "")
            .trim();
        } else if (text.startsWith("```")) {
          text = text.replace(/^```/, "").replace(/```$/, "").trim();
        }

        setResult(text);
      } else {
        const response = await fetch("/api/pirateCOS/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "write",
            title: postTitle,
            content: editorContent,
            selectedText: hasSelection ? selectedText : "",
            surroundingContext: surroundingContext,
            postType,
            prompt: activePrompt,
            engine,
            model,
            preset: preset || "",
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to generate content.");
        }

        setResult(data.data);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsert = () => {
    if (result && editor) {
      if (hasSelection && selectionRange) {
        editor
          .chain()
          .focus()
          .setTextSelection(selectionRange)
          .insertContent(result)
          .run();
      } else {
        editor.chain().focus().insertContent(result).run();
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-[640px] max-w-[95vw] border border-black/5 flex flex-col max-h-[85vh] transition-all duration-300"
        style={{
          animation: "fadeSlideIn 0.2s ease",
          boxShadow:
            engine === "openai"
              ? "0 25px 50px -12px rgba(16, 185, 129, 0.15)"
              : engine === "gemini"
                ? "0 25px 50px -12px rgba(59, 130, 246, 0.15)"
                : "0 25px 50px -12px rgba(255, 91, 4, 0.15)",
        }}
      >
        {/* Header with beautiful gradient badge */}
        <div className="p-6 border-b border-black/5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-300"
              style={{
                background:
                  engine === "openai"
                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                    : engine === "gemini"
                      ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                      : "linear-gradient(135deg, #FF5B04 0%, #FF8C00 100%)",
              }}
            >
              <svg
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="16"
              >
                <path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold font-geist text-gray-900">
                AI Writing Copilot
              </h3>
              <p className="text-xs text-gray-400 font-geist">
                Generate structures, intros, and polished sections instantly
              </p>
            </div>
          </div>
          <button
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-black/5 transition-colors"
            onClick={onClose}
          >
            <svg
              fill="none"
              height="14"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              width="14"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 min-h-0">
          {/* Engine & Model Selector */}
          <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-4 space-y-3">
            {/* Engine selector */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex flex-col">
                <span className="text-xs font-semibold font-geist text-gray-700">
                  AI Intelligence Engine
                </span>
                <span className="text-[10px] text-gray-400 font-geist">
                  Select the AI brain for composition
                </span>
              </div>
              <div className="flex bg-black/[0.04] p-1 rounded-xl gap-1">
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "openai"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  onClick={() => setEngine("openai")}
                >
                  <img src="/assets/logos/ai/openai.svg" alt="OpenAI" className="w-3.5 h-3.5 object-contain" /> OpenAI
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "gemini"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  onClick={() => setEngine("gemini")}
                >
                  <img src="/assets/logos/ai/google-gemini-icon.svg" alt="Gemini" className="w-3.5 h-3.5 object-contain" /> Gemini
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "puter"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  onClick={() => setEngine("puter")}
                >
                  <img src="/assets/logos/ai/puter.svg" alt="Puter" className="w-3.5 h-3.5 object-contain" /> Puter
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center gap-1.5 cursor-pointer ${
                    engine === "mistral"
                      ? "bg-white text-gray-900 shadow-sm border border-black/5"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  type="button"
                  onClick={() => setEngine("mistral")}
                >
                  <img src="/assets/logos/ai/mistral-ai-icon.svg" alt="Mistral" className="w-3.5 h-3.5 object-contain" /> Mistral
                </button>
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
                className="text-xs font-semibold font-geist bg-white hover:bg-black/[0.02] border border-black/5 text-gray-700 px-3 py-2 rounded-xl outline-none transition-all cursor-pointer shadow-sm animate-in fade-in duration-200"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                {engine === "gemini" ? (
                  <>
                    <option value="gemini-flash-latest">
                      Gemini 1.5 Flash (Super Fast)
                    </option>
                    <option value="gemini-1.5-pro-latest">
                      Gemini 1.5 Pro (Deep Reasoning)
                    </option>
                    <option value="gemini-2.0-flash-exp">
                      Gemini 2.0 Flash (Next-Gen Preview)
                    </option>
                  </>
                ) : engine === "mistral" ? (
                  <>
                    <option value="mistral-large-latest">
                      Mistral Large (Most Capable)
                    </option>
                    <option value="mistral-small-latest">
                      Mistral Small (Fast)
                    </option>
                    <option value="mistral-nemo">
                      Mistral Nemo (Lightweight)
                    </option>
                    <option value="codestral-latest">Codestral (Code)</option>
                  </>
                ) : (
                  <>
                    <option value="gpt-5.5-pro">
                      GPT-5.5 Pro (State-of-the-Art)
                    </option>
                    <option value="gpt-5.5">
                      GPT-5.5 Standard (Advanced &amp; Creative)
                    </option>
                    <option value="gpt-5.4-pro">
                      GPT-5.4 Pro (High Precision)
                    </option>
                    <option value="gpt-5.4">
                      GPT-5.4 Standard (Balanced &amp; Fast)
                    </option>
                    <option value="gpt-5.4-mini">
                      GPT-5.4 Mini (Lightweight &amp; Efficient)
                    </option>
                    <option value="gpt-5.4-nano">
                      GPT-5.4 Nano (Super Speed)
                    </option>
                    <option value="gpt-5.3-chat">
                      GPT-5.3 Chat (Conversational)
                    </option>
                    <option value="gpt-5.3-codex">
                      GPT-5.3 Codex (Programming &amp; Logic)
                    </option>
                    <option value="gpt-5.2-pro">
                      GPT-5.2 Pro (Professional)
                    </option>
                    <option value="gpt-5.2-chat">
                      GPT-5.2 Chat (Standard Chat)
                    </option>
                    <option value="gpt-5.2">GPT-5.2 Standard (General)</option>
                    <option value="gpt-5.1-chat-latest">
                      GPT-5.1 Chat (Legacy Chat)
                    </option>
                    <option value="gpt-5.1">
                      GPT-5.1 Standard (Legacy General)
                    </option>
                    <option value="gpt-4o">
                      GPT-4o Premium (Advanced &amp; Creative)
                    </option>
                    <option value="gpt-4o-mini">
                      GPT-4o Mini (Fast &amp; Efficient)
                    </option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="text-[10px] font-bold font-jetbrains-mono text-gray-400 uppercase tracking-wider mb-2 block">
              Quick Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  className="text-left text-xs font-geist font-medium text-gray-700 bg-black/[0.02] border border-black/5 hover:border-[#FF5B04]/30 hover:bg-orange-50/30 p-3 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  disabled={isGenerating}
                  onClick={() => {
                    setPrompt(preset.prompt);
                    handleGenerate(preset.prompt);
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold font-jetbrains-mono text-gray-400 uppercase tracking-wider block">
              Custom Instructions
            </label>
            {hasSelection && (
              <div
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-geist mb-3 border transition-all duration-300 ${
                  engine === "openai"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : engine === "gemini"
                      ? "bg-indigo-50 border-indigo-200 text-indigo-800"
                      : "bg-orange-50 border-orange-200 text-orange-800"
                }`}
              >
                <span className="flex h-2 w-2 relative">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      engine === "openai"
                        ? "bg-emerald-400"
                        : engine === "gemini"
                          ? "bg-indigo-400"
                          : "bg-orange-400"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      engine === "openai"
                        ? "bg-emerald-500"
                        : engine === "gemini"
                          ? "bg-indigo-500"
                          : "bg-orange-500"
                    }`}
                  />
                </span>
                <span>
                  <strong>Selection Active:</strong> AI will rewrite and refine
                  your highlighted text (
                  <strong>{selectedText.length} characters</strong>).
                </span>
              </div>
            )}
            <textarea
              autoFocus
              className="w-full text-sm font-geist bg-black/5 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#FF5B04]/30 placeholder-gray-400 border border-transparent focus:border-orange-100 resize-none transition-all"
              disabled={isGenerating}
              placeholder="Provide details of what you want to write or refine (e.g., 'Draft a highly engaging 3-paragraph introduction detailing the benefits of modern responsive design...')"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="h-11 px-6 rounded-xl text-sm font-geist font-medium text-white transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                disabled={isGenerating || !prompt.trim()}
                style={{
                  background:
                    engine === "openai"
                      ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                      : engine === "gemini"
                        ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                        : "linear-gradient(135deg, #FF5B04 0%, #FF8C00 100%)",
                }}
                onClick={() => handleGenerate()}
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="animate-spin"
                      fill="none"
                      height="12"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      width="12"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <svg
                      fill="none"
                      height="12"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="12"
                    >
                      <path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z" />
                    </svg>
                    <span>
                      {hasSelection ? "Refine Selection" : "Compose Segment"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex gap-2">
              <svg
                className="flex-shrink-0 mt-0.5"
                fill="none"
                height="16"
                stroke="#ef4444"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                width="16"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              <p className="text-xs font-geist text-red-600 font-medium">
                {error}
              </p>
            </div>
          )}

          {/* Generation Preview Area */}
          {(isGenerating || result) && (
            <div className="space-y-2">
              <label
                className="text-[10px] font-bold font-jetbrains-mono uppercase tracking-wider block transition-colors duration-300"
                style={{
                  color:
                    engine === "openai"
                      ? "#10B981"
                      : engine === "gemini"
                        ? "#3B82F6"
                        : "#FF5B04",
                }}
              >
                AI Composition Preview
              </label>
              <div
                className={`border rounded-2xl p-4 bg-gray-50/50 min-h-[140px] text-sm overflow-y-auto max-h-[260px] font-geist prose prose-sm transition-all duration-300 ${
                  isGenerating
                    ? engine === "openai"
                      ? "animate-pulse border-emerald-200"
                      : engine === "gemini"
                        ? "animate-pulse border-blue-200"
                        : "animate-pulse border-orange-200"
                    : "border-black/5"
                }`}
              >
                {isGenerating ? (
                  <div className="space-y-2.5">
                    <div className="h-4 bg-gray-200 rounded-md w-3/4" />
                    <div className="h-4 bg-gray-200 rounded-md" />
                    <div className="h-4 bg-gray-200 rounded-md w-5/6" />
                  </div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: result }} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {result && !isGenerating && (
          <div className="p-4 border-t border-black/5 bg-gray-50 flex gap-2 flex-shrink-0">
            <button
              className="flex-1 h-11 rounded-xl text-sm font-geist font-medium text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-1.5 cursor-pointer"
              style={{
                background:
                  engine === "openai"
                    ? "#10B981"
                    : engine === "gemini"
                      ? "#3B82F6"
                      : "#FF5B04",
              }}
              onClick={handleInsert}
            >
              <span>
                {hasSelection
                  ? "Replace Highlighted Text"
                  : "Insert at Cursor Position"}
              </span>
              <svg
                fill="none"
                height="14"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                width="14"
              >
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </button>
            <button
              className="px-5 h-11 rounded-xl text-sm font-geist font-medium text-gray-600 bg-white border border-black/5 hover:bg-black/5 transition-colors cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Floating Block Inserter (Medium-style) ───────────────────────────────────
const FloatingBlockInserter = ({
  editor,
  onImageUrl,
  onVideoEmbed,
  imageUploadRef,
  postType,
}: {
  editor: any;
  onImageUrl: () => void;
  onVideoEmbed: () => void;
  imageUploadRef: React.RefObject<HTMLInputElement>;
  postType?: string;
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Use Tiptap v3's reactive hook — re-renders on every selection change
  const editorState = useEditorState({
    editor,
    selector: (ctx: any) => {
      if (!ctx.editor) return { visible: false, top: 0 };
      const { state, view } = ctx.editor;
      const { selection } = state;
      const { $from } = selection;
      const isEmpty =
        $from.parent.type.name === "paragraph" &&
        $from.parent.textContent === "";

      if (!isEmpty) return { visible: false, top: 0 };
      try {
        const coords = view.coordsAtPos(selection.from);
        const domRect = view.dom.getBoundingClientRect();
        // Calculate the vertical center of the current cursor/line
        const cursorCenter = (coords.top + coords.bottom) / 2;

        return { visible: true, top: cursorCenter - domRect.top };
      } catch {
        return { visible: false, top: 0 };
      }
    },
  });

  const visible = editorState?.visible ?? false;
  const top = editorState?.top ?? 0;

  // Auto-close expanded toolbar when cursor leaves empty line
  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!visible) return null;

  const allBlockItems = [
    {
      id: "upload-image",
      label: "Upload Image",
      icon: (
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          width="16"
        >
          <rect height="18" rx="2" width="18" x="3" y="3" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
      action: () => {
        setOpen(false);
        imageUploadRef.current?.click();
      },
    },
    {
      id: "image-url",
      label: "Image URL",
      icon: (
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
      action: () => {
        setOpen(false);
        onImageUrl();
      },
    },
    {
      id: "video",
      label: "Embed Video",
      icon: (
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          width="16"
        >
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect height="14" rx="2" ry="2" width="15" x="1" y="5" />
        </svg>
      ),
      action: () => {
        setOpen(false);
        onVideoEmbed();
      },
    },
    {
      id: "code",
      label: "Code Block",
      icon: (
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          width="16"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      action: () => {
        setOpen(false);
        editor.chain().focus().toggleCodeBlock().run();
      },
    },
    {
      id: "divider",
      label: "Divider",
      icon: (
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          width="16"
        >
          <line x1="3" x2="21" y1="12" y2="12" />
          <line strokeOpacity="0.3" x1="3" x2="21" y1="6" y2="6" />
          <line strokeOpacity="0.3" x1="3" x2="21" y1="18" y2="18" />
        </svg>
      ),
      action: () => {
        setOpen(false);
        editor.chain().focus().setHorizontalRule().run();
      },
    },
    {
      id: "quote",
      label: "Blockquote",
      icon: (
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
        </svg>
      ),
      action: () => {
        setOpen(false);
        editor.chain().focus().toggleBlockquote().run();
      },
    },
    {
      id: "table",
      label: "Table",
      icon: (
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18" />
        </svg>
      ),
      action: () => {
        setOpen(false);
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run();
      },
    },
  ];

  const blockItems = allBlockItems.filter((item) => {
    const features = getFeatures(postType || "blog");

    if (postType === "social-post") {
      return (
        item.id === "upload-image" ||
        item.id === "image-url" ||
        item.id === "video"
      );
    }
    if (item.id === "code") return !!features.codeBlocks;
    if (item.id === "table") return !!features.tables;
    if (item.id === "quote") return postType !== "social-post";

    return true;
  });

  return (
    <div
      ref={menuRef}
      className="absolute z-30 flex items-center"
      style={{
        top: top + 16, // Offset by parent py-4
        left: 12,
        height: 28,
        transform: "translateY(-50%)", // Perfect vertical centering
      }}
    >
      {/* + Button */}
      <button
        className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 select-none flex-shrink-0"
        style={{
          border: "none",
          background: open ? "#FF5B04" : "#1a1a1a",
          color: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
        title="Add block"
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
      >
        <svg
          fill="none"
          height="13"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          style={{
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
          viewBox="0 0 24 24"
          width="13"
        >
          <line x1="12" x2="12" y1="5" y2="19" />
          <line x1="5" x2="19" y1="12" y2="12" />
        </svg>
      </button>

      {/* Expanded block toolbar */}
      {open && (
        <div
          className="absolute left-9 flex items-center gap-1 rounded-2xl px-2 py-1.5 shadow-xl whitespace-nowrap"
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
            animation: "fadeSlideIn 0.15s ease",
          }}
        >
          {blockItems.map((item) => (
            <button
              key={item.id}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#FF5B04] hover:bg-orange-50 transition-all duration-150"
              title={item.label}
              onMouseDown={(e) => {
                e.preventDefault();
                item.action();
              }}
            >
              {item.icon}
            </button>
          ))}
          <div
            className="w-px h-5 mx-0.5"
            style={{ background: "rgba(0,0,0,0.08)" }}
          />
          <span className="text-[10px] font-jetbrains-mono text-gray-300 pr-1">
            or type /
          </span>
        </div>
      )}
    </div>
  );
};

// ─── Slash Command Menu ───────────────────────────────────────────────────────
const SlashCommandMenu = ({
  editor,
  isOpen,
  onClose,
  position,
  onImageUrl,
  onVideoEmbed,
  imageUploadRef,
  postType,
}: {
  editor: any;
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  onImageUrl: () => void;
  onVideoEmbed: () => void;
  imageUploadRef: React.RefObject<HTMLInputElement>;
  postType?: string;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const commands = React.useMemo(() => {
    const features = postType ? getFeatures(postType) : null;
    const all = [
      {
        title: "Heading 1",
        icon: "H1",
        desc: "Large section heading",
        command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      },
      {
        title: "Heading 2",
        icon: "H2",
        desc: "Medium section heading",
        command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        title: "Heading 3",
        icon: "H3",
        desc: "Small section heading",
        command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      },
      {
        title: "Bullet List",
        icon: "•",
        desc: "Create a simple list",
        command: () => editor.chain().focus().toggleBulletList().run(),
      },
      {
        title: "Numbered List",
        icon: "1.",
        desc: "Create a numbered list",
        command: () => editor.chain().focus().toggleOrderedList().run(),
      },
      {
        title: "Task List",
        icon: "☑",
        desc: "Track tasks with checkboxes",
        command: () => editor.chain().focus().toggleTaskList().run(),
        featureKey: "taskLists",
      },
      {
        title: "Quote",
        icon: '"',
        desc: "Capture a quote",
        command: () => editor.chain().focus().toggleBlockquote().run(),
      },
      {
        title: "Code Block",
        icon: "</>",
        desc: "Add a code snippet",
        command: () => editor.chain().focus().toggleCodeBlock().run(),
        featureKey: "codeBlocks",
      },
      {
        title: "Divider",
        icon: "—",
        desc: "Add a horizontal rule",
        command: () => editor.chain().focus().setHorizontalRule().run(),
      },
      {
        title: "Divider",
        icon: "divider",
        desc: "Add a horizontal rule",
        command: () => editor.chain().focus().setHorizontalRule().run(),
      },
      {
        title: "Image Upload",
        icon: "image",
        desc: "Upload an image from disk",
        command: () => {
          imageUploadRef.current?.click();
        },
      },
      {
        title: "Image URL",
        icon: "link",
        desc: "Embed an image via URL",
        command: onImageUrl,
      },
      {
        title: "Embed Video",
        icon: "video",
        desc: "YouTube, Vimeo, Loom…",
        command: onVideoEmbed,
      },
      {
        title: "Table",
        icon: "table",
        desc: "Insert a 3x3 table",
        command: () =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run(),
        featureKey: "tables",
      },
    ];

    return all.filter((c) => {
      if (postType === "social-post") {
        return ["Image Upload", "Image URL", "Embed Video"].includes(c.title);
      }
      if (!features) return true;
      if (c.featureKey === "codeBlocks") return !!features.codeBlocks;
      if (c.featureKey === "tables") return !!features.tables;
      if (c.featureKey === "taskLists") return !!features.taskLists;

      return true;
    });
  }, [editor, onImageUrl, onVideoEmbed, imageUploadRef, postType]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-30 rounded-2xl shadow-2xl py-2 min-w-[260px] max-h-[380px] overflow-y-auto"
      style={{
        top: `${position.top + 8}px`,
        left: `${position.left}px`,
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        animation: "fadeSlideIn 0.12s ease",
      }}
    >
      <p className="px-4 py-1.5 text-[9px] font-semibold font-jetbrains-mono text-gray-400 uppercase tracking-widest">
        Blocks
      </p>
      {commands.map((command, index) => (
        <button
          key={index}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-black/5 transition-colors text-left"
          onClick={() => {
            command.command();
            onClose();
          }}
        >
          <span className="text-xs font-bold font-jetbrains-mono text-gray-400 w-7 text-center flex-shrink-0 flex items-center justify-center">
            <CosIcon name={command.icon} size={14} className="text-gray-400" />
          </span>
          <div className="min-w-0">
            <div className="text-sm font-medium font-geist text-gray-800 leading-snug">
              {command.title}
            </div>
            <div className="text-[11px] font-geist text-gray-400 leading-snug">
              {command.desc}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

// ─── Formatting Toolbar (top) ─────────────────────────────────────────────────
const FormattingToolbar = ({
  editor,
  onLinkClick,
  onCopilotClick,
  activePreset,
  onPresetChange,
  onTransformClick,
  features,
  postType,
}: {
  editor: any;
  onLinkClick: () => void;
  onCopilotClick: () => void;
  activePreset: string;
  onPresetChange: (preset: string) => void;
  onTransformClick: () => void;
  features?: any;
  postType?: string;
}) => {
  const [colorPaletteOpen, setColorPaletteOpen] = useState(false);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `px-2.5 py-1.5 rounded-lg transition-all font-semibold text-sm font-geist ${
      active
        ? "text-white"
        : "text-gray-500 hover:bg-black/5 hover:text-gray-900"
    }`;
  const activeStyle = { background: "#FF5B04" };
  const sep = <div className="w-px h-5 bg-black/10 mx-1" />;

  const colors = [
    { name: "Orange", value: "#FF5B04" },
    { name: "Black", value: "#1A1A1A" },
    { name: "Blue", value: "#1D4ED8" },
    { name: "Green", value: "#15803D" },
    { name: "Purple", value: "#6D28D9" },
  ];

  return (
    <div
      className="sticky z-40 backdrop-blur-md py-2 px-4 flex items-center gap-0.5 flex-wrap"
      style={{
        top: "61px",
        background: "rgba(247,247,246,0.96)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}
    >
      <button
        className="mr-2 px-3 py-1.5 rounded-lg text-white font-semibold text-sm font-geist transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-sm hover:shadow flex items-center gap-1 cursor-pointer relative overflow-hidden group animate-pulse"
        style={{
          background: "linear-gradient(135deg, #FF5B04 0%, #D946EF 100%)",
        }}
        onClick={onCopilotClick}
      >
        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <svg
          fill="none"
          height="13"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="13"
        >
          <path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z" />
        </svg>
        <span>AI Copilot</span>
      </button>
      {sep}

      {postType !== "social-post" && (
        <>
          {sep}
          <button
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold font-geist text-gray-500 hover:bg-black/5 hover:text-gray-900 flex items-center gap-1 cursor-pointer"
            title="Repurpose post into other formats"
            type="button"
            onClick={onTransformClick}
          >
            <span className="flex items-center gap-1">
              <CosIcon name="bolt" size={12} className="inline mr-1" /> Transform
            </span>
          </button>
        </>
      )}
      {features?.ctaBlocks && (
        <button
          className="px-2.5 py-1.5 rounded-lg text-xs font-bold font-geist text-gray-500 hover:bg-black/5 hover:text-gray-900 flex items-center gap-1 cursor-pointer"
          title="Insert Call-To-Action Block"
          onClick={() => {
            editor
              .chain()
              .focus()
              .insertContent(
                `
              <div class="cta-block border-2 border-orange-500 rounded-2xl p-6 my-6 bg-orange-50/50 flex flex-col items-center text-center">
                <h3 class="text-lg font-bold text-gray-900 mb-2">Ready to take the next step?</h3>
                <p class="text-sm text-gray-600 mb-4">Get started today and see the difference.</p>
                <a href="#" class="px-5 py-2.5 bg-orange-500 text-white rounded-xl font-semibold shadow hover:bg-orange-600 transition-colors">Click Here to Start</a>
              </div>
            `,
              )
              .run();
          }}
        >
          <span className="flex items-center gap-1.5"><CosIcon name="megaphone" size={12} /> Insert CTA</span>
        </button>
      )}
      {sep}
      <button
        className={btn(editor.isActive("bold"))}
        style={editor.isActive("bold") ? activeStyle : {}}
        title="Bold (Ctrl+B)"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </button>
      <button
        className={btn(editor.isActive("italic"))}
        style={editor.isActive("italic") ? activeStyle : {}}
        title="Italic (Ctrl+I)"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
      </button>
      <button
        className={btn(editor.isActive("strike"))}
        style={editor.isActive("strike") ? activeStyle : {}}
        title="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <s>S</s>
      </button>
      {postType !== "social-post" && (
        <>
          <button
            className={btn(editor.isActive("code"))}
            style={editor.isActive("code") ? activeStyle : {}}
            title="Inline code"
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            {"<>"}
          </button>
          <button
            className={btn(editor.isActive("highlight"))}
            style={editor.isActive("highlight") ? activeStyle : {}}
            title="Highlight"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            Mk
          </button>
        </>
      )}

      {/* Sleek Text Color Menu */}
      {postType !== "social-post" && (
        <div className="relative flex items-center">
          <button
            className={btn(colorPaletteOpen)}
            style={colorPaletteOpen ? activeStyle : {}}
            title="Text Color"
            onClick={() => setColorPaletteOpen(!colorPaletteOpen)}
          >
            <span className="flex items-center gap-1">
              A
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/10"
                style={{
                  backgroundColor:
                    editor.getAttributes("textStyle").color || "#1A1A1A",
                }}
              />
            </span>
          </button>
          {colorPaletteOpen && (
            <div className="absolute top-full left-0 mt-1 flex items-center gap-1.5 bg-white border border-black/10 shadow-lg rounded-xl p-2 z-50 animate-in fade-in duration-100">
              {colors.map((c) => (
                <button
                  key={c.value}
                  className="w-4 h-4 rounded-full border border-black/10 transition-transform hover:scale-125 cursor-pointer"
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                  onClick={() => {
                    editor.chain().focus().setColor(c.value).run();
                    setColorPaletteOpen(false);
                  }}
                />
              ))}
              <button
                className="text-[10px] font-geist px-1.5 py-0.5 bg-black/5 hover:bg-black/10 rounded-md border border-black/10 text-gray-500 hover:text-black transition-colors cursor-pointer"
                title="Reset Color"
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setColorPaletteOpen(false);
                }}
              >
                Reset
              </button>
            </div>
          )}
        </div>
      )}

      <button
        className={btn(editor.isActive("link"))}
        style={editor.isActive("link") ? activeStyle : {}}
        title="Insert Link (Ctrl+K)"
        onClick={onLinkClick}
      >
        <span className="flex items-center gap-1"><CosIcon name="link" size={12} /> Link</span>
      </button>
      {features?.affiliateLinks && (
        <button
          className={btn(false)}
          title="Insert Affiliate Link"
          onClick={() => {
            const url = prompt("Enter Affiliate URL:");

            if (url) {
              editor
                .chain()
                .focus()
                .setLink({
                  href: url,
                  target: "_blank",
                  rel: "nofollow sponsored",
                })
                .run();
            }
          }}
        >
          <span className="flex items-center gap-1"><CosIcon name="conversion" size={12} /> Affiliate Link</span>
        </button>
      )}
      {editor.isActive("link") && (
        <button
          className={btn(false)}
          title="Remove Link"
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <span className="flex items-center gap-1">Unlink <CosIcon name="cross" size={12} /></span>
        </button>
      )}

      {sep}
      {postType !== "social-post" && (
        <>
          <button
            className={btn(editor.isActive("heading", { level: 1 }))}
            style={editor.isActive("heading", { level: 1 }) ? activeStyle : {}}
            title="Heading 1"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            H1
          </button>
          <button
            className={btn(editor.isActive("heading", { level: 2 }))}
            style={editor.isActive("heading", { level: 2 }) ? activeStyle : {}}
            title="Heading 2"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </button>
          <button
            className={btn(editor.isActive("heading", { level: 3 }))}
            style={editor.isActive("heading", { level: 3 }) ? activeStyle : {}}
            title="Heading 3"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            H3
          </button>
          {sep}
          <button
            className={btn(editor.isActive("bulletList"))}
            style={editor.isActive("bulletList") ? activeStyle : {}}
            title="Bullet List"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            • List
          </button>
          <button
            className={btn(editor.isActive("orderedList"))}
            style={editor.isActive("orderedList") ? activeStyle : {}}
            title="Numbered List"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1. List
          </button>
          {sep}
        </>
      )}
      {features?.taskLists && (
        <button
          className={btn(editor.isActive("taskList"))}
          style={editor.isActive("taskList") ? activeStyle : {}}
          title="Task List"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <span className="flex items-center gap-1"><CosIcon name="tasks" size={12} /> Task List</span>
        </button>
      )}
      {postType !== "social-post" && (
        <button
          className={btn(editor.isActive("blockquote"))}
          style={editor.isActive("blockquote") ? activeStyle : {}}
          title="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          &ldquo; Quote
        </button>
      )}
      {features?.codeBlocks && (
        <button
          className={btn(editor.isActive("codeBlock"))}
          style={editor.isActive("codeBlock") ? activeStyle : {}}
          title="Code Block"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          {"</>"}
        </button>
      )}
      {postType !== "social-post" && (
        <>
          {sep}
          <button
            className={btn(false)}
            title="Horizontal Rule"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            —
          </button>
        </>
      )}
      {features?.tables && editor.isActive("table") && (
        <>
          {sep}
          <div className="flex items-center gap-1 bg-orange-50/60 border border-orange-100 rounded-xl px-2 py-0.5">
            <span className="text-[10px] font-bold font-jetbrains-mono text-[#FF5B04] uppercase tracking-wider mr-1">
              Table Controls:
            </span>

            <button
              className={btn(false)}
              title="Add Row Above"
              onClick={() => editor.chain().focus().addRowBefore().run()}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-[10px] ml-1">Row ↑</span>
            </button>

            <button
              className={btn(false)}
              title="Add Row Below"
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-[10px] ml-1">Row ↓</span>
            </button>

            <button
              className={btn(false)}
              title="Delete Row"
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14" />
              </svg>
              <span className="text-[10px] ml-1">Row</span>
            </button>

            <div className="w-px h-4 bg-orange-200/50 mx-1" />

            <button
              className={btn(false)}
              title="Add Column Before"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-[10px] ml-1">Col ←</span>
            </button>

            <button
              className={btn(false)}
              title="Add Column After"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-[10px] ml-1">Col →</span>
            </button>

            <button
              className={btn(false)}
              title="Delete Column"
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14" />
              </svg>
              <span className="text-[10px] ml-1">Col</span>
            </button>

            <div className="w-px h-4 bg-orange-200/50 mx-1" />

            <button
              className={btn(false)}
              title="Toggle Header Row"
              onClick={() => editor.chain().focus().toggleHeaderRow().run()}
            >
              <span className="text-[10px]">H-Row</span>
            </button>

            <button
              className={btn(false)}
              title="Toggle Header Column"
              onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
            >
              <span className="text-[10px]">H-Col</span>
            </button>

            <button
              className={btn(false)}
              style={{ color: "#dc2626" }}
              title="Delete Table"
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              <svg
                className="w-3.5 h-3.5 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
              <span className="text-[10px] ml-1">Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Post Preview Panel ──────────────────────────────────────────────────────
function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}
function parseHeadings(
  html: string,
): { id: string; text: string; level: 2 | 3 }[] {
  const out: { id: string; text: string; level: 2 | 3 }[] = [];
  const seen: Record<string, number> = {};
  let m: RegExpExecArray | null;
  const re = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi;

  while ((m = re.exec(html))) {
    const lvl = parseInt(m[1]) as 2 | 3;
    const txt = m[2].replace(/<[^>]+>/g, "").trim();

    if (!txt) continue;
    let id = slugifyHeading(txt);

    if (seen[id] != null) {
      seen[id]++;
      id += `-${seen[id]}`;
    } else {
      seen[id] = 0;
    }
    out.push({ id, text: txt, level: lvl });
  }

  return out;
}
function injectHeadingIds(html: string): string {
  const seen: Record<string, number> = {};

  return html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_, lvl, attrs, inner) => {
      const txt = inner.replace(/<[^>]+>/g, "").trim();

      if (!txt) return _;
      let id = slugifyHeading(txt);

      if (seen[id] != null) {
        seen[id]++;
        id += `-${seen[id]}`;
      } else {
        seen[id] = 0;
      }

      return `<h${lvl}${attrs.replace(/\s*id="[^"]*"/gi, "")} id="${id}">${inner}</h${lvl}>`;
    },
  );
}
// Minified mirror of globals.css .blog-prose rules, scoped to .preview-prose
const PREVIEW_PROSE_CSS = `.preview-prose{color:#1a1a1a!important;font-family:var(--font-jakarta),var(--font-sans),sans-serif;font-size:1.0625rem;line-height:1.85;letter-spacing:-.005em}.preview-prose p{color:#1a1a1a!important;margin-top:0;margin-bottom:1.25rem}.preview-prose li{color:#1a1a1a!important}.preview-prose h1,.preview-prose h2,.preview-prose h3,.preview-prose h4{color:#111!important;font-family:var(--font-geist),sans-serif;font-weight:700;line-height:1.2;margin-top:2.5rem;margin-bottom:.85rem;letter-spacing:-.025em}.preview-prose h1{font-size:2.25rem}.preview-prose h2{font-size:1.625rem;border-left:3.5px solid #FF5B04;padding-left:.85rem;margin-left:-.85rem}.preview-prose h3{font-size:1.35rem}.preview-prose h4{font-size:1.125rem}.preview-prose strong{color:#111!important;font-weight:700}.preview-prose em{color:#444!important;font-style:italic}.preview-prose a{color:#FF5B04;text-decoration:underline;text-underline-offset:3px;font-weight:500}.preview-prose ul{list-style:none;padding-left:0;margin:1.5rem 0}.preview-prose ul li{position:relative;padding-left:1.5rem;margin-bottom:.5rem;line-height:1.6}.preview-prose ul li::before{content:"•";color:#FF5B04;font-weight:bold;font-size:1.35rem;position:absolute;left:.25rem;top:-.15rem}.preview-prose ol{list-style-type:decimal;padding-left:1.5rem;margin:1.5rem 0}.preview-prose ol li{margin-bottom:.5rem;padding-left:.25rem;line-height:1.6}.preview-prose li strong{color:#111}.preview-prose blockquote{border-left:4px solid #FF5B04;margin:2.25rem 0;padding:.85rem 1.5rem;background:rgba(255,91,4,.035);border-radius:4px 16px 16px 4px;color:#2b2b2b;font-size:1.15rem;line-height:1.7;font-style:italic;font-weight:500}.preview-prose code{font-family:var(--font-geist-mono,monospace);font-size:.85em;background:#f7f7f8;border:1px solid rgba(0,0,0,.06);border-radius:6px;padding:.2em .4em;color:#FF5B04;font-weight:500}.preview-prose pre{background:#0c0c0d;border:1px solid rgba(255,255,255,.08);color:#f4f4f5;border-radius:14px;padding:1.5rem 1.75rem;overflow-x:auto;margin:2.25rem 0;font-size:.85rem;line-height:1.75}.preview-prose pre code{background:none;border:none;padding:0;color:inherit}.preview-prose hr{border:none;height:1px;background:linear-gradient(to right,transparent,rgba(0,0,0,.08) 15%,rgba(0,0,0,.08) 85%,transparent);margin:3.5rem 0}.preview-prose img{display:block;max-width:100%;height:auto;border-radius:14px;margin:2rem auto;box-shadow:0 10px 30px rgba(0,0,0,.04)}.preview-prose p:has(>img:only-child){display:flex;justify-content:center}.preview-prose table{width:100%;min-width:100%;border-collapse:separate;border-spacing:0;margin:2.5rem 0;font-size:.925rem;border:1px solid rgba(255,91,4,.15);border-radius:14px;box-shadow:0 4px 24px rgba(255,91,4,.03)}.preview-prose th,.preview-prose td{border-bottom:1px solid rgba(255,91,4,.08);border-right:1px solid rgba(255,91,4,.06);padding:.9rem 1.25rem;text-align:left}.preview-prose th:last-child,.preview-prose td:last-child{border-right:none}.preview-prose tr:last-child td{border-bottom:none}.preview-prose th{background:#FFF5F0;color:#1a1a1a;font-weight:700;text-transform:uppercase;font-size:.75rem;letter-spacing:.05em;border-bottom:2px solid rgba(255,91,4,.2)!important}.preview-prose tr:hover td{background:rgba(255,91,4,.025)}.preview-prose>p:first-of-type::first-letter{font-size:3.5rem;font-weight:700;float:left;line-height:.85;margin-right:.55rem;margin-top:.15rem;color:#FF5B04;font-family:var(--font-geist),sans-serif}.preview-prose::selection,.preview-prose *::selection{background:rgba(255,91,4,.12);color:#FF5B04}`;

const PostPreviewPanel = ({
  title,
  bannerImage,
  excerpt,
  tags,
  contentHtml,
  postType,
  onEdit,
}: {
  title: string;
  bannerImage: string;
  excerpt: string;
  tags: string[];
  contentHtml: string;
  postType: string;
  onEdit: () => void;
}) => {
  const typeLabel: Record<string, string> = {
    blog: "Blog",
    tutorial: "Tutorial",
    "case-study": "Case Study",
    "community-insight": "Community Insight",
  };
  const headings = useMemo(() => parseHeadings(contentHtml), [contentHtml]);
  const processedHtml = useMemo(
    () => injectHeadingIds(contentHtml),
    [contentHtml],
  );
  const [activeId, setActiveId] = useState("");
  const readTime = useMemo(
    () =>
      Math.max(
        1,
        Math.ceil(
          contentHtml
            .replace(/<[^>]*>/g, " ")
            .trim()
            .split(/\s+/)
            .filter(Boolean).length / 200,
        ),
      ),
    [contentHtml],
  );

  useEffect(() => {
    if (!headings.length) return;
    const handleScroll = () => {
      let current = headings[0].id;

      for (const { id } of headings) {
        const el = document.getElementById(id);

        if (el && el.getBoundingClientRect().top <= 120) current = id;
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initialise on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const hasToc = headings.length >= 2;

  return (
    <div className="flex-1 min-w-0">
      {/* Preview toolbar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-1.5 text-[10px] font-semibold font-jetbrains-mono px-2.5 py-1 rounded-full uppercase tracking-wider"
            style={{ background: "rgba(255,91,4,0.10)", color: "#FF5B04" }}
          >
            <svg
              fill="none"
              height="8"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="8"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Reader Preview
          </span>
          <span className="text-xs font-geist text-gray-400">
            High-fidelity · matches live site
          </span>
        </div>
        <button
          className="text-xs font-geist font-medium text-gray-500 hover:text-gray-800 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg hover:bg-black/5"
          onClick={onEdit}
        >
          <svg
            fill="none"
            height="12"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="12"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit Post
        </button>
      </div>

      {/* Preview card — no overflow-hidden here; the hero div owns its own clip so
          the inner sticky TOC aside has a full-height scroll track to travel along */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/5">
        {/* ── Hero — mirrors screens/blogsDetails/hero/index.tsx ── */}
        <div
          className="relative w-full overflow-hidden group"
          style={{ height: 340 }}
        >
          {bannerImage ? (
            <img
              alt="Blog banner"
              className="absolute inset-0 w-full h-full object-cover"
              src={bannerImage}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 100%)",
              }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0.35) 50%,rgba(0,0,0,0.10) 100%)",
            }}
          />
          <button
            className="absolute top-3 right-3 z-20 bg-white/90 text-xs font-geist font-semibold px-3 py-1.5 rounded-lg shadow-md text-gray-700 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onEdit}
          >
            <svg
              fill="none"
              height="11"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="11"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
          <div className="absolute inset-0 flex flex-col justify-end pb-10 z-10 px-14">
            <span
              className="inline-flex items-center self-start mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white"
              style={{
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              {typeLabel[postType] ?? postType}
            </span>
            <h1
              className="text-white font-bold leading-tight max-w-2xl"
              style={{
                fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                letterSpacing: "-0.5px",
              }}
            >
              {title || <span className="opacity-40">Untitled Post</span>}
            </h1>
          </div>
        </div>

        {/* ── Article body — mirrors screens/blogsDetails/blogContents/ layout ── */}
        <article className="px-14 pt-8 pb-16">
          {/* Inject prose CSS identical to live site's bulletproof style block */}
          <style dangerouslySetInnerHTML={{ __html: PREVIEW_PROSE_CSS }} />

          {/* Header info — mirrors screens/blogsDetails/blogContents/headeInfo.tsx */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: "#FF5B04" }}
              >
                UI
              </div>
              <div>
                <p
                  className="text-sm font-bold text-[#111] uppercase tracking-wide"
                  style={{ fontFamily: "var(--font-geist)" }}
                >
                  UI Pirate
                </p>
                <p
                  className="text-xs text-gray-400"
                  style={{ fontFamily: "var(--font-geist)" }}
                >
                  Preview · {readTime} min read
                </p>
              </div>
            </div>
            <p
              className="text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap"
              style={{ fontFamily: "var(--font-geist)" }}
            >
              {readTime} min read | Draft
            </p>
          </div>
          <hr className="mt-6 mb-0 border-gray-100" />

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-6">
              {tags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2.5 py-0.5 rounded-full"
                  style={{
                    background: "#FFF0E8",
                    color: "#FF5B04",
                    fontFamily: "var(--font-geist)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Excerpt — pull-quote style matching live site */}
          {excerpt && (
            <p
              className="mt-6 text-lg leading-relaxed pl-4 border-l-4 border-orange-200"
              style={{
                color: "#6b7280",
                fontFamily: "var(--font-jakarta,var(--font-sans))",
              }}
            >
              {excerpt}
            </p>
          )}

          {/* Content + sticky TOC — two-column when there are ≥2 headings */}
          {/* NOTE: no items-start — aside must stretch to article height so sticky has room to travel */}
          <div className={`mt-10 ${hasToc ? "flex gap-10" : ""}`}>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  processedHtml ||
                  "<p style='color:#d1d5db'>No content yet. Start writing in the editor.</p>",
              }}
              className="preview-prose min-w-0 flex-1"
            />
            {/* Sticky TOC — pixel-identical to screens/blogsDetails/blogContents */}
            {hasToc && (
              <aside
                className="flex-shrink-0 hidden xl:block"
                style={{ width: 220 }}
              >
                <div className="sticky top-24 bg-gray-50 border border-gray-100 rounded-3xl p-6">
                  <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">
                    Contents
                  </p>
                  <nav className="flex flex-col gap-2">
                    {headings.map((h) => (
                      <a
                        key={h.id}
                        className="text-sm transition-colors py-1 px-2 rounded-lg truncate"
                        href={`#${h.id}`}
                        style={{
                          paddingLeft: h.level === 3 ? "1rem" : undefined,
                          color: activeId === h.id ? "#FF5B04" : "#4b5563",
                          fontWeight: activeId === h.id ? 600 : 400,
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(h.id)?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                          setActiveId(h.id);
                        }}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

type SocialDestination = "linkedin" | "x";

interface SocialDestinationConfig {
  label: string;
  characterLimit: number;
  warningAt: number;
  suggestions: string[];
}

const SOCIAL_DESTINATIONS: Record<SocialDestination, SocialDestinationConfig> = {
  linkedin: {
    label: "LinkedIn Post",
    characterLimit: 3000,
    warningAt: 2700,
    suggestions: ["#ThoughtLeadership", "#Innovation", "#Marketing", "#Tech", "#Strategy"],
  },
  x: {
    label: "X (Twitter) Post",
    characterLimit: 280,
    warningAt: 250,
    suggestions: ["#Tech", "#AI", "#Productivity", "#BuildInPublic", "#Startup"],
  },
};

const TUTORIAL_SLIDES = [
  {
    title: "1. Dynamic Focus Mode",
    desc: "Your workspace adapts automatically to your selected archetype. Unused tabs, formatting limits, and sidebar options are hidden to keep you fully focused on creating.",
    icon: "tasks",
    badge: "Focus Mode",
    bg: "from-orange-50/50 via-white to-amber-50/20",
    border: "border-orange-100",
    textClass: "text-[#FF5B04]",
    bgClass: "bg-[#FF5B04]/10",
  },
  {
    title: "2. Integrated Brand Brain",
    desc: "Your Brand Voice parameters, target vocabulary, and forbidden terms are automatically injected into the AI writing copilot to maintain strict stylistic alignment.",
    icon: "bot",
    badge: "Brand Guard",
    bg: "from-purple-50/50 via-white to-orange-50/20",
    border: "border-purple-100",
    textClass: "text-purple-600",
    bgClass: "bg-purple-50",
  },
  {
    title: "3. Calibrated SEO & Health",
    desc: "The Content Health panel tracks readability, paragraph structure, and keyword density. Metric weights are dynamically balanced to align with your chosen business goal.",
    icon: "traffic",
    badge: "SEO Insights",
    bg: "from-emerald-50/50 via-white to-teal-50/20",
    border: "border-emerald-100",
    textClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
  },
  {
    title: "4. Cross-Channel Repurposing",
    desc: "Convert your finished article into custom social updates (LinkedIn summaries, X/Twitter posts, newsletters) instantly using the workspace distribution panel.",
    icon: "conversion",
    badge: "Multi-Channel",
    bg: "from-blue-50/50 via-white to-indigo-50/20",
    border: "border-blue-100",
    textClass: "text-blue-600",
    bgClass: "bg-blue-50",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const BlogEditor = () => {
  const isSubdomain =
    typeof window !== "undefined" &&
    (window.location.hostname.startsWith("cos.") ||
      window.location.hostname === "cos.uipirate.com");
  const getHref = (path: string) => (isSubdomain ? path : `/pirateCOS${path}`);

  const [mounted, setMounted] = useState(false);
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");

  // AI States
  const [isExcerptModalOpen, setIsExcerptModalOpen] = useState(false);
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [activePreset, setActivePreset] = useState("");
  const [isRepurposeDrawerOpen, setIsRepurposeDrawerOpen] = useState(false);

  // AI API Handlers
  const [featuredImage, setFeaturedImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [postType, setPostType] = useState<string>("blog");
  const [contentGoal, setContentGoal] = useState<ContentGoal>("traffic");
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [typeSelected, setTypeSelected] = useState(false);
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const [hoveredGoal, setHoveredGoal] = useState<string | null>(null);
  const [showImageUrlModal, setShowImageUrlModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [modalSuccess, setModalSuccess] = useState<"draft" | "publish" | null>(
    null,
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  // Navigation guard + dirty state
  const [isDataInitialized, setIsDataInitialized] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showSEOModal, setShowSEOModal] = useState(false);
  const [seoData, setSeoData] = useState<PostSEO>({});
  const [currentSlug, setCurrentSlug] = useState("");
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<
    "content" | "seo" | "ai" | "distribute" | "health"
  >("content");
  const [socialDestination, setSocialDestination] = useState<SocialDestination>("linkedin");
  const [copilotInitialPrompt, setCopilotInitialPrompt] = useState("");
  const [distRecords, setDistRecords] = useState<any[]>([]);
  const [repurposedOutputs, setRepurposedOutputs] = useState<Record<string, string>>({});

  const {
    blogId: savedBlogId,
    setBlogId: setSavedBlogId,
    isSaving,
    saveStatus,
    setSaveStatus,
    isDirty,
    setIsDirty,
    saveBlog,
    ensureSaved,
  } = useSaveBlog({
    initialBlogId: null,
    getEditorState: () => ({
      title,
      content: editor?.getHTML() || "",
      excerpt,
      featuredImage,
      bannerImage,
      tags,
      postType,
      contentGoal,
      slug: currentSlug,
      seo: seoData,
      repurposedOutputs,
    }),
    onSaveSuccess: (id, published) => {
      setModalSuccess(published ? "publish" : "draft");
    },
    onSaveError: (err) => {
      setShowPublishModal(false);
      setShowSaveModal(false);
      setValidationError(err.message || "Failed to save blog");
    },
  });
  const pendingNavHref = useRef<string>("");
  const pendingNavIsBack = useRef(false); // true when guard was tripped by browser back/forward
  const isDirtyRef = useRef(false); // ref mirror — always current inside event handlers
  const editorRef = useRef<HTMLDivElement>(null);
  const inlineImageUploadRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { isLoading: authLoading } = useAuth(true);

  useEffect(() => {
    setMounted(true);
    setIsDataInitialized(true);
  }, []);

  useEffect(() => {
    if (!isSlugManual && title) {
      const slug = title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      setCurrentSlug(slug);
    }
  }, [title, isSlugManual]);

  // Keep ref in sync so event-handler closures are never stale
  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  // Onboarding Guided Wizard: Carousel auto-play effect with story-style progress indicator
  useEffect(() => {
    if (wizardStep !== 3 || typeSelected) return;

    setProgress(0);
    const intervalTime = 100; // tick every 100ms
    const totalTime = 6000;   // 6 seconds per slide
    const increment = (intervalTime / totalTime) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((slide) => (slide === TUTORIAL_SLIDES.length - 1 ? 0 : slide + 1));
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [wizardStep, typeSelected, currentSlide]);

  // Programmatically reset active sidebar tab to "content" if the active tab is hidden (e.g. SEO panel becomes false)
  useEffect(() => {
    const features = getFeatures(postType || "blog");

    if (sidebarTab === "seo" && !features.seoPanel) {
      setSidebarTab("content");
    }
  }, [postType, sidebarTab]);



  // ── Navigation guards ───────────────────────────────────────────────────────
  // 1. Tab / window close — uses ref so the handler never needs to be replaced
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirtyRef.current || !typeSelected) return;
      e.preventDefault();
      e.returnValue =
        "You have unsaved changes. Are you sure you want to leave?";

      return e.returnValue;
    };

    window.addEventListener("beforeunload", handler);

    return () => window.removeEventListener("beforeunload", handler);
  }, [typeSelected]);

  // 2. Sidebar <Link> and every other <a> click — capture phase intercepts before
  //    Next.js router handles the event, covering all client-side link navigation.
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      if (!isDirtyRef.current || !typeSelected) return;

      const anchor = (e.target as HTMLElement).closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");

      // Skip if it's an external link, a hash link, or has a target="_blank"
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("#") ||
        target === "_blank"
      )
        return;

      // Resolve relative URLs to absolute for comparison
      try {
        const url = new URL(href, window.location.origin);

        if (
          url.origin !== window.location.origin ||
          url.pathname === window.location.pathname
        )
          return;

        e.preventDefault();
        e.stopPropagation();
        pendingNavHref.current = href;
        pendingNavIsBack.current = false;
        setShowUnsavedModal(true);
      } catch (err) {
        // Fallback for invalid URLs
        return;
      }
    };

    document.addEventListener("click", handleLinkClick, true);

    return () => document.removeEventListener("click", handleLinkClick, true);
  }, [typeSelected]);

  // 3. Browser back / forward button interception via a history sentinel entry
  useEffect(() => {
    if (!typeSelected) return;

    // Initial sentinel
    if (window.history.state?.blogGuard !== true) {
      window.history.pushState({ blogGuard: true }, "");
    }

    const handlePopState = (e: PopStateEvent) => {
      if (!isDirtyRef.current) return;

      // Re-push our sentinel so the page stays in place visually
      window.history.pushState({ blogGuard: true }, "");
      pendingNavIsBack.current = true;
      pendingNavHref.current = "";
      setShowUnsavedModal(true);
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [typeSelected]);

  const editor = useEditor({
    autofocus: "end",
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Placeholder.configure({
        showOnlyWhenEditable: true,
        includeChildren: true,
        placeholder: ({ node }) => {
          if (node.type.name === "heading") return "Heading";

          return "Type '/' for commands or click + to add a block…";
        },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Typography,
      TextStyle,
      Color,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[500px] px-8 py-6",
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          if (event.key === "/") {
            const { selection } = view.state;
            const { $from } = selection;
            const textBefore = $from.parent.textContent.slice(
              0,
              $from.parentOffset,
            );

            if (textBefore === "" || textBefore.endsWith(" ")) {
              setTimeout(() => {
                const coords = view.coordsAtPos(selection.from);

                setSlashMenuPosition({
                  top: coords.bottom + window.scrollY,
                  left: coords.left + window.scrollX,
                });
                setSlashMenuOpen(true);
              }, 0);
            }
          } else if (event.key === "Escape" && slashMenuOpen) {
            setSlashMenuOpen(false);

            return true;
          }

          return false;
        },
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files?.[0]) {
          const file = event.dataTransfer.files[0];

          if (file.type.startsWith("image/")) {
            event.preventDefault();
            const reader = new FileReader();

            reader.onload = (e) => {
              const url = e.target?.result as string;
              const { schema } = view.state;
              const coordinates = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });

              if (coordinates) {
                const node = schema.nodes.image.create({ src: url });

                view.dispatch(view.state.tr.insert(coordinates.pos, node));
              }
            };
            reader.readAsDataURL(file);

            return true;
          }
        }

        return false;
      },
      handlePaste: (_view, event) => {
        const items = event.clipboardData?.items;

        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
              event.preventDefault();
              const file = items[i].getAsFile();

              if (file) {
                const reader = new FileReader();

                reader.onload = (e) => {
                  const url = e.target?.result as string;

                  editor?.chain().focus().setImage({ src: url }).run();
                };
                reader.readAsDataURL(file);
              }

              return true;
            }
          }
        }

        return false;
      },
    },
    onUpdate: () => {
      // Mark form dirty whenever editor content changes
      if (isDataInitialized && typeSelected) setIsDirty(true);
    },
    immediatelyRender: false,
  });

  // Dirty tracking — skip first run (initial mount), mark dirty on any subsequent change
  useEffect(() => {
    if (!isDataInitialized || !typeSelected) return;
    
    // Check if the user has actually entered any content
    const hasContent =
      title.trim() !== "" ||
      excerpt.trim() !== "" ||
      tags.length > 0 ||
      featuredImage !== "" ||
      bannerImage !== "" ||
      (editor && !editor.isEmpty);

    if (hasContent) {
      setIsDirty(true);
    }
  }, [title, excerpt, tags, featuredImage, bannerImage, isDataInitialized, typeSelected, editor]);

  const appendHashtag = useCallback((tag: string) => {
    const normalized = tag.startsWith("#") ? tag : `#${tag}`;
    if (!tags.includes(normalized)) {
      setTags((prev) => [...prev, normalized]);
    }
    if (editor) {
      const text = editor.getText();
      if (!text.includes(normalized)) {
        const separator = text === "" || /\s$/.test(text) ? "" : " ";
        editor.chain().focus().insertContent(`${separator}${normalized} `).run();
      }
    }
  }, [tags, editor]);

  const handleAddHashtag = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/,$/, "");
      if (cleanTag) {
        appendHashtag(cleanTag);
      }
      setTagInput("");
    }
  }, [tagInput, appendHashtag]);

  // Real-time analytics counter hook
  const editorStats = useEditorState({
    editor,
    selector: (ctx: any) => {
      if (!ctx.editor)
        return { words: 0, characters: 0, paragraphs: 0, readTime: 1 };
      const text = ctx.editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const characters = text.length;
      const readTime = Math.ceil(words / 200) || 1;
      let paragraphs = 0;

      ctx.editor.state.doc.descendants((node: any) => {
        if (node.type.name === "paragraph") {
          paragraphs++;
        }
      });

      return { words, characters, paragraphs, readTime };
    },
  }) || { words: 0, characters: 0, paragraphs: 0, readTime: 1 };

  const { warnings: copilotWarnings, dismissWarning } = useAICopilot(
    editor?.getHTML() || "",
    true,
  );

  // Inline image upload handler (from the + toolbar)
  const handleInlineImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file && editor) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const url = e.target?.result as string;

          editor.chain().focus().setImage({ src: url }).run();
        };
        reader.readAsDataURL(file);
      }
      // Reset so same file can be re-selected
      event.target.value = "";
    },
    [editor],
  );

  const handleBannerImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const url = e.target?.result as string;

          setFeaturedImage(url);
          setBannerImage(url);
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  // Navigate safely — shows unsaved-changes modal if form is dirty
  const navigateSafely = useCallback(
    (href: string) => {
      if (isDirty) {
        pendingNavHref.current = href;
        pendingNavIsBack.current = false;
        setShowUnsavedModal(true);
      } else {
        router.push(href);
      }
    },
    [isDirty, router],
  );

  // saveBlog is managed by useSaveBlog hook

  const handleSaveDraft = useCallback(() => {
    if (!title.trim()) {
      setValidationError("Please enter a title for your blog post.");

      return;
    }
    if (!editor || editor.isEmpty) {
      setValidationError("Please add some content to your blog post.");

      return;
    }
    setShowSaveModal(true);
  }, [title, editor]);

  const handlePublish = useCallback(() => {
    if (!title.trim()) {
      setValidationError("Please enter a title for your blog post.");

      return;
    }
    if (!editor || editor.isEmpty) {
      setValidationError("Please add some content to your blog post.");

      return;
    }
    setShowPublishModal(true);
  }, [title, editor]);

  if (!mounted || !editor || authLoading) return null;

  // ── 3-Step Guided Wizard selection gate ──
  if (!typeSelected) {
    const activeTypeConfig = getPostTypeConfig(postType);
    const activeGoalConfig = getGoalConfig(contentGoal);

    // Strategist Board Dictionary
    const ARCHETYPE_EXPLANATIONS: Record<
      string,
      { title: string; desc: string; tip: string }
    > = {
      blog: {
        title: "Blog Archetype",
        desc: "Designed to share opinion pieces, stories, and deep insights in an authentic, conversational voice.",
        tip: "Optimizes the layout for traditional web readers. Guides you to structure conversational, rich sections with search visibility, while AI prompts emphasize personal stories and deep insights.",
      },
      tutorial: {
        title: "Step-by-Step Tutorial",
        desc: "Highly technical educational resources, manuals, and developer configurations.",
        tip: "Calibrated for step-by-step guidance. Tailors your layout for structured, educational reading with syntax code examples and sequential guidelines.",
      },
      "case-study": {
        title: "Customer Case Study",
        desc: "Professional breakdowns of real-world client wins, builder journeys, and solutions.",
        tip: "Calibrated for customer proof and business journeys. Emphasizes structured evidence, client quotes, and measurable impact metrics.",
      },
      "community-insight": {
        title: "Community Insight",
        desc: "Curated industry roundups, trend analyses, and collaborative community highlights.",
        tip: "Calibrated for sharing industry viewpoints. Encourages engaging hooks and conversational tone to start dialogues.",
      },
      "corporate-post": {
        title: "Corporate / PR Post",
        desc: "Press releases, executive updates, public letters, and company milestone announcements.",
        tip: "Calibrated for official announcements. Focuses on professional, objective updates and clear milestone summaries.",
      },
      "product-review": {
        title: "Product Review",
        desc: "Monetization-oriented reviews of specific tools, platforms, or hardware.",
        tip: "Calibrated for comparative evaluations. Helps structure features, pros/cons list, and pricing details.",
      },
      "product-launch": {
        title: "Product Launch",
        desc: "Feature releases, software launches, and brand announcement campaigns.",
        tip: "Calibrated for new releases. Focuses on solving user problems and driving clear actions for feature announcements.",
      },
      listicle: {
        title: "Curated Listicle",
        desc: '"Top N" roundups, product selections, and curated summaries.',
        tip: "Calibrated for curated roundups. Formats items, benefits, and quick recommendations clearly.",
      },
      comparison: {
        title: "Head-to-Head Comparison",
        desc: "Detailed side-by-side product comparisons to assist buyer decisions.",
        tip: "Calibrated for side-by-side product analyses. Frames advantages and clear decision criteria to guide purchase choices.",
      },
      newsletter: {
        title: "Email Newsletter",
        desc: "Conversational weekly digests, product newsletters, and list updates.",
        tip: "Calibrated for direct subscriber communications. Keeps text styling clean and conversational to build personal relationships.",
      },
      "social-post": {
        title: "LinkedIn / Social Post",
        desc: "Sleek, condensed articles optimized for professional social media networks.",
        tip: "Calibrated for condensed social updates. Focuses on character limits and scroll-stopping ideas for quick, impactful professional shares.",
      },
    };

    const GOAL_EXPLANATIONS: Record<
      string,
      { title: string; desc: string; aiFocus: string }
    > = {
      traffic: {
        title: "Search Visibility & Growth",
        desc: "Aligns your content to reach readers looking for solutions on search engines.",
        aiFocus:
          "AI suggestions highlight clear headings, answer common queries, and prioritize reader search intent.",
      },
      authority: {
        title: "Establish Thought Leadership",
        desc: "Builds credibility by sharing unique viewpoints, data, and expert perspectives.",
        aiFocus:
          "AI suggestions draw from industry insights, professional terminology, and contrarian viewpoints.",
      },
      conversion: {
        title: "Drive Sales & Conversions",
        desc: "Encourages readers to take action, whether joining a list or viewing a product.",
        aiFocus:
          "AI suggestions highlight customer problems, benefits, objection-handling, and clear next steps.",
      },
      engagement: {
        title: "Spark Discussion & Comments",
        desc: "Fosters conversational interest, community discussion, and viral reach.",
        aiFocus:
          "AI suggestions lead with hooks, invite reader comments, and ask engaging questions.",
      },
      "lead-generation": {
        title: "Lead Capture & Growth",
        desc: "Highlights valuable guides or resources to attract new contacts.",
        aiFocus:
          "AI suggestions write compelling benefit statements and natural highlights for resources.",
      },
      retention: {
        title: "Keep Customers Engaged",
        desc: "Deepens product usage and values for existing customers.",
        aiFocus:
          "AI suggestions present practical steps, pro-tips, and educational pointers.",
      },
    };

    // Calculate Dynamic Strategist Card content
    const currentTypeVal = hoveredType || postType;
    const currentTypeConfig = getPostTypeConfig(currentTypeVal);
    const archetypeExplanation = ARCHETYPE_EXPLANATIONS[currentTypeVal] || {
      title: "Custom Archetype",
      desc:
        currentTypeConfig?.description ||
        "Select a post archetype to adapt your workspace features.",
      tip:
        currentTypeConfig?.templateHint ||
        "The workspace and AI tuning will be optimized based on your selection.",
    };

    const currentGoalVal = hoveredGoal || contentGoal;
    const currentGoalConfig = getGoalConfig(currentGoalVal as ContentGoal);
    const goalExplanation = GOAL_EXPLANATIONS[currentGoalVal] || {
      title: "Custom Goal",
      desc:
        currentGoalConfig?.description ||
        "Set a strategic goal for the AI to optimize outlines and structures.",
      aiFocus:
        currentGoalConfig?.aiPriorityPrompt ||
        "Strategic parameters will be fine-tuned accordingly.",
    };

    return (
      <div className="w-full min-h-screen pb-28 animate-in fade-in duration-200 bg-[#F7F7F6]">
        {/* Step Indicator Header (Always Visible) */}
        <div className="px-8 py-6 border-b border-black/[0.06] bg-white sticky top-0 z-20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-jetbrains-mono uppercase tracking-widest font-bold text-[#FF5B04]">
                Creation Wizard
              </span>
              <span className="text-gray-300 text-[10px]">•</span>
              <span className="text-[10px] font-jetbrains-mono uppercase tracking-widest font-bold text-gray-400">
                Step {wizardStep} of 3
              </span>
            </div>
            {/* Stepper Progress bar */}
            <div className="w-48 h-1.5 bg-black/[0.04] rounded-full overflow-hidden flex gap-1">
              <div
                className={`h-full flex-1 transition-all duration-300 ${wizardStep >= 1 ? "bg-[#FF5B04]" : "bg-black/[0.04]"}`}
              />
              <div
                className={`h-full flex-1 transition-all duration-300 ${wizardStep >= 2 ? "bg-[#FF5B04]" : "bg-black/[0.04]"}`}
              />
              <div
                className={`h-full flex-1 transition-all duration-300 ${wizardStep >= 3 ? "bg-[#FF5B04]" : "bg-black/[0.04]"}`}
              />
            </div>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="px-8 py-8 w-full">
          {/* ───────────────────────────────────────────────────────────────────
              STEP 1: INTENT SELECTION
          ─────────────────────────────────────────────────────────────────── */}
          {wizardStep === 1 && (
            <div className="md:grid md:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
              {/* Left Column: Archetype selector cards */}
              <div className="md:col-span-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold font-geist text-gray-900 leading-tight">
                    What are you creating today?
                  </h2>
                  <p className="text-xs text-gray-400 font-geist mt-1.5 leading-relaxed">
                    Select a post archetype to adapt your tools, limits, and AI
                    parameters dynamically.
                  </p>
                </div>

                {/* Group 1: Content & Knowledge */}
                <div className="space-y-3">
                  <p className="text-[10px] font-jetbrains-mono font-bold text-gray-400 uppercase tracking-widest">
                    📚 Content & Knowledge Archetypes
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {getPostTypesByCategory("content").map((cfg) => (
                      <button
                        key={cfg.value}
                        className={`flex flex-col gap-2.5 p-4 rounded-2xl border-2 transition-all text-left cursor-pointer hover:scale-[1.01] hover:shadow-sm ${
                          postType === cfg.value
                            ? "border-[#FF5B04] bg-white shadow-sm"
                            : "border-black/5 bg-white hover:border-[#FF5B04]/40"
                        }`}
                        onClick={() => setPostType(cfg.value)}
                        onMouseEnter={() => setHoveredType(cfg.value)}
                        onMouseLeave={() => setHoveredType(null)}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              postType === cfg.value
                                ? "bg-[#FF5B04]/10 text-[#FF5B04]"
                                : "bg-black/5 text-gray-500"
                            }`}
                          >
                            <CosIcon name={cfg.icon} size={14} />
                          </div>
                          <p
                            className={`text-[13px] font-bold font-geist ${postType === cfg.value ? "text-[#FF5B04]" : "text-gray-800"}`}
                          >
                            {cfg.label}
                          </p>
                        </div>
                        <p className="text-[10px] text-gray-400 font-geist leading-snug line-clamp-2">
                          {cfg.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Group 2: Product & Monetization */}
                <div className="space-y-3 pt-2">
                  <p className="text-[10px] font-jetbrains-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <CosIcon name="conversion" size={12} className="text-[#FF5B04]" /> Product & Monetization Archetypes
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {getPostTypesByCategory("monetization").map((cfg) => (
                      <button
                        key={cfg.value}
                        className={`flex flex-col gap-2.5 p-4 rounded-2xl border-2 transition-all text-left cursor-pointer hover:scale-[1.01] hover:shadow-sm ${
                          postType === cfg.value
                            ? "border-[#FF5B04] bg-white shadow-sm"
                            : "border-black/5 bg-white hover:border-[#FF5B04]/40"
                        }`}
                        onClick={() => setPostType(cfg.value)}
                        onMouseEnter={() => setHoveredType(cfg.value)}
                        onMouseLeave={() => setHoveredType(null)}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              postType === cfg.value
                                ? "bg-[#FF5B04]/10 text-[#FF5B04]"
                                : "bg-black/5 text-gray-500"
                            }`}
                          >
                            <CosIcon name={cfg.icon} size={14} />
                          </div>
                          <p
                            className={`text-[13px] font-bold font-geist ${postType === cfg.value ? "text-[#FF5B04]" : "text-gray-800"}`}
                          >
                            {cfg.label}
                          </p>
                        </div>
                        <p className="text-[10px] text-gray-400 font-geist leading-snug line-clamp-2">
                          {cfg.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Strategist Board */}
              <div className="md:col-span-4 h-full bg-white border border-black/5 p-6 rounded-3xl sticky top-24 space-y-4 shadow-sm animate-in slide-in-from-right-2">
                <div className="flex items-center gap-1.5">
                  <CosIcon name="bot" size={14} className="text-[#FF5B04]" />
                  <p className="text-[10px] font-jetbrains-mono font-bold text-[#FF5B04] uppercase tracking-widest">
                    AI Strategist Advisor
                  </p>
                </div>
                <div className="space-y-2 border-b border-black/[0.03] pb-4">
                  <h3 className="text-base font-extrabold font-geist text-gray-800 flex items-center gap-1.5">
                    {currentTypeConfig && <CosIcon name={currentTypeConfig.icon} size={18} className="text-[#FF5B04]" />}
                    {archetypeExplanation.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-geist leading-relaxed">
                    {archetypeExplanation.desc}
                  </p>
                </div>
                <div className="space-y-2 bg-black/[0.01] border border-black/[0.02] p-4 rounded-2xl">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-jetbrains-mono block">
                    🔧 Workspace Tuning
                  </span>
                  <p className="text-[11px] text-gray-600 font-geist leading-relaxed">
                    {archetypeExplanation.tip}
                  </p>
                </div>
                <p className="text-[9px] text-[#FF5B04] font-semibold font-jetbrains-mono italic pt-2">
                  *Unused formatting options and editor tabs will be completely
                  hidden to ensure zero focus distractions.
                </p>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────────
              STEP 2: GOAL SELECTION
          ─────────────────────────────────────────────────────────────────── */}
          {wizardStep === 2 && (
            <div className="md:grid md:grid-cols-12 gap-8 items-start animate-in slide-in-from-right-4 duration-200">
              {/* Left Column: Goal Cards */}
              <div className="md:col-span-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-orange-50 text-[#FF5B04] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5">
                      Archetype: {activeTypeConfig && <CosIcon name={activeTypeConfig.icon} size={10} className="inline text-[#FF5B04]" />}
                      {activeTypeConfig?.label}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold font-geist text-gray-900 mt-2.5 leading-tight">
                    What is the goal of this content?
                  </h2>
                  <p className="text-xs text-gray-400 font-geist mt-1.5 leading-relaxed">
                    Specify the business or marketing objective of this post.
                    This dynamically weights readability & SEO health scores.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {CONTENT_GOALS.filter((g) =>
                    activeTypeConfig?.suggestedGoals.includes(g.value),
                  ).map((g) => {
                    const isSuggested = activeTypeConfig?.suggestedGoals
                      .slice(0, 2)
                      .includes(g.value);

                    return (
                      <button
                        key={g.value}
                        className={`flex flex-col gap-2.5 p-4 rounded-2xl border-2 transition-all text-left relative cursor-pointer hover:scale-[1.01] hover:shadow-sm ${
                          contentGoal === g.value
                            ? "border-[#FF5B04] bg-white shadow-sm"
                            : "border-black/5 bg-white hover:border-[#FF5B04]/40"
                        }`}
                        onClick={() => setContentGoal(g.value)}
                        onMouseEnter={() => setHoveredGoal(g.value)}
                        onMouseLeave={() => setHoveredGoal(null)}
                      >
                        {isSuggested && (
                          <span className="absolute top-3 right-3 text-[8px] font-bold font-jetbrains-mono uppercase bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-200">
                            Suggested
                          </span>
                        )}
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              contentGoal === g.value
                                ? "bg-[#FF5B04]/10 text-[#FF5B04]"
                                : "bg-black/5 text-gray-500"
                            }`}
                          >
                            <CosIcon name={g.icon} size={14} />
                          </div>
                          <p
                            className={`text-[13px] font-bold font-geist ${contentGoal === g.value ? "text-[#FF5B04]" : "text-gray-800"}`}
                          >
                            {g.label}
                          </p>
                        </div>
                        <p className="text-[10px] text-gray-400 font-geist leading-snug line-clamp-2">
                          {g.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Dynamic Strategist Board */}
              <div className="md:col-span-4 h-full bg-white border border-black/5 p-6 rounded-3xl sticky top-24 space-y-4 shadow-sm animate-in slide-in-from-right-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">🎯</span>
                  <p className="text-[10px] font-jetbrains-mono font-bold text-[#FF5B04] uppercase tracking-widest">
                    AI Strategy Tuning
                  </p>
                </div>
                <div className="space-y-2 border-b border-black/[0.03] pb-4">
                  <h3 className="text-base font-extrabold font-geist text-gray-800 flex items-center gap-1.5">
                    {currentGoalConfig && <CosIcon name={currentGoalConfig.icon} size={18} className="text-[#FF5B04]" />}
                    {goalExplanation.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-geist leading-relaxed">
                    {goalExplanation.desc}
                  </p>
                </div>
                <div className="space-y-2 bg-black/[0.01] border border-black/[0.02] p-4 rounded-2xl">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-jetbrains-mono block">
                    🧠 Copilot System Focus
                  </span>
                  <p className="text-[10px] text-gray-600 font-geist leading-relaxed">
                    {goalExplanation.aiFocus}
                  </p>
                </div>
                <p className="text-[9px] text-[#FF5B04] font-semibold font-jetbrains-mono italic pt-2">
                  *Your Content Health tab weights will automatically sync to
                  prioritize metrics matching this goal.
                </p>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────────
              STEP 3: WORKSPACE PREVIEW & CAROUSEL TUTORIAL
          ─────────────────────────────────────────────────────────────────── */}
          {wizardStep === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-200">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-2xl font-extrabold font-geist text-gray-900 leading-tight">
                  Your Workspace is Ready!
                </h2>
                <p className="text-xs text-gray-400 font-geist leading-relaxed">
                  Quick interactive tour of how your workspace is customized for this post.
                </p>
              </div>

              {/* Interactive Carousel Card */}
              <div className="max-w-md mx-auto">
                {(() => {
                  const slide = TUTORIAL_SLIDES[currentSlide];
                  return (
                    <div className="w-full relative">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`w-full min-h-[170px] rounded-3xl p-6 flex flex-col justify-between shadow-md bg-gradient-to-br ${slide.bg} border ${slide.border} relative overflow-hidden`}
                      >
                        {/* Background Glow */}
                        <div className={`absolute -right-10 -bottom-10 w-24 h-24 rounded-full filter blur-xl opacity-20 ${slide.bgClass}`} />
                        
                        <div className="space-y-3 relative z-10">
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] font-bold font-jetbrains-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full ${slide.bgClass} ${slide.textClass}`}>
                              {slide.badge}
                            </span>
                            <div className={`p-1.5 rounded-lg ${slide.bgClass} ${slide.textClass}`}>
                              <CosIcon name={slide.icon} size={15} />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-[14px] font-bold text-gray-900 font-geist">
                              {slide.title}
                            </h3>
                            <p className="text-[11px] text-gray-500 leading-relaxed font-geist">
                              {slide.desc}
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Navigation Controls */}
                      <div className="flex items-center justify-center gap-3.5 mt-4">
                        <button
                          type="button"
                          onClick={() => setCurrentSlide((prev) => (prev === 0 ? TUTORIAL_SLIDES.length - 1 : prev - 1))}
                          className="w-7 h-7 rounded-xl flex items-center justify-center border border-black/5 bg-white text-gray-500 hover:text-gray-800 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer font-bold"
                        >
                          ←
                        </button>
                        
                        {/* Slide Dots Indicator */}
                        <div className="flex items-center gap-1.5">
                          {TUTORIAL_SLIDES.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setCurrentSlide(idx)}
                              className={`h-1 rounded-full transition-all duration-200 cursor-pointer ${
                                currentSlide === idx ? "w-5 bg-[#FF5B04]" : "w-1 bg-black/[0.08] hover:bg-black/[0.15]"
                              }`}
                            />
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setCurrentSlide((prev) => (prev === TUTORIAL_SLIDES.length - 1 ? 0 : prev + 1))}
                          className="w-7 h-7 rounded-xl flex items-center justify-center border border-black/5 bg-white text-gray-500 hover:text-gray-800 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer font-bold"
                        >
                          →
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Strategy Configuration Summary */}
              <div className="max-w-md mx-auto bg-white border border-black/[0.03] rounded-2xl p-3 flex items-center justify-between text-left shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 font-jetbrains-mono uppercase tracking-wider">
                  calibrated layout
                </span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-orange-50 border border-orange-100 text-[10px] font-semibold text-gray-700">
                    {activeTypeConfig && <CosIcon name={activeTypeConfig.icon} size={11} className="text-[#FF5B04]" />}
                    {activeTypeConfig?.label}
                  </span>
                  <span className="text-gray-300 text-xs">×</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#FF5B04]/5 border border-[#FF5B04]/10 text-[10px] font-semibold text-gray-700">
                    {activeGoalConfig && <CosIcon name={activeGoalConfig.icon} size={11} className="text-[#FF5B04]" />}
                    {activeGoalConfig?.label}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Viewport-locked Bottom Actions Footer (Always Visible) */}
        <div className="fixed bottom-0 left-60 right-0 bg-white/90 backdrop-blur-md border-t border-black/5 px-8 py-4 flex items-center justify-between z-30 shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.04)]">
          {wizardStep === 1 && (
            <>
              <button
                className="text-xs font-bold font-geist text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                onClick={() => router.push(getHref("/posts"))}
              >
                Cancel
              </button>
              <button
                className="ml-auto flex items-center gap-1.5 text-xs font-semibold font-geist text-white h-10 px-5 rounded-xl transition-all shadow-sm cursor-pointer hover:shadow hover:scale-[1.02]"
                style={{ background: "#FF5B04" }}
                onClick={() => {
                  setWizardStep(2);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Continue to Goal
                <svg
                  fill="none"
                  height="12"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  width="12"
                  className="inline"
                >
                  <line x1="5" x2="19" y1="12" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </>
          )}

          {wizardStep === 2 && (
            <>
              <button
                className="text-xs font-bold font-geist text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                onClick={() => {
                  setWizardStep(1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                ← Back to Archetype
              </button>
              <button
                className="ml-auto flex items-center gap-1.5 text-xs font-semibold font-geist text-white h-10 px-5 rounded-xl transition-all shadow-sm cursor-pointer hover:shadow hover:scale-[1.02]"
                style={{ background: "#FF5B04" }}
                onClick={() => {
                  setWizardStep(3);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Configure Workspace
                <svg
                  fill="none"
                  height="12"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  width="12"
                  className="inline"
                >
                  <line x1="5" x2="19" y1="12" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </>
          )}

          {wizardStep === 3 && (
            <>
              <button
                className="text-xs font-bold font-geist text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                onClick={() => {
                  setWizardStep(2);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                ← Change Goal
              </button>
              <button
                className="ml-auto flex items-center gap-2 text-xs font-bold font-geist text-white h-11 px-8 rounded-xl transition-all shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.02]"
                style={{
                  background:
                    "linear-gradient(135deg, #FF5B04 0%, #E04E00 100%)",
                }}
                onClick={() => {
                  setTypeSelected(true);
                  const PRESET_DEFAULTS: Record<string, string> = {
                    blog: "seo-article",
                    tutorial: "technical-deep-dive",
                    "case-study": "case-study",
                    "community-insight": "thought-leadership",
                    "corporate-post": "thought-leadership",
                    "product-review": "seo-article",
                    "product-launch": "product-launch",
                    listicle: "seo-article",
                    comparison: "comparison",
                    newsletter: "thought-leadership",
                    "social-post": "linkedin-post",
                  };
                  const defaultPreset = PRESET_DEFAULTS[postType] || "";

                  setActivePreset(defaultPreset);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Start Writing!
                <svg
                  fill="none"
                  height="14"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  width="14"
                  className="inline"
                >
                  <line x1="5" x2="19" y1="12" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const t = tagInput.trim().replace(/,$/, "");

      if (t && !tags.includes(t)) setTags([...tags, t]);
      setTagInput("");
    }
  };

  const statusColor: Record<string, string> = {
    Draft: "#6b7280",
    "Saving…": "#FF5B04",
    "Publishing…": "#FF5B04",
    Saved: "#16a34a",
    Published: "#16a34a",
    Error: "#dc2626",
  };

  return (
    <div className="min-h-screen" style={{ background: "#F7F7F6" }}>
      {/* ── Top Bar ── */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-3"
        style={{
          background: "rgba(247,247,246,0.95)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-1.5 text-xs font-geist text-gray-400 hover:text-gray-700 transition-colors"
            onClick={() => navigateSafely(getHref("/posts"))}
          >
            <svg
              fill="none"
              height="14"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="14"
            >
              <line x1="19" x2="5" y1="12" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Posts
          </button>
          <span className="text-gray-200">/</span>
          <span className="text-sm font-medium font-geist text-gray-900">
            New Post
          </span>
          {/* Locked type badge */}
          <span
            className="flex items-center gap-1.5 text-[10px] font-semibold font-jetbrains-mono px-2.5 py-1 rounded-full uppercase tracking-wider"
            style={{ background: "rgba(255,91,4,0.10)", color: "#FF5B04" }}
            title="Post type and goal are locked for this draft"
          >
            <svg
              fill="none"
              height="10"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              width="10"
            >
              <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {(() => {
              const ptConfig = getPostTypeConfig(postType);
              const gConfig = getGoalConfig(contentGoal);
              return (
                <span className="flex items-center gap-1">
                  {ptConfig && <CosIcon name={ptConfig.icon} size={10} />}
                  <span>{ptConfig?.label}</span>
                  <span className="mx-0.5">×</span>
                  {gConfig && <CosIcon name={gConfig.icon} size={10} />}
                  <span>{gConfig?.label}</span>
                </span>
              );
            })()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-geist font-medium transition-colors"
            style={{ color: statusColor[saveStatus] ?? "#6b7280" }}
          >
            {saveStatus}
          </span>
          <button
            className={`h-9 px-4 rounded-xl text-sm font-geist font-medium flex items-center gap-1.5 transition-all ${
              showPreview
                ? "bg-[#FF5B04] text-white"
                : "bg-black/5 text-gray-600 hover:bg-black/10"
            }`}
            onClick={() => setShowPreview((v) => !v)}
          >
            <svg
              fill="none"
              height="13"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="13"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {showPreview ? "Exit Preview" : "Preview"}
          </button>
          <Button
            className="font-geist text-sm h-9 px-4 rounded-xl bg-black/5 text-gray-700 font-medium"
            disabled={isSaving}
            variant="flat"
            onClick={handleSaveDraft}
          >
            Save Draft
          </Button>
          <Button
            className="font-geist text-sm h-9 px-4 rounded-xl font-medium text-white"
            disabled={isSaving}
            isLoading={isSaving}
            style={{ background: "#FF5B04" }}
            onClick={handlePublish}
          >
            Publish
          </Button>
        </div>
      </div>

      {/* ── Formatting Toolbar — hidden in immersive preview mode ── */}
      {!showPreview && (
        <FormattingToolbar
          activePreset={activePreset}
          editor={editor}
          features={getFeatures(postType)}
          postType={postType}
          onCopilotClick={() => setIsCopilotOpen(true)}
          onLinkClick={() => {
            editor.chain().focus().extendMarkRange("link").run();
            setShowLinkModal(true);
          }}
          onPresetChange={setActivePreset}
          onTransformClick={() => setIsRepurposeDrawerOpen(true)}
        />
      )}

      {/* ── Two-column Layout ── */}
      <div className="flex gap-6 px-6 pb-6 pt-2 items-start">
        {/* Editor / Preview Column */}
        {showPreview ? (
          <PostPreviewPanel
            bannerImage={bannerImage}
            contentHtml={editor?.getHTML() || ""}
            excerpt={excerpt}
            postType={postType}
            tags={tags}
            title={title}
            onEdit={() => setShowPreview(false)}
          />
        ) : (
          <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
            {/* Banner image area */}
            {bannerImage ? (
              <div className="relative group">
                <img
                  alt="Banner"
                  className="w-full h-48 object-cover"
                  src={bannerImage}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <button
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                  onClick={() => {
                    setBannerImage("");
                    setFeaturedImage("");
                  }}
                >
                  <svg
                    fill="none"
                    height="14"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    width="14"
                  >
                    <line x1="18" x2="6" y1="6" y2="18" />
                    <line x1="6" x2="18" y1="6" y2="18" />
                  </svg>
                </button>
                <label className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-xs font-geist font-medium text-white bg-black/60 hover:bg-black/80 transition-colors px-3 py-1.5 rounded-lg">
                    Change Banner
                  </span>
                  <input
                    accept="image/*"
                    className="hidden"
                    type="file"
                    onChange={handleBannerImageUpload}
                  />
                </label>
              </div>
            ) : (
              <label className="flex items-center gap-2 px-10 pt-6 pb-2 cursor-pointer group w-fit">
                <svg
                  className="group-hover:stroke-[#FF5B04] transition-colors"
                  fill="none"
                  height="16"
                  stroke="#d1d5db"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.75"
                  viewBox="0 0 24 24"
                  width="16"
                >
                  <rect height="18" rx="2" width="18" x="3" y="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="text-xs font-geist text-gray-300 group-hover:text-[#FF5B04] transition-colors">
                  Add cover image
                </span>
                <input
                  accept="image/*"
                  className="hidden"
                  type="file"
                  onChange={handleBannerImageUpload}
                />
              </label>
            )}

            {/* Title */}
            <div
              className={
                bannerImage
                  ? "px-14 pt-6 pb-4 relative"
                  : "px-14 pt-4 pb-4 relative"
              }
            >
              {postType === "social-post" ? (
                <div className="flex flex-col gap-2 p-4 rounded-2xl bg-black/[0.015] border border-black/5 backdrop-blur-sm shadow-sm transition-all hover:bg-black/[0.025] hover:border-black/10">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 font-geist select-none uppercase tracking-wider">
                    <CosIcon name="link" size={12} className="text-gray-400" />
                    <span>Internal Social Draft Name (dashboard only):</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      className="w-full text-base font-bold font-geist border-none outline-none bg-transparent text-gray-800 placeholder-gray-300"
                      placeholder="e.g. LinkedIn launch thread..."
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    {title === "" && (
                      <button
                        className="flex-shrink-0 text-[10px] font-bold font-geist text-[#FF5B04] hover:underline cursor-pointer"
                        type="button"
                        onClick={() => {
                          const defaultTitle = `LinkedIn Post - ${new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;

                          setTitle(defaultTitle);
                        }}
                      >
                        Auto-fill Name
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <input
                    className="w-full text-4xl font-bold font-geist border-none outline-none bg-transparent text-gray-900 placeholder-gray-200 leading-tight"
                    placeholder="Post title…"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <button
                    className="flex-shrink-0 text-xs font-semibold font-geist px-3 py-1.5 rounded-xl border border-orange-100 hover:border-[#FF5B04] text-[#FF5B04] hover:bg-orange-50/50 transition-all duration-200 flex items-center gap-1 cursor-pointer shadow-sm bg-white"
                    type="button"
                    onClick={() => {
                      setIsTitleModalOpen(true);
                    }}
                  >
                    <svg
                      fill="none"
                      height="11"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="11"
                    >
                      <path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z" />
                    </svg>
                    AI Assistant
                  </button>
                </div>
              )}
            </div>

            <div
              className="h-px mx-14"
              style={{ background: "rgba(0,0,0,0.06)" }}
            />

            {/* Editor area */}
            <div ref={editorRef} className="relative px-14 py-4">
              {/* Floating Block Inserter */}
              <FloatingBlockInserter
                editor={editor}
                imageUploadRef={inlineImageUploadRef}
                postType={postType}
                onImageUrl={() => setShowImageUrlModal(true)}
                onVideoEmbed={() => setShowVideoModal(true)}
              />

              {/* Hidden file input for inline image upload */}
              <input
                ref={inlineImageUploadRef}
                accept="image/*"
                className="hidden"
                type="file"
                onChange={handleInlineImageUpload}
              />

              <div className="notion-editor-wrapper min-h-[520px]">
                <EditorContent editor={editor} />
              </div>

              <SlashCommandMenu
                editor={editor}
                imageUploadRef={inlineImageUploadRef}
                isOpen={slashMenuOpen}
                position={slashMenuPosition}
                postType={postType}
                onClose={() => setSlashMenuOpen(false)}
                onImageUrl={() => {
                  setSlashMenuOpen(false);
                  setShowImageUrlModal(true);
                }}
                onVideoEmbed={() => {
                  setSlashMenuOpen(false);
                  setShowVideoModal(true);
                }}
              />
            </div>
          </div>
        )}

        {/* ── Settings Sidebar — hidden in immersive preview mode ── */}
        {!showPreview && (
          <div className="w-72 flex-shrink-0 space-y-4">
            {/* Sidebar Tab Navigation */}
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm flex overflow-hidden">
              {[
                { key: "content", label: postType === "social-post" ? "Narrative" : "Content" },
                ...(getFeatures(postType).seoPanel
                  ? [{ key: "seo", label: "SEO" }]
                  : []),
                { key: "ai", label: "AI Tools" },
                { key: "health", label: "Health" },
                { key: "distribute", label: "Distribute" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className={`flex-1 py-2.5 text-[10px] font-jetbrains-mono uppercase tracking-wider font-bold transition-all border-b-2 ${
                    sidebarTab === key
                      ? "text-[#FF5B04] border-[#FF5B04] bg-orange-50/40"
                      : "text-gray-400 border-transparent hover:text-gray-600 hover:bg-black/[0.02]"
                  }`}
                  onClick={() => setSidebarTab(key as any)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ── Content Tab ── */}
            {sidebarTab === "content" && (
              <>
                {/* Feed Guardrails or Analytics Card */}
                {postType === "social-post" ? (
                  <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 space-y-4">
                    <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest">
                      Feed Guardrails
                    </p>
                    
                    {/* Platform switcher */}
                    <div className="flex bg-black/5 p-1 rounded-xl">
                      {(["linkedin", "x"] as const).map((dest) => (
                        <button
                          key={dest}
                          type="button"
                          onClick={() => setSocialDestination(dest)}
                          className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
                            socialDestination === dest
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-500 hover:text-gray-800"
                          }`}
                        >
                          {SOCIAL_DESTINATIONS[dest].label}
                        </button>
                      ))}
                    </div>

                    {/* Character limit bar */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-geist text-gray-500 font-medium">
                          Characters
                        </span>
                        <span className={`text-[10px] font-jetbrains-mono font-semibold ${
                          editorStats.characters > SOCIAL_DESTINATIONS[socialDestination].characterLimit
                            ? "text-red-500 font-bold"
                            : editorStats.characters >= SOCIAL_DESTINATIONS[socialDestination].warningAt
                            ? "text-amber-500"
                            : "text-gray-400"
                        }`}>
                          {editorStats.characters} / {SOCIAL_DESTINATIONS[socialDestination].characterLimit}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            editorStats.characters > SOCIAL_DESTINATIONS[socialDestination].characterLimit
                              ? "bg-red-500"
                              : editorStats.characters >= SOCIAL_DESTINATIONS[socialDestination].warningAt
                              ? "bg-amber-500"
                              : "bg-[#FF5B04]"
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              (editorStats.characters / SOCIAL_DESTINATIONS[socialDestination].characterLimit) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Whitespace Spacing Advisor */}
                    {editorStats.characters > 0 && (
                      <div className="pt-3 border-t border-black/5">
                        {(() => {
                          const text = editor?.getText() || "";
                          const paragraphsText = text.split("\n").map(p => p.trim()).filter(Boolean);
                          const hasLongParagraph = paragraphsText.some(p => p.length > 240);
                          if (hasLongParagraph) {
                            return (
                              <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 flex gap-2">
                              <CosIcon name="warning" size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-[10px] font-bold text-amber-800">
                                    Whitespace Spacing Advisor
                                  </p>
                                  <p className="text-[10px] text-amber-700 leading-normal mt-0.5">
                                    Feeds favor breathing room. Split this into short 1-2 sentence paragraphs for better mobile reading.
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div className="bg-green-50 border border-green-200/60 rounded-xl p-3 flex gap-2">
                              <CosIcon name="check" size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-[10px] font-bold text-green-800">
                                  Spacing Calibrated
                                </p>
                                <p className="text-[10px] text-green-700 leading-normal mt-0.5">
                                  Excellent spacing! Paragraphs are airy and reader-friendly.
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
                    <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-3">
                      Analytics
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/[0.02] rounded-xl p-3 border border-black/5">
                        <div className="text-2xl font-bold font-geist text-gray-900">
                          {editorStats.words}
                        </div>
                        <div className="text-[9px] font-jetbrains-mono uppercase text-gray-400 tracking-wider mt-1">
                          Words
                        </div>
                      </div>
                      <div className="bg-black/[0.02] rounded-xl p-3 border border-black/5">
                        <div className="text-2xl font-bold font-geist text-gray-900">
                          {editorStats.characters}
                        </div>
                        <div className="text-[9px] font-jetbrains-mono uppercase text-gray-400 tracking-wider mt-1">
                          Characters
                        </div>
                      </div>
                      <div className="bg-black/[0.02] rounded-xl p-3 border border-black/5">
                        <div className="text-2xl font-bold font-geist text-gray-900">
                          {editorStats.paragraphs}
                        </div>
                        <div className="text-[9px] font-jetbrains-mono uppercase text-gray-400 tracking-wider mt-1">
                          Paragraphs
                        </div>
                      </div>
                      <div className="bg-black/[0.02] rounded-xl p-3 border border-black/5">
                        <div className="text-2xl font-bold font-geist text-[#FF5B04]">
                          {editorStats.readTime} min
                        </div>
                        <div className="text-[9px] font-jetbrains-mono uppercase text-gray-400 tracking-wider mt-1">
                          Read Time
                        </div>
                      </div>
                    </div>

                    {/* Writing Goal Progress */}
                    {(() => {
                      const wordGoal = getPostTypeConfig(postType)?.minWordCount ?? 500;
                      return (
                        <div className="mt-3.5 pt-3 border-t border-black/5">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-geist text-gray-500 font-medium">
                              Writing Goal
                            </span>
                            <span className="text-[10px] font-jetbrains-mono text-gray-400 font-semibold">
                              {Math.min(
                                100,
                                Math.round((editorStats.words / wordGoal) * 100),
                              )}
                              % ({editorStats.words}/{wordGoal} words)
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500 ease-out"
                              style={{
                                width: `${Math.min(100, (editorStats.words / wordGoal) * 100)}%`,
                                background: "#FF5B04",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Excerpt card - hidden for social posts */}
                {postType !== "social-post" && (
                  <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest">
                        Excerpt
                      </p>
                      <button
                        className="text-[10px] font-geist font-semibold text-[#FF5B04] hover:text-[#d946ef] transition-colors flex items-center gap-1 cursor-pointer"
                        onClick={() => {
                          if (!editor || editor.isEmpty) {
                            setValidationError(
                              "Please write some content first so the AI can summarize it.",
                            );

                            return;
                          }
                          setIsExcerptModalOpen(true);
                        }}
                      >
                        <svg
                          fill="none"
                          height="10"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="10"
                        >
                          <path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z" />
                        </svg>
                        AI Assistant
                      </button>
                    </div>
                    <textarea
                      className="w-full text-sm font-geist text-gray-700 bg-black/5 rounded-xl p-3 resize-none outline-none focus:ring-1 placeholder-gray-300"
                      placeholder="Short summary shown in blog listings…"
                      style={{ minHeight: 80 }}
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                    />
                  </div>
                )}

                {/* Hashtag Assistant / Tags card */}
                {postType === "social-post" ? (
                  <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest">
                        Hashtag Assistant
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-xs font-geist px-2 py-0.5 rounded-full"
                          style={{ background: "#FFF0E8", color: "#FF5B04" }}
                        >
                          {tag}
                          <button
                            type="button"
                            className="opacity-60 hover:opacity-100 leading-none flex items-center"
                            onClick={() => setTags(tags.filter((t) => t !== tag))}
                          >
                            <svg
                              fill="none"
                              height="9"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                              width="9"
                            >
                              <line x1="18" x2="6" y1="6" y2="18" />
                              <line x1="6" x2="18" y1="6" y2="18" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-jetbrains-mono">
                        Suggestions
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {SOCIAL_DESTINATIONS[socialDestination].suggestions.map((suggestion) => {
                          const isSelected = tags.includes(suggestion);
                          return (
                            <button
                              key={suggestion}
                              type="button"
                              disabled={isSelected}
                              onClick={() => appendHashtag(suggestion)}
                              className={`text-[10px] font-geist px-2.5 py-1 rounded-lg transition-all ${
                                isSelected
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-black/[0.03] text-gray-600 hover:bg-[#FF5B04]/10 hover:text-[#FF5B04]"
                              }`}
                            >
                              {suggestion}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <input
                      className="w-full text-sm font-geist bg-black/5 rounded-lg px-3 py-2 outline-none placeholder-gray-300"
                      placeholder="Add tag, press Enter…"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddHashtag}
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest">
                        Tags
                      </p>
                      <button
                        className="text-[10px] font-geist font-semibold text-[#FF5B04] hover:text-[#d946ef] transition-colors flex items-center gap-1 cursor-pointer"
                        type="button"
                        onClick={() => {
                          setIsTagsModalOpen(true);
                        }}
                      >
                        <svg
                          fill="none"
                          height="10"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="10"
                        >
                          <path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z" />
                        </svg>
                        AI Assistant
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-xs font-geist px-2 py-0.5 rounded-full"
                          style={{ background: "#FFF0E8", color: "#FF5B04" }}
                        >
                          {tag}
                          <button
                            className="opacity-60 hover:opacity-100 leading-none flex items-center"
                            onClick={() => setTags(tags.filter((t) => t !== tag))}
                          >
                            <svg
                              fill="none"
                              height="9"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                              width="9"
                            >
                              <line x1="18" x2="6" y1="6" y2="18" />
                              <line x1="6" x2="18" y1="6" y2="18" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      className="w-full text-sm font-geist bg-black/5 rounded-lg px-3 py-2 outline-none placeholder-gray-300"
                      placeholder="Add tag, press Enter…"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={addTag}
                    />
                  </div>
                )}

                {/* Quick insert card */}
                <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
                  <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-3">
                    Quick Insert
                  </p>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-geist text-gray-600 cursor-pointer hover:text-[#FF5B04] hover:bg-orange-50 rounded-xl px-3 py-2.5 transition-colors">
                      <svg
                        fill="none"
                        height="14"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.75"
                        viewBox="0 0 24 24"
                        width="14"
                      >
                        <rect height="18" rx="2" width="18" x="3" y="3" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      Upload image
                      <input
                        accept="image/*"
                        className="hidden"
                        type="file"
                        onChange={handleInlineImageUpload}
                      />
                    </label>
                    <button
                      className="w-full flex items-center gap-2 text-sm font-geist text-gray-600 cursor-pointer hover:text-[#FF5B04] hover:bg-orange-50 rounded-xl px-3 py-2.5 transition-colors text-left"
                      onClick={() => setShowImageUrlModal(true)}
                    >
                      <svg
                        fill="none"
                        height="14"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.75"
                        viewBox="0 0 24 24"
                        width="14"
                      >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      Image from URL
                    </button>
                    <button
                      className="w-full flex items-center gap-2 text-sm font-geist text-gray-600 cursor-pointer hover:text-[#FF5B04] hover:bg-orange-50 rounded-xl px-3 py-2.5 transition-colors text-left"
                      onClick={() => setShowVideoModal(true)}
                    >
                      <svg
                        fill="none"
                        height="14"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.75"
                        viewBox="0 0 24 24"
                        width="14"
                      >
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect
                          height="14"
                          rx="2"
                          ry="2"
                          width="15"
                          x="1"
                          y="5"
                        />
                      </svg>
                      Embed video
                    </button>
                    {postType !== "social-post" && (
                      <>
                        <button
                          className="w-full flex items-center gap-2 text-sm font-geist text-gray-600 cursor-pointer hover:text-[#FF5B04] hover:bg-orange-50 rounded-xl px-3 py-2.5 transition-colors text-left"
                          onClick={() =>
                            editor.chain().focus().setHorizontalRule().run()
                          }
                        >
                          <svg
                            fill="none"
                            height="14"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.75"
                            viewBox="0 0 24 24"
                            width="14"
                          >
                            <line x1="3" x2="21" y1="12" y2="12" />
                          </svg>
                          Add divider
                        </button>
                        <button
                          className="w-full flex items-center gap-2 text-sm font-geist text-gray-600 cursor-pointer hover:text-[#FF5B04] hover:bg-orange-50 rounded-xl px-3 py-2.5 transition-colors text-left"
                          onClick={() =>
                            editor.chain().focus().toggleCodeBlock().run()
                          }
                        >
                          <svg
                            fill="none"
                            height="14"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.75"
                            viewBox="0 0 24 24"
                            width="14"
                          >
                            <polyline points="16 18 22 12 16 6" />
                            <polyline points="8 6 2 12 8 18" />
                          </svg>
                          Code block
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ── SEO Tab ── */}
            {sidebarTab === "seo" && (
              <>
                <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest">
                      SEO Health
                    </p>
                    {(() => {
                      const score =
                        (seoData?.focusKeyword ? 25 : 0) +
                        (seoData?.metaTitle ? 25 : 0) +
                        (seoData?.metaDescription ? 25 : 0) +
                        ((seoData?.keywords?.length ?? 0) > 0 ? 25 : 0);
                      const color =
                        score >= 75
                          ? "#16a34a"
                          : score >= 50
                            ? "#FF5B04"
                            : "#dc2626";
                      const label =
                        score >= 75
                          ? "Good"
                          : score >= 50
                            ? "Fair"
                            : "Needs Work";

                      return (
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8">
                            <svg
                              className="w-8 h-8 -rotate-90"
                              viewBox="0 0 32 32"
                            >
                              <circle
                                cx="16"
                                cy="16"
                                fill="none"
                                r="12"
                                stroke="#f3f4f6"
                                strokeWidth="4"
                              />
                              <circle
                                cx="16"
                                cy="16"
                                fill="none"
                                r="12"
                                stroke={color}
                                strokeDasharray={`${(score / 100) * 75.4} 75.4`}
                                strokeLinecap="round"
                                strokeWidth="4"
                              />
                            </svg>
                            <span
                              className="absolute inset-0 flex items-center justify-center text-[8px] font-bold font-jetbrains-mono"
                              style={{ color }}
                            >
                              {score}
                            </span>
                          </div>
                          <span
                            className="text-[10px] font-bold font-jetbrains-mono"
                            style={{ color }}
                          >
                            {label}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="space-y-2 mb-4">
                    {[
                      {
                        label: "Focus Keyword",
                        value: !!seoData?.focusKeyword,
                      },
                      { label: "Meta Title", value: !!seoData?.metaTitle },
                      {
                        label: "Meta Description",
                        value: !!seoData?.metaDescription,
                      },
                      {
                        label: "Keywords",
                        value: (seoData?.keywords?.length ?? 0) > 0,
                      },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: value ? "#dcfce7" : "#fee2e2" }}
                        >
                          {value ? (
                            <svg
                              fill="none"
                              height="8"
                              stroke="#16a34a"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                              width="8"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <svg
                              fill="none"
                              height="8"
                              stroke="#dc2626"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                              width="8"
                            >
                              <line x1="18" x2="6" y1="6" y2="18" />
                              <line x1="6" x2="18" y1="6" y2="18" />
                            </svg>
                          )}
                        </div>
                        <span className="text-xs font-geist text-gray-600">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    className="w-full py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                    onClick={() => setShowSEOModal(true)}
                  >
                    <svg
                      fill="none"
                      height="12"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      width="12"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    Open SEO Editor
                  </button>
                </div>
                <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 space-y-3">
                  <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest">
                    Quick Edit
                  </p>
                  <div>
                    <label className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-wider block mb-1">
                      Focus Keyword
                    </label>
                    <input
                      className="w-full text-sm font-geist bg-black/5 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-[#FF5B04]/30 placeholder-gray-300"
                      placeholder="e.g. react performance"
                      value={seoData?.focusKeyword || ""}
                      onChange={(e) =>
                        setSeoData((prev) => ({
                          ...prev,
                          focusKeyword: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-wider block mb-1">
                      Meta Title{" "}
                      <span className="normal-case font-geist text-gray-300">
                        ({(seoData?.metaTitle || "").length}/60)
                      </span>
                    </label>
                    <input
                      className="w-full text-sm font-geist bg-black/5 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-[#FF5B04]/30 placeholder-gray-300"
                      maxLength={60}
                      placeholder="SEO page title…"
                      value={seoData?.metaTitle || ""}
                      onChange={(e) =>
                        setSeoData((prev) => ({
                          ...prev,
                          metaTitle: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-wider block mb-1">
                      Meta Description{" "}
                      <span className="normal-case font-geist text-gray-300">
                        ({(seoData?.metaDescription || "").length}/160)
                      </span>
                    </label>
                    <textarea
                      className="w-full text-sm font-geist bg-black/5 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-[#FF5B04]/30 placeholder-gray-300 resize-none"
                      maxLength={160}
                      placeholder="Brief description for search results…"
                      rows={3}
                      value={seoData?.metaDescription || ""}
                      onChange={(e) =>
                        setSeoData((prev) => ({
                          ...prev,
                          metaDescription: e.target.value,
                        }))
                      }
                    />
                  </div>
                  {currentSlug && (
                    <div className="pt-1 border-t border-black/5">
                      <p className="text-[9px] font-jetbrains-mono text-gray-400 uppercase tracking-wider mb-1">
                        URL Slug
                      </p>
                      <p className="text-xs font-geist text-gray-500 break-all">
                        /{currentSlug}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── AI Tab ── */}
            {sidebarTab === "ai" && (
              <div className="space-y-3">
                <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest px-1">
                  {postType === "social-post" ? "Social AI Tools" : "AI Writing Tools"}
                </p>

                {postType === "social-post" ? (
                  // ── Social-post quick actions ──────────────────────────────
                  [
                    {
                      key: "copilot",
                      label: "AI Copilot",
                      description: "Generate post content with AI",
                      icon: (
                        <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 24 24" width="20">
                          <path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z" />
                        </svg>
                      ),
                      onClick: () => setIsCopilotOpen(true),
                    },
                    {
                      key: "hook",
                      label: "AI Hook",
                      description: "Generate 3 scroll-stopping opening hooks",
                      icon: (
                        <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 24 24" width="20">
                          <path d="M18.5 9.5a6 6 0 1 1-12 0 6 6 0 0 1 12 0z" />
                          <path d="M12 15.5v6M8.5 18l3.5 3.5L15.5 18" />
                        </svg>
                      ),
                      onClick: () => {
                        setCopilotInitialPrompt("Generate 3 scroll-stopping opening hooks for my social post.");
                        setIsCopilotOpen(true);
                      },
                    },
                    {
                      key: "shorten",
                      label: "Shorten to Limit",
                      description: "Compress text to fit character limits",
                      icon: (
                        <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 24 24" width="20">
                          <path d="M4 6h16M4 10h10M4 14h7" />
                          <path d="m17 14 4 4-4 4" />
                        </svg>
                      ),
                      onClick: () => {
                        setCopilotInitialPrompt("Intelligently compress my text to fit within social media character limits while retaining the key message.");
                        setIsCopilotOpen(true);
                      },
                    },
                    {
                      key: "hashtags",
                      label: "Hashtag Ideas",
                      description: "Generate high-engagement hashtag recommendations",
                      icon: (
                        <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 24 24" width="20">
                          <line x1="4" x2="20" y1="9" y2="9" />
                          <line x1="4" x2="20" y1="15" y2="15" />
                          <line x1="10" x2="8" y1="3" y2="21" />
                          <line x1="16" x2="14" y1="3" y2="21" />
                        </svg>
                      ),
                      onClick: () => {
                        setCopilotInitialPrompt("Generate high-engagement hashtag recommendations matching the topic of this post.");
                        setIsCopilotOpen(true);
                      },
                    },
                    {
                      key: "rewrite",
                      label: "Professional Rewrite",
                      description: "Rewrite in a polished, engaging professional tone",
                      icon: (
                        <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 24 24" width="20">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      ),
                      onClick: () => {
                        setCopilotInitialPrompt("Rewrite this social post in a polished, engaging professional tone.");
                        setIsCopilotOpen(true);
                      },
                    },
                  ].map(({ key, label, description, icon, onClick }) => (
                    <button
                      key={key}
                      className="w-full bg-white rounded-2xl border border-black/5 shadow-sm p-4 text-left hover:border-[#FF5B04]/30 hover:bg-orange-50/30 transition-all group"
                      onClick={onClick}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(255,91,4,0.08)", color: "#FF5B04" }}
                        >
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold font-geist text-gray-800 group-hover:text-[#FF5B04] transition-colors">
                            {label}
                          </p>
                          <p className="text-xs font-geist text-gray-400 mt-0.5 leading-snug">
                            {description}
                          </p>
                        </div>
                        <svg
                          className="flex-shrink-0 text-gray-300 group-hover:text-[#FF5B04] transition-colors mt-1"
                          fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14"
                        >
                          <line x1="5" x2="19" y1="12" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </button>
                  ))
                ) : (
                  // ── Blog / Article quick actions ───────────────────────────
                  [
                    {
                      key: "copilot",
                      label: "AI Copilot",
                      description:
                        "Get AI suggestions and help with your content",
                      icon: (
                        <svg
                          fill="none"
                          height="20"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.75"
                          viewBox="0 0 24 24"
                          width="20"
                        >
                          <path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z" />
                        </svg>
                      ),
                      onClick: () => setIsCopilotOpen(true),
                    },
                    {
                      key: "title",
                      label: "AI Title",
                      description: "Generate compelling post titles",
                      icon: (
                        <svg
                          fill="none"
                          height="20"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.75"
                          viewBox="0 0 24 24"
                          width="20"
                        >
                          <path d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                      ),
                      onClick: () => setIsTitleModalOpen(true),
                    },
                    {
                      key: "excerpt",
                      label: "AI Excerpt",
                      description: "Auto-summarize your post content",
                      icon: (
                        <svg
                          fill="none"
                          height="20"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.75"
                          viewBox="0 0 24 24"
                          width="20"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" x2="8" y1="13" y2="13" />
                          <line x1="16" x2="8" y1="17" y2="17" />
                        </svg>
                      ),
                      onClick: () => {
                        if (!editor || editor.isEmpty) {
                          setValidationError(
                            "Please write some content first so the AI can summarize it.",
                          );

                          return;
                        }
                        setIsExcerptModalOpen(true);
                      },
                    },
                    {
                      key: "tags",
                      label: "AI Tags",
                      description: "Generate relevant tags for your post",
                      icon: (
                        <svg
                          fill="none"
                          height="20"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.75"
                          viewBox="0 0 24 24"
                          width="20"
                        >
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                          <line x1="7" x2="7.01" y1="7" y2="7" />
                        </svg>
                      ),
                      onClick: () => setIsTagsModalOpen(true),
                    },
                  ].map(({ key, label, description, icon, onClick }) => (
                    <button
                      key={key}
                      className="w-full bg-white rounded-2xl border border-black/5 shadow-sm p-4 text-left hover:border-[#FF5B04]/30 hover:bg-orange-50/30 transition-all group"
                      onClick={onClick}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: "rgba(255,91,4,0.08)",
                            color: "#FF5B04",
                          }}
                        >
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold font-geist text-gray-800 group-hover:text-[#FF5B04] transition-colors">
                            {label}
                          </p>
                          <p className="text-xs font-geist text-gray-400 mt-0.5 leading-snug">
                            {description}
                          </p>
                        </div>
                        <svg
                          className="flex-shrink-0 text-gray-300 group-hover:text-[#FF5B04] transition-colors mt-1"
                          fill="none"
                          height="14"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="14"
                        >
                          <line x1="5" x2="19" y1="12" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </button>
                  ))
                )}

                {/* Co-Pilot real-time recommendations */}
                {copilotWarnings.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-black/5 space-y-2">
                    <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest px-1">
                      Co-Pilot Alerts ({copilotWarnings.length})
                    </p>
                    {copilotWarnings.map((w) => (
                      <div
                        key={w.id}
                        className="bg-amber-50/50 border border-amber-100 rounded-xl p-3.5 space-y-1.5 shadow-sm"
                      >
                        <div className="flex items-start gap-2">
                          <CosIcon name="warning" size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-800 capitalize leading-snug">
                              {w.type} Alert
                            </p>
                            <p className="text-[11px] text-gray-500 leading-normal mt-0.5">
                              {w.message}
                            </p>
                          </div>
                        </div>
                        <div className="bg-white border border-amber-100 rounded-lg p-2 text-[10px] leading-relaxed text-amber-800">
                          <span className="font-bold">Suggestion: </span>
                          {w.suggestion}
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            className="text-[9px] font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wide"
                            type="button"
                            onClick={() => dismissWarning(w.id)}
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* ── Health Tab ── */}
            {sidebarTab === "health" && (
              <ContentHealthPanel
                bannerImage={bannerImage}
                contentHtml={editor?.getHTML() || ""}
                excerpt={excerpt}
                featuredImage={featuredImage}
                goal={contentGoal}
                postType={postType}
                seo={seoData}
                tags={tags}
                title={title}
              />
            )}

            {/* ── Distribute Tab ── */}
            {sidebarTab === "distribute" && (
              <DistributionPanel
                blogContent={editor?.getHTML() || ""}
                blogExcerpt={excerpt}
                blogId={savedBlogId || null}
                blogPublished={saveStatus === "Published"}
                blogSeo={seoData}
                blogTags={tags}
                blogTitle={title}
                contentGoal={contentGoal}
                distributionRecords={distRecords}
                postType={postType}
                socialDestination={socialDestination}
                blogRepurposedOutputs={repurposedOutputs}
                onUpdateRepurposedOutputs={setRepurposedOutputs}
                onUpdateExcerpt={setExcerpt}
                onUpdateTags={setTags}
                onUpdateSeo={setSeoData}
                onEnsureSaved={ensureSaved}
                onNavigateToSEO={() => setSidebarTab("seo")}
                onTriggerCopilotAI={(preset, prompt) => {
                  if (preset) setActivePreset(preset);
                  if (prompt) setCopilotInitialPrompt(prompt);
                  setIsCopilotOpen(true);
                }}
                onTriggerExcerptAI={() => {
                  if (!editor || editor.isEmpty) {
                    setValidationError(
                      "Please write some content first so the AI can summarize it.",
                    );

                    return;
                  }
                  setIsExcerptModalOpen(true);
                }}
                onTriggerTagsAI={() => setIsTagsModalOpen(true)}
                onUpdateRecords={(recs) => setDistRecords(recs)}
              />
            )}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <AICopilotModal
        editor={editor}
        isOpen={isCopilotOpen}
        postTitle={title}
        postType={postType}
        preset={activePreset}
        initialPrompt={copilotInitialPrompt}
        onClose={() => {
          setIsCopilotOpen(false);
          setCopilotInitialPrompt("");
        }}
      />
      {/* RepurposingDrawer is intentionally hidden for social-post — repurposing
          a social post into another social format is handled by AI Copilot instead */}
      {postType !== "social-post" && (
        <RepurposingDrawer
          isOpen={isRepurposeDrawerOpen}
          postId={savedBlogId || ""}
          onClose={() => setIsRepurposeDrawerOpen(false)}
        />
      )}
      <AIExcerptModal
        editor={editor}
        excerpt={excerpt}
        isOpen={isExcerptModalOpen}
        postTitle={title}
        postType={postType}
        setExcerpt={setExcerpt}
        onClose={() => setIsExcerptModalOpen(false)}
      />
      <AITitleModal
        editor={editor}
        isOpen={isTitleModalOpen}
        postType={postType}
        setTitle={setTitle}
        title={title}
        onClose={() => setIsTitleModalOpen(false)}
      />
      <AITagsModal
        editor={editor}
        isOpen={isTagsModalOpen}
        postTitle={title}
        postType={postType}
        setTags={setTags}
        tags={tags}
        onClose={() => setIsTagsModalOpen(false)}
      />
      {showImageUrlModal && (
        <ImageUrlModal
          editor={editor}
          onClose={() => setShowImageUrlModal(false)}
        />
      )}
      {showVideoModal && (
        <VideoEmbedModal
          editor={editor}
          onClose={() => setShowVideoModal(false)}
        />
      )}
      {showLinkModal && (
        <LinkModal editor={editor} onClose={() => setShowLinkModal(false)} />
      )}

      {validationError && (
        <AlertModal
          message={validationError}
          title="Attention Required"
          onClose={() => setValidationError(null)}
        />
      )}

      <PublishConfirmModal
        blogData={{ title, bannerImage, excerpt, tags }}
        isOpen={showPublishModal}
        isSaving={isSaving}
        isSuccess={modalSuccess === "publish"}
        onClose={() => {
          if (!isSaving) {
            setShowPublishModal(false);
            setModalSuccess(null);
          }
        }}
        onConfirm={() => saveBlog(true)}
        onKeepEditing={() => {
          // After creating a post, redirect to its edit page so the user can keep editing
          if (savedBlogId) {
            router.push(getHref(`/posts/edit/${savedBlogId}`));
          } else {
            setShowPublishModal(false);
            setModalSuccess(null);
          }
        }}
        onViewBlogs={() => router.push(getHref("/posts"))}
      />

      <SaveDraftModal
        blogData={{ title, excerpt }}
        isOpen={showSaveModal}
        isSaving={isSaving}
        isSuccess={modalSuccess === "draft"}
        onClose={() => {
          if (!isSaving) {
            setShowSaveModal(false);
            setModalSuccess(null);
          }
        }}
        onConfirm={() => saveBlog(false)}
        onKeepEditing={() => {
          // After creating a draft, redirect to its edit page
          if (savedBlogId) {
            router.push(getHref(`/posts/edit/${savedBlogId}`));
          } else {
            setShowSaveModal(false);
            setModalSuccess(null);
          }
        }}
        onViewBlogs={() => router.push(getHref("/posts"))}
      />

      {/* Navigation guard modal */}
      {showUnsavedModal && (
        <UnsavedChangesModal
          onLeave={() => {
            setIsDirty(false);
            setShowUnsavedModal(false);
            if (pendingNavIsBack.current) {
              // We pushed a sentinel state, so we need to go back twice to actually leave
              window.history.go(-2);
            } else if (pendingNavHref.current) {
              router.push(pendingNavHref.current);
            } else {
              router.push(getHref("/posts"));
            }
          }}
          onStay={() => setShowUnsavedModal(false)}
        />
      )}

      <SEOEditorModal
        data={seoData}
        isOpen={showSEOModal}
        postContent={editor?.getHTML() || ""}
        postTitle={title}
        postType={postType}
        slug={currentSlug}
        onApply={(newData: any, newSlug: string) => {
          setSeoData(newData);
          setCurrentSlug(newSlug);
          setIsSlugManual(true);
          setIsDirty(true);
        }}
        onClose={() => setShowSEOModal(false)}
      />
      {/* ── Styles ── */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .notion-editor-wrapper .ProseMirror {
          position: relative;
          outline: none;
          min-height: 500px;
        }

        .notion-editor-wrapper .ProseMirror > * {
          position: relative;
          margin-bottom: 0.25rem;
        }

        .notion-editor-wrapper .ProseMirror > *:hover {
          background-color: rgba(0, 0, 0, 0.02);
          border-radius: 4px;
        }

        .notion-editor-wrapper .ProseMirror p.is-editor-empty::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .notion-editor-wrapper .ProseMirror p {
          line-height: 1.75;
          font-size: 1rem;
          color: #374151;
          margin: 0.5rem 0;
        }

        .notion-editor-wrapper .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 1.5rem auto;
          display: block;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .notion-editor-wrapper .ProseMirror hr {
          border: none;
          border-top: 2px solid rgba(0,0,0,0.08);
          margin: 2rem 0;
          border-radius: 4px;
        }

        .notion-editor-wrapper .ProseMirror ul,
        .notion-editor-wrapper .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 1rem 0;
        }

        .notion-editor-wrapper .ProseMirror li {
          margin: 0.5rem 0;
          line-height: 1.75;
        }

        .notion-editor-wrapper .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding-left: 0;
        }

        .notion-editor-wrapper .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .notion-editor-wrapper .ProseMirror ul[data-type="taskList"] li > label {
          flex: 0 0 auto;
          margin-top: 0.25rem;
          user-select: none;
        }

        .notion-editor-wrapper .ProseMirror ul[data-type="taskList"] li > label input {
          width: 1.25rem;
          height: 1.25rem;
          cursor: pointer;
        }

        .notion-editor-wrapper .ProseMirror ul[data-type="taskList"] li > div {
          flex: 1 1 auto;
        }

        .notion-editor-wrapper .ProseMirror blockquote {
          border-left: 3px solid #FF5B04;
          padding-left: 1.25rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          color: #6b7280;
          font-style: italic;
          margin: 1.5rem 0;
          background-color: rgba(255, 91, 4, 0.04);
          border-radius: 0 8px 8px 0;
        }

        .notion-editor-wrapper .ProseMirror code {
          background-color: #f3f4f6;
          border-radius: 6px;
          padding: 0.25rem 0.5rem;
          font-size: 0.9em;
          font-family: "Fira Code", monospace;
          color: #e11d48;
        }

        .notion-editor-wrapper .ProseMirror pre {
          background-color: #1e293b;
          color: #f1f5f9;
          border-radius: 12px;
          padding: 1.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
          border: 1px solid #334155;
        }

        .notion-editor-wrapper .ProseMirror pre code {
          background: none;
          color: inherit;
          padding: 0;
        }

        .notion-editor-wrapper .ProseMirror mark {
          background-color: #fef3c7;
          border-radius: 3px;
          padding: 0.125rem 0.25rem;
        }

        .notion-editor-wrapper .ProseMirror h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #111827;
          line-height: 1.2;
        }

        .notion-editor-wrapper .ProseMirror h2 {
          font-size: 1.875rem;
          font-weight: 600;
          margin-top: 1.75rem;
          margin-bottom: 0.875rem;
          color: #1f2937;
          line-height: 1.3;
        }

        .notion-editor-wrapper .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #374151;
          line-height: 1.4;
        }

        /* Video embed styles */
        .video-embed-wrapper {
          margin: 1.5rem 0;
        }

        .video-embed-ratio {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          border-radius: 12px;
          overflow: hidden;
          background: #000;
        }

        .video-embed-ratio iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 12px;
        }

        /* Table Styles inside Editor */
        .notion-editor-wrapper .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1.5rem 0;
          overflow: hidden;
        }
        .notion-editor-wrapper .ProseMirror td,
        .notion-editor-wrapper .ProseMirror th {
          min-width: 1em;
          border: 1px solid #e5e5e5;
          padding: 8px 12px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .notion-editor-wrapper .ProseMirror th {
          font-weight: bold;
          text-align: left;
          background-color: #f5f5f5;
        }
        .notion-editor-wrapper .ProseMirror .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(255, 91, 4, 0.08);
          pointer-events: none;
        }
        .notion-editor-wrapper .ProseMirror .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #FF5B04;
          pointer-events: none;
        }

        /* Smooth transitions */
        .notion-editor-wrapper .ProseMirror * {
          transition: background-color 0.15s ease;
        }
      `}</style>
    </div>
  );
};

export default BlogEditor;
