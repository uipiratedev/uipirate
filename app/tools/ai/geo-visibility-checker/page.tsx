import type { Metadata } from "next";
import AIBotCheckerClient from "@/components/AIBotChecker/AIBotCheckerClient";

export const metadata: Metadata = {
  title: "AI & GEO Visibility Score Checker | UI Pirate",
  description:
    "Test your website against 26+ AI crawlers (GPTBot, ClaudeBot, Perplexity) and Cloudflare WAF. Get an instant 0–100 GEO Visibility Score.",
  alternates: {
    canonical: "https://uipirate.com/tools/ai/geo-visibility-checker",
  },
};

export default function GeoVisibilityCheckerAliasPage() {
  return <AIBotCheckerClient />;
}
