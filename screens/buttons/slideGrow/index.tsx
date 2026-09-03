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
import StudioCanvas from "@/components/StudioCanvas";
import PageWrapper from "@/components/PageWrapper";
import GlobalCTA from "@/components/GlobalCTA";

export const SLIDE_GROW_COMPONENT_SOURCE = `"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type SlideGrowTheme = "silver" | "uipirate" | "dark" | "cyberpunk" | "emerald";
export type SlideGrowSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface SlideGrowButtonProps {
  startLabel?: string;
  activeLabel?: string;
  theme?: SlideGrowTheme;
  size?: SlideGrowSize;
  onComplete?: () => void;
  className?: string;
}

export function SlideGrowButton({
  startLabel = "Get Started",
  activeLabel = "Lets Grow!",
  theme = "silver",
  size = "md",
  onComplete,
  className = "",
}: SlideGrowButtonProps) {
  const [isSlid, setIsSlid] = useState(false);

  const themeConfig = {
    silver: {
      bg: "bg-[#E6E8ED]",
      border: "border-white/80",
      channel: "bg-[#0077FF]",
      text: "text-[#333333]",
      slidText: "text-white",
    },
    uipirate: {
      bg: "bg-[#1C1815]",
      border: "border-orange-500/30",
      channel: "bg-[#FF5B04]",
      text: "text-[#F5F5F5]",
      slidText: "text-white",
    },
  }[theme as "silver" | "uipirate"] || {
    bg: "bg-[#E6E8ED]",
    border: "border-white/80",
    channel: "bg-[#0077FF]",
    text: "text-[#333333]",
    slidText: "text-white",
  };

  return (
    <div
      className={\`relative inline-flex items-center select-none p-2 rounded-full \${themeConfig.bg} \${themeConfig.border} border shadow-xl \${className}\`}
    >
      <div className="relative w-[230px] h-[52px] flex items-center justify-between px-6 rounded-full overflow-hidden">
        {/* Animated Slide Channel */}
        <motion.div
          animate={{ width: isSlid ? "100%" : "0%" }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className={\`absolute left-0 top-0 bottom-0 \${themeConfig.channel} rounded-full\`}
        />

        {/* Text */}
        <span
          className={\`relative z-10 font-bold text-sm transition-colors duration-200 \${
            isSlid ? themeConfig.slidText : themeConfig.text
          }\`}
        >
          {isSlid ? activeLabel : startLabel}
        </span>

        {/* Drag / Click Slider Knob */}
        <motion.button
          type="button"
          onClick={() => {
            setIsSlid((s) => !s);
            if (!isSlid && onComplete) onComplete();
          }}
          animate={{ x: isSlid ? 0 : 0 }}
          className="relative z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer focus:outline-none"
        >
          <svg
            className={\`w-4 h-4 text-neutral-800 transition-transform duration-300 \${
              isSlid ? "rotate-180" : ""
            }\`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}`;

