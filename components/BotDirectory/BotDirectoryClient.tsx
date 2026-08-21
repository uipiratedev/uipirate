"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AI_BOTS, BotInfo, BotCategory } from "@/app/api/check-ai-bots/route";

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
              Crawler Database
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="text-gray-400 text-xs">26+ Verified User-Agents</span>
          </div>

          <h1 className="heading-hero text-gray-900 mb-4">
            AI Crawler & Bot <span className="text-[#FF5B04]">Directory</span>
          </h1>
          <p className="sub-header">
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
              className="w-full px-4 py-3.5 pl-11 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:border-[#FF5B04] shadow-sm font-jakarta"
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
      </div>
    </div>
  );
}
