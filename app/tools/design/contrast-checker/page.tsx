import type { Metadata } from "next";
import UpcomingToolLandingPage, { UpcomingToolSpec } from "@/components/UpcomingToolLandingPage";

export const metadata: Metadata = {
  title: "WCAG Color Contrast & Accessibility Checker | UI Pirate",
  description:
    "Test color pairings against WCAG 2.1 AA/AAA contrast ratios and APCA standards for web and SaaS UI accessibility.",
  alternates: {
    canonical: "https://uipirate.com/tools/design/contrast-checker",
  },
};

const spec: UpcomingToolSpec = {
  id: "contrast-checker",
  category: "design-system",
  categoryLabel: "Design Systems & Code",
  badgeText: "Upcoming Tool · In Development",
  title: "WCAG Color Contrast & APCA Accessibility Checker",
  subtitle:
    "Check foreground and background color combinations against WCAG 2.1 AA/AAA ratios and modern APCA perceptual contrast algorithms.",
  agencyService: "Design Systems & Frontend Architecture",
  agencyLink: "/contact",
  keyMetrics: [
    {
      name: "WCAG 2.1 AA Ratio (4.5:1)",
      desc: "Validates minimum contrast ratio for normal text and interactive form inputs.",
    },
    {
      name: "WCAG 2.1 AAA Ratio (7:1)",
      desc: "Tests enhanced accessibility benchmarks for enterprise compliance and high-legibility UI.",
    },
    {
      name: "APCA Perceptual Lightness (Lc)",
      desc: "Calculates modern context-sensitive contrast based on font weight and spatial frequency.",
    },
    {
      name: "Color Blindness Simulation",
      desc: "Simulates Protanopia, Deuteranopia, and Tritanopia to ensure accessible visual state indicators.",
    },
  ],
  howItWorks: [
    {
      step: "01. Color Input",
      title: "HEX, RGB, or HSL",
      desc: "Input your brand colors or import full Tailwind / Figma color palettes.",
    },
    {
      step: "02. Multi-Standard Verification",
      title: "Real-Time Contrast Math",
      desc: "Calculates standard luminance ratios and perceptual APCA scores simultaneously.",
    },
    {
      step: "03. 1-Click Code Export",
      title: "Accessible Design Tokens",
      desc: "Export validated color combinations directly into Tailwind CSS or CSS Custom Properties.",
    },
  ],
  faqs: [
    {
      q: "What is the difference between WCAG 2.1 and APCA?",
      a: "WCAG 2.1 uses a simple mathematical luminance ratio, whereas APCA accounts for human vision physiology, font sizes, and weight.",
    },
  ],
};

export default function ContrastCheckerNestedPage() {
  return <UpcomingToolLandingPage spec={spec} />;
}
