import type { Metadata } from "next";
import SaasUxAuditClient from "@/components/SaasUxAudit/SaasUxAuditClient";

export const metadata: Metadata = {
  title: "Free SaaS Product UX & Friction Audit Tool | UI Pirate",
  description:
    "Audit any SaaS product or dashboard URL for onboarding friction, navigation depth, information architecture, and CTA clarity. Instant 0–100 score.",
  alternates: {
    canonical: "https://uipirate.com/tools/saas/saas-ux-audit",
  },
  openGraph: {
    title: "Free SaaS Product UX & Friction Audit Tool | UI Pirate",
    description:
      "Audit any SaaS product or dashboard URL for onboarding friction, navigation depth, information architecture, and CTA clarity.",
    url: "https://uipirate.com/tools/saas/saas-ux-audit",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "SaaS Product UX & Friction Audit Tool",
  "url": "https://uipirate.com/tools/saas/saas-ux-audit",
  "description":
    "Audit any SaaS product or dashboard URL for onboarding friction, navigation depth, information architecture, and CTA clarity.",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
};

export default function SaasUxAuditNestedPage() {
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
