import type { Metadata } from "next";
import SaasUxAuditClient from "@/components/SaasUxAudit/SaasUxAuditClient";

export const metadata: Metadata = {
  title: "Free SaaS Product UX & Friction Audit Tool | UI Pirate",
  description:
    "Audit your SaaS web application, portal, or dashboard. Get an instant 0–100 Product Experience Score across onboarding, navigation, and cognitive friction.",
  alternates: {
    canonical: "https://uipirate.com/tools/saas-ux-audit",
  },
  openGraph: {
    title: "Free SaaS Product UX & Friction Audit Tool | UI Pirate",
    description:
      "Audit your SaaS web application, portal, or dashboard. Get an instant 0–100 Product Experience Score across onboarding, navigation, and cognitive friction.",
    url: "https://uipirate.com/tools/saas-ux-audit",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "SaaS Product UX & Friction Audit Tool",
  "url": "https://uipirate.com/tools/saas-ux-audit",
  "description":
    "Audit your SaaS web application, portal, or dashboard. Get an instant 0–100 Product Experience Score across onboarding, navigation, and cognitive friction.",
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

export default function SaasUxAuditPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SaasUxAuditClient />
    </>
  );
}
