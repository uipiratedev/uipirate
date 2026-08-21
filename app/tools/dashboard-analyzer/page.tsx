import type { Metadata } from "next";
import UpcomingToolLandingPage, { UpcomingToolSpec } from "@/components/UpcomingToolLandingPage";

export const metadata: Metadata = {
  title: "SaaS & Enterprise Dashboard UX Analyzer | UI Pirate",
  description:
    "Analyze SaaS dashboard interfaces for information density, KPI hierarchy, table usability, filtering, and empty states. Built by UI Pirate.",
  alternates: {
    canonical: "https://uipirate.com/tools/dashboard-analyzer",
  },
};

const spec: UpcomingToolSpec = {
  id: "dashboard-analyzer",
  category: "saas-product",
  categoryLabel: "SaaS & Product Design",
  badgeText: "Upcoming Tool · In Development",
  title: "Enterprise Dashboard UX & Information Density Analyzer",
  subtitle:
    "Audit complex SaaS dashboards and web app interfaces. Score KPI prominence, table usability, filter architecture, and information density.",
  agencyService: "SaaS & Complex Enterprise Products",
  agencyLink: "/contact",
  keyMetrics: [
    {
      name: "Information Density & Clutter Score",
      desc: "Evaluates whitespace ratio, card padding, and cognitive load across high-density data views.",
    },
    {
      name: "Top-Level KPI Prominence",
      desc: "Scores whether primary business metrics are immediately actionable within 3 seconds of dashboard load.",
    },
    {
      name: "Data Table & Grid Usability",
      desc: "Audits sorting indicators, sticky column headers, inline actions, and row pagination controls.",
    },
    {
      name: "Filter & Search Discoverability",
      desc: "Checks faceted search usability, active filter chips, and multi-parameter query response.",
    },
    {
      name: "Empty States & Error Recovery",
      desc: "Inspects zero-data onboarding states to ensure users are guided with high-converting setup actions.",
    },
    {
      name: "Multi-Role Navigation Depth",
      desc: "Measures click depth for admin, manager, and viewer permission roles.",
    },
  ],
  howItWorks: [
    {
      step: "01. Dashboard Ingestion",
      title: "URL or Screenshot Upload",
      desc: "Paste your authenticated preview link or upload dashboard screen captures for visual layout parsing.",
    },
    {
      step: "02. Density & Hierarchy Scan",
      title: "Data Visualization Audit",
      desc: "Our heuristic engine identifies chart readability, table crowding, and action discoverability flaws.",
    },
    {
      step: "03. Enterprise Teardown Blueprint",
      title: "UX Architecture Plan",
      desc: "Receive component-level redesign recommendations to transform complex data into intuitive workflows.",
    },
  ],
  faqs: [
    {
      q: "Can this analyze password-protected enterprise applications?",
      a: "Yes. In the upcoming release you can either upload high-resolution screenshots or use a secure one-time session token.",
    },
    {
      q: "Why is dashboard information density so tricky to get right?",
      a: "Power users want maximum data density without scrolling, while casual users get overwhelmed by clutter. High-performing dashboards use progressive disclosure to balance both needs.",
    },
  ],
};

export default function DashboardAnalyzerPage() {
  return <UpcomingToolLandingPage spec={spec} />;
}
