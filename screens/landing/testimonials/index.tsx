"use client";
import React from "react";

import TestimonialCards from "./testimonialCards";

import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/motion";

// No Review / AggregateRating JSON-LD here: Google treats self-serving review
// markup (reviews of our own org, on our own site) as ineligible for rich
// results and a policy risk. Testimonials render as visible content only; the
// organization entity is defined once in app/layout.tsx.

function LandingTestimonials() {
  return (
    <div className="w-full">
      <Reveal variant="up">
        <SectionHeader chip="testimonials">
          What <span className="text-brand-orange">Clients Say</span>
        </SectionHeader>
      </Reveal>
      <TestimonialCards />
    </div>
  );
}

export default LandingTestimonials;
