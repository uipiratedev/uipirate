"use client";

import LandingFaqs from "../landing/faqs";
import LandingWork from "../landing/works";
import TryBeforeCommit from "../pricing/tryBeforeCommit";
import ServiceDetailsHero from "./hero";
import OptionalAdd from "./optionalAdd";
import StreamlinedProcess from "./streamlinedProcess";
import WhatWeProvide from "./whatWeProvide";
import WhoThisIsFor from "./whoThisIsFor";
import YouWillGet from "./youWillGet";
import PageWrapper from "@/components/PageWrapper";

const ServiceDetails = ({ data }: any) => {
  if (!data) return <div>danis...</div>;

  return (
    <PageWrapper showFloatingButton={false}>
      <div>
        <ServiceDetailsHero data={data.hero} />

        <div className="container mx-auto xl:px-32 max-md:px-4 max-xl:px-4 max-2xl:px-0">
          <WhatWeProvide data={data.whatWeProvide} />
          <WhoThisIsFor data={data.whoThisIsFor} />
          <YouWillGet data={data.youWillGet} />
          <StreamlinedProcess data={data.streamlinedProcess} />
          <OptionalAdd data={data.optionalAdd} />
        </div>
        <div className="container mx-auto">
          <LandingWork />
        </div>
        <div className="container mx-auto xl:px-32 max-md:px-4 max-xl:px-4 max-2xl:px-0 mb-24">
          <TryBeforeCommit />
        </div>
      </div>
    </PageWrapper>
  );
};

export default ServiceDetails;
