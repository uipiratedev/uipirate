export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

// Shared between /about and /process — single source so the two pages never
// drift out of sync.
export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Listen",
    description:
      "You share your product vision — even if it's just a few lines of an idea. We listen deeply to understand your goals, users, and constraints.",
  },
  {
    step: "02",
    title: "Think",
    description:
      "We do competitive analysis, market research, and product thinking. We study what exists, find gaps, and define what will make your product stand out.",
  },
  {
    step: "03",
    title: "Plan",
    description:
      "Information architecture, user flows, feature prioritization, and product roadmap. We structure your product so it's intuitive from day one.",
  },
  {
    step: "04",
    title: "Design",
    description:
      "Wireframes → High-fidelity UI → Interactive prototypes. Every pixel is deliberate, every interaction is designed to drive user engagement.",
  },
  {
    step: "05",
    title: "Build",
    description:
      "Production-ready frontend code in Angular, React, or Next.js. Component-based architecture, API integration, responsive layouts, and performance optimization.",
  },
  {
    step: "06",
    title: "Ship & Scale",
    description:
      "Deployment, documentation, design system handoff, and ongoing support. We stay with you as your product grows and evolves.",
  },
];
