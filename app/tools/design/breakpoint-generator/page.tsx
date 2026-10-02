import type { Metadata } from "next";

import BreakpointLayoutCalculatorClient from "@/components/BreakpointLayoutCalculator/BreakpointLayoutCalculatorClient";

export const metadata: Metadata = {
  title: "Responsive Breakpoint, Container Query & Aspect Ratio Calculator | UI Pirate",
  description:
    "Free tool to generate synchronized media query breakpoints, modern CSS @container query tokens, and exact aspect-ratio dimensions that eliminate Cumulative Layout Shift.",
  alternates: {
    canonical: "https://uipirate.com/tools/design/breakpoint-generator",
  },
  openGraph: {
    title: "Responsive Breakpoint, Container Query & Aspect Ratio Calculator | UI Pirate",
    description:
      "Generate responsive media queries, CSS @container query tokens, and aspect-ratio dimensions to eliminate Cumulative Layout Shift.",
    url: "https://uipirate.com/tools/design/breakpoint-generator",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Responsive Breakpoint & Layout Calculator",
  url: "https://uipirate.com/tools/design/breakpoint-generator",
  description:
    "Generate synchronized media query breakpoints, modern CSS @container query tokens, and exact aspect-ratio dimensions that eliminate Cumulative Layout Shift.",
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
      name: "What's the difference between @media and @container?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "@media reads the browser viewport - the same styles apply everywhere on the page. @container reads the width of a specific parent element, so the same component can respond differently depending on where it's placed.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need container-type: inline-size for @container to work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes - a container query only works on an ancestor that has explicitly opted in with container-type, which is why this tool generates that declaration alongside the queries themselves.",
      },
    },
    {
      "@type": "Question",
      name: "How does aspect-ratio prevent Cumulative Layout Shift?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Setting an explicit aspect-ratio (or width/height attributes) lets the browser calculate and reserve the exact box before the image loads, so the layout never moves once the image bytes arrive.",
      },
    },
  ],
};

export default function BreakpointGeneratorPage() {
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
      <BreakpointLayoutCalculatorClient />
    </>
  );
}
