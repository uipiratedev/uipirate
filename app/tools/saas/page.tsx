import type { Metadata } from "next";
import ToolCategoryHub from "@/components/ToolCategoryHub";

export const metadata: Metadata = {
  title: "SaaS & Product Design Tools Suite | UI Pirate",
  description:
    "Free SaaS UX audits, onboarding friction diagnostics, pricing page conversion analyzers, and enterprise dashboard calculators by UI Pirate.",
  alternates: {
    canonical: "https://uipirate.com/tools/saas",
  },
};

export default function SaasToolsHubPage() {
  return (
    <ToolCategoryHub
      categoryId="saas-product"
      badgeText="Pillar 2 · Core Agency Expertise"
      title="SaaS & Product Design Diagnostic Tools"
      subtitle="Audit complex web app workflows, onboarding drop-offs, dashboard information density, and pricing psychology to maximize activation and retention."
      agencyService="SaaS & AI Product Design"
      agencyDescription="We architect multi-role dashboards, AI agent workflows, design systems, and complex enterprise web apps in React, Next.js, and Angular."
      introParagraphs={[
        "SaaS products fail for reasons a marketing site never has to think about: a confusing first-run flow that never gets to the \"aha\" moment, a dashboard so dense with data that power users can't find the one number they check every day, or a pricing table that undersells the tier you actually want people to buy. These are UX problems, but they show up as churn, not bounce rate — which is why they're so easy to miss until the metrics are already bad.",
        "The tools below are built from the same framework we use on paid SaaS UX audits: activation friction, information architecture under real data density, and monetization psychology in the pricing and packaging layer. Run them against a live product or a set of screenshots to get a scored diagnostic and specific fixes, not generic SaaS-design platitudes.",
      ]}
      methodology={[
        {
          step: "01. First-Run Activation",
          title: "Time-to-Value (TTV) Optimization",
          desc: "We diagnose onboarding friction, unnecessary form fields, and delayed aha-moments that cause trial user drop-off.",
        },
        {
          step: "02. Dashboard Usability",
          title: "Information Architecture & Density",
          desc: "We balance complex data tables, filtering controls, and KPI prominence so power users stay productive without interface clutter.",
        },
        {
          step: "03. Monetization Psychology",
          title: "Tier Differentiation & Packaging",
          desc: "We audit pricing tables, annual billing nudges, and feature grouping to maximize average revenue per user (ARPU).",
        },
      ]}
      faqs={[
        {
          q: "Why is SaaS UX audit different from traditional web design?",
          a: "SaaS products are interactive workflows with states, roles, data density, and persistent daily usage. Evaluating them requires deep product design experience.",
        },
        {
          q: "What types of SaaS products does UI Pirate specialize in?",
          a: "We specialize in complex enterprise dashboards, AI tooling, analytics platforms, multi-tenant B2B applications, and developer tools.",
        },
      ]}
    />
  );
}
