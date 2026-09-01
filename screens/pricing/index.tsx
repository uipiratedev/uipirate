"use client";
import LandingPricing from "../landing/pricing";

import PricingHero from "./hero";
import PricingClientLogos from "./clientLogos";
import PricingComparison from "./comparison";
import PricingPerfectFor from "./perfectFor";
import PricingFAQ from "./faq";
import TryBeforeCommit from "./tryBeforeCommit";

import PageWrapper from "@/components/PageWrapper";

const Pricing = () => {
  return (
    <PageWrapper showFloatingButton={false}>
      <div className="space-y-20 max-md:space-y-16">
        {/* Hero Section */}
        <PricingHero />

        {/* Client Logos - Social Proof */}
        <PricingClientLogos />

        {/* Main Pricing Cards */}
        <div id="plans">
          <LandingPricing />
        </div>

        {/* Comparison Table */}
        <div id="compare">
          <PricingComparison />
        </div>

        {/* Perfect For Section */}
        <PricingPerfectFor />

        {/* 5-Day Pilot CTA */}
        <div id="pilot">
          <TryBeforeCommit />
        </div>

        {/* FAQ Section */}
        <div id="faqs">
          <PricingFAQ />
        </div>
      </div>
    </PageWrapper>
  );
};

export default Pricing;
