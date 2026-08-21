import type { Metadata } from "next";
import ToolCategoryHub from "@/components/ToolCategoryHub";

export const metadata: Metadata = {
  title: "AI & GEO Visibility Tools Suite | UI Pirate",
  description:
    "Free Generative Engine Optimization (GEO) toolkit: AI bot checkers, robots.txt generators, llms.txt creators, batch crawler scanners, and schema markup builders.",
  alternates: {
    canonical: "https://uipirate.com/tools/ai",
  },
};

export default function AiToolsHubPage() {
  return (
    <ToolCategoryHub
      categoryId="ai-geo"
      badgeText="Pillar 4 · Search & AI Discovery"
      title="AI & Generative Engine Optimization (GEO) Toolkit"
      subtitle="Audit AI crawler accessibility, generate standard llms.txt knowledge files, configure robots.txt, and optimize your brand for ChatGPT Search, Perplexity, Claude, and Gemini."
      agencyService="Generative Engine Optimization (GEO) & AI Product Strategy"
      agencyDescription="We optimize web products for conversational AI search engines with structured Schema.org graphs, server-side rendering (SSR), and curated llms.txt knowledge repositories."
      methodology={[
        {
          step: "01. AI Crawler Accessibility",
          title: "Firewall & WAF Diagnostics",
          desc: "We verify that real-time AI citation crawlers (OAI-SearchBot, PerplexityBot) can fetch your website without 403 firewall blocks.",
        },
        {
          step: "02. High-Density Markdown",
          title: "Standard /llms.txt Context",
          desc: "We generate clean markdown knowledge files that AI agents consume with zero token bloat, ensuring accurate citations.",
        },
        {
          step: "03. Structured Knowledge Graph",
          title: "Schema.org JSON-LD Entities",
          desc: "We build Organization, FAQPage, and WebApplication schemas to anchor brand facts inside LLM knowledge graphs.",
        },
      ]}
      faqs={[
        {
          q: "What is Generative Engine Optimization (GEO)?",
          a: "GEO is the practice of optimizing your website architecture, context files, and schema so conversational AI systems cite and recommend your brand.",
        },
        {
          q: "Does blocking GPTBot prevent ChatGPT Search citations?",
          a: "No. GPTBot is for training foundation models. Real-time search citations are handled by OAI-SearchBot and ChatGPT-User.",
        },
        {
          q: "Why should my company publish an llms.txt file?",
          a: "llms.txt gives AI agents a fast, accurate markdown summary of your product, pricing, and documentation without messy HTML parsing.",
        },
      ]}
    />
  );
}
