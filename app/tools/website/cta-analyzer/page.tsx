import type { Metadata } from "next";
import UpcomingToolLandingPage, { UpcomingToolSpec } from "@/components/UpcomingToolLandingPage";

export const metadata: Metadata = {
  title: "Call-to-Action (CTA) & Button Analyzer | UI Pirate",
  description:
    "Audit your website and SaaS conversion buttons for color contrast, action verb strength, visual weight, and viewport placement.",
  alternates: {
    canonical: "https://uipirate.com/tools/website/cta-analyzer",
  },
};

const spec: UpcomingToolSpec = {
  id: "cta-analyzer",
  category: "website-conversion",
  categoryLabel: "Website & Conversion",
  badgeText: "Upcoming Tool · In Development",
  title: "CTA & Conversion Button Analyzer",
  subtitle:
    "Analyze call-to-action buttons across your landing page. Audit color contrast, action verb strength, visual weight, and above-the-fold discoverability.",
  agencyService: "Conversion Rate Optimization (CRO)",
  agencyLink: "/contact",
  keyMetrics: [
    {
      name: "Visual Saliency & Contrast",
      desc: "Calculates luminance differential between your primary CTA and the surrounding background.",
    },
    {
      name: "Action Verb Specificity",
      desc: "Scores button copy ('Start 14-Day Free Trial' vs generic 'Submit' or 'Click Here').",
    },
    {
      name: "Microcopy & Risk Reducers",
      desc: "Checks for supporting trust cues near buttons (e.g. 'No credit card required', 'Cancel anytime').",
    },
    {
      name: "Viewport Sticky Presence",
      desc: "Assesses whether mobile visitors maintain access to a persistent conversion trigger while scrolling.",
    },
    {
      name: "Primary vs Secondary Hierarchy",
      desc: "Ensures secondary actions (e.g. 'Watch Demo') don't siphon clicks away from your primary conversion goal.",
    },
  ],
  howItWorks: [
    {
      step: "01. Visual Extraction",
      title: "Interactive Element Scan",
      desc: "Detects all <button> and <a> elements styled as interactive click targets across breakpoints.",
    },
    {
      step: "02. Attention Heatmap Simulation",
      title: "Eye-Tracking Model",
      desc: "Simulates visual fixation patterns to determine if your CTA is the first focal point on screen.",
    },
    {
      step: "03. Optimization Scorecard",
      title: "High-Impact Fixes",
      desc: "Provides recommended CSS tweaks, size adjustments, and high-converting copy variants.",
    },
  ],
  faqs: [
    {
      q: "What makes a high-converting CTA button?",
      a: "A high-converting CTA has high visual contrast against the background, uses a specific benefit-driven verb, includes a microcopy risk reducer, and is sized at least 48px in height for effortless tapping.",
    },
  ],
};

export default function CtaAnalyzerNestedPage() {
  return <UpcomingToolLandingPage spec={spec} />;
}
