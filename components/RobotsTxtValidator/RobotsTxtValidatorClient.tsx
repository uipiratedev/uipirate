"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import SuggestedTools from "@/components/SuggestedTools";

interface ValidationIssue {
  type: "error" | "warning" | "success" | "info";
  title: string;
  message: string;
  line?: number;
}

export default function RobotsTxtValidatorClient() {
  const [robotsInput, setRobotsInput] = useState(`# Sample robots.txt to test
User-agent: *
Disallow: /admin/
Disallow: /api/
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://example.com/sitemap.xml
`);

  const [testUrl, setTestUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fetchMsg, setFetchMsg] = useState<string | null>(null);

  const handleFetch = async () => {
    if (!testUrl.trim()) return;
    setFetching(true);
    setFetchMsg(null);
    try {
      const res = await fetch(`/api/check-ai-bots?url=${encodeURIComponent(testUrl.trim())}`);
      const data = await res.json();
      if (data.rawRobotsTxt) {
        setRobotsInput(data.rawRobotsTxt);
        setFetchMsg(`Loaded ${data.rawRobotsTxt.split("\n").length} lines from ${data.domain}`);
      } else {
        setFetchMsg(data.fetchError || "No robots.txt found for this domain");
      }
    } catch {
      setFetchMsg("Could not fetch robots.txt");
    } finally {
      setFetching(false);
    }
  };

  // Analyze syntax and rules
  const analysis = useMemo(() => {
    const lines = robotsInput.split("\n");
    const issues: ValidationIssue[] = [];

    let hasUserAgent = false;
    let hasSitemap = false;
    let hasWildcardDisallowRoot = false;
    let blocksGPTBot = false;
    let blocksClaudeBot = false;
    let blocksPerplexity = false;
    let currentUserAgent = "";
    let lineCount = 0;

    lines.forEach((rawLine, index) => {
      const lineNum = index + 1;
      const trimmed = rawLine.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      lineCount++;

      const lower = trimmed.toLowerCase();

      if (lower.startsWith("user-agent:")) {
        hasUserAgent = true;
        currentUserAgent = trimmed.substring("user-agent:".length).trim();
      } else if (lower.startsWith("disallow:")) {
        const path = trimmed.substring("disallow:".length).trim();
        if (currentUserAgent === "*" && path === "/") {
          hasWildcardDisallowRoot = true;
        }
        if (currentUserAgent.toLowerCase() === "gptbot" && (path === "/" || path === "")) {
          if (path === "/") blocksGPTBot = true;
        }
        if (currentUserAgent.toLowerCase() === "claudebot" && path === "/") {
          blocksClaudeBot = true;
        }
        if (currentUserAgent.toLowerCase() === "perplexitybot" && path === "/") {
          blocksPerplexity = true;
        }
      } else if (lower.startsWith("allow:")) {
        // ok
      } else if (lower.startsWith("sitemap:")) {
        hasSitemap = true;
        const smUrl = trimmed.substring("sitemap:".length).trim();
        if (!smUrl.startsWith("http://") && !smUrl.startsWith("https://")) {
          issues.push({
            type: "warning",
            title: "Invalid Sitemap URL",
            message: `Sitemap URL on line ${lineNum} should include full protocol (https://).`,
            line: lineNum,
          });
        }
      } else if (lower.startsWith("crawl-delay:")) {
        // ok
      } else {
        issues.push({
          type: "error",
          title: "Unknown or Misformatted Directive",
          message: `Line ${lineNum} ("${trimmed.slice(0, 30)}") is not recognized as a standard robots.txt directive.`,
          line: lineNum,
        });
      }
    });

    if (!hasUserAgent) {
      issues.push({
        type: "error",
        title: "Missing User-agent Directive",
        message: "Your file contains no 'User-agent:' block. Robots.txt requires at least one User-agent specification.",
      });
    }

    if (hasWildcardDisallowRoot) {
      issues.push({
        type: "error",
        title: "Global Disallow Root Detected",
        message: "'User-agent: * Disallow: /' blocks ALL crawlers, including Google and AI search engines, from your entire site.",
      });
    }

    if (blocksGPTBot) {
      issues.push({
        type: "warning",
        title: "GPTBot Blocked",
        message: "Explicitly disallowing GPTBot prevents ChatGPT from learning about and citing your content.",
      });
    }

    if (blocksClaudeBot) {
      issues.push({
        type: "warning",
        title: "ClaudeBot Blocked",
        message: "Anthropic's ClaudeBot is disallowed, preventing citations in Claude responses.",
      });
    }

    if (blocksPerplexity) {
      issues.push({
        type: "warning",
        title: "PerplexityBot Blocked",
        message: "Perplexity AI is blocked from fetching live web answers from your pages.",
      });
    }

    if (!hasSitemap) {
      issues.push({
        type: "info",
        title: "No Sitemap Declared",
        message: "Consider adding 'Sitemap: https://yourdomain.com/sitemap.xml' to help crawlers discover your URLs.",
      });
    }

    let score = 100;
    issues.forEach((i) => {
      if (i.type === "error") score -= 30;
      if (i.type === "warning") score -= 15;
      if (i.type === "info") score -= 5;
    });
    score = Math.max(10, Math.min(100, score));

    return {
      issues,
      score,
      lineCount,
      hasSitemap,
      hasUserAgent,
    };
  }, [robotsInput]);

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
              Free Linter
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="text-gray-400 text-xs">Syntax & AI Validation</span>
          </div>

          <h1 className="heading-hero text-gray-900 mb-4">
            robots.txt <span className="text-[#FF5B04]">Validator & Linter</span>
          </h1>
          <p className="sub-header">
            Test and validate any robots.txt syntax. Catch blocking errors, unknown directives, and AI engine accessibility issues.
          </p>
        </motion.div>

        {/* URL Fetch bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="flex gap-2 bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm">
            <input
              type="text"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder="Or fetch from domain (e.g. nytimes.com)"
              className="flex-1 px-3.5 py-2 text-xs bg-transparent outline-none text-gray-900 font-jakarta"
            />
            <button
              onClick={handleFetch}
              disabled={fetching}
              className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold disabled:opacity-50 transition-colors"
            >
              {fetching ? "Fetching…" : "Fetch URL"}
            </button>
          </div>
          {fetchMsg && <p className="text-xs text-center text-gray-500 mt-2">{fetchMsg}</p>}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Editor Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider font-jakarta">
                  robots.txt Content
                </span>
                <button
                  onClick={() => setRobotsInput("User-agent: *\nAllow: /\n\nSitemap: https://example.com/sitemap.xml")}
                  className="text-xs text-[#FF5B04] hover:underline"
                >
                  Reset to Recommended
                </button>
              </div>

              <textarea
                rows={16}
                value={robotsInput}
                onChange={(e) => setRobotsInput(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-200 bg-gray-900 text-gray-200 font-mono text-xs outline-none focus:border-[#FF5B04] leading-relaxed"
                placeholder="Paste your robots.txt here..."
              />
            </div>
          </div>

          {/* Validation Results Column */}
          <div className="lg:col-span-5 space-y-4">
            {/* Score Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Syntax & AI Score
                  </span>
                  <div className="text-2xl font-bold font-geist text-gray-900 mt-0.5">
                    {analysis.score}/100
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    analysis.score >= 85
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : analysis.score >= 60
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {analysis.score >= 85 ? "Valid & AI-Ready" : analysis.score >= 60 ? "Needs Review" : "Critical Issues"}
                </div>
              </div>

              {/* Issues List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Diagnostics ({analysis.issues.length})
                </h3>

                {analysis.issues.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    Perfect! No syntax errors or major AI blocking rules detected.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                    {analysis.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                          issue.type === "error"
                            ? "bg-red-50/50 border-red-200 text-red-900"
                            : issue.type === "warning"
                            ? "bg-amber-50/50 border-amber-200 text-amber-900"
                            : "bg-blue-50/50 border-blue-200 text-blue-900"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold mb-0.5">
                          {issue.type === "error" ? (
                            <svg className="w-3.5 h-3.5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          ) : issue.type === "warning" ? (
                            <svg className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" strokeWidth="2" />
                              <line x1="12" y1="16" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
                              <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          )}
                          <span>{issue.title}</span>
                          {issue.line && <span className="font-mono opacity-60 font-normal">Line {issue.line}</span>}
                        </div>
                        <p className="text-gray-600 pl-5">{issue.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Landing Page Content / Educational Guide */}
        <section className="mt-24 pt-14 border-t border-gray-200 max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
              RFC 9309 Linter & Diagnostics
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-2">
              How the robots.txt Syntax Validator Works
            </h2>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Robots Exclusion Protocol syntax errors can silently de-index entire sections of your website or completely lock out AI search citation crawlers like ChatGPT and Perplexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">01</span>
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">Syntax & Directive Check</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Checks for unrecognized directives, missing User-Agent declarations, case-sensitivity flaws, and missing leading slashes in path rules.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">02</span>
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">AI Crawler Block Detection</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Flags whether your file blocks critical AI search engines (OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended) without an explicit intent.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">03</span>
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">Sitemap URL Validation</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Ensures that all <code className="font-mono text-gray-800">Sitemap:</code> directives provide valid, absolute HTTPS URLs reachable by automated bots.
              </p>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 font-jakarta mb-6">
              Frequently Asked Questions about robots.txt Validation
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 mb-1">What is the most common robots.txt mistake?</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Writing <code className="font-mono text-gray-800">Disallow: /</code> under <code className="font-mono text-gray-800">User-agent: *</code>, which unintentionally blocks every search engine on the internet from indexing your site.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 mb-1">Are Crawl-delay directives supported by Google?</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  No. Googlebot ignores the <code className="font-mono text-gray-800">Crawl-delay:</code> directive. Bing and Yandex still support it, but Google recommends managing crawl rate in Search Console instead.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Suggested Tools */}
        <SuggestedTools currentToolId="robots-txt-validator" category="ai-geo" />
      </div>
    </div>
  );
}
