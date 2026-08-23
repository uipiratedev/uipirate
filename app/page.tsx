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
  title: "UI Pirate — Designing AI-Driven SaaS Products That Convert",
  description:
    "We design and ship AI-driven SaaS products that convert, scale, and ship faster. Product thinking, competitive analysis, information architecture & UX/UI design for complex SaaS, AI apps & enterprise software. 50+ products shipped.",
  keywords:
    "uipirate, uipirates, UI Pirate, AI-driven SaaS product design, product design agency, UI UX design agency, idea to product, product thinking, competitive analysis, information architecture, UX design, UI design, SaaS product design, AI app design, enterprise UX design, conversion-focused design, simplify complex products, dashboard design, mobile app UI, web app UX, Vishal Anand",
  alternates: {
    canonical: "https://uipirate.com",
  },
  openGraph: {
    title: "UI Pirate — Designing AI-Driven SaaS Products That Convert",
    description:
      "We design and ship AI-driven SaaS products that convert, scale, and ship faster — product thinking, competitive analysis, information architecture & conversion-focused design for complex products.",
    url: "https://uipirate.com",
    siteName: "UI Pirate",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UI Pirate — AI-Driven SaaS Products That Convert",
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
