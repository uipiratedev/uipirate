"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import SuggestedTools from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";
import type { PerformanceAuditResult } from "@/lib/performanceSignals";

interface AuditResponse {
  url: string;
  analyzedAt: string;
  audit: PerformanceAuditResult;
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

export default function PerformanceCheckerClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResponse | null>(null);

  const runCheck = async (targetUrl: string) => {
    if (!targetUrl.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/performance-check?url=${encodeURIComponent(targetUrl)}`);
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
            Website Performance{" "}
            <span className="text-[#FF5B04]">&amp; UX Signals Score</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto text-center font-normal leading-relaxed">
            Paste any public page. We measure the real time-to-first-byte
            and payload size for that exact request, then run deterministic
            checks for render-blocking resources, layout-shift risk, and
            third-party weight, not a simulated Lighthouse score.
          </p>

          <div className="mt-8 max-w-2xl mx-auto">
            <form
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-full p-2 shadow-sm"
              onSubmit={(e) => {
                e.preventDefault();
                runCheck(url);
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
                {loading ? "Measuring…" : "Check Performance"}
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
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-800 leading-relaxed">
              <span className="font-bold">Not a Lighthouse score:</span> this
              measures real network timing/headers from a single server-side
              fetch plus static-HTML proxies for render-blocking and
              layout-shift risk, see &ldquo;Known Limitations&rdquo; below
              for exactly what that does and doesn&apos;t cover.
            </div>

            {result.audit.lowContent && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-relaxed">
                <span className="font-bold">Low-confidence result:</span> this
                page returned very little content in its initial HTML response.
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
                  Analyzed {new Date(result.analyzedAt).toLocaleString()}.
                </p>
              </div>
              <Link
                className="px-5 py-3 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm whitespace-nowrap"
                href="/contact"
              >
                Book a Performance Audit →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.audit.categories.map((cat) => (
                <div key={cat.key} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
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
              Performance Signals Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-2">
              What This Actually Measures
            </h2>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Real Core Web Vitals (LCP, INP, CLS) require rendering a page
              in an actual browser and simulating a real session - that's
              what Lighthouse and Chrome's CrUX dataset do, and it isn't
              something a public, rate-limited tool can run per request
              without becoming an abuse vector. Instead, this measures what
              a single real HTTP request can honestly tell you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Network & Delivery",
                desc: "The one category built from real measured numbers: the actual time-to-first-byte and payload size for this exact fetch, plus whether the response is compressed and carries a Cache-Control header - all read directly off the real HTTP response.",
              },
              {
                title: "Render-Blocking Resources",
                desc: "Counts <script> tags in <head> with no async/defer/type=\"module\" (each one pauses HTML parsing until it downloads and executes), render-blocking stylesheets, and whether preconnect/dns-prefetch hints exist for third-party origins the page depends on.",
              },
              {
                title: "Layout Stability Risk",
                desc: "Checks whether images and iframes declare width/height or aspect-ratio (letting the browser reserve their space before they load - the single most common cause of layout shift) and whether web fonts use font-display: swap so text doesn't stay invisible while a font downloads.",
              },
              {
                title: "Third-Party Weight",
                desc: "Counts third-party <script> tags and the distinct external origins they come from - each one is a DNS lookup, a connection, and a chunk of JavaScript the browser has to fetch and run before the page is fully interactive.",
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
              Known Limitations
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              This is an honest boundary, not a hidden one:
            </p>
            <ul className="space-y-2 text-xs text-gray-500 leading-relaxed list-disc pl-4">
              <li>
                This does not measure real LCP, INP, or CLS - those require
                rendering the page and timing actual paint/input events, which
                this tool deliberately doesn't do. Use{" "}
                <a className="text-[#FF5B04] font-semibold" href="https://pagespeed.web.dev" rel="noopener noreferrer" target="_blank">
                  PageSpeed Insights
                </a>{" "}
                for lab/field Core Web Vitals data.
              </li>
              <li>
                The measured TTFB reflects the network path from our server to
                yours for one request, not a real visitor's device, connection,
                or geography - it's a real number, just not necessarily
                representative of every visitor.
              </li>
              <li>
                Subresource load time (images, CSS, JS, fonts actually
                downloading) isn't measured - only the initial HTML response
                and what its markup implies about likely bottlenecks.
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 font-jakarta mb-6">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {[
                {
                  q: "Why isn't this the same score as Google PageSpeed Insights?",
                  a: "PageSpeed Insights renders your page in real Chrome and measures actual paint/input timing (lab data) plus real visitor data (CrUX field data). This tool measures one real network request plus deterministic static-HTML proxies for the same underlying problems - a different, narrower kind of signal, not a replacement.",
                },
                {
                  q: "Why does TTFB matter so much?",
                  a: "Everything else - parsing, rendering, script execution - can only start after the first byte arrives. A slow TTFB delays every other performance metric by the same amount, no matter how optimized the rest of the page is.",
                },
                {
                  q: "Is my URL stored anywhere?",
                  a: "No. The URL is fetched, analyzed in memory, and the result is returned to your browser - nothing is written to a database.",
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

        <SuggestedTools category="website-conversion" currentToolId="website-performance-score" />
      </div>
    </div>
  );
}
