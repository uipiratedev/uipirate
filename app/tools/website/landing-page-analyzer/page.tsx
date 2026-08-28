import type { Metadata } from "next";
import LandingPageAnalyzerClient from "@/components/LandingPageAnalyzer/LandingPageAnalyzerClient";

export const metadata: Metadata = {
  title: "Free Landing Page UX & Conversion Analyzer | UI Pirate",
  description:
    "Analyze your landing page for value proposition clarity, CTA prominence, social proof trust signals, and cognitive friction. Instant 0–100 score.",
  alternates: {
    canonical: "https://uipirate.com/tools/website/landing-page-analyzer",
  },
  openGraph: {
    title: "Free Landing Page UX & Conversion Analyzer | UI Pirate",
    description:
      "Analyze your landing page for value proposition clarity, CTA prominence, social proof trust signals, and cognitive friction.",
    url: "https://uipirate.com/tools/website/landing-page-analyzer",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Landing Page UX & Conversion Analyzer",
  "url": "https://uipirate.com/tools/website/landing-page-analyzer",
  "description":
    "Analyze your landing page for value proposition clarity, CTA prominence, social proof trust signals, and cognitive friction.",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
};

export default function LandingPageAnalyzerNestedPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPageAnalyzerClient />
    </>
  );
}
