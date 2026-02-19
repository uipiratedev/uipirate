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
      <div>
        <ServiceDetailsHero data={data.hero} />

        {/* New WHAT YOU GET (animations) section just below hero */}
        <div className="container mx-auto mx-auto px-32 lg:px-20 max-md:px-4">
          <WhatYouGetAnimations data={data.whatYouGet} />
        </div>

        <div className="container mx-auto mx-auto px-32 lg:px-20 max-md:px-4">
          {/* <WhatWeProvide data={data.whatWeProvide} /> */}
          {/* <YouWillGet data={data.youWillGet} /> */}
          <WhyThisMatters data={data.whyThisMatters} />
          {/* <OptionalAdd data={data.optionalAdd} /> */}
        </div>
          <StreamlinedProcess data={data.streamlinedProcess} />


        <div className="container mx-auto ">
          <LandingWork />
        </div>

        {/* New Who This Is For section below Work section */}
        <div className="container mx-auto mx-auto px-32 lg:px-20 max-md:px-4">
          <WhoThisIsFor data={data.whoThisIsFor} />
        </div>

        {/* <div className="container mx-auto mx-auto px-32 lg:px-20 max-md:px-4 mb-24">
          <TryBeforeCommit />
        </div> */}

        <div className="container mx-auto mx-auto px-32 lg:px-20 max-md:px-4 mb-24">
          <RecommendedNextSteps />
        </div>
      </div>
    </PageWrapper>
  );
};

export default ServiceDetails;
