"use client";

import Link from "next/link";

export interface SuggestedToolItem {
  id: string;
  href: string;
  title: string;
  category: "saas-product" | "website-conversion" | "ai-geo" | "design-system";
  categoryLabel: string;
  description: string;
  ctaLabel: string;
  badge?: "Live" | "Popular" | "Preview Available" | "Coming Soon";
  icon: React.ReactNode;
}

export const ALL_TOOLS_REGISTRY: SuggestedToolItem[] = [
  // ── 1. AI & GEO Visibility (Nested under /tools/ai/*)
  {
    id: "ai-bot-checker",
    href: "/tools/ai/ai-bot-checker",
    title: "AI Crawler & GEO Readiness Hub",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    badge: "Popular",
    ctaLabel: "Run GEO Scan",
    description: "Instant 0–100 GEO Visibility Score across 26+ AI bots and Cloudflare WAF.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    id: "llms-txt-generator",
    href: "/tools/ai/llms-txt-generator",
    title: "llms.txt & Context Generator",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    badge: "Live",
    ctaLabel: "Generate llms.txt",
    description: "Generate standard llms.txt & llms-full.txt files for AI search engine context.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    id: "robots-txt-generator",
    href: "/tools/ai/robots-txt-generator",
    title: "AI robots.txt Generator",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    badge: "Live",
    ctaLabel: "Build robots.txt",
    description: "Configure robots.txt to allow AI citation bots or block training scrapers.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "robots-txt-validator",
    href: "/tools/ai/robots-txt-validator",
    title: "robots.txt Validator & Linter",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    badge: "Live",
    ctaLabel: "Lint & Validate",
    description: "Test robots.txt syntax against RFC 9309 and prevent accidental bot blocks.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path d="M9 12l2 2 4-4" />
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: "batch-checker",
    href: "/tools/ai/batch-checker",
    title: "Batch AI Crawler Auditor",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    badge: "Live",
    ctaLabel: "Audit 10 Sites",
    description: "Audit up to 10 competitor or client domains simultaneously.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
      </svg>
    ),
  },
  {
    id: "schema-generator",
    href: "/tools/ai/schema-generator",
    title: "AI & GEO Schema Generator",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    badge: "Live",
    ctaLabel: "Build Schema",
    description: "Build JSON-LD structured data for Organization, FAQPage, and WebApps.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
      </svg>
    ),
  },
  {
    id: "bot-directory",
    href: "/tools/ai/bot-directory",
    title: "AI Crawler & Bot Directory",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    badge: "Live",
    ctaLabel: "Explore Bots",
    description: "Database of 26+ AI crawlers, User-Agents, and reverse DNS hosts.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },

  // ── 2. Website & Conversion (Nested under /tools/website/*)
  {
    id: "landing-page-analyzer",
    href: "/tools/website/landing-page-analyzer",
    title: "Landing Page & Conversion Analyzer",
    category: "website-conversion",
    categoryLabel: "Website & Conversion",
    badge: "Preview Available",
    ctaLabel: "Try Interactive Preview",
    description: "Score above-the-fold clarity, CTA prominence, and trust signal density.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: "website-ux-audit",
    href: "/tools/website/website-ux-audit",
    title: "Website UX & Friction Audit",
    category: "website-conversion",
    categoryLabel: "Website & Conversion",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Audit hierarchy, CTA clarity, mobile UX, and conversion friction.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
      </svg>
    ),
  },
  {
    id: "cta-analyzer",
    href: "/tools/website/cta-analyzer",
    title: "CTA & Conversion Button Analyzer",
    category: "website-conversion",
    categoryLabel: "Website & Conversion",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Audit button contrast, action verbs, and viewport positioning.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <rect x="3" y="8" width="18" height="8" rx="4" />
      </svg>
    ),
  },
  {
    id: "website-readability-checker",
    href: "/tools/website/website-readability-checker",
    title: "Website Readability & Clarity Checker",
    category: "website-conversion",
    categoryLabel: "Website & Conversion",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Analyze reading grade, jargon density, and cognitive load.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      </svg>
    ),
  },
  {
    id: "homepage-seo-checker",
    href: "/tools/website/homepage-seo-checker",
    title: "Homepage SEO & Conversion Checker",
    category: "website-conversion",
    categoryLabel: "Website & Conversion",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Audit heading hierarchy, OpenGraph social cards, and top-of-funnel flow.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },

  // ── 3. SaaS & Product UX (Nested under /tools/saas/*)
  {
    id: "saas-ux-audit",
    href: "/tools/saas/saas-ux-audit",
    title: "SaaS UX & Friction Audit",
    category: "saas-product",
    categoryLabel: "SaaS & Product UX",
    badge: "Preview Available",
    ctaLabel: "Try Interactive Preview",
    description: "0–100 Product Experience Score across onboarding, IA, and navigation.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
      </svg>
    ),
  },
  {
    id: "pricing-page-analyzer",
    href: "/tools/saas/pricing-page-analyzer",
    title: "SaaS Pricing Page Analyzer",
    category: "saas-product",
    categoryLabel: "SaaS & Product UX",
    badge: "Preview Available",
    ctaLabel: "Try Interactive Preview",
    description: "Audit tier differentiation, annual toggle psychology, and objection handling.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    id: "dashboard-analyzer",
    href: "/tools/saas/dashboard-analyzer",
    title: "Enterprise Dashboard UX Analyzer",
    category: "saas-product",
    categoryLabel: "SaaS & Product UX",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Audit information density, KPI prominence, and table usability.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
  },
  {
    id: "saas-onboarding-analyzer",
    href: "/tools/saas/saas-onboarding-analyzer",
    title: "SaaS Onboarding & Activation Analyzer",
    category: "saas-product",
    categoryLabel: "SaaS & Product UX",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Measure signup friction, time-to-first-value, and user activation.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <polyline points="9 11 12 14 22 4" />
      </svg>
    ),
  },

  // ── 4. Design Systems & Code (Nested under /tools/design/*)
  {
    id: "design-tokens",
    href: "/tools/design/design-tokens",
    title: "SaaS Design Token Generator",
    category: "design-system",
    categoryLabel: "Design Systems & Code",
    badge: "Preview Available",
    ctaLabel: "Try Interactive Preview",
    description: "Generate 8pt spacing scales, typography ramps, and Tailwind tokens.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    id: "contrast-checker",
    href: "/tools/design/contrast-checker",
    title: "WCAG Contrast & Accessibility Checker",
    category: "design-system",
    categoryLabel: "Design Systems & Code",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Check color combinations against WCAG 2.1 AA/AAA and APCA contrast.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    id: "8pt-grid-calculator",
    href: "/tools/design/8pt-grid-calculator",
    title: "8pt Grid & Spacing Scale Calculator",
    category: "design-system",
    categoryLabel: "Design Systems & Code",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Calculate 8pt/4pt spatial scales and Figma variable token exports.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "typography-scale-generator",
    href: "/tools/design/typography-scale-generator",
    title: "Modular Typography Scale Generator",
    category: "design-system",
    categoryLabel: "Design Systems & Code",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Generate mathematical typographic ramps and CSS clamp() fluid type.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <polyline points="4 7 4 4 20 4 20 7" />
      </svg>
    ),
  },
];

