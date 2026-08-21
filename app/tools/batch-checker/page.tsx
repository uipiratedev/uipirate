import type { Metadata } from "next";
import BatchCheckerClient from "@/components/BatchChecker/BatchCheckerClient";

export const metadata: Metadata = {
  title: "Free Batch AI Crawler & GEO Score Checker | UI Pirate",
  description:
    "Audit up to 10 competitor or client domains simultaneously. Compare AI bot access, GEO Visibility scores, and robots.txt configurations in real time.",
  alternates: {
    canonical: "https://uipirate.com/tools/batch-checker",
  },
  openGraph: {
    title: "Free Batch AI Crawler & GEO Score Checker | UI Pirate",
    description:
      "Audit up to 10 competitor or client domains simultaneously. Compare AI bot access, GEO Visibility scores, and robots.txt configurations in real time.",
    url: "https://uipirate.com/tools/batch-checker",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Batch AI Crawler & GEO Score Checker",
  "url": "https://uipirate.com/tools/batch-checker",
  "description":
    "Audit up to 10 competitor or client domains simultaneously for AI crawler permissions and GEO scores.",
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

export default function BatchCheckerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BatchCheckerClient />
    </>
  );
}
