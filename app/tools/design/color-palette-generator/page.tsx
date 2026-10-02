import type { Metadata } from "next";

import ColorPaletteGeneratorClient from "@/components/ColorPaletteGenerator/ColorPaletteGeneratorClient";

export const metadata: Metadata = {
  title: "Accessible SaaS Color Palette Generator | UI Pirate",
  description:
    "Free tool to generate a full 50-950 brand color ramp and matching neutral scale from one input color, with a real WCAG contrast ratio and recommended text color computed for every shade.",
  alternates: {
    canonical: "https://uipirate.com/tools/design/color-palette-generator",
  },
  openGraph: {
    title: "Accessible SaaS Color Palette Generator | UI Pirate",
    description:
      "Generate a harmonious 10-shade UI color ramp with automated WCAG contrast validation for every step.",
    url: "https://uipirate.com/tools/design/color-palette-generator",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Accessible SaaS Color Palette Generator",
  url: "https://uipirate.com/tools/design/color-palette-generator",
  description:
    "Generate a full 50-950 brand color ramp and matching neutral scale from one input color, with a WCAG contrast ratio computed for every shade.",
  applicationCategory: "DesignApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why does my neutral ramp still look slightly tinted?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "By design - it caps saturation at 8% of your base hue rather than going to 0%, which is how most modern design systems build a neutral scale that still feels cohesive with the brand color.",
      },
    },
    {
      "@type": "Question",
      name: "Is step 500 exactly my input color?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Step 500 uses your input color's hue and saturation, but its lightness is set by a fixed curve rather than your input's raw lightness, keeping every generated palette's midtone at a consistent, accessible lightness.",
      },
    },
    {
      "@type": "Question",
      name: "Are the contrast ratios shown real WCAG numbers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes - the exact relative-luminance formula from WCAG 2.1 Success Criterion 1.4.3, computed live for every shade against both pure white and pure black.",
      },
    },
  ],
};

export default function ColorPaletteGeneratorPage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        type="application/ld+json"
      />
      <ColorPaletteGeneratorClient />
    </>
  );
}
