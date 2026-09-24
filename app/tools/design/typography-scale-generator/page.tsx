import type { Metadata } from "next";

import TypographyScaleGeneratorClient from "@/components/TypographyScaleGenerator/TypographyScaleGeneratorClient";

export const metadata: Metadata = {
  title: "Modular Typography Scale & Fluid Font Generator | UI Pirate",
  description:
    "Free tool to generate modular typography scales, proportional line-height ramps, and CSS clamp() fluid font sizes. Export to CSS variables or a Tailwind config instantly.",
  alternates: {
    canonical: "https://uipirate.com/tools/design/typography-scale-generator",
  },
  openGraph: {
    title: "Modular Typography Scale & Fluid Font Generator | UI Pirate",
    description:
      "Generate mathematical typographic scales and responsive clamp() fluid type rules for web and product UI design.",
    url: "https://uipirate.com/tools/design/typography-scale-generator",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Modular Typography Scale & Fluid Font Generator",
  url: "https://uipirate.com/tools/design/typography-scale-generator",
  description:
    "Generate modular typographic scales, proportional line-height ramps, and CSS clamp() fluid font-size rules. Export as CSS variables or a Tailwind config.",
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
      name: "What is a modular typography scale?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A modular typography scale multiplies a base font size by a fixed ratio (like 1.25 or 1.333) to generate a harmonious sequence of heading and body text sizes, instead of picking arbitrary pixel values by eye.",
      },
    },
    {
      "@type": "Question",
      name: "What's the difference between a modular scale and fluid typography?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A modular scale defines the ratio between sizes at any single moment. Fluid typography, built with CSS clamp(), makes those sizes interpolate smoothly between a minimum and maximum value as the viewport width changes, removing the need for font-size media queries.",
      },
    },
    {
      "@type": "Question",
      name: "Which scale ratio should I use for a SaaS product?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dense, data-heavy dashboards usually work best with subtle ratios like Minor Second (1.067) or Major Second (1.125). Marketing and landing pages read better with Major Third (1.25) or Perfect Fourth (1.333) for stronger visual hierarchy.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need JavaScript to use clamp() typography in production?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. clamp() is native CSS, supported in every modern browser. Paste the generated CSS variables or Tailwind config straight into your stylesheet — no runtime cost or JavaScript required.",
      },
    },
  ],
};

export default function TypographyScaleGeneratorPage() {
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
      <TypographyScaleGeneratorClient />
    </>
  );
}
