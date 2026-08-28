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
  const [activeCodeTab, setActiveCodeTab] = useState<"usage" | "css" | "framer">("usage");
  const [stageBg, setStageBg] = useState<"dark" | "charcoal" | "light">("dark");

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(tabName);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const usageCode = `import { IsometricReviveButton } from "@/components/IsometricReviveButton";

export default function Example() {
  return (
    <div className="flex items-center justify-center p-12 bg-[#1B1C20]">
      <IsometricReviveButton
        label="${labelText}"
        theme="${theme}"
        angle="${angle}"
        intensity="${intensity}"
        size="${size}"
        stateMode="${stateMode}"
        showGrid={${showGrid}}
        onClick={() => console.log("Revive triggered!")}
      />
    </div>
  );
}`;

  const cssOnlyCode = `/* Figma Nodes 115:5957 & 115:6002 Isometric Design System */

/* 1. Isometric Projection Matrix */
.isometric-stage {
  transform: rotate(30deg) skewX(-30deg) scaleY(0.866025);
  transform-origin: center center;
}

/* 2. STANDERD State (Node 115:5957) */
.isometric-btn-standerd {
  transform: translateY(-28px);
  background: #0D1015;
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.35);
}

/* 3. HOVER State with Underglow (Node 115:6002) */
.isometric-btn-hover {
  transform: translateY(0px);
  color: #FFFFFF;
  text-shadow: 0px 0px 8px rgba(255, 255, 255, 0.7);
}

.isometric-underglow-bed {
  background: #FFFFFF;
  filter: blur(18px);
  opacity: 0.95;
}`;

  const framerCode = `// Spring physics for authentic 3D button depression
<motion.div
  animate={{
    top: isHovered ? 216 : 186,
  }}
  transition={{
    type: "spring",
    stiffness: 450,
    damping: 28,
    mass: 0.75,
  }}
  className="absolute left-[180.88px] w-[225.168px] h-[138.728px]"
>
  <button style={{ transform: "rotate(30deg) skewX(-30deg) scaleY(0.866025)" }}>
    {/* 3D Button Face */}
  </button>
</motion.div>`;

  const bgStyles = {
    dark: "bg-[#1B1C20] text-white",
    charcoal: "bg-[#111317] text-white",
    light: "bg-[#E5E7EB] text-gray-900",
  };

  return (
    <main className="min-h-screen bg-[#0A0B0E] text-white font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Top Breadcrumb Navigation */}
      <nav className="border-b border-white/10 px-6 py-4 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/buttons"
              className="text-white/60 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Button Gallery
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-orange-400 font-medium">
              Isometric 3D Revive CTA
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Figma 1:1 Verified
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* Header Title Section */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
              Master Button Collection
            </span>
            <span className="text-xs text-white/40 font-mono">
              Nodes 115:5957 (STANDERD) & 115:6002 (HOVER)
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Isometric 3D Revive Button
          </h1>
          <p className="text-base text-white/60 max-w-3xl leading-relaxed">
            3D isometric button architecture engineered with true 30° projection geometry, multi-layer extrusion bevels, tactile spring physics, and customizable color themes, rotation angles, and lighting highlights.
          </p>
        </header>

        {/* ================================================================= */}
        {/* Interactive Studio Stage                                          */}
        {/* ================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white/90 flex items-center gap-2">
              <span className="size-2 rounded-full bg-orange-500" />
              Interactive 3D Studio Stage
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStageBg(stageBg === "dark" ? "charcoal" : stageBg === "charcoal" ? "light" : "dark")}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-colors"
              >
                Stage: {stageBg.toUpperCase()}
              </button>
              <button
                type="button"
                onClick={() => setShowGrid(!showGrid)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                  showGrid
                    ? "bg-orange-500/20 border-orange-500/40 text-orange-300"
                    : "bg-white/5 border-white/10 text-white/50"
                }`}
              >
                Isometric Grid: {showGrid ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          <div
            className={`relative rounded-3xl border border-white/10 overflow-hidden min-h-[640px] flex flex-col items-center justify-center transition-colors duration-500 ${bgStyles[stageBg]}`}
          >
            {/* Top Stage Badges */}
            <div className="absolute top-4 left-6 flex items-center gap-4 text-xs font-mono text-white/40">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Interactive Stage</span>
              </div>
              <span className="text-white/20">|</span>
              <div>
                Interactions:{" "}
                <span className="text-orange-400 font-bold">{clickCount}</span>
              </div>
            </div>

            {/* The 3D Button Component */}
            <div className="py-10 flex items-center justify-center">
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
            </div>

            {/* Bottom Controls Bar */}
            <div className="w-full bg-black/60 backdrop-blur-md border-t border-white/10 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* 1. State Mode */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
                    State Mode
                  </label>
                  <div className="flex gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10">
                    {(["interactive", "standerd", "hover"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setStateMode(mode)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                          stateMode === mode
                            ? "bg-orange-500 text-black font-semibold shadow-md"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        {mode === "standerd" ? "115:5957" : mode === "hover" ? "115:6002" : "Interactive"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Rotation Angle */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
                    Perspective Angle
                  </label>
                  <select
                    value={angle}
                    onChange={(e) => setAngle(e.target.value as IsometricReviveAngle)}
                    className="w-full py-2 px-3 text-xs bg-white/5 rounded-xl border border-white/10 text-white/90 focus:outline-none focus:border-orange-500"
                  >
                    {Object.entries(ANGLE_TRANSFORMS).map(([key, val]) => (
                      <option key={key} value={key} className="bg-[#1B1C20] text-white">
                        {val.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Color & Lighting Theme */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
                    Color & Light Preset
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as IsometricReviveTheme)}
                    className="w-full py-2 px-3 text-xs bg-white/5 rounded-xl border border-white/10 text-white/90 focus:outline-none focus:border-orange-500"
                  >
                    {Object.entries(ISOMETRIC_REVIVE_THEMES).map(([key, val]) => (
                      <option key={key} value={key} className="bg-[#1B1C20] text-white">
                        {val.name} ({val.badge})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Glow Intensity & Sizing */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
                    Glow Intensity
                  </label>
                  <div className="flex gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10">
                    {(["subtle", "vibrant", "hyper"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setIntensity(lvl)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                          intensity === lvl
                            ? "bg-white/20 text-white font-semibold border border-white/30"
                            : "text-white/50 hover:text-white"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Secondary Controls: Label & Sizing */}
              <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/50 font-mono">Label:</span>
                  <input
                    type="text"
                    value={labelText}
                    onChange={(e) => setLabelText(e.target.value)}
                    className="py-1 px-3 text-xs bg-white/5 rounded-lg border border-white/10 text-white focus:outline-none focus:border-orange-500"
                    placeholder="Revive Now"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/50 font-mono">Scale:</span>
                  <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                    {(["sm", "md", "lg"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`px-3 py-1 text-xs font-mono uppercase rounded-md transition-all ${
                          size === s
                            ? "bg-orange-500/30 text-orange-300 font-bold border border-orange-500/40"
                            : "text-white/50 hover:text-white"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* Color Presets Showcase Grid                                       */}
        {/* ================================================================= */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Color & Lighting Showcase
            </h2>
            <p className="text-sm text-white/60">
              Interactive 3D variations with tailored neon underglows, chassis finishes, and specular highlights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(
              [
                { t: "figma", title: "Figma Master Obsidian (1:1)", desc: "Deep onyx with pure white optical underglow and amber accent." },
                { t: "amber", title: "Cyber Amber Core", desc: "Warm high-visibility amber flare with bronze bevel reflections." },
                { t: "cyan", title: "Obsidian Cyan Pulse", desc: "Cyberpunk electric blue neon underglow on midnight chassis." },
                { t: "emerald", title: "Matrix Bio Emerald", desc: "Vibrant matrix emerald radiance with forest bevels." },
                { t: "violet", title: "Neon Ultraviolet", desc: "Deep synthwave purple underglow with violet highlights." },
                { t: "pearl-light", title: "Frosted Pearl Light", desc: "Clean ceramic white body with sky blue underglow." },
              ] as const
            ).map((item) => (
              <div
                key={item.t}
                onClick={() => setTheme(item.t as IsometricReviveTheme)}
                className={`group cursor-pointer rounded-2xl border p-6 bg-white/[0.02] hover:bg-white/[0.04] transition-all relative overflow-hidden flex flex-col items-center ${
                  theme === item.t ? "border-orange-500/60 ring-1 ring-orange-500/30" : "border-white/10"
                }`}
              >
                <div className="h-[280px] w-full flex items-center justify-center">
                  <IsometricReviveButton
                    label="Revive Now"
                    theme={item.t as IsometricReviveTheme}
                    angle={angle}
                    size="sm"
                    showGrid={false}
                  />
                </div>
                <div className="w-full text-left pt-4 border-t border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">
                      {ISOMETRIC_REVIVE_THEMES[item.t as IsometricReviveTheme].badge}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* Code & Integration Section                                        */}
        {/* ================================================================= */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Code & Implementation
              </h2>
              <p className="text-xs text-white/50">
                Plug-and-play React component with Tailwind CSS & Framer Motion.
              </p>
            </div>
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveCodeTab("usage")}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors ${
                  activeCodeTab === "usage"
                    ? "bg-orange-500 text-black font-bold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Usage.tsx
              </button>
              <button
                type="button"
                onClick={() => setActiveCodeTab("css")}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors ${
                  activeCodeTab === "css"
                    ? "bg-orange-500 text-black font-bold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Tokens.css
              </button>
              <button
                type="button"
                onClick={() => setActiveCodeTab("framer")}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors ${
                  activeCodeTab === "framer"
                    ? "bg-orange-500 text-black font-bold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Physics.ts
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-[#0D0E12] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/30">
              <span className="text-xs font-mono text-white/50">
                {activeCodeTab === "usage"
                  ? "components/Example.tsx"
                  : activeCodeTab === "css"
                  ? "styles/isometric.css"
                  : "motion/springs.ts"}
              </span>
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
                className="text-xs px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                {copiedCode === activeCodeTab ? "✓ Copied!" : "Copy Code"}
              </button>
            </div>
            <pre className="p-6 text-xs font-mono text-white/80 overflow-x-auto leading-relaxed">
              <code>
                {activeCodeTab === "usage"
                  ? usageCode
                  : activeCodeTab === "css"
                  ? cssOnlyCode
                  : framerCode}
              </code>
            </pre>
          </div>
        </section>
      </div>
    </main>
  );
}
