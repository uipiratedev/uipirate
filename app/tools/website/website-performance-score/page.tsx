import type { Metadata } from "next";
import UpcomingToolLandingPage, { UpcomingToolSpec } from "@/components/UpcomingToolLandingPage";

export const metadata: Metadata = {
  title: "Website Performance & UX Score Checker | UI Pirate",
  description:
    "Audit Core Web Vitals, speed bottlenecks, Cumulative Layout Shift (CLS), and human UX responsiveness in one unified report.",
  alternates: {
    canonical: "https://uipirate.com/tools/website/website-performance-score",
  },
};

const spec: UpcomingToolSpec = {
  id: "website-performance-score",
  category: "website-conversion",
  categoryLabel: "Website & Conversion",
  badgeText: "Upcoming Tool · Performance",
  title: "Website Performance & UX Experience Score",
  subtitle:
    "Combine Google Core Web Vitals (LCP, INP, CLS) with human UX perception metrics to eliminate conversion-killing speed bottlenecks.",
  agencyService: "Technical Web Architecture & Next.js",
  agencyLink: "/contact",
  keyMetrics: [
    { name: "Largest Contentful Paint (LCP)", desc: "Measures when the main content block is visible." },
    { name: "Interaction to Next Paint (INP)", desc: "Scores UI responsiveness during user taps and clicks." },
    { name: "Cumulative Layout Shift (CLS)", desc: "Flags visual instability that causes accidental clicks." },
    { name: "Asset & Font Payload", desc: "Audits uncompressed imagery and render-blocking scripts." },
  ],
  howItWorks: [
    { step: "01. Synthetic Test Run", title: "Real-Device Emulation", desc: "Runs mobile & desktop network throttling tests." },
    { step: "02. Core Web Vitals Scan", title: "Chrome UX Metric Audit", desc: "Extracts field and lab performance data." },
    { step: "03. Engineering Blueprint", title: "Next.js & Asset Fixes", desc: "Prescriptive code optimizations for sub-second speeds." },
  ],
  faqs: [
    { q: "Why does site speed affect conversion rate?", a: "Every 100ms delay in website load time drops conversion rates by roughly 7%." },
  ],
};

export default function WebsitePerformanceScorePage() {
  return <UpcomingToolLandingPage spec={spec} />;
}
