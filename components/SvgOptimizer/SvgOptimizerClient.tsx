"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import SuggestedTools from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";
import type { OptimizeResult } from "@/lib/svgOptimizer";

const SAMPLE_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 24 24">
<!-- Generator: Adobe Illustrator, SVG Export Plug-In -->
<metadata><sfw xmlns="&ns_sfw;"><slices></slices></sfw></metadata>
<g>
  <g>
    <path d="M12.001,2.001 C6.478,2.001 2.001,6.478 2.001,12.001 C2.001,17.524 6.478,22.001 12.001,22.001 C17.524,22.001 22.001,17.524 22.001,12.001" fill="none" stroke="#FF5B04" stroke-width="1.800000" stroke-linecap="round"/>
  </g>
</g>
</svg>`;

function formatBytes(n: number): string {
  return n < 1024 ? `${n} B` : `${(n / 1024).toFixed(2)} KB`;
}

export default function SvgOptimizerClient() {
  const [input, setInput] = useState(SAMPLE_SVG);
  const [precision, setPrecision] = useState(2);
  const [removeComments, setRemoveComments] = useState(true);
  const [removeEditorData, setRemoveEditorData] = useState(true);
  const [removeDimensions, setRemoveDimensions] = useState(false);
  const [componentName, setComponentName] = useState("Icon");
  const [typescript, setTypescript] = useState(true);
  const [activeTab, setActiveTab] = useState<"svg" | "jsx">("svg");
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [jsx, setJsx] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parsing runs server-side (an API route), so debounce keystrokes instead
  // of recomputing on every character.
  useEffect(() => {
    if (!input.trim()) {
      setResult(null);
      setJsx("");
      setError(null);

      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch("/api/svg-optimize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            svg: input,
            options: { precision, removeComments, removeEditorData, removeDimensions },
            jsx: { componentName, typescript },
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Couldn't optimize this SVG.");
          setResult(null);
          setJsx("");
        } else {
          setError(null);
          setResult(data.optimized);
          setJsx(data.jsx);
        }
      } catch {
        setError("Network error - please try again.");
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [input, precision, removeComments, removeEditorData, removeDimensions, componentName, typescript]);

  const activeCode = activeTab === "svg" ? (result?.output ?? "") : jsx;

  const copy = async () => {
    await navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => setInput(String(reader.result ?? ""));
    reader.readAsText(file);
  };

  // An <svg> with only a viewBox (no width/height attributes) has no
  // intrinsic size, so a bare `max-width/max-height` rule gives it nothing
  // to clamp - it collapses to 0x0 inside a flex container. An explicit
  // width/height percentage gives it a real box to scale within instead.
  const previewDoc = `<!doctype html><html><head><meta charset="utf-8" /><style>html,body{margin:0;height:100%;display:flex;align-items:center;justify-content:center;background:transparent;}svg{width:90%;height:90%;}</style></head><body>${result?.output ?? ""}</body></html>`;

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
            Fast SVG Optimizer{" "}
            <span className="text-[#FF5B04]">&amp; React Exporter</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto text-center font-normal leading-relaxed">
            Paste raw SVG markup exported from Figma or Illustrator. It's
            stripped of editor bloat and comments, rounded to a sane
            coordinate precision, and exported as a clean React component —
            processed on the fly and never stored anywhere.
          </p>
        </motion.div>

        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Input */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 font-jakarta">Paste SVG markup</h3>
              <div className="flex items-center gap-2">
                <button
                  className="text-[11px] font-bold text-gray-500 hover:text-[#FF5B04] transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  Upload .svg
                </button>
                <input
                  ref={fileInputRef}
                  accept=".svg,image/svg+xml"
                  className="hidden"
                  type="file"
                  onChange={onFileChange}
                />
              </div>
            </div>
            <textarea
              className="w-full h-64 px-3 py-2.5 text-xs font-mono rounded-xl border border-gray-200 outline-none resize-none"
              spellCheck={false}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input checked={removeComments} type="checkbox" onChange={(e) => setRemoveComments(e.target.checked)} />
                Remove comments
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input checked={removeEditorData} type="checkbox" onChange={(e) => setRemoveEditorData(e.target.checked)} />
                Remove editor metadata
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input checked={removeDimensions} type="checkbox" onChange={(e) => setRemoveDimensions(e.target.checked)} />
                Strip width/height (viewBox only)
              </label>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600 whitespace-nowrap">Precision: {precision}</label>
                <input
                  className="flex-1 accent-[#FF5B04]"
                  max={4}
                  min={0}
                  type="range"
                  value={precision}
                  onChange={(e) => setPrecision(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-3xl p-4 shadow-sm flex items-center justify-center h-40">
              <iframe
                className="w-full h-full border-0"
                sandbox=""
                srcDoc={previewDoc}
                title="SVG preview"
              />
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-gray-200 rounded-2xl p-3 text-center">
                <p className="text-[10px] text-gray-400 mb-1">Original</p>
                <p className="text-sm font-bold text-gray-900 font-mono">
                  {result ? formatBytes(result.stats.originalBytes) : "—"}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-3 text-center">
                <p className="text-[10px] text-gray-400 mb-1">Optimized</p>
                <p className="text-sm font-bold text-gray-900 font-mono">
                  {loading ? "…" : result ? formatBytes(result.stats.optimizedBytes) : "—"}
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
                <p className="text-[10px] text-emerald-600 mb-1">Saved</p>
                <p className="text-sm font-bold text-emerald-700 font-mono">
                  {result ? `${result.stats.savingsPercent.toFixed(1)}%` : "—"}
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                  {(["svg", "jsx"] as const).map((t) => (
                    <button
                      key={t}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        activeTab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                      }`}
                      onClick={() => setActiveTab(t)}
                      type="button"
                    >
                      {t === "svg" ? "Optimized SVG" : "React / JSX"}
                    </button>
                  ))}
                </div>
                <button
                  className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all"
                  onClick={copy}
                  type="button"
                >
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>

              {activeTab === "jsx" && (
                <div className="flex items-center gap-3 mb-3">
                  <input
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 outline-none font-mono"
                    placeholder="ComponentName"
                    type="text"
                    value={componentName}
                    onChange={(e) => setComponentName(e.target.value)}
                  />
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 whitespace-nowrap">
                    <input checked={typescript} type="checkbox" onChange={(e) => setTypescript(e.target.checked)} />
                    TypeScript
                  </label>
                </div>
              )}

              <pre className="bg-gray-900 text-gray-100 rounded-2xl p-4 text-[11px] font-mono overflow-x-auto whitespace-pre max-h-72 overflow-y-auto">
                {activeCode || "// Paste valid SVG markup to see output"}
              </pre>
            </div>
          </div>
        </div>

        {/* Tutorial */}
        <section className="mt-4 pt-14 border-t border-gray-200 max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
              SVG Cleanup Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-2">
              What's Actually Being Removed
            </h2>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Every step below is a real, deterministic transform - nothing
              is faked or approximated, and your original drawing geometry
              (every path, fill, and stroke) is preserved exactly except for
              coordinate rounding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Editor Metadata & Namespaces",
                desc: "Illustrator, Inkscape, and Sketch all embed editor-only elements and attributes (<metadata>, sodipodi:*, inkscape:*, rdf:*) that browsers ignore but that still take up bytes - these are removed entirely, along with the XML declaration prologue.",
              },
              {
                title: "Comments & Whitespace",
                desc: "XML comments and pretty-printed indentation between tags are stripped, while whitespace inside <text>/<tspan> elements is deliberately preserved so visible text content never changes.",
              },
              {
                title: "Coordinate Precision",
                desc: "Design tools frequently export 6+ decimal places on every path coordinate (\"12.001000\") when 1-2 decimals render identically on screen - this tool rounds every numeric value inside geometry-bearing attributes to your chosen precision.",
              },
              {
                title: "Redundant Group Wrappers",
                desc: "Illustrator commonly nests a shape inside 2-3 layers of attribute-less <g> wrappers left over from its own layer panel. Any <g> with no attributes and no content is removed; any <g> with no attributes and exactly one child is replaced by that child directly.",
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
              How the React Export Works
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              The JSX exporter always runs on the already-optimized markup,
              then applies three mechanical renames so the result is valid
              JSX: every kebab-case attribute (<code className="font-mono text-gray-700">stroke-width</code>) becomes
              camelCase (<code className="font-mono text-gray-700">strokeWidth</code>), <code className="font-mono text-gray-700">class</code> becomes{" "}
              <code className="font-mono text-gray-700">className</code>, and any inline{" "}
              <code className="font-mono text-gray-700">style="prop:value"</code> string becomes a{" "}
              <code className="font-mono text-gray-700">style=&#123;&#123; prop: "value" &#125;&#125;</code> object. The root{" "}
              <code className="font-mono text-gray-700">&lt;svg&gt;</code> element always spreads{" "}
              <code className="font-mono text-gray-700">&#123;...props&#125;</code>, so the component accepts every
              standard SVG prop (className, onClick, width, etc.) without
              extra wiring.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              The live preview above renders inside a fully sandboxed{" "}
              <code className="font-mono text-gray-700">&lt;iframe sandbox=""&gt;</code> with scripts disabled, so even
              a pasted SVG containing an embedded{" "}
              <code className="font-mono text-gray-700">&lt;script&gt;</code> tag or an{" "}
              <code className="font-mono text-gray-700">onload</code> handler can&apos;t execute against this page.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 font-jakarta mb-6">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {[
                {
                  q: "Is my SVG uploaded anywhere?",
                  a: "The markup you paste is sent to our server to be parsed and optimized (the same request/response model as every other tool on this site) and the preview render happens back in your browser - nothing is written to a database or kept after the response is sent.",
                },
                {
                  q: "Will lowering the precision distort my icon?",
                  a: "At precision 1-2 (the default), the difference is invisible at any icon size (16-48px) - a coordinate error under 0.01px is far smaller than a single screen pixel. Very large, detailed illustrations may want precision 3.",
                },
                {
                  q: "Why did some of my <g> groups disappear?",
                  a: "Only attribute-less groups are touched: a fully empty one is deleted, and one wrapping exactly one child is replaced by that child. A <g> with a transform, opacity, class, or any other attribute is always preserved untouched.",
                },
                {
                  q: "Can I use the JSX output directly as a file?",
                  a: "Yes - copy it into a ComponentName.tsx (or .jsx with TypeScript off) file. It has no dependencies beyond React itself.",
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

        <SuggestedTools category="design-system" currentToolId="svg-optimizer" />
      </div>
    </div>
  );
}
