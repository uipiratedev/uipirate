"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useClickSound } from "@/hooks/useClickSound";

export default function MagneticPulseButtonScreen() {
  const [label, setLabel] = useState("Let's Venture");
  const [pulseColor, setPulseColor] = useState("#FF5B04");
  const [clickCount, setClickCount] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const playClickSound = useClickSound();

  const handleClick = () => {
    playClickSound();
    setClickCount((prev) => prev + 1);
  };

  const usageCode = `import { useClickSound } from "@/hooks/useClickSound";

export default function Example() {
  const playClickSound = useClickSound();

  return (
    <div className="relative group inline-block">
      <div className="absolute inset-0 rounded-full bg-[${pulseColor}]/40 blur-xl animate-pulse group-hover:scale-125 transition-transform duration-500" />
      <button
        onClick={() => {
          playClickSound();
          console.log("Action Triggered!");
        }}
        className="relative px-8 py-4 rounded-full bg-[${pulseColor}] text-white font-bold text-base shadow-[0_0_30px_rgba(255,91,4,0.5)] hover:scale-105 active:scale-95 transition-all duration-200"
      >
        ${label}
      </button>
    </div>
  );
}`;

  return (
    <div className="min-h-screen bg-[#0E0E10] text-gray-100 selection:bg-[#FF5B04] selection:text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#FF5B04]/10 rounded-full blur-[140px]" />
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
            <span className="text-[#FF5B04]">Magnetic Pulse</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#FF5B04] animate-pulse" />
            <span>High-Conversion Lead CTA</span>
            <span className="text-gray-500">•</span>
            <span className="text-[#00E5BE]">Audio + Glow Physics</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-jakarta">
            Magnetic <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">Pulsing CTA</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            High-converting signature action CTA button featuring radiant ambient glow bloom, click sound integration, and energetic press physics.
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
              {copiedCode === "usage" ? "Copied!" : "Copy Code"}
            </button>
          </div>

          <div className="relative min-h-[360px] flex flex-col items-center justify-center p-8 bg-[#0D0D10]">
            <div className="relative group cursor-pointer" onClick={handleClick}>
              {/* Outer pulsing radiant glow */}
              <div
                className="absolute inset-0 rounded-full blur-2xl opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 animate-pulse pointer-events-none"
                style={{ backgroundColor: pulseColor }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-8 py-4 rounded-full text-white font-bold text-base shadow-2xl flex items-center gap-3 cursor-pointer"
                style={{
                  backgroundColor: pulseColor,
                  boxShadow: `0 0 35px ${pulseColor}80`,
                }}
              >
                <span>{label}</span>
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              </motion.button>
            </div>

            <p className="absolute bottom-4 text-xs font-mono text-gray-500">
              Click button to trigger sound feedback &bull; Clicked {clickCount} time{clickCount === 1 ? "" : "s"}
            </p>
          </div>

          {/* Controls */}
          <div className="p-6 sm:p-8 bg-[#121215] border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Button Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF5B04]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Pulse Accent Color
              </label>
              <div className="flex gap-2">
                {[
                  { label: "Orange", val: "#FF5B04" },
                  { label: "Cyan", val: "#00E5BE" },
                  { label: "Violet", val: "#8B5CF6" },
                  { label: "Pink", val: "#F43F5E" },
                ].map((c) => (
                  <button
                    key={c.val}
                    onClick={() => setPulseColor(c.val)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      pulseColor === c.val
                        ? "ring-2 ring-white ring-offset-2 ring-offset-[#121215] font-bold"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: c.val, color: "#FFFFFF" }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
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
