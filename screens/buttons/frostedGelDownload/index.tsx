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

export default function FrostedGelDownloadScreen() {
  const [theme, setTheme] = useState<FrostedGelTheme>("figma-blue");
  const [size, setSize] = useState<FrostedGelSize>("md");
  const [stateMode, setStateMode] = useState<FrostedGelStateMode>("interactive");
  const [labelText, setLabelText] = useState("Download now");
  const [showCables, setShowCables] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"usage" | "css" | "framer">("usage");
  const [stageBg, setStageBg] = useState<"light" | "diagonal-grid" | "dark">("diagonal-grid");

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(tabName);
    setTimeout(() => setCopiedCode(null), 2500);
  };

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
              inset 0px 1.65px 0px 0px rgba(255, 255, 255, 0.7);
}`;

  const framerCode = `// Framer Motion Spring Press Dynamics
<motion.button
  whileHover={{ y: -4 }}
  whileTap={{ y: 2, scale: 0.98 }}
  transition={{ type: "spring", stiffness: 500, damping: 24 }}
  className="relative w-[254px] h-[74px] rounded-[16.5px]"
>
  Download now
</motion.button>`;

  return (
    <div className="min-h-screen bg-[#0E1015] text-[#F3F4F6] font-sans antialiased selection:bg-[#2626FF]/30 selection:text-white">
      {/* 1. Header Navigation Bar */}
      <header className="border-b border-white/[0.08] bg-[#0E1015]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/buttons"
              className="text-xs uppercase tracking-widest text-[#9CA3AF] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Button Gallery
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-sm font-semibold text-white">
              Frosted Gel Download Button
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              React + Tailwind + Framer Motion
            </span>
          </div>
        </div>
      </header>

      {/* 2. Main Studio Showcase Container */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                Production Ready
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
                Dual-Pill Neumorphic Gel
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Frosted Gel & Ceramic Download Button
            </h1>
            <p className="text-sm text-[#9CA3AF] mt-2 max-w-2xl">
              High-performance split button component with multi-layered frosted glass refraction rings, volumetric underglow flare, and elevated ceramic pill surface.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleCopy(usageCode, "header")}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-[#2626FF] hover:bg-[#1E1ECC] text-white shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              {copiedCode === "header" ? "Copied!" : "Copy Component"}
            </button>
          </div>
        </div>

        {/* 3. Interactive Live Studio Stage */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-[#9CA3AF]">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-blue-400 animate-ping" />
              Live Interactive Stage | Clicks:{" "}
              <strong className="text-white">{clickCount}</strong>
              {lastAction && (
                <span className="text-blue-400">({lastAction})</span>
              )}
            </span>

            {/* Stage Background Switcher */}
            <div className="flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => setStageBg("diagonal-grid")}
                className={`px-2.5 py-1 rounded text-[11px] transition-all cursor-pointer ${
                  stageBg === "diagonal-grid"
                    ? "bg-white/15 text-white font-semibold"
                    : "text-white/40 hover:text-white"
                }`}
              >
                Figma Grid
              </button>
              <button
                type="button"
                onClick={() => setStageBg("light")}
                className={`px-2.5 py-1 rounded text-[11px] transition-all cursor-pointer ${
                  stageBg === "light"
                    ? "bg-white/15 text-white font-semibold"
                    : "text-white/40 hover:text-white"
                }`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => setStageBg("dark")}
                className={`px-2.5 py-1 rounded text-[11px] transition-all cursor-pointer ${
                  stageBg === "dark"
                    ? "bg-white/15 text-white font-semibold"
                    : "text-white/40 hover:text-white"
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Interactive Viewport Canvas */}
          <div
            className={`relative rounded-3xl border border-white/10 overflow-hidden flex flex-col items-center justify-center min-h-[440px] transition-colors duration-500 shadow-2xl ${
              stageBg === "light"
                ? "bg-[#F3F4F6]"
                : stageBg === "dark"
                ? "bg-[#0B0D12]"
                : "bg-[#F5F5F5]"
            }`}
            style={
              stageBg === "diagonal-grid"
                ? {
                    backgroundImage:
                      "linear-gradient(63.8deg, #F5F5F5 36.5%, #FFFFFF 97.5%)",
                  }
                : {}
            }
          >
            {/* Exact Figma 1:1 Diagonal Pinstripe / Hatch Pattern Texture (4604:126/152) */}
            {stageBg === "diagonal-grid" && (
              <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, rgba(0, 42, 254, 0.04) 0px, rgba(0, 42, 254, 0.04) 1px, transparent 1px, transparent 8.24px)",
                }}
              />
            )}

            {/* Render Component */}
            <FrostedGelDownloadButton
              label={labelText}
              theme={theme}
              size={size}
              stateMode={stateMode}
              showCables={showCables}
              onClick={() => {
                setClickCount((c) => c + 1);
                setLastAction("Unified Button Clicked");
              }}
            />
          </div>

          {/* Studio Control Toolbar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-xs">
            {/* Mode Switcher */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider block">
                State Mode
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
                Color & Style Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as FrostedGelTheme)}
                className="w-full bg-[#16181F] border border-white/10 rounded-xl px-3 py-2 text-white font-medium text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {Object.entries(FROSTED_GEL_THEMES).map(([key, t]) => (
                  <option key={key} value={key}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Label Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider block">
                Button Label
              </label>
              <input
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                placeholder="Button Label..."
                className="w-full bg-[#16181F] border border-white/10 rounded-xl px-3 py-2 text-white font-medium text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Size & Options */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider block">
                Scale & Options
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/5">
                  {(["sm", "md", "lg"] as FrostedGelSize[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`flex-1 py-1 rounded-lg font-mono text-[11px] uppercase transition-all cursor-pointer ${
                        size === s
                          ? "bg-white/15 text-white font-bold"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowCables((c) => !c)}
                  className={`px-3 py-2 rounded-xl font-mono text-[11px] border transition-all cursor-pointer ${
                    showCables
                      ? "bg-blue-500/20 border-blue-500/40 text-blue-300 font-semibold"
                      : "bg-white/[0.04] border-white/10 text-white/40"
                  }`}
                >
                  Cables {showCables ? "ON" : "OFF"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. State Architecture & Design Tokens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="size-2 rounded-full bg-blue-500" />
              Standard Resting State Architecture
            </h3>
            <ul className="text-xs text-white/70 space-y-2 font-mono leading-relaxed">
              <li>• <strong>Pill Surface:</strong> Resting at <code>y: 0px</code> with crisp <code>#002AFE</code> bottom bevel</li>
              <li>• <strong>Ceramic Elevation:</strong> <code>inset 0px 3.3px 0px 1.2px white</code> specular rim</li>
              <li>• <strong>Cloud Tile:</strong> Frosted translucent glass with <code>rgba(255,255,255,0.7)</code> border</li>
              <li>• <strong>Soft Contact Shadow:</strong> <code>0px 8px 16px rgba(0,42,254,0.18)</code></li>
            </ul>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="size-2 rounded-full bg-cyan-400" />
              Hover Illumination State Architecture
            </h3>
            <ul className="text-xs text-white/70 space-y-2 font-mono leading-relaxed">
              <li>• <strong>Spring Hover Travel:</strong> Tactile lift with <code>-4px</code> hover elevation</li>
              <li>• <strong>Volumetric Underglow:</strong> Radial flare bloom <code>rgba(0, 123, 254, 0.35)</code></li>
              <li>• <strong>Active Gel Luminescence:</strong> Cyan core glow with <code>rgba(0, 123, 254, 0.25)</code> diffusion</li>
              <li>• <strong>Interactive Click:</strong> Mechanical spring switch depression <code>+2px</code></li>
            </ul>
          </div>
        </div>

        {/* 5. Code Export Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Component Code & Specs</h3>
            <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveCodeTab("usage")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  activeCodeTab === "usage"
                    ? "bg-blue-600 text-white font-bold"
                    : "text-white/40 hover:text-white"
                }`}
              >
                React / TSX
              </button>
              <button
                type="button"
                onClick={() => setActiveCodeTab("css")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  activeCodeTab === "css"
                    ? "bg-blue-600 text-white font-bold"
                    : "text-white/40 hover:text-white"
                }`}
              >
                Vanilla CSS Tokens
              </button>
              <button
                type="button"
                onClick={() => setActiveCodeTab("framer")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  activeCodeTab === "framer"
                    ? "bg-blue-600 text-white font-bold"
                    : "text-white/40 hover:text-white"
                }`}
              >
                Framer Motion
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl bg-[#090B10] border border-white/10 p-6 overflow-x-auto font-mono text-xs text-white/80 leading-relaxed shadow-xl">
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
              className="absolute top-4 right-4 px-3 py-1.5 rounded-lg text-xs bg-white/10 hover:bg-white/20 text-white font-mono transition-all cursor-pointer"
            >
              {copiedCode === activeCodeTab ? "Copied!" : "Copy Code"}
            </button>
            <pre>
              <code>
                {activeCodeTab === "usage"
                  ? usageCode
                  : activeCodeTab === "css"
                  ? cssOnlyCode
                  : framerCode}
              </code>
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
