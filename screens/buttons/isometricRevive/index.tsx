"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  IsometricReviveButton,
  IsometricReviveTheme,
  IsometricReviveAngle,
  IsometricGlowIntensity,
  IsometricReviveStateMode,
  IsometricReviveSize,
  ISOMETRIC_REVIVE_THEMES,
  ANGLE_TRANSFORMS,
} from "@/components/IsometricReviveButton";





import StudioCanvas from "@/components/StudioCanvas";
import PageWrapper from "@/components/PageWrapper";
import GlobalCTA from "@/components/GlobalCTA";

export const ISOMETRIC_REVIVE_COMPONENT_SOURCE = `"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type IsometricReviveTheme = "figma" | "amber" | "cyan" | "emerald" | "violet" | "crimson" | "uipirate";
export type IsometricReviveSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface IsometricReviveButtonProps {
  label?: string;
  theme?: IsometricReviveTheme;
  size?: IsometricReviveSize;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function IsometricReviveButton({
  label = "Revive Now",
  theme = "figma",
  size = "md",
  onClick,
  disabled = false,
  className = "",
}: IsometricReviveButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const scale = size === "sm" ? 0.8 : size === "lg" ? 1.2 : 1;

  return (
    <div
      className={\`relative select-none \${className}\`}
      style={{ perspective: 1000 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
    >
      <motion.button
        type="button"
        disabled={disabled}
        onClick={onClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        animate={{
          rotateX: 25,
          rotateY: -20,
          rotateZ: 10,
          y: isPressed ? 4 : isHovered ? -8 : 0,
          scale: scale * (isPressed ? 0.98 : 1),
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative px-8 py-4 rounded-2xl bg-[#0D1015] border border-white/20 text-white font-bold text-sm shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.4)] cursor-pointer focus:outline-none flex items-center gap-3"
      >
        <span className="w-2 h-2 rounded-full bg-[#FFA000] shadow-[0_0_8px_#FFA000] animate-pulse" />
        <span className="tracking-wide uppercase text-xs font-mono">{label}</span>
      </motion.button>
    </div>
  );
}`;

export const ISOMETRIC_REVIVE_PHYSICS = `// Spring Isometric Transforms
<motion.button
  animate={{
    rotateX: 25,
    rotateY: -20,
    rotateZ: 10,
    y: isPressed ? 4 : isHovered ? -8 : 0,
  }}
  transition={{
    type: "spring",
    stiffness: 400,
    damping: 25,
  }}
/>`;

