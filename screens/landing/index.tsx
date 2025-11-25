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

import PageWrapper from "@/components/PageWrapper";
import FloatingLetsTalkButton from "@/components/FloatingLetsTalkButton";
const Landing = () => {
  return (
    <PageWrapper showFloatingButton={false}>
      <div>
        <LandingHero />
        <LandingMarquee />
        <div className="pt-32 max-md:pt-20">
          <div className="relative text-center  max-w-6xl mx-auto px-4">
            {/* Left quote icon */}
            <img
              alt="Opening quotation mark" aria-hidden="true"
              className="absolute left-4 top-0 -translate-y-1/2 w-12 h-12  max-md:w-6 max-md:h-6"
              src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1761645971/icon_ibp1gv.svg"
            />

            {/* Text */}
            <p className="text-2xl md:text-5xl font-[500] text-black leading-snug italic pl-8 pr-12 max-md:pr-6">
              We design products, that Rings bell in people&apos;s heart and
              make us feel proud.
            </p>

            {/* Right quote icon */}

            <img
              alt="Closing quotation mark" aria-hidden="true"
              className="absolute right-4 -bottom-12 max-md:-bottom-4 -translate-y-1/2 w-12 h-12 max-md:w-6 max-md:h-6"
              src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1761645970/icon1_xyat8o.svg"
            />
          </div>
        </div>
        <div className=" overflow-x-hidden py-12 max-md:py-4">
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
