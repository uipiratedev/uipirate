import type { Metadata } from "next";
import RobotsTxtGeneratorClient from "@/components/RobotsTxtGenerator/RobotsTxtGeneratorClient";

export const metadata: Metadata = {
  title: "Free AI-Ready robots.txt Generator | UI Pirate",
  description:
    "Generate a custom robots.txt file optimized for AI search engines, GPTBot, ClaudeBot, Gemini, and traditional search engines. Free with instant copy and download.",
  alternates: {
    canonical: "https://uipirate.com/tools/robots-txt-generator",
  },
  openGraph: {
    title: "Free AI-Ready robots.txt Generator | UI Pirate",
    description:
      "Generate a custom robots.txt file optimized for AI search engines, GPTBot, ClaudeBot, Gemini, and traditional search engines.",
    url: "https://uipirate.com/tools/robots-txt-generator",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "AI-Ready robots.txt Generator",
  "url": "https://uipirate.com/tools/robots-txt-generator",
  "description":
    "Generate a custom robots.txt file optimized for AI search engines, GPTBot, ClaudeBot, Gemini, and traditional search engines. Free with instant copy and download.",
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

export default function RobotsTxtGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RobotsTxtGeneratorClient />
    </>
  );
}
