import type { Metadata } from "next";
import UpcomingToolLandingPage, { UpcomingToolSpec } from "@/components/UpcomingToolLandingPage";

export const metadata: Metadata = {
  title: "8pt Grid & Figma Auto-Layout Spacing Calculator | UI Pirate",
  description:
    "Calculate consistent 8pt/4pt spatial multiples, Figma auto-layout padding, component insets, and standardized layer naming specs.",
  alternates: {
    canonical: "https://uipirate.com/tools/design/figma-spacing-calculator",
  },
};

const spec: UpcomingToolSpec = {
  id: "figma-spacing-calculator",
  category: "design-system",
  categoryLabel: "Design Systems & Code",
  badgeText: "Upcoming Tool · Spatial & Grid Engine",
  title: "8pt Grid & Figma Auto-Layout Spacing Calculator",
  subtitle:
    "Standardize Figma auto-layout padding, 8pt/4pt spatial increments, nested container insets, and BEM/variant component naming conventions.",
  agencyService: "Design Systems & Figma Architecture",
  agencyLink: "/contact",
  keyMetrics: [
    { name: "8pt & 4pt Spatial Multiple Scales", desc: "Calculates mathematical spacing ramps (4px to 128px) for cohesive vertical cadence." },
    { name: "Auto-Layout Padding & Insets", desc: "Calculates proportional vertical and horizontal button, card, and modal insets." },
    { name: "Figma Component & Layer Naming Specs", desc: "Generates standardized variant properties (Type=Primary, State=Hover, Size=L)." },
    { name: "Figma Variables & Tokens Studio Export", desc: "Outputs importable JSON token collections for Figma local variables." },
  ],
  howItWorks: [
    { step: "01. Spatial Density Setting", title: "Select Compact or Spacious", desc: "Choose baseline spatial increment (4pt, 8pt, or fluid)." },
    { step: "02. Auto-Layout Formula", title: "Calculate Insets & Gaps", desc: "Produces proportional button, card, and grid spacing tokens." },
    { step: "03. Figma Variable Sync", title: "Export JSON & Tokens", desc: "Import directly into Figma local variables and Tailwind CSS config." },
  ],
  faqs: [
    { q: "Why use an 8pt grid for digital UI?", a: "The 8pt grid aligns with standard screen pixel densities and creates natural visual rhythm across typography, padding, and layout blocks." },
    { q: "How does nested container math prevent misalignment?", a: "It calculates inner container padding and child radius so nested elements fit flush with zero optical distortion." },
  ],
};

export default function FigmaSpacingCalculatorPage() {
  return <UpcomingToolLandingPage spec={spec} />;
}
