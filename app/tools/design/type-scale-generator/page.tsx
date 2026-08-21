import type { Metadata } from "next";
import UpcomingToolLandingPage, { UpcomingToolSpec } from "@/components/UpcomingToolLandingPage";

export const metadata: Metadata = {
  title: "Modular Typography Scale & Font Ramp Generator | UI Pirate",
  description:
    "Generate harmonious typography scales, line-height ratios, and CSS clamp() fluid type rules for web and product UI design.",
  alternates: {
    canonical: "https://uipirate.com/tools/design/type-scale-generator",
  },
};

const spec: UpcomingToolSpec = {
  id: "typography-scale-generator",
  category: "design-system",
  categoryLabel: "Design Systems & Code",
  badgeText: "Upcoming Tool · In Development",
  title: "Modular Typography Scale & Font Ramp Generator",
  subtitle:
    "Generate mathematical typographic scales (Minor Third, Major Third, Perfect Fourth) and responsive fluid clamp() font-size rules.",
  agencyService: "Design Systems & Typography Engineering",
  agencyLink: "/contact",
  keyMetrics: [
    {
      name: "Modular Scale Ratio (1.200 – 1.618)",
      desc: "Calculates proportional heading sizes from base 16px text up to display 72px titles.",
    },
    {
      name: "Proportional Line-Height Ramps",
      desc: "Automatically tightens leading for large display titles (1.1) and relaxes body text leading (1.5).",
    },
    {
      name: "CSS clamp() Fluid Typography",
      desc: "Outputs viewport-responsive font sizing without requiring multiple breakpoint media queries.",
    },
    {
      name: "Tailwind Typography Config",
      desc: "Exports custom fontSize tokens ready to paste into tailwind.config.js.",
    },
  ],
  howItWorks: [
    {
      step: "01. Base & Scale Selection",
      title: "Set Scale Ratio",
      desc: "Pick your base font size and choose from classic musical/mathematical scale intervals.",
    },
    {
      step: "02. Visual Preview & Tuning",
      title: "Real-Time Hierarchy Test",
      desc: "Inspect H1 through caption scale in realistic UI mockups and dashboard components.",
    },
    {
      step: "03. Export Token Bundle",
      title: "CSS & Tailwind Ready",
      desc: "Copy CSS custom properties, clamp() rules, or Tailwind theme configs.",
    },
  ],
  faqs: [
    {
      q: "What is modular typography scaling?",
      a: "A modular scale uses a fixed mathematical multiplier to derive harmonious heading sizes instead of picking arbitrary numbers.",
    },
  ],
};

export default function TypeScaleGeneratorAliasPage() {
  return <UpcomingToolLandingPage spec={spec} />;
}
