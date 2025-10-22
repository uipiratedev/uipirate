"use client";

import LandingFaqs from "../landing/faqs";
import LandingWork from "../landing/works";
import ServiceDetailsHero from "./hero";
import OptionalAdd from "./optionalAdd";
import StreamlinedProcess from "./streamlinedProcess";
import WhatWeProvide from "./whatWeProvide";
import WhoThisIsFor from "./whoThisIsFor";
import YouWillGet from "./youWillGet";

const ServiceDetails = ({ data }: any) => {
  if (!data) return <div>danis...</div>;

  return (
    <div>
      <ServiceDetailsHero data={data.hero} />

      <div className="container mx-auto xl:px-32 max-md:px-4 max-xl:px-4 max-2xl:px-0">
        <WhatWeProvide data={data.whatWeProvide} />
        <WhoThisIsFor data={data.whoThisIsFor} />
        <YouWillGet data={data.youWillGet} />
        <StreamlinedProcess data={data.streamlinedProcess} />
        <OptionalAdd data={data.optionalAdd} />
        <LandingWork />
        <LandingFaqs />
      </div>
    </div>
  );
};

export default ServiceDetails;
