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
  // ─────────────────────────────────────────────────────────────
  // 1. SaaS & Product UX (Core Agency Expertise — 4 Engines)
  // ─────────────────────────────────────────────────────────────
  {
    id: "saas-ux-audit",
    href: "/tools/saas/saas-ux-audit",
    title: "SaaS UX & Friction Audit",
    category: "saas-product",
    categoryLabel: "SaaS & Product UX",
    badge: "Preview Available",
    ctaLabel: "Try Interactive Preview",
    description: "0–100 Product Experience Score across onboarding, IA, visual hierarchy, and navigation.",
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
  {
    id: "pricing-page-analyzer",
    href: "/tools/saas/pricing-page-analyzer",
    title: "SaaS Pricing Page & Psychology Analyzer",
    category: "saas-product",
    categoryLabel: "SaaS & Product UX",
    badge: "Preview Available",
    ctaLabel: "Try Interactive Preview",
    description: "Audit tier differentiation, annual toggle psychology, feature comparison, and objection handling.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2z" />
        <path d="M14 11h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" />
        <path d="M12 9v1m0 8v1" />
        <path d="M5 9h-2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
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
    description: "Audit information density, KPI prominence, table usability, and multi-role action discovery.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
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
    description: "Measure signup friction, progressive disclosure, empty states, and time-to-first-value.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3-5a9 9 0 0 0 6-8a3 3 0 0 0-3-3a9 9 0 0 0-8 6a6 6 0 0 0-5 3" />
        <path d="M7 14a6 6 0 0 0-3 6a6 6 0 0 0 6-3" />
        <circle cx="15" cy="9" r="1" />
      </svg>
    ),
  },

  // ─────────────────────────────────────────────────────────────
  // 2. Website & Conversion Tools (Commercial Value — 6 Engines)
  // ─────────────────────────────────────────────────────────────
  {
    id: "landing-page-analyzer",
    href: "/tools/website/landing-page-analyzer",
    title: "Landing Page UX & Conversion Analyzer",
    category: "website-conversion",
    categoryLabel: "Website & Conversion",
    badge: "Preview Available",
    ctaLabel: "Try Interactive Preview",
    description: "Score headline clarity, CTA prominence, trust signals, and conversion probability in 1 scan.",
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
  {
    id: "saas-website-audit",
    href: "/tools/website/saas-website-audit",
    title: "SaaS Marketing Website UX Audit",
    category: "website-conversion",
    categoryLabel: "Website & Conversion",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Audit B2B feature grids, self-serve vs demo funnels, and enterprise compliance badges.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M4 8h16" />
        <path d="M8 4v4" />
        <path d="M9.5 14.5l1.5 1.5l3.5-3.5" />
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
    description: "Audit button visual contrast, action verb psychology, and above-the-fold placement.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 13v-8.5a1.5 1.5 0 0 1 3 0v7.5" />
        <path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0v2.5" />
        <path d="M14 10.5a1.5 1.5 0 0 1 3 0v1.5" />
        <path d="M17 11.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-2h.208a6 6 0 0 1-5.012-2.7l-.196-.3c-.312-.479-1.407-2.388-3.286-5.728a1.5 1.5 0 0 1 .536-2.022a1.867 1.867 0 0 1 2.28.28l1.47 1.47" />
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
    description: "Analyze Flesch-Kincaid reading grade, jargon density, and cognitive processing load.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 4v16h-12a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2h12z" />
        <path d="M19 16h-12a2 2 0 0 0-2 2" />
        <path d="M9 8h6" />
      </svg>
    ),
  },
  {
    id: "homepage-seo-checker",
    href: "/tools/website/homepage-seo-checker",
    title: "Homepage SEO & Metadata Checker",
    category: "website-conversion",
    categoryLabel: "Website & Conversion",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Audit heading hierarchy (H1-H3), OpenGraph cards, meta descriptions, and search snippets.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 0-9 9" />
        <path d="M3.6 9h16.8" />
        <path d="M3.6 15h7.9" />
        <path d="M11.5 3a17 17 0 0 0 0 18" />
        <circle cx="18" cy="18" r="3" />
        <path d="M20.2 20.2l1.8 1.8" />
      </svg>
    ),
  },
  {
    id: "website-performance-score",
    href: "/tools/website/website-performance-score",
    title: "Website Performance & UX Experience Score",
    category: "website-conversion",
    categoryLabel: "Website & Conversion",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Combine Core Web Vitals (LCP, INP, CLS) with perceived human UX speed benchmarks.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 3l0 7l6 0l-8 11l0-7l-6 0z" />
      </svg>
    ),
  },

  // ─────────────────────────────────────────────────────────────
  // 3. Design Systems & Code (Foundations & Code — 10 Tools)
  // ─────────────────────────────────────────────────────────────
  {
    id: "design-tokens",
    href: "/tools/design/design-tokens",
    title: "SaaS Design Token & Theme Studio",
    category: "design-system",
    categoryLabel: "Design Systems & Code",
    badge: "Preview Available",
    ctaLabel: "Try Interactive Preview",
    description: "Generate 8pt spacing scales, typography ramps, and export to Tailwind v3/v4 & Figma JSON.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21a9 9 0 0 1 0-18c4.97 0 9 3.582 9 8c0 1.06-.474 2.078-1.318 2.828c-.844.75-1.989 1.172-3.182 1.172h-2.5a2 2 0 0 0-1 3.732v.268a2 2 0 0 1-1 2z" />
        <circle cx="7.5" cy="10.5" r="1" />
        <circle cx="12" cy="7.5" r="1" />
        <circle cx="16.5" cy="10.5" r="1" />
      </svg>
    ),
  },
  {
    id: "color-palette-generator",
    href: "/tools/design/color-palette-generator",
    title: "Accessible SaaS Color Palette Generator",
    category: "design-system",
    categoryLabel: "Design Systems & Code",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Generate harmonious 10-shade UI color ramps (50–950) with automated WCAG contrast validation.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 0 0 8 0v-12a2 2 0 0 0-2-2zm-1 14a2 2 0 1 1 2-2 2 2 0 0 1-2 2z" />
        <path d="M13 7.35l-2-2a2 2 0 0 0-2.828 0l-2.828 2.828a2 2 0 0 0 0 2.828l9 9" />
      </svg>
    ),
  },
  {
    id: "contrast-checker",
    href: "/tools/design/contrast-checker",
    title: "WCAG & APCA Color Contrast Checker",
    category: "design-system",
    categoryLabel: "Design Systems & Code",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Check text & surface color combinations against WCAG 2.1 AA/AAA and APCA perceptual contrast.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M4 4l16 16" />
      </svg>
    ),
  },
  {
    id: "figma-spacing-calculator",
    href: "/tools/design/figma-spacing-calculator",
    title: "8pt Grid & Figma Spacing Calculator",
    category: "design-system",
    categoryLabel: "Design Systems & Code",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Calculate 8pt/4pt layout scales, auto-layout container padding, and Figma spacing variables.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.875 6.27a2.225 2.225 0 0 1 0 3.148l-9.458 9.458a2.225 2.225 0 0 1-3.148 0l-1-1a2.225 2.225 0 0 1 0-3.148l9.458-9.458a2.225 2.225 0 0 1 3.148 0z" />
        <path d="M9 15l1.5-1.5" />
        <path d="M12 12l1.5-1.5" />
        <path d="M15 9l1.5-1.5" />
      </svg>
    ),
  },
  {
    id: "css-shadow-generator",
    href: "/tools/design/css-shadow-generator",
    title: "Smooth Layered CSS Box-Shadow Generator",
    category: "design-system",
    categoryLabel: "Design Systems & Code",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Create realistic, non-muddy elevation levels (sm to 2xl) using multi-layer key & ambient lighting.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M4 16v-10a2 2 0 0 1 2-2h10" />
      </svg>
    ),
  },
  {
    id: "border-radius-generator",
    href: "/tools/design/border-radius-generator",
    title: "Concentric Border-Radius & Squircle Generator",
    category: "design-system",
    categoryLabel: "Design Systems & Code",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Generate nested radius curves and continuous iOS squircle scales with zero border pinching.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v-4a4 4 0 0 1 4-4h4" />
        <line x1="16" y1="4" x2="16.01" y2="4" />
        <line x1="20" y1="4" x2="20.01" y2="4" />
        <line x1="20" y1="8" x2="20.01" y2="8" />
        <line x1="20" y1="12" x2="20.01" y2="12" />
        <line x1="4" y1="16" x2="4.01" y2="16" />
        <line x1="4" y1="20" x2="4.01" y2="20" />
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
    description: "Generate mathematical typographic ratios (Minor Third, Golden Ratio) and fluid CSS clamp() type.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h3" />
        <path d="M14 20h6" />
        <path d="M6.9 15h6.9" />
        <path d="M10.2 6.3l5.8 13.7" />
        <path d="M5 20l6-16l2 4.5" />
      </svg>
    ),
  },
  {
    id: "css-to-tailwind-converter",
    href: "/tools/design/css-to-tailwind-converter",
    title: "CSS to Tailwind CSS Utility Converter",
    category: "design-system",
    categoryLabel: "Design Systems & Code",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Paste raw CSS declaration blocks and convert them instantly into idiomatic Tailwind classes.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 10h-14l4-4" />
        <path d="M7 14h14l-4 4" />
      </svg>
    ),
  },
  {
    id: "svg-optimizer",
    href: "/tools/design/svg-optimizer",
    title: "Fast SVG Optimizer & React Exporter",
    category: "design-system",
    categoryLabel: "Design Systems & Code",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Compress SVG vector files, strip Figma/Illustrator bloat, and export clean JSX React components.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="4" height="4" rx="1" />
        <rect x="17" y="3" width="4" height="4" rx="1" />
        <rect x="17" y="17" width="4" height="4" rx="1" />
        <rect x="3" y="17" width="4" height="4" rx="1" />
        <line x1="5" y1="7" x2="5" y2="17" />
        <line x1="19" y1="7" x2="19" y2="17" />
        <line x1="7" y1="5" x2="17" y2="5" />
        <line x1="7" y1="19" x2="17" y2="19" />
      </svg>
    ),
  },
  {
    id: "breakpoint-generator",
    href: "/tools/design/breakpoint-generator",
    title: "Responsive Breakpoint & Layout Calculator",
    category: "design-system",
    categoryLabel: "Design Systems & Code",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Generate synchronized media queries, container query tokens, and aspect-ratio dimensions to kill CLS.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="13" y="8" width="8" height="12" rx="1" />
        <path d="M18 15h.01" />
        <path d="M5 4h10a1 1 0 0 1 1 1v2h-11a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },

  // ─────────────────────────────────────────────────────────────
  // 4. AI & GEO Visibility Toolkit (AI Product & Search — 8 Engines)
  // ─────────────────────────────────────────────────────────────
  {
    id: "ai-bot-checker",
    href: "/tools/ai/ai-bot-checker",
    title: "AI Crawler & GEO Readiness Hub",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    badge: "Popular",
    ctaLabel: "Run GEO Scan",
    description: "Instant 0–100 GEO Visibility Score across 26+ AI bots (OpenAI, Perplexity, Gemini) and Cloudflare WAF.",
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
  {
    id: "llms-txt-generator",
    href: "/tools/ai/llms-txt-generator",
    title: "llms.txt & Knowledge Context Generator",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    badge: "Live",
    ctaLabel: "Generate llms.txt",
    description: "Generate and validate standard llms.txt & llms-full.txt files to provide structured context to AI search agents.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 12h4" />
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M17 21h-10a2 2 0 0 1-2-2v-14a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
        <path d="M10 15h2" />
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
    description: "Configure robots.txt to permit AI search citation bots while blocking aggressive data training scrapers.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 8l-4 4l4 4" />
        <path d="M17 8l4 4l-4 4" />
        <path d="M14 4l-4 16" />
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
    description: "Test robots.txt syntax against RFC 9309 standards and prevent accidental search crawler lockouts.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1-8.5 15a12 12 0 0 1-8.5-15a12 12 0 0 0 8.5-3" />
        <path d="M9 12l2 2l4-4" />
      </svg>
    ),
  },
  {
    id: "schema-generator",
    href: "/tools/ai/schema-generator",
    title: "AI & GEO Schema Markup Studio",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    badge: "Live",
    ctaLabel: "Build Schema",
    description: "Build validated JSON-LD structured data for Organization, FAQPage, SaaS WebApps, and Products.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="18" r="3" />
        <path d="M12 9v3m-3.5 2.5l-2.5 1.5m8.5-4l2.5 1.5" />
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
    description: "Audit up to 10 competitor or client domains simultaneously to benchmark AI bot permissions.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 4-8 4-8-4 8-4z" />
        <path d="M4 10l8 4 8-4" />
        <path d="M4 14l8 4 8-4" />
        <path d="M4 18l8 4 8-4" />
      </svg>
    ),
  },
  {
    id: "geo-competitor-checker",
    href: "/tools/ai/geo-competitor-checker",
    title: "GEO Competitor & AI Search Benchmark",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    badge: "Coming Soon",
    ctaLabel: "View Roadmap & Specs",
    description: "Benchmark your domain's AI readiness, schema graph depth, and llms.txt adoption against top competitors.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 3l-6 6" />
        <path d="M15 3h6v6" />
        <path d="M3 21l6-6" />
        <path d="M3 15v6h6" />
        <path d="M15 15l6 6" />
        <path d="M21 15v6h-6" />
        <path d="M3 3l6 6" />
        <path d="M9 3H3v6" />
      </svg>
    ),
  },
  {
    id: "bot-directory",
    href: "/tools/ai/bot-directory",
    title: "AI Crawler Directory & Comparison Matrix",
    category: "ai-geo",
    categoryLabel: "AI & GEO Visibility",
    badge: "Live",
    ctaLabel: "Explore Bots",
    description: "Comprehensive database of 26+ AI crawlers, User-Agents, reverse DNS hosts, and blocking tradeoffs.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="7" />
        <path d="M21 21l-6-6" />
        <path d="M10 7v6" />
        <path d="M7 10h6" />
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
