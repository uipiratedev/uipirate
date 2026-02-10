"use client";

import GlassBadge from "@/components/GlassBadge";
import FaqsAccordion from "./accordion";

const LandingFaqs = () => {
  return (
    <div className="container mx-auto  px-30 lg:px-20 max-md:px-4 pt-12 pb-16 mb-0 max-md:pb-20 max-md:mt-6 ">
      {/* Left section - Sticky */}
      <div className=" flex flex-col items-center justify-center pb-4 max-md:pb-0 autoShow">
      <GlassBadge variant="gradient">
      FAQs
      </GlassBadge>
        

      </div>
              <p className="heading-center">
      Everything you need to know
        </p>

      {/* Right section - Scrollable */}
      <div className=" mt-6 max-md:mt-10 -mx-2">
        <FaqsAccordion />
      </div>
    </div>
  );
};

export default LandingFaqs;
