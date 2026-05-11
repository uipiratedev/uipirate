import { Metadata } from "next";

import Service from "@/screens/service";

export const metadata: Metadata = {
  title:
    "UI/UX Design & Angular Development Services | SaaS, Mobile Apps, Design Systems | UI Pirate",
  description:
    "Full-service UI/UX design and frontend development in Angular, React & Next.js. SaaS apps, landing pages, design systems, motion graphics & mobile apps. Enterprise-grade quality with startup-friendly pricing. Serving USA, UK & globally.",
  keywords:
    "UI/UX design services, Angular development agency, Angular frontend development, SaaS design agency, React development, Next.js development, mobile app design, design systems, motion graphics, landing page design, enterprise UX, hire Angular developer, hire UI designer",
  openGraph: {
    title: "UI/UX Design Services | UI Pirate",
    description:
      "Full-service UI/UX design for SaaS apps, landing pages, design systems, motion graphics & mobile apps. Enterprise-grade quality, startup-friendly pricing.",
    url: "https://uipirate.com/services",
    siteName: "UI Pirate by Vishal Anand",
    images: [
      {
        url: "https://res.cloudinary.com/dkziil6io/image/upload/v1742919377/ui-pirate-website_amh6qb.png",
        width: 1200,
        height: 630,
        alt: "UI Pirate Design Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/services",
  },
};

const ServicesPage = () => {
  return (
    <div>
      <Service />
    </div>
  );
};

export default ServicesPage;
