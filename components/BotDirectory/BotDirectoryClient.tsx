"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AI_BOTS, BotInfo, BotCategory } from "@/data/bots";
import SuggestedTools from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";

export default function BotDirectoryClient() {
  const [activeCategory, setActiveCategory] = useState<"all" | BotCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBot, setSelectedBot] = useState<BotInfo | null>(null);

  const filteredBots = useMemo(() => {
    return AI_BOTS.filter((b) => {
      const matchesCat = activeCategory === "all" || b.category === activeCategory;
      const matchesQuery =
        !searchQuery.trim() ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.userAgent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="mb-6 flex flex-row items-center justify-center">
            <GlassBadge variant="gradient">AI BOT &amp; USER-AGENT REGISTRY</GlassBadge>
          </div>

          <h1 className="text-[38px] sm:text-[50px] md:text-[62px] lg:text-[70px] text-center font-[800] tracking-[-1.5px] leading-[1.08] text-gray-900 mb-5 max-w-4xl mx-auto">
            AI Crawler &amp; Bot <span className="text-[#FF5B04]">Directory</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto text-center font-normal leading-relaxed">
            Searchable encyclopedia of AI crawlers, LLM training bots, search engines, and scrapers. Look up exact User-Agents, operators, and behaviors.
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by crawler name, company, or User-Agent token (e.g. OpenAI, Google, GPTBot)..."
              className="w-full px-5 py-3.5 pl-12 rounded-full border border-gray-200 bg-white/95 backdrop-blur-md text-sm text-gray-900 outline-none focus:border-[#FF5B04] shadow-[0_4px_20px_rgba(0,0,0,0.04)] font-jakarta placeholder:text-gray-400"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path d="m21 21-4.35-4.35" strokeWidth="2" />
            </svg>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "All Crawlers", count: AI_BOTS.length },
              { id: "ai-training", label: "AI Training", count: AI_BOTS.filter((b) => b.category === "ai-training").length },
              { id: "ai-search", label: "AI Search & Retrieval", count: AI_BOTS.filter((b) => b.category === "ai-search").length },
              { id: "search-engine", label: "Search Engines", count: AI_BOTS.filter((b) => b.category === "search-engine").length },
              { id: "seo-tool", label: "SEO Tools", count: AI_BOTS.filter((b) => b.category === "seo-tool").length },
              { id: "social", label: "Social Previews", count: AI_BOTS.filter((b) => b.category === "social").length },
            ].map((tab) => {
              const active = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as typeof activeCategory)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    active ? "bg-gray-900 text-white shadow-xs" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.label} <span className="opacity-60 text-[10px] ml-1">({tab.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {filteredBots.map((bot, i) => (
            <motion.div
              key={bot.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <a
                href={`/tools/bot-directory/${bot.id}`}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-full hover:border-[#FF5B04]/40 hover:shadow-md transition-all group block"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-100">
                      {bot.categoryLabel}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{bot.company}</span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 group-hover:text-[#FF5B04] transition-colors font-jakarta mb-1">
                    {bot.name}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">{bot.description}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">User-Agent</span>
                    <code className="font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-100 text-gray-800 text-[11px]">
                      {bot.userAgent}
                    </code>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-1 text-[#FF5B04] font-semibold">
                    <span>View Rules & Documentation</span>
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Detailed Landing Page Content / Educational Guide */}
        <section className="mt-24 pt-14 border-t border-gray-200 max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
              Web Crawler Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-2">
              Understanding the 4 Classes of Modern Web Bots
            </h2>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Not all crawlers are the same. A modern search strategy treats foundation model training bots, conversational citation agents, and traditional search engines differently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">01</span>
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">AI Training Bots</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Bots like <code className="font-mono text-gray-800">GPTBot</code>, <code className="font-mono text-gray-800">ClaudeBot</code>, and <code className="font-mono text-gray-800">CCBot</code> scrape massive datasets to train next-gen weights. Blocking them preserves IP without hurting search ranking.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">02</span>
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">Live AI Search Bots</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Crawlers like <code className="font-mono text-gray-800">OAI-SearchBot</code> and <code className="font-mono text-gray-800">PerplexityBot</code> fetch real-time web pages to answer live user queries with direct clickable source links.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <span className="text-2xl font-bold font-mono text-[#FF5B04] mb-3 block">03</span>
              <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">SEO & Social Previews</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Bots like <code className="font-mono text-gray-800">facebookexternalhit</code>, <code className="font-mono text-gray-800">Twitterbot</code>, and <code className="font-mono text-gray-800">AhrefsBot</code> power rich share cards and technical backlink monitoring.
              </p>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 font-jakarta mb-6">
              Frequently Asked Questions about AI Crawlers
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 mb-1">How can I verify if a bot is legitimate?</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Perform a reverse DNS lookup on the visiting IP address. For instance, authentic Googlebot visits resolve to <code className="font-mono text-gray-800">*.googlebot.com</code> and OpenAI visits resolve to <code className="font-mono text-gray-800">*.openai.com</code>.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 mb-1">Does blocking AI training bots reduce Google rankings?</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  No. Blocking training crawlers like GPTBot or Applebot-Extended has zero impact on traditional Google or Bing organic search visibility.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Suggested Tools */}
        <SuggestedTools currentToolId="bot-directory" category="ai-geo" />
      </div>
    </div>
  );
}
