"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ScalingCapsuleButton, {
  ScalingCapsuleVariant,
} from "@/components/ScalingCapsuleButton";

export default function ScalingCapsuleButtonScreen() {
  const [label, setLabel] = useState("Scaling Workshop");
  const [variant, setVariant] = useState<ScalingCapsuleVariant>("dark");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [clickCount, setClickCount] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"usage" | "css">("usage");

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(tabName);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const usageCode = `import { ScalingCapsuleButton } from "@/components/ScalingCapsuleButton";

export default function Example() {
  return (
    <ScalingCapsuleButton
      label="${label}"
      variant="${variant}"
      size="${size}"
      onClick={() => console.log("Clicked Scaling Workshop!")}
    />
  );
}`;

  const cssOnlyCode = `/* Figma Exact Node 118:6091 CSS Specs */
.capsule-halo-tray {
  padding: 6px;
  border-radius: 50px;
  background: rgba(209, 213, 236, 0.14);
  box-shadow: 
    0px 1.5px 0px 0px #FFFFFF,
    inset 0px 0px 2px 0px rgba(0, 0, 0, 0.4);
}

.capsule-cap {
  background: #343434;
  border-radius: 24px;
  padding: 1px 1px 3px 30px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow:
    inset 0px 2px 0px 0px rgba(255, 255, 255, 0.25),
    inset 0px -5px 0px 0px rgba(160, 160, 160, 0.2),
    inset 0px 1px 0px 0px rgba(255, 255, 255, 0.8),
    inset 0px -4px 0px 0px #000000;
  filter: drop-shadow(0px 3px 3px rgba(0,0,0,0.14))
          drop-shadow(0px 6.6px 5.3px rgba(0,0,0,0.13))
          drop-shadow(0px 12.5px 10px rgba(0,0,0,0.14))
          drop-shadow(0px 22.3px 17.9px rgba(0,0,0,0.14))
          drop-shadow(0px 41.8px 33.4px rgba(0,0,0,0.15))
          drop-shadow(0px 100px 80px rgba(0,0,0,0.15));
}

.capsule-knob-circle {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(180deg, #1B1B1B 0%, #343434 100%);
}

.capsule-inner-black-ellipse {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #000000;
}`;

  return (
    <div className="min-h-screen bg-[#0E0E10] text-gray-100 selection:bg-[#FF5B04] selection:text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#FF5B04]/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#00E5BE]/10 rounded-full blur-[120px]" />
        <div className="absolute top-2/3 right-1/4 w-[500px] h-[400px] bg-purple-600/10 rounded-full blur-[140px]" />
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
            <span className="text-[#FF5B04]">Scaling Capsule</span>
          </div>
        </div>

        {/* Header section */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#FF5B04] animate-pulse" />
            <span>Figma Dev Mode Master Collection</span>
            <span className="text-gray-500">•</span>
            <span className="text-[#00E5BE]">Node 118:6091</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-jakarta">
            Scaling Capsule <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">Tactile Button</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            Pixel-perfect implementation of Figma Node 118:6091. Engineered with a frosted translucent halo cavity tray, multi-tier elevation drop shadows, specular bevel insets, and an embedded 26px circular black badge with ladder-rung apex emblem.
          </p>

          {/* Figma Reference Link */}
          <div className="flex justify-center pt-2">
            <a
              href="https://www.figma.com/design/N0Thti7tlzePyLvZChPMd2/Master-Button-collection--Community-?node-id=118-6091&m=dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 transition-colors"
            >
              <svg className="w-4 h-4 text-[#FF5B04]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 2a4 4 0 0 0-4 4 4 4 0 0 0 4 4h4V2H8zm8 0h-4v8h4a4 4 0 0 0 0-8zM8 10a4 4 0 0 0-4 4 4 4 0 0 0 4 4h4v-8H8zm8 0h-4v8h4a4 4 0 0 0 0-8zm-8 8a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4v-4H8z" />
              </svg>
              <span>Inspect Figma Node 118:6091 (Dev Mode)</span>
              <span className="text-gray-500">↗</span>
            </a>
          </div>
        </div>

        {/* Live Interactive Studio / Sandbox */}
        <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              </div>
              <span className="text-sm font-semibold text-gray-300 font-mono">
                Interactive Capsule Playground
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  handleCopy(
                    activeCodeTab === "usage" ? usageCode : cssOnlyCode,
                    activeCodeTab
                  )
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
              >
                {copiedCode === activeCodeTab ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy Component Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Stage */}
          <div
            className={`relative min-h-[360px] flex flex-col items-center justify-center p-8 transition-colors duration-500 ${
              variant === "light"
                ? "bg-[#F5F5F5]"
                : variant === "orange"
                ? "bg-[#1C0C04]"
                : variant === "cyberpunk"
                ? "bg-[#060911]"
                : "bg-[#F5F5F5]"
            }`}
          >
            <div className="relative z-10 scale-110 sm:scale-125 transition-transform">
              <ScalingCapsuleButton
                label={label}
                variant={variant}
                size={size}
                onClick={() => setClickCount((prev) => prev + 1)}
              />
            </div>

            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
              <p
                className={`text-xs font-mono transition-colors ${
                  variant === "light" || variant === "dark"
                    ? "text-gray-600"
                    : "text-gray-400"
                }`}
              >
                Hover to lift button cap • Click for tactile depth press
                {clickCount > 0 && ` • Clicked ${clickCount} time${clickCount > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 sm:p-8 bg-[#121215] border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Control 1: Label */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Button Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5B04] transition-colors"
                placeholder="Button text..."
              />
            </div>

            {/* Control 2: Variant */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Theme Variant
              </label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value as ScalingCapsuleVariant)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5B04] transition-colors"
              >
                <option value="dark" className="bg-[#18181B] text-white">Figma Dark (Node 118:6091)</option>
                <option value="orange" className="bg-[#18181B] text-white">Brand Orange</option>
                <option value="light" className="bg-[#18181B] text-white">Clean Light</option>
                <option value="cyberpunk" className="bg-[#18181B] text-white">Cyberpunk Neon</option>
              </select>
            </div>

            {/* Control 3: Size */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Size Scale
              </label>
              <div className="flex gap-2">
                {(["sm", "md", "lg"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`flex-1 py-2.5 rounded-xl uppercase font-mono text-xs transition-all ${
                      size === s
                        ? "bg-[#FF5B04] text-white font-bold shadow-md shadow-[#FF5B04]/30"
                        : "bg-black/50 border border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Colorway Presets Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white font-jakarta text-center">
            Theme Presets &amp; Use Cases
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Figma Master (Node 118:6091)",
                label: "Scaling Workshop",
                variant: "dark" as const,
                desc: "Original #343434 matte cap with 26px black circle badge",
              },
              {
                title: "UI Pirate Brand Edition",
                label: "Launch Workshop",
                variant: "orange" as const,
                desc: "High energy brand orange with deep cavity glow",
              },
              {
                title: "Porcelain Minimalist",
                label: "Start Scaling",
                variant: "light" as const,
                desc: "Clean light ceramic cap for bright SaaS products",
              },
              {
                title: "Cyberpunk Apex",
                label: "Deploy Node",
                variant: "cyberpunk" as const,
                desc: "Deep obsidian cap with cyan rim and glowing icon",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-[#151518] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between gap-6 hover:border-white/20 transition-colors"
              >
                <div className="w-full text-left">
                  <h3 className="text-sm font-semibold text-white">{card.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{card.desc}</p>
                </div>

                <div className="py-3 flex items-center justify-center">
                  <ScalingCapsuleButton
                    label={card.label}
                    variant={card.variant}
                    size="sm"
                  />
                </div>

                <div className="w-full flex items-center justify-between text-[11px] text-gray-500 font-mono border-t border-white/5 pt-3">
                  <span>variant: {card.variant}</span>
                  <span className="text-gray-400">Node 118:6091</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Exporter */}
        <div className="bg-[#151518] border border-white/10 rounded-3xl overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white font-mono">Code Export</span>
              <span className="text-xs text-gray-500 font-mono">• Next.js &amp; Tailwind</span>
            </div>

            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
              <button
                onClick={() => setActiveCodeTab("usage")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeCodeTab === "usage"
                    ? "bg-[#FF5B04] text-white font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Usage Example
              </button>
              <button
                onClick={() => setActiveCodeTab("css")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeCodeTab === "css"
                    ? "bg-[#FF5B04] text-white font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Pure CSS Specs
              </button>
            </div>
          </div>

          <div className="p-6 bg-[#0B0B0D] overflow-x-auto">
            <pre className="text-xs sm:text-sm font-mono text-gray-300 leading-relaxed">
              <code>{activeCodeTab === "usage" ? usageCode : cssOnlyCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
