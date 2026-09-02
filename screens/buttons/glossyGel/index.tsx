"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GlossyGelButton,
  GlossyGelTheme,
  GlossyGelSize,
  GlossyGelStateMode,
} from "@/components/GlossyGelButton";
import StudioCanvas from "@/components/StudioCanvas";
import PageWrapper from "@/components/PageWrapper";
import GlobalCTA from "@/components/GlobalCTA";

const THEME_OPTIONS: { label: string; value: GlossyGelTheme; desc: string }[] = [
  { label: "Emerald Mint (1:1 Figma)", value: "emerald-gel", desc: "Vibrant emerald green with dual specular highlight" },
  { label: "Electric Cyan", value: "cyan-gel", desc: "Radiant aqua sky blue with optical refraction depth" },
  { label: "Cyber Violet", value: "violet-gel", desc: "Ultra-saturated electric purple with ultraviolet undertone" },
  { label: "Magma Amber", value: "magma-gel", desc: "Deep molten orange with high-intensity warm flare" },
  { label: "Silver Glass", value: "silver-glass", desc: "Frosted titanium chrome with icy transparent rim" },
  { label: "Obsidian Glass", value: "obsidian-glass", desc: "Smoky midnight black crystal with crisp rim reflection" },
];

const TEXT_COLOR_OPTIONS = [
  { label: "Obsidian Deep", value: "#072B1F" },
  { label: "Pure White", value: "#FFFFFF" },
  { label: "Dark Charcoal", value: "#1E293B" },
  { label: "Electric Cyan", value: "#082F49" },
  { label: "Cyber Violet", value: "#2E1065" },
  { label: "Magma Orange", value: "#431407" },
  { label: "Neon Gold", value: "#FEF08A" },
];

