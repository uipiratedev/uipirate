import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "About UI Pirate | Product Design & Development Agency — Our Story & Approach",
  description:
    "We turn product ideas into shipped products. Learn about our approach — product thinking, competitive analysis, UX/UI design & complex enterprise Angular/React development. 50+ products shipped for Fortune 500 clients globally.",
  keywords:
    "about UI Pirate, product design agency, idea to product, product thinking, Vishal Anand, Angular development, enterprise design agency, UX UI agency story",
  openGraph: {
    title: "About UI Pirate | Product Design & Development — Our Story",
    description:
      "Not just designs — we help you think, plan, and build your product from scratch. Product thinking, UX/UI, competitive analysis & complex enterprise Angular/React development.",
    url: "https://uipirate.com/about",
    siteName: "UI Pirate by Vishal Anand",
    images: [
      {
        url: "https://res.cloudinary.com/dkziil6io/image/upload/v1742919377/ui-pirate-website_amh6qb.png",
        width: 1200,
        height: 630,
        alt: "About UI Pirate - Product Design & Development Agency",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
