import type { Metadata } from "next";
import PricingPageAnalyzerClient from "@/components/PricingPageAnalyzer/PricingPageAnalyzerClient";

export const metadata: Metadata = {
  title: "Free SaaS Pricing Page & Conversion Analyzer | UI Pirate",
  description:
    "Analyze your SaaS pricing table for plan differentiation, annual toggle psychology, value metric clarity, and conversion friction.",
  alternates: {
    canonical: "https://uipirate.com/tools/pricing-page-analyzer",
  },
  openGraph: {
    title: "Free SaaS Pricing Page & Conversion Analyzer | UI Pirate",
    description:
      "Analyze your SaaS pricing table for plan differentiation, annual toggle psychology, value metric clarity, and conversion friction.",
    url: "https://uipirate.com/tools/pricing-page-analyzer",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "SaaS Pricing Page & Conversion Analyzer",
  "url": "https://uipirate.com/tools/pricing-page-analyzer",
  "description":
    "Analyze your SaaS pricing table for plan differentiation, annual toggle psychology, value metric clarity, and conversion friction.",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "provider": {
    "@type": "Organization",
    "name": "UI Pirate",
    "url": "https://uipirate.com",
  },
};

export default function PricingPageAnalyzerPage() {
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
