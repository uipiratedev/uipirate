import type { Metadata } from "next";
import UpcomingToolLandingPage, { UpcomingToolSpec } from "@/components/UpcomingToolLandingPage";

export const metadata: Metadata = {
  title: "Smooth CSS Layered Shadow Generator | UI Pirate",
  description:
    "Generate realistic, multi-layered CSS box-shadows and elevation tokens with natural ambient light diffusion for modern UI.",
  alternates: {
    canonical: "https://uipirate.com/tools/design/css-shadow-generator",
  },
};

const spec: UpcomingToolSpec = {
  id: "css-shadow-generator",
  category: "design-system",
  categoryLabel: "Design Systems & Code",
  badgeText: "Upcoming Tool · CSS Utility",
  title: "Smooth Layered CSS Box-Shadow Generator",
  subtitle:
    "Create realistic, non-muddy elevation levels (sm, md, lg, xl) using multi-layer ambient and key light shadow blending.",
  agencyService: "Frontend Engineering & Design Systems",
  agencyLink: "/contact",
  keyMetrics: [
    { name: "Multi-Layer Ambient Physics", desc: "Combines 3 to 6 micro-shadows for hyper-realistic elevation." },
    { name: "Elevation Token Scale (xs–2xl)", desc: "Generates synchronized tokens for modals, dropdowns, and cards." },
    { name: "Tailwind CSS & Vanilla CSS Output", desc: "Exports drop-in Tailwind box-shadow theme configs." },
  ],
  howItWorks: [
    { step: "01. Elevation Control", title: "Adjust Blur & Spread", desc: "Fine-tune light angle and elevation height." },
    { step: "02. Color Tinting", title: "Ambient Color Match", desc: "Tint shadows to match your dark/light background." },
    { step: "03. Code Export", title: "Copy CSS", desc: "Paste ready-to-use CSS rules or Tailwind configs." },
  ],
  faqs: [
    { q: "Why are layered shadows superior to single box-shadows?", a: "Layered shadows mimic real-world optical physics with sharp key shadows and diffused ambient glow." },
  ],
};

export default function CssShadowGeneratorPage() {
  return <UpcomingToolLandingPage spec={spec} />;
}
