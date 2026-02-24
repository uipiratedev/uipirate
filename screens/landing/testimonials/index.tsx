"use client";
import React from "react";

import TestimonialCards from "./testimonialCards";
import GlassBadge from "@/components/GlassBadge";
function LandingTestimonials() {
  return (
    <div className=" pt-20 max-md:pt-12 ">
      <div className="autoShow">
      <div className=" flex flex-col items-center justify-center pb-4 max-md:pb-0 autoShow">

        <GlassBadge variant="gradient">
       testimonials
       </GlassBadge>
       </div>
          
      
        <h2 className="heading-center">
          <span className="text-gray-900">Loved by SaaS Founders &</span>
          <br className="max-md:hidden" />{" "}
          <span className="text-brand-orange">Product Teams</span>
        </h2>
      </div>
      <div>
        <TestimonialCards />
      </div>
    </div>
  );
}

export default LandingTestimonials;
