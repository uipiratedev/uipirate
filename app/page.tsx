import dynamic from "next/dynamic";
import { Metadata } from "next";

import Loader from "@/components/loader";
import { listPosts } from "@/lib/pirateCOS/public-client";
import type { FeaturedCaseStudyData } from "@/screens/landing/featuredCaseStudy";

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
  const posts = await listPosts({ postType: "case-study", limit: 20 });
  const candidate = posts.find((p) => {
    const heroImage = p.featuredImage || p.bannerImage;

    return p.metrics && p.metrics.length > 0 && heroImage && !isDataUri(heroImage);
  });

  if (!candidate || !candidate.metrics?.[0]) return null;

  const heroImage = candidate.featuredImage || candidate.bannerImage || "";

  return {
    slug: candidate.slug,
    client: candidate.client || candidate.title,
    title: candidate.title,
    excerpt: candidate.excerpt,
    heroImage,
    metricLabel: candidate.metrics[0].label,
    metricValue: candidate.metrics[0].value,
  };
}

export default async function Home() {
  const featuredCaseStudy = await getFeaturedCaseStudy();

  return <Landing featuredCaseStudy={featuredCaseStudy} />;
}
