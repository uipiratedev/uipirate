"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import SuggestedTools from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";
import {
  generateNeutralPalette,
  generatePalette,
  shadeCssVariables,
  shadeTailwindConfig,
  type Palette,
} from "@/lib/colorPalette";

function PaletteRow({ palette, label }: { palette: Palette; label: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 font-jakarta mb-4">{label}</h3>
      <div className="grid grid-cols-11 gap-1.5 max-md:grid-cols-6">
        {palette.shades.map((shade) => (
          <div key={shade.stop} className="text-center">
            <div
              className="w-full aspect-square rounded-lg border border-black/5 flex items-end justify-center pb-1"
              style={{ backgroundColor: shade.hex }}
            >
              <span
                className="text-[9px] font-bold"
                style={{ color: shade.recommendedTextColor === "white" ? "#fff" : "#000" }}
              >
                {shade.stop}
              </span>
            </div>
            <p className="text-[9px] font-mono text-gray-400 mt-1 truncate">{shade.hex}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ColorPaletteGeneratorClient() {
  const [colorText, setColorText] = useState("#FF5B04");
  const [exportFormat, setExportFormat] = useState<"css" | "tailwind">("css");
  const [copied, setCopied] = useState(false);

  const primary = useMemo(() => generatePalette(colorText), [colorText]);
  const neutral = useMemo(() => generateNeutralPalette(colorText, 8), [colorText]);

  const exportText = useMemo(() => {
    if (!primary) return "";

    return exportFormat === "css"
      ? `:root {\n${shadeCssVariables(primary, "brand")}\n}`
      : shadeTailwindConfig(primary, "brand");
  }, [primary, exportFormat]);

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
            Accessible SaaS{" "}
            <span className="text-[#FF5B04]">Color Palette Generator</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto text-center font-normal leading-relaxed">
            Enter one brand color and get a full 50-950 shade ramp, plus a
            matching low-saturation neutral scale — every shade computed
            live with its own WCAG contrast ratio and a recommended text
            color, not a fixed lookup table.
          </p>

          <div className="mt-8 max-w-md mx-auto flex items-center gap-2 bg-white border border-gray-200 rounded-full p-2 shadow-sm">
            <input
              className="w-10 h-10 rounded-full border border-gray-200 cursor-pointer flex-shrink-0"
              type="color"
              value={primary?.baseHex ?? "#FF5B04"}
              onChange={(e) => setColorText(e.target.value)}
            />
            <input
              className="flex-1 px-3 py-2.5 text-sm text-gray-800 outline-none bg-transparent font-mono"
              placeholder="#FF5B04"
              type="text"
              value={colorText}
              onChange={(e) => setColorText(e.target.value)}
            />
          </div>
          {!primary && (
            <p className="text-[11px] text-red-500 mt-3">
              Couldn&apos;t parse this color - try hex, rgb(), or hsl().
            </p>
          )}
        </motion.div>

        {primary && neutral && (
          <div className="w-full max-w-5xl mx-auto space-y-6 mb-12">
            <PaletteRow label="Brand Ramp" palette={primary} />
            <PaletteRow label="Neutral Ramp (auto-desaturated, same hue)" palette={neutral} />

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                  {(["css", "tailwind"] as const).map((f) => (
                    <button
                      key={f}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        exportFormat === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                      }`}
                      type="button"
                      onClick={() => setExportFormat(f)}
                    >
                      {f === "css" ? "CSS Variables" : "Tailwind Config"}
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
              <pre className="bg-gray-900 text-gray-100 rounded-2xl p-4 text-[11px] font-mono overflow-x-auto whitespace-pre">
                {exportText}
              </pre>
            </div>
          </div>
        )}

        {/* Tutorial */}
        <section className="mt-4 pt-14 border-t border-gray-200 max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
              Color System Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-2">
              How This Ramp Is Actually Built
            </h2>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              This isn&apos;t a gradient from white to black tinted with your
              hue - that produces muddy, unusable steps in the middle. It
              follows the same shape production design systems use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">
                1. A Fixed Lightness Curve
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Each of the 11 stops (50 through 950) targets a specific HSL
                lightness percentage - 97% at 50, down to 13% at 950 -
                independent of your input color, so every palette this tool
                generates has the same tonal spacing.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">
                2. A Saturation Taper
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Your base color&apos;s saturation is preserved through the
                midtones (400-600) and multiplied down toward the extremes
                (as low as 35% of the original at step 50), which is what
                keeps step 50 from looking like plain off-white and step 950
                from looking like plain black.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">
                3. Constant Hue
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Hue never shifts between steps. Some production systems
                apply small per-step hue rotations as an artistic "warmth
                correction" - there's no single correct formula for that, so
                this tool keeps hue exact and predictable instead of faking
                a technique it can&apos;t rigorously justify.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-10">
            <h3 className="text-lg font-bold text-gray-900 font-jakarta mb-4">
              Why Every Swatch Shows a Recommended Text Color
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Each shade's number label is rendered in whichever of pure
              white or pure black scores a higher real WCAG 2.1 contrast
              ratio against that exact shade - computed the same way our{" "}
              <a className="text-[#FF5B04] font-semibold" href="/tools/design/contrast-checker">
                WCAG &amp; APCA Contrast Checker
              </a>{" "}
              does. That crossover point (usually somewhere around step
              400-500 for a mid-saturation color) is the same point you
              should flip text color on in your own UI when using that shade
              as a background.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 font-jakarta mb-6">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {[
                {
                  q: "Why does my neutral ramp still look slightly tinted?",
                  a: "By design - it caps saturation at 8% of your base hue rather than going to 0%, which is how most modern design systems (Tailwind's slate/zinc, Radix's grays) build a neutral scale that still feels cohesive with the brand color instead of a flat gray.",
                },
                {
                  q: "Is step 500 exactly my input color?",
                  a: "Step 500 uses your input color's hue and saturation, but its lightness is set by the fixed curve (56%) rather than your input's raw lightness - this keeps every generated palette's midtone at a consistent, accessible lightness regardless of how light or dark the color you typed in was.",
                },
                {
                  q: "Are the contrast ratios shown here real WCAG numbers?",
                  a: "Yes - the exact same relative-luminance formula from WCAG 2.1 Success Criterion 1.4.3, computed live for every shade against both pure white and pure black.",
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

        <SuggestedTools category="design-system" currentToolId="color-palette-generator" />
      </div>
    </div>
  );
}
