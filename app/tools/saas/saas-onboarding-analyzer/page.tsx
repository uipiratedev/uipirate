import type { Metadata } from "next";

import OnboardingAnalyzerClient from "@/components/OnboardingAnalyzer/OnboardingAnalyzerClient";

export const metadata: Metadata = {
  title: "SaaS Onboarding & Activation Analyzer | UI Pirate",
  description:
    "Free tool to audit a signup or onboarding page's form friction, progressive disclosure, empty-state guidance, and time-to-first-value from its real server-rendered HTML.",
  alternates: {
    canonical: "https://uipirate.com/tools/saas/saas-onboarding-analyzer",
  },
  openGraph: {
    title: "SaaS Onboarding & Activation Analyzer | UI Pirate",
    description:
      "Measure signup friction, progressive disclosure, empty states, and time-to-first-value from a real page fetch, no mock data.",
    url: "https://uipirate.com/tools/saas/saas-onboarding-analyzer",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SaaS Onboarding & Activation Analyzer",
  url: "https://uipirate.com/tools/saas/saas-onboarding-analyzer",
  description:
    "Audit a signup or onboarding page's form friction, progressive disclosure, empty-state guidance, and time-to-first-value from its real server-rendered HTML.",
  applicationCategory: "DesignApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What URL should I paste in?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your actual signup or account-creation page for the best results. You can also test a welcome/onboarding page or a public demo route to check the empty-state and time-to-first-value signals independently.",
      },
    },
    {
      "@type": "Question",
      name: "Why did the Signup Friction score come back capped with a 'no form detected' message?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The page you tested doesn't contain a form element in its server-rendered HTML - either it's not the right URL, or the form is injected by client-side JavaScript this tool doesn't execute.",
      },
    },
    {
      "@type": "Question",
      name: "Why can't I analyze a localhost or internal URL?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Allowing arbitrary internal addresses would let anyone use this tool to probe private networks from the server, a class of vulnerability called SSRF. Only URLs that resolve to public IP addresses are accepted.",
      },
    },
  ],
};

export default function SaasOnboardingAnalyzerPage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        type="application/ld+json"
      />
      <OnboardingAnalyzerClient />
    </>
  );
}
