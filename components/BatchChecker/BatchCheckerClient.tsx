"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SuggestedTools from "@/components/SuggestedTools";

interface BatchSiteResult {
  url: string;
  domain: string;
  score: number;
  grade: string;
  statusText: string;
  blockedCount: number;
  allowedCount: number;
  robotsFound: boolean;
  llmsTxtFound: boolean;
  waf: string | null;
  loading: boolean;
  error: string | null;
}

export default function BatchCheckerClient() {
  const [urlsInput, setUrlsInput] = useState(
    "nytimes.com\nopenai.com\ngithub.com\nuipirate.com"
  );
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<BatchSiteResult[]>([]);

  const handleScan = async () => {
    const urls = urlsInput
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean)
      .slice(0, 10); // max 10 URLs

    if (urls.length === 0) return;

    setIsScanning(true);

    // Initial placeholder states
    const initialList: BatchSiteResult[] = urls.map((u) => ({
      url: u,
      domain: u.replace(/^https?:\/\//, "").split("/")[0],
      score: 0,
      grade: "—",
      statusText: "Scanning...",
      blockedCount: 0,
      allowedCount: 0,
      robotsFound: false,
      llmsTxtFound: false,
      waf: null,
      loading: true,
      error: null,
    }));
    setResults(initialList);

    // Run scans concurrently
    await Promise.all(
      initialList.map(async (item, idx) => {
        try {
          const res = await fetch(`/api/check-ai-bots?url=${encodeURIComponent(item.url)}`);
          const data = await res.json();
          if (!res.ok) {
            setResults((prev) => {
              const copy = [...prev];
              copy[idx] = { ...copy[idx], loading: false, error: data.error || "Failed to reach" };
              return copy;
            });
          } else {
            setResults((prev) => {
              const copy = [...prev];
              copy[idx] = {
                ...copy[idx],
                domain: data.domain,
                score: data.score.overallScore,
                grade: data.score.grade,
                statusText: data.score.statusText,
                blockedCount: data.summary.blocked,
                allowedCount: data.summary.allowed,
                robotsFound: data.robotsFound,
                llmsTxtFound: data.llmsTxtFound,
                waf: data.wafInfo.detected ? data.wafInfo.provider : null,
                loading: false,
                error: null,
              };
              return copy;
            });
          }
        } catch {
          setResults((prev) => {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], loading: false, error: "Network error" };
            return copy;
          });
        }
      })
    );

    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 pt-28 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
            <span className="text-[#FF5B04] text-xs font-semibold font-jetbrains-mono uppercase tracking-wider">
              Batch GEO Audit
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="text-gray-400 text-xs">Multi-URL Comparison</span>
          </div>

          <h1 className="heading-hero text-gray-900 mb-4">
            Batch AI <span className="text-[#FF5B04]">Crawler & Score</span> Checker
          </h1>
          <p className="sub-header">
            Audit multiple competitor websites or client domains at once. Compare GEO Visibility Scores, robots.txt status, and blocked crawlers side-by-side.
          </p>
        </motion.div>

        {/* Input box */}
        <div className="max-w-2xl mx-auto mb-10 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider font-jakarta">
            Enter URLs to audit (One per line, up to 10)
          </label>
          <textarea
            rows={4}
            value={urlsInput}
            onChange={(e) => setUrlsInput(e.target.value)}
            placeholder="domain1.com\ndomain2.com\ndomain3.com"
            className="w-full p-4 rounded-xl border border-gray-200 text-xs font-mono text-gray-800 outline-none focus:border-[#FF5B04]"
          />
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="w-full py-3 rounded-xl bg-[#FF5B04] hover:bg-[#E54F00] text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#FF5B04]/15"
          >
            {isScanning ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Auditing Multiple Domains…
              </>
            ) : (
              <>
                <span>Run Batch Audit</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Results Comparison Table */}
        {results.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm max-w-5xl mx-auto overflow-hidden">
            <h3 className="text-base font-bold text-gray-900 font-jakarta mb-4">
              Comparison Results ({results.length} Domains)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-3">Domain</th>
                    <th className="py-3 px-3">GEO Score</th>
                    <th className="py-3 px-3">Grade</th>
                    <th className="py-3 px-3">Blocked Bots</th>
                    <th className="py-3 px-3">robots.txt</th>
                    <th className="py-3 px-3">llms.txt</th>
                    <th className="py-3 px-3">WAF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map((res, i) => (
                    <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-gray-900 truncate max-w-[180px]">
                        {res.domain}
                      </td>
                      <td className="py-3.5 px-3">
                        {res.loading ? (
                          <span className="text-gray-400 italic">Checking…</span>
                        ) : res.error ? (
                          <span className="text-red-500">{res.error}</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm font-geist text-gray-900">{res.score}</span>
                            <span className="text-gray-400">/100</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        {res.loading ? (
                          "—"
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-800">
                            {res.grade}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        {res.loading ? (
                          "—"
                        ) : (
                          <span
                            className={`font-semibold ${
                              res.blockedCount > 0 ? "text-red-600" : "text-emerald-600"
                            }`}
                          >
                            {res.blockedCount} blocked
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        {res.loading ? (
                          "—"
                        ) : res.robotsFound ? (
                          <span className="text-emerald-600 font-medium">✓ Found</span>
                        ) : (
                          <span className="text-amber-500 font-medium">Missing</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        {res.loading ? (
                          "—"
                        ) : res.llmsTxtFound ? (
                          <span className="text-emerald-600 font-medium">✓ Active</span>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        {res.loading ? (
                          "—"
                        ) : res.waf ? (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-mono text-[10px]">
                            {res.waf}
                          </span>
                        ) : (
                          <span className="text-gray-400 font-mono text-[10px]">Direct</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Suggested Tools */}
        <SuggestedTools currentToolId="batch-checker" />
      </div>
    </div>
  );
}
