import type { Metadata } from "next";
import UpcomingToolLandingPage, { UpcomingToolSpec } from "@/components/UpcomingToolLandingPage";

export const metadata: Metadata = {
  title: "Website UX & Friction Audit Tool | UI Pirate",
  description:
    "Audit any website URL for visual hierarchy, CTA clarity, mobile UX, accessibility, and conversion friction. Free diagnostic engine by UI Pirate.",
  alternates: {
    canonical: "https://uipirate.com/tools/website-ux-audit",
  },
};

const spec: UpcomingToolSpec = {
  id: "website-ux-audit",
  category: "website-conversion",
  categoryLabel: "Website & Conversion",
  badgeText: "Upcoming Tool · In Development",
  title: "Website UX & Conversion Friction Audit",
  subtitle:
    "Enter any website URL to receive a comprehensive 0–100 UX Experience Score across visual hierarchy, CTA prominence, mobile responsiveness, and cognitive friction.",
  agencyService: "Landing Pages & Business Websites",
  agencyLink: "/contact",
  keyMetrics: [
    {
      name: "Visual Hierarchy & Eye-Path",
      desc: "Scores whether headlines, subtext, and focal points naturally guide visitor attention toward primary goals.",
    },
    {
      name: "CTA Contrast & Action Clarity",
      desc: "Evaluates color contrast, verb strength, and button placement relative to viewport boundaries.",
    },
    {
      name: "Mobile Usability & Touch Targets",
      desc: "Audits thumb-zone ergonomics, tap target sizes (>48px), and mobile navigation responsiveness.",
    },
    {
      name: "Content Structure & Scannability",
      desc: "Measures paragraph length, bullet utilization, and cognitive readability for high-speed skimming.",
    },
    {
      name: "Conversion Friction Points",
      desc: "Flags excessive form fields, confusing navigation menus, and missing social proof cues.",
    },
    {
      name: "WCAG Accessibility Compliance",
      desc: "Tests color contrast ratios, alt tags, and focus states against WCAG 2.1 AA benchmarks.",
    },
  ],
  howItWorks: [
    {
      step: "01. Automated DOM Crawl",
      title: "Full-Page Layout Render",
      desc: "Headless Chromium renders desktop and mobile viewports, capturing visual snapshots and DOM nodes.",
    },
    {
      step: "02. Heuristic UX Scoring",
      title: "UI Pirate Friction Engine",
      desc: "Algorithms benchmark the page against 50+ conversion principles developed across hundreds of agency projects.",
    },
    {
      step: "03. Actionable Teardown Report",
      title: "Prioritized Fix Checklist",
      desc: "Get an executive summary detailing top UX friction points and immediate redesign recommendations.",
    },
  ],
  faqs: [
    {
      q: "How is this different from generic SEO audit tools?",
      a: "Standard SEO tools only look at meta tags and HTML tags. UI Pirate's UX Audit inspects the visual psychology, conversion funnels, cognitive load, and human usability of your interface.",
    },
    {
      q: "Can this audit single-page apps (SPAs)?",
      a: "Yes. The headless render engine executes JavaScript client bundles to accurately score React, Next.js, and Angular applications.",
    },
    {
      q: "When will the automated audit tool launch?",
      a: "The automated engine is in private beta. If you need immediate insights, you can book a 1-on-1 manual teardown with UI Pirate design engineers.",
    },
  ],
};

export default function WebsiteUxAuditPage() {
  return <UpcomingToolLandingPage spec={spec} />;
}
