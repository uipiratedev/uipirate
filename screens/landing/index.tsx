"use client";

import { memo } from "react";
import dynamic from "next/dynamic";

import LandingHero from "./hero";
import LandingMarquee from "./marquee";
import FloatingLetsTalkButton from "@/components/FloatingLetsTalkButton";
import PageWrapper from "@/components/PageWrapper";

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

const Landing = memo(function Landing() {
  return (
    <PageWrapper showFloatingButton={false}>
      <div>
        <LandingHero />
        <LandingMarquee />

        <div className="pt-14 max-md:pt-20">
          <MiniService />
          <BentoGrid />
        </div>

        <div className="overflow-x-hidden py-0 max-md:py-4">
          <TopThree />
          <LandingAppScreen />
        </div>

        <LandingBehanceFramor />

        <LandingAbout />

        <div id="Services">
          <LandingBusinessHelp />
        </div>

        <BoreYouCommit />

        <div className="overflow-hidden">
          <LandingTestimonials />
        </div>

        <div id="FAQs">
          <LandingFaqs />
        </div>
      </div>

      {/* Floating Let's Talk Button - Only on Landing Page */}
      <FloatingLetsTalkButton />
    </PageWrapper>
  );
});

export default Landing;
