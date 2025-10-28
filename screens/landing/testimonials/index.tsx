"use client";
import React from "react";
import TestimonialCards from "./testimonialCards";
function LandingTestimonials() {
  return (
    <div className=" pt-20 max-md:pt-3 ">
      <div className="autoShow">
        <div className="flex flex-row items-center justify-center mb-6">
          <span className="bg-[#8EF1F1] px-4 py-2 rounded-xl font-semibold uppercase border-cyan-400 border-2">
            testimonials
          </span>
        </div>
        <p className="heading-center">
          Working with our{" "}
          <span className="relative inline-block ">
            <span className="z-10">clients</span>

            <img
              src="https://res.cloudinary.com/damm9iwho/image/upload/v1730284462/Vector_client_jck63k.svg"
              alt=""
              className="absolute inset-0 w-[125px] h-full top-[0.4rem] left-2  z-0 max-lg:w-[70px]"
            />
          </span>{" "}
          partners
        </p>
        <div className="flex flex-row items-center justify-center mb-0 mt-3 px-60 max-lg:px-32 max-md:px-8">
          <p className="md:w-1/2 text-center content-center px-16  max-lg:px-8 max-md:px-0 font-[500]">
            Grateful for the opportunity to collaborate and forge lasting
            connections.
          </p>
        </div>
      </div>
      <div>
        <TestimonialCards />
        {/* <ResponsiveCarousel /> */}
      </div>
    </div>
  );
}

export default LandingTestimonials;
