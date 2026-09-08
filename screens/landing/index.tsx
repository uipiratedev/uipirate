"use client";

import { memo } from "react";
import dynamic from "next/dynamic";

import LandingHero from "./hero";
import LandingMarquee from "./marquee";
import Pricing from "./pricing";
import LandingWhoWeAre from "./whoWeAre";
import FeaturedCaseStudy, {
  type FeaturedCaseStudyData,
} from "./featuredCaseStudy";
import MiniProcess from "./miniProcess";

import PageWrapper from "@/components/PageWrapper";
import PricingPerfectFor from "@/screens/pricing/perfectFor";

// Dynamically import below-the-fold components for better initial load performance
const LandingBusinessHelp = dynamic(() => import("./businessHelp"), {
  loading: () => <div className="min-h-[600px]" />,
});

const LandingFaqs = dynamic(() => import("./faqs"), {
  loading: () => <div className="min-h-[400px]" />,
});

const LandingAbout = dynamic(() => import("./about"), {
  loading: () => <div className="min-h-[400px]" />,
});

const LandingTestimonials = dynamic(() => import("./testimonials"), {
  loading: () => <div className="min-h-[400px]" />,
});

const LandingBehanceFramor = dynamic(() => import("./behance/LandingBehance"), {
  loading: () => <div className="min-h-[600px]" />,
});

const MiniService = dynamic(() => import("./miniService/miniService"), {
  loading: () => <div className="min-h-[400px]" />,
});

const BentoGrid = dynamic(() => import("./bentoGrid/bentoGrid"), {
  loading: () => <div className="min-h-[500px]" />,
});

interface LandingProps {
  featuredCaseStudy?: FeaturedCaseStudyData | null;
}

const Landing = memo(function Landing({ featuredCaseStudy }: LandingProps) {
  return (
    <PageWrapper showFloatingButton={false}>
      <div className="space-y-20 max-md:space-y-16">
        <LandingHero />
        <LandingMarquee />

        <PricingPerfectFor />

        <div>
          <MiniService />
          <BentoGrid />
        </div>

        <MiniProcess />

        <LandingBehanceFramor />

        <FeaturedCaseStudy study={featuredCaseStudy ?? null} />

        <LandingWhoWeAre />

        <LandingAbout />

        <div id="Services">
          <LandingBusinessHelp />
        </div>

        <div id="pricing">
          <Pricing />
        </div>

        <div className="overflow-hidden">
          <LandingTestimonials />
        </div>

        <div id="FAQs">
          <LandingFaqs />
        </div>
      </div>
    </PageWrapper>
  );
});

export default Landing;
