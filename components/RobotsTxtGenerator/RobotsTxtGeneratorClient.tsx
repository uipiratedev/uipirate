"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

interface BotOption {
  id: string;
  name: string;
  userAgent: string;
  company: string;
  category: "ai-search" | "ai-training" | "search-engine" | "seo-tool";
  categoryLabel: string;
  description: string;
  recommended: boolean;
}

const PRESET_BOTS: BotOption[] = [
  // AI Search & Citations
  {
    id: "gptbot",
    name: "GPTBot",
    userAgent: "GPTBot",
    company: "OpenAI",
    category: "ai-training",
    categoryLabel: "AI Training",
    description: "Trains ChatGPT & OpenAI models",
    recommended: true,
  },
  {
    id: "chatgpt-user",
    name: "ChatGPT-User",
    userAgent: "ChatGPT-User",
    company: "OpenAI",
    category: "ai-search",
    categoryLabel: "AI Search",
    description: "Live search requests initiated by ChatGPT users",
    recommended: true,
  },
  {
    id: "claudebot",
    name: "ClaudeBot",
    userAgent: "ClaudeBot",
    company: "Anthropic",
    category: "ai-training",
    categoryLabel: "AI Training",
    description: "Trains Claude 3.5 models",
    recommended: true,
  },
  {
    id: "google-extended",
    name: "Google-Extended",
    userAgent: "Google-Extended",
    company: "Google",
    category: "ai-training",
    categoryLabel: "AI Training",
    description: "Controls training for Gemini & Vertex AI",
    recommended: true,
  },
  {
    id: "perplexitybot",
    name: "PerplexityBot",
    userAgent: "PerplexityBot",
    company: "Perplexity AI",
    category: "ai-search",
    categoryLabel: "AI Search",
    description: "Retrieves live web sources for Perplexity citations",
    recommended: true,
  },
  {
    id: "applebot-extended",
    name: "Applebot-Extended",
    userAgent: "Applebot-Extended",
    company: "Apple",
    category: "ai-training",
    categoryLabel: "AI Training",
    description: "Trains Apple Intelligence foundation models",
    recommended: true,
  },
  {
    id: "meta-externalagent",
    name: "Meta-ExternalAgent",
    userAgent: "meta-externalagent",
    company: "Meta AI",
    category: "ai-training",
    categoryLabel: "AI Training",
    description: "Meta AI Llama model training crawler",
    recommended: true,
  },
  {
    id: "bytespider",
    name: "Bytespider",
    userAgent: "Bytespider",
    company: "ByteDance (TikTok)",
    category: "ai-training",
    categoryLabel: "AI Training",
    description: "ByteDance Doubao & TikTok AI scraper",
    recommended: false,
  },
  {
    id: "ccbot",
    name: "CCBot",
    userAgent: "CCBot",
    company: "Common Crawl",
    category: "ai-training",
    categoryLabel: "AI Training",
    description: "Bulk web crawler feeding open LLM datasets",
    recommended: false,
  },
  {
    id: "amazonbot",
    name: "Amazonbot",
    userAgent: "Amazonbot",
    company: "Amazon",
    category: "ai-training",
    categoryLabel: "AI Training",
    description: "Amazon Bedrock & Alexa AI crawler",
    recommended: true,
  },

  // Traditional Search
  {
    id: "googlebot",
    name: "Googlebot",
    userAgent: "Googlebot",
    company: "Google",
    category: "search-engine",
    categoryLabel: "Search Engine",
    description: "Main Google search indexing crawler",
    recommended: true,
  },
  {
    id: "bingbot",
    name: "Bingbot",
    userAgent: "bingbot",
    company: "Microsoft",
    category: "search-engine",
    categoryLabel: "Search Engine",
    description: "Microsoft Bing & Copilot web crawler",
    recommended: true,
  },

  // SEO Tools
  {
    id: "ahrefsbot",
    name: "AhrefsBot",
    userAgent: "AhrefsBot",
    company: "Ahrefs",
    category: "seo-tool",
    categoryLabel: "SEO Tool",
    description: "SEO backlink and audit crawler",
    recommended: true,
  },
  {
    id: "semrushbot",
    name: "SemrushBot",
    userAgent: "SemrushBot",
    company: "Semrush",
    category: "seo-tool",
    categoryLabel: "SEO Tool",
    description: "Semrush keyword & site audit crawler",
    recommended: true,
  },
];

type PresetMode = "ai-friendly" | "ai-search-only" | "block-ai-train" | "custom";

