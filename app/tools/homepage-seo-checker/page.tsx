import type { Metadata } from "next";
import UpcomingToolLandingPage, { UpcomingToolSpec } from "@/components/UpcomingToolLandingPage";

export const metadata: Metadata = {
  title: "Homepage SEO & Conversion Checker | UI Pirate",
  description:
    "Audit your SaaS homepage for technical SEO, heading hierarchy, meta descriptions, Open Graph cards, and conversion architecture.",
  alternates: {
    canonical: "https://uipirate.com/tools/homepage-seo-checker",
  },
};

const spec: UpcomingToolSpec = {
  id: "homepage-seo-checker",
  category: "website-conversion",
  categoryLabel: "Website & Conversion",
  badgeText: "Upcoming Tool · In Development",
  title: "Homepage SEO & Conversion Architecture Checker",
  subtitle:
    "Audit your homepage's technical SEO tags, heading hierarchy, OpenGraph social cards, speed signals, and top-of-funnel conversion flow.",
  agencyService: "Technical SEO & Web Architecture",
  agencyLink: "/contact",
  keyMetrics: [
    {
      name: "H1 / H2 Semantic Structure",
      desc: "Checks for single H1 presence, logical outline hierarchy, and keyword integration.",
    },
    {
      name: "Meta Title & Description Impact",
      desc: "Evaluates snippet length, click-through appeal, and brand keyword positioning for SERP listings.",
    },
    {
      name: "Open Graph & Social Share Preview",
      desc: "Simulates Twitter/X, LinkedIn, and Slack link previews to ensure high-engagement visual cards.",
    },
    {
      name: "Core Web Vitals & Image Optimization",
      desc: "Flags unoptimized hero images, layout shifts (CLS), and render-blocking scripts.",
    },
    {
      name: "Internal Funnel Architecture",
      desc: "Audits footer navigation, pricing links, and secondary page crawl accessibility.",
    },
  ],
  howItWorks: [
    {
      step: "01. Tag & Header Inspection",
      title: "Metadata Scraping",
      desc: "Parses <head> elements, canonical links, robots meta directives, and structured schemas.",
    },
    {
      step: "02. Social Card Generator",
      title: "Live Preview Rendering",
      desc: "Renders exactly how your homepage displays when shared across LinkedIn, Twitter, and iMessage.",
    },
    {
      step: "03. SEO Action Plan",
      title: "Comprehensive Audit",
      desc: "Delivers step-by-step code snippets to fix title truncation, missing tags, and crawl bottlenecks.",
    },
  ],
  faqs: [
    {
      q: "Does homepage SEO directly impact conversion rate?",
      a: "Yes. Compelling meta descriptions and social cards attract higher-intent visitors who convert 3x faster than general unfocused traffic.",
    },
    {
      q: "Why should every page only have one H1 tag?",
      a: "A single H1 tag establishes unambiguous semantic hierarchy for both search crawlers and screen readers.",
    },
  ],
};

export default function HomepageSeoCheckerPage() {
  return <UpcomingToolLandingPage spec={spec} />;
}
