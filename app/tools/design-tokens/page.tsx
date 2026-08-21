import type { Metadata } from "next";
import DesignTokensClient from "@/components/DesignTokens/DesignTokensClient";

export const metadata: Metadata = {
  title: "Free SaaS Design Token & Theme Generator | UI Pirate",
  description:
    "Generate production-ready design tokens, 8pt spacing scales, typography ramps, and Tailwind CSS config objects in seconds.",
  alternates: {
    canonical: "https://uipirate.com/tools/design-tokens",
  },
  openGraph: {
    title: "Free SaaS Design Token & Theme Generator | UI Pirate",
    description:
      "Generate production-ready design tokens, 8pt spacing scales, typography ramps, and Tailwind CSS config objects in seconds.",
    url: "https://uipirate.com/tools/design-tokens",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "SaaS Design Token & Theme Generator",
  "url": "https://uipirate.com/tools/design-tokens",
  "description":
    "Generate production-ready design tokens, 8pt spacing scales, typography ramps, and Tailwind CSS config objects in seconds.",
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

export default function DesignTokensPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DesignTokensClient />
    </>
  );
}