export default function RobotsTxtGeneratorClient() {
  const [preset, setPreset] = useState<PresetMode>("ai-friendly");
  const [domain, setDomain] = useState("example.com");
  const [sitemapUrl, setSitemapUrl] = useState("https://example.com/sitemap.xml");
  const [llmsTxtUrl, setLlmsTxtUrl] = useState("https://example.com/llms.txt");
  const [defaultRule, setDefaultRule] = useState<"allow-all" | "disallow-all">("allow-all");
  const [disallowedPaths, setDisallowedPaths] = useState("/admin/\n/api/\n/checkout/");
  const [crawlDelay, setCrawlDelay] = useState("");
  const [copied, setCopied] = useState(false);

  // Map of botId -> "allow" | "disallow" | "default"
  const [botRules, setBotRules] = useState<Record<string, "allow" | "disallow" | "default">>(() => {
    const initial: Record<string, "allow" | "disallow" | "default"> = {};
    PRESET_BOTS.forEach((b) => {
      initial[b.id] = b.recommended ? "allow" : "disallow";
    });
    return initial;
  });

  const handlePresetChange = (newPreset: PresetMode) => {
    setPreset(newPreset);
    const updated: Record<string, "allow" | "disallow" | "default"> = {};

    if (newPreset === "ai-friendly") {
      PRESET_BOTS.forEach((b) => {
        updated[b.id] = "allow";
      });
      setDefaultRule("allow-all");
    } else if (newPreset === "ai-search-only") {
      PRESET_BOTS.forEach((b) => {
        if (b.category === "ai-search" || b.category === "search-engine" || b.category === "seo-tool") {
          updated[b.id] = "allow";
        } else {
          updated[b.id] = "disallow";
        }
      });
      setDefaultRule("allow-all");
    } else if (newPreset === "block-ai-train") {
      PRESET_BOTS.forEach((b) => {
        if (b.category === "search-engine") {
          updated[b.id] = "allow";
        } else {
          updated[b.id] = "disallow";
        }
      });
      setDefaultRule("allow-all");
    }
    setBotRules(updated);
  };

  const handleBotRuleToggle = (botId: string, rule: "allow" | "disallow" | "default") => {
    setPreset("custom");
    setBotRules((prev) => ({ ...prev, [botId]: rule }));
  };

  const generatedRobotsTxt = useMemo(() => {
    const lines: string[] = [
      `# robots.txt generated by UI Pirate (https://uipirate.com/tools/robots-txt-generator)`,
      `# Domain: ${domain || "example.com"}`,
      `# Last updated: ${new Date().toISOString().split("T")[0]}`,
      "",
    ];

    // Default Agent Rule
    lines.push("User-agent: *");
    if (defaultRule === "allow-all") {
      lines.push("Allow: /");
    } else {
      lines.push("Disallow: /");
    }

    // Disallowed Paths for default
    const paths = disallowedPaths
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);

    paths.forEach((p) => {
      lines.push(`Disallow: ${p.startsWith("/") ? p : `/${p}`}`);
    });

    if (crawlDelay.trim() && !isNaN(Number(crawlDelay))) {
      lines.push(`Crawl-delay: ${crawlDelay.trim()}`);
    }
    lines.push("");

    // Specific Bot Rules
    const allowedBots: BotOption[] = [];
    const disallowedBots: BotOption[] = [];

    PRESET_BOTS.forEach((bot) => {
      const rule = botRules[bot.id];
      if (rule === "allow") allowedBots.push(bot);
      else if (rule === "disallow") disallowedBots.push(bot);
    });

    if (allowedBots.length > 0) {
      lines.push("# Explicitly Allowed AI & Search Crawlers");
      allowedBots.forEach((bot) => {
        lines.push(`User-agent: ${bot.userAgent}`);
        lines.push("Allow: /");
        lines.push("");
      });
    }

    if (disallowedBots.length > 0) {
      lines.push("# Explicitly Blocked AI Training Scrapers");
      disallowedBots.forEach((bot) => {
        lines.push(`User-agent: ${bot.userAgent}`);
        lines.push("Disallow: /");
        lines.push("");
      });
    }

    // AI Context & Sitemaps
    lines.push("# AI Infrastructure & Discovery");
    if (llmsTxtUrl.trim()) {
      lines.push(`# llms.txt: ${llmsTxtUrl.trim()}`);
    }
    if (sitemapUrl.trim()) {
      lines.push(`Sitemap: ${sitemapUrl.trim()}`);
    }

    return lines.join("\n");
  }, [domain, sitemapUrl, llmsTxtUrl, defaultRule, disallowedPaths, crawlDelay, botRules]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedRobotsTxt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([generatedRobotsTxt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "robots.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
              Free Builder
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="text-gray-400 text-xs">AI & GEO Ready</span>
          </div>

          <h1 className="heading-hero text-gray-900 mb-4">
            AI-Ready <span className="text-[#FF5B04]">robots.txt</span> Generator
          </h1>
          <p className="sub-header">
            Create an optimized robots.txt file in seconds. Control which AI bots (GPTBot, ClaudeBot, Gemini) can cite your website.
          </p>
        </motion.div>

        {/* Builder Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Presets Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 font-jakarta uppercase tracking-wider mb-3">
                1. Select a Preset Strategy
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: "ai-friendly",
                    label: "Max AI Visibility",
                    desc: "Allow all search & AI retrieval bots for maximum citations",
                  },
                  {
                    id: "ai-search-only",
                    label: "Live Citations Only",
                    desc: "Allow ChatGPT-User & Perplexity; block heavy scrapers",
                  },
                  {
                    id: "block-ai-train",
                    label: "Search Only (Block AI)",
                    desc: "Allow Google/Bing, block all AI LLM models",
                  },
                ].map((p) => {
                  const active = preset === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handlePresetChange(p.id as PresetMode)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        active
                          ? "border-[#FF5B04] bg-[#FFF9F5] shadow-sm"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-900">{p.label}</span>
                        {active && <span className="w-2 h-2 rounded-full bg-[#FF5B04]" />}
                      </div>
                      <p className="text-[11px] text-gray-500 leading-tight">{p.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* General Site Config */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-900 font-jakarta uppercase tracking-wider">
                2. Site Information & Paths
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Domain Name</label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="yoursite.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Sitemap URL</label>
                  <input
                    type="text"
                    value={sitemapUrl}
                    onChange={(e) => setSitemapUrl(e.target.value)}
                    placeholder="https://yoursite.com/sitemap.xml"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Disallow Paths for Default Crawlers (One per line)
                </label>
                <textarea
                  rows={3}
                  value={disallowedPaths}
                  onChange={(e) => setDisallowedPaths(e.target.value)}
                  placeholder="/admin/\n/api/\n/private/"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono text-gray-800 outline-none focus:border-[#FF5B04]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">llms.txt URL (Optional)</label>
                  <input
                    type="text"
                    value={llmsTxtUrl}
                    onChange={(e) => setLlmsTxtUrl(e.target.value)}
                    placeholder="https://yoursite.com/llms.txt"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Crawl Delay (Seconds, Optional)</label>
                  <input
                    type="text"
                    value={crawlDelay}
                    onChange={(e) => setCrawlDelay(e.target.value)}
                    placeholder="e.g. 10"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#FF5B04]"
                  />
                </div>
              </div>
            </div>

            {/* Bot Rules Toggle Matrix */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900 font-jakarta uppercase tracking-wider">
                  3. Individual Bot Permissions
                </h2>
                <span className="text-xs text-gray-400 font-mono">14 Supported Crawlers</span>
              </div>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {PRESET_BOTS.map((bot) => {
                  const rule = botRules[bot.id] || "default";
                  return (
                    <div
                      key={bot.id}
                      className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900 truncate">{bot.name}</span>
                          <span className="text-[10px] font-mono text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded">
                            {bot.categoryLabel}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">{bot.description}</p>
                      </div>

                      {/* Rule switch buttons */}
                      <div className="flex items-center gap-1 bg-white border border-gray-200 p-0.5 rounded-lg flex-shrink-0">
                        <button
                          onClick={() => handleBotRuleToggle(bot.id, "allow")}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                            rule === "allow"
                              ? "bg-emerald-500 text-white shadow-xs"
                              : "text-gray-500 hover:text-gray-900"
                          }`}
                        >
                          Allow
                        </button>
                        <button
                          onClick={() => handleBotRuleToggle(bot.id, "disallow")}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                            rule === "disallow"
                              ? "bg-red-500 text-white shadow-xs"
                              : "text-gray-500 hover:text-gray-900"
                          }`}
                        >
                          Block
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Output Preview Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col h-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5B04] font-jetbrains-mono">
                    Live Output
                  </span>
                  <h3 className="text-base font-bold text-gray-900 font-jakarta">robots.txt Preview</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadFile}
                    className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5"
                    title="Download robots.txt"
                  >
                    <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-2 rounded-lg bg-[#FF5B04] hover:bg-[#E54F00] text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    {copied ? "Copied!" : "Copy Code"}
                  </button>
                </div>
              </div>

              <pre className="p-4 rounded-xl bg-gray-900 text-gray-200 font-mono text-xs overflow-x-auto leading-relaxed max-h-[520px] whitespace-pre-wrap select-all">
                {generatedRobotsTxt}
              </pre>

              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
                <span>Save as: <code className="font-mono text-gray-700">robots.txt</code></span>
                <span>Location: <code className="font-mono text-gray-700">/public/robots.txt</code></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
