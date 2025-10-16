"use client";
import LandingFaqs from "../landing/faqs";
import ServiceHero from "./hero";
import ServicesList from "./servicesList";
import WhatWeProvide from "./whatWeProvide";
const Service = () => {
  return (
    <div className="container mx-auto xl:px-32 max-md:px-4 max-xl:px-4 max-2xl:px-0">
      <ServiceHero />
      <ServicesList />
      <WhatWeProvide />
      <LandingFaqs />
    </div>
  );
};

export default Service;
