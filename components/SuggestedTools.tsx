"use client";

import Link from "next/link";

export interface SuggestedToolItem {
  id: string;
  href: string;
  title: string;
  category: "saas-product" | "website-conversion" | "ai-geo" | "design-system";
  categoryLabel: string;
  description: string;
  badge?: "Live" | "Popular" | "In Development" | "Beta";
  icon: React.ReactNode;
}

export const ALL_TOOLS_REGISTRY: SuggestedToolItem[] = [
  // ── SaaS & Product UX
  {
    id: "saas-ux-audit",
    href: "/tools/saas-ux-audit",
    title: "SaaS UX & Friction Audit",
    category: "saas-product",
    categoryLabel: "SaaS & Product UX",
    badge: "In Development",
    description: "0–100 Product Experience Score across onboarding, IA, and navigation.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: "pricing-page-analyzer",
    href: "/tools/pricing-page-analyzer",
    title: "SaaS Pricing Page Analyzer",
    category: "saas-product",
    categoryLabel: "SaaS & Product UX",
    badge: "In Development",
    description: "Audit tier differentiation, annual toggle psychology, and objection handling.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
        <line x1="12" y1="10" x2="12" y2="20" />
      </svg>
    ),
  },

  // ── Website & Conversion
  {
    id: "landing-page-analyzer",
    href: "/tools/landing-page-analyzer",
    title: "Landing Page & Conversion Analyzer",
    category: "website-conversion",
    categoryLabel: "Website & Conversion",
    badge: "In Development",
    description: "Score above-the-fold clarity, CTA prominence, and trust signal density.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },

  // ── AI & GEO Visibility
  {
    id: "ai-bot-checker",
    href: "/tools/ai-bot-checker",
    title: "AI Crawler & GEO Readiness Hub",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    badge: "Popular",
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
    href: "/tools/llms-txt-generator",
    title: "llms.txt & Context Generator",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    badge: "Live",
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
    href: "/tools/robots-txt-generator",
    title: "AI robots.txt Generator",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    badge: "Live",
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
    href: "/tools/robots-txt-validator",
    title: "robots.txt Validator & Linter",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    badge: "Live",
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
    href: "/tools/batch-checker",
    title: "Batch AI Crawler Auditor",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    badge: "Live",
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
    href: "/tools/schema-generator",
    title: "AI & GEO Schema Generator",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    badge: "Live",
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
    href: "/tools/bot-directory",
    title: "AI Crawler & Bot Directory",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    badge: "Live",
    description: "Database of 26+ AI crawlers, User-Agents, and reverse DNS hosts.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },

  // ── Design Systems & Code
  {
    id: "design-tokens",
    href: "/tools/design-tokens",
    title: "SaaS Design Token Generator",
    category: "design-system",
    categoryLabel: "Design Systems & Code",
    badge: "Beta",
    description: "Generate 8pt spacing scales, typography ramps, and Tailwind tokens.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a7 7 0 0 0 0 14 7 7 0 0 0 0-14z" />
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
          View All 10 Tools →
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
                            : tool.badge === "In Development"
                            ? "text-amber-700 bg-amber-50 border-amber-200"
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
                    Launch Tool →
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
                            : tool.badge === "In Development"
                            ? "text-amber-700 bg-amber-50 border-amber-200"
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
                    Launch Tool →
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
