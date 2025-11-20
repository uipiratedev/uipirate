"use client";
import LandingOurPricing from "../landing/ourPricing";

import PricingHero from "./hero";
import TryBeforeCommit from "./tryBeforeCommit";

import PageWrapper from "@/components/PageWrapper";
import WhatWeProvideGlobal from "@/components/whatWeProvideGlobal";

const Pricing = () => {
  return (
    <PageWrapper showFloatingButton={false}>
      <PricingHero />
      <div className="">
        {/* <OurPricingCard id="Hourly" /> */}
        <LandingOurPricing />
      </div>
      <div className="container mx-auto xl:px-32 max-md:px-4 max-xl:px-4 max-2xl:px-0 mb-12">
        <WhatWeProvideGlobal />
        <TryBeforeCommit />
      </div>
    </PageWrapper>
  );
};

export default Pricing;
