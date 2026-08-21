import type { Metadata } from "next";
import UpcomingToolLandingPage, { UpcomingToolSpec } from "@/components/UpcomingToolLandingPage";

export const metadata: Metadata = {
  title: "Fast SVG Optimizer & React Component Exporter | UI Pirate",
  description:
    "Compress and clean SVG vectors, remove unnecessary metadata, and export clean JSX React components with Tailwind classes.",
  alternates: {
    canonical: "https://uipirate.com/tools/design/svg-optimizer",
  },
};

const spec: UpcomingToolSpec = {
  id: "svg-optimizer",
  category: "design-system",
  categoryLabel: "Design Systems & Code",
  badgeText: "Upcoming Tool · Asset Utility",
  title: "Fast SVG Optimizer & React Component Exporter",
  subtitle:
    "Clean vector files, strip editor metadata (Illustrator/Figma), reduce byte weight by up to 70%, and export clean React SVG components.",
  agencyService: "Frontend Performance & Asset Pipeline",
  agencyLink: "/contact",
  keyMetrics: [
    { name: "SVGO Precision Compression", desc: "Strips hidden metadata, unused defs, and redundant path coordinates." },
    { name: "React / Next.js Component Output", desc: "Converts attributes to camelCase (strokeWidth, viewBox) for JSX." },
    { name: "currentColor Replacement", desc: "Replaces hardcoded fills with currentColor for dynamic theme styling." },
  ],
  howItWorks: [
    { step: "01. Drop SVG File", title: "Upload or Paste XML", desc: "Drop your raw SVG icon or illustration." },
    { step: "02. Optimize Nodes", title: "Lossless Compression", desc: "Cleans path precision and strips comments." },
    { step: "03. Copy React Code", title: "JSX Ready", desc: "Copy clean component code directly into your stack." },
  ],
  faqs: [
    { q: "Why optimize SVGs before shipping to production?", a: "Unoptimized SVGs exported from Figma contain up to 60% bloat like comments, xmlns tags, and unnecessary clipPaths." },
  ],
};

export default function SvgOptimizerPage() {
  return <UpcomingToolLandingPage spec={spec} />;
}
