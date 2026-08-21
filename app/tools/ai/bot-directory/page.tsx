import type { Metadata } from "next";
import BotDirectoryClient from "@/components/BotDirectory/BotDirectoryClient";

export const metadata: Metadata = {
  title: "AI Crawler & Bot Directory — 26+ AI Agents | UI Pirate",
  description:
    "Explore our complete directory of AI crawlers, training scrapers, search bots, and SEO crawlers. Find User-Agents, IP reverse DNS, and robots.txt directives.",
  alternates: {
    canonical: "https://uipirate.com/tools/ai/bot-directory",
  },
};

export default function BotDirectoryNestedPage() {
  return <BotDirectoryClient />;
}
