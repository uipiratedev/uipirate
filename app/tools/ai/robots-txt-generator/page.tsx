import type { Metadata } from "next";
import RobotsTxtGeneratorClient from "@/components/RobotsTxtGenerator/RobotsTxtGeneratorClient";

export const metadata: Metadata = {
  title: "Free AI-Ready robots.txt Generator | UI Pirate",
  description:
    "Build a custom robots.txt file for your site. Choose which AI bots, search engines, and scrapers to allow or block with 1-click strategy presets.",
  alternates: {
    canonical: "https://uipirate.com/tools/ai/robots-txt-generator",
  },
};

export default function RobotsTxtGeneratorNestedPage() {
  return <RobotsTxtGeneratorClient />;
}
