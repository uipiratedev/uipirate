"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ALL_TOOLS_REGISTRY, ToolCategory } from "@/components/SuggestedTools";

import GlassBadge from "@/components/GlassBadge";

export default function ToolsHubPage() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    return ALL_TOOLS_REGISTRY.filter((tool) => {
      const matchesCat = activeCategory === "all" || tool.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
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

      {/* Hero */}
      <div className="container mx-auto px-32 lg:px-20 max-md:px-4 pt-32 pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          {/* Badge */}
          <div className="mb-6 flex flex-row items-center justify-center">
            <GlassBadge variant="gradient">TOOLS & DIAGNOSTICS</GlassBadge>
          </div>

          <h1 className="text-[38px] sm:text-[50px] md:text-[62px] lg:text-[72px] text-center font-[800] tracking-[-1.5px] leading-[1.08] text-gray-900 mb-5 max-w-5xl mx-auto">
            Free tools for <span className="text-[#FF5B04]">SaaS, AI &amp; Product Teams</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto text-center font-normal leading-relaxed">
            Audit, score, and optimize your product UX, conversion architecture, and AI bot visibility — 100% free and built by senior design engineers.
          </p>
        </motion.div>

        {/* Filter Controls & Search */}
        <div className="w-full mb-12 space-y-4">
          <div className="relative max-w-3xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all tools (e.g. AI bot, SaaS UX, Pricing, Onboarding, Typography, Breakpoints, robots.txt)..."
              className="w-full px-5 py-3.5 pl-12 rounded-full border-2 border-gray-200 focus:border-[#FF5B04] focus:outline-none transition-colors duration-300 text-sm bg-white shadow-xs font-jakarta text-gray-900"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-mono"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
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
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? "bg-[#FF5B04] text-white shadow-md shadow-[#FF5B04]/20"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-[#FF5B04]/50 hover:text-[#FF5B04]"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600"
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
        <div className="w-full mb-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-jetbrains-mono">
              Explore Tools by Agency Pillar
            </h2>
            <span className="text-[11px] text-gray-400 font-mono">4 Core Verticals</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                className="group bg-white border border-[#E5E7EB] hover:border-[#FF5B04]/50 rounded-[24px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold font-mono text-gray-400">{cat.count}</span>
                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-[#FF5B04] transition-colors font-jakarta mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{cat.desc}</p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#FF5B04]">
                  <span>Explore Pillar</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Section 1: Live Operational Tools Suite */}
        {liveTools.length > 0 && (
          <div className="w-full mb-16">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-jetbrains-mono">
                Live & Operational Tools ({liveTools.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveTools.map((tool) => (
                <Link key={tool.id} href={tool.href} className="h-full block">
                  <div className="group relative bg-white border border-[#E5E7EB] hover:border-[#FF5B04]/50 rounded-[24px] p-7 h-full flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#FF5B04]/8 text-[#FF5B04] group-hover:bg-[#FF5B04] group-hover:text-white flex items-center justify-center flex-shrink-0 transition-all duration-300 [&>svg]:w-6 [&>svg]:h-6">
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

                      <h3 className="text-base font-bold text-gray-900 group-hover:text-[#FF5B04] transition-colors font-jakarta mb-2 leading-snug">
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
          <div className="w-full mt-12 mb-16 pt-10 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-jetbrains-mono">
                  Interactive Preview Engines ({previewTools.length})
                </h2>
              </div>
              <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full font-medium">
                ⚡ Active Development · Test Preview Engines Below
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {previewTools.map((tool) => (
                <Link key={tool.id} href={tool.href} className="h-full block">
                  <div className="group relative bg-white border border-[#E5E7EB] hover:border-amber-400 rounded-[24px] p-7 h-full flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white flex items-center justify-center flex-shrink-0 transition-all duration-300 [&>svg]:w-6 [&>svg]:h-6">
                          {tool.icon}
                        </div>
                        <span className="text-[10px] font-semibold font-jetbrains-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border text-amber-700 bg-amber-50 border-amber-200">
                          {tool.badge}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-700 transition-colors font-jakarta mb-2 leading-snug">
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
          <div className="w-full mt-12 mb-16 pt-10 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-jetbrains-mono">
                  Upcoming Tools & Diagnostic Roadmaps ({upcomingTools.length})
                </h2>
              </div>
              <span className="text-xs text-blue-800 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full font-medium">
                📋 Detailed Specs & Landing Pages Live
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTools.map((tool) => (
                <Link key={tool.id} href={tool.href} className="h-full block">
                  <div className="group relative bg-white border border-[#E5E7EB] hover:border-blue-400 rounded-[24px] p-7 h-full flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center flex-shrink-0 transition-all duration-300 [&>svg]:w-6 [&>svg]:h-6">
                          {tool.icon}
                        </div>
                        <span className="text-[10px] font-semibold font-jetbrains-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border text-blue-700 bg-blue-50 border-blue-200">
                          {tool.badge || "Coming Soon"}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors font-jakarta mb-2 leading-snug">
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
        <div className="w-full mt-16 bg-white border border-[#E5E7EB] rounded-[32px] p-8 sm:p-12 shadow-[0_2px_16px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04] bg-[#FF5B04]/8 px-3 py-1 rounded-full border border-[#FF5B04]/20">
              Need a Custom Product Audit?
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-3">
              Turn audit findings into a high-converting product.
            </h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              UI Pirate is a product design & full-stack development agency specializing in complex SaaS platforms, AI interfaces, and high-velocity landing pages.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-7 py-4 rounded-2xl bg-gray-900 hover:bg-[#FF5B04] text-white text-sm font-bold transition-all shadow-md flex-shrink-0 flex items-center gap-2"
          >
            <span>Book a 1-on-1 UX Consultation</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
