import type { Metadata } from "next";
import SchemaGeneratorClient from "@/components/SchemaGenerator/SchemaGeneratorClient";

export const metadata: Metadata = {
  title: "Free AI & GEO Schema Markup Generator | UI Pirate",
  description:
    "Generate JSON-LD structured data for Organization, FAQPage, WebApplication, and Services to enhance AI search rankings and citations.",
  alternates: {
    canonical: "https://uipirate.com/tools/ai/schema-generator",
  },
};

export default function SchemaGeneratorNestedPage() {
  return <SchemaGeneratorClient />;
}
