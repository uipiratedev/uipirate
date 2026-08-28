import type { Metadata } from "next";
import AIBotCheckerClient from "@/components/AIBotChecker/AIBotCheckerClient";

export const metadata: Metadata = {
  title: "AI Bot & GEO Readiness Hub | UI Pirate",
  description:
    "Test your website against 26+ AI crawlers (GPTBot, ClaudeBot, Perplexity) and Cloudflare WAF. Get an instant 0–100 GEO Visibility Score.",
  alternates: {
    canonical: "https://uipirate.com/tools/ai/ai-bot-checker",
  },
  openGraph: {
    title: "AI Bot & GEO Readiness Hub | UI Pirate",
    description:
      "Test your website against 26+ AI crawlers (GPTBot, ClaudeBot, Perplexity) and Cloudflare WAF.",
    url: "https://uipirate.com/tools/ai/ai-bot-checker",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "AI Bot & GEO Readiness Hub",
  "url": "https://uipirate.com/tools/ai/ai-bot-checker",
  "description":
    "Test your website against 26+ AI crawlers (GPTBot, ClaudeBot, Perplexity) and Cloudflare WAF. Get an instant 0–100 GEO Visibility Score.",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
};

export default function AiBotCheckerNestedPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AIBotCheckerClient />
    </>
  );
}
