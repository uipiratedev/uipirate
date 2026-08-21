import type { Metadata } from "next";
import UpcomingToolLandingPage, { UpcomingToolSpec } from "@/components/UpcomingToolLandingPage";

export const metadata: Metadata = {
  title: "8pt Grid & Spacing Scale Calculator | UI Pirate",
  description:
    "Generate mathematical 8-point spatial scales, component padding tokens, and layout grids for Figma and Tailwind CSS. Built by UI Pirate.",
  alternates: {
    canonical: "https://uipirate.com/tools/8pt-grid-calculator",
  },
};

const spec: UpcomingToolSpec = {
  id: "8pt-grid-calculator",
  category: "design-system",
  categoryLabel: "Design Systems & Code",
  badgeText: "Upcoming Tool · In Development",
  title: "8pt Grid & Spatial System Calculator",
  subtitle:
    "Calculate consistent 8-point and 4-point spacing ramps, layout columns, and component height tokens for Figma and Tailwind CSS.",
  agencyService: "Design Systems & UI Engineering",
  agencyLink: "/contact",
  keyMetrics: [
    {
      name: "8pt Hard & Soft Grid Units",
      desc: "Calculates mathematical multiples (4px, 8px, 16px, 24px, 32px, 48px, 64px) for harmonious spatial rhythm.",
    },
    {
      name: "Component Height Standards",
      desc: "Aligns buttons (40px/48px), inputs, and table row heights to baseline 8pt increments.",
    },
    {
      name: "Figma Variable Token Sync",
      desc: "Exports JSON variable collections compatible with Figma Tokens Studio and native local variables.",
    },
    {
      name: "Tailwind Spacing Scale Output",
      desc: "Produces custom spacing tokens configured for tailwind.config.js.",
    },
  ],
  howItWorks: [
    {
      step: "01. Base Unit Selection",
      title: "4pt / 8pt Scale Base",
      desc: "Choose your design system baseline unit and spatial density preference.",
    },
    {
      step: "02. Layout Rhythm Mapping",
      title: "Spacing & Inset Scale",
      desc: "Generates proportional values for stack padding, inline spacing, and layout gutters.",
    },
    {
      step: "03. Code & Design Export",
      title: "Tokens & Configs",
      desc: "Copy Tailwind spacing objects or download JSON design token files.",
    },
  ],
  faqs: [
    {
      q: "Why do product designers use the 8pt grid system?",
      a: "8 is easily divisible by 2 and 4, works cleanly across all common screen resolutions and pixel densities (@2x, @3x), and eliminates arbitrary spacing decisions.",
    },
  ],
};

export default function EightPtGridCalculatorPage() {
  return <UpcomingToolLandingPage spec={spec} />;
}
