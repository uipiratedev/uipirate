"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ALL_TOOLS_REGISTRY } from "@/components/SuggestedTools";

export interface CategoryHubProps {
  categoryId: "website-conversion" | "saas-product" | "design-system" | "ai-geo";
  badgeText: string;
  title: string;
  subtitle: string;
  agencyService: string;
  agencyDescription: string;
  faqs: { q: string; a: string }[];
  methodology: { step: string; title: string; desc: string }[];
}

export const CATEGORY_METADATA = {
  "ai-geo": {
    path: "/tools/ai",
    name: "AI & GEO Visibility Tools",
    shortName: "AI & GEO Visibility",
    description: "Inspect AI crawler accessibility, build llms.txt knowledge graphs, and optimize for ChatGPT & Perplexity.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
        <path d="M9 12h.01" />
        <path d="M15 12h.01" />
        <path d="M9 16a6 6 0 0 0 6 0" />
        <path d="M12 2v2" />
      </svg>
    ),
  },
  "website-conversion": {
    path: "/tools/website",
    name: "Website & Conversion Tools",
    shortName: "Website & Conversion",
    description: "Audit visual hierarchy, CTA clarity, copy readability, and conversion friction.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1" />
        <path d="M12 7a5 5 0 1 0 5 5" />
        <path d="M13 3.055a9 9 0 1 0 7.941 7.945" />
        <path d="M15 6v3h3" />
        <path d="M15 9l6-6" />
      </svg>
    ),
  },
  "saas-product": {
    path: "/tools/saas",
    name: "SaaS & Product Design Tools",
    shortName: "SaaS & Product UX",
    description: "Score onboarding friction, dashboard complexity, information architecture, and pricing psychology.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M7 20h10" />
        <path d="M9 16v4" />
        <path d="M15 16v4" />
        <path d="M8 12l3-3l2 2l3-3" />
      </svg>
    ),
  },
  "design-system": {
    path: "/tools/design",
    name: "Design Systems & Code Tools",
    shortName: "Design Systems & Code",
    description: "Generate Tailwind design tokens, 8pt spacing scales, typography ramps, and WCAG contrast checks.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21a9 9 0 0 1 0-18c4.97 0 9 3.582 9 8c0 1.06-.474 2.078-1.318 2.828c-.844.75-1.989 1.172-3.182 1.172h-2.5a2 2 0 0 0-1 3.732v.268a2 2 0 0 1-1 2z" />
        <circle cx="7.5" cy="10.5" r="1" />
        <circle cx="12" cy="7.5" r="1" />
        <circle cx="16.5" cy="10.5" r="1" />
      </svg>
    ),
  },
};

