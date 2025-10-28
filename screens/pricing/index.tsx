"use client";
import WhatWeProvideGlobal from "@/components/whatWeProvideGlobal";
import OurPricingCard from "../landing/ourPricing/ourPricingCard";
import PricingHero from "./hero";
import TeamCulture from "../ourTeam/teamCulture";
import TryBeforeCommit from "./tryBeforeCommit";
import PageWrapper from "@/components/PageWrapper";

const Pricing = () => {
  return (
    <PageWrapper showFloatingButton={false}>
      <div className="container mx-auto xl:px-32 max-md:px-4 max-xl:px-4 max-2xl:px-0 mb-12">
        <PricingHero />
        <div className=" pt-32 max-md:pt-24">
          <OurPricingCard id="Hourly" />
        </div>
        <WhatWeProvideGlobal />
        <TryBeforeCommit />
      </div>
    </PageWrapper>
  );
};

export default Pricing;
