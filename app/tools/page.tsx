"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export type ToolCategory = "all" | "saas-product" | "website-conversion" | "ai-geo" | "design-system";

interface ToolItem {
  id: string;
  href: string | null;
  badge: "Live" | "Popular" | "In Development" | "Beta";
  category: ToolCategory;
  categoryLabel: string;
  title: string;
  description: string;
  agencyHook: string;
  tags: string[];
  icon: React.ReactNode;
}

const tools: ToolItem[] = [
  // ── Pillar 1: SaaS & Product Design Tools
  {
    id: "saas-ux-audit",
    href: "/tools/saas-ux-audit",
    badge: "In Development",
    category: "saas-product",
    categoryLabel: "SaaS & Product Design",
    title: "SaaS Product UX & Friction Audit",
    description:
      "Audit your SaaS web app or dashboard URL. Get a 0–100 Product Experience Score across onboarding, information architecture, navigation, and CTA clarity.",
    agencyHook: "Mapped to SaaS & AI Product Design",
    tags: ["Product UX", "SaaS Audit", "Onboarding", "Friction"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <path d="M7 8h4M7 11h2" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "pricing-page-analyzer",
    href: "/tools/pricing-page-analyzer",
    badge: "In Development",
    category: "saas-product",
    categoryLabel: "SaaS & Product Design",
    title: "SaaS Pricing Page & Conversion Analyzer",
    description:
      "Analyze your SaaS pricing table. Audit tier differentiation, annual discount nudges, feature comparisons, and pricing psychology friction.",
    agencyHook: "Mapped to SaaS Conversion Strategy",
    tags: ["Pricing UX", "SaaS Revenue", "Tier Hierarchy"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
        <line x1="12" y1="10" x2="12" y2="20" />
        <path d="M7 15h.01M17 15h.01" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },

  // ── Pillar 2: Website & Conversion Tools
  {
    id: "landing-page-analyzer",
    href: "/tools/landing-page-analyzer",
    badge: "In Development",
    category: "website-conversion",
    categoryLabel: "Website & Conversion",
    title: "Landing Page UX & Conversion Analyzer",
    description:
      "Inspect any landing page URL. Score your above-the-fold value proposition, CTA visibility, social proof trust signals, and cognitive friction.",
    agencyHook: "Mapped to Landing Pages & Websites",
    tags: ["Landing Page", "Conversion Rate", "CTA Clarity", "Trust Signals"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },

  // ── Pillar 3: AI & GEO Visibility Toolkit
  {
    id: "ai-bot-checker",
    href: "/tools/ai-bot-checker",
    badge: "Popular",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    title: "AI Crawler & GEO Readiness Hub",
    description:
      "Paste any website URL and get an instant 0–100 GEO Visibility Score across 26+ AI bots (GPTBot, ClaudeBot, Perplexity) and Cloudflare WAF.",
    agencyHook: "Mapped to AI Product & GEO Strategy",
    tags: ["GEO Score", "AI crawlers", "Firewall WAF", "ChatGPT Citations"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <line x1="8" y1="16" x2="8.01" y2="16" />
        <line x1="16" y1="16" x2="16.01" y2="16" />
      </svg>
    ),
  },
  {
    id: "llms-txt-generator",
    href: "/tools/llms-txt-generator",
    badge: "Live",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    title: "llms.txt & Markdown Knowledge Generator",
    description:
      "Generate standard llms.txt and deep llms-full.txt files. Provide structured company knowledge directly to AI crawlers and LLM search agents.",
    agencyHook: "Mapped to AI Infrastructure",
    tags: ["llms.txt", "AI context", "GEO Standard"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    id: "robots-txt-generator",
    href: "/tools/robots-txt-generator",
    badge: "Live",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    title: "AI robots.txt Generator",
    description:
      "Build a custom robots.txt file for your site. Choose which AI bots, search engines, and scrapers to allow or block with 1-click strategy presets.",
    agencyHook: "Mapped to Search Architecture",
    tags: ["robots.txt", "AI crawlers", "Generator"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "robots-txt-validator",
    href: "/tools/robots-txt-validator",
    badge: "Live",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    title: "robots.txt Validator & Linter",
    description:
      "Test and validate any robots.txt syntax against RFC 9309. Catch blocking errors, unknown directives, and accidental AI crawler bans.",
    agencyHook: "Mapped to Technical Audit",
    tags: ["Linter", "Syntax", "Validator"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path d="M9 12l2 2 4-4" />
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: "batch-checker",
    href: "/tools/batch-checker",
    badge: "Live",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    title: "Batch AI Crawler & GEO Score Auditor",
    description:
      "Audit up to 10 competitor or client domains simultaneously. Compare GEO scores and crawler permissions side-by-side.",
    agencyHook: "Mapped to Competitor Intelligence",
    tags: ["Batch Audit", "Competitor Comparison", "GEO"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: "schema-generator",
    href: "/tools/schema-generator",
    badge: "Live",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    title: "AI & GEO Schema Markup Generator",
    description:
      "Create JSON-LD structured data for Organization, FAQPage, WebApp, and Services to boost ChatGPT, Gemini, and Google visibility.",
    agencyHook: "Mapped to Structured Data",
    tags: ["JSON-LD", "Schema.org", "FAQ Schema"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    id: "bot-directory",
    href: "/tools/bot-directory",
    badge: "Live",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    title: "AI Crawler & Bot Directory",
    description:
      "Searchable database of 26+ AI crawlers, search engines, and scrapers. Lookup exact User-Agents, operators, and reverse DNS hosts.",
    agencyHook: "Mapped to Crawler Research",
    tags: ["Directory", "User-Agents", "AI Database"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },

  // ── Pillar 4: Design Systems & Developer Tools
  {
    id: "design-tokens",
    href: "/tools/design-tokens",
    badge: "Beta",
    category: "design-system",
    categoryLabel: "Design Systems & Code",
    title: "SaaS Design Token & Theme Generator",
    description:
      "Generate clean, production-ready design tokens, 8pt spacing scales, typography ramps, and Tailwind CSS config objects in seconds.",
    agencyHook: "Mapped to Design Systems & Tokens",
    tags: ["Design Tokens", "Tailwind CSS", "Design Systems", "8pt Grid"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a7 7 0 0 0 0 14 7 7 0 0 0 0-14z" />
      </svg>
    ),
  },
];

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCat = activeCategory === "all" || tool.category === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

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
              Free Product & UX Tools
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="text-gray-400 text-xs">By UI Pirate Agency</span>
          </div>

          <h1 className="heading-hero text-gray-900 mb-4">
            Free tools for <span className="text-[#FF5B04]">SaaS, AI & product teams</span>
          </h1>
          <p className="sub-header max-w-2xl mx-auto">
            Audit, analyze and improve your product UX, conversion architecture, and AI visibility — instant, free, and built by design engineers.
          </p>
        </motion.div>

        {/* Filter Controls & Search */}
        <div className="max-w-5xl mx-auto mb-10 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tool name, audit capability, or tag (e.g. SaaS UX, Pricing, robots.txt, Design Tokens)..."
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
              { id: "all", label: "All Tools", count: tools.length },
              { id: "saas-product", label: "SaaS & Product UX", count: tools.filter((t) => t.category === "saas-product").length },
              { id: "website-conversion", label: "Website & Conversion", count: tools.filter((t) => t.category === "website-conversion").length },
              { id: "ai-geo", label: "AI & GEO Visibility", count: tools.filter((t) => t.category === "ai-geo").length },
              { id: "design-system", label: "Design Systems & Code", count: tools.filter((t) => t.category === "design-system").length },
            ].map((tab) => {
              const active = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as ToolCategory)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-gray-900 text-white shadow-xs"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.label} <span className="opacity-60 text-[10px] ml-1">({tab.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tool cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {filteredTools.map((tool) => {
            const isLive = tool.href !== null;

            const cardContent = (
              <div
                className={`group relative bg-white border rounded-2xl p-6 h-full flex flex-col justify-between transition-all duration-200 ${
                  isLive
                    ? "border-gray-200 hover:border-[#FF5B04]/40 hover:shadow-lg cursor-pointer"
                    : "border-gray-100 opacity-60 cursor-default"
                }`}
              >
                <div>
                  {/* Category & Badge Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                        isLive ? "bg-[#FF5B04]/8 text-[#FF5B04] group-hover:bg-[#FF5B04]/15" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {tool.icon}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-semibold font-jetbrains-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          tool.badge === "Popular"
                            ? "text-[#FF5B04] bg-[#FF5B04]/8 border-[#FF5B04]/30"
                            : tool.badge === "In Development"
                            ? "text-amber-700 bg-amber-50 border-amber-200"
                            : tool.badge === "Beta"
                            ? "text-blue-700 bg-blue-50 border-blue-200"
                            : "text-emerald-700 bg-emerald-50 border-emerald-200"
                        }`}
                      >
                        {tool.badge}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-[15px] font-bold text-gray-900 group-hover:text-[#FF5B04] transition-colors font-jakarta mb-2 leading-snug">
                    {tool.title}
                  </h2>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {tool.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 rounded-md px-2 py-0.5 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA row */}
                  {isLive && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-gray-400 font-medium">Free Instant Tool</span>
                      <span className="flex items-center gap-1 text-xs font-bold text-[#FF5B04] group-hover:gap-1.5 transition-all">
                        Launch Tool
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );

            return isLive ? (
              <Link key={tool.id} href={tool.href!} className="h-full block">
                {cardContent}
              </Link>
            ) : (
              <div key={tool.id} className="h-full">
                {cardContent}
              </div>
            );
          })}
        </div>

        {/* Agency Bridge Banner */}
        <div className="max-w-5xl mx-auto mt-16 bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04] bg-[#FF5B04]/8 px-2.5 py-1 rounded-full border border-[#FF5B04]/20">
              Need a Custom Redesign?
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
