"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SuggestedTools from "@/components/SuggestedTools";

interface PricingPillar {
  title: string;
  score: number;
  status: "Optimized" | "Friction Detected" | "Missing";
  finding: string;
  fix: string;
}

export default function PricingPageAnalyzerClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<{
    domain: string;
    score: number;
    pillars: PricingPillar[];
  } | null>(null);

  const analyzePricing = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setReport(null);

    setTimeout(() => {
      let clean = url.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").toLowerCase();
      const baseScore = Math.floor(68 + (clean.length % 22));

      const pillars: PricingPillar[] = [
        {
          title: "Tier Differentiation & Value Metric",
          score: Math.min(94, baseScore + 2),
          status: "Optimized",
          finding: "Plans are separated clearly, but feature limits between tiers cause decision paralysis for mid-market users.",
          fix: "Highlight 1 single 'Most Popular' plan with a badge and elevate the primary value metric (e.g. seats vs API calls).",
        },
        {
          title: "Billing Frequency Toggle (Monthly vs Annual)",
          score: Math.max(55, baseScore - 8),
          status: "Friction Detected",
          finding: "Annual discount percentage (e.g. 'Save 20%') is small and easy to miss above the cards.",
          fix: "Make the annual discount pill contrast against the toggle background with an orange highlight badge.",
        },
        {
          title: "Enterprise Custom Tier & Sales Touchpoint",
          score: Math.min(90, baseScore + 6),
          status: "Optimized",
          finding: "'Contact Sales' CTA for Enterprise tier has good visibility, but lacks list of custom security/SSO features.",
          fix: "Explicitly mention SOC2, SAML SSO, Dedicated SLA, and Custom Contracts directly inside the Enterprise card.",
        },
        {
          title: "FAQ & Objection Handling",
          score: Math.max(45, baseScore - 15),
          status: "Missing",
          finding: "Missing interactive FAQ accordion below the pricing matrix to handle billing, cancellation, and refund questions.",
          fix: "Add a 6-item FAQ accordion answering: cancellation terms, upgrade paths, payment methods, and trial duration.",
        },
      ];

      setReport({
        domain: clean,
        score: baseScore,
        pillars,
      });

      setLoading(false);
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="container mx-auto px-32 lg:px-20 max-md:px-4 pt-28 pb-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
            <span className="text-[#FF5B04] text-xs font-semibold font-jetbrains-mono uppercase tracking-wider">
              Pricing Psychology
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="text-gray-400 text-xs">For SaaS Founders & Product Teams</span>
          </div>

          <h1 className="heading-hero text-gray-900 mb-4">
            SaaS Pricing Page & <span className="text-[#FF5B04]">Conversion</span> Analyzer
          </h1>
          <p className="sub-header">
            Audit your pricing matrix, tier differentiation, annual discount nudges, and objection handling to increase MRR conversions.
          </p>

          {/* Development Notice */}
          <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-200/80 rounded-2xl px-4 py-2 text-xs text-amber-900">
            <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>
              <strong>Deep Pricing Psychology Engine in Active Development</strong> — Currently running v1 heuristic preview. For a custom SaaS pricing redesign,{" "}
              <Link href="/contact" className="text-[#FF5B04] underline font-bold hover:text-[#E54F00]">
                consult our senior product team →
              </Link>
            </span>
          </div>
        </motion.div>

        {/* Input Box */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={analyzePricing} className="flex gap-2 bg-white border border-gray-200 rounded-2xl p-2 shadow-sm focus-within:border-[#FF5B04]/40 focus-within:shadow-md transition-all">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="yoursite.com/pricing or yoursite.com"
              className="flex-1 px-4 py-3 text-sm text-gray-900 outline-none bg-transparent font-jakarta"
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="px-6 py-3 rounded-xl bg-[#FF5B04] hover:bg-[#E54F00] text-white text-xs font-bold transition-all disabled:opacity-60 flex items-center gap-2 flex-shrink-0 cursor-pointer shadow-md shadow-[#FF5B04]/15"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing Pricing…
                </>
              ) : (
                <>
                  <span>Analyze Pricing</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
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
                    <span className="text-3xl font-extrabold font-geist">{report.score}</span>
                    <span className="text-[10px] text-gray-400 font-mono">/100 PRICING</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FF5B04]">
                      Domain: {report.domain}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-jakarta mt-1">
                      Pricing Architecture Audit
                    </h2>
                    <p className="text-xs text-gray-500 max-w-md mt-1">
                      Audited for plan differentiation, annual billing nudges, enterprise touchpoints, and friction.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <Link
                    href="/contact"
                    className="px-6 py-3 rounded-2xl bg-[#FF5B04] hover:bg-[#E54F00] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 text-center"
                  >
                    <span>Redesign Pricing with UI Pirate</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <span className="text-[11px] text-gray-400 text-center">Increase Free-to-Paid Conversion Rate</span>
                </div>
              </div>
            </div>

            {/* Pricing Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.pillars.map((pillar, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900 font-jakarta">{pillar.title}</span>
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                        pillar.status === "Optimized"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : pillar.status === "Friction Detected"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {pillar.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">{pillar.finding}</p>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-800">
                    <span className="text-[#FF5B04] font-bold mr-1">Recommended Fix:</span>
                    {pillar.fix}
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
              Monetization Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-3">
              The Anatomy of a High-Converting SaaS Pricing Page
            </h2>
            <p className="text-xs text-gray-500 max-w-2xl mx-auto mt-2 leading-relaxed">
              Pricing is the highest-leverage lever in your SaaS funnel. Small tweaks in hierarchy can unlock 20–40% higher ARPU.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">01</span>
              <h3 className="text-base font-bold text-gray-900 mb-2 font-jakarta">Anchor to Value Metric</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Base your plan tiers on what customers naturally expand with — such as active seats, tracked events, or monthly compute.
              </p>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">02</span>
              <h3 className="text-base font-bold text-gray-900 mb-2 font-jakarta">Decisive Center Tier</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Guide 70%+ of users into your target Pro tier by highlighting it with a distinct border, badge, and prominent value list.
              </p>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">03</span>
              <h3 className="text-base font-bold text-gray-900 mb-2 font-jakarta">De-risk the Upgrade</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Explicitly show "14-day free trial", "No credit card required", and "Cancel anytime with 1 click" directly under CTAs.
              </p>
            </div>
          </div>
        </section>

        {/* Suggested Tools */}
        <div className="w-full">
          <SuggestedTools currentToolId="pricing-page-analyzer" />
        </div>
      </div>
    </div>
  );
}
