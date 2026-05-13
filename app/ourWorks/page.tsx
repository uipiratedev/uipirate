import { Metadata } from "next";

import OurWorks from "@/screens/ourWorks";

export const metadata: Metadata = {
  title:
    "Our Work | 50+ Product Design & Development Projects | UI Pirate",
  description:
    "Explore our portfolio of 50+ shipped products — SaaS platforms, enterprise dashboards, AI applications, mobile apps & design systems. Designed and built with Angular, React & Next.js for clients like Ipsos, Xperiti, RevUp AI, and Bird.",
  keywords:
    "product design portfolio, UI UX design portfolio, Angular development projects, SaaS design examples, enterprise dashboard design, shipped products, design agency portfolio, mobile app design examples",
  openGraph: {
    title: "Our Work | 50+ Shipped Products | UI Pirate",
    description:
      "From SaaS platforms to fintech dashboards — explore 50+ products we designed and developed for enterprise clients globally.",
    url: "https://uipirate.com/ourWorks",
    siteName: "UI Pirate by Vishal Anand",
    images: [
      {
        url: "https://res.cloudinary.com/dkziil6io/image/upload/v1742919377/ui-pirate-website_amh6qb.png",
        width: 1200,
        height: 630,
        alt: "UI Pirate - Product Design & Development Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/ourWorks",
  },
};

const OurWorksPage = () => {
  return (
    <div>
      <OurWorks />
    </div>
  );
};

export default OurWorksPage;
