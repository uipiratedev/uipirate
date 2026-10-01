import type { Metadata } from "next";

import GeoCompetitorBenchmarkClient from "@/components/GeoCompetitorBenchmark/GeoCompetitorBenchmarkClient";

export const metadata: Metadata = {
  title: "GEO Competitor & AI Search Benchmark | UI Pirate",
  description:
    "Free tool to benchmark your domain's AI bot access, llms.txt adoption, and structured-data depth against a competitor's, fetched live from both sites' real robots.txt and homepage HTML.",
  alternates: {
    canonical: "https://uipirate.com/tools/ai/geo-competitor-checker",
  },
  openGraph: {
    title: "GEO Competitor & AI Search Benchmark | UI Pirate",
    description:
      "Benchmark your domain's AI readiness, schema graph depth, and llms.txt adoption against top competitors.",
    url: "https://uipirate.com/tools/ai/geo-competitor-checker",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GEO Competitor & AI Search Benchmark",
  url: "https://uipirate.com/tools/ai/geo-competitor-checker",
  description:
    "Benchmark a domain's AI bot access, llms.txt adoption, and structured-data depth against a competitor's, fetched live from both sites.",
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
      name: "Does this use any Google/Search Console/PageSpeed API?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No - everything is derived from fetching each domain's own public robots.txt, llms.txt/llms-full.txt, and homepage HTML directly. No API keys or account access are required.",
      },
    },
    {
      "@type": "Question",
      name: "Why does the bot-access pillar carry the most weight?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If an AI crawler is blocked entirely, nothing else about a page can matter to that system, since it never gets read in the first place.",
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

export default function GeoCompetitorCheckerPage() {
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
      <GeoCompetitorBenchmarkClient />
    </>
  );
}
