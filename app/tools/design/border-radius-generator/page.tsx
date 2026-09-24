import type { Metadata } from "next";

import BorderRadiusGeneratorClient from "@/components/BorderRadiusGenerator/BorderRadiusGeneratorClient";

export const metadata: Metadata = {
  title: "Concentric Border-Radius & Squircle Generator | UI Pirate",
  description:
    "Free tool to calculate nested (concentric) border-radius values that don't pinch at the corners, plus an iOS-style superellipse squircle generator with clip-path and SVG export.",
  alternates: {
    canonical: "https://uipirate.com/tools/design/border-radius-generator",
  },
  openGraph: {
    title: "Concentric Border-Radius & Squircle Generator | UI Pirate",
    description:
      "Generate nested radius scales and iOS-style continuous-curvature squircle corners for modern web UI.",
    url: "https://uipirate.com/tools/design/border-radius-generator",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Concentric Border-Radius & Squircle Generator",
  url: "https://uipirate.com/tools/design/border-radius-generator",
  description:
    "Calculate nested (concentric) border-radius values that don't pinch at the corners, plus an iOS-style superellipse squircle generator with clip-path and SVG export.",
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
      name: "What is concentric (nested) border-radius?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It's the practice of setting a padded child element's radius to outerRadius minus padding, so both the outer and inner curves share the same center point and run parallel instead of pinching together at the corners.",
      },
    },
    {
      "@type": "Question",
      name: "What exactly is a squircle?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A squircle is a shape between a square and a circle, mathematically a superellipse. Apple popularized it for iOS app icons because it has continuous curvature, which a normal rounded rectangle corner doesn't have.",
      },
    },
    {
      "@type": "Question",
      name: "Why use clip-path instead of border-radius for a squircle?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "border-radius can only draw circular arcs. A superellipse needs an arbitrary path, so it's built as an SVG path string and applied with CSS clip-path: path(...), which every evergreen browser supports.",
      },
    },
  ],
};

export default function BorderRadiusGeneratorPage() {
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
      <BorderRadiusGeneratorClient />
    </>
  );
}
