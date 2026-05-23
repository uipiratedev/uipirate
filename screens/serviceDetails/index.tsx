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
          <div className="container mx-auto">
            <WhatYouGetAnimations data={data.whatYouGet} />
          </div>
        )}

        {data.whyThisMatters && (
          <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
            <WhyThisMatters data={data.whyThisMatters} />
          </div>
        )}

        {data.streamlinedProcess && (
          <StreamlinedProcess data={data.streamlinedProcess} />
        )}

        <div className="container mx-auto">
          <LandingWork />
        </div>

        {data.whoThisIsFor && (
          <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
            <WhoThisIsFor data={data.whoThisIsFor} />
          </div>
        )}

        {data.recommendedNextSteps && (
          <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
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
