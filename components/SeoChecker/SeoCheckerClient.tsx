"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import SuggestedTools from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";
import type { SeoAuditResult } from "@/lib/seoMetadata";

interface AuditResponse {
  url: string;
  analyzedAt: string;
  audit: SeoAuditResult;
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

export default function SeoCheckerClient() {
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
      const res = await fetch(`/api/seo-check?url=${encodeURIComponent(targetUrl)}`);
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
            Homepage SEO{" "}
            <span className="text-[#FF5B04]">&amp; Metadata Checker</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto text-center font-normal leading-relaxed">
            Paste any public page. We fetch the real server-rendered HTML
            and run deterministic checks on the exact tags search engines
            and social platforms actually read, title, meta description,
            canonical, heading hierarchy, Open Graph, and structured data.
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
                {loading ? "Checking…" : "Check SEO"}
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
                response. It may be a client-rendered single-page app, the
                same limitation applies to search crawlers reading the raw
                response, so this is itself worth fixing.
              </div>
            )}
            {result.audit.isNoindex && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 leading-relaxed">
                <span className="font-bold">This page is blocked from indexing</span> by
                a robots meta tag. If that&apos;s unintentional, this is likely the single
                highest-impact fix available.
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
                  Analyzed {new Date(result.analyzedAt).toLocaleString()} from the
                  page&apos;s raw server-rendered HTML.
                </p>
              </div>
              <Link
                className="px-5 py-3 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm whitespace-nowrap"
                href="/contact"
              >
                Book a Manual SEO Audit →
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
              SEO Fundamentals Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-2">
              How This Checker Works
            </h2>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              This fetches the exact HTML your server sends for a URL - the
              same thing a search engine crawler sees on first pass - and
              checks the specific tags that drive indexing and how your
              snippet renders. No live PageSpeed/Search Console data is
              used, so there's nothing to authenticate or connect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Core Metadata",
                desc: "Checks the <title> tag and meta description exist and fall in the length range that avoids truncation in search results (title ~10-60 chars, description ~70-160 chars), plus a canonical URL that actually points back at this exact page, and a responsive viewport tag.",
              },
              {
                title: "Indexability",
                desc: "Confirms the page isn't accidentally blocked by a noindex robots meta tag, has a declared document language for screen readers and search engines, and has a favicon so browsers don't fall back to a bare /favicon.ico request.",
              },
              {
                title: "Heading Structure",
                desc: "Confirms exactly one <h1> exists (not zero, not several), that subheadings exist to structure longer content, and that no heading jumps more than one level below the heading before it in the document.",
              },
              {
                title: "Social Preview & Structured Data",
                desc: "Checks for the Open Graph and Twitter Card tags that control how a link preview renders when shared, for JSON-LD structured data, and for descriptive alt text on images.",
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
              This is a static-HTML analyzer, not a browser or a search
              engine - it never executes JavaScript and it isn't connected
              to Google Search Console or PageSpeed Insights. That's an
              honest boundary, not a hidden one:
            </p>
            <ul className="space-y-2 text-xs text-gray-500 leading-relaxed list-disc pl-4">
              <li>
                Client-rendered pages that inject their &lt;title&gt; and meta tags via
                JavaScript will show as missing here, exactly as they would to a
                crawler that doesn&apos;t execute your JS.
              </li>
              <li>
                This checks whether the right tags exist with sane values - it
                doesn&apos;t simulate actual search rankings, click-through rates, or
                Core Web Vitals.
              </li>
              <li>
                Only <code className="font-mono text-gray-700">http://</code> and{" "}
                <code className="font-mono text-gray-700">https://</code> URLs that
                resolve to a public IP address are accepted - internal and private
                network addresses are blocked for security.
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
                  q: "Why does title/description length matter?",
                  a: "Google truncates search result titles and descriptions at roughly pixel widths that correspond to about 60 and 160 characters respectively - going over means your carefully written copy gets cut off with an ellipsis.",
                },
                {
                  q: "What's the difference between a missing canonical and a canonical pointing elsewhere?",
                  a: "A missing canonical means search engines have to guess which URL variant (with/without trailing slash, query params, etc.) is the 'real' one. A canonical pointing to a different page actively tells search engines to index that other page instead - almost always unintentional outside of pagination or syndicated content.",
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

        <SuggestedTools category="website-conversion" currentToolId="homepage-seo-checker" />
      </div>
    </div>
  );
}
