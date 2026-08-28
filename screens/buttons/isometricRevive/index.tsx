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

  const componentSourceCode = `"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type IsometricReviveTheme = "figma" | "amber" | "cyan" | "emerald" | "violet" | "crimson" | "uipirate";
export type IsometricReviveSize = "sm" | "md" | "lg";

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

  const framerCode = `// Spring Isometric Transforms
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

  return (
    <main className="min-h-screen bg-[#0C0D12] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-orange-500/30 selection:text-orange-200">
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
            <span className="text-orange-400">Isometric Revive</span>
          </div>
        </div>

        {/* Header section */}
        <header className="text-center space-y-4 max-w-3xl mx-auto">
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
          <div className="p-12 sm:p-20 flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden bg-gradient-to-b from-[#141720] to-[#0D0F14]">
            {showGrid && (
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />
            )}

            <div className="relative z-10 flex flex-col items-center gap-6">
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
            </div>
          </div>

          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-6 border-t border-white/10 bg-white/[0.01] text-xs">
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
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Label</label>
              <input
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Scale</label>
              <div className="flex gap-1">
                {(["sm", "md", "lg"] as IsometricReviveSize[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`flex-1 py-2 rounded-xl uppercase font-mono transition-all ${
                      size === s ? "bg-orange-500 text-black font-bold" : "bg-white/5 text-gray-400"
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
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "component" ? "bg-orange-500 text-black font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Component.tsx
                </button>
                <button
                  onClick={() => setActiveCodeTab("usage")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "usage" ? "bg-orange-500 text-black font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Usage.tsx
                </button>
                <button
                  onClick={() => setActiveCodeTab("css")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "css" ? "bg-orange-500 text-black font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Tokens.css
                </button>
                <button
                  onClick={() => setActiveCodeTab("framer")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "framer" ? "bg-orange-500 text-black font-bold" : "text-gray-400 hover:text-white"
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
                    <td className="py-3 px-6 text-blue-300">&quot;sm&quot; | &quot;md&quot; | &quot;lg&quot;</td>
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
      </div>
    </main>
  );
}
