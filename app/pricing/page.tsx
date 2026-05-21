import { Metadata } from "next";

import Pricing from "@/screens/pricing";

export const metadata: Metadata = {
  title: "UI/UX Design Pricing | $2000/mo Retainer or Project-Based — UI Pirate",
  description:
    "Transparent UI/UX design pricing starting at $2000/month. No hidden fees. Monthly retainers, project-based quotes, and 5-day pilot projects. Save 50-70% vs US agencies. 100% satisfaction guarantee.",
  keywords:
    "UI/UX design pricing, design agency cost, SaaS design pricing, web design rates 2026, UI designer monthly retainer, design subscription, hire UI/UX designer cost, landing page design price, mobile app design cost, enterprise UI design pricing",
  openGraph: {
    title: "UI/UX Design Pricing — Simple & Transparent | UI Pirate",
    description:
      "From $2000/mo for unlimited design requests. Compare monthly retainer vs project pricing. No hidden fees, 100% satisfaction guarantee. Book a free consultation.",
    url: "https://uipirate.com/pricing",
    siteName: "UI Pirate by Vishal Anand",
    images: [
      {
        url: "https://res.cloudinary.com/dkziil6io/image/upload/v1742919377/ui-pirate-website_amh6qb.png",
        width: 1200,
        height: 630,
        alt: "UI Pirate — Transparent Design Pricing Plans",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UI/UX Design Pricing | $2000/mo or Project-Based",
    description: "Save 50-70% vs US agencies. Transparent pricing, no hidden fees. Monthly retainer or per-project.",
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
