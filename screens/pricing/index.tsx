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
      {/* Hero Section */}
      <PricingHero />

      {/* Client Logos - Social Proof */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32">
        <PricingClientLogos />
      </div>

      {/* Main Pricing Cards */}
      <div className="mt-4">
        <LandingPricing />
      </div>

      {/* Comparison Table */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32">
        <PricingComparison />
      </div>

      {/* Perfect For Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32">
        <PricingPerfectFor />
      </div>

      {/* 5-Day Pilot CTA */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 mb-8">
        <TryBeforeCommit />
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 mb-16">
        <PricingFAQ />
      </div>
    </PageWrapper>
  );
};

export default Pricing;
