"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export type ToolCategory = "all" | "website-conversion" | "saas-product" | "design-system" | "ai-geo";

interface ToolItem {
  id: string;
  href: string;
  status: "live" | "preview" | "upcoming";
  badge: "Live" | "Popular" | "Preview Available" | "Coming Soon";
  category: ToolCategory;
  categoryLabel: string;
  title: string;
  description: string;
  ctaLabel: string;
  agencyHook: string;
  tags: string[];
  icon: React.ReactNode;
}

const tools: ToolItem[] = [
  // ─────────────────────────────────────────────────────────────
  // 1. LIVE: AI & GEO Visibility Toolkit (7 Live Tools)
  // ─────────────────────────────────────────────────────────────
  {
    id: "ai-bot-checker",
    href: "/tools/ai/ai-bot-checker",
    status: "live",
    badge: "Popular",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    title: "AI Crawler & GEO Readiness Hub",
    description:
      "Paste any website URL and get an instant 0–100 GEO Visibility Score across 26+ AI bots (GPTBot, ClaudeBot, Perplexity) and Cloudflare WAF.",
    ctaLabel: "Scan Your Website Now",
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
    href: "/tools/ai/llms-txt-generator",
    status: "live",
    badge: "Live",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    title: "llms.txt & Knowledge Generator",
    description:
      "Generate standard llms.txt and deep llms-full.txt files. Provide structured company knowledge directly to AI crawlers and LLM search agents.",
    ctaLabel: "Generate llms.txt File",
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
    href: "/tools/ai/robots-txt-generator",
    status: "live",
    badge: "Live",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    title: "AI robots.txt Generator",
    description:
      "Build a custom robots.txt file for your site. Choose which AI bots, search engines, and scrapers to allow or block with 1-click strategy presets.",
    ctaLabel: "Build Custom robots.txt",
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
    href: "/tools/ai/robots-txt-validator",
    status: "live",
    badge: "Live",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    title: "robots.txt Validator & Linter",
    description:
      "Test and validate any robots.txt syntax against RFC 9309. Catch blocking errors, unknown directives, and accidental AI crawler bans.",
    ctaLabel: "Validate robots.txt Syntax",
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
    href: "/tools/ai/batch-checker",
    status: "live",
    badge: "Live",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    title: "Batch AI Crawler & GEO Score Auditor",
    description:
      "Audit up to 10 competitor or client domains simultaneously. Compare GEO scores and crawler permissions side-by-side.",
    ctaLabel: "Audit 10 Competitors",
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
    href: "/tools/ai/schema-generator",
    status: "live",
    badge: "Live",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    title: "AI & GEO Schema Markup Generator",
    description:
      "Create JSON-LD structured data for Organization, FAQPage, WebApp, and Services to boost ChatGPT, Gemini, and Google visibility.",
    ctaLabel: "Generate JSON-LD Markup",
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
    href: "/tools/ai/bot-directory",
    status: "live",
    badge: "Live",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    title: "AI Crawler & Bot Directory",
    description:
      "Searchable database of 26+ AI crawlers, search engines, and scrapers. Lookup exact User-Agents, operators, and reverse DNS hosts.",
    ctaLabel: "Search Bot Database",
    agencyHook: "Mapped to Crawler Research",
    tags: ["Directory", "User-Agents", "AI Database"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },

  // ─────────────────────────────────────────────────────────────
  // 2. WEBSITE & CONVERSION TOOLS (Nested under /tools/website/*)
  // ─────────────────────────────────────────────────────────────
  {
    id: "landing-page-analyzer",
    href: "/tools/website/landing-page-analyzer",
    status: "preview",
    badge: "Preview Available",
    category: "website-conversion",
    categoryLabel: "Website & Conversion",
    title: "Landing Page UX & Conversion Analyzer",
    description:
      "Inspect any landing page URL. Score your above-the-fold value proposition, CTA visibility, social proof trust signals, and cognitive friction.",
    ctaLabel: "Try Interactive Preview",
    agencyHook: "Mapped to Landing Pages & Websites",
    tags: ["Landing Page", "Conversion Rate", "CTA Clarity", "Trust Signals"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: "website-ux-audit",
    href: "/tools/website/website-ux-audit",
    status: "upcoming",
    badge: "Coming Soon",
    category: "website-conversion",
    categoryLabel: "Website & Conversion",
    title: "Website UX & Friction Audit",
    description:
      "Full website visual hierarchy, CTA clarity, mobile UX, accessibility, and content structure friction scoring engine.",
    ctaLabel: "View Roadmap & Specs",
    agencyHook: "Mapped to Landing Pages & CRO",
    tags: ["Website Audit", "UX Score", "Friction", "Mobile UX"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: "cta-analyzer",
    href: "/tools/website/cta-analyzer",
    status: "upcoming",
    badge: "Coming Soon",
    category: "website-conversion",
    categoryLabel: "Website & Conversion",
    title: "CTA & Conversion Button Analyzer",
    description:
      "Audit button contrast, action verbs, viewport prominence, eye-tracking attention, and microcopy risk reducers.",
    ctaLabel: "View Roadmap & Specs",
    agencyHook: "Mapped to Conversion Optimization",
    tags: ["CTA Audit", "Button UX", "Conversion"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <rect x="3" y="8" width="18" height="8" rx="4" />
        <path d="M12 8v8" />
      </svg>
    ),
  },
  {
    id: "website-readability-checker",
    href: "/tools/website/website-readability-checker",
    status: "upcoming",
    badge: "Coming Soon",
    category: "website-conversion",
    categoryLabel: "Website & Conversion",
    title: "Website Readability & Clarity Checker",
    description:
      "Analyze copy reading grade, jargon density, and cognitive load to ensure your value proposition converts.",
    ctaLabel: "View Roadmap & Specs",
    agencyHook: "Mapped to Copywriting & Messaging",
    tags: ["Readability", "Flesch-Kincaid", "Copy Clarity"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    id: "homepage-seo-checker",
    href: "/tools/website/homepage-seo-checker",
    status: "upcoming",
    badge: "Coming Soon",
    category: "website-conversion",
    categoryLabel: "Website & Conversion",
    title: "Homepage SEO & Conversion Checker",
    description:
      "Audit heading hierarchy, OpenGraph social card previews, speed signals, and top-of-funnel conversion flow.",
    ctaLabel: "View Roadmap & Specs",
    agencyHook: "Mapped to SEO & Technical Architecture",
    tags: ["Homepage SEO", "Social Cards", "Funnel"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },

  // ─────────────────────────────────────────────────────────────
  // 3. SAAS & PRODUCT DESIGN TOOLS (Nested under /tools/saas/*)
  // ─────────────────────────────────────────────────────────────
  {
    id: "saas-ux-audit",
    href: "/tools/saas/saas-ux-audit",
    status: "preview",
    badge: "Preview Available",
    category: "saas-product",
    categoryLabel: "SaaS & Product Design",
    title: "SaaS Product UX & Friction Audit",
    description:
      "Audit your SaaS web app or dashboard URL. Get a 0–100 Product Experience Score across onboarding, IA, navigation depth, and CTA clarity.",
    ctaLabel: "Try Interactive Preview",
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
    href: "/tools/saas/pricing-page-analyzer",
    status: "preview",
    badge: "Preview Available",
    category: "saas-product",
    categoryLabel: "SaaS & Product Design",
    title: "SaaS Pricing Page & Conversion Analyzer",
    description:
      "Analyze your SaaS pricing table. Audit tier differentiation, annual discount nudges, feature comparisons, and pricing psychology friction.",
    ctaLabel: "Try Interactive Preview",
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
  {
    id: "dashboard-analyzer",
    href: "/tools/saas/dashboard-analyzer",
    status: "upcoming",
    badge: "Coming Soon",
    category: "saas-product",
    categoryLabel: "SaaS & Product Design",
    title: "Enterprise Dashboard UX Analyzer",
    description:
      "Audit complex SaaS dashboards for information density, KPI prominence, table usability, filtering, and empty states.",
    ctaLabel: "View Roadmap & Specs",
    agencyHook: "Mapped to Enterprise Products",
    tags: ["Dashboard UX", "Information Density", "Tables"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    id: "saas-onboarding-analyzer",
    href: "/tools/saas/saas-onboarding-analyzer",
    status: "upcoming",
    badge: "Coming Soon",
    category: "saas-product",
    categoryLabel: "SaaS & Product Design",
    title: "SaaS Onboarding & Activation Analyzer",
    description:
      "Measure signup friction, time-to-first-value (TTV), progressive disclosure, and user activation milestones.",
    ctaLabel: "View Roadmap & Specs",
    agencyHook: "Mapped to User Activation & Retention",
    tags: ["Onboarding", "Activation", "Time-to-Value"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },

  // ─────────────────────────────────────────────────────────────
  // 4. DESIGN SYSTEMS & CODE (Nested under /tools/design/*)
  // ─────────────────────────────────────────────────────────────
  {
    id: "design-tokens",
    href: "/tools/design/design-tokens",
    status: "preview",
    badge: "Preview Available",
    category: "design-system",
    categoryLabel: "Design Systems & Code",
    title: "SaaS Design Token & Theme Generator",
    description:
      "Generate clean, production-ready design tokens, 8pt spacing scales, typography ramps, and Tailwind CSS config objects in seconds.",
    ctaLabel: "Try Interactive Preview",
    agencyHook: "Mapped to Design Systems & Tokens",
    tags: ["Design Tokens", "Tailwind CSS", "Design Systems", "8pt Grid"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a7 7 0 0 0 0 14 7 7 0 0 0 0-14z" />
      </svg>
    ),
  },
  {
    id: "contrast-checker",
    href: "/tools/design/contrast-checker",
    status: "upcoming",
    badge: "Coming Soon",
    category: "design-system",
    categoryLabel: "Design Systems & Code",
    title: "WCAG Color Contrast & APCA Checker",
    description:
      "Check color combinations against WCAG 2.1 AA/AAA ratios and modern APCA perceptual lightness algorithms.",
    ctaLabel: "View Roadmap & Specs",
    agencyHook: "Mapped to Accessibility & Compliance",
    tags: ["Accessibility", "WCAG", "Contrast Ratio"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 18a6 6 0 0 0 0-12v12z" />
      </svg>
    ),
  },
  {
    id: "8pt-grid-calculator",
    href: "/tools/design/8pt-grid-calculator",
    status: "upcoming",
    badge: "Coming Soon",
    category: "design-system",
    categoryLabel: "Design Systems & Code",
    title: "8pt Grid & Figma Spacing Calculator",
    description:
      "Calculate 8pt/4pt spatial scales, component height tokens, and Figma variable token JSON exports.",
    ctaLabel: "View Roadmap & Specs",
    agencyHook: "Mapped to UI Layout Architecture",
    tags: ["8pt Grid", "Figma Spacing", "Layout System"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "typography-scale-generator",
    href: "/tools/design/typography-scale-generator",
    status: "upcoming",
    badge: "Coming Soon",
    category: "design-system",
    categoryLabel: "Design Systems & Code",
    title: "Modular Typography Scale Generator",
    description:
      "Generate mathematical typographic ramps, line-height ratios, and CSS clamp() fluid type rules.",
    ctaLabel: "View Roadmap & Specs",
    agencyHook: "Mapped to Design Systems & Type",
    tags: ["Typography", "Type Scale", "Fluid clamp()"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <line x1="12" y1="4" x2="12" y2="20" />
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

  const liveTools = useMemo(() => filteredTools.filter((t) => t.status === "live"), [filteredTools]);
  const previewTools = useMemo(() => filteredTools.filter((t) => t.status === "preview"), [filteredTools]);
  const upcomingTools = useMemo(() => filteredTools.filter((t) => t.status === "upcoming"), [filteredTools]);

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
              placeholder="Search across all 16 tools, categories, or tags (e.g. AI bot, SaaS UX, Pricing, Onboarding, Typography, robots.txt)..."
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
              { id: "ai-geo", label: "AI & GEO Visibility", badge: "7 Live", count: tools.filter((t) => t.category === "ai-geo").length },
              { id: "website-conversion", label: "Website & Conversion", badge: "5 Tools", count: tools.filter((t) => t.category === "website-conversion").length },
              { id: "saas-product", label: "SaaS & Product UX", badge: "4 Tools", count: tools.filter((t) => t.category === "saas-product").length },
              { id: "design-system", label: "Design Systems & Code", badge: "4 Tools", count: tools.filter((t) => t.category === "design-system").length },
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
                count: "7 Live Tools",
                badge: "Live Suite",
                badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
                desc: "Audit AI crawlers, generate llms.txt & optimize for ChatGPT & Perplexity.",
              },
              {
                title: "Website & Conversion",
                path: "/tools/website",
                count: "5 Diagnostic Tools",
                badge: "Commercial CRO",
                badgeColor: "text-blue-700 bg-blue-50 border-blue-200",
                desc: "Score above-the-fold clarity, CTA contrast & copy readability.",
              },
              {
                title: "SaaS & Product UX",
                path: "/tools/saas",
                count: "4 Deep Engines",
                badge: "Core Expertise",
                badgeColor: "text-purple-700 bg-purple-50 border-purple-200",
                desc: "Audit dashboard density, onboarding drop-offs & pricing psychology.",
              },
              {
                title: "Design Systems & Code",
                path: "/tools/design",
                count: "4 Spatial Tools",
                badge: "Foundations",
                badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
                desc: "Generate Tailwind tokens, 8pt spacing scales & WCAG contrast ratios.",
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

                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
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

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-emerald-700 font-medium font-mono">100% Free · Live</span>
                        <span className="flex items-center gap-1 text-xs font-bold text-[#FF5B04] group-hover:gap-1.5 transition-all">
                          {tool.ctaLabel} →
                        </span>
                      </div>
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

                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
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

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-amber-700 font-medium font-mono">v1 Preview Active</span>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-700 group-hover:gap-1.5 transition-all">
                          {tool.ctaLabel} →
                        </span>
                      </div>
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
                          {tool.badge}
                        </span>
                      </div>

                      <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-blue-700 transition-colors font-jakarta mb-2 leading-snug">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
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

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-blue-700 font-medium font-mono">In Calibration</span>
                        <span className="flex items-center gap-1 text-xs font-bold text-blue-700 group-hover:gap-1.5 transition-all">
                          {tool.ctaLabel} →
                        </span>
                      </div>
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