export default function ToolCategoryHub({
  categoryId,
  badgeText,
  title,
  subtitle,
  agencyService,
  agencyDescription,
  faqs,
  methodology,
}: CategoryHubProps) {
  // Get all tools in this category
  const categoryTools = ALL_TOOLS_REGISTRY.filter((t) => t.category === categoryId);

  // Other categories for cross-navigation
  const otherCategories = Object.entries(CATEGORY_METADATA).filter(([id]) => id !== categoryId);
  const currentCategoryMeta = CATEGORY_METADATA[categoryId];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "url": `https://uipirate.com${currentCategoryMeta.path}`,
    "description": subtitle,
    "hasPart": categoryTools.map((tool) => ({
      "@type": "WebApplication",
      "name": tool.title,
      "url": `https://uipirate.com${tool.href}`,
      "description": tool.description,
    })),
  };

  const faqSchema =
    faqs && faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map((f) => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.a,
            },
          })),
        }
      : null;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 pt-28 pb-20">
        {/* Category Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
            <span className="text-[#FF5B04] text-xs font-semibold font-jetbrains-mono uppercase tracking-wider">
              {badgeText}
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <Link href="/tools" className="text-gray-400 text-xs hover:text-gray-900 transition-colors">
              UI Pirate Tools Hub
            </Link>
          </div>

          <h1 className="heading-hero text-gray-900 mb-4">{title}</h1>
          <p className="sub-header max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Tools Grid */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B04]" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-jetbrains-mono">
                Tools in this Suite ({categoryTools.length})
              </h2>
            </div>
            <span className="text-xs text-gray-400 font-mono">100% Free · No Sign-up Required</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categoryTools.map((tool) => (
              <Link key={tool.id} href={tool.href} className="h-full block">
                <div className="group bg-white border border-gray-200 hover:border-[#FF5B04]/40 hover:shadow-lg rounded-2xl p-6 h-full flex flex-col justify-between transition-all duration-200">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-[#FF5B04]/8 text-[#FF5B04] group-hover:bg-[#FF5B04]/15 flex items-center justify-center flex-shrink-0 transition-colors">
                        {tool.icon}
                      </div>
                      {tool.badge && (
                        <span
                          className={`text-[10px] font-semibold font-jetbrains-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            tool.badge === "Popular"
                              ? "text-[#FF5B04] bg-[#FF5B04]/8 border-[#FF5B04]/30"
                              : tool.badge === "Live"
                              ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                              : tool.badge === "Preview Available"
                              ? "text-amber-700 bg-amber-50 border-amber-200"
                              : "text-blue-700 bg-blue-50 border-blue-200"
                          }`}
                        >
                          {tool.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-[#FF5B04] transition-colors font-jakarta mb-2 leading-snug">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{tool.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 font-mono">{tool.categoryLabel}</span>
                    <span className="text-xs font-bold text-[#FF5B04] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      {tool.ctaLabel}
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Methodology Breakdown */}
        <div className="max-w-5xl mx-auto mb-20 bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl mb-8">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
              UI Pirate Agency Standards
            </span>
            <h2 className="text-2xl font-bold text-gray-900 font-jakarta mt-1">
              How We Evaluate & Engineer This Layer
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {methodology.map((m, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-[#FF5B04] block mb-2">{m.step}</span>
                  <h3 className="text-sm font-bold text-gray-900 font-jakarta mb-2">{m.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agency Service Bridge */}
        <div className="max-w-5xl mx-auto mb-20 bg-gradient-to-br from-gray-900 to-black text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04] bg-white/10 px-3 py-1 rounded-full border border-white/10">
              Agency Service: {agencyService}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-jakarta mt-4">
              Turn diagnostic findings into market-leading products.
            </h3>
            <p className="text-xs text-gray-300 mt-2 leading-relaxed">{agencyDescription}</p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-4 rounded-2xl bg-[#FF5B04] hover:bg-[#E54F00] text-white text-xs font-bold transition-all shadow-lg shadow-[#FF5B04]/30 whitespace-nowrap flex-shrink-0"
          >
            Book a Strategy Call →
          </Link>
        </div>

        {/* FAQs */}
        <div className="max-w-5xl mx-auto mb-20 bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="mb-8">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl font-bold text-gray-900 font-jakarta mt-1">
              Deep Technical & UX Insights
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <h3 className="text-xs font-bold text-gray-900 mb-1.5 font-jakarta">{faq.q}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-Category Discovery */}
        <div className="max-w-5xl mx-auto pt-10 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04]">
                Explore Other Suites
              </span>
              <h3 className="text-xl font-bold text-gray-900 font-jakarta mt-0.5">
                Explore the UI Pirate Tool Pillars
              </h3>
            </div>
            <Link href="/tools" className="text-xs font-bold text-[#FF5B04] hover:underline">
              View Main Hub →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {otherCategories.map(([key, cat]) => (
              <Link
                key={key}
                href={cat.path}
                className="group bg-white border border-gray-200 hover:border-[#FF5B04]/40 hover:shadow-md rounded-2xl p-5 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-[#FF5B04]/8 text-[#FF5B04] flex items-center justify-center mb-3 group-hover:bg-[#FF5B04]/15 transition-colors">
                    {cat.icon}
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#FF5B04] transition-colors font-jakarta mb-1">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{cat.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#FF5B04]">
                  <span>Explore Suite</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
