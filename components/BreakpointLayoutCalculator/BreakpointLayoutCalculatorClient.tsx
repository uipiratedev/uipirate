"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import SuggestedTools from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";
import {
  Breakpoint,
  BREAKPOINT_PRESETS,
  ASPECT_RATIO_PRESETS,
  sortedByMinWidth,
  generateMediaQueryCss,
  generateContainerQueryCss,
  generateTailwindScreensConfig,
  activeBreakpoint,
  computeAspectRatioDimensions,
} from "@/lib/breakpointLayout";

const MIN_SIM = 320;
const MAX_SIM = 2000;

export default function BreakpointLayoutCalculatorClient() {
  // Part 1: breakpoints
  const [breakpoints, setBreakpoints] = useState<Breakpoint[]>(
    BREAKPOINT_PRESETS["Tailwind Defaults"],
  );
  const [containerName, setContainerName] = useState("card");
  const [simWidth, setSimWidth] = useState(1024);
  const [bpOutputTab, setBpOutputTab] = useState<"media" | "container" | "tailwind">("media");
  const [copied, setCopied] = useState<string | null>(null);

  const sorted = useMemo(() => sortedByMinWidth(breakpoints), [breakpoints]);
  const active = useMemo(() => activeBreakpoint(simWidth, breakpoints), [simWidth, breakpoints]);

  const mediaCss = useMemo(() => generateMediaQueryCss(breakpoints), [breakpoints]);
  const containerCss = useMemo(
    () => generateContainerQueryCss(breakpoints, containerName),
    [breakpoints, containerName],
  );
  const tailwindConfig = useMemo(() => generateTailwindScreensConfig(breakpoints), [breakpoints]);
  const bpOutput =
    bpOutputTab === "media" ? mediaCss : bpOutputTab === "container" ? containerCss : tailwindConfig;

  const setBreakpointWidth = (key: string, minWidth: number) => {
    setBreakpoints((prev) => prev.map((bp) => (bp.key === key ? { ...bp, minWidth } : bp)));
  };

  // Part 2: aspect ratio / CLS
  const [ratioW, setRatioW] = useState(16);
  const [ratioH, setRatioH] = useState(9);
  const [targetWidth, setTargetWidth] = useState(800);

  const aspectResult = useMemo(
    () => computeAspectRatioDimensions(ratioW, ratioH, targetWidth),
    [ratioW, ratioH, targetWidth],
  );

  const cssSnippet = `.media {\n  aspect-ratio: ${aspectResult.ratioCss};\n  width: 100%;\n  height: auto;\n}`;
  const nextImageSnippet = `<Image\n  src="/photo.jpg"\n  width={${aspectResult.width}}\n  height={${aspectResult.height}}\n  alt="..."\n/>`;
  const legacySnippet = `.media-legacy {\n  position: relative;\n  padding-top: ${aspectResult.paddingTopPercent}%; /* ${aspectResult.simplified[0]}:${aspectResult.simplified[1]} fallback */\n}\n.media-legacy > img {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}`;
  const [ratioOutputTab, setRatioOutputTab] = useState<"css" | "next" | "legacy">("css");
  const ratioOutput =
    ratioOutputTab === "css" ? cssSnippet : ratioOutputTab === "next" ? nextImageSnippet : legacySnippet;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000);
  };

  const previewMaxHeight = 260;
  const previewScale = Math.min(1, 480 / aspectResult.width, previewMaxHeight / aspectResult.height);

  return (
    <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden">
      {/* Background Grid & Ambient Glow */}
      <div
        className="absolute inset-0 pointer-events-none -top-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse at 50% 25%, black 40%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 25%, black 40%, transparent 80%)",
        }}
      />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-[#FF5B04]/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-32 lg:px-20 max-md:px-4 pt-32 pb-20 relative z-10">
        {/* Hero */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 w-full max-w-5xl mx-auto"
          initial={{ opacity: 0, y: -12 }}
        >
          <div className="mb-6 flex flex-row items-center justify-center">
            <GlassBadge variant="gradient">DESIGN SYSTEMS &amp; CODE</GlassBadge>
          </div>

          <h1 className="text-[38px] sm:text-[50px] md:text-[62px] lg:text-[72px] text-center font-[800] tracking-[-1.5px] leading-[1.08] text-gray-900 mb-5">
            Responsive Breakpoint &amp;{" "}
            <span className="text-[#FF5B04]">Layout</span> Calculator
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto text-center font-normal leading-relaxed">
            Configure a synchronized breakpoint scale for media queries and
            modern CSS container queries, then calculate exact aspect-ratio
            dimensions that eliminate Cumulative Layout Shift.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              "@media & @container From One Scale",
              "Live Viewport Simulation",
              "CLS-Safe Aspect-Ratio Math",
              "Tailwind screens Export",
            ].map((badge, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-gray-200/80 text-gray-700 shadow-2xs flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              className="group inline-flex items-center gap-2.5 bg-white/95 backdrop-blur-md border border-[#E5E7EB] hover:border-[#FF5B04]/40 rounded-full px-5 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(255,91,4,0.08)] transition-all duration-300 text-xs"
              href="/contact"
            >
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FF5B04]/10 text-[#FF5B04] font-mono text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04] animate-pulse" />
                Design Systems
              </span>
              <span className="text-gray-600 font-medium">
                Need a full responsive system built for your product?
              </span>
              <span className="text-gray-900 font-bold group-hover:text-[#FF5B04] inline-flex items-center gap-0.5 transition-colors">
                <span>Talk to design team</span>
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#FF5B04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                </svg>
              </span>
            </Link>
          </div>
        </motion.div>

        {/* ── Part 1: Breakpoint Scale ────────────────────────────────── */}
        <div className="mb-6">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04] bg-[#FF5B04]/8 px-3 py-1 rounded-full border border-[#FF5B04]/20">
            Part 1
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-3">
            Breakpoint Scale
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start mb-24">
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="block text-[11px] font-semibold text-gray-500 mb-2">Preset</span>
              <div className="flex flex-wrap gap-2">
                {Object.keys(BREAKPOINT_PRESETS).map((name) => (
                  <button
                    key={name}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                    onClick={() => setBreakpoints(BREAKPOINT_PRESETS[name])}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {sorted.map((bp) => (
                <div key={bp.key}>
                  <label className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1.5">
                    <span>
                      {bp.key} <span className="text-gray-400 font-normal">({bp.label})</span>
                    </span>
                    <span className="font-mono text-[#FF5B04]">{bp.minWidth}px</span>
                  </label>
                  <input
                    className="w-full accent-[#FF5B04]"
                    max="2200"
                    min="200"
                    type="range"
                    value={bp.minWidth}
                    onChange={(e) => setBreakpointWidth(bp.key, Number(e.target.value))}
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Container Name
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono text-gray-800 outline-none focus:border-[#FF5B04]"
                placeholder="card"
                type="text"
                value={containerName}
                onChange={(e) => setContainerName(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Link
                className="block text-center px-4 py-3 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
                href="/contact"
              >
                Need a Custom Grid System? →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {/* Live viewport simulator */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 font-jakarta uppercase tracking-wider">
                  Simulate Viewport
                </h3>
                <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#FF5B04]/8 text-[#FF5B04] border border-[#FF5B04]/20">
                  {simWidth}px
                </span>
              </div>
              <input
                className="w-full accent-[#FF5B04]"
                max={MAX_SIM}
                min={MIN_SIM}
                type="range"
                value={simWidth}
                onChange={(e) => setSimWidth(Number(e.target.value))}
              />
              <div className="flex flex-wrap gap-2 mt-5">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold border ${
                    active === null
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-gray-50 text-gray-400 border-gray-200"
                  }`}
                >
                  base
                </span>
                {sorted.map((bp) => (
                  <span
                    key={bp.key}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold border ${
                      active?.key === bp.key
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-gray-50 text-gray-400 border-gray-200"
                    }`}
                  >
                    {bp.key} ({bp.minWidth}px+)
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-4">
                At {simWidth}px, the active breakpoint is{" "}
                <span className="font-mono text-gray-700">{active ? active.key : "base (below sm)"}</span>.
              </p>
            </div>

            {/* Code Output */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <button
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${bpOutputTab === "media" ? "bg-gray-900 text-white shadow-xs" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    onClick={() => setBpOutputTab("media")}
                  >
                    @media CSS
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${bpOutputTab === "container" ? "bg-gray-900 text-white shadow-xs" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    onClick={() => setBpOutputTab("container")}
                  >
                    @container CSS
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${bpOutputTab === "tailwind" ? "bg-gray-900 text-white shadow-xs" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    onClick={() => setBpOutputTab("tailwind")}
                  >
                    Tailwind Config
                  </button>
                </div>
                <button
                  className="px-3.5 py-1.5 rounded-xl bg-[#FF5B04] hover:bg-[#E54F00] text-white text-xs font-bold transition-all shadow-sm shadow-[#FF5B04]/15 cursor-pointer"
                  onClick={() => copy(bpOutput, "bp")}
                >
                  {copied === "bp" ? "Copied!" : "Copy Code"}
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-gray-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed max-h-[300px]">
                {bpOutput}
              </pre>
            </div>
          </div>
        </div>

        {/* ── Part 2: Aspect Ratio & CLS ──────────────────────────────── */}
        <div className="mb-6">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04] bg-[#FF5B04]/8 px-3 py-1 rounded-full border border-[#FF5B04]/20">
            Part 2
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-3">
            Aspect-Ratio &amp; CLS Calculator
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="block text-[11px] font-semibold text-gray-500 mb-2">Ratio preset</span>
              <div className="flex flex-col gap-1.5">
                {ASPECT_RATIO_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      ratioW === p.w && ratioH === p.h
                        ? "border-[#FF5B04]/50 bg-[#FF5B04]/5 text-gray-900"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                    onClick={() => {
                      setRatioW(p.w);
                      setRatioH(p.h);
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Ratio W</label>
                <input
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono text-gray-800 outline-none"
                  min="1"
                  type="number"
                  value={ratioW}
                  onChange={(e) => setRatioW(Math.max(1, Number(e.target.value)))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Ratio H</label>
                <input
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono text-gray-800 outline-none"
                  min="1"
                  type="number"
                  value={ratioH}
                  onChange={(e) => setRatioH(Math.max(1, Number(e.target.value)))}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Target Render Width: <span className="font-mono text-[#FF5B04]">{targetWidth}px</span>
              </label>
              <input
                className="w-full accent-[#FF5B04]"
                max="1600"
                min="100"
                type="range"
                value={targetWidth}
                onChange={(e) => setTargetWidth(Number(e.target.value))}
              />
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="text-[11px] font-mono text-gray-500">computed height</p>
              <p className="text-xl font-mono font-bold text-gray-900">{aspectResult.height}px</p>
              <p className="text-[11px] text-gray-400 mt-1">
                Simplified ratio: {aspectResult.simplified[0]}:{aspectResult.simplified[1]}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Link
                className="block text-center px-4 py-3 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
                href="/contact"
              >
                Need a CLS Audit on Your Site? →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 font-jakarta uppercase tracking-wider mb-6">
                Live Preview
              </h3>
              <div className="bg-gray-100 rounded-2xl p-8 flex items-center justify-center">
                <div
                  className="bg-gradient-to-br from-[#FF5B04] to-[#E54F00] rounded-xl flex items-center justify-center text-white text-xs font-mono shadow-lg"
                  style={{
                    width: aspectResult.width * previewScale,
                    height: aspectResult.height * previewScale,
                  }}
                >
                  {aspectResult.width} × {aspectResult.height}
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <button
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${ratioOutputTab === "css" ? "bg-gray-900 text-white shadow-xs" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    onClick={() => setRatioOutputTab("css")}
                  >
                    CSS aspect-ratio
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${ratioOutputTab === "next" ? "bg-gray-900 text-white shadow-xs" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    onClick={() => setRatioOutputTab("next")}
                  >
                    Next.js Image
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${ratioOutputTab === "legacy" ? "bg-gray-900 text-white shadow-xs" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    onClick={() => setRatioOutputTab("legacy")}
                  >
                    Legacy Fallback
                  </button>
                </div>
                <button
                  className="px-3.5 py-1.5 rounded-xl bg-[#FF5B04] hover:bg-[#E54F00] text-white text-xs font-bold transition-all shadow-sm shadow-[#FF5B04]/15 cursor-pointer"
                  onClick={() => copy(ratioOutput, "ratio")}
                >
                  {copied === "ratio" ? "Copied!" : "Copy Code"}
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-gray-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed max-h-[260px]">
                {ratioOutput}
              </pre>
            </div>
          </div>
        </div>

        {/* Detailed Tutorial / Educational Guide */}
        <section className="mt-24 pt-14 border-t border-gray-200 max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
              Responsive Engineering Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-2">
              Media Queries, Container Queries &amp; CLS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">
                Why Combine Media Queries with Container Queries?
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                A media query only knows about the browser's viewport — a
                card inside a narrow sidebar still gets the "desktop" styles
                if the window is wide. A container query responds to the
                width of its own parent instead, so the same card component
                adapts correctly whether it's in a full-width feed or a
                320px sidebar. Both use the same kind of min-width
                thresholds, which is why this tool generates them from one
                shared breakpoint scale.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">
                How Aspect-Ratio Prevents Layout Shift
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Cumulative Layout Shift (CLS) happens when content jumps
                because the browser didn't know how much space to reserve
                before an image finished loading. Setting an explicit{" "}
                <code className="font-mono text-gray-800">aspect-ratio</code>{" "}
                (or width/height attributes) lets the browser calculate and
                reserve the exact box up front — the layout never moves once
                the image bytes arrive.
              </p>
            </div>
          </div>

          {/* Step by step */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 font-jakarta mb-6">
              Step-by-Step: How to Use This Calculator
            </h3>
            <div className="space-y-5">
              {[
                {
                  title: "Pick a breakpoint preset, or dial in your own",
                  desc: "Tailwind Defaults matches the ecosystem most component libraries expect. Device-Based mirrors real phone/tablet/laptop/desktop/ultrawide widths if you're designing from device mockups.",
                },
                {
                  title: "Simulate a viewport to sanity-check the scale",
                  desc: "Drag the Simulate Viewport slider and watch which named breakpoint lights up — a fast way to confirm your thresholds land where you expect before you ship them.",
                },
                {
                  title: "Export both media and container query CSS",
                  desc: "Use @media for page-level layout (nav, page grid) and @container for reusable components (cards, widgets) that need to adapt to whatever container they're dropped into.",
                },
                {
                  title: "Compute exact image dimensions per breakpoint",
                  desc: "Pick your image's aspect ratio and the width it actually renders at (not the source file's dimensions), and copy the exact height into your CSS or Next.js Image component.",
                },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-[#FF5B04]/8 text-[#FF5B04] flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 font-jakarta mb-6">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {[
                {
                  q: "What's the difference between @media and @container?",
                  a: "@media reads the browser viewport - the same styles apply everywhere on the page. @container reads the width of a specific parent element, so the same component can respond differently depending on where it's placed.",
                },
                {
                  q: "Do I need container-type: inline-size for @container to work?",
                  a: "Yes - a container query only works on an ancestor that has explicitly opted in with container-type (and optionally container-name), which is why this tool generates that declaration alongside the queries themselves.",
                },
                {
                  q: "Why does the aspect-ratio calculator ask for 'target render width', not the image's real size?",
                  a: "CLS prevention only cares about how large the image will actually display on the page - the source file can be a completely different resolution. Using the rendered width keeps the reserved space accurate.",
                },
                {
                  q: "Do I still need the padding-top percentage hack?",
                  a: "Almost never for modern projects - the CSS aspect-ratio property has excellent support in all current browsers. The legacy fallback is included for projects that still need to support very old browser versions.",
                },
              ].map((faq, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-900 mb-1">{faq.q}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Suggested Tools */}
        <SuggestedTools category="design-system" currentToolId="breakpoint-generator" />
      </div>
    </div>
  );
}
