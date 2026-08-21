import type { Metadata } from "next";
import LandingPageAnalyzerClient from "@/components/LandingPageAnalyzer/LandingPageAnalyzerClient";

export const metadata: Metadata = {
  title: "Free Landing Page UX & Conversion Analyzer | UI Pirate",
  description:
    "Analyze your landing page for above-the-fold clarity, CTA contrast, trust signal density, and cognitive friction to increase conversion rates.",
  alternates: {
    canonical: "https://uipirate.com/tools/landing-page-analyzer",
  },
  openGraph: {
    title: "Free Landing Page UX & Conversion Analyzer | UI Pirate",
    description:
      "Analyze your landing page for above-the-fold clarity, CTA contrast, trust signal density, and cognitive friction to increase conversion rates.",
    url: "https://uipirate.com/tools/landing-page-analyzer",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Landing Page UX & Conversion Analyzer",
  "url": "https://uipirate.com/tools/landing-page-analyzer",
  "description":
    "Analyze your landing page for above-the-fold clarity, CTA contrast, trust signal density, and cognitive friction to increase conversion rates.",
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

export default function LandingPageAnalyzerPage() {
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
