import type { Metadata } from "next";

import ReadabilityCheckerClient from "@/components/ReadabilityChecker/ReadabilityCheckerClient";

export const metadata: Metadata = {
  title: "Website Readability & Clarity Checker | UI Pirate",
  description:
    "Free tool to check a page's Flesch, Flesch-Kincaid, Gunning Fog, SMOG, Coleman-Liau, and ARI readability scores from its real text — plus the exact sentences hurting your score.",
  alternates: {
    canonical: "https://uipirate.com/tools/website/website-readability-checker",
  },
  openGraph: {
    title: "Website Readability & Clarity Checker | UI Pirate",
    description:
      "Analyze Flesch-Kincaid reading grade, sentence complexity, and clarity from a page's real, server-rendered text.",
    url: "https://uipirate.com/tools/website/website-readability-checker",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Website Readability & Clarity Checker",
  url: "https://uipirate.com/tools/website/website-readability-checker",
  description:
    "Check a page's Flesch, Flesch-Kincaid, Gunning Fog, SMOG, Coleman-Liau, and ARI readability scores from its real text, plus the exact sentences hurting the score.",
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
      name: "What reading level should my SaaS website target?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most high-converting B2B SaaS marketing copy targets a 6th-8.5th grade level - plain, direct language that reads fast, even for expert audiences.",
      },
    },
    {
      "@type": "Question",
      name: "Why do the six readability scores disagree with each other?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each formula was developed independently, for different purposes, and weighs sentence length vs. word complexity differently. Use the average and treat any single score as one data point.",
      },
    },
    {
      "@type": "Question",
      name: "Does this tool analyze the whole website or just one page?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "One URL at a time. Run it against your highest-traffic pages individually, since readability can vary a lot page to page.",
      },
    },
  ],
};

export default function WebsiteReadabilityCheckerPage() {
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
      <ReadabilityCheckerClient />
    </>
  );
}
