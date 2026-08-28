"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ElevatedUnderglowCTA,
  ElevatedUnderglowTheme,
  ElevatedUnderglowStateMode,
  ElevatedUnderglowSize,
  ElevatedUnderglowIconType,
  UNDERGLOW_THEMES,
} from "@/components/ElevatedUnderglowCTA";

export default function ElevatedUnderglowScreen() {
  const [theme, setTheme] = useState<ElevatedUnderglowTheme>("figma");
  const [size, setSize] = useState<ElevatedUnderglowSize>("md");
  const [stateMode, setStateMode] = useState<ElevatedUnderglowStateMode>("interactive");
  const [iconType, setIconType] = useState<ElevatedUnderglowIconType>("phone");
  const [labelText, setLabelText] = useState("Book A Call");
  const [clickCount, setClickCount] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"usage" | "css">("usage");
  const [stageBgDark, setStageBgDark] = useState(false);

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(tabName);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const usageCode = `import { ElevatedUnderglowCTA } from "@/components/ElevatedUnderglowCTA";

export default function Example() {
  return (
    <ElevatedUnderglowCTA
      label="${labelText}"
      theme="${theme}"
      size="${size}"
      stateMode="${stateMode}"
      icon="${iconType}"
      onClick={() => console.log("Booked a call!")}
    />
  );
}`;

  const cssOnlyCode = `/* Elevated Underglow 3D Button Design Tokens */

/* 1. Resting State */
.elevated-cta-resting {
  position: relative;
  width: 184px;
  height: 56px;
  padding: 10px 22px;
  border-radius: 35px;
  background-color: #E8E8E8;
  border: 1px solid #EFEFEF;
  color: #353535;
  font-family: 'Figtree', sans-serif;
  font-size: 18px;
  box-shadow:
    0px 2px 0px 0px #DADADA,
    0px 87px 24px 0px rgba(0, 0, 0, 0),
    0px 55px 22px 0px rgba(0, 0, 0, 0.01),
    0px 31px 19px 0px rgba(0, 0, 0, 0.05),
    0px 14px 14px 0px rgba(0, 0, 0, 0.09),
    0px 3px 8px 0px rgba(0, 0, 0, 0.1);
}

/* 2. Elevated State */
/* Top Cap lifts up by 13px */
.elevated-cta-hover-cap {
  transform: translateY(-13px);
  box-shadow:
    0px 21px 12px 0px rgba(0, 145, 255, 0.15),
    0px 2px 0px 0px #DADADA,
    0px 87px 24px 0px rgba(0, 0, 0, 0),
    0px 55px 22px 0px rgba(0, 0, 0, 0.01),
    0px 31px 19px 0px rgba(0, 0, 0, 0.05),
    0px 14px 14px 0px rgba(0, 0, 0, 0.09),
    0px 3px 8px 0px rgba(0, 0, 0, 0.1),
    inset 0px -26px 23px -20px rgba(0, 119, 255, 0.1);
}

/* Vibrant Blue 3D Extrusion revealed beneath */
.elevated-cta-hover-base {
  position: absolute;
  bottom: 0;
  width: 184px;
  height: 56px;
  border-radius: 35px;
  background-color: #0077FF;
  box-shadow:
    0px 58px 16px 0px rgba(0, 145, 255, 0.01),
    0px 37px 15px 0px rgba(0, 145, 255, 0.04),
    0px 21px 12px 0px rgba(0, 145, 255, 0.15),
    0px 9px 9px 0px rgba(0, 145, 255, 0.26),
    0px 2px 5px 0px rgba(0, 145, 255, 0.29);
}`;

  return (
    <div className="min-h-screen bg-[#0E1117] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-[#0077FF] selection:text-white">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Link href="/buttons" className="hover:text-white transition-colors">
            Buttons
          </Link>
          <span>/</span>
          <span className="text-[#0077FF] font-medium">Elevated Underglow 3D CTA</span>
          <span className="ml-2 px-2 py-0.5 text-xs font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full">
            React + Tailwind
          </span>
        </div>

        {/* Header Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
            <span className="size-2 rounded-full bg-[#0077FF] animate-pulse" />
            <span>Interactive Button Studio</span>
            <span className="text-neutral-600">•</span>
            <span>3D Tactile Extrusion</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white flex flex-wrap items-center gap-3">
            Elevated Underglow <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0077FF] via-blue-400 to-cyan-300">3D Tactile CTA</span>
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg max-w-3xl leading-relaxed">
            Interactive 3D tactile pill button that elevates 13px on hover to reveal a glowing electric blue extruded sub-chassis, bottom reflection rim, and realistic clay elevation physics.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            MAIN INTERACTIVE PLAYGROUND STUDIO
           ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual Interactive Stage */}
          <div
            className={`lg:col-span-7 flex flex-col items-center justify-center p-12 sm:p-20 rounded-3xl border shadow-2xl relative min-h-[480px] overflow-hidden transition-all duration-500 ${
              stageBgDark
                ? "bg-[#14161E] border-white/10"
                : "bg-[#E8E8E8] border-neutral-300/80 shadow-inner"
            }`}
          >
            {/* Canvas Background Grid */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity ${
                stageBgDark
                  ? "bg-[radial-gradient(#ffffff0f_1px,transparent_1px)] [background-size:20px_20px]"
                  : "bg-[radial-gradient(#0000000d_1px,transparent_1px)] [background-size:20px_20px]"
              }`}
            />

            {/* Stage Background Theme Toggle */}
            <div className="absolute top-4 right-4 z-20">
              <button
                type="button"
                onClick={() => setStageBgDark(!stageBgDark)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border backdrop-blur-md transition-all ${
                  stageBgDark
                    ? "bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:text-white"
                    : "bg-white/80 text-neutral-700 border-neutral-300 hover:bg-white shadow-sm"
                }`}
              >
                {stageBgDark ? "🌙 Dark Stage" : "☀️ Light Stage (Figma 1:1)"}
              </button>
            </div>

            {/* Live Interactive Button Component */}
            <div className="relative z-10 flex flex-col items-center gap-6">
              <ElevatedUnderglowCTA
                label={labelText}
                icon={iconType}
                theme={theme}
                size={size}
                stateMode={stateMode}
                onClick={() => setClickCount((c) => c + 1)}
              />

              {/* Click Counter Feedback */}
              <div
                className={`font-mono text-xs mt-6 transition-colors ${
                  stageBgDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                Clicks: <span className="text-[#0077FF] font-bold">{clickCount}</span>
                {stateMode === "interactive" && (
                  <span className="ml-2 text-neutral-400">
                    • Hover over button to elevate!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Live Customizer Controls Panel */}
          <div className="lg:col-span-5 space-y-6 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#0077FF] animate-pulse" />
                Live Studio Customizer
              </h2>
              <span className="text-xs font-mono text-neutral-400">
                {UNDERGLOW_THEMES[theme].badge}
              </span>
            </div>

            {/* State Mode Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Visual State Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: "interactive", label: "Interactive" },
                    { id: "standerd", label: "Resting" },
                    { id: "hover", label: "Elevated" },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setStateMode(m.id)}
                    className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all truncate ${
                      stateMode === m.id
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-md shadow-blue-500/10"
                        : "bg-neutral-800/60 text-neutral-400 border-neutral-700 hover:text-white"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Underglow Theme Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                <span>Colorway Preset</span>
                <span className="text-[11px] text-blue-400 font-mono">
                  {UNDERGLOW_THEMES[theme].name}
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(UNDERGLOW_THEMES) as ElevatedUnderglowTheme[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTheme(key)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                      theme === key
                        ? "bg-neutral-800 text-white border-blue-500/80 shadow-md"
                        : "bg-neutral-800/30 text-neutral-400 border-neutral-700/50 hover:bg-neutral-800/60 hover:text-white"
                    }`}
                  >
                    <span
                      className="size-3 rounded-full shrink-0 shadow-[0_0_8px_currentColor]"
                      style={{
                        backgroundColor: UNDERGLOW_THEMES[key].primaryColor,
                        color: UNDERGLOW_THEMES[key].primaryColor,
                      }}
                    />
                    <span className="text-xs font-medium truncate">
                      {UNDERGLOW_THEMES[key].name.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Scale Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Size Scale
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["sm", "md", "lg"] as ElevatedUnderglowSize[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`px-3 py-2 text-xs font-medium uppercase rounded-xl border transition-all ${
                      size === s
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/50"
                        : "bg-neutral-800/60 text-neutral-400 border-neutral-700 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Emblem / Icon
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: "phone", label: "📞 Phone" },
                    { id: "calendar", label: "📅 Calendar" },
                    { id: "arrow", label: "→ Arrow" },
                    { id: "sparkle", label: "✨ Sparkle" },
                    { id: "mail", label: "✉ Mail" },
                    { id: "none", label: "None" },
                  ] as const
                ).map((ic) => (
                  <button
                    key={ic.id}
                    type="button"
                    onClick={() => setIconType(ic.id)}
                    className={`px-2.5 py-2 text-xs font-medium rounded-xl border transition-all truncate ${
                      iconType === ic.id
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/50"
                        : "bg-neutral-800/60 text-neutral-400 border-neutral-700 hover:text-white"
                    }`}
                  >
                    {ic.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Label Text Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Button Label
              </label>
              <input
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter button text..."
              />
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            STATE COMPARISON GALLERY
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">
              Component State Comparison
            </h2>
            <p className="text-neutral-400 text-sm">
              Side-by-side demonstration of resting and 13px elevated states on authentic `#E8E8E8` light studio background.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Resting State */}
            <div className="bg-[#E8E8E8] rounded-3xl border border-neutral-300 p-8 sm:p-12 flex flex-col items-center justify-between min-h-[320px] shadow-lg relative overflow-hidden">
              <div className="w-full flex items-center justify-between border-b border-neutral-300/80 pb-4">
                <span className="font-extrabold tracking-wider text-sm text-[#353535] font-jakarta">
                  Resting State
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/5 text-neutral-700 font-medium">
                  Default
                </span>
              </div>

              <div className="py-8">
                <ElevatedUnderglowCTA
                  label="Book A Call"
                  icon="phone"
                  stateMode="standerd"
                  theme="figma"
                  size="md"
                />
              </div>

              <div className="text-xs text-neutral-600 text-center space-y-1 font-mono">
                <p>Flush resting cap • #DADADA bevel rim • Multi-tier clay shadows</p>
              </div>
            </div>

            {/* 2. Elevated State */}
            <div className="bg-[#E8E8E8] rounded-3xl border border-neutral-300 p-8 sm:p-12 flex flex-col items-center justify-between min-h-[320px] shadow-lg relative overflow-hidden">
              <div className="w-full flex items-center justify-between border-b border-neutral-300/80 pb-4">
                <span className="font-extrabold tracking-wider text-sm text-[#0077FF] font-jakarta flex items-center gap-2">
                  <span>Elevated (Hover)</span>
                  <span className="size-2 rounded-full bg-[#0077FF] animate-ping" />
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 font-medium">
                  Active
                </span>
              </div>

              <div className="py-8">
                <ElevatedUnderglowCTA
                  label="Book A Call"
                  icon="phone"
                  stateMode="hover"
                  theme="figma"
                  size="md"
                />
              </div>

              <div className="text-xs text-neutral-600 text-center space-y-1 font-mono">
                <p>13px Lift Elevation • Glowing #0077FF 3D Extrusion • Bottom Reflection</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            COLORWAYS PRESET GALLERY
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Underglow Colorways Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Object.keys(UNDERGLOW_THEMES) as ElevatedUnderglowTheme[]).map((key) => (
              <div
                key={key}
                onClick={() => setTheme(key)}
                className={`flex flex-col items-center justify-between p-6 rounded-3xl border transition-all duration-300 cursor-pointer hover:scale-[1.02] min-h-[220px] ${
                  theme === key
                    ? "bg-neutral-900 border-blue-500/80 shadow-xl shadow-blue-500/10"
                    : "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-neutral-300 truncate">
                    {UNDERGLOW_THEMES[key].name}
                  </span>
                  <span
                    className="size-3 rounded-full shrink-0 shadow-[0_0_8px_currentColor]"
                    style={{
                      backgroundColor: UNDERGLOW_THEMES[key].primaryColor,
                      color: UNDERGLOW_THEMES[key].primaryColor,
                    }}
                  />
                </div>

                <div className="py-4">
                  <ElevatedUnderglowCTA
                    label="Book A Call"
                    icon="phone"
                    stateMode="hover"
                    theme={key}
                    size="sm"
                  />
                </div>

                <span className="text-[11px] font-mono text-neutral-500">
                  {UNDERGLOW_THEMES[key].badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            CODE EXPORT TABS
           ───────────────────────────────────────────────────────────── */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveCodeTab("usage")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeCodeTab === "usage"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                React (Framer Motion)
              </button>
              <button
                type="button"
                onClick={() => setActiveCodeTab("css")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeCodeTab === "css"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                CSS Tokens (Figma 1:1)
              </button>
            </div>
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  activeCodeTab === "usage" ? usageCode : cssOnlyCode,
                  activeCodeTab
                )
              }
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
            >
              {copiedCode === activeCodeTab ? "✓ Copied!" : "Copy Code"}
            </button>
          </div>
          <pre className="p-6 text-xs font-mono text-neutral-300 overflow-x-auto bg-[#0a0c10] leading-relaxed">
            <code>{activeCodeTab === "usage" ? usageCode : cssOnlyCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
