"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  IsometricReviveButton,
  IsometricReviveTheme,
  IsometricReviveStateMode,
  IsometricReviveSize,
  ISOMETRIC_REVIVE_THEMES,
} from "@/components/IsometricReviveButton";

export default function IsometricReviveScreen() {
  const [theme, setTheme] = useState<IsometricReviveTheme>("figma");
  const [size, setSize] = useState<IsometricReviveSize>("md");
  const [stateMode, setStateMode] = useState<IsometricReviveStateMode>("interactive");
  const [labelText, setLabelText] = useState("Revive Now");
  const [showGrid, setShowGrid] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"usage" | "css" | "framer">("usage");
  const [stageThemeDark, setStageThemeDark] = useState(true);

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(tabName);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const usageCode = `import { IsometricReviveButton } from "@/components/IsometricReviveButton";

export default function Example() {
  return (
    <div className="flex items-center justify-center p-12 bg-[#1B1C20]">
      <IsometricReviveButton
        label="${labelText}"
        theme="${theme}"
        size="${size}"
        stateMode="${stateMode}"
        showGrid={${showGrid}}
        onClick={() => console.log("Revive triggered!")}
      />
    </div>
  );
}`;

  const cssOnlyCode = `/* Figma Nodes 115:5957 & 115:6002 Design Tokens */

/* 1. Isometric Canvas Projection Matrix */
.isometric-stage {
  transform: rotate(30deg) skewX(-30deg) scaleY(0.866025);
  transform-origin: center center;
}

/* 2. STANDERD State (Node 115:5957) */
.isometric-btn-standerd {
  transform: translateY(-28px);
  background: #0D1015;
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    inset 0px 1px 0px 0px rgba(255, 255, 255, 0.25),
    inset 0px 7px 15px 4px #000000,
    inset 0px 0px 0px 5px #000000;
  color: rgba(255, 255, 255, 0.35);
  text-shadow: 0px 0px 8px rgba(255, 255, 255, 0.25);
}

/* 3. HOVER State with Underglow (Node 115:6002) */
.isometric-btn-hover {
  transform: translateY(-2px);
  color: #FFFFFF;
  text-shadow: 0px 0px 10px rgba(255, 255, 255, 0.8), 0px 0px 22px rgba(255, 255, 255, 0.4);
}

.isometric-underglow-active {
  background: radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 28%, rgba(255,255,255,0.2) 55%, transparent 75%);
  filter: blur(22px);
  mix-blend-mode: screen;
}

/* 4. Amber Chevron Accent */
.isometric-chevron {
  color: #FFA000;
  filter: drop-shadow(0px 0px 6px rgba(255, 160, 0, 0.8));
}`;

  const framerCode = `// Spring physics for authentic 3D button depression
<motion.div
  animate={{
    y: isHovered ? -2 : -28,
  }}
  transition={{
    type: "spring",
    stiffness: 420,
    damping: 26,
    mass: 0.8,
  }}
  style={{
    transform: "rotate(30deg) skewX(-30deg) scaleY(0.866)",
  }}
>
  {/* Top Face and 3D Extrusion */}
</motion.div>`;

  return (
    <div className="min-h-screen bg-[#0E1015] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-amber-500 selection:text-black">
      {/* Ambient background bloom */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-amber-500/5 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Link href="/buttons" className="hover:text-white transition-colors">
              Buttons
            </Link>
            <span>/</span>
            <span className="text-amber-400 font-medium">Isometric 3D Revive Button</span>
            <span className="ml-2 px-2 py-0.5 text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full">
              Figma Nodes 115:5957 & 115:6002
            </span>
          </div>

          <Link
            href="/buttons"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 transition-colors"
          >
            ← All Buttons
          </Link>
        </div>

        {/* Header Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-400">
            <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Master Button Collection</span>
            <span className="text-neutral-600">•</span>
            <span>Isometric 30° Projection</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Isometric 3D Revive Button
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 max-w-3xl">
            Direct 1:1 implementation from the Figma Master Button Collection (nodes{" "}
            <code className="text-amber-300 font-mono text-sm bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20">
              115:5957 (STANDERD)
            </code>{" "}
            and{" "}
            <code className="text-amber-300 font-mono text-sm bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20">
              115:6002 (HOVER)
            </code>
            ). Features an authentic 30° affine isometric projection, multi-layer solid bevel extrusion, glass tray base, and blinding underglow optical diffusion on interaction.
          </p>
        </div>

        {/* ================================================================= */}
        {/* Interactive Playground Stage                                      */}
        {/* ================================================================= */}
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/70 backdrop-blur-xl overflow-hidden shadow-2xl">
          {/* Stage Top Bar */}
          <div className="px-6 py-4 border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-4 bg-neutral-900/40">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-300">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                Live Interactive Stage
              </span>
              <span className="text-neutral-700">|</span>
              <span className="text-xs text-neutral-400">
                Interactions:{" "}
                <span className="font-mono text-amber-400 font-semibold">{clickCount}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStageThemeDark(!stageThemeDark)}
                className="px-2.5 py-1 text-xs rounded-md bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 transition-colors border border-neutral-700/50"
              >
                Stage: {stageThemeDark ? "Obsidian Dark (#1B1C20)" : "Deep Slate"}
              </button>
              <button
                type="button"
                onClick={() => setShowGrid(!showGrid)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors border ${
                  showGrid
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-neutral-800/80 text-neutral-400 border-neutral-700/50"
                }`}
              >
                Isometric Grid: {showGrid ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* Playground Canvas */}
          <div
            className={`relative min-h-[440px] flex items-center justify-center p-8 transition-colors duration-500 overflow-hidden ${
              stageThemeDark ? "bg-[#1B1C20]" : "bg-[#12141A]"
            }`}
          >
            <IsometricReviveButton
              label={labelText}
              theme={theme}
              size={size}
              stateMode={stateMode}
              showGrid={showGrid}
              onClick={() => setClickCount((c) => c + 1)}
            />
          </div>

          {/* Controls Bar */}
          <div className="p-6 border-t border-neutral-800/80 bg-neutral-900/30 space-y-6">
            {/* Control Grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Mode Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  State Mode
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
                  {(["interactive", "standerd", "hover"] as IsometricReviveStateMode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setStateMode(m)}
                      className={`px-2 py-1.5 text-xs rounded font-medium transition-all ${
                        stateMode === m
                          ? "bg-amber-500 text-black font-bold shadow"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {m === "interactive"
                        ? "Interactive"
                        : m === "standerd"
                        ? "115:5957"
                        : "115:6002"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Scale Size
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
                  {(["sm", "md", "lg"] as IsometricReviveSize[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`px-2 py-1.5 text-xs rounded font-medium transition-all uppercase ${
                        size === s
                          ? "bg-neutral-700 text-white font-bold"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Label Text Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Label Text
                </label>
                <input
                  type="text"
                  value={labelText}
                  onChange={(e) => setLabelText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              {/* Theme Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Color Preset
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as IsometricReviveTheme)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500 font-medium"
                >
                  {Object.entries(ISOMETRIC_REVIVE_THEMES).map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* Side-by-Side 1:1 Figma Design Comparison                         */}
        {/* ================================================================= */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>Figma Reference States</span>
              <span className="text-xs font-mono font-normal px-2.5 py-1 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                1:1 Pixel Accuracy
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. STANDERD Card (115:5957) */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                    Figma Node 115:5957
                  </span>
                  <h3 className="text-lg font-bold text-white">STANDERD (Idle / Resting)</h3>
                </div>
                <span className="px-2 py-0.5 text-xs font-mono rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                  y: -28px (High)
                </span>
              </div>

              <div className="bg-[#1B1C20] rounded-lg p-4 flex items-center justify-center overflow-hidden min-h-[300px]">
                <IsometricReviveButton
                  label="Revive Now"
                  theme="figma"
                  size="sm"
                  stateMode="standerd"
                  showGrid={true}
                />
              </div>

              <div className="text-xs text-neutral-400 space-y-1">
                <p>• Button floats 28px elevated above the glass base tray</p>
                <p>• Typography muted at 35% opacity with subtle specular rim</p>
                <p>• Ambient clay drop shadow cast onto glass underlay</p>
                <p>• Dark obsidian solid extrusion side walls (#1C2029)</p>
              </div>
            </div>

            {/* 2. HOVER Card (115:6002) */}
            <div className="rounded-xl border border-amber-500/30 bg-neutral-950/60 p-6 space-y-4 shadow-[0_0_30px_rgba(255,160,0,0.05)]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                    Figma Node 115:6002
                  </span>
                  <h3 className="text-lg font-bold text-white">HOVER (Depressed & Illuminated)</h3>
                </div>
                <span className="px-2 py-0.5 text-xs font-mono rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  y: -2px + Glow
                </span>
              </div>

              <div className="bg-[#1B1C20] rounded-lg p-4 flex items-center justify-center overflow-hidden min-h-[300px]">
                <IsometricReviveButton
                  label="Revive Now"
                  theme="figma"
                  size="sm"
                  stateMode="hover"
                  showGrid={true}
                />
              </div>

              <div className="text-xs text-neutral-400 space-y-1">
                <p>• Button smoothly compresses down by 26px towards base</p>
                <p>• Blinding white 22px blurred neon underglow floods the glass tray</p>
                <p>• Typography lights up to full 100% bright white with bloom</p>
                <p>• Amber chevron emits vibrant glow flare and drop shadow</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* Technical Architecture & Specs                                    */}
        {/* ================================================================= */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-6 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Engineering Architecture</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
              Geometry & Optics
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-300">
            <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800 space-y-2">
              <div className="font-semibold text-amber-400 text-sm">1. True 30° Isometric Projection</div>
              <p className="text-neutral-400">
                Implemented using the affine matrix projection:
                <code className="block mt-1 p-1 bg-black/50 rounded font-mono text-neutral-300">
                  rotate(30deg) skewX(-30deg) scaleY(0.866)
                </code>
                Preserves exact vector corner radiuses and 30° isometric isometric grid axes without 3D perspective distortion.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800 space-y-2">
              <div className="font-semibold text-blue-400 text-sm">2. Multi-Faceted Solid 3D Extrusion</div>
              <p className="text-neutral-400">
                Front and lateral side walls dynamically adjust their extrusion depth as the button elevates or depresses, featuring continuous specular bevel lighting and bottom shading.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800 space-y-2">
              <div className="font-semibold text-emerald-400 text-sm">3. Multi-Tier Optical Underglow</div>
              <p className="text-neutral-400">
                Dual-layer radial neon diffusion with <code className="text-emerald-300">mix-blend-mode: screen</code> and <code className="text-emerald-300">plus-lighter</code> simulates high-intensity light reflection hitting the frosted glass sub-tray.
              </p>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* Code Snippets & Export                                            */}
        {/* ================================================================= */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-2xl">
          <div className="px-6 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
            <div className="flex items-center gap-2">
              {(["usage", "css", "framer"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveCodeTab(tab)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${
                    activeCodeTab === tab
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {tab === "usage"
                    ? "React / Next.js"
                    : tab === "css"
                    ? "Design Tokens (CSS)"
                    : "Framer Motion Physics"}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                handleCopy(
                  activeCodeTab === "usage"
                    ? usageCode
                    : activeCodeTab === "css"
                    ? cssOnlyCode
                    : framerCode,
                  activeCodeTab
                )
              }
              className="px-3 py-1 text-xs font-medium rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors border border-neutral-700"
            >
              {copiedCode === activeCodeTab ? "✓ Copied!" : "Copy Snippet"}
            </button>
          </div>

          <pre className="p-6 text-xs font-mono text-neutral-300 overflow-x-auto bg-[#0a0c10] leading-relaxed">
            {activeCodeTab === "usage"
              ? usageCode
              : activeCodeTab === "css"
              ? cssOnlyCode
              : framerCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
