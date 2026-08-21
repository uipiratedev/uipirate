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

export default function SchemaGeneratorPage() {
  return <SchemaGeneratorClient />;
}
