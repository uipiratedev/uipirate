"use client";
import LandingHero from "./hero";
import LandingMarquee from "./marquee";
import LandingAppScreen from "./appScreen";
import LandingBusinessHelp from "./businessHelp";
import LandingFaqs from "./faqs";
import LandingAbout from "./about";
import LandingTestimonials from "./testimonials";
import LandingBehanceFramor from "./behance/LandingBehance";
import BoreYouCommit from "./boreYouCommit";
import MiniService from "./miniService/miniService";
import BentoGrid from "./bentoGrid/bentoGrid";
import TopThree from "./top3/topThree";

import FloatingLetsTalkButton from "@/components/FloatingLetsTalkButton";
import PageWrapper from "@/components/PageWrapper";
const Landing = () => {
  return (
    <PageWrapper showFloatingButton={false}>
      <div>
        <LandingHero />
        <LandingMarquee />

        <div className="pt-14 max-md:pt-20">
          <MiniService />
          <BentoGrid />
        </div>

        <div className=" overflow-x-hidden py-0 max-md:py-4">
          <TopThree />
          <LandingAppScreen />
        </div>

        <div className="">
          <LandingBehanceFramor />
        </div>

        <LandingAbout />

        <div id="Services">
          <LandingBusinessHelp />
        </div>
        <div>
          <BoreYouCommit />
        </div>
        <div className=" overflow-hidden">
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
};

export default Landing;
