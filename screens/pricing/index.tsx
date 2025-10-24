"use client";
import WhatWeProvideGlobal from "@/components/whatWeProvideGlobal";
import OurPricingCard from "../landing/ourPricing/ourPricingCard";
import PricingHero from "./hero";
import TeamCulture from "../ourTeam/teamCulture";
import TryBeforeCommit from "./tryBeforeCommit";

const Pricing = () => {
  return (
    <div className="container mx-auto xl:px-32 max-md:px-4 max-xl:px-4 max-2xl:px-0 mb-12">
      <PricingHero />
      <div className=" pt-32 max-md:pt-24">
        <OurPricingCard id="Hourly" />
      </div>
      <WhatWeProvideGlobal />
      <TryBeforeCommit />
    </div>
  );
};

export default Pricing;
