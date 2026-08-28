"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  NeumorphicGlowCTA,
  NeumorphicGlowShape,
  NeumorphicGlowTheme,
  NeumorphicGlowSize,
  NeumorphicNeonPreset,
  NEON_PRESETS,
} from "@/components/NeumorphicGlowCTA";

export default function NeumorphicGlowScreen() {
  const [variant, setVariant] = useState<NeumorphicGlowShape>("pill");
  const [theme, setTheme] = useState<NeumorphicGlowTheme>("default");
  const [size, setSize] = useState<NeumorphicGlowSize>("md");
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
export type NeumorphicGlowSize = "sm" | "md" | "lg";

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
    <div className="min-h-screen bg-[#07080B] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <Link
            href="/buttons"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 transition-colors group"
          >
            <svg className="w-4 h-4 text-gray-400 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>All Buttons</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-gray-500">
            <Link href="/ui-components" className="text-gray-400 hover:text-white transition-colors">
              UI Components
            </Link>
            <span>/</span>
            <Link href="/buttons" className="text-gray-400 hover:text-white transition-colors">
              Buttons
            </Link>
            <span>/</span>
            <span className="text-emerald-400">Neumorphic Glow</span>
          </div>
        </div>

        {/* Header section */}
        <header className="text-center space-y-4 max-w-3xl mx-auto">
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
          <div className="p-12 sm:p-20 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden bg-gradient-to-b from-[#13151D] to-[#0A0C10]">
            <div className="relative z-10 flex flex-col items-center gap-6">
              <NeumorphicGlowCTA
                label={labelText}
                variant={variant}
                theme={theme}
                size={size}
                neonPreset={neonPreset === "auto" ? undefined : neonPreset}
                onClick={() => setClickCount((c) => c + 1)}
              />

              <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Interactions:</span>
                <span className="text-white font-semibold">{clickCount}</span>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-6 border-t border-neutral-800 bg-neutral-900/40 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Shape</label>
              <div className="flex gap-1">
                {(["pill", "squircle"] as NeumorphicGlowShape[]).map((shp) => (
                  <button
                    key={shp}
                    type="button"
                    onClick={() => setVariant(shp)}
                    className={`flex-1 py-2 rounded-xl capitalize font-mono transition-all ${
                      variant === shp ? "bg-emerald-500 text-black font-bold" : "bg-neutral-800 text-gray-400"
                    }`}
                  >
                    {shp}
                  </button>
                ))}
              </div>
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
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Button Label</label>
              <input
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Scale</label>
              <div className="flex gap-1">
                {(["sm", "md", "lg"] as NeumorphicGlowSize[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`flex-1 py-2 rounded-xl uppercase font-mono transition-all ${
                      size === s ? "bg-emerald-500 text-black font-bold" : "bg-neutral-800 text-gray-400"
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
                    <td className="py-3 px-6 text-blue-300">&quot;sm&quot; | &quot;md&quot; | &quot;lg&quot;</td>
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
      </div>
    </div>
  );
}
