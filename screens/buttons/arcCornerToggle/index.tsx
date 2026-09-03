"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArcCornerToggle,
  ArcToggleStateMode,
} from "@/components/ArcCornerToggle";
import StudioCanvas from "@/components/StudioCanvas";
import PageWrapper from "@/components/PageWrapper";
import GlobalCTA from "@/components/GlobalCTA";

export default function ArcCornerToggleScreen() {
  const [active, setActive] = useState(false);
  const [speed, setSpeed] = useState(0.65);
  const [trackStyle, setTrackStyle] = useState<"arc" | "line">("arc");
  const [size, setSize] = useState<"xs" | "sm" | "md" | "lg" | "xl">("md");
  const [stateMode, setStateMode] = useState<ArcToggleStateMode>("interactive");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"component" | "usage" | "css">("component");
  const [toggleCount, setToggleCount] = useState(0);
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

export interface ArcCornerToggleProps {
  isActive?: boolean;
  onToggle?: (active: boolean) => void;
  duration?: number;
  className?: string;
}

export function ArcCornerToggle({
  isActive: controlledActive,
  onToggle,
  duration = 0.65,
  className = "",
}: ArcCornerToggleProps) {
  const [internalActive, setInternalActive] = useState(false);
  const active = controlledActive !== undefined ? controlledActive : internalActive;

  const handleToggle = () => {
    const next = !active;
    if (controlledActive === undefined) setInternalActive(next);
    if (onToggle) onToggle(next);
  };

  return (
    <div
      onClick={handleToggle}
      className={\`relative w-[280px] h-[280px] rounded-[40px] p-6 cursor-pointer select-none transition-colors duration-500 flex flex-col justify-between \${
        active
          ? "bg-gradient-to-br from-[#44516D] to-[#161B25] text-white shadow-2xl"
          : "bg-gradient-to-br from-[#F0F0F0] to-[#A3A3A1] text-gray-800 shadow-xl"
      } \${className}\`}
    >
      <div className="flex justify-between items-center text-xs font-mono tracking-widest uppercase opacity-70">
        <span>{active ? "Dark Mode" : "Light Mode"}</span>
        <span>{active ? "ON" : "OFF"}</span>
      </div>

      {/* SVG Arc Track */}
      <div className="relative w-full h-[180px] flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 260 260" fill="none">
          <path
            d="M 34.5 34.5 H 48.91 A 185.589 185.589 0 0 1 234.5 220.089 V 234.5"
            stroke={active ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}
            strokeWidth="38"
            strokeLinecap="round"
          />
        </svg>

        {/* Floating Knob */}
        <motion.div
          animate={{
            x: active ? 70 : -70,
            y: active ? 70 : -70,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
          className={\`absolute w-12 h-12 rounded-full shadow-lg flex items-center justify-center \${
            active ? "bg-[#FF4081] text-white" : "bg-white text-gray-700"
          }\`}
        >
          <span className="w-3 h-3 rounded-full bg-current" />
        </motion.div>
      </div>

      <div className="text-[11px] font-mono opacity-50 text-center">
        Click to toggle state
      </div>
    </div>
  );
}

export default ArcCornerToggle;`;

  const usageCode = `import { ArcCornerToggle } from "@/components/ArcCornerToggle";

export default function Example() {
  return (
    <ArcCornerToggle
      duration={${speed}}
      onToggle={(active) => console.log("Arc Toggle active:", active)}
    />
  );
}`;

  const cssOnlyCode = `/* Arc Corner Slider Toggle Design Tokens */
.arc-toggle-card-light {
  background: linear-gradient(149.54deg, rgb(240, 240, 240) 16.26%, rgb(163, 163, 161) 183.63%);
  border-radius: 40px;
}

.arc-toggle-card-dark {
  background: linear-gradient(149.54deg, rgb(68, 81, 109) 16.26%, rgb(22, 27, 37) 183.63%);
  border-radius: 40px;
}

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
    <PageWrapper showFloatingButton={false}>
      <div className="relative overflow-hidden min-h-screen bg-[#0E0E10] text-gray-100 selection:bg-[#FF5B04] selection:text-white pt-6 pb-20">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Header section */}
          <header className="text-center space-y-4 max-w-3xl mx-auto pt-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#FF4081] animate-pulse" />
              <span>Radial Centerline Offset Path</span>
              <span className="text-gray-500">•</span>
              <span className="text-[#FF5B04]">React + Framer Motion</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-jakarta">
              Arc Corner Slider <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300">Curved Toggle</span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              Curved quadrant arc corner toggle button engineered with true 185.6px radial arc offset-path tracking, day/night gradient themes, and physical spring damping.
            </p>
          </header>

        {/* Live Interactive Studio / Sandbox */}
        <div className="bg-[#151518] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <StudioCanvas minHeight="min-h-[460px]" hint={`Toggle count: ${toggleCount}`}>
            <ArcCornerToggle
              isActive={active}
              stateMode={stateMode}
              onToggle={(next) => {
                setActive(next);
                setToggleCount((c) => c + 1);
              }}
              scale={0.62}
              size={size}
              duration={speed}
              track={trackStyle}
              showHeader={true}
            />
          </StudioCanvas>
        </div>

        {/* Customizer */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/70 font-mono">Customizer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Size</label>
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
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Track Style</label>
              <select
                value={trackStyle}
                onChange={(e) => setTrackStyle(e.target.value as "arc" | "line")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="arc" className="bg-[#151518] text-white">Corner Arc</option>
                <option value="line" className="bg-[#151518] text-white">Straight Line</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">Animation Speed</label>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              >
                {SPEED_PRESETS.map((p) => (
                  <option key={p.value} value={p.value} className="bg-[#151518] text-white">
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-gray-400 uppercase tracking-wider block">State Preview</label>
              <select
                value={stateMode}
                onChange={(e) => setStateMode(e.target.value as ArcToggleStateMode)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="interactive" className="bg-[#151518] text-white">Interactive</option>
                <option value="standerd" className="bg-[#151518] text-white">Standard</option>
                <option value="hover" className="bg-[#151518] text-white">Click</option>
              </select>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            ALL VARIANTS & STYLES PREVIEW CARD
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#ED45BE] mb-1.5">
                <span>PRESETS &amp; VARIATIONS</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">All Variants Preview</h2>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Click any toggle to test distinct interactive states &amp; speeds
            </p>
          </div>

          <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Light Mode Standard */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-between min-h-[360px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Light Mode (OFF)</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-400">themeMode=&quot;light&quot;</span>
                </div>
                <div className="flex items-center justify-center my-2">
                  <ArcCornerToggle
                    scale={0.5}
                    duration={0.65}
                    themeMode="light"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Clay light surface with matte dark track contour</span>
              </div>

              {/* Dark Mode Active */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-between min-h-[360px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Dark Mode (ON)</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-400">themeMode=&quot;dark&quot;</span>
                </div>
                <div className="flex items-center justify-center my-2">
                  <ArcCornerToggle
                    scale={0.5}
                    duration={0.65}
                    isActive={true}
                    themeMode="dark"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Obsidian chassis with glowing magenta laser flare</span>
              </div>

              {/* Snappy Spring */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-between min-h-[360px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">⚡ Snappy Response</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-400">duration=0.35s</span>
                </div>
                <div className="flex items-center justify-center my-2">
                  <ArcCornerToggle
                    scale={0.5}
                    duration={0.35}
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">High-velocity snap transition for instant tactile feel</span>
              </div>

              {/* Straight Line — Light */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-between min-h-[360px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Straight Line (OFF)</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-[#ED45BE]">track=&quot;line&quot;</span>
                </div>
                <div className="flex items-center justify-center my-2">
                  <ArcCornerToggle scale={0.5} duration={0.6} track="line" themeMode="light" />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Linear horizontal groove — knob slides left ➜ right, no rotation</span>
              </div>

              {/* Straight Line — Dark Active */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-between min-h-[360px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Straight Line (ON)</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-[#ED45BE]">track=&quot;line&quot;</span>
                </div>
                <div className="flex items-center justify-center my-2">
                  <ArcCornerToggle scale={0.5} duration={0.6} track="line" isActive={true} themeMode="dark" />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Straight track with the magenta matte laser trail filled</span>
              </div>

              {/* Cinematic Slow */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-between min-h-[360px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">🎬 Cinematic Glide</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-400">duration=1.8s</span>
                </div>
                <div className="flex items-center justify-center my-2">
                  <ArcCornerToggle scale={0.5} duration={1.8} />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Long, weighty easing for a dramatic slow-motion sweep</span>
              </div>

              {/* Headless */}
              <div className="bg-[#101012] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-between min-h-[360px] overflow-x-clip transition-all hover:border-white/15">
                <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                  <span className="text-white font-semibold">Minimal (no header)</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-400">showHeader={"{false}"}</span>
                </div>
                <div className="flex items-center justify-center my-2">
                  <ArcCornerToggle scale={0.5} duration={0.65} showHeader={false} />
                </div>
                <span className="text-[11px] font-mono text-gray-500 text-center">Bare toggle with the STANDERD / CLICK label row hidden</span>
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
              className="text-xs font-mono text-pink-400 hover:text-pink-300 transition-colors"
            >
              {copiedCode === activeCodeTab ? "✓ Copied to Clipboard" : "Copy Active Tab Code"}
            </button>
          </div>

          <div className="bg-[#151518] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white font-mono">
                  {activeCodeTab === "component" ? "ArcCornerToggle.tsx" : activeCodeTab === "usage" ? "Usage.tsx" : "Tokens.css"}
                </span>
                <span className="text-xs text-gray-500 font-mono">• Production Ready</span>
              </div>

              <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
                <button
                  onClick={() => setActiveCodeTab("component")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "component" ? "bg-[#FF5B04] text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Component.tsx
                </button>
                <button
                  onClick={() => setActiveCodeTab("usage")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "usage" ? "bg-[#FF5B04] text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Usage.tsx
                </button>
                <button
                  onClick={() => setActiveCodeTab("css")}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    activeCodeTab === "css" ? "bg-[#FF5B04] text-white" : "text-gray-400 hover:text-white"
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
                    <td className="py-3 px-6 text-pink-400 font-semibold">isActive</td>
                    <td className="py-3 px-6 text-blue-300">boolean</td>
                    <td className="py-3 px-6 text-gray-400">false</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Controlled active state boolean</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-pink-400 font-semibold">duration</td>
                    <td className="py-3 px-6 text-blue-300">number</td>
                    <td className="py-3 px-6 text-gray-400">0.65</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Animation transition duration in seconds</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-pink-400 font-semibold">onToggle</td>
                    <td className="py-3 px-6 text-blue-300">(active: boolean) =&gt; void</td>
                    <td className="py-3 px-6 text-gray-400">undefined</td>
                    <td className="py-3 px-6 font-sans text-gray-300">Callback fired upon toggling state</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Website Global CTA */}
        <GlobalCTA topic="arc corner toggles or micro-interaction controls" />
      </div>
    </div>
  </PageWrapper>
  );
}
