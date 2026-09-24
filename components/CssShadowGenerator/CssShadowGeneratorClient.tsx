"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import SuggestedTools from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";
import {
  ShadowConfig,
  ShadowEasing,
  SHADOW_PRESETS,
  generateLayers,
  formatCssValue,
  formatCssPretty,
  generateElevationScale,
} from "@/lib/layeredShadow";

const EASING_OPTIONS: { value: ShadowEasing; label: string; hint: string }[] = [
  { value: "linear", label: "Linear", hint: "Even spacing between every layer" },
  {
    value: "ease-out",
    label: "Smooth Diffusion",
    hint: "Layers spread quickly, then ease into a soft tail",
  },
  {
    value: "ease-in",
    label: "Sharp Focus",
    hint: "A tight, crisp core with one long dramatic tail layer",
  },
];

export default function CssShadowGeneratorClient() {
  const [config, setConfig] = useState<ShadowConfig>(SHADOW_PRESETS["Subtle Card"]);
  const [darkPreview, setDarkPreview] = useState(false);
  const [outputTab, setOutputTab] = useState<"css" | "tailwind">("css");
  const [copied, setCopied] = useState<string | null>(null);

  const layers = useMemo(() => generateLayers(config), [config]);
  const styleValue = useMemo(
    () => formatCssValue(layers, config.inset),
    [layers, config.inset],
  );
  const prettyValue = useMemo(
    () => formatCssPretty(layers, config.inset),
    [layers, config.inset],
  );
  const elevationScale = useMemo(() => generateElevationScale(config), [config]);

  const cssOutput = `.elevated {\n  box-shadow:\n${prettyValue};\n}`;
  const cssVarsOutput = [
    ":root {",
    ...elevationScale.map((level) => `  --shadow-${level.key}: ${level.cssValue};`),
    "}",
  ].join("\n");
  const tailwindOutput = [
    "// tailwind.config.js",
    "module.exports = {",
    "  theme: {",
    "    extend: {",
    "      boxShadow: {",
    ...elevationScale.map((level) => `        ${level.key}: "${level.tailwindValue}",`),
    "      },",
    "    },",
    "  },",
    "};",
  ].join("\n");

  const currentOutput = outputTab === "css" ? cssVarsOutput : tailwindOutput;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000);
  };

  const set = <K extends keyof ShadowConfig>(key: K, value: ShadowConfig[K]) =>
    setConfig((c) => ({ ...c, [key]: value }));

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
            Smooth Layered <span className="text-[#FF5B04]">Box-Shadow</span>{" "}
            Generator
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto text-center font-normal leading-relaxed">
            Build realistic, non-muddy elevation shadows by stacking multiple
            layers that fade like real ambient light — then export a
            synchronized xs–2xl elevation scale.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              "3–6 Layer Shadow Stacking",
              "Physically-Inspired Easing Curves",
              "Synchronized xs–2xl Elevation Scale",
              "CSS Variables & Tailwind Export",
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
                Need a full elevation system built for your product?
              </span>
              <span className="text-gray-900 font-bold group-hover:text-[#FF5B04] inline-flex items-center gap-0.5 transition-colors">
                <span>Talk to design team</span>
                <svg
                  className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#FF5B04]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Builder Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
          {/* Controls */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 lg:sticky lg:top-28">
            <div>
              <span className="block text-[11px] font-semibold text-gray-500 mb-2">
                Elevation presets
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.keys(SHADOW_PRESETS).map((name) => (
                  <button
                    key={name}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      JSON.stringify(config) === JSON.stringify(SHADOW_PRESETS[name])
                        ? "bg-gray-900 text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={() => setConfig(SHADOW_PRESETS[name])}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Light / Shadow Angle:{" "}
                <span className="font-mono text-[#FF5B04]">{config.angle}°</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full border-2 border-gray-200 flex-shrink-0">
                  <div
                    className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-[#FF5B04]"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${config.angle}deg) translateY(-20px)`,
                    }}
                  />
                </div>
                <input
                  className="w-full accent-[#FF5B04]"
                  max="360"
                  min="0"
                  type="range"
                  value={config.angle}
                  onChange={(e) => set("angle", Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Layers:{" "}
                <span className="font-mono text-[#FF5B04]">{config.layers}</span>
              </label>
              <input
                className="w-full accent-[#FF5B04]"
                max="6"
                min="2"
                type="range"
                value={config.layers}
                onChange={(e) => set("layers", Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Elevation Distance:{" "}
                <span className="font-mono text-[#FF5B04]">{config.distance}px</span>
              </label>
              <input
                className="w-full accent-[#FF5B04]"
                max="80"
                min="4"
                type="range"
                value={config.distance}
                onChange={(e) => set("distance", Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Blur Intensity:{" "}
                <span className="font-mono text-[#FF5B04]">
                  {config.blurRatio.toFixed(1)}×
                </span>
              </label>
              <input
                className="w-full accent-[#FF5B04]"
                max="3"
                min="0.5"
                step="0.1"
                type="range"
                value={config.blurRatio}
                onChange={(e) => set("blurRatio", Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Spread:{" "}
                <span className="font-mono text-[#FF5B04]">{config.spread}px</span>
              </label>
              <input
                className="w-full accent-[#FF5B04]"
                max="10"
                min="-15"
                type="range"
                value={config.spread}
                onChange={(e) => set("spread", Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Falloff Curve
              </label>
              <div className="space-y-1.5">
                {EASING_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`w-full text-left px-3 py-2 rounded-xl border transition-all ${
                      config.easing === opt.value
                        ? "border-[#FF5B04]/50 bg-[#FF5B04]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => set("easing", opt.value)}
                  >
                    <span className="block text-xs font-semibold text-gray-800">
                      {opt.label}
                    </span>
                    <span className="block text-[10px] text-gray-400">{opt.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Shadow Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    className="w-9 h-9 rounded-lg cursor-pointer border border-gray-200"
                    type="color"
                    value={config.color}
                    onChange={(e) => set("color", e.target.value)}
                  />
                  <input
                    className="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-[11px] font-mono text-gray-800 uppercase outline-none"
                    type="text"
                    value={config.color}
                    onChange={(e) => set("color", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Opacity:{" "}
                  <span className="font-mono text-[#FF5B04]">
                    {Math.round(config.opacity * 100)}%
                  </span>
                </label>
                <input
                  className="w-full accent-[#FF5B04] mt-2.5"
                  max="0.7"
                  min="0.05"
                  step="0.01"
                  type="range"
                  value={config.opacity}
                  onChange={(e) => set("opacity", Number(e.target.value))}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-gray-700">Inset Shadow</span>
                <input
                  checked={config.inset}
                  className="w-4 h-4 accent-[#FF5B04] cursor-pointer"
                  type="checkbox"
                  onChange={(e) => set("inset", e.target.checked)}
                />
              </label>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Link
                className="block text-center px-4 py-3 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
                href="/contact"
              >
                Need a Custom Elevation System? →
              </Link>
            </div>
          </div>

          {/* Preview + output */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-gray-900 font-jakarta uppercase tracking-wider">
                  Live Preview
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      !darkPreview
                        ? "bg-gray-900 text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={() => setDarkPreview(false)}
                  >
                    Light
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      darkPreview
                        ? "bg-gray-900 text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={() => setDarkPreview(true)}
                  >
                    Dark
                  </button>
                </div>
              </div>

              <div
                className={`rounded-2xl p-14 flex items-center justify-center transition-colors ${
                  darkPreview ? "bg-gray-900" : "bg-gray-100"
                }`}
              >
                <div
                  className={`w-40 h-40 rounded-2xl flex items-center justify-center text-xs font-mono ${
                    darkPreview ? "bg-gray-800 text-gray-500" : "bg-white text-gray-400"
                  }`}
                  style={{ boxShadow: styleValue }}
                >
                  box-shadow
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 sm:grid-cols-6 gap-3">
                {elevationScale.map((level) => (
                  <div key={level.key} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-full aspect-square rounded-xl ${
                        darkPreview ? "bg-gray-800" : "bg-white"
                      }`}
                      style={{ boxShadow: level.cssValue }}
                    />
                    <span className="text-[10px] font-mono text-gray-400">
                      {level.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Output */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <button
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      outputTab === "css"
                        ? "bg-gray-900 text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={() => setOutputTab("css")}
                  >
                    CSS Variables (Elevation Scale)
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      outputTab === "tailwind"
                        ? "bg-gray-900 text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={() => setOutputTab("tailwind")}
                  >
                    Tailwind Config
                  </button>
                </div>
                <button
                  className="px-3.5 py-1.5 rounded-xl bg-[#FF5B04] hover:bg-[#E54F00] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-[#FF5B04]/15 cursor-pointer"
                  onClick={() => copy(currentOutput, "output")}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  {copied === "output" ? "Copied to Clipboard!" : "Copy Code"}
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-gray-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed max-h-[320px]">
                {currentOutput}
              </pre>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-gray-400">
                  Current box-shadow (single value)
                </span>
                <button
                  className="text-[11px] font-semibold text-[#FF5B04] hover:text-[#E54F00] transition-colors"
                  onClick={() => copy(cssOutput, "single")}
                >
                  {copied === "single" ? "Copied!" : "Copy as CSS rule"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tutorial / Educational Guide */}
        <section className="mt-24 pt-14 border-t border-gray-200 max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
              Shadow & Elevation Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-2">
              Why Layered Shadows Look More Realistic
            </h2>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              A single CSS <code className="font-mono text-gray-800">box-shadow</code>{" "}
              has exactly one blur radius, so its edge fades at a constant
              rate — which reads as flat and slightly artificial. Real shadows
              don't fade evenly: light sources aren't points, so the soft edge
              (the penumbra) spreads and fades faster than the dark core (the
              umbra) grows. Stacking several shadow layers — each with a
              larger offset and blur but lower opacity than the last —
              approximates that natural falloff far better than any single
              blur value can.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">
                Light / Shadow Angle
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Controls the direction the shadow is cast, measured clockwise
                from the top: 0° casts the shadow straight up, 90° to the
                right, 180° straight down (the natural default for a card lit
                from above), and 270° to the left.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">
                Layers &amp; Elevation Distance
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                More layers produce a smoother gradient of blur and opacity —
                3 layers reads as a clean UI shadow, 6 reads as a soft,
                photographic falloff. Distance sets how far the farthest,
                softest layer travels — effectively how "high" the element
                floats above the page.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">
                Falloff Curve (Easing)
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                <span className="font-semibold text-gray-700">Linear</span>{" "}
                spaces layers evenly.{" "}
                <span className="font-semibold text-gray-700">
                  Smooth Diffusion
                </span>{" "}
                pushes layers out quickly and lets the tail ease off gently —
                the most "ambient occlusion" looking option.{" "}
                <span className="font-semibold text-gray-700">
                  Sharp Focus
                </span>{" "}
                keeps early layers tight together for a crisp core, with one
                dramatic long layer at the end.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">
                Blur Intensity, Spread &amp; Opacity
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Blur Intensity scales blur relative to each layer's offset —
                higher values look softer and more diffuse. Negative Spread
                pulls the shadow's edges in slightly, which keeps large
                shadows from looking like a blurry rectangle. Opacity sets how
                dark the closest, sharpest layer is; every layer after it
                fades further automatically.
              </p>
            </div>
          </div>

          {/* Elevation scale explanation */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 font-jakarta mb-3">
              How the xs–2xl Elevation Scale Is Derived
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Rather than asking you to configure six shadows by hand, this
              tool treats your current settings as the{" "}
              <span className="font-semibold text-gray-700">MD</span>{" "}
              baseline and scales the distance and spread up or down for each
              level — while keeping the same angle, color, layer count, and
              falloff curve. That's what keeps an entire elevation system
              looking like one consistent light source instead of six
              unrelated shadows.
            </p>
            <div className="flex flex-wrap gap-2">
              {generateElevationScale(config).map((level) => (
                <span
                  key={level.key}
                  className="text-[11px] font-mono px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600"
                >
                  {level.label} = {level.scale}× distance
                </span>
              ))}
            </div>
          </div>

          {/* Step by step */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 font-jakarta mb-6">
              Step-by-Step: How to Use This Generator
            </h3>
            <div className="space-y-5">
              {[
                {
                  title: "Start from a preset",
                  desc: "Subtle Card, Raised Button, Modal / Dialog, and Dramatic Hero cover the most common elevation use cases — pick the closest one as a starting point.",
                },
                {
                  title: "Set your light direction and distance",
                  desc: "180° (light from above) is the standard default. Increase Elevation Distance for elements that should feel like they're floating higher above the page.",
                },
                {
                  title: "Pick a falloff curve",
                  desc: "Smooth Diffusion for soft, modern UI. Sharp Focus for a more dramatic, high-contrast shadow with a long soft tail.",
                },
                {
                  title: "Tune color and opacity to your background",
                  desc: "Shadows on a colored or dark background often look better tinted (a dark navy instead of pure black) rather than just darkened.",
                },
                {
                  title: "Export the full scale",
                  desc: "Copy the CSS custom properties or Tailwind boxShadow config — six synchronized tokens (xs through 2xl), ready to drop into your design system.",
                },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-[#FF5B04]/8 text-[#FF5B04] flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 mb-1">
                      {step.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {step.desc}
                    </p>
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
                  q: "Why not just use one box-shadow with a bigger blur?",
                  a: "A single blur value fades at a constant rate, which looks flat and can turn muddy at large sizes. Multiple layers with decreasing opacity mimic how real ambient light actually falls off — sharper near the object, softer and fainter further away.",
                },
                {
                  q: "Why is my shadow color a dark navy instead of black?",
                  a: "Pure black shadows can look harsh and disconnected from a colored background. A very dark, slightly saturated color (like #0F172A) tends to blend more naturally — most of the built-in presets use this instead of #000000.",
                },
                {
                  q: "What does negative spread do?",
                  a: "Spread grows or shrinks the shadow's box before blurring. A small negative spread (like -2px to -6px) keeps large, soft shadows from reading as a blurry rectangle by pulling their edges in slightly first.",
                },
                {
                  q: "How many layers should I use?",
                  a: "3–4 layers is plenty for small UI elements like buttons and cards. Reach for 5–6 layers on large, dramatic elevation — like a modal or a hero image — where the extra layers produce a noticeably smoother gradient.",
                },
                {
                  q: "Will this work with Tailwind's default shadow scale?",
                  a: "The exported boxShadow config adds new keys (xs, sm, md, lg, xl, 2xl) to your theme.extend.boxShadow, so it layers on top of Tailwind's defaults rather than replacing them — use shadow-md, shadow-lg, etc. as normal.",
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-gray-50 border border-gray-100"
                >
                  <h4 className="text-xs font-bold text-gray-900 mb-1">{faq.q}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Suggested Tools */}
        <SuggestedTools category="design-system" currentToolId="css-shadow-generator" />
      </div>
    </div>
  );
}
