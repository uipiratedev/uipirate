"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ALL_TOOLS_REGISTRY, SuggestedToolItem } from "@/components/SuggestedTools";

export type ToolCategory = "all" | "website-conversion" | "saas-product" | "design-system" | "ai-geo";

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    return ALL_TOOLS_REGISTRY.filter((tool) => {
      const matchesCat = activeCategory === "all" || tool.category === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const liveTools = useMemo(
    () => filteredTools.filter((t) => t.badge === "Live" || t.badge === "Popular"),
    [filteredTools]
  );
  const previewTools = useMemo(
    () => filteredTools.filter((t) => t.badge === "Preview Available"),
    [filteredTools]
  );
  const upcomingTools = useMemo(
    () => filteredTools.filter((t) => t.badge === "Coming Soon" || (!t.badge && t.badge !== "Live")),
    [filteredTools]
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 pt-28 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
            <span className="text-[#FF5B04] text-xs font-semibold font-jetbrains-mono uppercase tracking-wider">
              UI Pirate Tools Ecosystem
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="text-gray-400 text-xs">Free for Founders & Builders</span>
          </div>

          <h1 className="heading-hero text-gray-900 mb-4">
            Free tools for <span className="text-[#FF5B04]">SaaS, AI & product teams</span>
          </h1>
          <p className="sub-header max-w-2xl mx-auto">
            Audit, analyze and improve your product UX, conversion architecture, and AI visibility — instant, free, and built by design engineers.
          </p>
        </motion.div>

        {/* Filter Controls & Search */}
        <div className="max-w-5xl mx-auto mb-12 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all tools (e.g. AI bot, SaaS UX, Pricing, Onboarding, Typography, Breakpoints, robots.txt)..."
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
              { id: "all", label: "All Tools", count: ALL_TOOLS_REGISTRY.length },
              {
                id: "ai-geo",
                label: "AI & GEO Visibility",
                badge: `${ALL_TOOLS_REGISTRY.filter((t) => t.category === "ai-geo").length} Tools`,
                count: ALL_TOOLS_REGISTRY.filter((t) => t.category === "ai-geo").length,
              },
              {
                id: "website-conversion",
                label: "Website & Conversion",
                badge: `${ALL_TOOLS_REGISTRY.filter((t) => t.category === "website-conversion").length} Tools`,
                count: ALL_TOOLS_REGISTRY.filter((t) => t.category === "website-conversion").length,
              },
              {
                id: "saas-product",
                label: "SaaS & Product UX",
                badge: `${ALL_TOOLS_REGISTRY.filter((t) => t.category === "saas-product").length} Tools`,
                count: ALL_TOOLS_REGISTRY.filter((t) => t.category === "saas-product").length,
              },
              {
                id: "design-system",
                label: "Design Systems & Code",
                badge: `${ALL_TOOLS_REGISTRY.filter((t) => t.category === "design-system").length} Tools`,
                count: ALL_TOOLS_REGISTRY.filter((t) => t.category === "design-system").length,
              },
            ].map((tab) => {
              const active = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as ToolCategory)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? "bg-gray-900 text-white shadow-xs"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        active
                          ? "bg-white/20 text-white"
                          : tab.badge.includes("Live")
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Category Pillar Hubs (Hierarchical Category Navigation) */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-jetbrains-mono">
              Explore Tools by Agency Pillar
            </h2>
            <span className="text-[11px] text-gray-400 font-mono">4 Core Verticals</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "AI & GEO Visibility",
                path: "/tools/ai",
                count: `${ALL_TOOLS_REGISTRY.filter((t) => t.category === "ai-geo").length} Tools`,
                badge: "Check · Generate · Research",
                badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
                desc: "Audit AI crawlers, generate llms.txt & optimize for ChatGPT, Perplexity & Gemini.",
              },
              {
                title: "Website & Conversion",
                path: "/tools/website",
                count: `${ALL_TOOLS_REGISTRY.filter((t) => t.category === "website-conversion").length} Tools`,
                badge: "Commercial CRO",
                badgeColor: "text-blue-700 bg-blue-50 border-blue-200",
                desc: "Score above-the-fold clarity, CTA contrast, copy readability & friction.",
              },
              {
                title: "SaaS & Product UX",
                path: "/tools/saas",
                count: `${ALL_TOOLS_REGISTRY.filter((t) => t.category === "saas-product").length} Tools`,
                badge: "Core Expertise",
                badgeColor: "text-purple-700 bg-purple-50 border-purple-200",
                desc: "Audit dashboard density, onboarding drop-offs & pricing psychology.",
              },
              {
                title: "Design Systems & Code",
                path: "/tools/design",
                count: `${ALL_TOOLS_REGISTRY.filter((t) => t.category === "design-system").length} Tools`,
                badge: "Foundations & Code",
                badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
                desc: "Generate Tailwind tokens, 8pt spacing scales, shadows, radii & WCAG contrast.",
              },
            ].map((cat, idx) => (
              <Link
                key={idx}
                href={cat.path}
                className="group bg-white border border-gray-200 hover:border-[#FF5B04]/50 hover:shadow-md rounded-2xl p-5 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-bold font-mono text-gray-400">{cat.count}</span>
                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#FF5B04] transition-colors font-jakarta mb-1.5">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{cat.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#FF5B04]">
                  <span>Explore Pillar</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Section 1: Live Operational Tools Suite */}
        {liveTools.length > 0 && (
          <div className="max-w-5xl mx-auto mb-16">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-jetbrains-mono">
                Live & Operational Tools ({liveTools.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {liveTools.map((tool) => (
                <Link key={tool.id} href={tool.href} className="h-full block">
                  <div className="group relative bg-white border border-gray-200 hover:border-[#FF5B04]/40 hover:shadow-lg rounded-2xl p-6 h-full flex flex-col justify-between transition-all duration-200 cursor-pointer">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 rounded-xl bg-[#FF5B04]/8 text-[#FF5B04] group-hover:bg-[#FF5B04]/15 flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                          {tool.icon}
                        </div>
                        <span
                          className={`text-[10px] font-semibold font-jetbrains-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            tool.badge === "Popular"
                              ? "text-[#FF5B04] bg-[#FF5B04]/8 border-[#FF5B04]/30"
                              : "text-emerald-700 bg-emerald-50 border-emerald-200"
                          }`}
                        >
                          {tool.badge}
                        </span>
                      </div>

                      <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-[#FF5B04] transition-colors font-jakarta mb-2 leading-snug">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 font-mono">{tool.categoryLabel}</span>
                      <span className="flex items-center gap-1 text-xs font-bold text-[#FF5B04] group-hover:gap-1.5 transition-all">
                        {tool.ctaLabel} →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Interactive Previews (In Active Development) */}
        {previewTools.length > 0 && (
          <div className="max-w-5xl mx-auto mt-12 mb-16 pt-10 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-jetbrains-mono">
                  Interactive Preview Engines ({previewTools.length})
                </h2>
              </div>
              <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full font-medium">
                ⚡ Active Development · Test Preview Engines Below
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {previewTools.map((tool) => (
                <Link key={tool.id} href={tool.href} className="h-full block">
                  <div className="group relative bg-white border border-gray-200 hover:border-amber-400 hover:shadow-lg rounded-2xl p-6 h-full flex flex-col justify-between transition-all duration-200 cursor-pointer">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                          {tool.icon}
                        </div>
                        <span className="text-[10px] font-semibold font-jetbrains-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border text-amber-700 bg-amber-50 border-amber-200">
                          {tool.badge}
                        </span>
                      </div>

                      <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-amber-700 transition-colors font-jakarta mb-2 leading-snug">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 font-mono">{tool.categoryLabel}</span>
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-700 group-hover:gap-1.5 transition-all">
                        {tool.ctaLabel} →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Upcoming Tools (Dedicated Landing Pages & Blueprints) */}
        {upcomingTools.length > 0 && (
          <div className="max-w-5xl mx-auto mt-12 mb-16 pt-10 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-jetbrains-mono">
                  Upcoming Tools & Diagnostic Roadmaps ({upcomingTools.length})
                </h2>
              </div>
              <span className="text-xs text-blue-800 bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-full font-medium">
                📋 Detailed Specs & Landing Pages Live
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcomingTools.map((tool) => (
                <Link key={tool.id} href={tool.href} className="h-full block">
                  <div className="group relative bg-white border border-gray-200 hover:border-blue-400 hover:shadow-lg rounded-2xl p-6 h-full flex flex-col justify-between transition-all duration-200 cursor-pointer">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                          {tool.icon}
                        </div>
                        <span className="text-[10px] font-semibold font-jetbrains-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border text-blue-700 bg-blue-50 border-blue-200">
                          {tool.badge || "Coming Soon"}
                        </span>
                      </div>

                      <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-blue-700 transition-colors font-jakarta mb-2 leading-snug">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 font-mono">{tool.categoryLabel}</span>
                      <span className="flex items-center gap-1 text-xs font-bold text-blue-700 group-hover:gap-1.5 transition-all">
                        {tool.ctaLabel} →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Agency Bridge Banner */}
        <div className="max-w-5xl mx-auto mt-16 bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04] bg-[#FF5B04]/8 px-2.5 py-1 rounded-full border border-[#FF5B04]/20">
              Need a Custom Product Audit?
            </span>
            <h3 className="text-2xl font-bold text-gray-900 font-jakarta mt-3">
              Turn audit findings into a high-converting product.
            </h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              UI Pirate is a product design & engineering agency specializing in complex SaaS platforms, AI interfaces, and high-velocity landing pages.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3.5 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-md flex-shrink-0 flex items-center gap-2"
          >
            <span>Book a 1-on-1 UX Consultation</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
