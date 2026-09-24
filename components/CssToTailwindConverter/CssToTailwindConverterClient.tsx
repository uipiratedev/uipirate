"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import SuggestedTools from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";
import { convertCss, ResolutionTier } from "@/lib/cssToTailwind";

const EXAMPLES: Record<string, string> = {
  Button: `.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: #FF5B04;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition-property: background-color;
  transition-duration: 200ms;
}

.btn:hover {
  background-color: #E54F00;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}`,
  "Responsive Card": `.card {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px;
  margin-bottom: 24px;
  background-color: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

@media (min-width: 768px) {
  .card {
    flex-direction: row;
    width: 50%;
    padding: 24px;
  }
}`,
};

const TIER_LABEL: Record<ResolutionTier, string> = {
  scale: "Scale Match",
  "arbitrary-value": "Arbitrary Value",
  "arbitrary-property": "Arbitrary Property",
};

const TIER_CLASS: Record<ResolutionTier, string> = {
  scale: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "arbitrary-value": "bg-amber-50 text-amber-700 border-amber-200",
  "arbitrary-property": "bg-violet-50 text-violet-700 border-violet-200",
};

function formatExport(result: ReturnType<typeof convertCss>): string {
  return result.rules
    .filter((r) => r.classNames)
    .map((r) => `/* ${r.mediaPrefix ?? ""}${r.selector} */\n${r.classNames}`)
    .join("\n\n");
}

