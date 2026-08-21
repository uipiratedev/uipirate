import type { Metadata } from "next";
import LlmsTxtGeneratorClient from "@/components/LlmsTxtGenerator/LlmsTxtGeneratorClient";

export const metadata: Metadata = {
  title: "Free llms.txt & Markdown Knowledge Generator | UI Pirate",
  description:
    "Generate standard llms.txt and deep llms-full.txt files. Provide structured company knowledge directly to AI crawlers and LLM search agents.",
  alternates: {
    canonical: "https://uipirate.com/tools/ai/llms-txt-generator",
  },
};

export default function LlmsTxtGeneratorNestedPage() {
  return <LlmsTxtGeneratorClient />;
}