export default function GlossyGelButtonScreen() {
  const [label, setLabel] = useState("Get Started");
  const [theme, setTheme] = useState<GlossyGelTheme>("emerald-gel");
  const [textColor, setTextColor] = useState("#072B1F");
  const [size, setSize] = useState<GlossyGelSize>("md");
  const [stateMode, setStateMode] = useState<GlossyGelStateMode>("interactive");
  const [isLoading, setIsLoading] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"component" | "usage" | "css">("component");
  const [clickCount, setClickCount] = useState(0);
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

import React from "react";
import { motion } from "framer-motion";

export type GlossyGelTheme =
  | "emerald-gel"
  | "cyan-gel"
  | "violet-gel"
  | "magma-gel"
  | "silver-glass"
  | "obsidian-glass";

export type GlossyGelSize = "xs" | "sm" | "md" | "lg" | "xl";
export type GlossyGelStateMode = "interactive" | "resting" | "hover";

export interface GlossyGelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  theme?: GlossyGelTheme;
  textColor?: string;
  size?: GlossyGelSize;
  stateMode?: GlossyGelStateMode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export const GlossyGelButton = React.forwardRef<HTMLButtonElement, GlossyGelButtonProps>(
  (
    {
      children = "Get Started",
      theme = "emerald-gel",
      size = "md",
      iconLeft,
      iconRight,
      isLoading = false,
      className = "",
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        disabled={disabled || isLoading}
        onClick={onClick}
        className={\`relative inline-flex items-center justify-center font-bold tracking-tight rounded-full transition-shadow duration-300 \${className}\`}
        {...props}
      >
        {iconLeft && <span className="mr-2">{iconLeft}</span>}
        <span>{children}</span>
        {iconRight && <span className="ml-2">{iconRight}</span>}
      </motion.button>
    );
  }
);

GlossyGelButton.displayName = "GlossyGelButton";
export default GlossyGelButton;`;

  const usageCode = `import { GlossyGelButton } from "@/components/GlossyGelButton";

export default function Example() {
  return (
    <GlossyGelButton
      theme="${theme}"
      textColor="${textColor}"
      size="${size}"
      isLoading={${isLoading}}
      onClick={() => console.log("Clicked!")}
    >
      ${label}
    </GlossyGelButton>
  );
}`;

  const cssOnlyCode = `/* Glossy Gel Skeuomorphic Button Tokens */
.glossy-gel-button {
  background: linear-gradient(180deg, #32E49D 0%, #20C982 100%);
  color: #072B1F;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
  box-shadow:
    3px 4px 6px rgba(35, 46, 64, 0.22),
    inset 0 -7px 8px -6px rgba(76, 86, 108, 0.90),
    inset 1px 1px 2px rgba(76, 86, 108, 0.80),
    inset 0 -1px 3px rgba(255, 255, 255, 0.45);
  border-radius: 9999px;
  position: relative;
  overflow: hidden;
}

.glossy-gel-button::before {
  content: "";
  position: absolute;
  top: 3px;
  left: 8px;
  right: 8px;
  height: 44%;
  border-radius: 9999px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.85) 0%,
    rgba(235, 242, 255, 0.35) 60%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}`;

  const SparkleIcon = (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );

  return (
    <PageWrapper showFloatingButton={false}>
      <div className="relative overflow-hidden min-h-screen bg-[#0E0E10] text-gray-100 selection:bg-[#10B981] selection:text-white pt-6 pb-20">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Header section */}
          <header className="text-center space-y-4 max-w-3xl mx-auto pt-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#10E599] animate-pulse" />
              <span>1:1 Figma Fidelity (Node 2:2)</span>
              <span className="text-gray-500">•</span>
              <span className="text-[#10B981]">Skeuomorphic Gel Glass</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-jakarta">
              Glossy Gel <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">Glass Button</span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              Ultra-high gloss skeuomorphic gel glass CTA button engineered directly from Figma (Node 2:2). Multi-layer inner shadow depth, organic specular blurred highlight capsule, and crisp text drop shadow.
            </p>
          </header>

          {/* Live Interactive Studio / Sandbox */}
          <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <StudioCanvas hint={`Click to test tactile bounce · ${clickCount} click${clickCount === 1 ? "" : "s"}`}>
              <div className="flex items-center justify-center p-8">
                <GlossyGelButton
                  theme={theme}
                  textColor={textColor}
                  size={size}
                  stateMode={stateMode}
                  isLoading={isLoading}
                  iconRight={showIcon ? SparkleIcon : undefined}
                  onClick={() => setClickCount((c) => c + 1)}
                >
                  {label}
                </GlossyGelButton>
              </div>
            </StudioCanvas>
          </div>

          {/* Customizer */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white/70 font-mono">Customizer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-6 gap-y-5 text-xs">
              <div className="space-y-1.5">
                <label className="font-mono text-gray-400 uppercase tracking-wider block">
                  Button Label
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-gray-400 uppercase tracking-wider block">
                  State Preview
                </label>
                <select
                  value={stateMode}
                  onChange={(e) => setStateMode(e.target.value as GlossyGelStateMode)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono cursor-pointer"
                >
                  <option value="interactive" className="bg-[#151518] text-white">Interactive</option>
                  <option value="resting" className="bg-[#151518] text-white">Standard</option>
                  <option value="hover" className="bg-[#151518] text-white">Hover</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-gray-400 uppercase tracking-wider block">
                  Color Theme Preset
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as GlossyGelTheme)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                >
                  {THEME_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#151518] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-gray-400 uppercase tracking-wider block">
                  Text Color
                </label>
                <select
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                >
                  {TEXT_COLOR_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#151518] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-gray-400 uppercase tracking-wider block">
                  Scale
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value as GlossyGelSize)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                >
                  <option value="xs" className="bg-[#151518] text-white">Extra Small (xs)</option>
                  <option value="sm" className="bg-[#151518] text-white">Small (sm)</option>
                  <option value="md" className="bg-[#151518] text-white">Medium (md)</option>
                  <option value="lg" className="bg-[#151518] text-white">Large (lg)</option>
                  <option value="xl" className="bg-[#151518] text-white">Extra Large (xl)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-gray-400 uppercase tracking-wider block">
                  Toggles
                </label>
                <div className="flex items-center gap-3 pt-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono text-gray-300">
                    <input
                      type="checkbox"
                      checked={showIcon}
                      onChange={(e) => setShowIcon(e.target.checked)}
                      className="rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-0"
                    />
                    Sparkle Icon
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono text-gray-300">
                    <input
                      type="checkbox"
                      checked={isLoading}
                      onChange={(e) => setIsLoading(e.target.checked)}
                      className="rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-0"
                    />
                    Loading
                  </label>
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
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#10E599] mb-1.5">
                  <span>PRESETS &amp; VARIATIONS</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">All Themes &amp; Variants</h2>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Click any button to test physical spring bounce &amp; optical depth
              </p>
            </div>

            <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Emerald Mint */}
                <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[190px] transition-all hover:border-white/15">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-4">
                    <span className="text-white font-semibold">Emerald Mint Gel</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-[10px] text-emerald-400">1:1 Figma</span>
                  </div>
                  <GlossyGelButton theme="emerald-gel" size="md">
                    Get Started
                  </GlossyGelButton>
                  <span className="text-[11px] font-mono text-gray-500 mt-4">theme=&quot;emerald-gel&quot;</span>
                </div>

                {/* Electric Cyan */}
                <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[190px] transition-all hover:border-white/15">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-4">
                    <span className="text-white font-semibold">Electric Cyan</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-[10px] text-cyan-400">Cyan Sky</span>
                  </div>
                  <GlossyGelButton theme="cyan-gel" size="md">
                    Launch App
                  </GlossyGelButton>
                  <span className="text-[11px] font-mono text-gray-500 mt-4">theme=&quot;cyan-gel&quot;</span>
                </div>

                {/* Cyber Violet */}
                <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[190px] transition-all hover:border-white/15">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-4">
                    <span className="text-white font-semibold">Cyber Violet</span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-[10px] text-purple-400">Ultraviolet</span>
                  </div>
                  <GlossyGelButton theme="violet-gel" size="md">
                    Upgrade Pro
                  </GlossyGelButton>
                  <span className="text-[11px] font-mono text-gray-500 mt-4">theme=&quot;violet-gel&quot;</span>
                </div>

                {/* Magma Amber */}
                <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[190px] transition-all hover:border-white/15">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-4">
                    <span className="text-white font-semibold">Magma Amber</span>
                    <span className="px-2 py-0.5 rounded bg-orange-500/10 text-[10px] text-orange-400">Molten Flare</span>
                  </div>
                  <GlossyGelButton theme="magma-gel" size="md">
                    Start Trial
                  </GlossyGelButton>
                  <span className="text-[11px] font-mono text-gray-500 mt-4">theme=&quot;magma-gel&quot;</span>
                </div>

                {/* Silver Glass */}
                <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[190px] transition-all hover:border-white/15">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-4">
                    <span className="text-white font-semibold">Silver Glass</span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-gray-300">Frosted Chrome</span>
                  </div>
                  <GlossyGelButton theme="silver-glass" size="md">
                    Explore Docs
                  </GlossyGelButton>
                  <span className="text-[11px] font-mono text-gray-500 mt-4">theme=&quot;silver-glass&quot;</span>
                </div>

                {/* Obsidian Glass */}
                <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[190px] transition-all hover:border-white/15">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-4">
                    <span className="text-white font-semibold">Obsidian Glass</span>
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-300">Midnight Crystal</span>
                  </div>
                  <GlossyGelButton theme="obsidian-glass" size="md">
                    Enter Portal
                  </GlossyGelButton>
                  <span className="text-[11px] font-mono text-gray-500 mt-4">theme=&quot;obsidian-glass&quot;</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
            QUICK INSTALLATION & DEPENDENCIES SECTION
           ───────────────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Installation &amp; Setup</h2>
            <div className="bg-[#151518] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              <p className="text-sm text-gray-300 leading-relaxed">
                Install required peer dependencies:
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
            INTERACTIVE CODE SNIPPETS / EMBED TABS
           ───────────────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Source Code &amp; Implementation</h2>
              <button
                onClick={() =>
                  handleCopy(
                    activeCodeTab === "component"
                      ? componentSourceCode
                      : activeCodeTab === "usage"
                        ? usageCode
                        : cssOnlyCode,
                    activeCodeTab
                  )
                }
                className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono transition-colors flex items-center gap-2 cursor-pointer"
              >
                {copiedCode === activeCodeTab ? (
                  <>
                    <span className="text-emerald-400">✓</span> Copied to Clipboard
                  </>
                ) : (
                  <>
                    <span>📋</span> Copy Snippet
                  </>
                )}
              </button>
            </div>

            <div className="bg-[#151518] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
              <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs font-mono text-gray-400">
                    {activeCodeTab === "component" ? "GlossyGelButton.tsx" : activeCodeTab === "usage" ? "Usage.tsx" : "Tokens.css"}
                  </span>
                </div>

                <div className="flex bg-black/40 rounded-xl p-1 text-xs font-mono">
                  <button
                    onClick={() => setActiveCodeTab("component")}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                      activeCodeTab === "component" ? "bg-[#10B981] text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Component
                  </button>
                  <button
                    onClick={() => setActiveCodeTab("usage")}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                      activeCodeTab === "usage" ? "bg-[#10B981] text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Usage.tsx
                  </button>
                  <button
                    onClick={() => setActiveCodeTab("css")}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                      activeCodeTab === "css" ? "bg-[#10B981] text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Tokens.css
                  </button>
                </div>
              </div>

              <div className="p-6 bg-[#0B0B0D] overflow-x-auto max-h-[550px]">
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
            <div className="bg-[#151518] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
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
                      <td className="py-3 px-6 text-emerald-400 font-semibold">theme</td>
                      <td className="py-3 px-6 text-blue-300">&quot;emerald-gel&quot; | &quot;cyan-gel&quot; | &quot;violet-gel&quot; | &quot;magma-gel&quot; | &quot;silver-glass&quot; | &quot;obsidian-glass&quot;</td>
                      <td className="py-3 px-6 text-gray-400">&quot;emerald-gel&quot;</td>
                      <td className="py-3 px-6 font-sans text-gray-300">Visual skeuomorphic gel glass color theme</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-6 text-emerald-400 font-semibold">textColor</td>
                      <td className="py-3 px-6 text-blue-300">string</td>
                      <td className="py-3 px-6 text-gray-400">undefined</td>
                      <td className="py-3 px-6 font-sans text-gray-300">Optional custom text color override</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-6 text-emerald-400 font-semibold">size</td>
                      <td className="py-3 px-6 text-blue-300">&quot;xs&quot; | &quot;sm&quot; | &quot;md&quot; | &quot;lg&quot; | &quot;xl&quot;</td>
                      <td className="py-3 px-6 text-gray-400">&quot;md&quot;</td>
                      <td className="py-3 px-6 font-sans text-gray-300">Size scale multiplier preset</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-6 text-emerald-400 font-semibold">stateMode</td>
                      <td className="py-3 px-6 text-blue-300">&quot;interactive&quot; | &quot;resting&quot; | &quot;hover&quot;</td>
                      <td className="py-3 px-6 text-gray-400">&quot;interactive&quot;</td>
                      <td className="py-3 px-6 font-sans text-gray-300">Fixed state preview mode</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-6 text-emerald-400 font-semibold">isLoading</td>
                      <td className="py-3 px-6 text-blue-300">boolean</td>
                      <td className="py-3 px-6 text-gray-400">false</td>
                      <td className="py-3 px-6 font-sans text-gray-300">Displays glass spinner and disables clicks</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-6 text-emerald-400 font-semibold">iconLeft / iconRight</td>
                      <td className="py-3 px-6 text-blue-300">ReactNode</td>
                      <td className="py-3 px-6 text-gray-400">undefined</td>
                      <td className="py-3 px-6 font-sans text-gray-300">Optional leading/trailing icon element</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-6 text-emerald-400 font-semibold">onClick</td>
                      <td className="py-3 px-6 text-blue-300">() =&gt; void</td>
                      <td className="py-3 px-6 text-gray-400">undefined</td>
                      <td className="py-3 px-6 font-sans text-gray-300">Interactive click callback handler</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Website Global CTA */}
          <GlobalCTA topic="glossy gel glass buttons or skeuomorphic UI components" />
        </div>
      </div>
    </PageWrapper>
  );
}
