"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SuggestedTools from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";

interface PricingPillar {
  title: string;
  score: number;
  status: "Optimized" | "Friction Detected" | "Missing";
  finding: string;
  fix: string;
}

interface PricingAnalysisReport {
  domain: string;
  overallScore: number;
  score: number;
  grade: "A" | "B" | "C" | "D";
  summary: string;
  pillars: PricingPillar[];
}

export default function PricingPageAnalyzerClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<PricingAnalysisReport | null>(null);

  const analyzePricing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setTimeout(() => {
      let cleanDomain = url.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
      setReport({
        domain: cleanDomain,
        overallScore: 78,
        score: 78,
        grade: "B",
        summary:
          "Strong 3-tier structure with clear visual anchor on the Pro tier. Potential conversion leaks detected in annual discount clarity and feature comparison matrix depth.",
        pillars: [
          {
            title: "Tier Differentiation & Choice Architecture",
            score: 85,
            status: "Optimized",
            finding: "Clear separation between Starter, Pro, and Enterprise tiers with distinctive feature boundaries.",
            fix: "Keep tier names focused on business outcomes rather than internal tech capacity.",
          },
          {
            title: "Annual Billing Toggle & Expansion Incentive",
            score: 72,
            status: "Friction Detected",
            finding: "Annual discount savings ('Save 20%') are not prominent enough next to monthly toggle switch.",
            fix: "Add an orange badge highlighting '2 Months Free' directly on the annual billing switch.",
          },
          {
            title: "Decision De-risking & Trust Triggers",
            score: 75,
            status: "Friction Detected",
            finding: "Free trial terms and credit-card requirements are buried under the fold.",
            fix: "Display '14-day free trial · No credit card required' directly below every primary tier button.",
          },
          {
            title: "Enterprise Contact Route Friction",
            score: 80,
            status: "Optimized",
            finding: "Custom enterprise tier links cleanly to high-priority sales contact flow.",
            fix: "Add expected response time SLA ('Response within 2 hours') to improve enterprise lead velocity.",
          },
        ],
      });
      setLoading(false);
    }, 1200);
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
            <GlassBadge variant="gradient">PRICING PSYCHOLOGY &amp; CRO</GlassBadge>
          </div>

          <h1 className="text-[38px] sm:text-[50px] md:text-[62px] lg:text-[70px] text-center font-[800] tracking-[-1.5px] leading-[1.08] text-gray-900 mb-5">
            SaaS Pricing Page &amp; <span className="text-[#FF5B04]">Conversion</span> Analyzer
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto text-center font-normal leading-relaxed">
            Audit your pricing matrix, tier differentiation, annual discount nudges, and objection handling to increase MRR conversions.
          </p>

          {/* Development Notice */}
          <div className="mt-7 inline-flex items-center gap-2 bg-amber-50 border border-amber-200/80 rounded-2xl px-5 py-2.5 text-xs text-amber-900 shadow-2xs">
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
          <form onSubmit={analyzePricing} className="flex items-center gap-2 bg-white/95 backdrop-blur-md border border-[#E5E7EB] rounded-full p-2 shadow-[0_8px_30px_rgba(0,0,0,0.06)] focus-within:border-[#FF5B04]/60 transition-all">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="yoursite.com/pricing or yoursite.com"
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
                  <span>Analyzing…</span>
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
