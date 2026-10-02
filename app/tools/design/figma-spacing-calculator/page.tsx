import type { Metadata } from "next";

import SpacingCalculatorClient from "@/components/SpacingCalculator/SpacingCalculatorClient";

export const metadata: Metadata = {
  title: "8pt Grid & Figma Spacing Calculator | UI Pirate",
  description:
    "Free tool to generate an 8pt/4pt spacing scale with exact px/rem values, check any pixel value for grid alignment, and export CSS variables, Tailwind config, or Figma variables.",
  alternates: {
    canonical: "https://uipirate.com/tools/design/figma-spacing-calculator",
  },
  openGraph: {
    title: "8pt Grid & Figma Spacing Calculator | UI Pirate",
    description:
      "Calculate 8pt/4pt layout scales, auto-layout container padding, and Figma spacing variables.",
    url: "https://uipirate.com/tools/design/figma-spacing-calculator",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "8pt Grid & Figma Spacing Calculator",
  url: "https://uipirate.com/tools/design/figma-spacing-calculator",
  description:
    "Generate an 8pt/4pt spacing scale with exact px/rem values, check any pixel value for grid alignment, and export CSS variables, Tailwind config, or Figma variables.",
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
      name: "Why isn't my design's spacing landing on exact px values in Figma?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Figma's Auto Layout can produce fractional pixel values when nested frames use percentage-based resizing or when a parent frame's width isn't itself a multiple of your base unit.",
      },
    },
    {
      "@type": "Question",
      name: "What root font size does the rem conversion use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "16px, the browser default. The px values are correct regardless of your project's root font-size; only the rem conversion assumes 16px.",
      },
    },
  ],
};

export default function FigmaSpacingCalculatorPage() {
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
      <SpacingCalculatorClient />
    </>
  );
}
