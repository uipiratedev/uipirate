import type { Metadata } from "next";
import UpcomingToolLandingPage, { UpcomingToolSpec } from "@/components/UpcomingToolLandingPage";

export const metadata: Metadata = {
  title: "Smooth Corner & Border-Radius Scale Generator | UI Pirate",
  description:
    "Generate mathematical border-radius tokens and iOS-style continuous corner squircle curves for modern web UI.",
  alternates: {
    canonical: "https://uipirate.com/tools/design/border-radius-generator",
  },
};

const spec: UpcomingToolSpec = {
  id: "border-radius-generator",
  category: "design-system",
  categoryLabel: "Design Systems & Code",
  badgeText: "Upcoming Tool · CSS Utility",
  title: "Smooth Corner & Border-Radius Scale Generator",
  subtitle:
    "Generate nested radius scales where outer container curves harmoniously wrap inner children without awkward border pinching.",
  agencyService: "Frontend Engineering & Design Systems",
  agencyLink: "/contact",
  keyMetrics: [
    { name: "Nested Radius Formula", desc: "Calculates inner radius = outer radius - container padding." },
    { name: "Radius Token Scale (none–full)", desc: "Outputs tokens for badges, inputs, cards, and dialogs." },
    { name: "Tailwind CSS Config Output", desc: "Exports custom borderRadius theme object." },
  ],
  howItWorks: [
    { step: "01. Base Radius", title: "Select Geometry Style", desc: "Choose between sharp, modern rounded, or playful pills." },
    { step: "02. Nested Math", title: "Calculate Insets", desc: "Ensures nested inner elements fit seamlessly." },
    { step: "03. Code Export", title: "Copy Tailwind", desc: "Copy radius tokens for your CSS/Tailwind system." },
  ],
  faqs: [
    { q: "What is concentric border radius?", a: "Concentric radius ensures that a card's inner element radius perfectly matches the outer border curve minus padding." },
  ],
};

export default function BorderRadiusGeneratorPage() {
  return <UpcomingToolLandingPage spec={spec} />;
}
