"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  SlideGrowButton,
  SlideGrowTheme,
  SlideGrowStateMode,
  SlideGrowInteractionMode,
  SlideGrowSize,
} from "@/components/SlideGrowButton";

export default function SlideGrowScreen() {
  const [theme, setTheme] = useState<SlideGrowTheme>("silver");
  const [size, setSize] = useState<SlideGrowSize>("md");
  const [stateMode, setStateMode] = useState<SlideGrowStateMode>("interactive");
  const [interactionMode, setInteractionMode] = useState<SlideGrowInteractionMode>("both");
  const [startLabel, setStartLabel] = useState("Get Started");
  const [activeLabel, setActiveLabel] = useState("Lets Grow!");
  const [completeCount, setCompleteCount] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"usage" | "css">("usage");

  const THEMES: { id: SlideGrowTheme; name: string; badge: string; color: string; desc: string }[] = [
    {
      id: "uipirate",
      name: "UI Pirate",
      badge: "Brand Edition",
      color: "#FF5B04",
      desc: "Electric neon UI Pirate orange glow with deep obsidian ember chassis",
    },
    {
      id: "silver",
      name: "Brushed Silver (Figma)",
      badge: "Figma 1:1",
      color: "#468AFF",
      desc: "Authentic metallic silver gradient chassis with glowing cobalt electric laser channel",
    },
    {
      id: "dark",
      name: "Obsidian Slate",
      badge: "Dark Mode",
      color: "#06B6D4",
      desc: "Deep carbon graphite chassis with glowing cyan laser beam fill",
    },
    {
      id: "cyberpunk",
      name: "Cyberpunk Violet",
      badge: "Neon Glow",
      color: "#C084FC",
      desc: "Midnight obsidian chassis with vivid ultraviolet neon beam",
    },
    {
      id: "emerald",
      name: "Bespoke Emerald",
      badge: "High Energy",
      color: "#10B981",
      desc: "Deep emerald chassis with radioactive green laser beam",
    },
    {
      id: "orange",
      name: "Pirate Orange",
      badge: "Signature",
      color: "#FF5B04",
      desc: "UI Pirate signature sunset chassis with flaming amber beam",
    },
  ];

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(tabName);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const usageCode = `import { SlideGrowButton } from "@/components/SlideGrowButton";

export default function Example() {
  return (
    <SlideGrowButton
      theme="${theme}"
      size="${size}"
      stateMode="${stateMode}"
      interactionMode="${interactionMode}"
      startLabel="${startLabel}"
      activeLabel="${activeLabel}"
      onComplete={() => console.log("Slide Grow Unlocked!")}
    />
  );
};`;

  const cssOnlyCode = `/* Capsule Slider Button Design Tokens */

/* 1. Metallic Capsule Chassis */
.slide-chassis {
  width: 247px;
  height: 76px;
  border-radius: 60px;
  border: 2px solid #FCFCFC;
  background: linear-gradient(180deg, #BCBCBC 0%, #818282 100%);
  box-shadow:
    0px 100px 40px rgba(0,0,0,0.33),
    0px 42px 17px rgba(0,0,0,0.24),
    0px 22px 9px rgba(0,0,0,0.2),
    0px 10px 10px rgba(0,0,0,0.14);
}

/* 2. Recessed Inner Track Cavity */
.slide-track {
  width: 204px;
  height: 44px;
  border-radius: 30px;
  background: rgba(0, 0, 0, 0.12);
  box-shadow: inset 0px 2px 4px rgba(0,0,0,0.35);
}

/* 3. Glowing Neon Beam Fill */
.neon-beam-channel {
  background: #FFFFFF;
  box-shadow:
    0px 0px 7px 0px #A5C0FF,
    0px 4px 44px 0px #A6ADFF,
    inset 0px 0px 10px 0px #95BEFF;
}

/* 4. Glowing Electric Blue Knob */
.glowing-knob {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 0.5px solid #42D3FF;
  background: radial-gradient(50% 50% at 50% 50%, #001AFF 0%, #1500C9 100%);
  box-shadow:
    0px 91px 76px rgba(0,20,255,0.33),
    0px 38px 32px rgba(0,20,255,0.24),
    0px 20px 17px rgba(0,20,255,0.2);
}`;

  return (
    <div className="min-h-screen bg-[#0E1117] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Link href="/buttons" className="hover:text-white transition-colors">
            Buttons
          </Link>
          <span>/</span>
          <span className="text-blue-400 font-medium">Swipe to Grow Slider</span>
          <span className="ml-2 px-2 py-0.5 text-xs font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full">
            React + Framer Drag
          </span>
        </div>

        {/* Header Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            Swipe to Grow / Slide to Unlock Slider Button
            <span className="text-sm px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-normal">
              Interactive Physics
            </span>
          </h1>
          <p className="text-neutral-400 text-base max-w-2xl">
            Sleek metallic capsule slider button with glowing electric blue draggable knob, illuminated neon channel fill, and dynamic masked text reveal.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            MAIN INTERACTIVE STAGE & PLAYGROUND
           ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Visual Stage */}
          <div
            className={`lg:col-span-8 flex flex-col items-center justify-center p-12 sm:p-24 rounded-3xl border shadow-2xl relative min-h-[460px] overflow-hidden transition-colors duration-500 ${
              theme === "dark" || theme === "cyberpunk"
                ? "bg-[#101216] border-white/10"
                : "border-white/20"
            }`}
          >
            {/* Ambient Background Canvas Gradient (Figma exact) */}
            {theme !== "dark" && theme !== "cyberpunk" && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180.85deg, rgb(185, 185, 185) 30.385%, rgb(133, 134, 134) 107.7%)",
                }}
              />
            )}

            {/* The Live Interactive Button */}
            <div className="relative z-10 flex flex-col items-center gap-6">
              <SlideGrowButton
                theme={theme}
                size={size}
                stateMode={stateMode}
                interactionMode={interactionMode}
                startLabel={startLabel}
                activeLabel={activeLabel}
                onComplete={() => setCompleteCount((c) => c + 1)}
              />

              {/* Status & Complete Counter */}
              <div
                className={`font-mono text-xs mt-6 transition-colors flex items-center gap-4 ${
                  theme === "dark" || theme === "cyberpunk" ? "text-neutral-400" : "text-neutral-800"
                }`}
              >
                <span>
                  Completions: <strong className="text-blue-500">{completeCount}</strong>
                </span>
                <span>•</span>
                <span className="text-[11px] opacity-75">
                  {stateMode === "interactive"
                    ? interactionMode === "drag"
                      ? "Swipe/Drag knob to slide"
                      : interactionMode === "click"
                      ? "Click anywhere to toggle"
                      : interactionMode === "hover"
                      ? "Hover to trigger slide"
                      : "Drag knob or click to toggle"
                    : `Fixed state: ${stateMode.toUpperCase()}`}
                </span>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="lg:col-span-4 space-y-6 bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="size-2 rounded-full bg-blue-400 animate-pulse" />
              Live Customizer
            </h2>

            {/* Interaction Mode Selector (Slide vs Click vs Both vs Hover) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                <span>Trigger Action</span>
                <span className="text-[10px] font-normal text-blue-400">Slide & Click</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "both", label: "Slide & Click" },
                  { id: "drag", label: "Slide Only" },
                  { id: "click", label: "Click Only" },
                  { id: "hover", label: "Hover Trigger" },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => {
                      setStateMode("interactive");
                      setInteractionMode(act.id as SlideGrowInteractionMode);
                    }}
                    className={`px-2.5 py-2 text-xs font-medium rounded-xl border transition-all ${
                      interactionMode === act.id && stateMode === "interactive"
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-md"
                        : "bg-neutral-800/60 text-neutral-400 border-neutral-700 hover:text-white"
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>

            {/* State Mode Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Fixed Figma State
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["interactive", "standerd", "slid"] as SlideGrowStateMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setStateMode(mode)}
                    className={`px-2 py-2 text-xs font-medium capitalize rounded-xl border transition-all ${
                      stateMode === mode
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-md"
                        : "bg-neutral-800/60 text-neutral-400 border-neutral-700 hover:text-white"
                    }`}
                  >
                    {mode === "standerd" ? "Resting" : mode === "slid" ? "Unlocked" : "Interactive"}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Theme Preset
              </label>
              <div className="space-y-1.5">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                      theme === t.id
                        ? "bg-neutral-800 text-white border-blue-500/80 shadow-md"
                        : "bg-neutral-800/30 text-neutral-400 border-neutral-700/50 hover:bg-neutral-800/60 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                      <span className="text-xs font-medium">{t.name}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/5">
                      {t.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Button Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["sm", "md", "lg"] as SlideGrowSize[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`px-3 py-2 text-xs font-medium uppercase rounded-xl border transition-all ${
                      size === s
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/50"
                        : "bg-neutral-800/60 text-neutral-400 border-neutral-700 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Label Inputs */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Rest Label
                </label>
                <input
                  type="text"
                  value={startLabel}
                  onChange={(e) => setStartLabel(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Active Label
                </label>
                <input
                  type="text"
                  value={activeLabel}
                  onChange={(e) => setActiveLabel(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            STATE COMPARISON GALLERY
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Component States Side-by-Side</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resting State */}
            <div className="flex flex-col items-center justify-between p-8 rounded-3xl bg-[rgba(230,230,230,0.95)] border border-white/20 shadow-xl min-h-[260px]">
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Resting State
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/10 text-neutral-700 border border-black/5">
                  Default
                </span>
              </div>
              <div className="py-8 scale-95">
                <SlideGrowButton theme="silver" size="md" stateMode="standerd" />
              </div>
              <p className="text-[11px] text-center text-neutral-600 max-w-sm">
                Resting state with knob on the left displaying a glowing white dot and &quot;Get Started&quot; label.
              </p>
            </div>

            {/* Unlocked / Slid State */}
            <div className="flex flex-col items-center justify-between p-8 rounded-3xl bg-[rgba(230,230,230,0.95)] border border-white/20 shadow-xl min-h-[260px]">
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Unlocked State
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-800 border border-blue-500/30">
                  Completed State
                </span>
              </div>
              <div className="py-8 scale-95">
                <SlideGrowButton theme="silver" size="md" stateMode="slid" />
              </div>
              <p className="text-[11px] text-center text-neutral-600 max-w-sm">
                Slid state with knob on the right displaying a forward arrow, illuminated neon channel, and glowing &quot;Lets Grow!&quot; label.
              </p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            CODE EXPORT TABS
           ───────────────────────────────────────────────────────────── */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveCodeTab("usage")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeCodeTab === "usage"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                React (Framer Motion)
              </button>
              <button
                type="button"
                onClick={() => setActiveCodeTab("css")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeCodeTab === "css"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                CSS Tokens (Figma 1:1)
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(activeCodeTab === "usage" ? usageCode : cssOnlyCode, activeCodeTab)}
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
            >
              {copiedCode === activeCodeTab ? "✓ Copied!" : "Copy Code"}
            </button>
          </div>
          <pre className="p-6 text-xs font-mono text-neutral-300 overflow-x-auto bg-[#0a0c10] leading-relaxed">
            <code>{activeCodeTab === "usage" ? usageCode : cssOnlyCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