export default function SlideGrowScreen() {
  const [theme, setTheme] = useState<SlideGrowTheme>("silver");
  const [size, setSize] = useState<SlideGrowSize>("md");
  const [stateMode, setStateMode] = useState<SlideGrowStateMode>("interactive");
  const [interactionMode, setInteractionMode] = useState<SlideGrowInteractionMode>("both");
  const [startLabel, setStartLabel] = useState("Get Started");
  const [activeLabel, setActiveLabel] = useState("Lets Grow!");
  const [completeCount, setCompleteCount] = useState(0);
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

  const componentSourceCode = SLIDE_GROW_COMPONENT_SOURCE;

  const usageCode = `import { SlideGrowButton } from "@/components/SlideGrowButton";

export default function Example() {
  return (
    <SlideGrowButton
      startLabel="${startLabel}"
      activeLabel="${activeLabel}"
      theme="${theme}"
      size="${size}"
      onComplete={() => console.log("Slide unlocked!")}
    />
  );
}`;

  const cssOnlyCode = `/* Slide Grow Design System Tokens */
.slide-grow-chassis {
  width: 247px;
  height: 76px;
  border-radius: 48px;
  background: linear-gradient(180deg, #F0F2F5 0%, #D8DCE3 100%);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0px 8px 18px rgba(0, 0, 0, 0.08);
}

.slide-grow-channel {
  background: #0077FF;
  border-radius: 24px;
}`;

  return (
    <PageWrapper showFloatingButton={false}>
      <div className="relative overflow-hidden min-h-screen bg-[#07080B] text-white pt-6 pb-20 selection:bg-blue-500/30 selection:text-blue-200">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Header section */}
          <header className="text-center space-y-4 max-w-3xl mx-auto pt-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>Interactive Slide Action</span>
              <span className="text-gray-500">•</span>
              <span className="text-blue-400">Swipe to Unlock</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-jakarta">
              Slide to Grow <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Tactile Slider</span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              Smooth gesture swipe-to-grow slider button featuring dynamic laser channel reveal, spring damping, and physical knob transformation.
            </p>
          </header>

        {/* Live Interactive Studio / Sandbox */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
          <StudioCanvas>
              <SlideGrowButton
                startLabel={startLabel}
                activeLabel={activeLabel}
                theme={theme}
                size={size}
                stateMode={stateMode}
                interactionMode={interactionMode}
                onComplete={() => setCompleteCount((c) => c + 1)}
              />

              <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span>Completions:</span>
                <span className="text-white font-semibold">{completeCount}</span>
              </div>
          </StudioCanvas>
        </div>

        {/* Customizer */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/70 font-mono">Customizer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Resting Label</label>
              <input
                type="text"
                value={startLabel}
                onChange={(e) => setStartLabel(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Active Label</label>
              <input
                type="text"
                value={activeLabel}
                onChange={(e) => setActiveLabel(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as SlideGrowTheme)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="silver" className="bg-neutral-900">Brushed Silver (Figma 1:1)</option>
                <option value="uipirate" className="bg-neutral-900">UI Pirate Orange</option>
                <option value="dark" className="bg-neutral-900">Obsidian Slate</option>
                <option value="cyberpunk" className="bg-neutral-900">Cyberpunk Violet</option>
                <option value="emerald" className="bg-neutral-900">Emerald</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Scale</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as typeof size)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="xs" className="bg-[#151518] text-white">Extra Small</option>
                <option value="sm" className="bg-[#151518] text-white">Small</option>
                <option value="md" className="bg-[#151518] text-white">Medium</option>
                <option value="lg" className="bg-[#151518] text-white">Large</option>
                <option value="xl" className="bg-[#151518] text-white">Extra Large</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">State Preview</label>
              <select
                value={stateMode}
                onChange={(e) => setStateMode(e.target.value as SlideGrowStateMode)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="interactive" className="bg-[#151518] text-white">Interactive</option>
                <option value="standerd" className="bg-[#151518] text-white">Standard</option>
                <option value="hover" className="bg-[#151518] text-white">Hover</option>
              </select>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            ALL VARIANTS & THEMES PREVIEW CARD
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#468AFF] mb-1.5">
                <span>PRESETS &amp; VARIATIONS</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">All Variants Preview</h2>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Drag knob or click channel to trigger animated slider unlock
            </p>
          </div>

          <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Figma Metallic Silver */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Figma Silver</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-blue-400">theme=&quot;silver&quot;</span>
                </div>
                <div className="my-3 scale-90">
                  <SlideGrowButton
                    theme="silver"
                    startLabel="Get Started"
                    activeLabel="Lets Grow!"
                    size="sm"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">1:1 Figma Master design with blue illuminated channel</span>
              </div>

              {/* UI Pirate Orange */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">UI Pirate Magma</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-orange-400">theme=&quot;uipirate&quot;</span>
                </div>
                <div className="my-3 scale-90">
                  <SlideGrowButton
                    theme="uipirate"
                    startLabel="Swipe to Unlock"
                    activeLabel="Welcome!"
                    size="sm"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Signature magma orange beam channel fill</span>
              </div>

              {/* Dark Obsidian Matrix */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Dark Obsidian</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-300">theme=&quot;dark&quot;</span>
                </div>
                <div className="my-3 scale-90">
                  <SlideGrowButton
                    theme="dark"
                    startLabel="Slide To Confirm"
                    activeLabel="Confirmed"
                    size="sm"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Stealth midnight chassis with crisp white knob laser</span>
              </div>

              {/* Cyberpunk Violet */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Cyberpunk Violet</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-purple-400">theme=&quot;cyberpunk&quot;</span>
                </div>
                <div className="my-3 scale-90">
                  <SlideGrowButton
                    theme="cyberpunk"
                    startLabel="Slide to Deploy"
                    activeLabel="Deployed!"
                    size="sm"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Ultraviolet channel illumination with neon glow</span>
              </div>

              {/* Neon Emerald */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Neon Emerald</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-emerald-400">theme=&quot;emerald&quot;</span>
                </div>
                <div className="my-3 scale-90">
                  <SlideGrowButton
                    theme="emerald"
                    startLabel="Swipe Access"
                    activeLabel="Authorized"
                    size="sm"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Cyberpunk reactor green slider channel beam</span>
              </div>

              {/* Magma Flare */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Magma Flare</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-amber-400">theme=&quot;orange&quot;</span>
                </div>
                <div className="my-3 scale-90">
                  <SlideGrowButton
                    theme="orange"
                    startLabel="Pay $49"
                    activeLabel="Paid!"
                    size="sm"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Warm golden orange sliding payment checkout pill</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            QUICK INSTALLATION & DEPENDENCIES SECTION
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Installation &amp; Setup</h2>
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <p className="text-sm text-gray-300 leading-relaxed">
              Install required peer dependencies for Framer Motion spring dragging:
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 bg-black/60 border border-neutral-800 rounded-2xl px-5 py-3.5 font-mono text-xs text-emerald-400">
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
              className="text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors"
            >
              {copiedCode === activeCodeTab ? "✓ Copied to Clipboard" : "Copy Active Tab Code"}
            </button>
          </div>

          <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-neutral-800 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white font-mono">
                  {activeCodeTab === "component" ? "SlideGrowButton.tsx" : activeCodeTab === "usage" ? "Usage.tsx" : "Tokens.css"}
                </span>
                <span className="text-xs text-gray-500 font-mono">• Production Ready</span>
              </div>

              <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
                <button
                  onClick={() => setActiveCodeTab("component")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "component" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Component.tsx
                </button>
                <button
                  onClick={() => setActiveCodeTab("usage")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "usage" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Usage.tsx
                </button>
                <button
                  onClick={() => setActiveCodeTab("css")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "css" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Tokens.css
                </button>
              </div>
            </div>

            <div className="p-6 bg-[#08080C] overflow-x-auto max-h-[550px]">
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
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 bg-white/[0.02] text-gray-400 font-mono">
                    <th className="py-3.5 px-6 font-semibold">Prop</th>
                    <th className="py-3.5 px-6 font-semibold">Type</th>
                    <th className="py-3.5 px-6 font-semibold">Default</th>
                    <th className="py-3.5 px-6 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-gray-300 font-mono text-xs">
                  <tr>
                    <td className="py-3 px-6 text-blue-400 font-semibold">startLabel</td>
                    <td className="py-3 px-6 text-blue-300">string</td>
                    <td className="py-3 px-6 text-gray-400">&quot;Get Started&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Initial label displayed in resting state</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-blue-400 font-semibold">activeLabel</td>
                    <td className="py-3 px-6 text-blue-300">string</td>
                    <td className="py-3 px-6 text-gray-400">&quot;Lets Grow!&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Active label revealed when slider completes</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-blue-400 font-semibold">theme</td>
                    <td className="py-3 px-6 text-blue-300">SlideGrowTheme</td>
                    <td className="py-3 px-6 text-gray-400">&quot;silver&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Color scheme theme preset</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-blue-400 font-semibold">size</td>
                    <td className="py-3 px-6 text-blue-300">&quot;xs&quot; | &quot;sm&quot; | &quot;md&quot; | &quot;lg&quot; | &quot;xl&quot;</td>
                    <td className="py-3 px-6 text-gray-400">&quot;md&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Scale multiplier</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-blue-400 font-semibold">onComplete</td>
                    <td className="py-3 px-6 text-blue-300">() =&gt; void</td>
                    <td className="py-3 px-6 text-gray-400">undefined</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Callback fired when slider is pulled to completion</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Website Global CTA */}
        <GlobalCTA topic="gesture swipe sliders or interactive web controls" />
      </div>
    </div>
  </PageWrapper>
  );
}
