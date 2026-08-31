"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FrostedGelDownloadButton,
  FrostedGelTheme,
  FrostedGelSize,
  FrostedGelStateMode,
  FROSTED_GEL_THEMES,
} from "@/components/FrostedGelDownloadButton";
import PageWrapper from "@/components/PageWrapper";
import GlobalCTA from "@/components/GlobalCTA";

export default function FrostedGelDownloadScreen() {
  const [theme, setTheme] = useState<FrostedGelTheme>("figma-blue");
  const [size, setSize] = useState<FrostedGelSize>("md");
  const [stateMode, setStateMode] = useState<FrostedGelStateMode>("interactive");
  const [labelText, setLabelText] = useState("Download now");
  const [showCables, setShowCables] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"component" | "usage" | "css" | "framer">("component");
  const [stageBg, setStageBg] = useState<"light" | "diagonal-grid" | "dark">("diagonal-grid");
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

export type FrostedGelTheme =
  | "figma-blue"
  | "cyber-violet"
  | "emerald-matrix"
  | "magma-orange"
  | "dark-obsidian"
  | "titanium-gold";

export type FrostedGelStateMode = "interactive" | "standerd" | "hover";
export type FrostedGelSize = "sm" | "md" | "lg";

export interface FrostedGelButtonProps {
  label?: string;
  stateMode?: FrostedGelStateMode;
  theme?: FrostedGelTheme;
  size?: FrostedGelSize;
  showCables?: boolean;
  onDownloadClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onIconClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
}

export function FrostedGelDownloadButton({
  label = "Download now",
  stateMode = "interactive",
  theme = "figma-blue",
  size = "md",
  showCables = true,
  onDownloadClick,
  onIconClick,
  disabled = false,
  className = "",
}: FrostedGelButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const scale = size === "sm" ? 0.8 : size === "lg" ? 1.2 : 1;
  const isVisualHover = stateMode === "hover" || (stateMode === "interactive" && isHovered);

  return (
    <div
      className={\`relative select-none flex items-center justify-center \${className}\`}
      style={{ width: \`\${560 * scale}px\`, height: \`\${240 * scale}px\` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
    >
      <div
        className="relative w-[560px] h-[240px] flex items-center justify-center flex-none transition-transform duration-300"
        style={{ transform: \`scale(\${scale})\` }}
      >
        {/* Volumetric Underglow Flare */}
        <div
          className={\`absolute w-[440px] h-[100px] rounded-full blur-[32px] transition-opacity duration-400 pointer-events-none \${
            isVisualHover ? "opacity-100 scale-105" : "opacity-35"
          }\`}
          style={{ background: "rgba(0, 123, 254, 0.35)" }}
        />

        {/* Dual-Pill Assembly */}
        <div className="relative flex items-center gap-3">
          {/* Ceramic Pill */}
          <motion.button
            type="button"
            disabled={disabled}
            onClick={onDownloadClick}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            animate={{
              y: isPressed ? 2 : isVisualHover ? -4 : 0,
            }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            className="relative px-8 py-4 rounded-[16.5px] bg-[#F9F9F9] border border-white/90 shadow-[0px_1px_0px_#002AFE,0px_8px_16px_rgba(0,42,254,0.18),inset_0px_3.3px_0px_1.2px_white] text-[#2626FF] font-bold text-sm flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <span>{label}</span>
          </motion.button>

          {/* Frosted Glass Gel Tile */}
          <motion.button
            type="button"
            disabled={disabled}
            onClick={onIconClick}
            animate={{
              y: isPressed ? 2 : isVisualHover ? -4 : 0,
            }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            className="relative w-[60px] h-[54px] rounded-[16.5px] bg-white/40 backdrop-blur-md border border-white/70 shadow-[0px_8px_18px_rgba(0,42,254,0.25)] flex items-center justify-center text-[#2626FF] cursor-pointer focus:outline-none"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
}`;

  const usageCode = `import { FrostedGelDownloadButton } from "@/components/FrostedGelDownloadButton";

export default function Example() {
  return (
    <div className="flex items-center justify-center p-12 bg-[#F5F5F5]">
      <FrostedGelDownloadButton
        label="${labelText}"
        theme="${theme}"
        size="${size}"
        stateMode="${stateMode}"
        showCables={${showCables}}
        onDownloadClick={() => console.log("Download clicked!")}
        onIconClick={() => console.log("Cloud icon clicked!")}
      />
    </div>
  );
}`;

  const cssOnlyCode = `/* Frosted Gel Download Button Design Tokens */

/* 1. Ceramic Elevated Pill */
.ceramic-pill {
  background: #F9F9F9;
  border: 1.65px solid rgba(255, 255, 255, 0.9);
  border-radius: 16.5px;
  box-shadow: 0px 1px 0px 0px #002AFE,
              0px 8px 16px 0px rgba(0, 42, 254, 0.18),
              inset 0px -3.3px 0px 0px rgba(0, 0, 0, 0.18),
              inset 0px 3.3px 0px 1.2px white;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 2. Hover Illumination State */
.ceramic-pill:hover {
  transform: translateY(-4px);
  box-shadow: 0px 1px 0px 0px #00AFF5,
              0px 14px 26px 0px rgba(0, 42, 254, 0.25),
              inset 0px -3.3px 0px 0px rgba(0, 0, 0, 0.15),
              inset 0px 3.3px 0px 1.2px white;
}

/* 3. Frosted Gel Glass Cloud Tile */
.frosted-gel-tile {
  background: linear-gradient(182deg, rgba(241, 241, 241, 0.55) 27%, rgba(153, 153, 153, 0.1) 150%);
  border: 1.65px solid rgba(255, 255, 255, 0.7);
  border-radius: 16.5px;
  backdrop-filter: blur(12px);
  box-shadow: 0px 1px 0px 0px rgba(255, 255, 255, 0.5),
              0px 8px 18px 0px rgba(0, 42, 254, 0.25),
              inset 0px 0px 1.6px 0.8px rgba(255, 255, 255, 0.8);
}

/* 4. Volumetric Blue Underglow Flare */
.volumetric-underglow {
  background: radial-gradient(circle, rgba(0, 123, 254, 0.35) 0%, rgba(0, 42, 254, 0) 70%);
  filter: blur(32px);
}`;

  const framerCode = `// Cohesive Spring Physics & Elevation
<motion.div
  animate={{
    y: isPressed ? 2 : isHovered ? -4 : 0,
    scale: isPressed ? 0.98 : 1,
  }}
  transition={{
    type: "spring",
    stiffness: 450,
    damping: 26,
    mass: 0.8,
  }}
>
  {/* Dual Pill Split Assembly */}
</motion.div>`;

  return (
    <PageWrapper showFloatingButton={false}>
      <div className="relative overflow-hidden min-h-screen bg-[#07080A] text-white font-sans selection:bg-blue-600/30 selection:text-blue-200 pt-6 pb-20">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Header Section */}
          <header className="text-center space-y-4 max-w-3xl mx-auto pt-6">
            <div className="inline-flex items-center gap-3 justify-center">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Glassmorphic CTA
              </span>
              <span className="text-xs text-white/40 font-mono">
                React + Tailwind + Framer Motion
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-jakarta">
              Frosted Gel Dual-Pill Download Button
            </h1>
            <p className="text-base sm:text-lg text-white/60 max-w-3xl mx-auto leading-relaxed">
              Dual-pill split CTA button featuring an elevated ceramic primary action, frosted glass cloud download tile, optical refraction rings, and volumetric blue underglow flare.
            </p>
          </header>

        {/* 2. Interactive Studio Stage */}
        <div className="flex flex-col gap-8 items-stretch">
          {/* Main Visual Stage */}
          <div className="space-y-4">
            <div className="relative rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-[#0F1116] min-h-[380px] flex flex-col items-center justify-center p-8">
              {/* Grid Canvas Texture */}
              {stageBg === "diagonal-grid" && (
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(-45deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
              )}

              {/* Live Interactive Button Component */}
              <div className="relative z-10 py-6">
                <FrostedGelDownloadButton
                  label={labelText}
                  theme={theme}
                  size={size}
                  stateMode={stateMode}
                  showCables={showCables}
                  onDownloadClick={() => {
                    setClickCount((c) => c + 1);
                    setLastAction("Downloaded package");
                  }}
                  onIconClick={() => {
                    setClickCount((c) => c + 1);
                    setLastAction("Opened cloud storage");
                  }}
                />
              </div>

              {/* Stage Background Switcher */}
              <div className="absolute bottom-4 left-6 flex items-center gap-2 text-xs text-white/50 font-mono">
                <span>Canvas:</span>
                <button
                  type="button"
                  onClick={() => setStageBg("diagonal-grid")}
                  className={`px-2 py-1 rounded ${
                    stageBg === "diagonal-grid"
                      ? "bg-white/20 text-white font-bold"
                      : "hover:text-white"
                  }`}
                >
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setStageBg("dark")}
                  className={`px-2 py-1 rounded ${
                    stageBg === "dark"
                      ? "bg-white/20 text-white font-bold"
                      : "hover:text-white"
                  }`}
                >
                  Dark
                </button>
              </div>

              {/* Status readout */}
              <div className="absolute bottom-4 right-6 text-xs text-white/40 font-mono">
                {clickCount > 0
                  ? `Triggered: ${lastAction} (${clickCount}x)`
                  : "Hover or click pill / cloud icon"}
              </div>
            </div>
          </div>

          {/* Controls Sidebar */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white/70 font-mono">
              Customizer
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
            {/* State Mode Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider block">
                State Preview
              </label>
              <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/5">
                {(["interactive", "standerd", "hover"] as FrostedGelStateMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setStateMode(mode)}
                    className={`flex-1 py-1.5 rounded-lg font-mono text-[11px] capitalize transition-all cursor-pointer ${
                      stateMode === mode
                        ? "bg-blue-600 text-white font-bold shadow"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    {mode === "standerd" ? "Standard" : mode === "hover" ? "Hover" : "Interactive"}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Theme Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider block">
                Color &amp; Style Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as FrostedGelTheme)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              >
                {(Object.keys(FROSTED_GEL_THEMES) as FrostedGelTheme[]).map((key) => (
                  <option key={key} value={key} className="bg-[#10131A] text-white">
                    {FROSTED_GEL_THEMES[key].name}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Scale Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider block">
                Scale Size
              </label>
              <div className="flex items-center gap-2">
                {(["sm", "md", "lg"] as FrostedGelSize[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`flex-1 py-1.5 rounded-xl font-mono text-xs uppercase border transition-all ${
                      size === s
                        ? "bg-blue-600 text-white font-bold border-blue-500"
                        : "bg-white/5 text-white/60 border-white/5 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Label text input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider block">
                Pill Label
              </label>
              <input
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
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
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#2626FF] mb-1.5">
                <span>PRESETS &amp; VARIATIONS</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">All Variants Preview</h2>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Hover &amp; click each variant to experience frosted gel optical effects
            </p>
          </div>

          <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Figma Blue */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Figma Electric Blue</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-blue-400">theme=&quot;figma-blue&quot;</span>
                </div>
                <div className="my-3 scale-[0.68] sm:scale-[0.8]">
                  <FrostedGelDownloadButton
                    label="Download Package"
                    theme="figma-blue"
                    size="sm"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">1:1 Figma ceramic pill with volumetric blue flare</span>
              </div>

              {/* Cyber Violet */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Cyber Violet</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-purple-400">theme=&quot;cyber-violet&quot;</span>
                </div>
                <div className="my-3 scale-[0.68] sm:scale-[0.8]">
                  <FrostedGelDownloadButton
                    label="Install Assets"
                    theme="cyber-violet"
                    size="sm"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Ultraviolet refraction glow with tinted frosted gel</span>
              </div>

              {/* Emerald Matrix */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Emerald Matrix</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-emerald-400">theme=&quot;emerald-matrix&quot;</span>
                </div>
                <div className="my-3 scale-[0.68] sm:scale-[0.8]">
                  <FrostedGelDownloadButton
                    label="Fetch Source"
                    theme="emerald-matrix"
                    size="sm"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Cyberpunk reactor green glow with translucent glass tile</span>
              </div>

              {/* Magma Orange */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Magma Orange</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-orange-400">theme=&quot;magma-orange&quot;</span>
                </div>
                <div className="my-3 scale-[0.68] sm:scale-[0.8]">
                  <FrostedGelDownloadButton
                    label="Get Bundle"
                    theme="magma-orange"
                    size="sm"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">UI Pirate signature brand magma orange illumination</span>
              </div>

              {/* Dark Obsidian */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Dark Obsidian</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-300">theme=&quot;dark-obsidian&quot;</span>
                </div>
                <div className="my-3 scale-[0.68] sm:scale-[0.8]">
                  <FrostedGelDownloadButton
                    label="Download Code"
                    theme="dark-obsidian"
                    size="sm"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Stealth midnight pill with smoked dark glass cloud tile</span>
              </div>

              {/* Titanium Gold */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[220px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Titanium Gold</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-amber-400">theme=&quot;titanium-gold&quot;</span>
                </div>
                <div className="my-3 scale-[0.68] sm:scale-[0.8]">
                  <FrostedGelDownloadButton
                    label="Export Pro"
                    theme="titanium-gold"
                    size="sm"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Luxury warm gold underglow with champagne ceramic pill</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            INSTALLATION & SETUP
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Installation &amp; Setup</h2>
          <div className="bg-[#151518] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <p className="text-sm text-gray-300 leading-relaxed">
              Install the required dependencies for spring animations and styling:
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
            CODE EXPORT TABS
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
              className="text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors"
            >
              {copiedCode === activeCodeTab ? "✓ Copied to Clipboard" : "Copy Active Tab Code"}
            </button>
          </div>

          <div className="bg-[#151518] border border-white/10 rounded-3xl overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white font-mono">
                  {activeCodeTab === "component"
                    ? "FrostedGelDownloadButton.tsx"
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
                    activeCodeTab === "component"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Component.tsx
                </button>
                <button
                  onClick={() => setActiveCodeTab("usage")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "usage"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Usage.tsx
                </button>
                <button
                  onClick={() => setActiveCodeTab("css")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "css"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Tokens.css
                </button>
                <button
                  onClick={() => setActiveCodeTab("framer")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "framer"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Physics.ts
                </button>
              </div>
            </div>

            <div className="p-6 bg-[#0B0B0D] overflow-x-auto max-h-[550px]">
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
                    <td className="py-3 px-6 text-blue-400 font-semibold">label</td>
                    <td className="py-3 px-6 text-blue-300">string</td>
                    <td className="py-3 px-6 text-gray-400">&quot;Download now&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Text displayed on the primary ceramic pill</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-blue-400 font-semibold">theme</td>
                    <td className="py-3 px-6 text-blue-300">FrostedGelTheme</td>
                    <td className="py-3 px-6 text-gray-400">&quot;figma-blue&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Color scheme preset (Electric Blue, Ultraviolet, Emerald, etc.)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-blue-400 font-semibold">size</td>
                    <td className="py-3 px-6 text-blue-300">&quot;sm&quot; | &quot;md&quot; | &quot;lg&quot;</td>
                    <td className="py-3 px-6 text-gray-400">&quot;md&quot;</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Physical scaling multiplier</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-blue-400 font-semibold">onDownloadClick</td>
                    <td className="py-3 px-6 text-blue-300">(e) =&gt; void</td>
                    <td className="py-3 px-6 text-gray-400">undefined</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Callback fired when the pill button is clicked</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-blue-400 font-semibold">onIconClick</td>
                    <td className="py-3 px-6 text-blue-300">(e) =&gt; void</td>
                    <td className="py-3 px-6 text-gray-400">undefined</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Callback fired when the frosted glass cloud tile is clicked</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Website Global CTA */}
        <GlobalCTA topic="frosted glass CTA buttons or component libraries" />
      </div>
    </div>
  </PageWrapper>
  );
}
