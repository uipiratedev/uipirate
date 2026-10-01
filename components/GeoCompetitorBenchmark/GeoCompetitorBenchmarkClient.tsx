"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import SuggestedTools from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";
import { AI_BOTS } from "@/data/bots";
import type { DomainGeoScore, GeoBenchmarkComparison } from "@/lib/geoBenchmark";

interface DomainResult {
  hostname: string;
  score: DomainGeoScore;
}

interface BenchmarkResponse {
  analyzedAt: string;
  primary: DomainResult;
  competitor: DomainResult;
  comparison: GeoBenchmarkComparison;
}

function gradeColor(grade: string) {
  if (grade === "A") return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (grade === "B") return "text-lime-600 bg-lime-50 border-lime-200";
  if (grade === "C") return "text-amber-600 bg-amber-50 border-amber-200";
  if (grade === "D") return "text-orange-600 bg-orange-50 border-orange-200";

  return "text-red-600 bg-red-50 border-red-200";
}

function botName(id: string): string {
  return AI_BOTS.find((b) => b.id === id)?.name ?? id;
}

export default function GeoCompetitorBenchmarkClient() {
  const [primaryUrl, setPrimaryUrl] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BenchmarkResponse | null>(null);

  const runBenchmark = async () => {
    if (!primaryUrl.trim() || !competitorUrl.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        `/api/geo-benchmark?primary=${encodeURIComponent(primaryUrl)}&competitor=${encodeURIComponent(competitorUrl)}`,
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong benchmarking these domains.");
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
            <GlassBadge variant="gradient">AI &amp; GEO VISIBILITY</GlassBadge>
          </div>

          <h1 className="text-[38px] sm:text-[50px] md:text-[62px] lg:text-[72px] text-center font-[800] tracking-[-1.5px] leading-[1.08] text-gray-900 mb-5">
            GEO Competitor{" "}
            <span className="text-[#FF5B04]">&amp; AI Search Benchmark</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto text-center font-normal leading-relaxed">
            Enter your domain and a competitor&apos;s. We fetch both sites&apos;
            robots.txt, llms.txt/llms-full.txt, and homepage structured data
            in real time and score AI bot access, AI infrastructure, and
            schema depth side by side.
          </p>

          <div className="mt-8 max-w-2xl mx-auto space-y-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full p-2 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 pl-3 w-16 flex-shrink-0">YOU</span>
              <input
                className="flex-1 px-2 py-2.5 text-sm text-gray-800 outline-none bg-transparent"
                placeholder="yourproduct.com"
                type="text"
                value={primaryUrl}
                onChange={(e) => setPrimaryUrl(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full p-2 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 pl-3 w-16 flex-shrink-0">THEM</span>
              <input
                className="flex-1 px-2 py-2.5 text-sm text-gray-800 outline-none bg-transparent"
                placeholder="competitor.com"
                type="text"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
              />
            </div>
            <button
              className="w-full px-6 py-3 rounded-full bg-gray-900 hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-all flex items-center justify-center gap-2"
              disabled={loading || !primaryUrl.trim() || !competitorUrl.trim()}
              onClick={runBenchmark}
              type="button"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" d="M4 12a8 8 0 018-8" fill="currentColor" />
                </svg>
              )}
              {loading ? "Benchmarking…" : "Benchmark Both Domains"}
            </button>
          </div>
        </motion.div>

        {error && (
          <div className="max-w-2xl mx-auto mb-12 p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700 text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="w-full max-w-5xl mx-auto space-y-8 mb-20">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(
                  [
                    ["YOU", result.primary, result.comparison.overallWinner === "primary"],
                    ["THEM", result.competitor, result.comparison.overallWinner === "competitor"],
                  ] as const
                ).map(([label, domain, isWinner]) => (
                  <div
                    key={label}
                    className={`rounded-2xl border p-5 flex items-center gap-4 ${isWinner ? "border-[#FF5B04]/40 bg-orange-50/40" : "border-gray-200"}`}
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center flex-shrink-0 ${gradeColor(domain.score.grade)}`}
                    >
                      <span className="text-xl font-bold font-jakarta">{domain.score.overallScore}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400">{label}</span>
                        {isWinner && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#FF5B04] text-white">
                            LEADING
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-gray-900 font-mono">{domain.hostname}</p>
                      <p className="text-[11px] text-gray-500">Grade {domain.score.grade}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 font-jakarta mb-4">Pillar Comparison</h3>
              <div className="space-y-5">
                {result.comparison.pillars.map((pillar) => (
                  <div key={pillar.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-gray-700">{pillar.label}</span>
                      <span className="text-[10px] font-bold text-gray-400">
                        {pillar.winner === "tie" ? "TIE" : pillar.winner === "primary" ? "YOU LEAD" : "THEY LEAD"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-500 w-8">{pillar.primary}</span>
                      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden flex">
                        <div className="h-full bg-[#FF5B04]" style={{ width: `${pillar.primary}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-gray-500 w-8">{pillar.competitor}</span>
                      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden flex">
                        <div className="h-full bg-gray-900" style={{ width: `${pillar.competitor}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {(result.comparison.blockedBotsPrimaryOnly.length > 0 ||
              result.comparison.blockedBotsCompetitorOnly.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-900 mb-3">
                    Bots blocked on your site only
                  </h4>
                  {result.comparison.blockedBotsPrimaryOnly.length === 0 ? (
                    <p className="text-[11px] text-gray-400">None - good.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {result.comparison.blockedBotsPrimaryOnly.map((id) => (
                        <li key={id} className="text-[11px] text-red-600 font-mono">{botName(id)}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-900 mb-3">
                    Bots blocked on their site only
                  </h4>
                  {result.comparison.blockedBotsCompetitorOnly.length === 0 ? (
                    <p className="text-[11px] text-gray-400">None.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {result.comparison.blockedBotsCompetitorOnly.map((id) => (
                        <li key={id} className="text-[11px] text-emerald-600 font-mono">{botName(id)}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gray-900 text-white rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold font-jakarta mb-1">Want a full AI visibility teardown?</h3>
                <p className="text-xs text-gray-300">
                  Get a complete audit and fix plan across every AI search signal.
                </p>
              </div>
              <Link
                className="px-5 py-3 rounded-2xl bg-[#FF5B04] hover:bg-[#e55204] text-white text-xs font-bold transition-all whitespace-nowrap"
                href="/contact"
              >
                Book a GEO Audit →
              </Link>
            </div>
          </div>
        )}

        {/* Tutorial */}
        <section className="mt-4 pt-14 border-t border-gray-200 max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
              GEO Benchmark Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-2">
              What Gets Compared, and Why
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "AI Bot Access (50% weight)",
                desc: `Fetches robots.txt from both domains and checks it against the same ${AI_BOTS.length}-bot list used by our AI Crawler & GEO Readiness Hub - weighted by how much each bot matters for AI search visibility, so blocking a major answer-engine crawler costs more than blocking a minor one.`,
              },
              {
                title: "AI Infrastructure (30% weight)",
                desc: "Checks for a valid robots.txt, plus the llms.txt and llms-full.txt files - an emerging standard that gives AI agents a clean, structured summary of a site instead of making them infer everything from raw HTML.",
              },
              {
                title: "Structured Data (20% weight)",
                desc: "Counts distinct JSON-LD @type values found in the homepage's structured data - more recognized schema types generally means an AI system has more explicit, unambiguous facts to cite instead of guessing from prose.",
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
              Why Competitive Benchmarking Matters for GEO
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              A GEO (Generative Engine Optimization) score in isolation is
              hard to interpret - is 65/100 good? It depends entirely on
              what's achievable in your space. Seeing your score next to a
              direct competitor's, broken into the same three pillars,
              turns an abstract number into a concrete gap: "they have
              llms.txt and we don't" is an action item in a way "our AI
              infrastructure score is 70" isn't.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 font-jakarta mb-6">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {[
                {
                  q: "Does this use any Google/Search Console/PageSpeed API?",
                  a: "No - everything is derived from fetching each domain's own public robots.txt, llms.txt/llms-full.txt, and homepage HTML directly. No API keys or account access are required.",
                },
                {
                  q: "Why does the bot-access pillar carry the most weight?",
                  a: "If an AI crawler is blocked entirely, nothing else about a page - its schema, its llms.txt, its content quality - can matter to that system, since it never gets read in the first place.",
                },
                {
                  q: "Can I benchmark my own domain against itself?",
                  a: "You can, though it will simply score both sides identically - the tool is designed for comparing two distinct domains.",
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

        <SuggestedTools category="ai-geo" currentToolId="geo-competitor-checker" />
      </div>
    </div>
  );
}
