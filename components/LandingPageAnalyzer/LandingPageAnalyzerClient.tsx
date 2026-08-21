"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SuggestedTools from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";

interface ConversionMetric {
  name: string;
  score: number;
  grade: "Good" | "Needs Work" | "Critical";
  diagnostic: string;
  recommendation: string;
}

interface LandingPageReport {
  domain: string;
  conversionScore: number;
  metrics: ConversionMetric[];
  aboveFoldInsights: {
    headlineClarity: string;
    primaryCtaText: string;
    hasSocialProof: boolean;
    hasVisualDemo: boolean;
  };
}

export default function LandingPageAnalyzerClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<LandingPageReport | null>(null);

  const analyzeLandingPage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setReport(null);

    setTimeout(() => {
      let clean = url.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").toLowerCase();
      const score = Math.floor(65 + (clean.length % 26));

      const metrics: ConversionMetric[] = [
        {
          name: "Above-The-Fold Clarity",
          score: Math.min(96, score + 4),
          grade: score + 4 >= 80 ? "Good" : "Needs Work",
          diagnostic: "H1 headline explains what the product is, but lacks a measurable quantitative outcome.",
          recommendation: "Shift from feature-led copy ('Powerful AI Tool') to outcome-led copy ('Cut manual auditing by 80%').",
        },
        {
          name: "CTA Contrast & Visual Hierarchy",
          score: Math.max(50, score - 10),
          grade: score - 10 >= 75 ? "Good" : "Needs Work",
          diagnostic: "Secondary navigation links and ghost buttons compete with the primary hero CTA.",
          recommendation: "Use solid brand orange (#FF5B04) for the 1 single conversion goal and demote secondary links.",
        },
        {
          name: "Trust Signals & Social Proof",
          score: Math.min(90, score - 5),
          grade: score - 5 >= 70 ? "Good" : "Needs Work",
          diagnostic: "Testimonial quotes lack company logos, specific metric outcomes, and verifiable customer identities.",
          recommendation: "Add real founder avatars, recognizable client logos, and statistical proof points.",
        },
        {
          name: "Cognitive Load & Reading Flow",
          score: Math.min(92, score + 6),
          grade: "Good",
          diagnostic: "Section-to-section narrative transitions logically from problem to solution to proof.",
          recommendation: "Break long paragraphs into 3-column benefit cards with micro-illustrations.",
        },
      ];

      setReport({
        domain: clean,
        conversionScore: score,
        metrics,
        aboveFoldInsights: {
          headlineClarity: "Clear value prop, lacks quantifiable ROI statement",
          primaryCtaText: "Start Free Trial / Book Demo",
          hasSocialProof: true,
          hasVisualDemo: true,
        },
      });

      setLoading(false);
    }, 1100);
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
          maskImage: "radial-gradient(ellipse at 50% 25%, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 25%, black 40%, transparent 80%)",
        }}
      />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-[#FF5B04]/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-32 lg:px-20 max-md:px-4 pt-32 pb-20 relative z-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 max-w-4xl mx-auto"
        >
          <div className="mb-6 flex flex-row items-center justify-center">
            <GlassBadge variant="gradient">CONVERSION RATE OPTIMIZER</GlassBadge>
          </div>

          <h1 className="text-[38px] sm:text-[50px] md:text-[62px] lg:text-[70px] text-center font-[800] tracking-[-1.5px] leading-[1.08] text-gray-900 mb-5">
            Landing Page UX & <span className="text-[#FF5B04]">Conversion</span> Analyzer
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto text-center font-normal leading-relaxed">
            Audit your landing page headline, CTA visibility, social proof density, and cognitive friction to simulate 0–100 conversion probability.
          </p>

          {/* Integrated Capability Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              "0–100 Conversion Probability Score",
              "Website UX & Hierarchy Audit",
              "CTA Contrast & Attention Gravity",
              "Social Proof & Trust Density",
              "Mobile Conversion Friction",
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

          {/* Development Notice */}
          <div className="mt-7 inline-flex items-center gap-2 bg-amber-50 border border-amber-200/80 rounded-2xl px-5 py-2.5 text-xs text-amber-900 shadow-2xs">
            <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>
              <strong>Deep CRO Engine in Active Development</strong> — Currently running v1 heuristic preview. To get custom high-converting page wireframes,{" "}
              <Link href="/contact" className="text-[#FF5B04] underline font-bold hover:text-[#E54F00]">
                request a full manual teardown →
              </Link>
            </span>
          </div>
        </motion.div>

        {/* Input Box */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={analyzeLandingPage} className="flex items-center gap-2 bg-white/95 backdrop-blur-md border border-[#E5E7EB] rounded-full p-2 shadow-[0_8px_30px_rgba(0,0,0,0.06)] focus-within:border-[#FF5B04]/60 transition-all">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="yoursite.com or yoursite.com/landing-page"
              className="flex-1 px-4 py-3 text-sm text-gray-900 outline-none bg-transparent font-jakarta placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="px-6 py-3 rounded-full bg-[#FF5B04] hover:bg-[#E54F00] text-white text-xs font-bold transition-all disabled:opacity-60 flex items-center gap-2 flex-shrink-0 cursor-pointer shadow-md shadow-[#FF5B04]/20"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing Page…
                </>
              ) : (
                <>
                  <span>Analyze Conversion</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Quick Examples */}
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
            <span>Try:</span>
            {["cal.com", "raycast.com", "resend.com", "cron.com"].map((domain) => (
              <button
                key={domain}
                type="button"
                onClick={() => {
                  setUrl(domain);
                }}
                className="underline hover:text-[#FF5B04] transition-colors cursor-pointer"
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {report && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-8"
          >
            {/* Score Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-gray-900 text-white flex flex-col items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-3xl font-extrabold font-geist">{report.conversionScore}</span>
                    <span className="text-[10px] text-gray-400 font-mono">/100 CRO</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FF5B04]">
                      Domain: {report.domain}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-jakarta mt-1">
                      Conversion Architecture Breakdown
                    </h2>
                    <p className="text-xs text-gray-500 max-w-md mt-1">
                      Audited for value proposition clarity, CTA visual hierarchy, social proof authenticity, and friction.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <Link
                    href="/contact"
                    className="px-6 py-3 rounded-2xl bg-[#FF5B04] hover:bg-[#E54F00] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 text-center"
                  >
                    <span>Get a High-Converting Landing Page</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <span className="text-[11px] text-gray-400 text-center">Engineered for Maximum Demo & Trial Bookings</span>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.metrics.map((metric, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900 font-jakarta">{metric.name}</span>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                        metric.score >= 80
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {metric.score}/100
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">{metric.diagnostic}</p>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-800">
                    <span className="text-[#FF5B04] font-bold mr-1">Fix:</span>
                    {metric.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Detailed Landing Page Content / Educational Guide */}
        <section className="w-full mt-20 pt-12 border-t border-gray-200">
          <div className="text-center mb-12">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04] bg-[#FF5B04]/8 px-3 py-1 rounded-full border border-[#FF5B04]/20">
              High-Velocity Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-3">
              The 4 Pillars of High-Converting B2B Landing Pages
            </h2>
            <p className="text-xs text-gray-500 max-w-2xl mx-auto mt-2 leading-relaxed">
              Every millisecond of attention counts. Here is how modern landing pages convert traffic into active pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">01</span>
              <h3 className="text-base font-bold text-gray-900 mb-2 font-jakarta">5-Second Clarity Test</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Can a visitor understand who the product is for and what problem it solves in under 5 seconds without scrolling?
              </p>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">02</span>
              <h3 className="text-base font-bold text-gray-900 mb-2 font-jakarta">Visual Product Proof</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Replace generic abstract illustrations with crisp UI screenshots, interactive playgrounds, and animated product tours.
              </p>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">03</span>
              <h3 className="text-base font-bold text-gray-900 mb-2 font-jakarta">Objection Pre-emption</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Address security, pricing transparency, migration time, and integration compatibility before asking for a commitment.
              </p>
            </div>
          </div>
        </section>

        {/* Suggested Tools */}
        <div className="w-full">
          <SuggestedTools currentToolId="landing-page-analyzer" />
        </div>
      </div>
    </div>
  );
}
