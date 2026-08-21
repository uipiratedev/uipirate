import type { Metadata } from "next";
import PricingPageAnalyzerClient from "@/components/PricingPageAnalyzer/PricingPageAnalyzerClient";

export const metadata: Metadata = {
  title: "Free SaaS Pricing Page & Conversion Analyzer | UI Pirate",
  description:
    "Analyze your SaaS pricing page for plan differentiation, annual discount nudges, feature comparisons, and pricing psychology friction.",
  alternates: {
    canonical: "https://uipirate.com/tools/saas/pricing-page-analyzer",
  },
  openGraph: {
    title: "Free SaaS Pricing Page & Conversion Analyzer | UI Pirate",
    description:
      "Analyze your SaaS pricing page for plan differentiation, annual discount nudges, feature comparisons, and pricing psychology friction.",
    url: "https://uipirate.com/tools/saas/pricing-page-analyzer",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "SaaS Pricing Page & Conversion Analyzer",
  "url": "https://uipirate.com/tools/saas/pricing-page-analyzer",
  "description":
    "Analyze your SaaS pricing page for plan differentiation, annual discount nudges, feature comparisons, and pricing psychology friction.",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
};

export default function PricingPageAnalyzerNestedPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PricingPageAnalyzerClient />
    </>
  );
}
