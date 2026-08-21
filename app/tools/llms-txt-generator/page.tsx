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

export default function LlmsTxtGeneratorPage() {
  return <LlmsTxtGeneratorClient />;
}
