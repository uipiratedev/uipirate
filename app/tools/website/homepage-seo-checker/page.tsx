import type { Metadata } from "next";

import SeoCheckerClient from "@/components/SeoChecker/SeoCheckerClient";

export const metadata: Metadata = {
  title: "Homepage SEO & Metadata Checker | UI Pirate",
  description:
    "Free tool to audit a page's title, meta description, canonical URL, heading hierarchy, Open Graph tags, and structured data from its real server-rendered HTML.",
  alternates: {
    canonical: "https://uipirate.com/tools/website/homepage-seo-checker",
  },
  openGraph: {
    title: "Homepage SEO & Metadata Checker | UI Pirate",
    description:
      "Audit heading hierarchy (H1-H3), OpenGraph cards, meta descriptions, and search snippets from a real page fetch - no mock data.",
    url: "https://uipirate.com/tools/website/homepage-seo-checker",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Homepage SEO & Metadata Checker",
  url: "https://uipirate.com/tools/website/homepage-seo-checker",
  description:
    "Audit a page's title, meta description, canonical URL, heading hierarchy, Open Graph tags, and structured data from its real server-rendered HTML.",
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
      name: "Why does title/description length matter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Google truncates search result titles and descriptions at roughly pixel widths that correspond to about 60 and 160 characters respectively - going over means the copy gets cut off with an ellipsis.",
      },
    },
    {
      "@type": "Question",
      name: "What's the difference between a missing canonical and a canonical pointing elsewhere?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A missing canonical means search engines have to guess which URL variant is the real one. A canonical pointing to a different page actively tells search engines to index that other page instead.",
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

export default function HomepageSeoCheckerPage() {
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
      <SeoCheckerClient />
    </>
  );
}
