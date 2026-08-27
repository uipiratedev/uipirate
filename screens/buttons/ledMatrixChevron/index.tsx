"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LedMatrixChevronButton,
  LedMatrixTheme,
  LedMatrixStateMode,
  LedMatrixInteractionMode,
  LedMatrixSize,
} from "@/components/LedMatrixChevronButton";

export default function LedMatrixChevronScreen() {
  const [theme, setTheme] = useState<LedMatrixTheme>("monochrome");
  const [size, setSize] = useState<LedMatrixSize>("md");
  const [stateMode, setStateMode] = useState<LedMatrixStateMode>("interactive");
  const [interactionMode, setInteractionMode] = useState<LedMatrixInteractionMode>("hover");
  const [label, setLabel] = useState("See Plans");
  const [enableMovingLoop, setEnableMovingLoop] = useState(true);
  const [stepSpeedMs, setStepSpeedMs] = useState(110);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"usage" | "css">("usage");

  const THEMES: { id: LedMatrixTheme; name: string; badge: string; color: string; desc: string }[] = [
    {
      id: "monochrome",
      name: "Monochrome Matrix (Figma)",
      badge: "Figma 1:1",
      color: "#FFFFFF",
      desc: "Pure white phosphor LED dot matrix on carbon graphite slab with specular reflections",
    },
    {
      id: "emerald",
      name: "Cyberpunk Matrix",
      badge: "Phosphor Green",
      color: "#10B981",
      desc: "High-voltage emerald green LED dot matrix with dark terminal chassis",
    },
    {
      id: "cyan",
      name: "Cyberpunk Cyan",
      badge: "Electric Cyan",
      color: "#06B6D4",
      desc: "Electric ice-cyan LED matrix with deep slate carbon slab",
    },
    {
      id: "amber",
      name: "Retro Amber Terminal",
      badge: "Vintage CRT",
      color: "#F59E0B",
      desc: "Vintage warm amber monochrome CRT terminal pixel display",
    },
    {
      id: "crimson",
      name: "Red Alert Crimson",
      badge: "High Threat",
      color: "#EF4444",
      desc: "Emergency high-alert red phosphor LED array with obsidian chassis",
    },
  ];

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(tabName);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const usageCode = `import { LedMatrixChevronButton } from "@/components/LedMatrixChevronButton";

export default function Example() {
  return (
    <LedMatrixChevronButton
      theme="${theme}"
      size="${size}"
      label="${label}"
      stateMode="${stateMode}"
      interactionMode="${interactionMode}"
      stepSpeedMs={${stepSpeedMs}}
      enableMovingLoop={${enableMovingLoop}}
      onClick={() => console.log("LED Matrix Button Clicked!")}
    />
  );
}`;

  const cssOnlyCode = `/* Figma Nodes 19:6101 & 19:6495 Design Tokens */

/* 1. Recessed Enclosure Tray (19:6440) */
.enclosure-tray {
  background: #000000;
  border-radius: 16px;
  padding: 6px;
  box-shadow:
    0px 1.5px 0px rgba(255, 255, 255, 0.1),
    inset 0px 0px 2px 0px rgba(0, 0, 0, 0.08);
}

/* 2. Tactile Carbon-Fiber Slab (19:6441) */
.carbon-slab {
  width: 224px;
  height: 59px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.85);
  background: linear-gradient(180deg, #4A5157 0%, #2A2D30 50%, #1A1C1E 100%);
  box-shadow:
    0px 3px 3px 0px rgba(0,0,0,0.1),
    60px 50px 80px 0px rgba(0,0,0,0.15),
    20px 42px 33px 0px rgba(0,0,0,0.15),
    inset 0px -2px 0px 0px #1a1a1a,
    inset 0px 0px 2px 4px rgba(255,255,255,0.08),
    inset 0px 0px 1px 2px black;
}

/* 3. Expandable LED Dot Matrix Screen (19:6442 / 19:6562) */
.led-matrix-screen {
  background: #8C8C8C;
  border-radius: 5px;
  box-shadow: inset 0px 1px 1px 0px rgba(255, 255, 255, 0.35);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 4. 7x7 LED Pixel Dot (19:6444) */
.led-pixel {
  width: 3px;
  height: 3px;
  border-radius: 0.6px;
  background-color: #FFFFFF;
  box-shadow: 0px 0px 4px rgba(255, 255, 255, 0.6);
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
          <span className="text-emerald-400 font-medium">LED Dot Matrix Chevron</span>
          <span className="ml-2 px-2 py-0.5 text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full">
            Figma 19:6101 & 19:6495
          </span>
        </div>

        {/* Header Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            Expandable LED Dot Matrix Chevron Button
            <span className="text-sm px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-normal">
              Expanding Matrix
            </span>
          </h1>
          <p className="text-neutral-400 text-base max-w-2xl">
            Cyberpunk carbon-fiber squircle button with an expandable 7×7 LED dot matrix screen that stretches across the entire chassis on hover/click to reveal 5 cascading animated pixel chevrons.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            MAIN INTERACTIVE STAGE & PLAYGROUND
           ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Visual Stage */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center p-12 sm:p-24 rounded-3xl border border-white/10 bg-[#101012] shadow-2xl relative min-h-[460px] overflow-hidden">
            {/* Ambient Radial Spotlight (Figma 19:6812) */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.8) 70%)",
              }}
            />

            {/* The Live Interactive Button */}
            <div className="relative z-10 flex flex-col items-center gap-6">
              <LedMatrixChevronButton
                theme={theme}
                size={size}
                label={label}
                stateMode={stateMode}
                interactionMode={interactionMode}
                enableMovingLoop={enableMovingLoop}
                stepSpeedMs={stepSpeedMs}
              />

              {/* Status Note */}
              <div className="font-mono text-xs text-neutral-400 mt-6 flex items-center gap-4">
                <span>
                  Mode: <strong className="text-emerald-400">{stateMode.toUpperCase()}</strong>
                </span>
                <span>•</span>
                <span className="text-[11px] opacity-75">
                  {stateMode === "interactive"
                    ? interactionMode === "hover"
                      ? "Hover over button to expand matrix"
                      : interactionMode === "click"
                      ? "Click button to toggle expansion"
                      : "Hover or click to expand matrix"
                    : `Fixed state: ${stateMode.toUpperCase()}`}
                </span>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="lg:col-span-4 space-y-6 bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Customizer
            </h2>

            {/* State Mode Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Figma State Mode
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["interactive", "standerd", "hover"] as LedMatrixStateMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setStateMode(mode)}
                    className={`px-2 py-2 text-xs font-medium capitalize rounded-xl border transition-all ${
                      stateMode === mode
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md"
                        : "bg-neutral-800/60 text-neutral-400 border-neutral-700 hover:text-white"
                    }`}
                  >
                    {mode === "standerd" ? "Rest (19:6101)" : mode === "hover" ? "Full (19:6495)" : "Interactive"}
                  </button>
                ))}
              </div>
            </div>

            {/* Trigger Action Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Trigger Action
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "both", label: "Hover & Click" },
                  { id: "hover", label: "Hover Only" },
                  { id: "click", label: "Click Toggle" },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => {
                      setStateMode("interactive");
                      setInteractionMode(act.id as LedMatrixInteractionMode);
                    }}
                    className={`px-2 py-2 text-xs font-medium rounded-xl border transition-all ${
                      interactionMode === act.id && stateMode === "interactive"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md"
                        : "bg-neutral-800/60 text-neutral-400 border-neutral-700 hover:text-white"
                    }`}
                  >
                    {act.label}
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
                        ? "bg-neutral-800 text-white border-emerald-500/80 shadow-md"
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
                {(["sm", "md", "lg"] as LedMatrixSize[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`px-3 py-2 text-xs font-medium uppercase rounded-xl border transition-all ${
                      size === s
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                        : "bg-neutral-800/60 text-neutral-400 border-neutral-700 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Label Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Resting Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Moving Loop Switch */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <span className="text-xs text-neutral-300">Continuous Moving Loop</span>
              <button
                type="button"
                onClick={() => setEnableMovingLoop((prev) => !prev)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  enableMovingLoop ? "bg-emerald-500" : "bg-neutral-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    enableMovingLoop ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            FIGMA MASTER COMPARISON GALLERY (19:6101 vs 19:6495)
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Figma Master States Side-by-Side</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* STANDERD State 19:6101 */}
            <div className="flex flex-col items-center justify-between p-8 rounded-3xl bg-[#101012] border border-white/10 shadow-xl min-h-[260px]">
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Node 19:6101 (STANDERD)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white border border-white/10">
                  Rest State
                </span>
              </div>
              <div className="py-8 scale-95">
                <LedMatrixChevronButton theme="monochrome" size="md" stateMode="standerd" />
              </div>
              <p className="text-[11px] text-center text-neutral-400 max-w-sm">
                Resting state with 53px LED badge displaying 1 pixel chevron on the left and &quot;See Plans&quot; label on the right.
              </p>
            </div>

            {/* HOVER / EXPANDED State 19:6495 */}
            <div className="flex flex-col items-center justify-between p-8 rounded-3xl bg-[#101012] border border-white/10 shadow-xl min-h-[260px]">
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Node 19:6495 (HOVER / EXPANDED)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Expanded State
                </span>
              </div>
              <div className="py-8 scale-95">
                <LedMatrixChevronButton theme="monochrome" size="md" stateMode="hover" />
              </div>
              <p className="text-[11px] text-center text-neutral-400 max-w-sm">
                Expanded state where the LED matrix stretches across 100% width revealing 5 cascading pixel chevrons with pulse wave.
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
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
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
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
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
