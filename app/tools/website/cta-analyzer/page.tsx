import type { Metadata } from "next";

import CtaAnalyzerClient from "@/components/CtaAnalyzer/CtaAnalyzerClient";

export const metadata: Metadata = {
  title: "CTA & Conversion Button Analyzer | UI Pirate",
  description:
    "Free tool to audit a page's call-to-action placement, action-verb copy, and real WCAG contrast (wherever colors are resolvable) from its real server-rendered HTML.",
  alternates: {
    canonical: "https://uipirate.com/tools/website/cta-analyzer",
  },
  openGraph: {
    title: "CTA & Conversion Button Analyzer | UI Pirate",
    description:
      "Audit button placement, action verb psychology, and above-the-fold placement from a real page fetch - no mock data.",
    url: "https://uipirate.com/tools/website/cta-analyzer",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CTA & Conversion Button Analyzer",
  url: "https://uipirate.com/tools/website/cta-analyzer",
  description:
    "Audit a page's call-to-action placement, action-verb copy, and real WCAG contrast wherever colors are resolvable, from its real server-rendered HTML.",
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
      name: "Why didn't my button's contrast get scored?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Its color and background aren't literally present in the page's HTML - they're almost certainly defined in an external CSS file, which this tool doesn't fetch.",
      },
    },
    {
      "@type": "Question",
      name: "Is first-person CTA phrasing always better?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not universally - it's a documented lever with real published test results, not a guaranteed win for every audience.",
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

export default function CtaAnalyzerPage() {
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
      <CtaAnalyzerClient />
    </>
  );
}
