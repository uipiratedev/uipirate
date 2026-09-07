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
      "You share your vision. We ask the right questions to understand your users, goals, and constraints.",
  },
  {
    step: "02",
    title: "Think",
    description:
      "We run competitive analysis and product research to define what will make your product stand out.",
  },
  {
    step: "03",
    title: "Plan",
    description:
      "User flows, information architecture, and feature prioritization structured before anything is designed.",
  },
  {
    step: "04",
    title: "Design",
    description:
      "Wireframes to high-fidelity UI to interactive prototypes. Every interaction is intentional.",
  },
  {
    step: "05",
    title: "Build",
    description:
      "Production-ready frontend in React, Angular, or Next.js. Responsive, integrated, and optimized.",
  },
  {
    step: "06",
    title: "Ship & Scale",
    description:
      "Deployment, design system handoff, and ongoing support as your product grows.",
  },
];
