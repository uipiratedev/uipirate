import type { Metadata } from "next";

import DashboardAnalyzerClient from "@/components/DashboardAnalyzer/DashboardAnalyzerClient";

export const metadata: Metadata = {
  title: "Enterprise Dashboard UX Analyzer | UI Pirate",
  description:
    "Free tool to audit a dashboard or admin UI's information density, KPI prominence, table usability, filter discoverability, and multi-role navigation from its real server-rendered HTML.",
  alternates: {
    canonical: "https://uipirate.com/tools/saas/dashboard-analyzer",
  },
  openGraph: {
    title: "Enterprise Dashboard UX Analyzer | UI Pirate",
    description:
      "Audit information density, KPI prominence, table usability, and multi-role action discovery from a real page fetch — no mock data.",
    url: "https://uipirate.com/tools/saas/dashboard-analyzer",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Enterprise Dashboard UX Analyzer",
  url: "https://uipirate.com/tools/saas/dashboard-analyzer",
  description:
    "Audit a dashboard or admin UI's information density, KPI prominence, table usability, filter discoverability, and multi-role navigation from its real server-rendered HTML.",
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
      name: "Can this analyze a dashboard that requires login?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not directly - the analyzer makes a single unauthenticated server-side request. If your product has a public demo or preview route, point the tool at that instead.",
      },
    },
    {
      "@type": "Question",
      name: "Why did my score come back low with a low-confidence warning?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your page's initial HTML response was very small, almost certainly because it's a client-rendered single-page app that fetches data and renders the real UI after JavaScript loads, which this tool doesn't execute.",
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

export default function DashboardAnalyzerPage() {
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
      <DashboardAnalyzerClient />
    </>
  );
}
