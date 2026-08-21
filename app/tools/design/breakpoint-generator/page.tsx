import type { Metadata } from "next";
import UpcomingToolLandingPage, { UpcomingToolSpec } from "@/components/UpcomingToolLandingPage";

export const metadata: Metadata = {
  title: "Responsive Breakpoint, Container Query & Aspect Ratio Calculator | UI Pirate",
  description:
    "Generate responsive media queries, CSS @container query tokens, aspect-ratio dimensional bounds, and CLS-prevention rules.",
  alternates: {
    canonical: "https://uipirate.com/tools/design/breakpoint-generator",
  },
};

const spec: UpcomingToolSpec = {
  id: "breakpoint-generator",
  category: "design-system",
  categoryLabel: "Design Systems & Code",
  badgeText: "Upcoming Tool · Responsive Engine",
  title: "Responsive Breakpoint, Container Query & Aspect Ratio Calculator",
  subtitle:
    "Configure synchronized media query breakpoints (sm, md, lg, xl, 2xl), modern CSS @container query tokens, and aspect-ratio dimensions to eliminate Cumulative Layout Shift (CLS).",
  agencyService: "Responsive Web Engineering & Design Systems",
  agencyLink: "/contact",
  keyMetrics: [
    { name: "Screen Breakpoints (Mobile/Tablet/Desktop/Ultrawide)", desc: "Synchronizes 390px, 768px, 1024px, 1440px, and 1920px viewports." },
    { name: "CSS @container Query Tokens", desc: "Generates component-level container queries that adapt to column width." },
    { name: "Aspect-Ratio & CLS Prevention Math", desc: "Calculates precise width/height dimensions for Next.js Image and CSS containers." },
    { name: "Tailwind screens & CSS Output", desc: "Exports ready-to-paste tailwind.config.js and CSS media rules." },
  ],
  howItWorks: [
    { step: "01. Device & Grid Profile", title: "Select Viewports", desc: "Define responsive screen thresholds and column constraints." },
    { step: "02. Container Math", title: "Calculate Breakpoints & Ratios", desc: "Computes component boundary rules and proportional aspect ratios." },
    { step: "03. Code Export", title: "Copy Tailwind & CSS", desc: "Copy drop-in theme configuration for your Next.js project." },
  ],
  faqs: [
    { q: "Why combine media queries with container queries?", a: "Media queries respond to the entire browser window, while container queries allow individual components (e.g. cards in a sidebar) to adapt to their parent container width." },
    { q: "How does setting aspect ratio eliminate Cumulative Layout Shift?", a: "Setting CSS aspect-ratio reserves the exact container space before image bytes download, preventing unwanted page jumps." },
  ],
};

export default function BreakpointGeneratorPage() {
  return <UpcomingToolLandingPage spec={spec} />;
}
