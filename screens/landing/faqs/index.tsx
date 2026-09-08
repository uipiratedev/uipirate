"use client";

import FaqsAccordion from "./accordion";

import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/motion";

const LandingFaqs = () => {
  return (
    <div className="section-container pb-16 max-md:pb-12">
      <Reveal variant="up">
        <SectionHeader chip="FAQs">
          Everything you need to <span className="text-brand-orange"> know</span>
        </SectionHeader>
      </Reveal>

      {/* Accordion section */}
      <FaqsAccordion />
    </div>
  );
};

export default LandingFaqs;
