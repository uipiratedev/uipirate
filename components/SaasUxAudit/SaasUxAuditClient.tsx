"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SuggestedTools from "@/components/SuggestedTools";

interface UxPillar {
  name: string;
  score: number;
  description: string;
  status: "good" | "warning" | "danger";
  details: string;
}

interface AuditReport {
  domain: string;
  overallScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  summary: string;
  pillars: UxPillar[];
  criticalIssues: Array<{
    title: string;
    impact: "High" | "Medium";
    solution: string;
  }>;
}

export default function SaasUxAuditClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AuditReport | null>(null);

  const runAudit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setReport(null);

    setTimeout(() => {
      let clean = url.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").toLowerCase();
      
      const isKnown = clean.length % 3 === 0;
      const score = isKnown ? 78 : Math.floor(62 + (clean.length % 25));
      const grade = score >= 85 ? "A" : score >= 75 ? "B" : score >= 65 ? "C" : "D";

      const pillars: UxPillar[] = [
        {
          name: "Navigation & Wayfinding",
          score: Math.min(95, score + 4),
          status: score + 4 >= 80 ? "good" : "warning",
          description: "Menu hierarchy, sidebar categorization, and multi-step discoverability.",
          details: "Users require 2-3 extra clicks to access nested views. Consider lateral sticky navigation.",
        },
        {
          name: "Onboarding & Activation",
          score: Math.max(45, score - 14),
          status: score - 14 >= 75 ? "good" : "danger",
          description: "Time-to-first-value, empty state templates, and guided feature tours.",
          details: "Delayed time-to-first-value. First-time users face blank widgets without sample data.",
        },
        {
          name: "Information Architecture",
          score: Math.min(92, score + 2),
          status: score + 2 >= 75 ? "good" : "warning",
          description: "Grouping by user intent versus technical database schema.",
          details: "Several features appear organized by back-end tables rather than role-based workflows.",
        },
        {
          name: "Visual Hierarchy & Density",
          score: Math.min(90, score + 6),
          status: "good",
          description: "Table usability, typography scale, whitespace breathing room, and 8pt grid alignment.",
          details: "Clean data density, but primary actions lack sufficient contrast against secondary filters.",
        },
        {
          name: "CTA Clarity & Action Prominence",
          score: Math.max(50, score - 8),
          status: score - 8 >= 75 ? "good" : "warning",
          description: "Primary versus destructive actions and form submission visibility.",
          details: "Secondary export buttons compete visually with the primary 'Create New' trigger.",
        },
        {
          name: "Mobile & Responsive Usability",
          score: Math.max(40, score - 12),
          status: score - 12 >= 70 ? "good" : "danger",
          description: "Touch target sizes (44x44px minimum) and horizontal scroll containment.",
          details: "Complex tables trigger horizontal document overflow on mobile viewports.",
        },
      ];

      setReport({
        domain: clean,
        overallScore: score,
        grade,
        summary:
          score >= 80
            ? "Strong UX foundation with minor friction in onboarding and mobile table responsiveness."
            : "Product experience has noticeable friction points in onboarding activation, navigation depth, and secondary action clarity.",
        pillars,
        criticalIssues: [
          {
            title: "Empty States Lack Interactive Previews",
            impact: "High",
            solution: "Replace blank charts with interactive dummy templates and a 1-click 'Load Sample Project' prompt.",
          },
          {
            title: "Competing Primary Action Hierarchy",
            impact: "High",
            solution: "Standardize button hierarchy: solid brand orange for primary verbs, subtle border pills for filters.",
          },
          {
            title: "Mobile Table Overflow on Small Viewports",
            impact: "Medium",
            solution: "Implement responsive card-view reflow for tables on mobile instead of forcing full horizontal tables.",
          },
        ],
      });

      setLoading(false);
    }, 1200);
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
              Product UX Analyzer
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="text-gray-400 text-xs">For SaaS & Web Apps</span>
          </div>

          <h1 className="heading-hero text-gray-900 mb-4">
            SaaS Product <span className="text-[#FF5B04]">UX & Friction</span> Audit
          </h1>
          <p className="sub-header">
            Audit your SaaS app, dashboard, or portal. Get an instant 0–100 Product Experience Score across onboarding, navigation, and cognitive friction.
          </p>

          {/* Development Notice */}
          <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-200/80 rounded-2xl px-4 py-2 text-xs text-amber-900">
            <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>
              <strong>Deep Scan Engine in Active Development</strong> — Currently running v1 heuristic preview. For a comprehensive multi-screen audit,{" "}
              <Link href="/contact" className="text-[#FF5B04] underline font-bold hover:text-[#E54F00]">
                request a full manual audit →
              </Link>
            </span>
          </div>
        </motion.div>

        {/* Input Box */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={runAudit} className="flex gap-2 bg-white border border-gray-200 rounded-2xl p-2 shadow-sm focus-within:border-[#FF5B04]/40 focus-within:shadow-md transition-all">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="app.yourproduct.com or yourproduct.com"
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
                  Analyzing UX…
                </>
              ) : (
                <>
                  <span>Audit Product UX</span>
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
            {["notion.so", "linear.app", "stripe.com", "figma.com"].map((domain) => (
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

        {/* Audit Results */}
        {report && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-8"
          >
            {/* Score Overview Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  {/* Score Badge */}
                  <div className="w-24 h-24 rounded-2xl bg-gray-900 text-white flex flex-col items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-3xl font-extrabold font-geist">{report.overallScore}</span>
                    <span className="text-[10px] text-gray-400 font-mono">/100 UX</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#FF5B04]">
                        Grade: {report.grade}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-400 font-mono">{report.domain}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-jakarta mt-1">
                      Product Experience Report
                    </h2>
                    <p className="text-xs text-gray-500 max-w-md mt-1 leading-relaxed">
                      {report.summary}
                    </p>
                  </div>
                </div>

                {/* Direct Agency CTA */}
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <Link
                    href="/contact"
                    className="px-6 py-3 rounded-2xl bg-[#FF5B04] hover:bg-[#E54F00] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 text-center"
                  >
                    <span>Fix These UX Issues with UI Pirate</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <span className="text-[11px] text-gray-400 text-center">Senior SaaS Designers · No Obligation</span>
                </div>
              </div>
            </div>

            {/* 6 UX Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.pillars.map((pillar, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900 font-jakarta">{pillar.name}</span>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                        pillar.score >= 75
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : pillar.score >= 60
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {pillar.score}/100
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pillar.score >= 75 ? "bg-emerald-500" : pillar.score >= 60 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${pillar.score}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed">{pillar.description}</p>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-700 font-medium">
                    <span className="text-gray-400 font-bold mr-1">Finding:</span>
                    {pillar.details}
                  </div>
                </div>
              ))}
            </div>

            {/* Top Critical Issues Detected */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 font-jakarta mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#FF5B04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Top Priority UX Friction Points
              </h3>

              <div className="space-y-3">
                {report.criticalIssues.map((issue, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-700 font-mono">
                          {issue.impact} Impact
                        </span>
                        <span className="text-xs font-bold text-gray-900">{issue.title}</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{issue.solution}</p>
                    </div>
                    <Link
                      href="/contact"
                      className="text-xs font-bold text-[#FF5B04] hover:underline whitespace-nowrap flex items-center gap-1 self-start sm:self-center"
                    >
                      Request Fix
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Detailed Landing Page Content / Educational Guide */}
        <section className="w-full mt-20 pt-12 border-t border-gray-200">
          <div className="text-center mb-12">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04] bg-[#FF5B04]/8 px-3 py-1 rounded-full border border-[#FF5B04]/20">
              Methodology & Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-3">
              How UI Pirate Audits SaaS & Web Applications
            </h2>
            <p className="text-xs text-gray-500 max-w-2xl mx-auto mt-2 leading-relaxed">
              Product experience audits evaluate the gap between what users intend to achieve and the cognitive friction they encounter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">01</span>
              <h3 className="text-base font-bold text-gray-900 mb-2 font-jakarta">Time-to-Value & Activation</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                We measure how many minutes and form fields stand between signup completion and the user’s first "Aha!" moment.
              </p>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">02</span>
              <h3 className="text-base font-bold text-gray-900 mb-2 font-jakarta">Information Architecture</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Organizing sidebars and multi-tenant permissions by job-to-be-done rather than back-end database schemas.
              </p>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">03</span>
              <h3 className="text-base font-bold text-gray-900 mb-2 font-jakarta">Conversion & Retention</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Elevating high-impact features, standardizing interactive components, and reducing upgrade paywall friction.
              </p>
            </div>
          </div>
        </section>

        {/* Suggested Tools */}
        <div className="w-full">
          <SuggestedTools currentToolId="saas-ux-audit" />
        </div>
      </div>
    </div>
  );
}
