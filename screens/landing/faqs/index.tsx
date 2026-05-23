"use client";

import FaqsAccordion from "./accordion";

import GlassBadge from "@/components/GlassBadge";

const LandingFaqs = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 pt-12 pb-16 max-md:pb-20 max-md:mt-6">
      {/* Header section */}
      <div className="flex flex-col items-center justify-center pb-4 max-md:pb-0 autoShow">
        <GlassBadge variant="gradient">FAQs</GlassBadge>
      </div>
      <h2 className="heading-center autoShow">Everything you need to know</h2>

      {/* Accordion section */}
      <div className="mt-6 max-md:mt-4 autoShowBottom">
        <FaqsAccordion />
      </div>
    </div>
  );
};

export default LandingFaqs;
