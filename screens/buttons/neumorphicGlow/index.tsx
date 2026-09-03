"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  NeumorphicGlowCTA,
  NeumorphicGlowShape,
  NeumorphicGlowTheme,
  NeumorphicGlowSize,
  NeumorphicNeonPreset,
  NeumorphicGlowStateMode,
  NEON_PRESETS,
} from "@/components/NeumorphicGlowCTA";
import StudioCanvas from "@/components/StudioCanvas";
import PageWrapper from "@/components/PageWrapper";
import GlobalCTA from "@/components/GlobalCTA";

export default function NeumorphicGlowScreen() {
  const [variant, setVariant] = useState<NeumorphicGlowShape>("pill");
  const [theme, setTheme] = useState<NeumorphicGlowTheme>("default");
  const [size, setSize] = useState<NeumorphicGlowSize>("md");
  const [stateMode, setStateMode] = useState<NeumorphicGlowStateMode>("interactive");
  const [neonPreset, setNeonPreset] = useState<NeumorphicNeonPreset | "auto">("auto");
  const [labelText, setLabelText] = useState("Learn more");
  const [clickCount, setClickCount] = useState(0);
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

import React, { useState } from "react";
import { motion } from "framer-motion";

export type NeumorphicGlowShape = "pill" | "squircle";
export type NeumorphicGlowTheme = "default" | "dark" | "uipirate" | "orange" | "cyberpunk";
export type NeumorphicGlowSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface NeumorphicGlowCTAProps {
  label?: string;
  shape?: NeumorphicGlowShape;
  theme?: NeumorphicGlowTheme;
  size?: NeumorphicGlowSize;
  onClick?: () => void;
  className?: string;
}

export function NeumorphicGlowCTA({
  label = "Learn more",
  shape = "pill",
  theme = "default",
  size = "md",
  onClick,
  className = "",
}: NeumorphicGlowCTAProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const themeConfig = {
    default: {
      bg: "bg-[#E6E8ED]",
      border: "border-white/80",
      text: "text-[#3D4450]",
      badgeBg: "bg-[#CBF0CD]",
      arrowColor: "#49C33E",
      badgeGlow: "rgba(73, 195, 62, 0.4)",
    },
    uipirate: {
      bg: "bg-[#181614]",
      border: "border-orange-500/20",
      text: "text-[#FAF5F0]",
      badgeBg: "bg-[#FFEDD5]",
      arrowColor: "#FF5B04",
      badgeGlow: "rgba(255, 91, 4, 0.5)",
    },
    dark: {
      bg: "bg-[#16181F]",
      border: "border-cyan-500/20",
      text: "text-[#E0F2FE]",
      badgeBg: "bg-[#C7F5F8]",
      arrowColor: "#06B6D4",
      badgeGlow: "rgba(6, 182, 212, 0.4)",
    },
  }[theme as "default" | "uipirate" | "dark"] || {
    bg: "bg-[#E6E8ED]",
    border: "border-white/80",
    text: "text-[#3D4450]",
    badgeBg: "bg-[#CBF0CD]",
    arrowColor: "#49C33E",
    badgeGlow: "rgba(73, 195, 62, 0.4)",
  };

  const rounded = shape === "pill" ? "rounded-full" : "rounded-2xl";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      animate={{
        y: isPressed ? 2 : isHovered ? -3 : 0,
        scale: isPressed ? 0.98 : 1,
      }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
      className={\`relative flex items-center justify-between gap-4 px-6 py-3.5 \${rounded} \${themeConfig.bg} \${themeConfig.border} border shadow-lg \${themeConfig.text} font-bold text-sm cursor-pointer select-none focus:outline-none \${className}\`}
    >
      <span>{label}</span>

      {/* Radiant Glowing Neon Arrow Knob */}
      <div
        className={\`relative w-8 h-8 rounded-full \${themeConfig.badgeBg} flex items-center justify-center\`}
        style={{
          boxShadow: \`0 0 12px \${themeConfig.badgeGlow}\`,
        }}
      >
        <svg
          className="w-4 h-4 transition-transform duration-300"
          style={{ color: themeConfig.arrowColor }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.button>
  );
}`;

  const usageCode = `import { NeumorphicGlowCTA } from "@/components/NeumorphicGlowCTA";

export default function Example() {
  return (
    <NeumorphicGlowCTA
      label="${labelText}"
      shape="${variant}"
      theme="${theme}"
      size="${size}"
      onClick={() => console.log("Learn more clicked!")}
    />
  );
}`;

  const cssOnlyCode = `/* Soft Neumorphic Glow Design System Tokens */
.neumorphic-pill {
  background: #E6E8ED;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    8px 8px 16px rgba(166, 171, 189, 0.5),
    -8px -8px 16px rgba(255, 255, 255, 0.9);
}

.neon-knob-badge {
  background: #CBF0CD;
  box-shadow: 0px 0px 12px rgba(73, 195, 62, 0.4);
}`;

  return (
    <PageWrapper showFloatingButton={false}>
      <div className="relative overflow-hidden min-h-screen bg-[#07080B] text-white pt-6 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Header section */}
          <header className="text-center space-y-4 max-w-3xl mx-auto pt-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Neumorphic Clay + Neon Glow</span>
              <span className="text-gray-500">•</span>
              <span className="text-emerald-400">Tactile Micro-Interactions</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-jakarta">
              Neumorphic Glow <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Tactile CTA Button</span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              Multi-tier soft neumorphic clay button featuring dual convex lighting shadows, glowing neon arrow badge, and spring depth feedback.
            </p>
          </header>

        {/* Live Interactive Studio / Sandbox */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
          <StudioCanvas>
              <NeumorphicGlowCTA
                label={labelText}
                variant={variant}
                theme={theme}
                size={size}
                stateMode={stateMode}
                neonPreset={neonPreset === "auto" ? undefined : neonPreset}
                onClick={() => setClickCount((c) => c + 1)}
              />

              <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Interactions:</span>
                <span className="text-white font-semibold">{clickCount}</span>
              </div>
          </StudioCanvas>
        </div>

        {/* Customizer */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/70 font-mono">Customizer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Button Label</label>
              <input
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Shape</label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value as NeumorphicGlowShape)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="pill" className="bg-[#151518] text-white">Pill</option>
                <option value="squircle" className="bg-[#151518] text-white">Squircle</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as NeumorphicGlowTheme)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="default" className="bg-neutral-900">Clay Light (Figma 1:1)</option>
                <option value="uipirate" className="bg-neutral-900">UI Pirate Orange</option>
                <option value="dark" className="bg-neutral-900">Obsidian Slate</option>
                <option value="cyberpunk" className="bg-neutral-900">Cyberpunk Violet</option>
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
                onChange={(e) => setStateMode(e.target.value as NeumorphicGlowStateMode)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
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
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#10B981] mb-1.5">
                <span>PRESETS &amp; VARIATIONS</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">All Variants Preview</h2>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Hover over buttons to trigger specular clay elevation &amp; neon badge bloom
            </p>
          </div>

          <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Figma Neon Emerald Pill */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Neon Emerald Pill</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-emerald-400">neonPreset=&quot;emerald&quot;</span>
                </div>
                <div className="my-3">
                  <NeumorphicGlowCTA
                    variant="pill"
                    neonPreset="emerald"
                    label="Get Started"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">1:1 Figma Master design with glowing emerald arrow badge</span>
              </div>

              {/* UI Pirate Magma Squircle */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">UI Pirate Squircle</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-orange-400">neonPreset=&quot;uipirate&quot;</span>
                </div>
                <div className="my-3">
                  <NeumorphicGlowCTA
                    variant="squircle"
                    neonPreset="uipirate"
                    label="Explore Tools"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Signature magma orange neumorphic clay squircle</span>
              </div>

              {/* Electric Cyan Pill */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Electric Cyan Pill</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-cyan-400">neonPreset=&quot;cyan&quot;</span>
                </div>
                <div className="my-3">
                  <NeumorphicGlowCTA
                    variant="pill"
                    neonPreset="cyan"
                    label="Live Preview"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Cyan optical underglow badge with specular bevel lip</span>
              </div>

              {/* Neon Magenta Squircle */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Neon Magenta Squircle</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-pink-400">neonPreset=&quot;magenta&quot;</span>
                </div>
                <div className="my-3">
                  <NeumorphicGlowCTA
                    variant="squircle"
                    neonPreset="magenta"
                    label="Upgrade Pro"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Vivid magenta bloom badge with clay squircle chassis</span>
              </div>

              {/* Cyber Amber Pill */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Cyber Amber Pill</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-amber-400">neonPreset=&quot;amber&quot;</span>
                </div>
                <div className="my-3">
                  <NeumorphicGlowCTA
                    variant="pill"
                    neonPreset="amber"
                    label="View Matrix"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Warm golden amber indicator badge depth glow</span>
              </div>

              {/* Neon Violet Squircle */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Neon Violet Squircle</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-purple-400">neonPreset=&quot;violet&quot;</span>
                </div>
                <div className="my-3">
                  <NeumorphicGlowCTA
                    variant="squircle"
                    neonPreset="violet"
                    label="Deploy Code"
                    size="md"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Ultraviolet neon arrow badge with 3D drop shadows</span>
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
              Install required peer dependencies for Framer Motion spring physics:
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
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {copiedCode === activeCodeTab ? "✓ Copied to Clipboard" : "Copy Active Tab Code"}
            </button>
          </div>

          <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-neutral-800 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white font-mono">
                  {activeCodeTab === "component" ? "NeumorphicGlowCTA.tsx" : activeCodeTab === "usage" ? "Usage.tsx" : "Tokens.css"}
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
                    <td className="py-3 px-6 text-emerald-400 font-semibold">label</td>
                    <td className="py-3 px-6 text-blue-300">string</td>
                    <td className="py-3 px-6 text-gray-400">&quot;Learn more&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Text displayed on the button cap</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-emerald-400 font-semibold">shape</td>
                    <td className="py-3 px-6 text-blue-300">&quot;pill&quot; | &quot;squircle&quot;</td>
                    <td className="py-3 px-6 text-gray-400">&quot;pill&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Physical rounded contour geometry</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-emerald-400 font-semibold">theme</td>
                    <td className="py-3 px-6 text-blue-300">NeumorphicGlowTheme</td>
                    <td className="py-3 px-6 text-gray-400">&quot;default&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Color scheme theme preset</td>
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
        <GlobalCTA topic="neumorphic buttons or modern clay UI components" />
      </div>
    </div>
  </PageWrapper>
  );
}
