"use client";

import React, { useState } from "react";
import Link from "next/link";
import SmashTactileButton, {
  SmashButtonVariant,
} from "@/components/SmashTactileButton";

export default function SmashTactileButtonScreen() {
  const [label, setLabel] = useState("Smash the button");
  const [variant, setVariant] = useState<SmashButtonVariant>("figma");
  const [size, setSize] = useState<"sm" | "md" | "lg" | "hero">("md");
  const [smashCount, setSmashCount] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"usage" | "css">("usage");

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(tabName);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const usageCode = `import { SmashTactileButton } from "@/components/SmashTactileButton";

export default function Example() {
  return (
    <SmashTactileButton
      label="${label}"
      variant="${variant}"
      size="${size}"
      onClick={() => console.log("Button Smashed!")}
    />
  );
}`;

  const cssOnlyCode = `/* Figma Exact Node 17:1480 Specs */
.smash-deck-frame {
  border: 1px solid #CEC9F1;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.65);
  box-shadow: 
    0px 2.8px 2.2px rgba(26, 0, 108, 0.02),
    0px 3px 3px rgba(0, 0, 0, 0.04),
    0px 42px 33px rgba(26, 0, 108, 0.05),
    0px 100px 80px rgba(26, 0, 108, 0.05);
}

.smash-porcelain-tray {
  background: #F3F3FE;
  border-radius: 24px;
  box-shadow:
    inset 0px 1px 0px 0px #FFFFFF,
    inset 0px -3px 0px 0px #DFDEFB,
    0px 100px 80px rgba(26, 0, 108, 0.05);
}

.smash-core-slab {
  background: linear-gradient(135deg, #1C182F 0%, #161326 50%, #0E0C18 100%);
  border-radius: 20px;
  color: #FFFFFF;
  box-shadow:
    inset 0px 1.5px 1px 0px rgba(255, 255, 255, 0.25),
    inset 0px -3px 2px 0px rgba(0, 0, 0, 0.8);
}

.smash-reactor-underglow {
  background: radial-gradient(circle, #D946EF 0%, #8B5CF6 70%, transparent 100%);
  filter: blur(24px);
}`;

  return (
    <div className="min-h-screen bg-[#0E0E10] text-gray-100 selection:bg-[#FF5B04] selection:text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[500px] bg-purple-600/15 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#FF5B04]/10 rounded-full blur-[120px]" />
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
            <span className="text-purple-400">Smash Tactile</span>
          </div>
        </div>

        {/* Header section */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span>Neo-Brutalist Tactile CTA</span>
            <span className="text-gray-500">•</span>
            <span className="text-[#00E5BE]">React + Tailwind</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-jakarta">
            Tactile <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-200">&ldquo;Smash&rdquo; Button</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            Interactive neo-brutalist tactile button engineered with an outer tech enclosure frame, porcelain cooling tray, midnight obsidian slab, and glowing neon reactor underglow bloom.
          </p>
        </div>

        {/* Live Interactive Studio */}
        <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              </div>
              <span className="text-sm font-semibold text-gray-300 font-mono">
                Interactive Smash Studio
              </span>
            </div>

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
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Interactive Stage */}
          <div
            className={`relative min-h-[460px] flex flex-col items-center justify-center p-8 transition-colors duration-500 overflow-x-auto ${
              variant === "figma"
                ? "bg-[#E2E4F6]"
                : variant === "dark"
                ? "bg-[#0E0E12]"
                : variant === "orange"
                ? "bg-[#180A04]"
                : "bg-[#050912]"
            }`}
            style={
              variant === "figma"
                ? {
                    backgroundColor: "#E2E4F6",
                    backgroundImage:
                      "repeating-linear-gradient(45deg, rgba(206, 201, 241, 0.5) 0px, rgba(206, 201, 241, 0.5) 1px, transparent 1px, transparent 8px)",
                  }
                : undefined
            }
          >
            <div className="relative z-10 transition-transform">
              <SmashTactileButton
                label={label}
                variant={variant}
                size={size}
                onClick={() => setSmashCount((prev) => prev + 1)}
              />
            </div>

            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
              <p
                className={`text-xs font-mono ${
                  variant === "figma" ? "text-gray-700 font-semibold" : "text-gray-400"
                }`}
              >
                Hover to activate underglow reactor &bull; Click/Smash for haptic compression
                {smashCount > 0 && ` &bull; Smashed ${smashCount} time${smashCount > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 sm:p-8 bg-[#121215] border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Button Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="Button text..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Theme Variant
              </label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value as SmashButtonVariant)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-400 transition-colors"
              >
                <option value="figma" className="bg-[#18181B] text-white">Figma Master (Node 17:1480)</option>
                <option value="dark" className="bg-[#18181B] text-white">Dark Cyan Reactor</option>
                <option value="orange" className="bg-[#18181B] text-white">Brand Orange Bloom</option>
                <option value="cyberpunk" className="bg-[#18181B] text-white">Cyberpunk Hot Pink</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Size Scale
              </label>
              <div className="flex gap-2">
                {(["sm", "md", "lg", "hero"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`flex-1 py-2.5 rounded-xl uppercase font-mono text-xs transition-all ${
                      size === s
                        ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30"
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

        {/* Code Exporter */}
        <div className="bg-[#151518] border border-white/10 rounded-3xl overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white font-mono">Code Export</span>
              <span className="text-xs text-gray-500 font-mono">&bull; Ready for React &amp; Tailwind</span>
            </div>

            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
              <button
                onClick={() => setActiveCodeTab("usage")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeCodeTab === "usage"
                    ? "bg-purple-600 text-white font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Usage Example
              </button>
              <button
                onClick={() => setActiveCodeTab("css")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeCodeTab === "css"
                    ? "bg-purple-600 text-white font-medium"
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
