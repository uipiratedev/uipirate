"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import SuggestedTools from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";
import { compareContrast, parseColor, rgbToHex, type RGB } from "@/lib/colorContrast";

function useColorInput(initial: string) {
  const [text, setText] = useState(initial);
  const parsed = parseColor(text);

  return { text, setText, parsed };
}

function Swatch({ rgb }: { rgb: RGB }) {
  return (
    <div
      className="w-8 h-8 rounded-lg border border-gray-200 flex-shrink-0"
      style={{ backgroundColor: rgbToHex(rgb) }}
    />
  );
}

function PassBadge({ pass }: { pass: boolean }) {
  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
        pass
          ? "text-emerald-600 bg-emerald-50 border-emerald-200"
          : "text-red-500 bg-red-50 border-red-200"
      }`}
    >
      {pass ? "PASS" : "FAIL"}
    </span>
  );
}

export default function ContrastCheckerClient() {
  const fg = useColorInput("#1F2937");
  const bg = useColorInput("#FFFFFF");
  const [previewSize, setPreviewSize] = useState<"normal" | "large">("normal");

  const result = useMemo(() => {
    if (!fg.parsed || !bg.parsed) return null;

    return compareContrast(fg.parsed, bg.parsed);
  }, [fg.parsed, bg.parsed]);

  const swap = () => {
    const fgText = fg.text;

    fg.setText(bg.text);
    bg.setText(fgText);
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
            WCAG &amp; APCA{" "}
            <span className="text-[#FF5B04]">Color Contrast Checker</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto text-center font-normal leading-relaxed">
            Check any text/background color pair against both WCAG 2.1
            (AA/AAA) and the newer, perceptually-calibrated APCA algorithm —
            computed live, in your browser, from the exact published formulas.
          </p>
        </motion.div>

        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Inputs */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 font-jakarta">Colors</h3>
              <button
                className="text-[11px] font-bold text-gray-500 hover:text-[#FF5B04] transition-colors flex items-center gap-1"
                type="button"
                onClick={swap}
              >
                ⇅ Swap
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                Text (foreground)
              </label>
              <div className="flex items-center gap-2">
                <input
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer flex-shrink-0"
                  type="color"
                  value={fg.parsed ? rgbToHex(fg.parsed) : "#000000"}
                  onChange={(e) => fg.setText(e.target.value)}
                />
                <input
                  className={`flex-1 px-3 py-2.5 text-sm rounded-xl border outline-none font-mono ${
                    fg.parsed ? "border-gray-200 text-gray-800" : "border-red-300 text-red-600"
                  }`}
                  placeholder="#1F2937 or rgb(31,41,55)"
                  type="text"
                  value={fg.text}
                  onChange={(e) => fg.setText(e.target.value)}
                />
              </div>
              {!fg.parsed && (
                <p className="text-[11px] text-red-500 mt-1">
                  Couldn&apos;t parse this color - try hex, rgb(), or hsl().
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                Background
              </label>
              <div className="flex items-center gap-2">
                <input
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer flex-shrink-0"
                  type="color"
                  value={bg.parsed ? rgbToHex(bg.parsed) : "#ffffff"}
                  onChange={(e) => bg.setText(e.target.value)}
                />
                <input
                  className={`flex-1 px-3 py-2.5 text-sm rounded-xl border outline-none font-mono ${
                    bg.parsed ? "border-gray-200 text-gray-800" : "border-red-300 text-red-600"
                  }`}
                  placeholder="#FFFFFF or hsl(0,0%,100%)"
                  type="text"
                  value={bg.text}
                  onChange={(e) => bg.setText(e.target.value)}
                />
              </div>
              {!bg.parsed && (
                <p className="text-[11px] text-red-500 mt-1">
                  Couldn&apos;t parse this color - try hex, rgb(), or hsl().
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {(["normal", "large"] as const).map((size) => (
                <button
                  key={size}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    previewSize === size
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                  type="button"
                  onClick={() => setPreviewSize(size)}
                >
                  {size === "normal" ? "16px preview" : "24px preview"}
                </button>
              ))}
            </div>

            {result && (
              <div
                className="rounded-2xl border border-gray-200 p-6 flex items-center justify-center"
                style={{ backgroundColor: rgbToHex(result.background) }}
              >
                <span
                  className={previewSize === "normal" ? "text-base" : "text-2xl font-semibold"}
                  style={{ color: rgbToHex(result.foreground) }}
                >
                  The quick brown fox jumps.
                </span>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="space-y-6">
            {result ? (
              <>
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Swatch rgb={result.foreground} />
                    <span className="text-xs text-gray-400">on</span>
                    <Swatch rgb={result.background} />
                    <h3 className="text-sm font-bold text-gray-900 font-jakarta ml-1">
                      WCAG 2.1 Contrast Ratio
                    </h3>
                  </div>
                  <div className="text-4xl font-bold font-jakarta text-gray-900 mb-4">
                    {result.wcag.ratio.toFixed(2)}
                    <span className="text-base text-gray-400 font-normal">:1</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50">
                      <span className="text-xs text-gray-600">AA · Normal text</span>
                      <PassBadge pass={result.wcag.aaNormal} />
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50">
                      <span className="text-xs text-gray-600">AAA · Normal text</span>
                      <PassBadge pass={result.wcag.aaaNormal} />
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50">
                      <span className="text-xs text-gray-600">AA · Large text</span>
                      <PassBadge pass={result.wcag.aaLarge} />
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50">
                      <span className="text-xs text-gray-600">AAA · Large text</span>
                      <PassBadge pass={result.wcag.aaaLarge} />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 font-jakarta mb-4">
                    APCA Contrast (Lc)
                  </h3>
                  <div className="text-4xl font-bold font-jakarta text-gray-900 mb-1">
                    {result.apca.lc > 0 ? "+" : ""}
                    {result.apca.lc.toFixed(1)}
                    <span className="text-base text-gray-400 font-normal ml-1">Lc</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    {result.apca.polarity === "text-on-light"
                      ? "Dark text on a light background (positive Lc)."
                      : result.apca.polarity === "text-on-dark"
                        ? "Light text on a dark background (negative Lc)."
                        : "Colors are too close to register a contrast."}
                  </p>
                  <div className="p-3 rounded-xl bg-gray-900 text-white text-xs leading-relaxed">
                    <span className="font-bold text-[#FF5B04]">Recommended use: </span>
                    {result.apca.recommendedUse}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-sm text-center text-sm text-gray-400">
                Enter two valid colors to see the contrast results.
              </div>
            )}
          </div>
        </div>

        {/* Tutorial */}
        <section className="mt-4 pt-14 border-t border-gray-200 max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
              Contrast &amp; Accessibility Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-2">
              WCAG vs. APCA - Why There Are Two Numbers
            </h2>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Both algorithms answer the same question - "can most people
              actually read this?" - but they answer it differently, and they
              can disagree on the same color pair.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">
                WCAG 2.1 Contrast Ratio
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Defined in Success Criterion 1.4.3. It computes each color&apos;s
                relative luminance (a 0-1 value based on how a human eye
                perceives sRGB brightness) and takes the ratio between the
                lighter and darker one, giving a number from 1:1 (identical)
                to 21:1 (pure black on pure white).
              </p>
              <ul className="text-xs text-gray-500 leading-relaxed space-y-1 list-disc pl-4">
                <li>AA normal text: 4.5:1 minimum</li>
                <li>AA large text (≥24px, or ≥19px bold): 3:1 minimum</li>
                <li>AAA normal text: 7:1 minimum</li>
                <li>AAA large text: 4.5:1 minimum</li>
                <li>UI components / graphical objects (SC 1.4.11): 3:1 minimum</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">
                APCA (Lc)
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                The algorithm being developed for WCAG 3. Instead of a single
                ratio, it produces a signed "Lc" (Lightness Contrast) value
                from roughly -108 to +106, using separate exponents for text
                and background luminance and for each polarity (dark-on-light
                vs. light-on-dark) - which is why swapping foreground and
                background isn&apos;t just a sign flip.
              </p>
              <ul className="text-xs text-gray-500 leading-relaxed space-y-1 list-disc pl-4">
                <li>Lc 90+: body text at any reasonable size</li>
                <li>Lc 75+: fluent 16px+ body text</li>
                <li>Lc 60+: larger (24px+) or bold text</li>
                <li>Lc 45+: large text (36px+) or UI components only</li>
                <li>Lc 30+: spot/decorative text only</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-10">
            <h3 className="text-lg font-bold text-gray-900 font-jakarta mb-4">
              Why WCAG 2.1&apos;s Formula Is Known to Be Imperfect
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              The WCAG 2.1 ratio was calibrated primarily on desktop CRT
              displays and treats light-on-dark and dark-on-light symmetrically,
              even though the human eye doesn&apos;t perceive them the same way.
              Two well-documented consequences:
            </p>
            <ul className="space-y-2 text-xs text-gray-500 leading-relaxed list-disc pl-4">
              <li>
                Mid-gray text on white can mathematically pass 4.5:1 while
                looking noticeably washed out and harder to read than a
                slightly-lower-ratio combination in a different hue.
              </li>
              <li>
                Very dark text on a very dark (but not black) background can
                fail the same 4.5:1 threshold despite being comfortably
                readable in practice.
              </li>
            </ul>
            <p className="text-xs text-gray-500 leading-relaxed mt-4">
              APCA was built to correct exactly this. It is not yet an
              official, legally-referenced WCAG success criterion - WCAG
              2.1&apos;s 4.5:1/3:1 thresholds remain the current legal/compliance
              standard (ADA, Section 508, EN 301 549) - but it is the
              direction contrast guidance is heading, which is why this tool
              reports both.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 font-jakarta mb-6">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {[
                {
                  q: "Which number should I actually use to ship a design?",
                  a: "For legal/compliance purposes, WCAG 2.1 AA (4.5:1 normal text, 3:1 large text) is what auditors and lawsuits currently reference. Use APCA's Lc as an additional perceptual sanity check, especially for grays and dark mode.",
                },
                {
                  q: "Why did swapping my two colors change the APCA number so much?",
                  a: "APCA models text-on-light and light-on-text perception differently on purpose (different exponents for each polarity), unlike WCAG's single symmetric ratio. Always pass the actual text color as the foreground argument.",
                },
                {
                  q: "Is this contrast checker running the real published algorithms?",
                  a: "Yes. The WCAG relative luminance formula is the exact SC 1.4.3 sRGB-to-linear formula, and the APCA implementation reproduces the reference SAPC/APCA-W3 constants and formula structure (validated here against the algorithm's own published reference values: ~106 Lc for black-on-white, ~-107.9 Lc for white-on-black).",
                },
                {
                  q: "What counts as 'large text' for the lower 3:1 WCAG threshold?",
                  a: "18pt (24px) or larger at regular weight, or 14pt (~18.66px, commonly rounded to 19px) or larger at bold weight.",
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

        <SuggestedTools category="design-system" currentToolId="contrast-checker" />
      </div>
    </div>
  );
}
