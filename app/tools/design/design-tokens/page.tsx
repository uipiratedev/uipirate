import type { Metadata } from "next";
import DesignTokensClient from "@/components/DesignTokens/DesignTokensClient";

export const metadata: Metadata = {
  title: "Free SaaS Design Token & Theme Generator | UI Pirate",
  description:
    "Generate production-ready design tokens, 8pt spacing scales, typography ramps, and Tailwind CSS config objects in seconds. Free tool by UI Pirate.",
  alternates: {
    canonical: "https://uipirate.com/tools/design/design-tokens",
  },
  openGraph: {
    title: "Free SaaS Design Token & Theme Generator | UI Pirate",
    description:
      "Generate production-ready design tokens, 8pt spacing scales, typography ramps, and Tailwind CSS config objects in seconds.",
    url: "https://uipirate.com/tools/design/design-tokens",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "SaaS Design Token & Theme Generator",
  "url": "https://uipirate.com/tools/design/design-tokens",
  "description":
    "Generate production-ready design tokens, 8pt spacing scales, typography ramps, and Tailwind CSS config objects in seconds.",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
};

export default function DesignTokensNestedPage() {
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
