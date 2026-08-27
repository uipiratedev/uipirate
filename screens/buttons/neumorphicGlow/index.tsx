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
  const [activeCodeTab, setActiveCodeTab] = useState<"usage" | "css">("usage");

  const THEMES: { id: NeumorphicGlowTheme; name: string; badge: string; color: string; desc: string }[] = [
    {
      id: "uipirate",
      name: "UI Pirate",
      badge: "Brand Edition",
      color: "#FF5B04",
      desc: "Deep obsidian ember body with high-voltage UI Pirate neon orange glow",
    },
    {
      id: "default",
      name: "Clay Light (Figma)",
      badge: "Figma 1:1",
      color: "#49C33E",
      desc: "Original Figma master style with warm grey clay & neon green glow badge",
    },
    {
      id: "dark",
      name: "Obsidian Slate",
      badge: "Dark Mode",
      color: "#06B6D4",
      desc: "Deep carbon graphite pill with electric cyan neon badge",
    },
    {
      id: "orange",
      name: "Pirate Orange",
      badge: "High Energy",
      color: "#FF5B04",
      desc: "Vibrant UI Pirate signature orange with warm gold glow",
    },
    {
      id: "cyberpunk",
      name: "Cyberpunk Violet",
      badge: "Neon Glow",
      color: "#C084FC",
      desc: "Midnight purple obsidian with intense ultraviolet glow",
    },
    {
      id: "minimal",
      name: "Frost Minimal",
      badge: "Clean Light",
      color: "#18181B",
      desc: "Pure porcelain white with subtle titanium monochrome arrow",
    },
  ];

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(tabName);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const usageCode = `import { NeumorphicGlowCTA } from "@/components/NeumorphicGlowCTA";

export default function Example() {
  return (
    <NeumorphicGlowCTA
      variant="${variant}"
      theme="${theme}"
      size="${size}"${neonPreset !== "auto" ? `\n      neonPreset="${neonPreset}"` : ""}
      label="${labelText}"
      onClick={() => console.log("Clicked Neumorphic CTA")}
    />
  );
}`;

  const cssOnlyCode = `/* Figma Nodes 14:642 & 14:669 Design Tokens */

/* 1. Pill Variant (14:642 - Learn more) */
.neumorphic-pill-btn {
  padding: 20px 40px 20px 20px;
  border-radius: 40px;
  background-image: linear-gradient(172.34deg, rgb(225, 225, 225) 5.985%, rgb(215, 215, 215) 94.894%);
  box-shadow:
    2px 4px 4px 0px rgba(0,0,0,0.1),
    85px 85px 85px 0px rgba(0,0,0,0.09),
    35.5px 35.5px 35.5px 0px rgba(0,0,0,0.06),
    inset 2px 2px 4px 0px rgba(255,255,255,0.15),
    inset 4px 4px 14px 0px rgba(255,255,255,0.75),
    inset -4px -4px 4px 0px rgba(0,0,0,0.08),
    inset -10px -10px 14px -6px rgba(0,0,0,0.15);
}

/* Glowing Neon Badge (14:723) */
.neon-badge-pill {
  padding: 13px;
  border-radius: 45.5px;
  background-color: #CBF0CD;
  box-shadow:
    0px 0px 26px 0px rgba(90,255,75,0.3),
    0px 1.3px 1.3px 0px rgba(255,255,255,0.85),
    0px -1.3px 1.3px 0px rgba(0,0,0,0.1),
    inset 2.6px 5.2px 6.5px 0px rgba(51,217,37,0.35);
}

/* 2. Squircle Variant (14:669 - Get more info) */
.neumorphic-squircle-btn {
  padding: 8px 8px 8px 18px;
  border-radius: 10px;
  background-color: #E1E1E1;
  box-shadow:
    -6px -6px 6px 3px rgba(255,255,255,0.4),
    6px -6px 6px 3px rgba(205,205,205,0.4),
    -6px 6px 6px 3px rgba(205,205,205,0.4),
    6px 6px 6px 3px rgba(0,0,0,0.15),
    0px 0px 60px 30px #e1e1e1;
}`;

  return (
    <div className="min-h-screen bg-[#0E1117] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Link href="/buttons" className="hover:text-white transition-colors">
            Buttons
          </Link>
          <span>/</span>
          <span className="text-emerald-400 font-medium">Neumorphic Glow CTA</span>
          <span className="ml-2 px-2 py-0.5 text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full">
            Figma 14:642 & 14:669
          </span>
        </div>

        {/* Header Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            Claymorphic & Neumorphic Glow CTA
            <span className="text-sm px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-normal">
              Neon Customizer
            </span>
          </h1>
          <p className="text-neutral-400 text-base max-w-2xl">
            Authentic multi-tier claymorphic and neumorphic elevated buttons from Figma Master Button Collection with glowing neon badge depth and customizable arrow glow presets.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            MAIN INTERACTIVE STAGE & PLAYGROUND
           ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Visual Stage */}
          <div
            className={`lg:col-span-7 flex flex-col items-center justify-center p-12 sm:p-20 rounded-3xl border shadow-2xl relative min-h-[460px] overflow-hidden transition-colors duration-500 ${
              theme === "dark" || theme === "cyberpunk"
                ? "bg-[#12141A] border-white/10"
                : "bg-[rgba(238,238,238,0.94)] border-white/20"
            }`}
          >
            {/* Ambient Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#88888812_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* The Live Interactive Button */}
            <div className="relative z-10 flex flex-col items-center gap-6">
              <NeumorphicGlowCTA
                variant={variant}
                theme={theme}
                size={size}
                neonPreset={neonPreset === "auto" ? undefined : neonPreset}
                label={labelText}
                onClick={() => setClickCount((c) => c + 1)}
              />

              {/* Click Counter Feedback */}
              <div
                className={`font-mono text-xs mt-4 transition-colors ${
                  theme === "dark" || theme === "cyberpunk" ? "text-neutral-400" : "text-neutral-500"
                }`}
              >
                Clicks: <span className="text-emerald-500 font-bold">{clickCount}</span>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="lg:col-span-5 space-y-6 bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Customizer
            </h2>

            {/* Shape Variant Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Shape Structure
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setVariant("pill");
                    setLabelText("Learn more");
                  }}
                  className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                    variant === "pill"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                      : "bg-neutral-800/60 text-neutral-400 border-neutral-700 hover:text-white"
                  }`}
                >
                  Pill (14:642)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVariant("squircle");
                    setLabelText("Get more info");
                  }}
                  className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                    variant === "squircle"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                      : "bg-neutral-800/60 text-neutral-400 border-neutral-700 hover:text-white"
                  }`}
                >
                  Squircle (14:669)
                </button>
              </div>
            </div>

            {/* Neon Arrow Circle & Glow Color Preset Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                <span>Neon Arrow Circle & Glow</span>
                <span className="text-[11px] text-emerald-400 font-mono">
                  {neonPreset === "auto" ? "Theme Match" : NEON_PRESETS[neonPreset].name}
                </span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setNeonPreset("auto")}
                  className={`flex items-center justify-center p-2 rounded-xl border text-xs font-medium transition-all ${
                    neonPreset === "auto"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/80 shadow-md"
                      : "bg-neutral-800/40 text-neutral-400 border-neutral-700/60 hover:text-white"
                  }`}
                >
                  Auto (Theme)
                </button>
                {(Object.keys(NEON_PRESETS) as NeumorphicNeonPreset[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setNeonPreset(key)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all ${
                      neonPreset === key
                        ? "bg-neutral-800 text-white border-emerald-500/80 shadow-md"
                        : "bg-neutral-800/40 text-neutral-400 border-neutral-700/60 hover:text-white"
                    }`}
                  >
                    <span
                      className="size-3 rounded-full shrink-0 shadow-[0_0_8px_currentColor]"
                      style={{
                        backgroundColor: NEON_PRESETS[key].arrowColor,
                        color: NEON_PRESETS[key].arrowColor,
                      }}
                    />
                    <span className="truncate">{NEON_PRESETS[key].name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Body Theme Preset
              </label>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                      theme === t.id
                        ? "bg-neutral-800 text-white border-emerald-500/80 shadow-md"
                        : "bg-neutral-800/30 text-neutral-400 border-neutral-700/50 hover:bg-neutral-800/60 hover:text-white"
                    }`}
                  >
                    <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                    <span className="text-xs font-medium truncate">{t.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Button Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["sm", "md", "lg"] as NeumorphicGlowSize[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`px-3 py-2 text-xs font-medium uppercase rounded-xl border transition-all ${
                      size === s
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                        : "bg-neutral-800/60 text-neutral-400 border-neutral-700 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Label Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Button Label
              </label>
              <input
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Enter button text..."
              />
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            ALL NEON GLOW PRESETS GALLERY
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Neon Arrow Circle Color Palette</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Object.keys(NEON_PRESETS) as NeumorphicNeonPreset[]).map((key) => (
              <div
                key={key}
                className="flex flex-col items-center justify-between p-6 rounded-3xl bg-[rgba(238,238,238,0.94)] border border-white/20 shadow-xl min-h-[190px] transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-600">
                    {NEON_PRESETS[key].name}
                  </span>
                  <span
                    className="size-3 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{
                      backgroundColor: NEON_PRESETS[key].arrowColor,
                      color: NEON_PRESETS[key].arrowColor,
                    }}
                  />
                </div>

                <div className="py-4">
                  <NeumorphicGlowCTA
                    variant={variant}
                    theme={theme}
                    size="md"
                    neonPreset={key}
                    label={labelText}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            CODE EXPORT TABS
           ───────────────────────────────────────────────────────────── */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveCodeTab("usage")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeCodeTab === "usage"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
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
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                CSS Tokens (Figma 1:1)
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(activeCodeTab === "usage" ? usageCode : cssOnlyCode, activeCodeTab)}
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
