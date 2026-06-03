"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import CosIcon from "./CosIcon";

export interface TutorialSlide {
  title: string;
  desc: string;
  icon: string;
  badge: string;
  bg: string;
  border: string;
  textClass: string;
  bgClass: string;
  accentColor: string;
  mockup?: React.ReactNode;
}

// ─── Workspace Onboarding slides ─────────────────────────────────────────────
export const TUTORIAL_SLIDES: TutorialSlide[] = [
  {
    title: "1. Dynamic Focus Mode",
    desc: "Your workspace adapts automatically to your selected archetype. Unused tabs, formatting limits, and sidebar options are hidden to keep you fully focused on creating.",
    icon: "tasks",
    badge: "Focus Mode",
    bg: "from-orange-50/50 via-white to-amber-50/20",
    border: "border-orange-100",
    textClass: "text-[#FF5B04]",
    bgClass: "bg-[#FF5B04]/10",
    accentColor: "#FF5B04",
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
    accentColor: "#9333ea",
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
    accentColor: "#059669",
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
    accentColor: "#2563eb",
  },
];

// ─── Workspace Onboarding Carousel component ─────────────────────────────────
export default function WorkspaceTutorialCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  const progressRef = useRef(0);
  const slideRef = useRef(0);

  progressRef.current = progress;
  slideRef.current = currentSlide;

  useEffect(() => {
    progressRef.current = 0;
    setProgress(0);

    const intervalTime = 100;
    const totalTime = 6000;
    const increment = (intervalTime / totalTime) * 100;

    const timer = setInterval(() => {
      const next = progressRef.current + increment;
      if (next >= 100) {
        const nextSlide = slideRef.current === TUTORIAL_SLIDES.length - 1
          ? 0
          : slideRef.current + 1;
        progressRef.current = 0;
        setProgress(0);
        slideRef.current = nextSlide;
        setCurrentSlide(nextSlide);
      } else {
        progressRef.current = next;
        setProgress(next);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    progressRef.current = 0;
    setProgress(0);
    setCurrentSlide((prev) => (prev === 0 ? TUTORIAL_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    progressRef.current = 0;
    setProgress(0);
    setCurrentSlide((prev) => (prev === TUTORIAL_SLIDES.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (idx: number) => {
    progressRef.current = 0;
    setProgress(0);
    setCurrentSlide(idx);
  };

  const slide = TUTORIAL_SLIDES[currentSlide];

  return (
    <div className="w-full space-y-3">
      {/* Instagram Story-style progress bars */}
      <div className="flex gap-1.5 w-full">
        {TUTORIAL_SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleDotClick(idx)}
            className="h-[3px] flex-1 bg-black/[0.07] rounded-full overflow-hidden cursor-pointer"
          >
            <div
              className="h-full bg-[#FF5B04] rounded-full"
              style={{
                width: currentSlide > idx ? "100%" : currentSlide === idx ? `${progress}%` : "0%",
                transition: currentSlide === idx && progress > 0 ? "width 100ms linear" : "none",
              }}
            />
          </button>
        ))}
      </div>

      {/* Main Card */}
      <div
        className={`w-full rounded-3xl bg-gradient-to-br ${slide.bg} border ${slide.border} shadow-xl overflow-hidden`}
        style={{ "--slide-color": slide.accentColor } as React.CSSProperties}
      >
        <div className="flex flex-col md:flex-row" style={{ minHeight: 300 }}>
          {/* Left — Illustration panel */}
          <div className="w-full md:w-[44%] bg-white/60 backdrop-blur-sm border-b md:border-b-0 md:border-r border-black/[0.05] flex flex-col relative overflow-hidden select-none">
            <div className={`absolute -bottom-8 -right-8 w-48 h-48 rounded-full opacity-[0.10] blur-3xl ${slide.bgClass}`} />
            <div className="flex items-center gap-2 px-6 pt-5 pb-0">
              <span className={`text-[9px] font-black font-jetbrains-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full ${slide.bgClass} ${slide.textClass}`}>
                {slide.badge}
              </span>
              <span className="text-[9px] text-gray-300 font-jetbrains-mono">{currentSlide + 1} / {TUTORIAL_SLIDES.length}</span>
            </div>

            <motion.div
              key={`mockup-${currentSlide}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex items-center justify-center px-6 py-5"
            >
              {currentSlide === 0 && (
                <div className="w-full max-w-[260px] font-geist">
                  <div className="bg-gray-100 rounded-t-xl px-3 py-2 flex items-center gap-1.5 border border-black/[0.06]">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="flex-1 mx-2 h-4 bg-white rounded text-[8px] text-gray-300 flex items-center px-2">uipirate.com/create</span>
                  </div>
                  <div className="bg-white border border-t-0 border-black/[0.06] rounded-b-xl p-4 space-y-2.5">
                    <div className="flex items-center gap-2 pb-2 border-b border-black/[0.04]">
                      <span className="text-sm">📝</span>
                      <span className="text-[11px] font-bold text-gray-700">Writing Draft...</span>
                      <span className="ml-auto text-[9px] font-jetbrains-mono text-[#FF5B04] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">Blog Post</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="w-full h-2 bg-gray-100 rounded-full" />
                      <div className="w-4/5 h-2 bg-gray-100 rounded-full" />
                      <div className="w-2/3 h-2 bg-gray-100 rounded-full" />
                    </div>
                    <div className="flex items-center text-[10px] text-gray-400">
                      <span>Start with a compelling hook...</span>
                      <span className="w-0.5 h-3.5 ml-0.5 bg-[#FF5B04] animate-pulse rounded-full" />
                    </div>
                    <div className="flex gap-2 mt-1">
                      <div className="flex-1 h-6 bg-orange-50 rounded-lg border border-orange-100 flex items-center px-2">
                        <span className="text-[8px] font-bold text-[#FF5B04]">AI Copilot</span>
                      </div>
                      <div className="flex-1 h-6 bg-gray-50 rounded-lg border border-black/[0.04] flex items-center px-2">
                        <span className="text-[8px] text-gray-400">SEO Health</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentSlide === 1 && (
                <div className="w-full max-w-[260px] font-geist">
                  <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-black/[0.04]">
                      <span className="text-sm">🧠</span>
                      <span className="text-[11px] font-bold text-gray-700">Brand Brain Active</span>
                      <span className="ml-auto w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">✓ Target Keywords</span>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">SaaS</span>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Design</span>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">AI Tools</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider block mb-1.5">✗ Forbidden</span>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 line-through opacity-60">Synergy</span>
                        <span className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 line-through opacity-60">Disrupt</span>
                      </div>
                    </div>
                    <div className="text-[8px] text-purple-500 bg-purple-50 px-2.5 py-1.5 rounded-lg border border-purple-100 font-semibold">
                      🎯 Injected into AI Copilot automatically
                    </div>
                  </div>
                </div>
              )}

              {currentSlide === 2 && (
                <div className="w-full max-w-[260px] font-geist">
                  <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm space-y-3">
                    <div className="flex items-center gap-3 pb-3 border-b border-black/[0.04]">
                      <div className="relative w-14 h-14 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <circle strokeWidth="3.5" stroke="#f3f4f6" fill="none" cx="18" cy="18" r="15" />
                          <circle className="text-emerald-500" strokeWidth="3.5" strokeDasharray="94 100" strokeDashoffset="0" strokeLinecap="round" stroke="currentColor" fill="none" cx="18" cy="18" r="15" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-[13px] font-black text-gray-800 font-jetbrains-mono">94</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-gray-800">Content Health</div>
                        <div className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full mt-1 inline-block">Excellent</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: "Keyword Density", pct: 82, color: "bg-emerald-400" },
                        { label: "Readability", pct: 95, color: "bg-blue-400" },
                        { label: "Content Depth", pct: 70, color: "bg-orange-400" },
                      ].map((m) => (
                        <div key={m.label} className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[8.5px] text-gray-500">{m.label}</span>
                            <span className="text-[8.5px] font-bold text-gray-700 font-jetbrains-mono">{m.pct}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentSlide === 3 && (
                <div className="w-full max-w-[260px] font-geist">
                  <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-black/[0.04]">
                      <span className="text-sm">🔁</span>
                      <span className="text-[11px] font-bold text-gray-700">Repurpose</span>
                      <span className="ml-auto text-[9px] font-jetbrains-mono text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">3 channels</span>
                    </div>
                    {[
                      { icon: "🔗", label: "LinkedIn Post", pct: 14, color: "bg-blue-400", chars: "420/3000" },
                      { icon: "✦", label: "X/Twitter Thread", pct: 72, color: "bg-sky-400", chars: "201/280" },
                      { icon: "📧", label: "Newsletter", pct: 38, color: "bg-purple-400", chars: "890/2500" },
                    ].map((ch) => (
                      <div key={ch.label} className="space-y-1">
                        <div className="flex items-center justify-between text-[8.5px] text-gray-600">
                          <span className="flex items-center gap-1">{ch.icon} {ch.label}</span>
                          <span className="text-gray-400 font-jetbrains-mono">{ch.chars}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${ch.color} rounded-full`} style={{ width: `${ch.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right — Text & Navigation */}
          <motion.div
            key={`text-${currentSlide}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col p-7"
          >
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${slide.bgClass} ${slide.textClass} shadow-sm`}>
                <CosIcon name={slide.icon} size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-[21px] font-extrabold text-gray-900 font-geist leading-snug">
                  {slide.title}
                </h3>
                <p className="text-[13px] text-gray-500 leading-relaxed font-geist">
                  {slide.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-5 border-t border-black/[0.05] mt-5">
              <button
                type="button"
                onClick={handlePrev}
                className="w-9 h-9 rounded-xl flex items-center justify-center border border-black/[0.08] bg-white text-gray-500 hover:text-gray-900 hover:border-black/20 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer text-base font-bold"
              >
                ←
              </button>

              <div className="flex items-center gap-1.5">
                {TUTORIAL_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDotClick(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === idx ? "w-6" : "w-1.5 bg-black/10 hover:bg-black/20"
                    }`}
                    style={currentSlide === idx ? { backgroundColor: "var(--slide-color)" } : {}}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-9 h-9 rounded-xl flex items-center justify-center border border-black/[0.08] bg-white text-gray-500 hover:text-gray-900 hover:border-black/20 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer text-base font-bold"
              >
                →
              </button>

              <span className="ml-auto text-[10px] font-jetbrains-mono text-gray-300">
                {currentSlide + 1} / {TUTORIAL_SLIDES.length}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── Help / Tool-Specific Slides Database ─────────────────────────────────────
export const HELP_TAB_SLIDES: Record<string, TutorialSlide[]> = {
  ai: [
    {
      title: "1. Contextual Writing Partner",
      desc: "Chat with AI to draft articles, outline ideas, or continue writing sections of your editor content seamlessly.",
      icon: "chat",
      badge: "Co-pilot",
      bg: "from-orange-50/50 via-white to-amber-50/20",
      border: "border-orange-100",
      textClass: "text-[#FF5B04]",
      bgClass: "bg-[#FF5B04]/10",
      accentColor: "#FF5B04",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 space-y-2.5 font-geist w-full max-w-[240px]">
          <div className="flex gap-2">
            <span className="w-5 h-5 rounded-md bg-[#FF5B04]/10 text-[#FF5B04] flex items-center justify-center text-[10px] font-bold">AI</span>
            <div className="flex-1 bg-gray-50 border border-black/5 rounded-lg p-2 text-[9px] text-gray-500 leading-snug">
              Drafting a strong introductory paragraph...
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2. Dynamic Suggestion Chips",
      desc: "Tap tailored suggestion prompts generated in real-time based on your specific archetype, target tone, and goal.",
      icon: "sparkles",
      badge: "Suggestions",
      bg: "from-orange-50/50 via-white to-amber-50/20",
      border: "border-orange-100",
      textClass: "text-[#FF5B04]",
      bgClass: "bg-[#FF5B04]/10",
      accentColor: "#FF5B04",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 space-y-2.5 font-geist w-full max-w-[240px]">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Suggested Prompts</p>
          <div className="flex flex-wrap gap-1">
            <span className="text-[9px] text-[#FF5B04] bg-orange-50 border border-orange-100 rounded-full px-2 py-0.5 font-semibold">Write a hook</span>
            <span className="text-[9px] text-gray-500 bg-gray-50 border border-black/5 rounded-full px-2 py-0.5">Add industry stats</span>
          </div>
        </div>
      ),
    },
    {
      title: "3. Multi-Engine Access",
      desc: "Instantly switch between leading model providers (like Gemini, ChatGPT, Puter) using the engine switcher pill.",
      icon: "bolt",
      badge: "Engines",
      bg: "from-orange-50/50 via-white to-amber-50/20",
      border: "border-orange-100",
      textClass: "text-[#FF5B04]",
      bgClass: "bg-[#FF5B04]/10",
      accentColor: "#FF5B04",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 space-y-2 font-geist w-full max-w-[240px]">
          <div className="flex items-center gap-1.5 p-1.5 bg-black/[0.02] border border-black/5 rounded-lg">
            <span className="text-xs">🤖</span>
            <span className="text-[10px] font-bold text-gray-700">Gemini 1.5 Pro</span>
          </div>
        </div>
      ),
    },
  ],
  history: [
    {
      title: "1. Session logs tracking",
      desc: "View all AI-generated texts from your active session, arranged chronologically so you never lose previous variations.",
      icon: "list",
      badge: "Browse",
      bg: "from-purple-50/50 via-white to-indigo-50/20",
      border: "border-purple-100",
      textClass: "text-purple-600",
      bgClass: "bg-purple-50",
      accentColor: "#9333ea",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 space-y-2 font-geist w-full max-w-[240px]">
          <div className="border-l-2 border-purple-500 pl-2 py-0.5 space-y-1">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Generated 10m ago</p>
            <p className="text-[9px] text-gray-500 line-clamp-2">Here are 3 tips to boost Next.js performance...</p>
          </div>
        </div>
      ),
    },
    {
      title: "2. Direct insertion",
      desc: "Re-insert or replace text blocks in your editor using the historic generation logs in a single click.",
      icon: "check",
      badge: "Apply",
      bg: "from-purple-50/50 via-white to-indigo-50/20",
      border: "border-purple-100",
      textClass: "text-purple-600",
      bgClass: "bg-purple-50",
      accentColor: "#9333ea",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 flex justify-center font-geist w-full max-w-[240px]">
          <button className="h-7 px-3 bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200/50 rounded-lg text-[9px] font-bold flex items-center gap-1">
            Apply to Editor
          </button>
        </div>
      ),
    },
  ],
  snippets: [
    {
      title: "1. Save key outputs",
      desc: "Save and bookmark custom generated definitions, headings, or outline summaries by clicking the heart icon on any message.",
      icon: "heart",
      badge: "Bookmarks",
      bg: "from-pink-50/50 via-white to-red-50/20",
      border: "border-pink-100",
      textClass: "text-pink-600",
      bgClass: "bg-pink-50",
      accentColor: "#ec4899",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 font-geist w-full max-w-[240px]">
          <div className="flex justify-between items-center bg-pink-50/30 border border-pink-100/50 p-2 rounded-lg">
            <span className="text-[9px] text-gray-600 truncate">"Newsletter CTA template"</span>
            <span className="text-[10px] text-pink-500">❤️</span>
          </div>
        </div>
      ),
    },
    {
      title: "2. Fast reuse",
      desc: "Tap saved items from your personal snippet library to drop them instantly anywhere inside the text editor.",
      icon: "sparkles",
      badge: "Reuse",
      bg: "from-pink-50/50 via-white to-red-50/20",
      border: "border-pink-100",
      textClass: "text-pink-600",
      bgClass: "bg-pink-50",
      accentColor: "#ec4899",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 font-geist w-full max-w-[240px]">
          <div className="p-2 border border-black/5 hover:border-pink-200 rounded-lg bg-white flex items-center justify-between cursor-pointer shadow-sm">
            <span className="text-[9px] font-bold text-gray-700">Snippet: Newsletter CTA</span>
            <span className="text-[8px] text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded font-bold">Insert</span>
          </div>
        </div>
      ),
    },
  ],
  rewrite: [
    {
      title: "1. Text selection active state",
      desc: "Select a word, sentence, or paragraph in the core editor first to activate the Quick suggestions panel.",
      icon: "edit",
      badge: "Selection",
      bg: "from-amber-50/50 via-white to-orange-50/20",
      border: "border-amber-100",
      textClass: "text-amber-600",
      bgClass: "bg-amber-50",
      accentColor: "#d97706",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 font-geist w-full max-w-[240px]">
          <div className="bg-amber-50/40 p-2.5 rounded-lg border border-amber-100/50 text-[9px] text-gray-600 leading-snug">
            <span className="bg-amber-200/50 px-1.5 py-0.5 rounded font-bold text-gray-800">Highlight this paragraph</span> to rewrite or expand.
          </div>
        </div>
      ),
    },
    {
      title: "2. Brand tone directives",
      desc: "Choose from pre-set actions (Improve flow, shorten, expand) or select custom tone voices (Professional, Conversational, Technical, Bold).",
      icon: "briefcase",
      badge: "Tone Presets",
      bg: "from-amber-50/50 via-white to-orange-50/20",
      border: "border-amber-100",
      textClass: "text-amber-600",
      bgClass: "bg-amber-50",
      accentColor: "#d97706",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 space-y-2 font-geist w-full max-w-[240px]">
          <div className="flex flex-wrap gap-1">
            <span className="text-[9px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 font-bold">Conversational</span>
            <span className="text-[9px] text-gray-500 bg-white border border-black/5 rounded px-2 py-0.5">Professional</span>
          </div>
        </div>
      ),
    },
    {
      title: "3. Direct overwrite",
      desc: "Tap apply to directly overwrite the highlighted text or insert the polished AI output right below it.",
      icon: "check",
      badge: "Apply",
      bg: "from-amber-50/50 via-white to-orange-50/20",
      border: "border-amber-100",
      textClass: "text-amber-600",
      bgClass: "bg-amber-50",
      accentColor: "#d97706",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 flex gap-2 font-geist w-full max-w-[240px]">
          <button className="flex-1 py-1 text-[9px] font-bold text-white bg-black rounded-lg">Replace</button>
          <button className="flex-1 py-1 text-[9px] font-semibold text-gray-600 bg-gray-50 border border-black/5 rounded-lg">Insert Below</button>
        </div>
      ),
    },
  ],
  content: [
    {
      title: "1. Real-time statistics",
      desc: "Monitor word counts, estimated read times, heading levels, and featured image parameters in real-time.",
      icon: "traffic",
      badge: "Stats",
      bg: "from-blue-50/50 via-white to-indigo-50/20",
      border: "border-blue-100",
      textClass: "text-blue-600",
      bgClass: "bg-blue-50",
      accentColor: "#2563eb",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 font-geist w-full max-w-[240px]">
          <div className="flex justify-between text-[9px] text-gray-500 font-bold border-b border-black/[0.03] pb-1.5">
            <span>Word Count: 420</span>
            <span>Read Time: 2m</span>
          </div>
        </div>
      ),
    },
    {
      title: "2. AI Title Optimizer",
      desc: "Request high-impact title variants tailored specifically to your chosen content goal (authority, traffic, conversion).",
      icon: "sparkles",
      badge: "Optimize Title",
      bg: "from-blue-50/50 via-white to-indigo-50/20",
      border: "border-blue-100",
      textClass: "text-blue-600",
      bgClass: "bg-blue-50",
      accentColor: "#2563eb",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 font-geist w-full max-w-[240px]">
          <div className="bg-blue-50/30 p-2 rounded-lg border border-blue-100/50 text-[9px] text-blue-700 font-semibold leading-snug">
            Generate high-intent Title options.
          </div>
        </div>
      ),
    },
    {
      title: "3. Tags & excerpts editor",
      desc: "Add categories and edit meta descriptive text summaries for external platform syndication pipelines.",
      icon: "list",
      badge: "Excerpts",
      bg: "from-blue-50/50 via-white to-indigo-50/20",
      border: "border-blue-100",
      textClass: "text-blue-600",
      bgClass: "bg-blue-50",
      accentColor: "#2563eb",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 font-geist w-full max-w-[240px]">
          <div className="w-full h-8 bg-gray-50 border border-black/5 rounded p-1.5 text-[9px] text-gray-400 leading-tight">
            Write tag descriptors...
          </div>
        </div>
      ),
    },
  ],
  seo: [
    {
      title: "1. Set Focus Keywords",
      desc: "Choose a target keyword phrase and monitor its density across titles, headings, and descriptions dynamically.",
      icon: "search",
      badge: "Keywords",
      bg: "from-emerald-50/50 via-white to-teal-50/20",
      border: "border-emerald-100",
      textClass: "text-emerald-600",
      bgClass: "bg-emerald-50",
      accentColor: "#059669",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 font-geist w-full max-w-[240px]">
          <div className="flex gap-1.5 items-center">
            <span className="text-[9px] font-bold text-gray-400 uppercase">Focus:</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg font-bold">react performance</span>
          </div>
        </div>
      ),
    },
    {
      title: "2. Google SERP Preview",
      desc: "See a live preview of how your article will look when search results display on Google desktop and mobile panels.",
      icon: "megaphone",
      badge: "SERP Preview",
      bg: "from-emerald-50/50 via-white to-teal-50/20",
      border: "border-emerald-100",
      textClass: "text-emerald-600",
      bgClass: "bg-emerald-50",
      accentColor: "#059669",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 font-geist w-full max-w-[240px] space-y-1">
          <p className="text-[10px] text-[#1a0dab] hover:underline font-semibold leading-tight">React Performance Tips - UI Pirate</p>
          <p className="text-[8px] text-[#006621] leading-none">uipirate.com/blogs/react-performance</p>
        </div>
      ),
    },
    {
      title: "3. Auto SEO generators",
      desc: "Generate optimized titles, descriptions, and focus keyphrases automatically using AI context models.",
      icon: "sparkles",
      badge: "Auto SEO",
      bg: "from-emerald-50/50 via-white to-teal-50/20",
      border: "border-emerald-100",
      textClass: "text-emerald-600",
      bgClass: "bg-emerald-50",
      accentColor: "#059669",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 flex justify-center font-geist w-full max-w-[240px]">
          <button className="px-3 h-7 bg-emerald-600 text-white rounded-lg text-[9px] font-bold flex items-center justify-center gap-1.5 shadow-sm">
            Generate Metadata
          </button>
        </div>
      ),
    },
  ],
  health: [
    {
      title: "1. Goal-Weighted scoring",
      desc: "Your overall quality health score shifts calculation weights based on your target marketing goals.",
      icon: "traffic",
      badge: "Weights",
      bg: "from-teal-50/50 via-white to-cyan-50/20",
      border: "border-teal-100",
      textClass: "text-teal-600",
      bgClass: "bg-teal-50",
      accentColor: "#0d9488",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 flex items-center gap-3 font-geist w-full max-w-[240px]">
          <div className="relative w-10 h-10 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle strokeWidth="3.5" stroke="#f3f4f6" fill="none" cx="18" cy="18" r="15" />
              <circle className="text-teal-500" strokeWidth="3.5" strokeDasharray="85 100" strokeDashoffset="0" strokeLinecap="round" stroke="currentColor" fill="none" cx="18" cy="18" r="15" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-gray-800">85</div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-700 leading-none">Health Score</p>
            <span className="text-[8px] text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded font-bold border border-teal-100 mt-1 inline-block">Good</span>
          </div>
        </div>
      ),
    },
    {
      title: "2. Metric breakdowns",
      desc: "Tap metric classes (Readability, SEO density, CTAs) to view detailed recommendations and tips for optimization.",
      icon: "edit",
      badge: "Breakdowns",
      bg: "from-teal-50/50 via-white to-cyan-50/20",
      border: "border-teal-100",
      textClass: "text-teal-600",
      bgClass: "bg-teal-50",
      accentColor: "#0d9488",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 space-y-1.5 font-geist w-full max-w-[240px]">
          <div className="flex justify-between text-[9px] text-gray-600 font-medium">
            <span>Readability Metric</span>
            <span className="font-bold text-teal-600">92%</span>
          </div>
          <div className="flex justify-between text-[9px] text-gray-600 font-medium border-t border-black/[0.03] pt-1">
            <span>SEO Density Metric</span>
            <span className="font-bold text-teal-600">80%</span>
          </div>
        </div>
      ),
    },
  ],
  distribute: [
    {
      title: "1. Growth chain presets",
      desc: "Select a chain preset (SEO Growth, Founder Authority) to configure the target channels and spin-offs automatically.",
      icon: "bolt",
      badge: "Presets",
      bg: "from-indigo-50/50 via-white to-blue-50/20",
      border: "border-indigo-100",
      textClass: "text-indigo-600",
      bgClass: "bg-indigo-50",
      accentColor: "#4f46e5",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 font-geist w-full max-w-[240px]">
          <div className="p-2 border border-indigo-100 bg-indigo-50/40 rounded-lg flex items-center justify-between shadow-sm">
            <span className="text-[9px] font-bold text-indigo-700">Preset: Founder Authority</span>
            <span className="text-[8px] bg-indigo-600 text-white px-2 py-0.5 rounded font-bold">Active</span>
          </div>
        </div>
      ),
    },
    {
      title: "2. Spin-offs & Repurposing",
      desc: "Run AI processes to transform finished articles into custom socials and newsletters instantly.",
      icon: "refresh",
      badge: "Spin-offs",
      bg: "from-indigo-50/50 via-white to-blue-50/20",
      border: "border-indigo-100",
      textClass: "text-indigo-600",
      bgClass: "bg-indigo-50",
      accentColor: "#4f46e5",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 font-geist w-full max-w-[240px]">
          <div className="flex justify-between items-center text-[9px] text-indigo-600 font-bold animate-pulse">
            <span>Generating LinkedIn Post...</span>
            <span>70%</span>
          </div>
        </div>
      ),
    },
    {
      title: "3. Status tracking",
      desc: "Verify publishing status, open view links, or reset channels to retry distributions on sync issues.",
      icon: "check",
      badge: "Status Logs",
      bg: "from-indigo-50/50 via-white to-blue-50/20",
      border: "border-indigo-100",
      textClass: "text-indigo-600",
      bgClass: "bg-indigo-50",
      accentColor: "#4f46e5",
      mockup: (
        <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 font-geist w-full max-w-[240px]">
          <div className="flex justify-between text-[9px] text-gray-500">
            <span className="font-bold text-gray-700">LinkedIn Direct</span>
            <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-bold">Published</span>
          </div>
        </div>
      ),
    },
  ],
};

