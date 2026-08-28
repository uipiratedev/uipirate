import type { Metadata } from "next";
import UpcomingToolLandingPage, { UpcomingToolSpec } from "@/components/UpcomingToolLandingPage";

export const metadata: Metadata = {
  title: "CSS to Tailwind CSS Class Converter | UI Pirate",
  description:
    "Convert raw CSS rules and styles into clean, idiomatic Tailwind CSS utility classes instantly.",
  alternates: {
    canonical: "https://uipirate.com/tools/design/css-to-tailwind-converter",
  },
};

const spec: UpcomingToolSpec = {
  id: "css-to-tailwind-converter",
  category: "design-system",
  categoryLabel: "Design Systems & Code",
  badgeText: "Upcoming Tool · Developer Utility",
  title: "Raw CSS to Tailwind CSS Utility Converter",
  subtitle:
    "Paste any CSS block, style attribute, or stylesheet rules and convert them into clean, optimized Tailwind utility classes.",
  agencyService: "Frontend Architecture & Code Migration",
  agencyLink: "/contact",
  keyMetrics: [
    { name: "Full CSS Property Coverage", desc: "Converts flexbox, grid, typography, colors, borders, and transforms." },
    { name: "Arbitrary Value Syntax Support", desc: "Falls back to custom values like w-[342px] when outside standard scales." },
    { name: "JSX / HTML className Output", desc: "Outputs ready-to-paste JSX className strings." },
  ],
  howItWorks: [
    { step: "01. Paste CSS", title: "Input Style Rules", desc: "Paste standard CSS declaration blocks." },
    { step: "02. AST Tokenizer", title: "Map to Tailwind", desc: "Matches properties to closest Tailwind utility equivalents." },
    { step: "03. Copy Output", title: "Copy Utility Classes", desc: "Paste directly into React/Next.js components." },
  ],
  faqs: [
    { q: "How does it handle unsupported CSS properties?", a: "It uses Tailwind's arbitrary value syntax or inline CSS variables." },
  ],
};

export default function CssToTailwindConverterPage() {
  return <UpcomingToolLandingPage spec={spec} />;
}
