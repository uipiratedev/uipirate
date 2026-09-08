"use client";

import FaqsAccordion from "./accordion";

import SectionHeader from "@/components/SectionHeader";

const LandingFaqs = () => {
  return (
    <div className="section-container pb-16 max-md:pb-12">
      <SectionHeader chip="FAQs" className="autoShow">
        Everything you need to <span className="text-brand-orange"> know</span>
      </SectionHeader>

      {/* Accordion section */}
      <FaqsAccordion />
    </div>
  );
};

export default LandingFaqs;
