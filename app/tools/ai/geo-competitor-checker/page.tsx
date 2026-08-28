import type { Metadata } from "next";
import UpcomingToolLandingPage, { UpcomingToolSpec } from "@/components/UpcomingToolLandingPage";

export const metadata: Metadata = {
  title: "GEO Competitor & AI Search Benchmark Checker | UI Pirate",
  description:
    "Compare your brand's AI search visibility, crawler permissions, schema markup, and llms.txt adoption directly against top competitors.",
  alternates: {
    canonical: "https://uipirate.com/tools/ai/geo-competitor-checker",
  },
};

const spec: UpcomingToolSpec = {
  id: "geo-competitor-checker",
  category: "ai-geo",
  categoryLabel: "AI & GEO Visibility",
  badgeText: "Upcoming Tool · Competitive GEO",
  title: "GEO Competitor & AI Search Benchmark Checker",
  subtitle:
    "Audit your website alongside up to 5 competitors to compare AI visibility scores, crawler firewall rules, and structured schema graphs.",
  agencyService: "Generative Engine Optimization (GEO) & Competitive Strategy",
  agencyLink: "/contact",
  keyMetrics: [
    { name: "Side-by-Side GEO Visibility Score", desc: "Compares overall AI readiness across 26+ crawlers." },
    { name: "llms.txt Adoption Benchmark", desc: "Checks which competitors provide dedicated markdown context." },
    { name: "Schema.org Entity Graph Depth", desc: "Evaluates competitor structured markup richness." },
  ],
  howItWorks: [
    { step: "01. Input Competitor Domains", title: "Add Target URLs", desc: "Enter your domain and up to 5 competitor websites." },
    { step: "02. Parallel Crawl & Audit", title: "Automated Benchmarks", desc: "Inspects headers, robots.txt, and schema in parallel." },
    { step: "03. Competitive Gap Analysis", title: "Actionable Roadmap", desc: "Reveals competitive advantages to outrank competitors in AI search." },
  ],
  faqs: [
    { q: "Why compare GEO readiness against competitors?", a: "AI engines often recommend only 1 or 2 top solutions for buyer queries. Outperforming competitors in technical GEO ensures your brand is chosen." },
  ],
};

export default function GeoCompetitorCheckerPage() {
  return <UpcomingToolLandingPage spec={spec} />;
}
