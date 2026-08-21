import type { Metadata } from "next";
import UpcomingToolLandingPage, { UpcomingToolSpec } from "@/components/UpcomingToolLandingPage";

export const metadata: Metadata = {
  title: "SaaS Onboarding & Activation Analyzer | UI Pirate",
  description:
    "Analyze your SaaS product onboarding flow for signup friction, step counts, time-to-first-value, and activation barriers.",
  alternates: {
    canonical: "https://uipirate.com/tools/saas-onboarding-analyzer",
  },
};

const spec: UpcomingToolSpec = {
  id: "saas-onboarding-analyzer",
  category: "saas-product",
  categoryLabel: "SaaS & Product Design",
  badgeText: "Upcoming Tool · In Development",
  title: "SaaS Onboarding & User Activation Analyzer",
  subtitle:
    "Audit your SaaS signup and first-run experience. Measure time-to-value (TTV), friction step counts, progressive disclosure, and user activation rates.",
  agencyService: "SaaS Product Design & User Onboarding",
  agencyLink: "/contact",
  keyMetrics: [
    {
      name: "Time-to-First-Value (TTV)",
      desc: "Calculates the total screens and minutes between account creation and the user experiencing your core product payoff.",
    },
    {
      name: "Signup Form Field Friction",
      desc: "Scores input count and flags unnecessary upfront requests (e.g. phone number, company size) before value delivery.",
    },
    {
      name: "Progressive Disclosure Rhythm",
      desc: "Evaluates whether complex feature configuration is deferred until after initial user aha-moment.",
    },
    {
      name: "Interactive Checklists & Progress Cues",
      desc: "Checks for gamified milestones, percentage complete bars, and next-step prompt clarity.",
    },
    {
      name: "Zero-State Sample Data",
      desc: "Assesses whether new workspaces pre-populate realistic demo data to prevent blank screen intimidation.",
    },
  ],
  howItWorks: [
    {
      step: "01. Flow Step Mapping",
      title: "Step-by-Step Recording",
      desc: "Enter your signup URL to document every transition screen from landing page to product dashboard.",
    },
    {
      step: "02. Cognitive Load Scoring",
      title: "Activation Drop-Off Audit",
      desc: "Identifies points where prospective users are most likely to abandon their trial or signup session.",
    },
    {
      step: "03. Activation Redesign Roadmap",
      title: "Streamlined Flow Blueprint",
      desc: "Get an actionable redesign spec reducing form friction and accelerating time-to-value.",
    },
  ],
  faqs: [
    {
      q: "What is the biggest mistake in SaaS onboarding flows?",
      a: "Requiring users to configure everything (invite team, set up webhooks, verify billing) before letting them see or try the actual product value.",
    },
    {
      q: "How does onboarding UX affect free trial conversion?",
      a: "Companies that cut onboarding friction in half routinely see a 20% to 40% jump in trial-to-paid conversions.",
    },
  ],
};

export default function SaasOnboardingAnalyzerPage() {
  return <UpcomingToolLandingPage spec={spec} />;
}
