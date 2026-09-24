"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import SuggestedTools from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";
import { generateRadiusScale } from "@/lib/concentricRadius";
import { generateSquirclePath, smoothingToExponent } from "@/lib/squircle";

const SIZE_PRESETS: Record<string, { width: number; height: number }> = {
  "Icon (1:1)": { width: 120, height: 120 },
  "Button (10:3)": { width: 180, height: 54 },
  "Card (4:3)": { width: 280, height: 210 },
};

export default function BorderRadiusGeneratorClient() {
  // Section A: concentric / nested radius
  const [baseOuter, setBaseOuter] = useState(20);
  const [padding, setPadding] = useState(12);
  const [radiusOutputTab, setRadiusOutputTab] = useState<"css" | "tailwind">("css");
  const [copied, setCopied] = useState<string | null>(null);

  const innerRadius = Math.max(0, baseOuter - padding);
  const radiusScale = useMemo(
    () => generateRadiusScale({ baseOuter, padding }),
    [baseOuter, padding],
  );

  const radiusCssOutput = [
    ":root {",
    ...radiusScale.map((l) => `  --radius-outer-${l.key}: ${l.outer}px;`),
    "",
    ...radiusScale.map((l) => `  --radius-inner-${l.key}: ${l.inner}px;`),
    "}",
  ].join("\n");

  const radiusTailwindOutput = [
    "// tailwind.config.js",
    "module.exports = {",
    "  theme: {",
    "    extend: {",
    "      borderRadius: {",
    ...radiusScale.map((l) => `        outer-${l.key}: "${l.outer}px",`),
    ...radiusScale.map((l) => `        inner-${l.key}: "${l.inner}px",`),
    "      },",
    "    },",
    "  },",
    "};",
  ].join("\n");

  const radiusOutput = radiusOutputTab === "css" ? radiusCssOutput : radiusTailwindOutput;

  // Section B: squircle
  const [size, setSize] = useState(SIZE_PRESETS["Icon (1:1)"]);
  const [squircleRadius, setSquircleRadius] = useState(28);
  const [smoothing, setSmoothing] = useState(60);
  const [squircleOutputTab, setSquircleOutputTab] = useState<"clip" | "svg" | "path">("clip");

  const exponent = smoothingToExponent(smoothing);
  const squirclePath = useMemo(
    () => generateSquirclePath({ width: size.width, height: size.height, radius: squircleRadius, smoothing }),
    [size, squircleRadius, smoothing],
  );
  const circlePath = useMemo(
    () => generateSquirclePath({ width: size.width, height: size.height, radius: squircleRadius, smoothing: 0 }),
    [size, squircleRadius],
  );

  const clipPathOutput = `.squircle {\n  width: ${size.width}px;\n  height: ${size.height}px;\n  clip-path: path("${squirclePath}");\n}`;
  const svgOutput = `<svg width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}" xmlns="http://www.w3.org/2000/svg">\n  <path d="${squirclePath}" fill="currentColor" />\n</svg>`;
  const pathOutput = squirclePath;

  const squircleOutput =
    squircleOutputTab === "clip" ? clipPathOutput : squircleOutputTab === "svg" ? svgOutput : pathOutput;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000);
  };

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
            Concentric Border-Radius &amp;{" "}
            <span className="text-[#FF5B04]">Squircle</span> Generator
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto text-center font-normal leading-relaxed">
            Two related corner problems, solved with real math: nested radii
            that don't pinch at the edges, and iOS-style continuous-curvature
            squircle corners — both exported as ready-to-use CSS.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              "Nested Radius Formula (outer − padding)",
              "Synchronized xs–2xl Radius Scale",
              "Superellipse Squircle Math",
              "clip-path & SVG Export",
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
                Need a full corner-radius system built for your product?
              </span>
              <span className="text-gray-900 font-bold group-hover:text-[#FF5B04] inline-flex items-center gap-0.5 transition-colors">
                <span>Talk to design team</span>
                <svg
                  className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#FF5B04]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                </svg>
              </span>
            </Link>
          </div>
        </motion.div>

        {/* ── Section A: Concentric Radius ─────────────────────────────── */}
        <div className="mb-6">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04] bg-[#FF5B04]/8 px-3 py-1 rounded-full border border-[#FF5B04]/20">
            Part 1
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-3">
            Nested (Concentric) Radius Calculator
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start mb-24">
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Outer Radius: <span className="font-mono text-[#FF5B04]">{baseOuter}px</span>
              </label>
              <input
                className="w-full accent-[#FF5B04]"
                max="48"
                min="4"
                type="range"
                value={baseOuter}
                onChange={(e) => setBaseOuter(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Padding: <span className="font-mono text-[#FF5B04]">{padding}px</span>
              </label>
              <input
                className="w-full accent-[#FF5B04]"
                max="32"
                min="0"
                type="range"
                value={padding}
                onChange={(e) => setPadding(Number(e.target.value))}
              />
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="text-[11px] font-mono text-gray-500">
                inner = outer − padding
              </p>
              <p className="text-xs font-mono text-gray-800 mt-1">
                {innerRadius}px = {baseOuter}px − {padding}px
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <Link
                className="block text-center px-4 py-3 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
                href="/contact"
              >
                Need a Full Radius System? →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 font-jakarta uppercase tracking-wider mb-6">
                Same Radius vs. Concentric Radius
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div
                    className="bg-gray-100 border-2 border-gray-300 flex items-center justify-center"
                    style={{ borderRadius: baseOuter, padding }}
                  >
                    <div
                      className="w-full h-24 bg-white border-2 border-dashed border-red-400"
                      style={{ borderRadius: baseOuter }}
                    />
                  </div>
                  <p className="text-[11px] text-center text-red-500 font-semibold mt-2">
                    ✕ Same radius ({baseOuter}px) — pinches at the corners
                  </p>
                </div>
                <div>
                  <div
                    className="bg-gray-100 border-2 border-gray-300 flex items-center justify-center"
                    style={{ borderRadius: baseOuter, padding }}
                  >
                    <div
                      className="w-full h-24 bg-white border-2 border-dashed border-emerald-400"
                      style={{ borderRadius: innerRadius }}
                    />
                  </div>
                  <p className="text-[11px] text-center text-emerald-600 font-semibold mt-2">
                    ✓ Concentric radius ({innerRadius}px) — curves run parallel
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 font-jakarta uppercase tracking-wider mb-4">
                Radius Scale (xs–2xl)
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
                {radiusScale.map((level) => (
                  <div key={level.key} className="flex flex-col items-center gap-2">
                    <div
                      className="w-full aspect-square bg-gray-100 border-2 border-gray-300 flex items-center justify-center p-2"
                      style={{ borderRadius: level.outer }}
                    >
                      <div
                        className="w-full h-full bg-white border border-gray-200"
                        style={{ borderRadius: level.inner }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">{level.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <button
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${radiusOutputTab === "css" ? "bg-gray-900 text-white shadow-xs" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    onClick={() => setRadiusOutputTab("css")}
                  >
                    CSS Variables
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${radiusOutputTab === "tailwind" ? "bg-gray-900 text-white shadow-xs" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    onClick={() => setRadiusOutputTab("tailwind")}
                  >
                    Tailwind Config
                  </button>
                </div>
                <button
                  className="px-3.5 py-1.5 rounded-xl bg-[#FF5B04] hover:bg-[#E54F00] text-white text-xs font-bold transition-all shadow-sm shadow-[#FF5B04]/15 cursor-pointer"
                  onClick={() => copy(radiusOutput, "radius")}
                >
                  {copied === "radius" ? "Copied!" : "Copy Code"}
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-gray-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed max-h-[260px]">
                {radiusOutput}
              </pre>
            </div>
          </div>
        </div>

        {/* ── Section B: Squircle ──────────────────────────────────────── */}
        <div className="mb-6">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04] bg-[#FF5B04]/8 px-3 py-1 rounded-full border border-[#FF5B04]/20">
            Part 2
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-3">
            Superellipse Squircle Generator
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="block text-[11px] font-semibold text-gray-500 mb-2">Shape preset</span>
              <div className="flex flex-wrap gap-2">
                {Object.keys(SIZE_PRESETS).map((name) => (
                  <button
                    key={name}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${size === SIZE_PRESETS[name] ? "bg-gray-900 text-white shadow-xs" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    onClick={() => setSize(SIZE_PRESETS[name])}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                {size.width}px × {size.height}px
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Corner Radius:{" "}
                <span className="font-mono text-[#FF5B04]">{squircleRadius}px</span>
              </label>
              <input
                className="w-full accent-[#FF5B04]"
                max={Math.min(size.width, size.height) / 2}
                min="0"
                type="range"
                value={squircleRadius}
                onChange={(e) => setSquircleRadius(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Smoothing:{" "}
                <span className="font-mono text-[#FF5B04]">
                  {smoothing}% (n={exponent.toFixed(1)})
                </span>
              </label>
              <input
                className="w-full accent-[#FF5B04]"
                max="100"
                min="0"
                type="range"
                value={smoothing}
                onChange={(e) => setSmoothing(Number(e.target.value))}
              />
              <div className="flex gap-2 mt-2">
                {[
                  { label: "None", value: 0 },
                  { label: "Apple-like", value: 50 },
                  { label: "Max", value: 100 },
                ].map((p) => (
                  <button
                    key={p.label}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                    onClick={() => setSmoothing(p.value)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Link
                className="block text-center px-4 py-3 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
                href="/contact"
              >
                Need Custom App Icon Shapes? →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 font-jakarta uppercase tracking-wider mb-6">
                Circular Corner vs. Squircle
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 rounded-2xl p-8 flex items-center justify-center">
                    <svg
                      height={size.height}
                      viewBox={`0 0 ${size.width} ${size.height}`}
                      width={size.width}
                    >
                      <path d={circlePath} fill="#111827" />
                    </svg>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">Standard border-radius (n=2)</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 rounded-2xl p-8 flex items-center justify-center">
                    <svg
                      height={size.height}
                      viewBox={`0 0 ${size.width} ${size.height}`}
                      width={size.width}
                    >
                      <path d={squirclePath} fill="#FF5B04" />
                    </svg>
                  </div>
                  <p className="text-[11px] text-[#FF5B04] font-semibold mt-2">
                    Squircle (n={exponent.toFixed(1)})
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <button
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${squircleOutputTab === "clip" ? "bg-gray-900 text-white shadow-xs" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    onClick={() => setSquircleOutputTab("clip")}
                  >
                    CSS clip-path
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${squircleOutputTab === "svg" ? "bg-gray-900 text-white shadow-xs" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    onClick={() => setSquircleOutputTab("svg")}
                  >
                    SVG Markup
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${squircleOutputTab === "path" ? "bg-gray-900 text-white shadow-xs" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    onClick={() => setSquircleOutputTab("path")}
                  >
                    Path Data
                  </button>
                </div>
                <button
                  className="px-3.5 py-1.5 rounded-xl bg-[#FF5B04] hover:bg-[#E54F00] text-white text-xs font-bold transition-all shadow-sm shadow-[#FF5B04]/15 cursor-pointer"
                  onClick={() => copy(squircleOutput, "squircle")}
                >
                  {copied === "squircle" ? "Copied!" : "Copy Code"}
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-gray-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed max-h-[260px]">
                {squircleOutput}
              </pre>
              <p className="text-[11px] text-gray-400 mt-3">
                clip-path: path() is supported in all evergreen browsers
                (Chrome, Edge, Firefox, Safari) but not in Internet Explorer.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Tutorial / Educational Guide */}
        <section className="mt-24 pt-14 border-t border-gray-200 max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
              Corner Geometry Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-2">
              Why Corners Need Real Math
            </h2>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Both tools on this page fix the same underlying problem: eyeballing
              a border-radius value looks fine in isolation but falls apart the
              moment it interacts with something else — a parent's padding, or
              the sharp geometry of a rectangle's actual corner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">
                Why "Same Radius" Looks Pinched
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                A rounded corner is an arc drawn from a center point. If an
                outer box and its padded inner child use the same radius, the
                inner arc's center sits in a completely different place — the
                two curves aren't concentric, so the gap between them visibly
                narrows right at the corner instead of staying constant.
                Subtracting the padding from the radius moves both centers to
                the same point, so the curves run truly parallel.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">
                Why border-radius Alone Can't Make a Squircle
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                CSS border-radius always draws a quarter-circle: |x/R|² +
                |y/R|² = 1. A superellipse generalizes that exponent: |x/R|ⁿ +
                |y/R|ⁿ = 1. At n=2 it's identical to a normal rounded corner;
                as n grows the curve hugs the straight edges longer before
                turning, producing the flatter, more "continuous curvature"
                look of an iOS app icon. There's no CSS property for this —
                it has to be built as a path and applied with clip-path.
              </p>
            </div>
          </div>

          {/* Step by step */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 font-jakarta mb-6">
              Step-by-Step: How to Use These Tools
            </h3>
            <div className="space-y-5">
              {[
                {
                  title: "Nested radius: match your real padding",
                  desc: "Set Outer Radius and Padding to your actual card/container values — the computed inner radius is only correct for that exact padding.",
                },
                {
                  title: "Nested radius: export the whole scale",
                  desc: "Copy the CSS variables or Tailwind config — six synchronized outer/inner pairs, all derived from one base radius and padding.",
                },
                {
                  title: "Squircle: pick a size that matches your element",
                  desc: "Use the Icon preset for app icons and avatars, Button or Card for UI elements — corner radius is automatically clamped so it never exceeds half the shorter side.",
                },
                {
                  title: "Squircle: dial in smoothing, then export",
                  desc: "0% is a plain rounded corner; ~50% approximates Apple's iOS icon curve; 100% pushes toward a rounded square. Copy the clip-path CSS to apply it to a real element, or the SVG markup to export it as an asset.",
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
                  q: "What is concentric (nested) border-radius?",
                  a: "It's the practice of setting a padded child element's radius to outerRadius − padding, so both the outer and inner curves share the same center point and run parallel instead of pinching together at the corners.",
                },
                {
                  q: "What exactly is a 'squircle'?",
                  a: "A squircle is a shape between a square and a circle, mathematically a superellipse: |x/R|ⁿ + |y/R|ⁿ = 1. Apple popularized it for iOS app icons because it has continuous curvature — no abrupt change in how sharply the edge bends — which a normal rounded rectangle corner doesn't have.",
                },
                {
                  q: "Is this the exact same curve Apple uses for iOS icons?",
                  a: "No — Apple's exact icon curve is proprietary. n≈5 is a widely used approximation that looks very close. This tool exposes the exponent as a 0–100% smoothing slider so you can match it to your eye rather than a single fixed value.",
                },
                {
                  q: "Why clip-path instead of border-radius for the squircle?",
                  a: "border-radius can only draw circular arcs. A superellipse needs an arbitrary path, so it's built as an SVG path string and applied with CSS clip-path: path(\"...\"), which every evergreen browser supports.",
                },
                {
                  q: "Does the squircle work on non-square elements like buttons?",
                  a: "Yes — width and height are independent, and the corner radius is automatically clamped to half the shorter side so it never overlaps itself, even on wide, short elements like buttons.",
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
        <SuggestedTools category="design-system" currentToolId="border-radius-generator" />
      </div>
    </div>
  );
}
