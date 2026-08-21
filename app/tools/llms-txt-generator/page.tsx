import type { Metadata } from "next";
import LlmsTxtGeneratorClient from "@/components/LlmsTxtGenerator/LlmsTxtGeneratorClient";

export const metadata: Metadata = {
  title: "Free llms.txt & llms-full.txt Generator | UI Pirate",
  description:
    "Generate standard llms.txt and llms-full.txt files to optimize your website for AI search engines like ChatGPT, Claude, and Perplexity.",
  alternates: {
    canonical: "https://uipirate.com/tools/llms-txt-generator",
  },
  openGraph: {
    title: "Free llms.txt & llms-full.txt Generator | UI Pirate",
    description:
      "Generate standard llms.txt and llms-full.txt files to optimize your website for AI search engines like ChatGPT, Claude, and Perplexity.",
    url: "https://uipirate.com/tools/llms-txt-generator",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Free llms.txt & Context Generator",
  "url": "https://uipirate.com/tools/llms-txt-generator",
  "description":
    "Generate standard llms.txt and llms-full.txt files to provide structured markdown context to AI models, Perplexity, ChatGPT, and Claude.",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "provider": {
    "@type": "Organization",
    "name": "UI Pirate",
    "url": "https://uipirate.com",
  },
};

export default function LlmsTxtGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LlmsTxtGeneratorClient />
    </>
  );
}
