import type { Metadata } from "next";

import SvgOptimizerClient from "@/components/SvgOptimizer/SvgOptimizerClient";

export const metadata: Metadata = {
  title: "Fast SVG Optimizer & React Exporter | UI Pirate",
  description:
    "Free tool to strip editor bloat and comments from exported SVG markup, round coordinate precision, and export a clean React/JSX component - processed on the fly, never stored.",
  alternates: {
    canonical: "https://uipirate.com/tools/design/svg-optimizer",
  },
  openGraph: {
    title: "Fast SVG Optimizer & React Exporter | UI Pirate",
    description:
      "Compress SVG vector files, strip Figma/Illustrator bloat, and export clean JSX React components.",
    url: "https://uipirate.com/tools/design/svg-optimizer",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Fast SVG Optimizer & React Exporter",
  url: "https://uipirate.com/tools/design/svg-optimizer",
  description:
    "Strip editor bloat and comments from exported SVG markup, round coordinate precision, and export a clean React/JSX component.",
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
      name: "Is my SVG uploaded anywhere?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The markup is sent to the server to be parsed and optimized, the same as any other tool on this site, and the preview renders back in your browser - nothing is stored after the response is sent.",
      },
    },
    {
      "@type": "Question",
      name: "Will lowering the precision distort my icon?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "At precision 1-2 (the default), the difference is invisible at any icon size - a coordinate error under 0.01px is far smaller than a single screen pixel.",
      },
    },
    {
      "@type": "Question",
      name: "Why did some of my <g> groups disappear?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Only attribute-less groups are touched: a fully empty one is deleted, and one wrapping exactly one child is replaced by that child. A group with a transform, opacity, class, or any other attribute is always preserved.",
      },
    },
  ],
};

export default function SvgOptimizerPage() {
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
      <SvgOptimizerClient />
    </>
  );
}
