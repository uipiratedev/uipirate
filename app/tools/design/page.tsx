import type { Metadata } from "next";
import ToolCategoryHub from "@/components/ToolCategoryHub";

export const metadata: Metadata = {
  title: "Design Systems & Developer Tools Suite | UI Pirate",
  description:
    "Free SaaS design token generators, 8pt spacing calculators, modular typography ramps, and WCAG contrast checkers for Figma and Tailwind CSS.",
  alternates: {
    canonical: "https://uipirate.com/tools/design",
  },
};

export default function DesignToolsHubPage() {
  return (
    <ToolCategoryHub
      categoryId="design-system"
      badgeText="Pillar 3 · Code & Foundations"
      title="Design Systems & Front-End Engineering Tools"
      subtitle="Generate pixel-perfect 8pt spatial scales, modular typography ramps, Tailwind config tokens, and WCAG accessibility standards."
      agencyService="Design Systems & Frontend Architecture"
      agencyDescription="We engineer scalable multi-brand design systems in Figma and code tokens with full Tailwind CSS, React, and Angular component libraries."
      methodology={[
        {
          step: "01. Atomic Token Scale",
          title: "Platform-Agnostic Variables",
          desc: "We define unified semantic color, typography, spacing, and radius variables consumable by both Figma and code.",
        },
        {
          step: "02. Mathematical Consistency",
          title: "8-Point Layout Rhythm",
          desc: "Eliminate arbitrary visual decisions by standardizing margins, paddings, and component heights on an 8pt baseline grid.",
        },
        {
          step: "03. Accessibility Compliance",
          title: "WCAG 2.1 AA & APCA Standards",
          desc: "We test contrast ratios and perceptual lightness across dark and light modes to ensure enterprise-grade accessibility.",
        },
      ]}
      faqs={[
        {
          q: "How do design tokens speed up frontend engineering?",
          a: "Tokens synchronize design decisions between Figma and code repositories, preventing visual drift and eliminating tedious CSS rewriting.",
        },
        {
          q: "Are the outputs compatible with Tailwind CSS v3 and v4?",
          a: "Yes. All tokens export ready-to-use JavaScript configuration objects and CSS Custom Properties.",
        },
      ]}
    />
  );
}
