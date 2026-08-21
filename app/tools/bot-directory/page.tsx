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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "AI Crawler & Bot Directory",
  "url": "https://uipirate.com/tools/bot-directory",
  "description":
    "Complete searchable database of 26+ AI crawlers, LLM training bots, search engines, and scrapers. Look up exact User-Agents, operators, and behavior.",
  "provider": {
    "@type": "Organization",
    "name": "UI Pirate",
    "url": "https://uipirate.com",
  },
};

export default function BotDirectoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BotDirectoryClient />
    </>
  );
}
