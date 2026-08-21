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
  title:
    "UI Pirate | Product Design & Development Agency — From Idea to Shipped Product",
  description:
    "We turn product ideas into shipped products. Product thinking, competitive analysis, information architecture & UX/UI design for complex SaaS, AI apps & enterprise software. We simplify complexity and design for conversion. 50+ products shipped.",
  keywords:
    "uipirate, uipirates, UI Pirate, product design agency, UI UX design agency, idea to product, product thinking, competitive analysis, information architecture, UX design, UI design, SaaS product design, AI app design, enterprise UX design, conversion-focused design, simplify complex products, dashboard design, mobile app UI, web app UX, Vishal Anand",
  alternates: {
    canonical: "https://uipirate.com",
  },
  openGraph: {
    title: "UI Pirate | Product Design Agency — From Idea to Shipped Product",
    description:
      "Not just designs — we help you think, plan, and build your product. Product thinking, competitive analysis, information architecture & conversion-focused design for complex products.",
    url: "https://uipirate.com",
    siteName: "UI Pirate",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UI Pirate | Product Design — Idea to Shipped Product",
    description:
      "Product thinking, competitive analysis & conversion-focused design for complex SaaS, AI apps & enterprise software. 50+ products shipped.",
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
