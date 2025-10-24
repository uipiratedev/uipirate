"use client";
import { useState } from "react";
import FaqsAccordion from "./accordion";
import { Card, CardBody, Button } from "@nextui-org/react";
import Image from "next/image";

const LandingFaqs = () => {
  const [isHoveredChat, setIsHoveredChat] = useState(false);
  const [isHoveredEmail, setIsHoveredEmail] = useState(false);

  return (
    <div className="container mx-auto  max-md:px-4 lg:px-20 pt-12 pb-32 mb-12 max-md:pb-32 max-md:mt-28 ">
      {/* Left section - Sticky */}
      <div className=" flex flex-col items-center justify-center pb-12 autoShow">
        <div className="flex flex-row items-start mb-6 max-md:items-center max-md:justify-center">
          <span className="bg-[#8EF1F1] px-4 py-2 rounded-xl font-semibold uppercase border-cyan-400 border-2">
            FAQs
          </span>
        </div>
        <h2 className="text-5xl max-lg:text-3xl max-2xl:text-4xl max-md:text-3xl font-[700] mt-3 mb-1 max-md:text-center max-md:px-8">
          Have questions?
        </h2>
        <h2 className="text-5xl max-lg:text-3xl max-2xl:text-4xl max-md:text-3xl font-[700] mb-6 max-md:text-center max-md:px-8">
          We've got you!
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
