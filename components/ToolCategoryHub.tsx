"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ALL_TOOLS_REGISTRY, ToolCategory } from "@/components/SuggestedTools";
import GlassBadge from "@/components/GlassBadge";

export interface CategoryHubProps {
  categoryId: ToolCategory;
  badgeText: string;
  title: string;
  subtitle: string;
  agencyService: string;
  agencyDescription: string;
  faqs: { q: string; a: string }[];
  methodology: { step: string; title: string; desc: string }[];
  introParagraphs?: string[];
}

export const CATEGORY_METADATA: Record<
  ToolCategory,
  {
    path: string;
    name: string;
    shortName: string;
    description: string;
    icon: React.ReactNode;
  }
> = {
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
  title,
  subtitle,
  badgeText,
  agencyService,
  agencyDescription,
  methodology,
  faqs,
  introParagraphs,
}: CategoryHubProps) {
  const categoryTools = useMemo(
    () => ALL_TOOLS_REGISTRY.filter((t) => t.category === categoryId),
    [categoryId]
  );

  const otherCategories = useMemo(
    () =>
      Object.entries(CATEGORY_METADATA).filter(
        ([id]) => id !== categoryId
      ) as [ToolCategory, (typeof CATEGORY_METADATA)[ToolCategory]][],
    [categoryId]
  );

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${title} | UI Pirate Tools`,
    "description": subtitle,
    "url": `https://uipirate.com${CATEGORY_METADATA[categoryId].path}`,
    "publisher": {
      "@type": "Organization",
      "name": "UI Pirate",
      "url": "https://uipirate.com",
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": categoryTools.map((tool, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": tool.title,
        "description": tool.description,
        "url": `https://uipirate.com${tool.href}`,
      })),
    },
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
      <div className="container mx-auto px-32 lg:px-20 max-md:px-4 pt-32 pb-20 relative z-10">
        {/* Category Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center w-full max-w-5xl mx-auto mb-14"
        >
          <div className="mb-6 flex flex-row items-center justify-center">
            <GlassBadge variant="gradient">{badgeText}</GlassBadge>
          </div>

          <h1 className="text-[38px] sm:text-[50px] md:text-[62px] lg:text-[72px] text-center font-[800] tracking-[-1.5px] leading-[1.08] text-gray-900 mb-5">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto font-normal leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Intro Copy */}
        {introParagraphs && introParagraphs.length > 0 && (
          <div className="w-full max-w-3xl mx-auto mb-16 space-y-4">
            {introParagraphs.map((para, idx) => (
              <p key={idx} className="text-sm text-gray-600 leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        )}

        {/* Tools Grid */}
        <div className="w-full mb-20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B04]" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-jetbrains-mono">
                Tools in this Suite ({categoryTools.length})
              </h2>
            </div>
            <span className="text-xs text-gray-400 font-mono">100% Free · No Sign-up Required</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryTools.map((tool) => (
              <Link key={tool.id} href={tool.href} className="h-full block">
                <div className="group bg-white border border-[#E5E7EB] hover:border-[#FF5B04]/50 rounded-[24px] p-7 h-full flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition-all duration-300">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FF5B04]/8 text-[#FF5B04] group-hover:bg-[#FF5B04] group-hover:text-white flex items-center justify-center flex-shrink-0 transition-all duration-300 [&>svg]:w-6 [&>svg]:h-6">
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

                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#FF5B04] transition-colors font-jakarta mb-2 leading-snug">
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
        <div className="w-full mb-20 bg-white border border-[#E5E7EB] rounded-[32px] p-8 sm:p-12 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
          <div className="max-w-2xl mb-8">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04] bg-[#FF5B04]/8 px-3 py-1 rounded-full border border-[#FF5B04]/20">
              UI Pirate Agency Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-3">
              How We Evaluate & Engineer This Layer
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {methodology.map((m, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-gray-50/80 border border-gray-100 flex flex-col justify-between">
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
        <div className="w-full mb-20 bg-gradient-to-br from-gray-900 to-black text-white rounded-[32px] p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
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
            className="px-7 py-4 rounded-2xl bg-[#FF5B04] hover:bg-[#E54F00] text-white text-sm font-bold transition-all shadow-lg shadow-[#FF5B04]/30 whitespace-nowrap flex-shrink-0"
          >
            Book a Strategy Call →
          </Link>
        </div>

        {/* FAQs */}
        {faqs && faqs.length > 0 && (
          <div className="w-full mb-20">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5B04] bg-[#FF5B04]/8 px-3 py-1 rounded-full border border-[#FF5B04]/20">
                Pillar Intelligence
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-jakarta mt-3">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-2xs">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 font-jakarta">{faq.q}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Categories Cross-Navigation */}
        <div className="w-full pt-10 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-jetbrains-mono">
              Explore Other Agency Pillars
            </h3>
            <Link href="/tools" className="text-xs text-[#FF5B04] hover:underline font-bold">
              View All 28 Tools →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {otherCategories.map(([id, cat]) => (
              <Link
                key={id}
                href={cat.path}
                className="group bg-white border border-[#E5E7EB] hover:border-[#FF5B04]/40 rounded-2xl p-5 transition-all shadow-2xs hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-gray-100 group-hover:bg-[#FF5B04]/10 group-hover:text-[#FF5B04] flex items-center justify-center text-gray-600 transition-colors">
                    {cat.icon}
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#FF5B04] font-jakarta">
                    {cat.shortName}
                  </h4>
                </div>
                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
