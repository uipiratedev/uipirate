import type { Metadata } from "next";
import SchemaGeneratorClient from "@/components/SchemaGenerator/SchemaGeneratorClient";

export const metadata: Metadata = {
  title: "Free AI & GEO Schema Markup Generator | UI Pirate",
  description:
    "Generate JSON-LD structured data for Organization, FAQPage, WebApplication, and Services to enhance AI search rankings and citations.",
  alternates: {
    canonical: "https://uipirate.com/tools/schema-generator",
  },
  openGraph: {
    title: "Free AI & GEO Schema Markup Generator | UI Pirate",
    description:
      "Generate JSON-LD structured data for Organization, FAQPage, WebApplication, and Services to enhance AI search rankings and citations.",
    url: "https://uipirate.com/tools/schema-generator",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Free AI & GEO Schema Markup Generator",
  "url": "https://uipirate.com/tools/schema-generator",
  "description":
    "Generate JSON-LD structured data for Organization, FAQPage, WebApplication, and Services to enhance AI search rankings and citations.",
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

export default function SchemaGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SchemaGeneratorClient />
    </>
  );
}
