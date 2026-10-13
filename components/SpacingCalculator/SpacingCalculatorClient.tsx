"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import SuggestedTools from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";
import {
  checkGridAlignment,
  computeDensityTokens,
  generateSpacingScale,
  spacingScaleCssVariables,
  spacingScaleFigmaVariables,
  spacingScaleTailwindConfig,
  type Density,
} from "@/lib/spacingScale";

export default function SpacingCalculatorClient() {
  const [baseUnit, setBaseUnit] = useState<4 | 8>(8);
  const [stepCount, setStepCount] = useState(16);
  const [exportFormat, setExportFormat] = useState<"css" | "tailwind" | "figma">("css");
  const [copied, setCopied] = useState(false);
  const [checkInput, setCheckInput] = useState("13");

  const scale = useMemo(() => generateSpacingScale(baseUnit, stepCount), [baseUnit, stepCount]);

  const densities: Density[] = ["compact", "comfortable", "spacious"];
  const densityTokens = densities.map((d) => computeDensityTokens(d, baseUnit));

  const alignment = useMemo(() => {
    const n = Number(checkInput);

    return Number.isFinite(n) && n >= 0 ? checkGridAlignment(n, baseUnit) : null;
  }, [checkInput, baseUnit]);

  const exportText = useMemo(() => {
    if (exportFormat === "css") return `:root {\n${spacingScaleCssVariables(scale, "space")}\n}`;
    if (exportFormat === "tailwind") return spacingScaleTailwindConfig(scale);

    return spacingScaleFigmaVariables(scale, "space");
  }, [scale, exportFormat]);

  const copy = async () => {
    await navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none -top-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at 50% 25%, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 25%, black 40%, transparent 80%)",
        }}
      />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-[#FF5B04]/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-32 lg:px-20 max-md:px-4 pt-32 pb-20 relative z-10">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 w-full max-w-5xl mx-auto"
          initial={{ opacity: 0, y: -12 }}
        >
          <div className="mb-6 flex flex-row items-center justify-center">
            <GlassBadge variant="gradient">DESIGN SYSTEMS &amp; CODE</GlassBadge>
          </div>

          <h1 className="text-[38px] sm:text-[50px] md:text-[62px] lg:text-[72px] text-center font-[800] tracking-[-1.5px] leading-[1.08] text-gray-900 mb-5">
            8pt Grid &amp;{" "}
            <span className="text-[#FF5B04]">Figma Spacing Calculator</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto text-center font-normal leading-relaxed">
            Generate an 8pt/4pt spacing scale with exact px/rem values,
            check any arbitrary pixel value for grid alignment, and export
            ready-to-use CSS variables, Tailwind config, or Figma variables.
          </p>
        </motion.div>

        <div className="w-full max-w-5xl mx-auto space-y-6 mb-12">
          {/* Controls */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">Base unit</label>
              <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                {([4, 8] as const).map((u) => (
                  <button
                    key={u}
                    className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                      baseUnit === u ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                    }`}
                    type="button"
                    onClick={() => setBaseUnit(u)}
                  >
                    {u}pt grid
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">
                Steps: {stepCount}
              </label>
              <input
                className="w-full accent-[#FF5B04]"
                max={24}
                min={4}
                type="range"
                value={stepCount}
                onChange={(e) => setStepCount(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">
                Check a pixel value for grid alignment
              </label>
              <input
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none font-mono"
                type="number"
                value={checkInput}
                onChange={(e) => setCheckInput(e.target.value)}
              />
            </div>
          </div>

          {alignment && (
            <div
              className={`rounded-2xl border p-4 text-xs leading-relaxed ${
                alignment.isAligned
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-amber-50 border-amber-200 text-amber-800"
              }`}
            >
              {alignment.isAligned ? (
                <>
                  <span className="font-bold">{alignment.px}px is aligned</span> to the {baseUnit}pt
                  grid.
                </>
              ) : (
                <>
                  <span className="font-bold">{alignment.px}px is not aligned</span> to the {baseUnit}
                  pt grid. Nearest values: <span className="font-mono font-bold">{alignment.nearestDown}px</span> (down) or{" "}
                  <span className="font-mono font-bold">{alignment.nearestUp}px</span> (up), closest is{" "}
                  <span className="font-mono font-bold">{alignment.nearest}px</span>.
                </>
              )}
            </div>
          )}

          {/* Scale visualization */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 font-jakarta mb-4">Spacing Scale</h3>
            <div className="space-y-1.5 max-h-96 overflow-y-auto pr-2">
              {scale.map((s) => (
                <div key={s.step} className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-gray-400 w-6 text-right">{s.step}</span>
                  <div
                    className="h-3 bg-[#FF5B04] rounded-sm"
                    style={{ width: `${Math.min(s.px, 280)}px` }}
                  />
                  <span className="text-[11px] font-mono text-gray-600">{s.px}px</span>
                  <span className="text-[11px] font-mono text-gray-400">{s.rem}rem</span>
                  {s.tailwindToken && (
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      p-{s.tailwindToken}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Density tokens */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {densityTokens.map((t) => (
              <div key={t.density} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
                <h4 className="text-xs font-bold text-gray-900 capitalize mb-3 font-jakarta">
                  {t.density}
                </h4>
                <div
                  className="border-2 border-dashed border-[#FF5B04]/40 rounded-xl mb-3 flex items-center justify-center bg-orange-50/50"
                  style={{ padding: `${t.paddingY}px ${t.paddingX}px` }}
                >
                  <div className="flex items-center bg-white rounded-lg px-3 py-1.5 shadow-sm" style={{ gap: `${t.gap}px` }}>
                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                    <span className="text-[10px] text-gray-600">Button</span>
                  </div>
                </div>
                <div className="space-y-1 text-[11px] font-mono text-gray-500">
                  <p>padding-x: {t.paddingX}px</p>
                  <p>padding-y: {t.paddingY}px</p>
                  <p>gap: {t.gap}px</p>
                </div>
              </div>
            ))}
          </div>

          {/* Export */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                {(["css", "tailwind", "figma"] as const).map((f) => (
                  <button
                    key={f}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      exportFormat === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                    }`}
                    type="button"
                    onClick={() => setExportFormat(f)}
                  >
                    {f === "css" ? "CSS Variables" : f === "tailwind" ? "Tailwind Config" : "Figma Variables"}
                  </button>
                ))}
              </div>
              <button
                className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all"
                type="button"
                onClick={copy}
              >
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 rounded-2xl p-4 text-[11px] font-mono overflow-x-auto whitespace-pre max-h-80 overflow-y-auto">
              {exportText}
            </pre>
          </div>
        </div>

        {/* Tutorial */}
        <section className="mt-4 pt-14 border-t border-gray-200 max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
              Spacing System Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-2">
              What the 8-Point Grid Actually Solves
            </h2>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              The 8pt grid isn&apos;t a rule for its own sake - it exists to
              solve three concrete, recurring problems in UI layout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "1. Composability",
                desc: "If every spacing value is a multiple of 8, any two spacing values you combine (padding + gap, margin + border) also land on the grid - nothing ever produces an odd, off-grid remainder.",
              },
              {
                title: "2. Cross-density screens",
                desc: "8 divides cleanly by common device pixel ratios (1x, 2x, 3x) with no sub-pixel rounding, so the same 8pt value renders crisply on a standard display and a Retina display alike.",
              },
              {
                title: "3. Fewer decisions",
                desc: "A finite, named scale (0, 4, 8, 16, 24, 32...) means a spacing decision is a lookup, not a fresh judgment call every time - which is also exactly what a design token system needs to exist.",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-10">
            <h3 className="text-lg font-bold text-gray-900 font-jakarta mb-4">
              8pt vs. 4pt - Which Should You Use?
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Most teams use 8px as the base unit for macro layout (section
              spacing, card padding, layout gaps) and allow 4px as a
              deliberate "half step" for micro adjustments - icon padding,
              tight label spacing, border-adjacent alignment - where a full
              8px would look too loose. Very few interfaces need finer than
              4px; if you find yourself reaching for 1-3px values regularly,
              that's usually a sign of an underlying alignment bug, not a
              legitimate design need.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              The density presets above (compact/comfortable/spacious) are a
              common starting convention - padding and gap scaling as fixed
              multiples of your base unit - not a derived law. Treat them as
              a starting point to tune, not a rule to follow blindly.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 font-jakarta mb-6">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {[
                {
                  q: "Why isn't my design's spacing landing on exact px values in Figma?",
                  a: "Figma's Auto Layout can produce fractional pixel values when nested frames use percentage-based resizing or when a parent frame's width isn't itself a multiple of your base unit - use the alignment checker above to see how far off any given value is.",
                },
                {
                  q: "What root font size does the rem conversion use?",
                  a: "16px, the browser default. If your project sets a different root font-size (a common trick is 62.5% for a 10px root), the rem values here won't directly apply - the px values will still be correct regardless.",
                },
                {
                  q: "Do the Tailwind config numbers match Tailwind's own default spacing scale?",
                  a: "Where they overlap, yes - Tailwind's default scale is itself built on a 4px unit (its \"4\" token is 16px, i.e. 4 x 4px), which is why the token badges next to each row above only appear for values that already exist in Tailwind's defaults.",
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

        <SuggestedTools category="design-system" currentToolId="figma-spacing-calculator" />
      </div>
    </div>
  );
}
