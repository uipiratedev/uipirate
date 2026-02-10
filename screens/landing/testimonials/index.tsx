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
          
      
        <p className="heading-center">
       Loved by SaaS Founders & Product Teams
        </p>
      </div>
      <div>
        <TestimonialCards />
      </div>
    </div>
  );
}

export default LandingTestimonials;