export default function CssToTailwindConverterClient() {
  const [cssInput, setCssInput] = useState(EXAMPLES.Button);
  const [preferScale, setPreferScale] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const result = useMemo(
    () => convertCss(cssInput, { preferScale }),
    [cssInput, preferScale],
  );

  const isEmpty = cssInput.trim().length === 0;
  const exportText = useMemo(() => formatExport(result), [result]);

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
            <GlassBadge variant="gradient">
              DESIGN SYSTEMS &amp; CODE
            </GlassBadge>
          </div>

          <h1 className="text-[38px] sm:text-[50px] md:text-[62px] lg:text-[72px] text-center font-[800] tracking-[-1.5px] leading-[1.08] text-gray-900 mb-5">
            CSS to <span className="text-[#FF5B04]">Tailwind</span> Utility
            Converter
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto text-center font-normal leading-relaxed">
            Paste raw CSS — including shorthand, pseudo-classes, and media
            queries — and get idiomatic Tailwind utility classes back,
            instantly and entirely in your browser.
          </p>

          {/* Integrated Capability Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              "Shorthand Expansion (padding, border-radius, border)",
              "Pseudo-Class Variants (hover, focus, disabled)",
              "Media Query Breakpoints",
              "Arbitrary Value & Property Fallback",
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
                Frontend Migration
              </span>
              <span className="text-gray-600 font-medium">
                Migrating a whole codebase from CSS to Tailwind?
              </span>
              <span className="text-gray-900 font-bold group-hover:text-[#FF5B04] inline-flex items-center gap-0.5 transition-colors">
                <span>Talk to engineering team</span>
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

        {/* Builder Grid: Input + Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
          {/* CSS Input */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 lg:sticky lg:top-28">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 font-jakarta uppercase tracking-wider">
                Paste CSS
              </h3>
              <button
                className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 transition-colors"
                onClick={() => setCssInput("")}
              >
                Clear
              </button>
            </div>

            <textarea
              className="w-full h-72 px-4 py-3 rounded-2xl border border-gray-200 text-xs font-mono text-gray-800 outline-none focus:border-[#FF5B04] resize-none leading-relaxed"
              placeholder=".btn { display: flex; padding: 16px; }"
              spellCheck={false}
              value={cssInput}
              onChange={(e) => setCssInput(e.target.value)}
            />

            <div>
              <span className="block text-[11px] font-semibold text-gray-500 mb-2">
                Load an example
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.keys(EXAMPLES).map((name) => (
                  <button
                    key={name}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                    onClick={() => setCssInput(EXAMPLES[name])}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-gray-700">
                  Prefer Tailwind's Default Scale
                </span>
                <input
                  checked={preferScale}
                  className="w-4 h-4 accent-[#FF5B04] cursor-pointer"
                  type="checkbox"
                  onChange={(e) => setPreferScale(e.target.checked)}
                />
              </label>
              <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                On: <code className="font-mono text-gray-700">16px</code>{" "}
                becomes <code className="font-mono text-gray-700">p-4</code>.
                Off: always outputs exact arbitrary values like{" "}
                <code className="font-mono text-gray-700">p-[16px]</code>.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Link
                className="block text-center px-4 py-3 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
                href="/contact"
              >
                Need a Full CSS → Tailwind Migration? →
              </Link>
            </div>
          </div>

          {/* Output */}
          <div className="lg:col-span-7 space-y-6">
            {/* Stats bar */}
            <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="text-xs font-bold text-gray-900 font-jakarta">
                {result.totals.declarations} declaration
                {result.totals.declarations === 1 ? "" : "s"} converted
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-gray-500">
                  {result.totals.scale} scale match
                  {result.totals.scale === 1 ? "" : "es"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-gray-500">
                  {result.totals.arbitraryValue} arbitrary value
                  {result.totals.arbitraryValue === 1 ? "" : "s"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                <span className="text-gray-500">
                  {result.totals.arbitraryProperty} arbitrary propert
                  {result.totals.arbitraryProperty === 1 ? "y" : "ies"}
                </span>
              </div>
            </div>

            {isEmpty ? (
              <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center">
                <p className="text-sm text-gray-400">
                  Paste some CSS on the left to see the Tailwind conversion.
                </p>
              </div>
            ) : (
              <>
                {result.rules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="text-xs font-mono font-bold text-gray-900">
                          {rule.mediaPrefix}
                          {rule.selector}
                        </code>
                        {rule.unrecognizedPseudos.length > 0 && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                            no variant for :{rule.unrecognizedPseudos[0]}
                          </span>
                        )}
                      </div>
                      {rule.classNames && (
                        <button
                          className="text-[11px] font-semibold text-[#FF5B04] hover:text-[#E54F00] transition-colors flex items-center gap-1"
                          onClick={() => copy(rule.classNames, `rule-${idx}`)}
                        >
                          {copied === `rule-${idx}` ? "Copied!" : "Copy classes"}
                        </button>
                      )}
                    </div>

                    {rule.mediaNote && (
                      <p className="text-[11px] text-gray-400 mb-3">
                        {rule.mediaNote}
                      </p>
                    )}

                    {rule.classNames ? (
                      <pre className="p-3 rounded-xl bg-gray-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed mb-4">
                        {rule.classNames}
                      </pre>
                    ) : (
                      <p className="text-xs text-gray-400 mb-4">
                        No declarations in this rule.
                      </p>
                    )}

                    {rule.declarations.length > 0 && (
                      <div className="space-y-1.5">
                        {rule.declarations.map((d, dIdx) => (
                          <div
                            key={dIdx}
                            className="flex items-center justify-between gap-3 text-[11px] py-1.5 border-t border-gray-50 first:border-0"
                          >
                            <code className="font-mono text-gray-500 truncate">
                              {d.property}: {d.value}
                            </code>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <code className="font-mono text-gray-800 font-semibold">
                                {d.classes.join(" ")}
                              </code>
                              <span
                                className={`px-1.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wide whitespace-nowrap ${TIER_CLASS[d.tier]}`}
                              >
                                {TIER_LABEL[d.tier]}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Copy all */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-mono">
                      Full Export
                    </h3>
                    <button
                      className="px-3.5 py-1.5 rounded-xl bg-[#FF5B04] hover:bg-[#E54F00] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-[#FF5B04]/15 cursor-pointer"
                      onClick={() => copy(exportText, "export-all")}
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
                      {copied === "export-all" ? "Copied to Clipboard!" : "Copy All"}
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-gray-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed max-h-[300px]">
                    {exportText || "/* nothing to export yet */"}
                  </pre>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Detailed Tutorial / Educational Guide */}
        <section className="mt-24 pt-14 border-t border-gray-200 max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
              Frontend Migration Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-2">
              How This Converter Works
            </h2>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Every CSS declaration you paste is resolved through three
              tiers, tried in order, so nothing is ever silently dropped —
              only shortened when a clean match exists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
                Tier 1 · Scale Match
              </span>
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">
                Named Utility Classes
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                If a value lines up with Tailwind's default design scale —{" "}
                <code className="font-mono text-gray-800">16px</code> padding,{" "}
                <code className="font-mono text-gray-800">8px</code> radius,{" "}
                <code className="font-mono text-gray-800">700</code> font
                weight — it becomes a short, semantic class like{" "}
                <code className="font-mono text-gray-800">p-4</code>,{" "}
                <code className="font-mono text-gray-800">rounded-lg</code>,{" "}
                <code className="font-mono text-gray-800">font-bold</code>.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 mb-3">
                Tier 2 · Arbitrary Value
              </span>
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">
                Custom Values, Known Utility
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                A value like <code className="font-mono text-gray-800">
                  13px
                </code>{" "}
                padding doesn't exist on Tailwind's scale, but{" "}
                <code className="font-mono text-gray-800">padding</code>{" "}
                itself is a known utility — so it converts to{" "}
                <code className="font-mono text-gray-800">p-[13px]</code>{" "}
                using Tailwind's official bracket syntax instead of rounding
                to the nearest step and silently changing your design.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 mb-3">
                Tier 3 · Arbitrary Property
              </span>
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">
                Anything Tailwind Doesn't Name
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Properties with no Tailwind utility at all —{" "}
                <code className="font-mono text-gray-800">mask-type</code>,
                vendor prefixes, exotic CSS — fall back to Tailwind's
                arbitrary <em>property</em> syntax:{" "}
                <code className="font-mono text-gray-800">
                  [mask-type:luminance]
                </code>
                . It's valid, real Tailwind — just less common knowledge.
              </p>
            </div>
          </div>

          {/* Supported features */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 font-jakarta mb-6">
              What This Converter Understands
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              {[
                {
                  title: "Shorthand expansion",
                  desc: "padding, margin, border-radius, and border shorthand are decomposed into their per-side/per-corner Tailwind classes — or collapsed to px-/py- when both axes match.",
                },
                {
                  title: "Border-radius corner order",
                  desc: "CSS border-radius reads top-left → top-right → bottom-right → bottom-left, not the top/right/bottom/left order padding and margin use. This converter applies the correct order automatically.",
                },
                {
                  title: "Pseudo-class variants",
                  desc: ":hover, :focus, :active, :disabled, :first-child, ::before, ::after and more map to Tailwind's hover:, focus:, disabled: variant prefixes.",
                },
                {
                  title: "Media query breakpoints",
                  desc: "@media (min-width: 768px) maps to Tailwind's sm:/md:/lg:/xl:/2xl: prefixes using the same default breakpoint scale.",
                },
                {
                  title: "Percentages as fractions",
                  desc: "width: 50% becomes w-1/2, width: 33.333% becomes w-1/3 — matching Tailwind's built-in fraction scale instead of falling back to arbitrary values.",
                },
                {
                  title: "!important and negative values",
                  desc: "color: red !important becomes !text-[red]; margin-top: -8px becomes -mt-2, following Tailwind's own negative-value convention.",
                },
              ].map((f, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04] mt-1.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 mb-1">
                      {f.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Limitations */}
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-10">
            <h3 className="text-lg font-bold text-gray-900 font-jakarta mb-4">
              Known Limitations
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              This runs entirely in your browser with a lightweight parser,
              not a full CSS AST — it's built for component-level CSS
              (buttons, cards, nav bars), not entire stylesheets. A few
              things it intentionally doesn't attempt:
            </p>
            <ul className="space-y-2 text-xs text-gray-500 leading-relaxed list-disc pl-4">
              <li>
                Native CSS nesting (<code className="font-mono text-gray-700">&amp;</code>{" "}
                selectors) — flatten your rules first.
              </li>
              <li>
                Gradients, background images, and multi-function{" "}
                <code className="font-mono text-gray-700">transform</code>{" "}
                values are preserved exactly via arbitrary property/value
                syntax rather than decomposed into multiple utilities.
              </li>
              <li>
                Colors always convert to arbitrary values (
                <code className="font-mono text-gray-700">
                  bg-[#ff5b04]
                </code>
                ) rather than guessing the nearest built-in Tailwind shade —
                guessing can silently shift your brand color.
              </li>
              <li>
                Complex selectors like{" "}
                <code className="font-mono text-gray-700">
                  :nth-child(2n+1)
                </code>{" "}
                aren't mapped to a variant; they're flagged so you can add it
                manually.
              </li>
            </ul>
          </div>

          {/* Step by step */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 font-jakarta mb-6">
              Step-by-Step: How to Use This Converter
            </h3>
            <div className="space-y-5">
              {[
                {
                  title: "Paste your CSS",
                  desc: "Paste one or more rules, including pseudo-classes and @media blocks — or just a bare declaration list with no selector at all.",
                },
                {
                  title: "Choose your scale preference",
                  desc: "Leave 'Prefer Tailwind's Default Scale' on for the shortest, most idiomatic output. Turn it off when you need pixel-perfect fidelity to the original design.",
                },
                {
                  title: "Read the per-rule breakdown",
                  desc: "Each original selector gets its own card showing the exact Tailwind classes, plus a property-by-property table so you can sanity-check every conversion.",
                },
                {
                  title: "Copy classes into your component",
                  desc: "Use the per-rule 'Copy classes' button for a single element, or 'Copy All' to grab every converted rule at once, commented by original selector.",
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
                  q: "What is Tailwind's arbitrary value syntax?",
                  a: "Square-bracket syntax like p-[13px] or bg-[#ff5b04] lets you use a one-off CSS value with a Tailwind utility, without adding it to your config. It's an official, fully-supported part of Tailwind CSS v3 and v4.",
                },
                {
                  q: "What's the difference between arbitrary values and arbitrary properties?",
                  a: "Arbitrary values (p-[13px]) customize the value for a utility Tailwind already knows about. Arbitrary properties ([mask-type:luminance]) let you use a raw CSS property Tailwind has no utility for at all — both compile to real, valid CSS.",
                },
                {
                  q: "Why do colors always come out as bg-[#hex] instead of bg-orange-500?",
                  a: "Matching a hex value to the 'nearest' built-in Tailwind color is a guess, and a wrong guess silently changes your brand color. Arbitrary values preserve your exact color every time — swap in a design token yourself if you have one.",
                },
                {
                  q: "Can I paste an entire stylesheet?",
                  a: "You can, but this tool is tuned for component-level CSS — a button, a card, a nav bar. Very large stylesheets with deep nesting or hundreds of rules will still parse, but the output is easier to review in smaller chunks.",
                },
                {
                  q: "Does this handle Sass or LESS syntax?",
                  a: "No — paste compiled, plain CSS. Nesting (&), variables ($var), and mixins aren't understood by the parser.",
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
          currentToolId="css-to-tailwind-converter"
        />
      </div>
    </div>
  );
}
