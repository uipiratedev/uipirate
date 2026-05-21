import { Metadata } from "next";

import Pricing from "@/screens/pricing";

export const metadata: Metadata = {
  title: "UI/UX Design Pricing 2026 | $2000/mo Unlimited Requests | Save 60% vs Agencies",
  description:
    "UI/UX design from $2000/mo — unlimited requests, 48hr turnaround. Or try our $350 5-day pilot. Save 60% vs US agencies. No contracts, pause anytime. 100% satisfaction guarantee. Used by Ipsos, Pivot Bits, Sarge.",
  keywords:
    "UI UX design pricing 2026, design subscription cost, unlimited design requests, SaaS design pricing, design agency monthly cost, hire UI designer cost, design retainer pricing, $2000 design subscription, cheap UI design agency, affordable UX design, design agency vs freelancer cost",
  openGraph: {
    title: "UI/UX Design Pricing | $2000/mo Unlimited · Save 60% vs Agencies",
    description:
      "Unlimited design requests from $2000/mo. 48hr turnaround, no contracts. Or try $350 pilot first. 100% satisfaction guarantee.",
    url: "https://uipirate.com/pricing",
    siteName: "UI Pirate",
    images: [
      {
        url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1779397879/Screenshot_2026-05-22_023842_sebbvi.png",
        width: 1200,
        height: 630,
        alt: "UI Pirate Pricing - $2000/mo Unlimited Design Requests",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UI/UX Design | $2000/mo Unlimited · 48hr Turnaround",
    description: "Save 60% vs US agencies. No contracts, pause anytime. Try $350 pilot first. 100% satisfaction guarantee.",
    images: ["https://res.cloudinary.com/dvk9ttiym/image/upload/v1779397879/Screenshot_2026-05-22_023842_sebbvi.png"],
  },
  alternates: {
    canonical: "https://uipirate.com/pricing",
  },
};

// Pricing page JSON-LD schema for rich results
const pricingSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "UI Pirate Design Services",
  description: "Professional UI/UX design and development services for SaaS, mobile apps, and enterprise products.",
  brand: {
    "@type": "Brand",
    name: "UI Pirate",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Monthly Retainer",
      description: "Unlimited design requests, fast turnaround, 1 active request at a time",
      price: "2000",
      priceCurrency: "USD",
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/LimitedAvailability",
      url: "https://uipirate.com/pricing",
    },
    {
      "@type": "Offer",
      name: "5-Day Pilot Project",
      description: "Low-risk pilot to test our process before committing to a full project",
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
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      <Pricing />
    </>
  );
};

export default PricingPage;
