"use client";
import React from "react";

import TestimonialCards from "./testimonialCards";
import GlassBadge from "@/components/GlassBadge";
function LandingTestimonials() {
  return (
    <div className=" pt-20 max-md:pt-3 ">
      <div className="autoShow">
      <div className=" flex flex-col items-center justify-center pb-4 max-md:pb-0 autoShow">

        <GlassBadge variant="gradient">
       testimonials
       </GlassBadge>
       </div>
          
      
        <p className="heading-center">
          Working with our{" "}
          <span className="relative inline-block ">
            <span className="z-10">clients</span>

            <img
              alt="Decorative underline for clients text"
              aria-hidden="true"
              className="absolute inset-0 w-[125px] h-full top-[0.4rem] left-2  z-0 max-lg:w-[70px]"
              src="https://res.cloudinary.com/damm9iwho/image/upload/v1730284462/Vector_client_jck63k.svg"
            />
          </span>{" "}
          partners
        </p>
        {/* <div className="flex flex-row items-center justify-center mb-0 mt-3 px-60 max-lg:px-32 max-md:px-8">
          <p className="md:w-1/2 text-center content-center px-16  max-lg:px-8 max-md:px-0 font-[500]">
            Grateful for the opportunity to collaborate and forge lasting
            connections.
          </p>
        </div> */}
      </div>
      <div>
        <TestimonialCards />
      </div>
    </div>
  );
}

export default LandingTestimonials;
