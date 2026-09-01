import { Metadata } from "next";

import Pricing from "@/screens/pricing";

export const metadata: Metadata = {
  title: "UI/UX Design Pricing | from $500/mo Unlimited",
  description:
    "UI/UX design from $500/mo — unlimited requests, 48hr turnaround. Save 50-70% vs US agencies. No contracts, pause anytime.",
  keywords:
    "UI UX design pricing 2026, design subscription cost, unlimited design requests, SaaS design pricing, design agency monthly cost, hire UI designer cost, design retainer pricing, $2000 design subscription, design subscription agency, SaaS design retainer, unlimited design requests pricing, design agency vs freelancer cost",
  openGraph: {
    title: "UI/UX Design Pricing | from $500/mo Unlimited · Save 50-70% vs Agencies",
    description:
      "Unlimited design requests from $500/mo. 48hr turnaround, no contracts. Or try $350 pilot first. 100% satisfaction guarantee.",
    url: "https://uipirate.com/pricing",
    siteName: "UI Pirate",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UI/UX Design | from $500/mo Unlimited · 48hr Turnaround",
    description:
      "Save 50-70% vs US agencies. No contracts, pause anytime. Try $350 pilot first. 100% satisfaction guarantee.",
  },
  alternates: {
    canonical: "https://uipirate.com/pricing",
  },
};

// Pricing page JSON-LD schema for rich results.
// Typed as "Service" (not "Product") — we sell a design service with custom
// per-client terms, not shippable goods, so Google's Merchant Listings
// checks (shippingDetails, hasMerchantReturnPolicy) don't apply here.
const pricingSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "UI Pirate Design Services",
  description:
    "Professional UI/UX design and development services for SaaS, mobile apps, and enterprise products.",
  image:
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1779397879/Screenshot_2026-05-22_023842_sebbvi.png",
  provider: {
    "@type": "Organization",
    name: "UI Pirate",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Monthly Retainer",
      description:
        "Unlimited design requests, fast turnaround, 1 active request at a time",
      price: "500",
      priceCurrency: "USD",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/LimitedAvailability",
      url: "https://uipirate.com/pricing",
    },
    {
      "@type": "Offer",
      name: "5-Day Pilot Project",
      description:
        "Low-risk pilot to test our process before committing to a full project",
      price: "350",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: "https://uipirate.com/pricing",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "50",
  },
};

const PricingPage = () => {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
        type="application/ld+json"
      />
      <Pricing />
    </>
  );
};

export default PricingPage;
