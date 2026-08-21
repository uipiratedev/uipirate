import type { Metadata } from "next";
import UpcomingToolLandingPage, { UpcomingToolSpec } from "@/components/UpcomingToolLandingPage";

export const metadata: Metadata = {
  title: "SaaS Marketing Website UX Audit Tool | UI Pirate",
  description:
    "Comprehensive UX and conversion audit built specifically for B2B and SaaS marketing websites. Analyze feature grids, pricing hooks, and demo CTAs.",
  alternates: {
    canonical: "https://uipirate.com/tools/website/saas-website-audit",
  },
};

const spec: UpcomingToolSpec = {
  id: "saas-website-audit",
  category: "website-conversion",
  categoryLabel: "Website & Conversion",
  badgeText: "Upcoming Tool · High Intent",
  title: "SaaS Marketing Website Comprehensive UX Audit",
  subtitle:
    "Audit B2B & SaaS marketing sites for product preview clarity, interactive demo discovery, enterprise social proof, and pipeline conversion.",
  agencyService: "Landing Pages & Business Websites",
  agencyLink: "/contact",
  keyMetrics: [
    { name: "Product Feature Visualization", desc: "Checks for interactive screenshots vs static mockups." },
    { name: "Self-Serve vs Sales Demo Path", desc: "Audits dual-CTA funnel routing for self-serve vs enterprise." },
    { name: "Security & Trust Compliance", desc: "Checks SOC2, GDPR, and enterprise trust center visibility." },
    { name: "Comparison Page Architecture", desc: "Evaluates 'vs competitor' SEO landing pages." },
  ],
  howItWorks: [
    { step: "01. Marketing Funnel Crawl", title: "Full Site Evaluation", desc: "Scans homepage, pricing, features, and blog lead traps." },
    { step: "02. SaaS Conversion Matrix", title: "B2B UX Scoring", desc: "Scores funnel against top-tier YC and venture-backed SaaS websites." },
    { step: "03. Redesign Priority List", title: "Pipeline Optimization", desc: "Actionable roadmap to double demo and trial signups." },
  ],
  faqs: [
    { q: "What makes a SaaS marketing site unique?", a: "SaaS websites must balance both technical buyers and executive decision makers with progressive disclosure." },
  ],
};

export default function SaasWebsiteAuditPage() {
  return <UpcomingToolLandingPage spec={spec} />;
}
