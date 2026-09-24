"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import SuggestedTools from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";
import type { ReadabilityReport } from "@/lib/readability";

interface ReadabilityResponse {
  url: string;
  analyzedAt: string;
  report: ReadabilityReport;
}

function easeColor(score: number) {
  if (score >= 70) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-200";

  return "text-red-600 bg-red-50 border-red-200";
}

function gradeTarget(grade: number) {
  if (grade <= 8.5) return { label: "On target for a broad SaaS audience", tone: "text-emerald-600" };
  if (grade <= 12) return { label: "Above the recommended range for a general audience", tone: "text-amber-600" };

  return { label: "Well above the recommended range — likely to feel dense", tone: "text-red-600" };
}

const SCORE_ROWS: { key: keyof ReadabilityReport["scores"]; label: string; suffix: string }[] = [
  { key: "fleschReadingEase", label: "Flesch Reading Ease", suffix: "/100" },
  { key: "fleschKincaidGrade", label: "Flesch-Kincaid Grade", suffix: "" },
  { key: "gunningFog", label: "Gunning Fog Index", suffix: "" },
  { key: "smogIndex", label: "SMOG Index", suffix: "" },
  { key: "colemanLiauIndex", label: "Coleman-Liau Index", suffix: "" },
  { key: "automatedReadabilityIndex", label: "Automated Readability Index", suffix: "" },
];

