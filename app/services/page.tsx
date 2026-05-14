import { Metadata } from "next";

import Service from "@/screens/service";

export const metadata: Metadata = {
  title:
    "Product Design & Development Services | Idea to Product | Angular, React | UI Pirate",
  description:
    "Full-service product design & frontend development. From idea to shipped product — product thinking, competitive analysis, UX/UI design, and complex enterprise Angular/React applications. Design systems, SaaS apps, landing pages & more.",
  keywords:
    "product design and development, idea to product, product thinking agency, UX UI design services, Angular development agency, complex enterprise application design, frontend development, competitive analysis, information architecture, SaaS design, design systems, hire product designer",
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
