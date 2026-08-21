import type { Metadata } from "next";
import AIBotCheckerClient from "@/components/AIBotChecker/AIBotCheckerClient";

export const metadata: Metadata = {
  title: "AI Bot Crawler Checker — See Which AI Bots Can Access Any Website",
  description:
    "Free tool: paste any website URL and instantly see which AI bots (GPTBot, ClaudeBot, Gemini, PerplexityBot & more) are allowed or blocked by checking its robots.txt.",
  keywords:
    "AI bot checker, robots.txt checker, GPTBot, ClaudeBot, Google-Extended, PerplexityBot, AI crawler, AI crawling, AI traffic checker, robots.txt parser",
  openGraph: {
    title: "AI Bot Crawler Checker — Free Tool by UI Pirate",
    description:
      "Instantly see which AI bots (GPTBot, ClaudeBot, Gemini & 13 more) can crawl any website. Free, no sign up required.",
    url: "https://uipirate.com/tools/ai-bot-checker",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/tools/ai-bot-checker",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "AI Bot Crawler Checker & GEO Readiness Hub",
      "url": "https://uipirate.com/tools/ai-bot-checker",
      "description":
        "Instantly analyze your website's robots.txt and edge firewall for 26+ AI crawlers, LLM training bots, and search engines. Get a free 0-100 GEO score.",
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
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is an AI Bot Crawler Checker?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "An AI Bot Checker scans your website's robots.txt and HTTP headers to detect whether artificial intelligence crawlers (like GPTBot, ClaudeBot, PerplexityBot, and Google-Extended) are allowed or blocked from accessing your content.",
          },
        },
        {
          "@type": "Question",
          "name": "Does blocking AI bots hurt Google search rankings?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Blocking AI training bots (like GPTBot or ClaudeBot) does not hurt your Google organic search rankings. However, blocking AI search crawlers (like PerplexityBot or ChatGPT-User) prevents your brand from appearing as citations in generative AI search engines.",
          },
        },
      ],
    },
  ],
};

export default function AIBotCheckerPage() {
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
