import type { FeaturedCaseStudyData } from "@/screens/landing/featuredCaseStudy";

import dynamic from "next/dynamic";
import { Metadata } from "next";

import Loader from "@/components/loader";
import { listPosts } from "@/lib/pirateCOS/public-client";

// SSR-enabled dynamic import — Google can now crawl the full page content
const Landing = dynamic(() => import("@/screens/landing"), {
  loading: () => <Loader />,
});

// Page-specific metadata (overrides layout defaults for the homepage)
export const metadata: Metadata = {
  title: "UI Pirate — SaaS Product Design & Development Agency | Ship Faster",
  description:
    "We design and build SaaS products from first wireframe to working software. 50+ products shipped across 6 countries. Book a free 15-minute consultation.",
  keywords:
    "uipirate, uipirates, UI Pirate, SaaS design agency, product design and development agency, product design agency, UI UX design agency, idea to product, product thinking, competitive analysis, information architecture, UX design, UI design, SaaS product design, AI app design, enterprise UX design, conversion-focused design, simplify complex products, dashboard design, mobile app UI, web app UX, Vishal Anand",
  alternates: {
    canonical: "https://uipirate.com",
  },
  openGraph: {
    title: "UI Pirate — SaaS Product Design & Development Agency",
    description:
      "We help SaaS founders and enterprise teams design, build, and ship products. 50+ shipped. Free 15-min call. uipirate.com",
    url: "https://uipirate.com",
    siteName: "UI Pirate",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UI Pirate | Design & Dev for SaaS Teams That Need to Ship",
    description:
      "We help SaaS founders and enterprise teams design, build, and ship products. 50+ shipped. Free 15-min call. uipirate.com",
  },
};

export const revalidate = 60;

function isDataUri(url?: string) {
  return !!url && url.startsWith("data:");
}

async function getFeaturedCaseStudy(): Promise<FeaturedCaseStudyData | null> {
  return {
    slug: "xperiti",
    client: "Xperiti",
    title: "Platform Redesign and Development",
    excerpt:
      "Xperiti needed a market research enterprise SaaS platform serving researchers, coordinators, clients, and experts, without anyone feeling completely overlooked.",
    heroImage:
      "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788348051/xperiti_gkefw0.svg",
    highlights: [
      "UI/UX",
      "Market Research SaaS",
      "Multi-role enterprise SaaS",
      "Angular and Tailwind",
    ],
    clientLogo:
      "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760593625/xperiti_shp94q.svg",
    industry: "Research SaaS",
  };
}

export default async function Home() {
  const featuredCaseStudy = await getFeaturedCaseStudy();

  return <Landing featuredCaseStudy={featuredCaseStudy} />;
}
