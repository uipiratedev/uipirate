"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import SuggestedTools from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";
import type { CtaAuditResult } from "@/lib/ctaAnalyzer";

interface AuditResponse {
  url: string;
  analyzedAt: string;
  audit: CtaAuditResult;
}

function gradeColor(grade: string) {
  if (grade === "A") return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (grade === "B") return "text-lime-600 bg-lime-50 border-lime-200";
  if (grade === "C") return "text-amber-600 bg-amber-50 border-amber-200";
  if (grade === "D") return "text-orange-600 bg-orange-50 border-orange-200";

  return "text-red-600 bg-red-50 border-red-200";
}

function scoreBarColor(score: number) {
  if (score >= 75) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";

  return "bg-red-400";
}

export default function CtaAnalyzerClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResponse | null>(null);

  const runAudit = async (targetUrl: string) => {
    if (!targetUrl.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/cta-audit?url=${encodeURIComponent(targetUrl)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong analyzing this page.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error - please try again.");
    } finally {
      setLoading(false);
    }
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
            <GlassBadge variant="gradient">WEBSITE &amp; CONVERSION</GlassBadge>
          </div>

          <h1 className="text-[38px] sm:text-[50px] md:text-[62px] lg:text-[72px] text-center font-[800] tracking-[-1.5px] leading-[1.08] text-gray-900 mb-5">
            CTA &amp; Conversion{" "}
            <span className="text-[#FF5B04]">Button Analyzer</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto text-center font-normal leading-relaxed">
            Paste any public page. We fetch the real server-rendered HTML
            and evaluate every button and button-styled link on it —
            placement, action-verb copy, and real WCAG contrast wherever a
            color value can actually be resolved from the page itself.
          </p>

          <div className="mt-8 max-w-2xl mx-auto">
            <form
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-full p-2 shadow-sm"
              onSubmit={(e) => {
                e.preventDefault();
                runAudit(url);
              }}
            >
              <input
                className="flex-1 px-4 py-2.5 text-sm text-gray-800 outline-none bg-transparent"
                placeholder="yourproduct.com"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button
                className="px-6 py-2.5 rounded-full bg-gray-900 hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-all flex items-center gap-2"
                disabled={loading || !url.trim()}
                type="submit"
              >
                {loading && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" d="M4 12a8 8 0 018-8" fill="currentColor" />
                  </svg>
                )}
                {loading ? "Analyzing…" : "Analyze CTAs"}
              </button>
            </form>
          </div>
        </motion.div>

        {error && (
          <div className="max-w-2xl mx-auto mb-12 p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700 text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="w-full max-w-5xl mx-auto space-y-8 mb-20">
            {result.audit.lowContent && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-relaxed">
                <span className="font-bold">Low-confidence result:</span> this
                page returned very little content in its initial HTML
                response. It may be a client-rendered single-page app.
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
              <div
                className={`w-24 h-24 rounded-3xl border-2 flex flex-col items-center justify-center flex-shrink-0 ${gradeColor(result.audit.grade)}`}
              >
                <span className="text-3xl font-bold font-jakarta">{result.audit.overallScore}</span>
                <span className="text-[10px] font-mono">/100</span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${gradeColor(result.audit.grade)}`}>
                    Grade {result.audit.grade}
                  </span>
                  <span className="text-[11px] font-mono text-gray-400">
                    {new URL(result.url).hostname}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {result.audit.totalCandidates} CTA(s) found · {result.audit.measurableContrastCount} with
                  resolvable colors for a real contrast check.
                </p>
              </div>
              <Link
                className="px-5 py-3 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm whitespace-nowrap"
                href="/contact"
              >
                Book a Manual CRO Audit →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.audit.categories.map((cat) => (
                <div
                  key={cat.key}
                  className={`bg-white border border-gray-200 rounded-3xl p-6 shadow-sm ${cat.key === "contrast" ? "md:col-span-2" : ""}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-gray-900 font-jakarta">{cat.label}</h3>
                    <span className="text-xs font-mono font-bold text-gray-700">{cat.score}/100</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-100 mb-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${scoreBarColor(cat.score)}`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                  <div className="space-y-2.5">
                    {cat.checks.map((check) => (
                      <div key={check.key} className="flex items-start gap-2">
                        <span
                          className={`mt-0.5 w-3.5 h-3.5 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold ${
                            check.passed
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {check.passed ? "✓" : "✕"}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-gray-700">{check.label}</p>
                          <p className="text-[11px] text-gray-400 leading-relaxed break-words">{check.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tutorial */}
        <section className="mt-4 pt-14 border-t border-gray-200 max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
              CTA Psychology Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-2">
              How This Analyzer Works
            </h2>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              This fetches the exact HTML your server sends for a URL and
              runs deterministic checks against it - no AI guessing, no
              fake scoring. Where a check genuinely can't be answered from
              static HTML, it says so instead of faking a number.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "CTA Discoverability & Placement",
                desc: "Counts buttons, button-styled links, and submit inputs on the page, and checks whether at least one sits in the header/hero area or within the first ~15% of the page's elements - a proxy for above-the-fold placement without rendering the page.",
              },
              {
                title: "Action-Oriented Copy",
                desc: "Classifies each CTA's text against a list of specific action verbs (Start, Get, Try, Create...) versus purely generic filler (\"Submit\", \"Click here\"), and checks for first-person phrasing (\"Start My Free Trial\") shown in published tests to lift click-through.",
              },
              {
                title: "Explainable Contrast Check",
                desc: "Resolves each CTA's actual color and background from inline styles or an embedded <style> block when possible, and computes a real WCAG contrast ratio against the 3:1 UI-component minimum - buttons styled only through an external stylesheet are reported as not measurable, never guessed.",
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
              Why Contrast Can&apos;t Always Be Measured
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Most production sites style buttons through compiled CSS
              classes (Tailwind utilities, a bundled stylesheet) that live in
              a separate file this tool never fetches - the HTML response
              alone only contains class names like{" "}
              <code className="font-mono text-gray-700">bg-orange-500</code>, not the actual color those classes
              resolve to. Rather than guess (and risk being confidently
              wrong), this tool only scores contrast for buttons whose colors
              are literally present in the page - an inline{" "}
              <code className="font-mono text-gray-700">style</code> attribute or an embedded{" "}
              <code className="font-mono text-gray-700">&lt;style&gt;</code> block - and clearly reports how many
              buttons that covers.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 font-jakarta mb-6">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {[
                {
                  q: "Why didn't my button's contrast get scored?",
                  a: "Its color and background aren't literally present in the page's HTML - they're almost certainly defined in an external CSS file, which this tool doesn't fetch. Check contrast for that specific pair of colors directly with our WCAG & APCA Contrast Checker instead.",
                },
                {
                  q: "Is first-person CTA phrasing always better?",
                  a: "Not universally - it's a documented lever with real published test results, not a guaranteed win for every audience. Treat the check as a prompt to test it, not a mandate.",
                },
                {
                  q: "Why can't I check a localhost or internal URL?",
                  a: "Allowing arbitrary internal addresses would let anyone use this tool to probe private networks from our server (a class of vulnerability called SSRF). Only URLs that resolve to public IP addresses are accepted.",
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

        <SuggestedTools category="website-conversion" currentToolId="cta-analyzer" />
      </div>
    </div>
  );
}
