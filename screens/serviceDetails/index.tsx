"use client";

import LandingWork from "../landing/works";
import TryBeforeCommit from "../pricing/tryBeforeCommit";

import ServiceDetailsHero from "./hero";
import OptionalAdd from "./optionalAdd";
import StreamlinedProcess from "./streamlinedProcess";
import WhatWeProvide from "./whatWeProvide";
import WhoThisIsFor from "./whoThisIsFor";
import YouWillGet from "./youWillGet";
import RecommendedNextSteps from "./recommendedNextSteps";
import WhyThisMatters from "./whyThisMatters";
import WhatYouGetAnimations from "./whatYouGetAnimations";

import PageWrapper from "@/components/PageWrapper";

const ServiceDetails = ({ data }: any) => {
  if (!data) return <div>danis...</div>;

  return (
    <PageWrapper showFloatingButton={false}>
        <ServiceDetailsHero data={data.hero} />

        <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
          <WhatYouGetAnimations data={data.whatYouGet} />
        </div>
      <div className="space-y-20 max-md:space-y-8">

        <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
          <WhyThisMatters data={data.whyThisMatters} />
        </div>

        <StreamlinedProcess data={data.streamlinedProcess} />

        <div className="container mx-auto">
          <LandingWork />
        </div>

        <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
          <WhoThisIsFor data={data.whoThisIsFor} />
        </div>

        <div className="container mx-auto px-32 lg:px-20 max-md:px-4 pb-16">
          <RecommendedNextSteps data={data.recommendedNextSteps} />
        </div>
      </div>
    </PageWrapper>
  );
};

export default ServiceDetails;
