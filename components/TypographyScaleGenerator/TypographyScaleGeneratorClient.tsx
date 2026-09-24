"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import SuggestedTools from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";

const SCALE_RATIOS = [
  {
    value: 1.067,
    name: "Minor Second",
    bestFor: "Dense admin dashboards & data tables",
    description:
      "The subtlest ratio available. Sizes barely differ from one step to the next, so hierarchy comes from weight and color rather than scale. Ideal when a screen has many small text variants (table headers, badges, metadata) and you can't afford large jumps eating up vertical space.",
  },
  {
    value: 1.125,
    name: "Major Second",
    bestFor: "Enterprise SaaS dashboards & utility UIs",
    description:
      "A gentle step up from Minor Second. Still restrained enough for information-dense products, but with just enough contrast to separate section titles from body copy without dominating the layout.",
  },
  {
    value: 1.2,
    name: "Minor Third",
    bestFor: "Design systems & component libraries",
    description:
      "One of the most widely used ratios in production UI design systems (Material Design uses something close to it). Balanced hierarchy that reads clearly on both desktop and mobile without feeling dramatic.",
  },
  {
    value: 1.25,
    name: "Major Third",
    bestFor: "Content-led marketing sites & SaaS landing pages",
    description:
      "The default in this generator. A warm, classic ratio that gives headings real presence while keeping body copy comfortably readable — the sweet spot for most SaaS marketing and product pages.",
  },
  {
    value: 1.333,
    name: "Perfect Fourth",
    bestFor: "Landing pages & editorial layouts",
    description:
      "Noticeably bolder jumps between steps. Headlines start to command real attention, which works well for pages built to sell a single idea fast — hero sections, launch pages, editorial features.",
  },
  {
    value: 1.414,
    name: "Augmented Fourth",
    bestFor: "Expressive brand sites (use sparingly)",
    description:
      "Also known as the 'tritone' ratio. Produces dramatic, sometimes jarring jumps in size. Best reserved for brand-forward sites that want typography itself to feel like a design statement.",
  },
  {
    value: 1.5,
    name: "Perfect Fifth",
    bestFor: "Hero sections & single-page product launches",
    description:
      "A very large step between sizes, pushing display text and body copy far apart. Good for pages with one dominant headline and comparatively little supporting text, like a pre-launch landing page.",
  },
  {
    value: 1.618,
    name: "Golden Ratio",
    bestFor: "Portfolios, editorial & premium brand experiences",
    description:
      "The most dramatic ratio, derived from the golden proportion found throughout classical art and architecture. Produces striking, editorial-feeling type hierarchies — best used where typography carries most of the visual weight.",
  },
];

function ratioName(value: number) {
  const found = SCALE_RATIOS.find((r) => Math.abs(r.value - value) < 0.0005);

  return found ? found.name : "Custom";
}

const SCALE_STEPS = [
  {
    key: "display",
    label: "Display",
    tag: "Display",
    step: 7,
    sample: "Design that converts.",
  },
  {
    key: "h1",
    label: "H1 · Page Title",
    tag: "H1",
    step: 6,
    sample: "Ship SaaS interfaces faster.",
  },
  {
    key: "h2",
    label: "H2 · Section Title",
    tag: "H2",
    step: 5,
    sample: "Built for product teams.",
  },
  {
    key: "h3",
    label: "H3 · Sub-heading",
    tag: "H3",
    step: 4,
    sample: "Everything in one workspace.",
  },
  {
    key: "h4",
    label: "H4 · Card Title",
    tag: "H4",
    step: 3,
    sample: "Feature section heading",
  },
  {
    key: "h5",
    label: "H5 · Small Heading",
    tag: "H5",
    step: 2,
    sample: "Card or widget title",
  },
  {
    key: "lead",
    label: "Lead / H6",
    tag: "H6",
    step: 1,
    sample: "A slightly larger lead paragraph for intros.",
  },
  {
    key: "body",
    label: "Body (Base)",
    tag: "P",
    step: 0,
    sample: "The quick brown fox jumps over the lazy dog.",
  },
  {
    key: "small",
    label: "Small / UI Label",
    tag: "Span",
    step: -1,
    sample: "Form labels & table headers",
  },
  {
    key: "caption",
    label: "Caption",
    tag: "Span",
    step: -2,
    sample: "Metadata, timestamps & helper text",
  },
];

