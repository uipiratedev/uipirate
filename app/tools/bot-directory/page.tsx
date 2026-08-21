import type { Metadata } from "next";
import BotDirectoryClient from "@/components/BotDirectory/BotDirectoryClient";

export const metadata: Metadata = {
  title: "AI Crawler & Bot Directory | UI Pirate",
  description:
    "Complete searchable database of 26+ AI crawlers, LLM training bots, search engines, and scrapers. Look up exact User-Agents, operators, and behavior.",
  alternates: {
    canonical: "https://uipirate.com/tools/bot-directory",
  },
  openGraph: {
    title: "AI Crawler & Bot Directory | UI Pirate",
    description:
      "Complete searchable database of 26+ AI crawlers, LLM training bots, search engines, and scrapers. Look up exact User-Agents, operators, and behavior.",
    url: "https://uipirate.com/tools/bot-directory",
    siteName: "UI Pirate",
    type: "website",
  },
};

export default function BotDirectoryPage() {
  return <BotDirectoryClient />;
}
