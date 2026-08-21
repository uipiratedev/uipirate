import type { Metadata } from "next";
import UpcomingToolLandingPage, { UpcomingToolSpec } from "@/components/UpcomingToolLandingPage";

export const metadata: Metadata = {
  title: "Accessible SaaS Color Palette Generator | UI Pirate",
  description:
    "Generate harmonious 10-shade UI color palettes (50–950) with built-in WCAG contrast validation and Tailwind CSS export.",
  alternates: {
    canonical: "https://uipirate.com/tools/design/color-palette-generator",
  },
};

const spec: UpcomingToolSpec = {
  id: "color-palette-generator",
  category: "design-system",
  categoryLabel: "Design Systems & Code",
  badgeText: "Upcoming Tool · Design Utility",
  title: "Accessible SaaS Color Palette Generator",
  subtitle:
    "Generate harmonious 10-shade UI color ramps (50–950) with APCA perceptual lightness and instant Tailwind CSS & Figma token exports.",
  agencyService: "Design Systems & Component Libraries",
  agencyLink: "/contact",
  keyMetrics: [
    { name: "10-Step Shade Generation (50–950)", desc: "Generates tint and shade scales with constant perceptual lightness." },
    { name: "Automatic WCAG Contrast Verification", desc: "Flags which shades meet AA/AAA compliance against white and dark backgrounds." },
    { name: "Semantic Role Mapping", desc: "Maps brand shades to primary, success, warning, and error UI tokens." },
    { name: "Tailwind CSS & CSS Variable Export", desc: "1-click copy for tailwind.config.js and CSS Custom Properties." },
  ],
  howItWorks: [
    { step: "01. Base Color Input", title: "Brand HEX / HSL", desc: "Enter your primary brand color to calculate shades." },
    { step: "02. Scale Tuning", title: "Curve Adjustment", desc: "Fine-tune saturation and lightness progression curves." },
    { step: "03. Multi-Format Export", title: "Copy Code Tokens", desc: "Export to Tailwind, CSS Variables, or Figma Tokens Studio." },
  ],
  faqs: [
    { q: "Why use a 10-shade scale for SaaS UI?", a: "A standardized 50–950 scale ensures predictable contrast for backgrounds, borders, hover states, and active text." },
  ],
};

export default function ColorPaletteGeneratorPage() {
  return <UpcomingToolLandingPage spec={spec} />;
}
