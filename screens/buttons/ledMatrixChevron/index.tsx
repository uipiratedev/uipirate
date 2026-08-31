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
import PageWrapper from "@/components/PageWrapper";
import GlobalCTA from "@/components/GlobalCTA";

export default function LedMatrixChevronScreen() {
  const [theme, setTheme] = useState<LedMatrixTheme>("monochrome");
  const [size, setSize] = useState<LedMatrixSize>("md");
  const [stateMode, setStateMode] = useState<LedMatrixStateMode>("interactive");
  const [interactionMode, setInteractionMode] = useState<LedMatrixInteractionMode>("hover");
  const [label, setLabel] = useState("See Plans");
  const [enableMovingLoop, setEnableMovingLoop] = useState(true);
  const [stepSpeedMs, setStepSpeedMs] = useState(110);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"component" | "usage" | "css">("component");
  const [copiedInstall, setCopiedInstall] = useState(false);

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(tabName);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCopyInstall = () => {
    navigator.clipboard.writeText("npm install framer-motion clsx");
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const componentSourceCode = `"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export type LedMatrixTheme = "uipirate" | "monochrome" | "emerald" | "cyan" | "amber" | "crimson";
export type LedMatrixSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface LedMatrixChevronButtonProps {
  label?: string;
  theme?: LedMatrixTheme;
  size?: LedMatrixSize;
  onClick?: () => void;
  className?: string;
}

export function LedMatrixChevronButton({
  label = "See Plans",
  theme = "monochrome",
  size = "md",
  onClick,
  className = "",
}: LedMatrixChevronButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 16);
    }, 110);
    return () => clearInterval(interval);
  }, []);

  const themeColors = {
    uipirate: "#FF5B04",
    monochrome: "#FFFFFF",
    emerald: "#10B981",
    cyan: "#06B6D4",
    amber: "#F59E0B",
    crimson: "#EF4444",
  }[theme];

  return (
    <div
      className={\`relative inline-flex items-center select-none p-[6px] rounded-[50px] bg-[#1a1c23] border border-white/10 \${className}\`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.button
        type="button"
        onClick={onClick}
        animate={{ y: isHovered ? -2 : 0 }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        className="relative flex items-center gap-4 px-6 py-3 rounded-[24px] bg-[#0d0e12] border border-white/10 text-white font-bold text-sm cursor-pointer overflow-hidden"
      >
        {/* Animated LED Matrix Badge */}
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((col) => (
            <div
              key={col}
              className="w-1.5 h-1.5 rounded-full transition-opacity duration-200"
              style={{
                backgroundColor: themeColors,
                opacity: (frame + col) % 3 === 0 ? 1 : 0.2,
                boxShadow: (frame + col) % 3 === 0 ? \`0 0 6px \${themeColors}\` : "none",
              }}
            />
          ))}
        </div>
        <span>{label}</span>
      </motion.button>
    </div>
  );
}`;

  const usageCode = `import { LedMatrixChevronButton } from "@/components/LedMatrixChevronButton";

export default function Example() {
  return (
    <LedMatrixChevronButton
      label="${label}"
      theme="${theme}"
      size="${size}"
      onClick={() => console.log("Plan clicked!")}
    />
  );
}`;

  const cssOnlyCode = `/* Cyberpunk LED Matrix Tokens */
.led-matrix-enclosure {
  padding: 6px;
  border-radius: 50px;
  background: #18191e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0px 0px 2px rgba(0, 0, 0, 0.8);
}

.led-matrix-cap {
  background: #0d0e12;
  border-radius: 24px;
  box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.2);
}`;

  return (
    <PageWrapper showFloatingButton={false}>
      <div className="relative overflow-hidden min-h-screen bg-[#070709] text-white pt-6 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Header section */}
          <header className="text-center space-y-4 max-w-3xl mx-auto pt-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Cyberpunk LED Hardware</span>
              <span className="text-gray-500">•</span>
              <span className="text-emerald-400">Expandable Dot Matrix</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-jakarta">
              LED Matrix Chevron <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Tactile Button</span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              Expandable phosphor LED dot-matrix chevron button featuring physical grid illumination, animated marquee shift loop, and specular bevel framing.
            </p>
          </header>

        {/* Live Interactive Studio / Sandbox */}
        <div className="bg-[#101014] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-12 sm:p-20 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden bg-gradient-to-b from-[#131318] to-[#0A0A0D]">
            <div className="relative z-10 flex flex-col items-center gap-6">
              <LedMatrixChevronButton
                label={label}
                theme={theme}
                size={size}
                stateMode={stateMode}
                interactionMode={interactionMode}
                enableMovingLoop={enableMovingLoop}
                stepSpeedMs={stepSpeedMs}
              />
            </div>
          </div>

          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 border-t border-white/10 bg-white/[0.01] text-xs">
            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as LedMatrixTheme)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="monochrome" className="bg-[#101014]">Monochrome (Figma 1:1)</option>
                <option value="uipirate" className="bg-[#101014]">UI Pirate Orange</option>
                <option value="emerald" className="bg-[#101014]">Phosphor Emerald</option>
                <option value="cyan" className="bg-[#101014]">Electric Cyan</option>
                <option value="amber" className="bg-[#101014]">Vintage Amber</option>
                <option value="crimson" className="bg-[#101014]">Cyber Crimson</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Scale</label>
              <div className="flex gap-1">
                {(["xs", "sm", "md", "lg", "xl"] as LedMatrixSize[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`flex-1 py-2 rounded-xl uppercase font-mono transition-all ${
                      size === s ? "bg-emerald-500 text-black font-bold" : "bg-white/5 text-gray-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            ALL VARIANTS & THEMES PREVIEW CARD
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#10B981] mb-1.5">
                <span>PRESETS &amp; VARIATIONS</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">All Variants Preview</h2>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Hover over buttons to expand dot matrix screen &amp; trigger cascading chevrons
            </p>
          </div>

          <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monochrome Figma */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Monochrome Figma</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-300">theme=&quot;monochrome&quot;</span>
                </div>
                <div className="my-3">
                  <LedMatrixChevronButton
                    theme="monochrome"
                    label="See Plans"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">1:1 Figma Master design with white LED grid pixels</span>
              </div>

              {/* UI Pirate Orange */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">UI Pirate Magma</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-orange-400">theme=&quot;uipirate&quot;</span>
                </div>
                <div className="my-3">
                  <LedMatrixChevronButton
                    theme="uipirate"
                    label="Get Started"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Signature magma orange LED illumination wave</span>
              </div>

              {/* Neon Emerald Matrix */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Neon Emerald</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-emerald-400">theme=&quot;emerald&quot;</span>
                </div>
                <div className="my-3">
                  <LedMatrixChevronButton
                    theme="emerald"
                    label="Deploy App"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Cyberpunk reactor green LED matrix screen</span>
              </div>

              {/* Electric Cyan */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Electric Cyan</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-cyan-400">theme=&quot;cyan&quot;</span>
                </div>
                <div className="my-3">
                  <LedMatrixChevronButton
                    theme="cyan"
                    label="Explore Tech"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Laser cyan glowing pixel chevrons</span>
              </div>

              {/* Amber Solar */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Amber Solar</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-amber-400">theme=&quot;amber&quot;</span>
                </div>
                <div className="my-3">
                  <LedMatrixChevronButton
                    theme="amber"
                    label="View Matrix"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Warm golden amber retro terminal LED display</span>
              </div>

              {/* Crimson Laser */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Crimson Laser</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-rose-400">theme=&quot;crimson&quot;</span>
                </div>
                <div className="my-3">
                  <LedMatrixChevronButton
                    theme="crimson"
                    label="Execute"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">High-intensity ruby red cascading chevron pulse</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            QUICK INSTALLATION & DEPENDENCIES SECTION
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Installation &amp; Setup</h2>
          <div className="bg-[#101014] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <p className="text-sm text-gray-300 leading-relaxed">
              Install required peer dependencies for animation support:
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 bg-black/60 border border-white/10 rounded-2xl px-5 py-3.5 font-mono text-xs text-emerald-400">
              <span>npm install framer-motion clsx</span>
              <button
                onClick={handleCopyInstall}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-sans transition-colors cursor-pointer"
              >
                {copiedInstall ? "Copied Command!" : "Copy Command"}
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            CODE EXPORTER TABS
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-tight">Code &amp; Integration</h2>
            <button
              onClick={() =>
                handleCopy(
                  activeCodeTab === "component" ? componentSourceCode : activeCodeTab === "usage" ? usageCode : cssOnlyCode,
                  activeCodeTab
                )
              }
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {copiedCode === activeCodeTab ? "✓ Copied to Clipboard" : "Copy Active Tab Code"}
            </button>
          </div>

          <div className="bg-[#101014] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white font-mono">
                  {activeCodeTab === "component" ? "LedMatrixChevronButton.tsx" : activeCodeTab === "usage" ? "Usage.tsx" : "Tokens.css"}
                </span>
                <span className="text-xs text-gray-500 font-mono">• Production Ready</span>
              </div>

              <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
                <button
                  onClick={() => setActiveCodeTab("component")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "component" ? "bg-emerald-500 text-black font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Component.tsx
                </button>
                <button
                  onClick={() => setActiveCodeTab("usage")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "usage" ? "bg-emerald-500 text-black font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Usage.tsx
                </button>
                <button
                  onClick={() => setActiveCodeTab("css")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "css" ? "bg-emerald-500 text-black font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Tokens.css
                </button>
              </div>
            </div>

            <div className="p-6 bg-[#08080A] overflow-x-auto max-h-[550px]">
              <pre className="text-xs sm:text-sm font-mono text-gray-300 leading-relaxed">
                <code>
                  {activeCodeTab === "component" ? componentSourceCode : activeCodeTab === "usage" ? usageCode : cssOnlyCode}
                </code>
              </pre>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            PROPS & API REFERENCE TABLE
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Component API Reference</h2>
          <div className="bg-[#101014] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-gray-400 font-mono">
                    <th className="py-3.5 px-6 font-semibold">Prop</th>
                    <th className="py-3.5 px-6 font-semibold">Type</th>
                    <th className="py-3.5 px-6 font-semibold">Default</th>
                    <th className="py-3.5 px-6 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300 font-mono text-xs">
                  <tr>
                    <td className="py-3 px-6 text-emerald-400 font-semibold">label</td>
                    <td className="py-3 px-6 text-blue-300">string</td>
                    <td className="py-3 px-6 text-gray-400">&quot;See Plans&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Text displayed on the button cap</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-emerald-400 font-semibold">theme</td>
                    <td className="py-3 px-6 text-blue-300">LedMatrixTheme</td>
                    <td className="py-3 px-6 text-gray-400">&quot;monochrome&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">LED Phosphor color theme preset</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-emerald-400 font-semibold">size</td>
                    <td className="py-3 px-6 text-blue-300">&quot;xs&quot; | &quot;sm&quot; | &quot;md&quot; | &quot;lg&quot; | &quot;xl&quot;</td>
                    <td className="py-3 px-6 text-gray-400">&quot;md&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Scale multiplier</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-emerald-400 font-semibold">onClick</td>
                    <td className="py-3 px-6 text-blue-300">() =&gt; void</td>
                    <td className="py-3 px-6 text-gray-400">undefined</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Click callback event handler</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Website Global CTA */}
        <GlobalCTA topic="LED dot-matrix buttons or custom hardware UI controls" />
      </div>
    </div>
  </PageWrapper>
  );
}
