"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  VintageLeatherCTA,
  VintageLeatherTheme,
  VintageLeatherSize,
} from "@/components/VintageLeatherCTA";

export default function VintageLeatherScreen() {
  const [theme, setTheme] = useState<VintageLeatherTheme>("heritage");
  const [size, setSize] = useState<VintageLeatherSize>("md");
  const [showOrnaments, setShowOrnaments] = useState(true);
  const [labelText, setLabelText] = useState("Shop ties");
  const [clickCount, setClickCount] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"usage" | "css">("usage");

  const THEMES: { id: VintageLeatherTheme; name: string; badge: string; color: string; desc: string }[] = [
    {
      id: "heritage",
      name: "Brass & Saddle (Figma)",
      badge: "Figma 1:1",
      color: "#B4986C",
      desc: "Warm brass and rich saddle leather gradient with dark mahogany bottom lip",
    },
    {
      id: "obsidian",
      name: "Obsidian Gold",
      badge: "Luxury Dark",
      color: "#D4AF37",
      desc: "Midnight charcoal graphite with etched 24k gold typography",
    },
    {
      id: "emerald",
      name: "British Racing Green",
      badge: "Gentleman Edition",
      color: "#10B981",
      desc: "Deep bespoke racing emerald with polished brass highlights",
    },
    {
      id: "ruby",
      name: "Burgundy Wine",
      badge: "Royal Crimson",
      color: "#F43F5E",
      desc: "Regal burgundy leather with warm bronze accents",
    },
    {
      id: "silver",
      name: "Brushed Titanium",
      badge: "Modern Luxury",
      color: "#A1A1AA",
      desc: "Sleek industrial titanium platinum with dark engraved letters",
    },
  ];

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(tabName);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const usageCode = `import { VintageLeatherCTA } from "@/components/VintageLeatherCTA";

export default function Example() {
  return (
    <VintageLeatherCTA
      theme="${theme}"
      size="${size}"
      showOrnaments={${showOrnaments}}
      label="${labelText}"
      onClick={() => console.log("Clicked Vintage Heritage CTA")}
    />
  );
}`;

  const cssOnlyCode = `/* Figma Node 14:304 - Vintage Heritage Button */

/* Outer Recessed Enclosure Tray */
.vintage-tray {
  padding: 6px 8px 8px 8px;
  background-color: rgba(113, 83, 49, 0.2);
  border-radius: 1px;
  box-shadow: inset 0px 0px 3px 0px rgba(0, 0, 0, 0.3);
}

/* 3D Embossed Leather / Brass Slab */
.vintage-slab {
  padding: 12px 54px 18px 54px;
  border-radius: 2px;
  background: linear-gradient(180deg, #B4986C 0%, #957851 100%);
  box-shadow:
    0px 54px 50px 0px rgba(55,42,12,0.33),
    0px 29.7px 31.9px 0px rgba(55,42,12,0.23),
    0px 19.7px 21.9px 0px rgba(55,42,12,0.23),
    0px 9.6px 8.7px 0px rgba(55,42,12,0.18),
    inset 0px 1px 0px 0px rgba(255, 255, 255, 0.5),
    inset 0px -6px 0px 0px #715331; /* 3D tactile bottom bevel */
}

/* Etched Letterpress Typography */
.vintage-text {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.6px;
  color: #E2DCD0;
  text-shadow: 0px -1.5px 0px rgba(0, 0, 0, 0.35);
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
          <span className="text-amber-400 font-medium">Vintage Leather CTA</span>
          <span className="ml-2 px-2 py-0.5 text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full">
            Figma 14:304
          </span>
        </div>

        {/* Header Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            Vintage Leather & Brass Heritage Button
            <span className="text-sm px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-normal">
              1:1 Figma Match
            </span>
          </h1>
          <p className="text-neutral-400 text-base max-w-2xl">
            Luxury Victorian & leather goods embossed tactile button with 6px bottom bevel lip, recessed enclosure tray, and filigree scrollwork corner ornaments.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            MAIN INTERACTIVE STAGE & PLAYGROUND
           ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Visual Stage (Node 14:304 Frame Background) */}
          <div
            className={`lg:col-span-8 flex flex-col items-center justify-center p-12 sm:p-24 rounded-3xl border shadow-2xl relative min-h-[460px] overflow-hidden transition-colors duration-500 ${
              theme === "obsidian"
                ? "bg-[#101216] border-white/10"
                : "border-white/20"
            }`}
          >
            {/* Ambient Background Canvas Gradient (Figma Node 14:304 exact) */}
            {theme !== "obsidian" && (
              <>
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(178.39deg, rgb(230, 224, 212) 23.424%, rgb(128, 124, 118) 160.49%)",
                  }}
                />
                {/* Random Small Square Pixel Canvas Noise (Figma Node 14:304 exact) */}
                <svg
                  className="absolute inset-0 size-full pointer-events-none opacity-[0.08] mix-blend-multiply"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id="canvasSquareNoise" width="32" height="32" patternUnits="userSpaceOnUse">
                      <rect x="4" y="5" width="2" height="2" fill="#4A3B2C" opacity="0.8" />
                      <rect x="15" y="11" width="2" height="2" fill="#4A3B2C" opacity="0.6" />
                      <rect x="26" y="4" width="2" height="2" fill="#4A3B2C" opacity="0.9" />
                      <rect x="20" y="22" width="2" height="2" fill="#4A3B2C" opacity="0.7" />
                      <rect x="8" y="26" width="2" height="2" fill="#4A3B2C" opacity="0.8" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#canvasSquareNoise)" />
                </svg>
              </>
            )}

            {/* The Live Interactive Button */}
            <div className="relative z-10 flex flex-col items-center gap-6">
              <VintageLeatherCTA
                theme={theme}
                size={size}
                showOrnaments={showOrnaments}
                label={labelText}
                onClick={() => setClickCount((c) => c + 1)}
              />

              {/* Click Counter Feedback */}
              <div
                className={`font-mono text-xs mt-6 transition-colors ${
                  theme === "obsidian" ? "text-neutral-400" : "text-neutral-700"
                }`}
              >
                Press Count: <span className="text-amber-600 font-bold">{clickCount}</span>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="lg:col-span-4 space-y-6 bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
              Live Customizer
            </h2>

            {/* Theme Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Luxury Theme Preset
              </label>
              <div className="space-y-1.5">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                      theme === t.id
                        ? "bg-neutral-800 text-white border-amber-500/80 shadow-md"
                        : "bg-neutral-800/30 text-neutral-400 border-neutral-700/50 hover:bg-neutral-800/60 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                      <span className="text-xs font-medium">{t.name}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/5">
                      {t.badge}
                    </span>
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
                {(["sm", "md", "lg"] as VintageLeatherSize[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`px-3 py-2 text-xs font-medium uppercase rounded-xl border transition-all ${
                      size === s
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                        : "bg-neutral-800/60 text-neutral-400 border-neutral-700 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Corner Ornaments Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/60">
              <span className="text-xs font-medium text-neutral-300">Corner Filigree Ornaments</span>
              <button
                type="button"
                onClick={() => setShowOrnaments(!showOrnaments)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  showOrnaments ? "bg-amber-500" : "bg-neutral-700"
                }`}
              >
                <span
                  className={`inline-block size-3.5 transform rounded-full bg-white transition-transform ${
                    showOrnaments ? "translate-x-4" : "translate-x-1"
                  }`}
                />
              </button>
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
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Enter button text..."
              />
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            ALL 5 THEMES SHOWCASE GALLERY
           ───────────────────────────────────────────────────────────── */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Luxury Theme Palette</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {THEMES.map((t) => (
              <div
                key={t.id}
                className={`flex flex-col items-center justify-between p-8 rounded-3xl border shadow-xl min-h-[220px] transition-all duration-300 hover:scale-[1.02] ${
                  t.id === "obsidian"
                    ? "bg-[#101216] border-white/10"
                    : "bg-gradient-to-b from-[#E6E0D4] to-[#B8B4AC] border-white/20"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`font-mono text-xs font-bold uppercase tracking-wider ${
                      t.id === "obsidian" ? "text-neutral-400" : "text-neutral-800"
                    }`}
                  >
                    {t.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/10 text-neutral-700 border border-black/5">
                    {t.badge}
                  </span>
                </div>

                <div className="py-6">
                  <VintageLeatherCTA theme={t.id} size="md" showOrnaments={showOrnaments} label={labelText} />
                </div>

                <p
                  className={`text-[11px] text-center max-w-xs ${
                    t.id === "obsidian" ? "text-neutral-400" : "text-neutral-700"
                  }`}
                >
                  {t.desc}
                </p>
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
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
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
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
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
