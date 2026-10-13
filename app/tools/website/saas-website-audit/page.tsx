import type { Metadata } from "next";

import MarketingSiteAuditClient from "@/components/MarketingSiteAudit/MarketingSiteAuditClient";

export const metadata: Metadata = {
  title: "SaaS Marketing Website UX Audit",
  description:
    "Free tool to audit a B2B SaaS marketing homepage's feature communication, self-serve vs. sales-assisted conversion paths, enterprise trust signals, and social proof from its real server-rendered HTML.",
  alternates: {
    canonical: "https://uipirate.com/tools/website/saas-website-audit",
  },
  openGraph: {
    title: "SaaS Marketing Website UX Audit | UI Pirate",
    description:
      "Audit B2B feature grids, self-serve vs demo funnels, and enterprise compliance badges from a real page fetch - no mock data.",
    url: "https://uipirate.com/tools/website/saas-website-audit",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SaaS Marketing Website UX Audit",
  url: "https://uipirate.com/tools/website/saas-website-audit",
  description:
    "Audit a B2B SaaS marketing homepage's feature communication, conversion funnel clarity, enterprise trust signals, and social proof from its real server-rendered HTML.",
  applicationCategory: "DesignApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "My site has all of this but still scored low - why?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This is a structural/textual detector, not a visual one - unusual markup or copy that doesn't use common phrasing may not be detected even if the underlying content is genuinely strong.",
      },
    },
    {
      "@type": "Question",
      name: "Why can't I audit a localhost or internal URL?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Allowing arbitrary internal addresses would let anyone use this tool to probe private networks from the server, a class of vulnerability called SSRF. Only URLs that resolve to public IP addresses are accepted.",
      },
    },
  ],
};

export default function SaasWebsiteAuditPage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        type="application/ld+json"
      />
      <MarketingSiteAuditClient />
    </>
  );
}
