"use client";

import LandingWork from "../landing/works";

import ServiceDetailsHero from "./hero";
import StreamlinedProcess from "./streamlinedProcess";
import WhoThisIsFor from "./whoThisIsFor";
import RecommendedNextSteps from "./recommendedNextSteps";
import WhyThisMatters from "./whyThisMatters";
import WhatYouGetAnimations from "./whatYouGetAnimations";

import PageWrapper from "@/components/PageWrapper";
import GlobalCTA from "@/components/GlobalCTA";

const ServiceDetails = ({ data }: any) => {
  if (!data) return <div>danis...</div>;

  return (
    <PageWrapper showFloatingButton={false}>
      <div className="space-y-20 max-md:space-y-16">
        {data.hero && <ServiceDetailsHero data={data.hero} />}

        {data.whatYouGet && (
          <WhatYouGetAnimations data={data.whatYouGet} />
        )}

        {data.whyThisMatters && (
          <div className="section-container">
            <WhyThisMatters data={data.whyThisMatters} />
          </div>
        )}

        {data.streamlinedProcess && (
          <StreamlinedProcess data={data.streamlinedProcess} />
        )}

        <LandingWork />

        {data.whoThisIsFor && (
          <div className="section-container">
            <WhoThisIsFor data={data.whoThisIsFor} />
          </div>
        )}

        {data.recommendedNextSteps && (
          <div className="section-container">
            <RecommendedNextSteps data={data.recommendedNextSteps} />
          </div>
        )}

        {/* Final CTA for service page */}
        <GlobalCTA />
      </div>
    </PageWrapper>
  );
};

export default ServiceDetails;