interface SuggestedToolsProps {
  currentToolId: string;
  category?: "saas-product" | "website-conversion" | "ai-geo" | "design-system";
}

export default function SuggestedTools({ currentToolId, category }: SuggestedToolsProps) {
  const currentTool = ALL_TOOLS_REGISTRY.find((t) => t.id === currentToolId);
  const targetCategory = category || currentTool?.category || "ai-geo";

  // 1. Related tools in the same category
  const sameCategoryTools = ALL_TOOLS_REGISTRY.filter(
    (t) => t.category === targetCategory && t.id !== currentToolId
  ).slice(0, 2);

  // 2. Recommended tools from other categories
  const otherCategoryTools = ALL_TOOLS_REGISTRY.filter(
    (t) => t.category !== targetCategory && t.id !== currentToolId
  ).slice(0, 2);

  return (
    <section className="mt-24 pt-14 border-t border-gray-200 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
            UI Pirate Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-1">
            Suggested Tools for Your Stack
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Explore related utilities in this workflow or discover cross-category tools.
          </p>
        </div>
        <Link
          href="/tools"
          className="text-xs font-bold text-[#FF5B04] hover:underline flex items-center gap-1 self-start sm:self-auto flex-shrink-0"
        >
          View All Tools →
        </Link>
      </div>

      {/* Row 1: Related in Same Category */}
      {sameCategoryTools.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#FF5B04]" />
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-jetbrains-mono">
              Related in {sameCategoryTools[0].categoryLabel}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sameCategoryTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="group bg-white border border-gray-200 hover:border-[#FF5B04]/40 hover:shadow-lg rounded-2xl p-5 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FF5B04]/8 text-[#FF5B04] group-hover:bg-[#FF5B04]/15 flex items-center justify-center transition-colors">
                      {tool.icon}
                    </div>
                    {tool.badge && (
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                          tool.badge === "Popular"
                            ? "text-[#FF5B04] bg-[#FF5B04]/8 border-[#FF5B04]/30"
                            : tool.badge === "Preview Available"
                            ? "text-amber-700 bg-amber-50 border-amber-200"
                            : tool.badge === "Coming Soon"
                            ? "text-blue-700 bg-blue-50 border-blue-200"
                            : "text-emerald-700 bg-emerald-50 border-emerald-200"
                        }`}
                      >
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#FF5B04] transition-colors font-jakarta mb-1">
                    {tool.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{tool.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-mono">{tool.categoryLabel}</span>
                  <span className="text-xs font-bold text-[#FF5B04] group-hover:translate-x-0.5 transition-transform">
                    {tool.ctaLabel} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Row 2: Recommended from Other Categories */}
      {otherCategoryTools.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-jetbrains-mono">
              Recommended from Other Categories
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherCategoryTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="group bg-white border border-gray-200 hover:border-[#FF5B04]/40 hover:shadow-lg rounded-2xl p-5 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-[#FF5B04]/10 group-hover:text-[#FF5B04] flex items-center justify-center transition-colors">
                      {tool.icon}
                    </div>
                    {tool.badge && (
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                          tool.badge === "Popular"
                            ? "text-[#FF5B04] bg-[#FF5B04]/8 border-[#FF5B04]/30"
                            : tool.badge === "Preview Available"
                            ? "text-amber-700 bg-amber-50 border-amber-200"
                            : tool.badge === "Coming Soon"
                            ? "text-blue-700 bg-blue-50 border-blue-200"
                            : "text-emerald-700 bg-emerald-50 border-emerald-200"
                        }`}
                      >
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#FF5B04] transition-colors font-jakarta mb-1">
                    {tool.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{tool.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-mono">{tool.categoryLabel}</span>
                  <span className="text-xs font-bold text-[#FF5B04] group-hover:translate-x-0.5 transition-transform">
                    {tool.ctaLabel} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
