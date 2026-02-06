"use client";

import GlassBadge from "@/components/GlassBadge";
import FaqsAccordion from "./accordion";

const LandingFaqs = () => {
  return (
    <div className="container mx-auto  max-md:px-4 lg:px-20 pt-12 pb-16 mb-0 max-md:pb-20 max-md:mt-6 ">
      {/* Left section - Sticky */}
      <div className=" flex flex-col items-center justify-center pb-12 max-md:pb-0 autoShow">
      <GlassBadge variant="gradient">
      FAQs
      </GlassBadge>
        <h2 className="text-5xl max-lg:text-3xl max-2xl:text-4xl max-md:text-3xl font-[700] mt-3 mb-1 max-md:text-center max-md:px-8">
          Have questions?
        </h2>
        <h2 className="text-5xl max-lg:text-3xl max-2xl:text-4xl max-md:text-3xl font-[700] mb-0 max-md:text-center max-md:px-8">
          We&apos;ve got you!
        </h2>
      </div>

      {/* Right section - Scrollable */}
      <div className=" px-12 max-md:px-0">
        <FaqsAccordion />
      </div>
    </div>
  );
};

export default LandingFaqs;
