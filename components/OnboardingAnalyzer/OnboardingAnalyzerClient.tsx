"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import SuggestedTools from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";
import type { OnboardingAuditResult } from "@/lib/onboardingAudit";

interface AuditResponse {
  url: string;
  analyzedAt: string;
  audit: OnboardingAuditResult;
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

export default function OnboardingAnalyzerClient() {
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
      const res = await fetch(`/api/onboarding-audit?url=${encodeURIComponent(targetUrl)}`);
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
            <GlassBadge variant="gradient">SAAS &amp; PRODUCT UX</GlassBadge>
          </div>

          <h1 className="text-[38px] sm:text-[50px] md:text-[62px] lg:text-[72px] text-center font-[800] tracking-[-1.5px] leading-[1.08] text-gray-900 mb-5">
            SaaS Onboarding{" "}
            <span className="text-[#FF5B04]">&amp; Activation Analyzer</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto text-center font-normal leading-relaxed">
            Paste a real signup page or onboarding flow. We fetch the page
            server-side and run deterministic checks for signup friction,
            progressive disclosure, empty-state guidance, and time-to-first-value
           , every result is explainable, nothing is guessed.
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
                placeholder="yourproduct.com/signup"
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
                {loading ? "Analyzing…" : "Analyze"}
              </button>
            </form>
            <p className="text-[11px] text-gray-400 mt-3">
              Works best on your actual signup page, a marketing homepage
              won't have a form to evaluate.
            </p>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto mb-12 p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="w-full max-w-5xl mx-auto space-y-8 mb-20">
            {result.audit.lowContent && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-relaxed">
                <span className="font-bold">Low-confidence result:</span> this
                page returned very little content in its initial HTML
                response. It may be a client-rendered single-page app or
                require authentication, this analyzer only sees the raw
                server response, not what renders after JavaScript runs. For
                best results, test a publicly accessible signup page.
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
                  page's raw server-rendered HTML.
                </p>
              </div>
              <Link
                className="px-5 py-3 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm whitespace-nowrap"
                href="/contact"
              >
                Book a Manual Teardown →
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
                          <p className="text-[11px] text-gray-400 leading-relaxed">{check.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Tutorial / Educational Guide */}
        <section className="mt-4 pt-14 border-t border-gray-200 max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
              Onboarding &amp; Activation Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-2">
              How This Analyzer Works
            </h2>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              This tool fetches the exact HTML your server sends for a URL,
              the same thing a search engine crawler would see, and runs
              deterministic, rule-based checks against it. There's no AI
              guessing and no fake scoring: every check below is visible in
              the results, with the specific DOM evidence that produced it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Signup Friction",
                desc: "Counts form fields and required fields, checks for social login / SSO buttons, and flags CAPTCHA challenges or a mandatory phone number field, all things known to reduce signup completion rate.",
              },
              {
                title: "Progressive Disclosure",
                desc: "Looks for \"Step X of Y\" copy, progress bars, and wizard/multistep container markup, signals that a flow asks for information gradually instead of dumping every field on one overwhelming screen.",
              },
              {
                title: "Empty States & Onboarding Guidance",
                desc: "Scans for empty-state and getting-started copy, checklist/setup-progress widgets (\"3 of 5 steps complete\"), and known product-tour libraries like Intercom, Appcues, Pendo, or Shepherd.",
              },
              {
                title: "Time to First Value",
                desc: "Checks whether the primary call to action is specific and outcome-oriented (not just \"Submit\"), whether trial/pricing risk is stated upfront (\"no credit card required\"), and whether help is one click away.",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
            <div className="bg-gray-900 text-white rounded-3xl p-6 shadow-sm flex flex-col justify-center md:col-span-2">
              <h3 className="text-sm font-bold font-jakarta mb-2">Want a full manual teardown?</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                This automated pass is a starting point. Our product design
                engineers can walk your entire activation funnel, signup,
                empty states, and the first real session, end to end.
              </p>
              <Link
                className="text-xs font-bold text-[#FF5B04] hover:text-white transition-colors"
                href="/contact"
              >
                Book a manual audit →
              </Link>
            </div>
          </div>

          {/* Why activation matters */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 font-jakarta mb-4">
              Why Activation Is the Metric That Matters Most
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Most SaaS products lose more users between "signed up" and
              "found value" than at any other point in the funnel. Activation
              rate, the share of new signups who reach a defined
              first-value moment (sending a message, creating a project,
              connecting a data source), is the strongest predictor of
              whether a trial converts to paid and whether a paid account
              renews. A few concrete mechanisms this tool checks for:
            </p>
            <ul className="space-y-2 text-xs text-gray-500 leading-relaxed list-disc pl-4">
              <li>
                <span className="font-semibold text-gray-700">Every additional form field costs completion rate.</span>{" "}
                Forms with more than 5-7 fields see measurably higher
                abandonment than lean ones, ask for the minimum to create an
                account, and collect the rest later once the user has
                already seen value.
              </li>
              <li>
                <span className="font-semibold text-gray-700">Progressive disclosure reduces perceived effort.</span>{" "}
                Splitting a long form into clearly-labeled steps ("Step 1 of
                3") makes the same amount of work feel more manageable than
                one long unbroken screen, even though nothing about the
                actual effort changed.
              </li>
              <li>
                <span className="font-semibold text-gray-700">Empty states are a design surface, not an accident.</span>{" "}
                A blank dashboard with no data and no guidance is a dead end.
                A designed empty state, a checklist, a sample project, a
                clear "add your first X" call to action, turns that same
                moment into the fastest path to activation.
              </li>
              <li>
                <span className="font-semibold text-gray-700">Ambiguous pricing risk kills signups before they start.</span>{" "}
                If a visitor can't tell whether they'll be charged, how much,
                or when, many will simply not start the signup flow at all,
                stating "free trial, no credit card required" removes that
                hesitation entirely.
              </li>
            </ul>
          </div>

          {/* Known limitations */}
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-10">
            <h3 className="text-lg font-bold text-gray-900 font-jakarta mb-4">
              Known Limitations
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              This is a static-HTML analyzer, not a browser, it never
              executes JavaScript, submits a form, or logs into anything.
              That's an honest boundary, not a hidden one:
            </p>
            <ul className="space-y-2 text-xs text-gray-500 leading-relaxed list-disc pl-4">
              <li>
                Client-rendered signup pages (most React/Vue/Angular SPAs)
                often return an almost-empty HTML shell before JavaScript
                runs, the analyzer will flag this as a "low-confidence"
                result rather than fabricate a score.
              </li>
              <li>
                The empty-state and onboarding-checklist checks can only see
                what's in the page you pointed the tool at. If those live
                behind a login on a different URL, test that URL directly if
                it's publicly reachable.
              </li>
              <li>
                Only <code className="font-mono text-gray-700">http://</code> and{" "}
                <code className="font-mono text-gray-700">https://</code> URLs
                that resolve to a public IP address are accepted, internal
                and private network addresses are blocked for security.
              </li>
            </ul>
          </div>

          {/* FAQs */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 font-jakarta mb-6">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {[
                {
                  q: "What URL should I paste in?",
                  a: "Your actual signup or account-creation page for the best results. You can also test a welcome/onboarding page or a public demo route to check the empty-state and time-to-first-value signals independently.",
                },
                {
                  q: "Why did the Signup Friction score come back capped with a 'no form detected' message?",
                  a: "The page you tested doesn't contain a <form> element in its server-rendered HTML, either it's not the right URL, or the form is injected by client-side JavaScript this tool doesn't execute.",
                },
                {
                  q: "Is my URL stored anywhere?",
                  a: "No. The URL is fetched, analyzed in memory, and the result is returned to your browser, nothing is written to a database.",
                },
                {
                  q: "Why can't I analyze a localhost or internal URL?",
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

        {/* Suggested Tools */}
        <SuggestedTools category="saas-product" currentToolId="saas-onboarding-analyzer" />
      </div>
    </div>
  );
}