function lineHeightForStep(step: number) {
  const raw = 1.5 - step * 0.055;
  const rounded = Math.round(raw * 100) / 100;

  return Math.min(1.6, Math.max(1.1, rounded));
}

function pxFmt(n: number) {
  return `${n.toFixed(n >= 100 ? 0 : 1)}px`;
}

function remFmt(n: number) {
  return `${(n / 16).toFixed(3)}rem`;
}

export default function TypographyScaleGeneratorClient() {
  const [baseSize, setBaseSize] = useState(16);
  const [ratio, setRatio] = useState(1.25);
  const [fluidEnabled, setFluidEnabled] = useState(true);
  const [mobileRatio, setMobileRatio] = useState(1.125);
  const [minViewport, setMinViewport] = useState(400);
  const [maxViewport, setMaxViewport] = useState(1280);
  const [simViewport, setSimViewport] = useState(860);
  const [unit, setUnit] = useState<"rem" | "px">("rem");
  const [outputTab, setOutputTab] = useState<"css" | "clamp" | "tailwind">(
    "clamp",
  );
  const [copied, setCopied] = useState(false);

  const effectiveSimViewport = Math.min(
    maxViewport,
    Math.max(minViewport, simViewport),
  );

  const scale = useMemo(() => {
    return SCALE_STEPS.map((s) => {
      const maxPxRaw = baseSize * Math.pow(ratio, s.step);
      const minPxRaw =
        fluidEnabled && s.step > 0
          ? baseSize * Math.pow(mobileRatio, s.step)
          : maxPxRaw;

      const minPx = Math.min(minPxRaw, maxPxRaw);
      const maxPx = Math.max(minPxRaw, maxPxRaw);
      const viewportValid = maxViewport > minViewport;
      const isFluid =
        fluidEnabled && s.step > 0 && maxPx - minPx > 0.05 && viewportValid;

      const slope = isFluid ? (maxPx - minPx) / (maxViewport - minViewport) : 0;
      const interceptPx = isFluid ? minPx - slope * minViewport : maxPx;

      const simPx = isFluid
        ? Math.min(
            maxPx,
            Math.max(minPx, interceptPx + slope * effectiveSimViewport),
          )
        : maxPx;

      const lineHeight = lineHeightForStep(s.step);

      const clampCss = isFluid
        ? `clamp(${remFmt(minPx)}, ${(interceptPx / 16).toFixed(3)}rem + ${(
            slope * 100
          ).toFixed(3)}vw, ${remFmt(maxPx)})`
        : remFmt(maxPx);

      return {
        ...s,
        minPx,
        maxPx,
        simPx,
        isFluid,
        lineHeight,
        clampCss,
      };
    });
  }, [
    baseSize,
    ratio,
    fluidEnabled,
    mobileRatio,
    minViewport,
    maxViewport,
    effectiveSimViewport,
  ]);

  const h1Row = scale.find((s) => s.key === "h1")!;

  const staticCssOutput = useMemo(() => {
    const lines = [
      `:root {`,
      `  /* Modular Typography Scale — base ${baseSize}px · ratio ${ratio} (${ratioName(
        ratio,
      )}) */`,
    ];

    scale.forEach((s) => {
      const value = unit === "rem" ? remFmt(s.maxPx) : pxFmt(s.maxPx);

      lines.push(`  --text-${s.key}: ${value};`);
    });
    lines.push(``);
    scale.forEach((s) => {
      lines.push(`  --leading-${s.key}: ${s.lineHeight};`);
    });
    lines.push(`}`);

    return lines.join("\n");
  }, [scale, unit, baseSize, ratio]);

  const fluidCssOutput = useMemo(() => {
    const lines = [
      `:root {`,
      `  /* Fluid type — interpolates between ${minViewport}px and ${maxViewport}px viewport width */`,
    ];

    scale.forEach((s) => {
      lines.push(`  --text-${s.key}: ${s.clampCss};`);
    });
    lines.push(``);
    scale.forEach((s) => {
      lines.push(`  --leading-${s.key}: ${s.lineHeight};`);
    });
    lines.push(`}`);

    return lines.join("\n");
  }, [scale, minViewport, maxViewport]);

  const tailwindOutput = useMemo(() => {
    const lines = [
      `// tailwind.config.js`,
      `module.exports = {`,
      `  theme: {`,
      `    extend: {`,
      `      fontSize: {`,
    ];

    scale.forEach((s) => {
      lines.push(
        `        ${s.key}: ["${s.clampCss}", { lineHeight: "${s.lineHeight}" }],`,
      );
    });
    lines.push(`      },`);
    lines.push(`    },`);
    lines.push(`  },`);
    lines.push(`};`);

    return lines.join("\n");
  }, [scale]);

  const currentOutput =
    outputTab === "css"
      ? staticCssOutput
      : outputTab === "clamp"
        ? fluidCssOutput
        : tailwindOutput;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <GlassBadge variant="gradient">
              TYPOGRAPHY &amp; DESIGN SYSTEMS
            </GlassBadge>
          </div>

          <h1 className="text-[38px] sm:text-[50px] md:text-[62px] lg:text-[72px] text-center font-[800] tracking-[-1.5px] leading-[1.08] text-gray-900 mb-5">
            Modular Typography Scale &amp;{" "}
            <span className="text-[#FF5B04]">Fluid Font</span> Generator
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto text-center font-normal leading-relaxed">
            Generate a mathematically harmonious type scale, a proportional
            line-height ramp, and responsive CSS clamp() fluid font sizes —
            export straight to CSS variables or a Tailwind config.
          </p>

          {/* Integrated Capability Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              "8 Modular Scale Ratios",
              "Proportional Line-Height Ramp",
              "CSS clamp() Fluid Typography",
              "Live Viewport Simulation",
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

          {/* Engine Status & Consultation Callout */}
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
                Need a full type system audit across your entire product?
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

        {/* Builder Grid: Controls + Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
          {/* Controls */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 lg:sticky lg:top-28">
            <h3 className="text-sm font-bold text-gray-900 font-jakarta uppercase tracking-wider">
              Scale Parameters
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Base Font Size:{" "}
                <span className="font-mono text-[#FF5B04]">{baseSize}px</span>
              </label>
              <input
                className="w-full accent-[#FF5B04]"
                max="24"
                min="12"
                type="range"
                value={baseSize}
                onChange={(e) => setBaseSize(Number(e.target.value))}
              />
              <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                16px matches the browser default and is the safest accessible
                baseline for body copy.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Desktop Scale Ratio
              </label>
              <select
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs text-gray-800 outline-none bg-white font-jakarta"
                value={ratio}
                onChange={(e) => setRatio(Number(e.target.value))}
              >
                {SCALE_RATIOS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.value.toFixed(3)} — {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-gray-700">
                  Enable Fluid clamp() Scaling
                </span>
                <input
                  checked={fluidEnabled}
                  className="w-4 h-4 accent-[#FF5B04] cursor-pointer"
                  type="checkbox"
                  onChange={(e) => setFluidEnabled(e.target.checked)}
                />
              </label>
              <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                Headings (H6 and above) interpolate smoothly between a mobile
                and desktop size. Body, Small, and Caption stay fixed.
              </p>
            </div>

            {fluidEnabled && (
              <div className="space-y-4 pl-3 border-l-2 border-[#FF5B04]/20">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Mobile Scale Ratio
                  </label>
                  <select
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs text-gray-800 outline-none bg-white font-jakarta"
                    value={mobileRatio}
                    onChange={(e) => setMobileRatio(Number(e.target.value))}
                  >
                    {SCALE_RATIOS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.value.toFixed(3)} — {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Min Viewport
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono text-gray-800 outline-none"
                      max="768"
                      min="320"
                      type="number"
                      value={minViewport}
                      onChange={(e) => setMinViewport(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Max Viewport
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono text-gray-800 outline-none"
                      max="2560"
                      min="900"
                      type="number"
                      value={maxViewport}
                      onChange={(e) => setMaxViewport(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Simulate Viewport Width:{" "}
                    <span className="font-mono text-[#FF5B04]">
                      {effectiveSimViewport}px
                    </span>
                  </label>
                  <input
                    className="w-full accent-[#FF5B04]"
                    max={maxViewport}
                    min={minViewport}
                    type="range"
                    value={effectiveSimViewport}
                    onChange={(e) => setSimViewport(Number(e.target.value))}
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                    Drag to preview exactly how the scale looks at that
                    viewport width, without resizing your browser.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Static Export Unit
              </label>
              <div className="flex gap-2">
                {(["rem", "px"] as const).map((u) => (
                  <button
                    key={u}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      unit === u
                        ? "bg-gray-900 text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={() => setUnit(u)}
                  >
                    {u}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                Applies to the CSS Variables tab. clamp() and Tailwind output
                always use rem.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Link
                className="block text-center px-4 py-3 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
                href="/contact"
              >
                Need a Custom Type System Built? →
              </Link>
            </div>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-gray-900 font-jakarta uppercase tracking-wider">
                Live Preview
              </h3>
              {fluidEnabled && (
                <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#FF5B04]/8 text-[#FF5B04] border border-[#FF5B04]/20">
                  simulating {effectiveSimViewport}px viewport
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mb-4">
              Every row re-renders at its real computed size — this is not a
              mockup.
            </p>

            <div>
              {scale.map((s) => (
                <div
                  key={s.key}
                  className="border-b border-gray-100 last:border-0 py-4"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-0.5">
                      {s.tag}
                    </span>
                    <div className="font-mono text-[11px] text-gray-400 flex items-center gap-3">
                      <span>{pxFmt(s.simPx)}</span>
                      <span>{remFmt(s.simPx)}</span>
                      <span>lh {s.lineHeight}</span>
                      {s.isFluid && (
                        <span className="text-[#FF5B04] font-semibold">
                          fluid
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className="font-jakarta font-bold text-gray-900 truncate"
                    style={{
                      fontSize: `${s.simPx}px`,
                      lineHeight: s.lineHeight,
                    }}
                  >
                    {s.sample}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code Output */}
        <div className="w-full mt-8 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
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
                CSS Variables
              </button>
              <button
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  outputTab === "clamp"
                    ? "bg-gray-900 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setOutputTab("clamp")}
              >
                Fluid clamp() CSS
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
              onClick={copyToClipboard}
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
              {copied ? "Copied to Clipboard!" : "Copy Code"}
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-gray-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed max-h-[420px]">
            {currentOutput}
          </pre>
        </div>

        {/* Detailed Tutorial / Educational Guide */}
        <section className="mt-24 pt-14 border-t border-gray-200 max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
              Typography Engineering Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-2">
              Understanding Modular Typography Scales
            </h2>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              A modular scale multiplies a base font size by a fixed ratio to
              generate a harmonious progression of sizes for headings, body
              copy, and UI text — instead of picking arbitrary pixel values by
              eye. The technique borrows its ratio names (Minor Third, Perfect
              Fifth, Golden Ratio) from musical interval theory and classical
              typography, both of which rely on the same idea: proportions
              that repeat at a consistent rate feel intentional and
              well-balanced to the human eye, the same way they sound
              balanced to the ear.
            </p>
          </div>

          {/* Ratio Explanations */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 font-jakarta mb-1">
              The 8 Scale Ratios, Explained
            </h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed max-w-3xl">
              Every ratio below produces a different personality for your
              type hierarchy. Smaller ratios (closer to 1.0) create subtle,
              utilitarian hierarchy; larger ratios create bold, editorial
              hierarchy. Pick a ratio in the tool above that matches the tone
              of the product you're designing.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {SCALE_RATIOS.map((r) => (
                <div
                  key={r.value}
                  className={`bg-white border rounded-2xl p-5 transition-all ${
                    Math.abs(r.value - ratio) < 0.0005
                      ? "border-[#FF5B04]/50 shadow-[0_4px_20px_rgba(255,91,4,0.08)]"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-gray-900 font-jakarta">
                      {r.name}
                    </h4>
                    <span className="font-mono text-xs text-[#FF5B04] font-bold">
                      {r.value.toFixed(3)}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-gray-700 mb-1.5">
                    Best for: {r.bestFor}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {r.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Fluid Typography Explanation */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 font-jakarta mb-3">
              How Fluid Typography with clamp() Works
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              CSS <code className="font-mono text-gray-800">clamp()</code>{" "}
              takes three values —{" "}
              <code className="font-mono text-gray-800">
                clamp(MIN, PREFERRED, MAX)
              </code>{" "}
              — and picks whichever is in the middle. The{" "}
              <span className="font-semibold text-gray-700">PREFERRED</span>{" "}
              value is a linear equation mixing a fixed{" "}
              <code className="font-mono text-gray-800">rem</code> amount with
              a <code className="font-mono text-gray-800">vw</code> (viewport
              width) amount, so it grows continuously as the browser resizes.
              Below the minimum viewport it locks to{" "}
              <span className="font-semibold text-gray-700">MIN</span>, above
              the maximum viewport it locks to{" "}
              <span className="font-semibold text-gray-700">MAX</span> — no
              media queries required.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              This generator calculates the slope and intercept for you using
              the same two-point interpolation technique popularized by{" "}
              <span className="font-semibold text-gray-700">Utopia.fyi</span>
              : it takes the size at your{" "}
              <span className="font-semibold text-gray-700">
                Mobile Scale Ratio
              </span>{" "}
              (evaluated at Min Viewport) and the size at your{" "}
              <span className="font-semibold text-gray-700">
                Desktop Scale Ratio
              </span>{" "}
              (evaluated at Max Viewport), then draws a straight line between
              them.
            </p>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-800">
                With your current settings:
              </span>{" "}
              the H1 token clamps between{" "}
              <span className="font-mono text-[#FF5B04]">
                {pxFmt(h1Row.minPx)}
              </span>{" "}
              at a {minViewport}px-wide viewport and{" "}
              <span className="font-mono text-[#FF5B04]">
                {pxFmt(h1Row.maxPx)}
              </span>{" "}
              at a {maxViewport}px-wide viewport, growing smoothly in
              between with zero breakpoints.
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mt-4">
              Notice that Body, Small, and Caption don't scale fluidly in this
              tool — that's intentional. Real-world fluid type systems (like
              Utopia's) almost always keep body copy near-constant across
              screen sizes, since paragraph text needs a consistent, readable
              size on every device. Only headings and display text — which
              exist to create visual hierarchy — benefit from scaling with the
              viewport.
            </p>
          </div>

          {/* Line Height Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 font-jakarta mb-2">
                Why Line-Height Shrinks as Font Size Grows
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Large display text and headlines already have tall, open
                letterforms, so extra line-height between wrapped lines starts
                to look disconnected and loose. Small body and caption text
                needs the opposite: generous line-height (around 1.5–1.6×
                the font size) gives the eye enough vertical breathing room to
                track from the end of one line to the start of the next. This
                tool ramps line-height down from{" "}
                <span className="font-mono text-gray-800">1.6</span> at
                Caption to roughly{" "}
                <span className="font-mono text-gray-800">1.1</span> at
                Display, so every step stays comfortable to read at its own
                size.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 font-jakarta mb-2">
                rem vs. px — Which Unit Should You Export?
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                <span className="font-mono text-gray-800">rem</span> units
                are relative to the root{" "}
                <code className="font-mono text-gray-800">
                  html {"{"} font-size {"}"}
                </code>
                , which means they scale correctly when a user increases
                their browser's default font size for accessibility.{" "}
                <span className="font-mono text-gray-800">px</span> is fixed
                and ignores that preference. Export{" "}
                <span className="font-semibold text-gray-700">rem</span> for
                production CSS, and only reach for{" "}
                <span className="font-semibold text-gray-700">px</span> when
                you're quickly matching a Figma spec or prototyping.
              </p>
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
                  title: "Set your base font size",
                  desc: "16px matches the browser default and is the accessible baseline most browsers, screen readers, and zoom tools expect. Avoid going below 14px for body copy.",
                },
                {
                  title: "Choose a desktop scale ratio",
                  desc: "Use the ratio guide above to match your product's tone — subtle ratios (1.067–1.125) for dense dashboards, bolder ratios (1.25–1.618) for marketing and editorial layouts.",
                },
                {
                  title: "Enable fluid typography",
                  desc: "Toggle it on, pick a smaller Mobile Scale Ratio, and set Min/Max Viewport bounds. 400–1280px comfortably covers small phones through laptop screens.",
                },
                {
                  title: "Preview and simulate",
                  desc: "Drag the Simulate Viewport Width slider to see exactly how each heading grows between your min and max breakpoints before you ship a single line of CSS.",
                },
                {
                  title: "Export your tokens",
                  desc: "Copy CSS custom properties, the clamp() fluid ruleset, or a ready-to-paste Tailwind fontSize config, then drop it into your project's :root or tailwind.config.js.",
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
                  q: "What is a modular typography scale?",
                  a: "A modular typography scale multiplies a base font size by a fixed ratio (like 1.25 or 1.333) to generate a harmonious sequence of heading and body text sizes, instead of picking arbitrary pixel values by eye.",
                },
                {
                  q: "What's the difference between a modular scale and fluid typography?",
                  a: "A modular scale defines the ratio between sizes at any single moment. Fluid typography, built with CSS clamp(), makes those sizes interpolate smoothly between a minimum and maximum value as the viewport width changes, removing the need for font-size media queries.",
                },
                {
                  q: "Which scale ratio should I use for a SaaS product?",
                  a: "Dense, data-heavy dashboards usually work best with subtle ratios like Minor Second (1.067) or Major Second (1.125). Marketing and landing pages read better with Major Third (1.25) or Perfect Fourth (1.333) for stronger visual hierarchy.",
                },
                {
                  q: "Do I need JavaScript to use clamp() typography in production?",
                  a: "No. clamp() is native CSS, supported in every modern browser. Paste the generated CSS variables (or Tailwind config) straight into your stylesheet — there's no runtime cost or JavaScript required.",
                },
                {
                  q: "Will fluid typography hurt Core Web Vitals or cause layout shift?",
                  a: "No, as long as the font-size is set before content paints (which it is with plain CSS). clamp() changes size continuously on resize rather than snapping at breakpoints, which typically produces less visible shift than media-query-based type, not more.",
                },
                {
                  q: "How does this relate to accessibility (WCAG)?",
                  a: "Exporting sizes in rem (not px) respects a user's browser font-size preference, and the line-height ramp in this tool keeps body text at or above the 1.5x ratio recommended by WCAG 2.1 Success Criterion 1.4.12 (Text Spacing).",
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-gray-50 border border-gray-100"
                >
                  <h4 className="text-xs font-bold text-gray-900 mb-1">
                    {faq.q}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Suggested Tools */}
        <SuggestedTools
          category="design-system"
          currentToolId="typography-scale-generator"
        />
      </div>
    </div>
  );
}
