"use client";

import { memo } from "react";
import dynamic from "next/dynamic";

import LandingHero from "./hero";
import LandingMarquee from "./marquee";
import Pricing from "./pricing";
import TheTeam from "./theTeam";
import LandingWhoWeAre from "./whoWeAre";
import FeaturedCaseStudy, {
  type FeaturedCaseStudyData,
} from "./featuredCaseStudy";
import MiniProcess from "./miniProcess";

import PageWrapper from "@/components/PageWrapper";
import PricingPerfectFor from "@/screens/pricing/perfectFor";

// Dynamically import below-the-fold components for better initial load performance
const LandingAppScreen = dynamic(() => import("./appScreen"), {
  loading: () => <div className="min-h-[400px]" />,
});

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

const BoreYouCommit = dynamic(() => import("./boreYouCommit"), {
  loading: () => <div className="min-h-[300px]" />,
});

const MiniService = dynamic(() => import("./miniService/miniService"), {
  loading: () => <div className="min-h-[400px]" />,
});

const BentoGrid = dynamic(() => import("./bentoGrid/bentoGrid"), {
  loading: () => <div className="min-h-[500px]" />,
});

const TopThree = dynamic(() => import("./top3/topThree"), {
  loading: () => <div className="min-h-[400px]" />,
});

const PricingFlip = dynamic(() => import("./pricingFlip"), {
  loading: () => <div className="min-h-[600px]" />,
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

        <div className="pt-20 max-md:pt-16">
          <MiniService />
          <BentoGrid />
        </div>

        {/* <div className="overflow-x-hidden py-0 max-md:py-4">
          <TopThree />
          <LandingAppScreen />
        </div> */}

        <MiniProcess />

        <LandingBehanceFramor />

        <FeaturedCaseStudy study={featuredCaseStudy ?? null} />

        <LandingWhoWeAre />

        <LandingAbout />

        {/* <WhyChooseUs /> */}

        <div id="Services">
          <LandingBusinessHelp />
        </div>

        <div id="pricing">
          <Pricing />
        </div>

        <PricingFlip />

        <TheTeam />

        {/* <BoreYouCommit /> */}

        <div className="overflow-hidden">
          <LandingTestimonials />
        </div>

        <div id="FAQs">
          <LandingFaqs />
        </div>
      </div>

      {/* Floating Let's Talk Button - Only on Landing Page */}
      {/* <FloatingLetsTalkButton /> */}
    </PageWrapper>
  );
});

export default Landing;