export default function ReadabilityCheckerClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReadabilityResponse | null>(null);

  const runCheck = async (targetUrl: string) => {
    if (!targetUrl.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/readability-check?url=${encodeURIComponent(targetUrl)}`);
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
            <GlassBadge variant="gradient">WEBSITE &amp; CONVERSION</GlassBadge>
          </div>

          <h1 className="text-[38px] sm:text-[50px] md:text-[62px] lg:text-[72px] text-center font-[800] tracking-[-1.5px] leading-[1.08] text-gray-900 mb-5">
            Website Readability &amp;{" "}
            <span className="text-[#FF5B04]">Clarity</span> Checker
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto text-center font-normal leading-relaxed">
            Paste a URL and get six real readability formulas — Flesch,
            Flesch-Kincaid, Gunning Fog, SMOG, Coleman-Liau, and ARI —
            computed from the page's actual text, plus the exact sentences
            dragging your score down.
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
                placeholder="yourproduct.com/blog/your-latest-post"
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
                {loading ? "Analyzing…" : "Check Readability"}
              </button>
            </form>
            <p className="text-[11px] text-gray-400 mt-3">
              Works best on content-heavy pages — a blog post, docs page, or
              marketing page with real paragraphs.
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
            {result.report.lowContent && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-relaxed">
                <span className="font-bold">Low-confidence result:</span> only{" "}
                {result.report.stats.wordCount} words of readable text were
                found after stripping navigation, scripts, and boilerplate.
                Readability formulas are unreliable on very short text —
                try a page with a full article or paragraph-length content.
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
              <div
                className={`w-24 h-24 rounded-3xl border-2 flex flex-col items-center justify-center flex-shrink-0 ${easeColor(result.report.scores.fleschReadingEase)}`}
              >
                <span className="text-2xl font-bold font-jakarta">
                  {result.report.scores.fleschReadingEase}
                </span>
                <span className="text-[10px] font-mono">Reading Ease</span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-1 flex-wrap">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${easeColor(result.report.scores.fleschReadingEase)}`}>
                    {result.report.interpretation.label}
                  </span>
                  <span className="text-[11px] font-mono text-gray-400">
                    {new URL(result.url).hostname}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {result.report.interpretation.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {result.report.stats.wordCount} words across{" "}
                  {result.report.stats.sentenceCount} sentences.
                </p>
              </div>
              <Link
                className="px-5 py-3 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm whitespace-nowrap"
                href="/contact"
              >
                Book a Content Review →
              </Link>
            </div>

            {/* Target grade band callout */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <h3 className="text-sm font-bold text-gray-900 font-jakarta">
                  Average Grade Level: {result.report.scores.averageGradeLevel}
                </h3>
                <span className={`text-xs font-semibold ${gradeTarget(result.report.scores.averageGradeLevel).tone}`}>
                  {gradeTarget(result.report.scores.averageGradeLevel).label}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                High-converting B2B SaaS copy typically targets a 6th-8.5th
                grade reading level — plain language that reads fast, even
                for expert audiences.
              </p>
            </div>

            {/* Score breakdown */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 font-jakarta uppercase tracking-wider mb-4">
                All 6 Formulas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SCORE_ROWS.map((row) => (
                  <div
                    key={row.key}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <span className="text-xs font-semibold text-gray-700">{row.label}</span>
                    <span className="text-sm font-mono font-bold text-gray-900">
                      {result.report.scores[row.key]}
                      {row.suffix}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Long sentences */}
            {result.report.longSentences.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 font-jakarta uppercase tracking-wider mb-1">
                  Sentences Dragging Your Score Down
                </h3>
                <p className="text-[11px] text-gray-400 mb-4">
                  Sentences with 25+ words found on this page, longest first.
                </p>
                <div className="space-y-3">
                  {result.report.longSentences.map((s, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold text-red-500 uppercase">
                          {s.wordCount} words
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{s.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Detailed Tutorial / Educational Guide */}
        <section className="mt-4 pt-14 border-t border-gray-200 max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
              Readability Engineering Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-2">
              The 6 Formulas, Explained
            </h2>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Every score below comes from real, published readability
              research — not a proprietary black box. Each formula weighs
              sentence length and word complexity slightly differently, which
              is why we show all six instead of picking a favorite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Flesch Reading Ease",
                desc: "The most widely cited readability score, 0-100 (higher = easier). Combines average sentence length and average syllables per word. 60-70 is considered plain, everyday English.",
              },
              {
                title: "Flesch-Kincaid Grade Level",
                desc: "The same underlying math as Reading Ease, rescaled to a U.S. school grade level. A score of 8 means the text is readable by an average 8th grader.",
              },
              {
                title: "Gunning Fog Index",
                desc: "Weighs 'complex words' (3+ syllables) more heavily than the Flesch formulas. It's the strictest of the six on jargon-heavy writing.",
              },
              {
                title: "SMOG Index",
                desc: "Designed for health and safety writing where comprehension really matters. Estimates the years of education needed to fully understand the text, based purely on complex-word density.",
              },
              {
                title: "Coleman-Liau Index",
                desc: "Uses characters per word instead of syllables, which makes it easy to compute reliably (syllable counting is always a heuristic) and less sensitive to unusual word choices.",
              },
              {
                title: "Automated Readability Index (ARI)",
                desc: "Similar to Coleman-Liau — character-based rather than syllable-based — originally designed for real-time readability scoring on typewriters and early computers.",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Flesch scale reference table */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 font-jakarta mb-6">
              The Flesch Reading Ease Scale
            </h3>
            <div className="space-y-2">
              {[
                ["90-100", "Very Easy", "5th grade"],
                ["80-89", "Easy", "6th grade"],
                ["70-79", "Fairly Easy", "7th grade"],
                ["60-69", "Standard", "8th-9th grade"],
                ["50-59", "Fairly Difficult", "10th-12th grade"],
                ["30-49", "Difficult", "College"],
                ["0-29", "Very Confusing", "College graduate"],
              ].map(([range, label, grade]) => (
                <div
                  key={range}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs"
                >
                  <span className="font-mono font-bold text-gray-700 w-20">{range}</span>
                  <span className="font-semibold text-gray-800 flex-1 text-center">{label}</span>
                  <span className="text-gray-400 w-32 text-right">{grade}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Known limitations */}
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-10">
            <h3 className="text-lg font-bold text-gray-900 font-jakarta mb-4">
              Known Limitations
            </h3>
            <ul className="space-y-2 text-xs text-gray-500 leading-relaxed list-disc pl-4">
              <li>
                Syllable counting uses a vowel-group heuristic, not a
                dictionary — it's accurate for the vast majority of English
                words but can be off by one syllable on unusual spellings.
                This averages out over a full page of text.
              </li>
              <li>
                Sentence splitting relies on punctuation and capitalization
                cues. It correctly handles common abbreviations (Dr., Mr.,
                etc., vs., e.g.) and decimal numbers, but unusual formatting
                can occasionally cause a mis-split.
              </li>
              <li>
                Like the Dashboard UX Analyzer, this tool only sees the raw
                server-rendered HTML — client-rendered pages that inject
                their text via JavaScript will show as low word count.
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
                  q: "What reading level should my SaaS website target?",
                  a: "Most high-converting B2B SaaS marketing copy targets a 6th-8.5th grade level — plain, direct language. This holds even for technical, expert audiences: simpler writing reads faster and converts better, it doesn't signal a lack of sophistication.",
                },
                {
                  q: "Why do the six scores disagree with each other?",
                  a: "Each formula was developed independently, for different purposes (Flesch for general text, SMOG for health literacy, ARI for real-time computation) and weighs sentence length vs. word complexity differently. Use the average, and treat any single score as one data point.",
                },
                {
                  q: "My score seems low but my writing feels simple — why?",
                  a: "Check the 'Sentences Dragging Your Score Down' list. A handful of very long sentences (25+ words) can pull down an otherwise simple page's score more than you'd expect, since all six formulas weight sentence length heavily.",
                },
                {
                  q: "Does this analyze the whole site or just one page?",
                  a: "One URL at a time. Run it against your highest-traffic pages individually — homepage, top blog posts, pricing page — since readability can vary a lot page to page.",
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
        <SuggestedTools category="website-conversion" currentToolId="website-readability-checker" />
      </div>
    </div>
  );
}
