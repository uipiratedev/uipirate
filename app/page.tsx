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
  title: "UI Pirate | #1 SaaS UI/UX Design & Angular Development Agency — Fortune 500 Trusted",
  description:
    "Enterprise UI/UX design and Angular, React, Next.js frontend development agency. Specializing in SaaS apps, design systems & AI products. 50+ projects delivered for clients in USA, UK & globally. Book a free consultation.",
  alternates: {
    canonical: "https://uipirate.com",
  },
  openGraph: {
    title: "UI Pirate | #1 SaaS UI/UX Design & Angular Development Agency",
    description:
      "Enterprise UI/UX design and Angular, React, Next.js development for SaaS apps, design systems & AI products. 50+ projects delivered in USA, UK & globally.",
    url: "https://uipirate.com",
    siteName: "UI Pirate by Vishal Anand",
    images: [
      {
        url: "https://res.cloudinary.com/dkziil6io/image/upload/v1742919377/ui-pirate-website_amh6qb.png",
        width: 1200,
        height: 630,
        alt: "UI Pirate - Enterprise UI/UX Design Agency for SaaS & AI Products",
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
