import { Metadata } from "next";

import Pricing from "@/screens/pricing";

export const metadata: Metadata = {
  title:
    "UI/UX Design Pricing & Plans | Hire UI Pirate — Flexible & Transparent",
  description:
    "Transparent pricing for enterprise UI/UX design services. From landing pages to full SaaS design engagements. Compare plans, see what's included, and book a free consultation call.",
  keywords:
    "UI/UX design pricing, hire UI designer cost, SaaS design pricing, design agency rates, UI design packages, UX design cost 2026, freelance UI designer rates",
  openGraph: {
    title: "UI/UX Design Pricing & Plans | UI Pirate",
    description:
      "Transparent pricing for enterprise UI/UX design. Compare plans and book a free consultation.",
    url: "https://uipirate.com/pricing",
    siteName: "UI Pirate by Vishal Anand",
    images: [
      {
        url: "https://res.cloudinary.com/dkziil6io/image/upload/v1742919377/ui-pirate-website_amh6qb.png",
        width: 1200,
        height: 630,
        alt: "UI Pirate Design Pricing Plans",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/pricing",
  },
};

const PricingPage = () => {
  return (
    <div>
      <Pricing />
    </div>
  );
};

export default PricingPage;
