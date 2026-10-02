import type { Metadata } from "next";

import PerformanceCheckerClient from "@/components/PerformanceChecker/PerformanceCheckerClient";

export const metadata: Metadata = {
  title: "Website Performance & UX Signals Score | UI Pirate",
  description:
    "Free tool that measures real time-to-first-byte and payload size for a live request, then checks render-blocking resources, layout-shift risk, and third-party weight from the page's real HTML.",
  alternates: {
    canonical: "https://uipirate.com/tools/website/website-performance-score",
  },
  openGraph: {
    title: "Website Performance & UX Signals Score | UI Pirate",
    description:
      "Measure real network timing plus render-blocking resources, layout-shift risk, and third-party weight - not a simulated Lighthouse score.",
    url: "https://uipirate.com/tools/website/website-performance-score",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Website Performance & UX Signals Score",
  url: "https://uipirate.com/tools/website/website-performance-score",
  description:
    "Measures real time-to-first-byte and payload size for a live request, then checks render-blocking resources, layout-shift risk, and third-party weight from the page's real HTML.",
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
      name: "Why isn't this the same score as Google PageSpeed Insights?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PageSpeed Insights renders the page in real Chrome and measures actual paint/input timing plus real visitor field data. This tool measures one real network request plus deterministic static-HTML proxies for the same underlying problems - a narrower signal, not a replacement.",
      },
    },
    {
      "@type": "Question",
      name: "Why does TTFB matter so much?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Everything else - parsing, rendering, script execution - can only start after the first byte arrives, so a slow TTFB delays every other performance metric by the same amount.",
      },
    },
    {
      "@type": "Question",
      name: "Why can't I check a localhost or internal URL?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Allowing arbitrary internal addresses would let anyone use this tool to probe private networks from the server, a class of vulnerability called SSRF. Only URLs that resolve to public IP addresses are accepted.",
      },
    },
  ],
};

export default function WebsitePerformanceScorePage() {
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
      <PerformanceCheckerClient />
    </>
  );
}