// ─── Help / Tool-Specific Carousel component ─────────────────────────────────
export function HelpTutorialCarousel({ tab }: { tab: string }) {
  const slides = HELP_TAB_SLIDES[tab] || [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  const progressRef = useRef(0);
  const slideRef = useRef(0);

  progressRef.current = progress;
  slideRef.current = currentSlide;

  useEffect(() => {
    // Reset state on tab change or slide mismatch
    setCurrentSlide(0);
    setProgress(0);
    progressRef.current = 0;
    slideRef.current = 0;
  }, [tab]);

  useEffect(() => {
    if (slides.length === 0) return;

    progressRef.current = 0;
    setProgress(0);

    const intervalTime = 100;
    const totalTime = 6000; // 6 seconds per slide
    const increment = (intervalTime / totalTime) * 100;

    const timer = setInterval(() => {
      const next = progressRef.current + increment;
      if (next >= 100) {
        const nextSlide = slideRef.current === slides.length - 1
          ? 0
          : slideRef.current + 1;
        progressRef.current = 0;
        setProgress(0);
        slideRef.current = nextSlide;
        setCurrentSlide(nextSlide);
      } else {
        progressRef.current = next;
        setProgress(next);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [slides.length, currentSlide, tab]);

  if (slides.length === 0) return null;

  const handlePrev = () => {
    progressRef.current = 0;
    setProgress(0);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    progressRef.current = 0;
    setProgress(0);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (idx: number) => {
    progressRef.current = 0;
    setProgress(0);
    setCurrentSlide(idx);
  };

  const slide = slides[currentSlide];

  return (
    <div className="w-full space-y-3 font-geist">
      {/* Instagram Story-style progress bars */}
      <div className="flex gap-1.5 w-full">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleDotClick(idx)}
            className="h-[3px] flex-1 bg-black/[0.07] rounded-full overflow-hidden cursor-pointer"
          >
            <div
              className="h-full bg-[#FF5B04] rounded-full"
              style={{
                width: currentSlide > idx ? "100%" : currentSlide === idx ? `${progress}%` : "0%",
                transition: currentSlide === idx && progress > 0 ? "width 100ms linear" : "none",
              }}
            />
          </button>
        ))}
      </div>

      {/* Main Card */}
      <div
        className={`w-full rounded-3xl bg-gradient-to-br ${slide.bg} border ${slide.border} shadow-xl overflow-hidden`}
        style={{ "--slide-color": slide.accentColor } as React.CSSProperties}
      >
        <div className="flex flex-col md:flex-row" style={{ minHeight: 260 }}>
          {/* Left — Illustration panel */}
          <div className="w-full md:w-[40%] bg-white/60 backdrop-blur-sm border-b md:border-b-0 md:border-r border-black/[0.05] flex flex-col relative overflow-hidden select-none">
            <div className={`absolute -bottom-8 -right-8 w-48 h-48 rounded-full opacity-[0.10] blur-3xl ${slide.bgClass}`} />
            <div className="flex items-center gap-2 px-6 pt-5 pb-0">
              <span className={`text-[9px] font-black font-jetbrains-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full ${slide.bgClass} ${slide.textClass}`}>
                {slide.badge}
              </span>
              <span className="text-[9px] text-gray-300 font-jetbrains-mono">{currentSlide + 1} / {slides.length}</span>
            </div>

            <motion.div
              key={`mockup-${currentSlide}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex items-center justify-center px-6 py-5"
            >
              {slide.mockup}
            </motion.div>
          </div>

          {/* Right — Text & Navigation */}
          <motion.div
            key={`text-${currentSlide}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col p-6"
          >
            <div className="flex-1 flex flex-col justify-center space-y-3">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${slide.bgClass} ${slide.textClass} shadow-sm`}>
                <CosIcon name={slide.icon} size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-gray-900 font-geist leading-snug">
                  {slide.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-geist">
                  {slide.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-black/[0.05] mt-4">
              <button
                type="button"
                onClick={handlePrev}
                className="w-8 h-8 rounded-xl flex items-center justify-center border border-black/[0.08] bg-white text-gray-500 hover:text-gray-900 hover:border-black/20 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer text-sm font-bold"
              >
                ←
              </button>

              <div className="flex items-center gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDotClick(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === idx ? "w-5" : "w-1.5 bg-black/10 hover:bg-black/20"
                    }`}
                    style={currentSlide === idx ? { backgroundColor: "var(--slide-color)" } : {}}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-8 h-8 rounded-xl flex items-center justify-center border border-black/[0.08] bg-white text-gray-500 hover:text-gray-900 hover:border-black/20 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer text-sm font-bold"
              >
                →
              </button>

              <span className="ml-auto text-[9px] font-jetbrains-mono text-gray-300">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
