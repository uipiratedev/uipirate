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

export default function RobotsTxtGeneratorPage() {
  return <RobotsTxtGeneratorClient />;
}
