"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArcCornerToggle } from "@/components/ArcCornerToggle";

export default function ArcCornerToggleScreen() {
  const [active, setActive] = useState(false);
  const [speed, setSpeed] = useState(0.65);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"usage" | "css">("usage");
  const [toggleCount, setToggleCount] = useState(0);

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(tabName);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const usageCode = `import { ArcCornerToggle } from "@/components/ArcCornerToggle";

export default function Example() {
  return (
    <ArcCornerToggle
      duration={${speed}} // Speed control (in seconds)
      onToggle={(active) => console.log("Arc Toggle active:", active)}
    />
  );
}`;

  const cssOnlyCode = `/* Arc Corner Slider Toggle Design Tokens */

/* Light Mode Frame */
.arc-toggle-card-light {
  background: linear-gradient(149.54deg, rgb(240, 240, 240) 16.26%, rgb(163, 163, 161) 183.63%);
  border-radius: 40px;
}

/* Dark Mode Frame */
.arc-toggle-card-dark {
  background: linear-gradient(149.54deg, rgb(68, 81, 109) 16.26%, rgb(22, 27, 37) 183.63%);
  border-radius: 40px;
}

/* Centerline Arc Offset Path */
.arc-knob-path {
  offset-path: path("M 34.5 34.5 H 48.91 A 185.589 185.589 0 0 1 234.5 220.089 V 234.5");
  offset-rotate: auto;
  offset-anchor: 37px 35.5px;
  transition: offset-distance ${speed}s cubic-bezier(0.34, 1.3, 0.64, 1);
}`;

  const SPEED_PRESETS = [
    { label: "⚡ Snappy", value: 0.35 },
    { label: "✨ Normal", value: 0.65 },
    { label: "🌊 Smooth", value: 1.0 },
    { label: "🎬 Cinematic", value: 1.8 },
  ];

  return (
    <div className="min-h-screen bg-[#0E0E10] text-gray-100 selection:bg-[#ED45BE] selection:text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[500px] bg-pink-600/10 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <Link
            href="/buttons"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 transition-colors group"
          >
            <svg
              className="w-4 h-4 text-gray-400 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
            <span className="text-gray-300">Arc Corner Toggle</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-mono uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#ED45BE] animate-pulse" />
            Interactive Arc Slider
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-pink-300 font-sans">
            Arc Corner Slider Toggle
          </h1>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed font-sans">
            Interactive corner arc slider toggle with light and dark mode states, rotating capsule knob along a 90° circular track, sunken sunburst dial, and glowing laser flare.
          </p>
        </div>

        {/* Live Interactive Playground */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Stage */}
          <div className="lg:col-span-8 bg-black/40 border border-white/10 rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center min-h-[660px] relative backdrop-blur-xl overflow-hidden shadow-2xl">
            {/* Grid Pattern Background */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />

            {/* Toggle Status Indicator */}
            <div className="absolute top-6 left-6 flex items-center gap-3 z-30">
              <span className="text-xs font-mono uppercase text-gray-400">Mode:</span>
              <span
                className={`text-xs font-mono uppercase px-2.5 py-1 rounded-full font-semibold border ${
                  active
                    ? "bg-pink-500/20 text-pink-300 border-pink-500/30"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                }`}
              >
                {active ? "Active — Dark Mode" : "Resting — Light Mode"}
              </span>
            </div>

            {/* Toggle Counter & Current Speed */}
            <div className="absolute top-6 right-6 flex items-center gap-3 z-30 text-xs font-mono text-gray-400">
              <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                {speed}s
              </span>
              <span>Toggles:</span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold">{toggleCount}</span>
            </div>

            {/* The Live Arc Corner Toggle Component */}
            <div className="my-auto py-8">
              <ArcCornerToggle
                isActive={active}
                duration={speed}
                scale={0.88}
                onToggle={(next) => {
                  setActive(next);
                  setToggleCount((c) => c + 1);
                }}
              />
            </div>

            {/* Quick Hint */}
            <p className="text-xs text-gray-400 font-mono flex items-center gap-2 mt-4 z-30">
              <svg className="w-3.5 h-3.5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Click or drag the capsule knob to smoothly transition between Light and Dark mode
            </p>
          </div>

          {/* Controls & Configuration Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Control Panel */}
            <div className="bg-black/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-6 shadow-xl">
              <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
                <svg className="w-4 h-4 text-[#ED45BE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Controls & Speed
              </h2>

              {/* Theme State Switcher */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                  Toggle State
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActive(false);
                      setToggleCount((c) => c + 1);
                    }}
                    className={`px-3 py-3 rounded-xl text-xs font-medium border transition-all flex flex-col items-center gap-1 ${
                      !active
                        ? "bg-white/15 border-white/30 text-white shadow-lg"
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    <span className="font-bold">Light Mode</span>
                    <span className="text-[10px] text-gray-400">Day / Resting</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActive(true);
                      setToggleCount((c) => c + 1);
                    }}
                    className={`px-3 py-3 rounded-xl text-xs font-medium border transition-all flex flex-col items-center gap-1 ${
                      active
                        ? "bg-pink-500/20 border-pink-500/40 text-pink-300 shadow-lg"
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    <span className="font-bold">Dark Mode</span>
                    <span className="text-[10px] text-gray-400">Night / Active</span>
                  </button>
                </div>
              </div>

              {/* Animation Speed Control Slider */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Travel Duration
                  </label>
                  <span className="text-xs font-mono text-pink-300 font-bold px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20">
                    {speed}s
                  </span>
                </div>

                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.05"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ED45BE]"
                />

                {/* Speed Presets */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {SPEED_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setSpeed(preset.value)}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-mono border transition-all ${
                        speed === preset.value
                          ? "bg-pink-500/25 border-pink-500/40 text-pink-200"
                          : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="pt-4 border-t border-white/10 space-y-2 text-xs font-mono text-gray-400">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Travel Engine</span>
                  <span className="text-pink-300 font-medium">SVG offset-path</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Track Radius</span>
                  <span className="text-gray-200">185.59px Fillet</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Anchor Offset</span>
                  <span className="text-gray-200">(37px, 35.5px)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Laser Bloom</span>
                  <span className="text-gray-200">42px Mask Blur</span>
                </div>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="bg-black/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab("usage")}
                    className={`text-xs font-mono px-3 py-1 rounded-lg transition-colors ${
                      activeCodeTab === "usage"
                        ? "bg-white/15 text-white font-bold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    React
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab("css")}
                    className={`text-xs font-mono px-3 py-1 rounded-lg transition-colors ${
                      activeCodeTab === "css"
                        ? "bg-white/15 text-white font-bold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    CSS Tokens
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
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-mono text-gray-300 flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode === activeCodeTab ? (
                    <>
                      <span className="text-green-400">✓</span> Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>

              <pre className="text-xs font-mono text-gray-300 overflow-x-auto p-3 rounded-xl bg-black/60 border border-white/5 leading-relaxed">
                <code>{activeCodeTab === "usage" ? usageCode : cssOnlyCode}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Side-by-Side Dual Variant Visual Gallery */}
        <div className="space-y-6 pt-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white font-sans">
              State Comparison
            </h2>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/10 text-gray-400 font-normal">
              Day Mode vs Night Mode
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Light Mode */}
            <div className="bg-black/30 border border-white/10 rounded-3xl p-6 flex flex-col items-center gap-3 overflow-hidden">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider self-start">
                Light Mode — Resting State
              </span>
              <div className="w-full flex items-center justify-center overflow-hidden rounded-2xl">
                <ArcCornerToggle
                  isActive={false}
                  themeMode="light"
                  scale={0.88}
                  showHeader={true}
                  duration={speed}
                />
              </div>
            </div>

            {/* Dark Mode */}
            <div className="bg-black/30 border border-white/10 rounded-3xl p-6 flex flex-col items-center gap-3 overflow-hidden">
              <span className="text-xs font-mono text-pink-300 uppercase tracking-wider self-start">
                Dark Mode — Active State
              </span>
              <div className="w-full flex items-center justify-center overflow-hidden rounded-2xl">
                <ArcCornerToggle
                  isActive={true}
                  themeMode="dark"
                  scale={0.88}
                  showHeader={true}
                  duration={speed}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
