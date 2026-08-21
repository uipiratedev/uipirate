import type { Metadata } from "next";
import UpcomingToolLandingPage, { UpcomingToolSpec } from "@/components/UpcomingToolLandingPage";

export const metadata: Metadata = {
  title: "Website Readability & Clarity Checker | UI Pirate",
  description:
    "Analyze your website copy for reading grade level, jargon density, sentence complexity, and cognitive load. Free readability diagnostic tool by UI Pirate.",
  alternates: {
    canonical: "https://uipirate.com/tools/website-readability-checker",
  },
};

const spec: UpcomingToolSpec = {
  id: "website-readability-checker",
  category: "website-conversion",
  categoryLabel: "Website & Conversion",
  badgeText: "Upcoming Tool · In Development",
  title: "Website Readability & Copy Clarity Checker",
  subtitle:
    "Analyze your website copy to eliminate jargon, reduce cognitive load, and ensure your value proposition is instantly understood by prospective customers.",
  agencyService: "Conversion Copywriting & Landing Pages",
  agencyLink: "/contact",
  keyMetrics: [
    {
      name: "Flesch-Kincaid Reading Grade",
      desc: "Calculates the US school grade level required to comprehend your copy. High-converting B2B sites target Grade 6–8.",
    },
    {
      name: "Jargon & Buzzword Density",
      desc: "Flags abstract enterprise jargon ('synergistic', 'paradigm-shifting') that obscures clear product benefits.",
    },
    {
      name: "Average Sentence Length",
      desc: "Scores rhythm and sentence length variation to keep readers engaged without fatigue.",
    },
    {
      name: "Passive Voice Ratio",
      desc: "Identifies passive phrasing and recommends active, decisive action verbs.",
    },
    {
      name: "Value Proposition Clarity",
      desc: "Measures how quickly a first-time visitor can extract what your product does and who it serves.",
    },
  ],
  howItWorks: [
    {
      step: "01. Content Extraction",
      title: "Clean Text Parsing",
      desc: "Extracts all headlines, body copy, and bullet points while ignoring boilerplate navigation elements.",
    },
    {
      step: "02. NLP Linguistic Analysis",
      title: "Readability Algorithms",
      desc: "Runs Coleman-Liau, Gunning Fog, and Dale-Chall formulas across your key marketing sections.",
    },
    {
      step: "03. Copy Rewriting Suggestions",
      title: "Direct Recommendations",
      desc: "Highlights dense paragraphs and provides clearer, high-converting alternatives.",
    },
  ],
  faqs: [
    {
      q: "Why is readability critical for SaaS conversions?",
      a: "Visitors spend an average of 5.5 seconds reading written website content. If your headline is dense or full of buzzwords, prospects bounce before discovering your features.",
    },
    {
      q: "What reading level is best for enterprise software?",
      a: "Even for technical B2B SaaS buyers, Grade 7–8 readability outperforms complex prose by 43% in user testing studies.",
    },
  ],
};

export default function WebsiteReadabilityCheckerPage() {
  return <UpcomingToolLandingPage spec={spec} />;
}