export default function IsometricReviveScreen() {
  const [theme, setTheme] = useState<IsometricReviveTheme>("figma");
  const [angle, setAngle] = useState<IsometricReviveAngle>("iso-left");
  const [intensity, setIntensity] = useState<IsometricGlowIntensity>("vibrant");
  const [size, setSize] = useState<IsometricReviveSize>("md");
  const [stateMode, setStateMode] = useState<IsometricReviveStateMode>("interactive");
  const [labelText, setLabelText] = useState("Revive Now");
  const [showGrid, setShowGrid] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"component" | "usage" | "css" | "framer">("component");
  const [stageBg, setStageBg] = useState<"dark" | "charcoal" | "light">("dark");
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

  const componentSourceCode = ISOMETRIC_REVIVE_COMPONENT_SOURCE;

  const usageCode = `import { IsometricReviveButton } from "@/components/IsometricReviveButton";

export default function Example() {
  return (
    <div className="flex items-center justify-center p-12 bg-[#1B1C20]">
      <IsometricReviveButton
        label="${labelText}"
        theme="${theme}"
        size="${size}"
        onClick={() => console.log("Revive triggered!")}
      />
    </div>
  );
}`;

  const cssOnlyCode = `/* 30° Isometric 3D Button Design System */
.isometric-stage {
  transform: rotate(30deg) skewX(-30deg) scaleY(0.866025);
  transform-origin: center center;
}

.isometric-cap-face {
  background: linear-gradient(135deg, #2A2D35 0%, #15171C 100%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.3),
              0px 15px 30px rgba(0, 0, 0, 0.7);
}`;

  const framerCode = ISOMETRIC_REVIVE_PHYSICS;

  return (
    <PageWrapper showFloatingButton={false}>
      <div className="relative overflow-hidden min-h-screen bg-[#0C0D12] text-white pt-6 pb-20 selection:bg-orange-500/30 selection:text-orange-200">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Header section */}
          <header className="text-center space-y-4 max-w-3xl mx-auto pt-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-medium text-orange-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>Isometric 3D Projection</span>
              <span className="text-gray-500">•</span>
              <span className="text-orange-400">React + Framer Motion</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-jakarta">
              Isometric Revive <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">3D Tactile Button</span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              Multi-angle 3D button engineered with a true 30° axonometric projection matrix, multi-tier extruded facets, and glowing core indicators.
            </p>
          </header>

          {/* Interactive Studio Stage */}
          <div className="bg-[#12141A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <StudioCanvas minHeight="min-h-[420px]">
                <IsometricReviveButton
                  label={labelText}
                  theme={theme}
                  angle={angle}
                  intensity={intensity}
                  size={size}
                  stateMode={stateMode}
                  showGrid={showGrid}
                  onClick={() => setClickCount((c) => c + 1)}
                />

                <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
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
                <label className="font-mono text-gray-400 uppercase tracking-wider block">Label</label>
                <input
                  type="text"
                  value={labelText}
                  onChange={(e) => setLabelText(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-gray-400 uppercase tracking-wider block">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as IsometricReviveTheme)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                >
                  {(Object.keys(ISOMETRIC_REVIVE_THEMES) as IsometricReviveTheme[]).map((k) => (
                    <option key={k} value={k} className="bg-[#12141A]">
                      {ISOMETRIC_REVIVE_THEMES[k].name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-gray-400 uppercase tracking-wider block">Angle</label>
                <select
                  value={angle}
                  onChange={(e) => setAngle(e.target.value as IsometricReviveAngle)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                >
                  {(Object.keys(ANGLE_TRANSFORMS) as IsometricReviveAngle[]).map((a) => (
                    <option key={a} value={a} className="bg-[#12141A]">
                      {ANGLE_TRANSFORMS[a]?.label || a}
                    </option>
                  ))}
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
                  onChange={(e) => setStateMode(e.target.value as IsometricReviveStateMode)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                >
                  <option value="interactive" className="bg-[#12141A]">Interactive</option>
                  <option value="standerd" className="bg-[#12141A]">Standard</option>
                  <option value="hover" className="bg-[#12141A]">Hover</option>
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
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#FFB020] mb-1.5">
                  <span>PRESETS &amp; VARIATIONS</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">All Variants Preview</h2>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Click or hover over buttons to test 30° isometric matrix spring depression
              </p>
            </div>

            <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Figma Master Obsidian */}
                <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                    <span className="text-white font-semibold">Figma Master Obsidian</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-300">theme=&quot;figma&quot;</span>
                  </div>
                  <div className="my-4 scale-90">
                    <IsometricReviveButton
                      theme="figma"
                      label="Revive"
                      size="sm"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-gray-500 text-center">1:1 Figma extruded obsidian bevels with amber flare</span>
                </div>

                {/* Amber Solar Flare */}
                <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                    <span className="text-white font-semibold">Amber Solar Flare</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-amber-400">theme=&quot;amber&quot;</span>
                  </div>
                  <div className="my-4 scale-90">
                    <IsometricReviveButton
                      theme="amber"
                      label="Ignite"
                      size="sm"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-gray-500 text-center">Warm golden amber underglow with dual bevel highlights</span>
                </div>

                {/* Electric Cyan */}
                <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                    <span className="text-white font-semibold">Electric Cyan</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-cyan-400">theme=&quot;cyan&quot;</span>
                  </div>
                  <div className="my-4 scale-90">
                    <IsometricReviveButton
                      theme="cyan"
                      label="Deploy"
                      size="sm"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-gray-500 text-center">Laser cyan neon underlayer with high-contrast text</span>
                </div>

                {/* Cyber Violet */}
                <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                    <span className="text-white font-semibold">Cyber Violet</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-purple-400">theme=&quot;violet&quot;</span>
                  </div>
                  <div className="my-4 scale-90">
                    <IsometricReviveButton
                      theme="violet"
                      label="Upgrade"
                      size="sm"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-gray-500 text-center">Ultraviolet neon underglow with cybernetic extrusion</span>
                </div>

                {/* UI Pirate Magma */}
                <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                    <span className="text-white font-semibold">UI Pirate Magma</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-orange-400">theme=&quot;uipirate&quot;</span>
                  </div>
                  <div className="my-4 scale-90">
                    <IsometricReviveButton
                      theme="uipirate"
                      label="Launch"
                      size="sm"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-gray-500 text-center">Signature brand magma orange 3D isometric bevel slab</span>
                </div>

                {/* Gold Luxury */}
                <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                    <span className="text-white font-semibold">Gold Luxury</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-yellow-400">theme=&quot;gold-luxury&quot;</span>
                  </div>
                  <div className="my-4 scale-90">
                    <IsometricReviveButton
                      theme="gold-luxury"
                      label="Unlock"
                      size="sm"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-gray-500 text-center">Prestige champagne gold walls with golden beacon flare</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
            QUICK INSTALLATION & DEPENDENCIES SECTION
           ───────────────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Installation &amp; Setup</h2>
            <div className="bg-[#12141A] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              <p className="text-sm text-gray-300 leading-relaxed">
                Install the required dependencies for Framer Motion spring physics and Tailwind utility classes:
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
                    activeCodeTab === "component"
                      ? componentSourceCode
                      : activeCodeTab === "usage"
                        ? usageCode
                        : activeCodeTab === "css"
                          ? cssOnlyCode
                          : framerCode,
                    activeCodeTab
                  )
                }
                className="text-xs font-mono text-orange-400 hover:text-orange-300 transition-colors"
              >
                {copiedCode === activeCodeTab ? "✓ Copied to Clipboard" : "Copy Active Tab Code"}
              </button>
            </div>

            <div className="bg-[#12141A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white font-mono">
                    {activeCodeTab === "component"
                      ? "IsometricReviveButton.tsx"
                      : activeCodeTab === "usage"
                        ? "Usage.tsx"
                        : activeCodeTab === "css"
                          ? "Tokens.css"
                          : "Physics.ts"}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">• Production Ready</span>
                </div>

                <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
                  <button
                    onClick={() => setActiveCodeTab("component")}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${activeCodeTab === "component" ? "bg-orange-500 text-black font-bold" : "text-gray-400 hover:text-white"
                      }`}
                  >
                    Component.tsx
                  </button>
                  <button
                    onClick={() => setActiveCodeTab("usage")}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${activeCodeTab === "usage" ? "bg-orange-500 text-black font-bold" : "text-gray-400 hover:text-white"
                      }`}
                  >
                    Usage.tsx
                  </button>
                  <button
                    onClick={() => setActiveCodeTab("css")}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${activeCodeTab === "css" ? "bg-orange-500 text-black font-bold" : "text-gray-400 hover:text-white"
                      }`}
                  >
                    Tokens.css
                  </button>
                  <button
                    onClick={() => setActiveCodeTab("framer")}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${activeCodeTab === "framer" ? "bg-orange-500 text-black font-bold" : "text-gray-400 hover:text-white"
                      }`}
                  >
                    Physics.ts
                  </button>
                </div>
              </div>

              <div className="p-6 bg-[#090A0D] overflow-x-auto max-h-[550px]">
                <pre className="text-xs sm:text-sm font-mono text-gray-300 leading-relaxed">
                  <code>
                    {activeCodeTab === "component"
                      ? componentSourceCode
                      : activeCodeTab === "usage"
                        ? usageCode
                        : activeCodeTab === "css"
                          ? cssOnlyCode
                          : framerCode}
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
            <div className="bg-[#12141A] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
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
                      <td className="py-3 px-6 text-orange-400 font-semibold">label</td>
                      <td className="py-3 px-6 text-blue-300">string</td>
                      <td className="py-3 px-6 text-gray-400">&quot;Revive Now&quot;</td>
                      <td className="py-3 px-6 font-sans text-gray-300">Text displayed on the isometric face</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-6 text-orange-400 font-semibold">theme</td>
                      <td className="py-3 px-6 text-blue-300">IsometricReviveTheme</td>
                      <td className="py-3 px-6 text-gray-400">&quot;figma&quot;</td>
                      <td className="py-3 px-6 font-sans text-gray-300">Color scheme preset (Obsidian, Amber, Cyan, etc.)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-6 text-orange-400 font-semibold">size</td>
                      <td className="py-3 px-6 text-blue-300">&quot;xs&quot; | &quot;sm&quot; | &quot;md&quot; | &quot;lg&quot; | &quot;xl&quot;</td>
                      <td className="py-3 px-6 text-gray-400">&quot;md&quot;</td>
                      <td className="py-3 px-6 font-sans text-gray-300">Scale multiplier</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-6 text-orange-400 font-semibold">onClick</td>
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
          <GlobalCTA topic="isometric 3D buttons or custom web animations" />
        </div>
      </div>
    </PageWrapper>
  );
}
