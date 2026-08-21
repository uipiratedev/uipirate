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

export default function AIBotCheckerPage() {
  return <AIBotCheckerClient />;
}
