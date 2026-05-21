import dynamic from "next/dynamic";
import { Metadata } from "next";

import Loader from "@/components/loader";

// SSR-enabled dynamic import — Google can now crawl the full page content
const Landing = dynamic(() => import("@/screens/landing"), {
  loading: () => <Loader />,
});

// Client-only smooth scroll — doesn't block server rendering
const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), {
  ssr: false,
});

// Page-specific metadata (overrides layout defaults for the homepage)
export const metadata: Metadata = {
  title: "UI Pirate | Product Design & Development Agency — Idea to Product | Angular, React",
  description:
    "We turn your product ideas into reality. Full-service product design & frontend development agency — UX/UI, product thinking, competitive analysis, information architecture & complex enterprise Angular/React applications. 50+ products shipped. Book a free call.",
  keywords:
    "uipirate, uipirates, UI Pirate, product design agency, idea to product, product thinking, UX UI design and development, Angular development agency, complex enterprise application design, frontend development, React development, competitive analysis, information architecture, product design, SaaS app design, design systems, mobile app design, enterprise software design, Fortune 500 design, Vishal Anand",
  alternates: {
    canonical: "https://uipirate.com",
  },
  openGraph: {
    title: "UI Pirate | Product Design & Development — From Idea to Shipped Product",
    description:
      "Not just designs — we help you think, plan, and build your product from scratch. Product thinking, UX/UI design, and complex enterprise frontend development in Angular & React. 50+ products shipped globally.",
    url: "https://uipirate.com",
    siteName: "UI Pirate by Vishal Anand",
    images: [
      {
        url: "https://res.cloudinary.com/dkziil6io/image/upload/v1742919377/ui-pirate-website_amh6qb.png",
        width: 1200,
        height: 630,
        alt: "UI Pirate - Product Design & Development Agency — From Idea to Shipped Product",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Landing />
    </>
  );
}
