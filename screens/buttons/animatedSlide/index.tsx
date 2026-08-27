"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatedButton } from "@/components/AnimatedButton";

export default function AnimatedSlideButtonScreen() {
  const [primaryText, setPrimaryText] = useState("Explore Services");
  const [hoverText, setHoverText] = useState("See More →");
  const [variant, setVariant] = useState<"primary" | "secondary">("primary");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const usageCode = `import { AnimatedButton } from "@/components/AnimatedButton";

export default function Example() {
  return (
    <AnimatedButton
      primaryText="${primaryText}"
      hoverText="${hoverText}"
      variant="${variant}"
      onClick={() => console.log("Clicked Animated Button!")}
    />
  );
}`;

  return (
    <div className="min-h-screen bg-[#0E0E10] text-gray-100 selection:bg-[#FF5B04] selection:text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#FF5B04]/10 rounded-full blur-[140px]" />
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
            <span className="text-[#FF5B04]">Animated Slide</span>
          </div>
        </div>

        {/* Header section */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#FF5B04] animate-pulse" />
            <span>Interactive Micro-Interaction</span>
            <span className="text-gray-500">•</span>
            <span className="text-[#00E5BE]">Slide-Up Text Roll</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-jakarta">
            Animated <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">Slide-Up Button</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            High-converting dual-text roll CTA button. Hovering replaces the primary label with a secondary action message through a smooth vertical translateY translation with overflow clipping.
          </p>
        </div>

        {/* Interactive Studio */}
        <div className="bg-[#151518]/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
            <span className="text-sm font-semibold text-gray-300 font-mono">
              Live Interactive Playground
            </span>

            <button
              onClick={() => {
                navigator.clipboard.writeText(usageCode);
                setCopiedCode("usage");
                setTimeout(() => setCopiedCode(null), 2000);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
            >
              {copiedCode === "usage" ? "Copied!" : "Copy React Code"}
            </button>
          </div>

          <div className="relative min-h-[320px] flex flex-col items-center justify-center p-8 bg-[#121214]">
            <div className="w-full max-w-[280px]">
              <AnimatedButton
                primaryText={primaryText}
                hoverText={hoverText}
                variant={variant}
                fullWidth={true}
                className="!mt-0"
              />
            </div>
            <p className="absolute bottom-4 text-xs font-mono text-gray-500">
              Hover over button to trigger dual-label slide transition
            </p>
          </div>

          {/* Controls */}
          <div className="p-6 sm:p-8 bg-[#121215] border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Primary Label
              </label>
              <input
                type="text"
                value={primaryText}
                onChange={(e) => setPrimaryText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5B04]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Hover Label
              </label>
              <input
                type="text"
                value={hoverText}
                onChange={(e) => setHoverText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5B04]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Style Variant
              </label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value as "primary" | "secondary")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5B04]"
              >
                <option value="primary" className="bg-[#18181B] text-white">Primary Dark</option>
                <option value="secondary" className="bg-[#18181B] text-white">Secondary Light</option>
              </select>
            </div>
          </div>
        </div>

        {/* Code Exporter */}
        <div className="bg-[#151518] border border-white/10 rounded-3xl overflow-hidden p-6 bg-[#0B0B0D]">
          <pre className="text-xs sm:text-sm font-mono text-gray-300 leading-relaxed overflow-x-auto">
            <code>{usageCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
