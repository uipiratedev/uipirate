"use client";

import { notFound } from "next/navigation";

import LandingWork from "../landing/works";

import ServiceDetailsHero from "./hero";
import StreamlinedProcess from "./streamlinedProcess";
import WhoThisIsFor from "./whoThisIsFor";
import RecommendedNextSteps from "./recommendedNextSteps";
import WhyThisMatters from "./whyThisMatters";
import WhatYouGetAnimations from "./whatYouGetAnimations";
import WhatYouGain from "./whatYouGain";

import PageWrapper from "@/components/PageWrapper";

const ServiceDetails = ({ data, slug }: { data: any, slug?: string }) => {
  if (!data) notFound();

  return (
    <PageWrapper showFloatingButton={false}>
      <div className="space-y-20 max-md:space-y-16">
        {data.hero && <ServiceDetailsHero data={data.hero} />}

        {data.whatYouGet && <WhatYouGetAnimations data={data.whatYouGet} />}

        {data.whyThisMatters && (
          <div className="section-container">
            <WhyThisMatters data={data.whyThisMatters} />
          </div>
        )}

        {data.streamlinedProcess && (
          <StreamlinedProcess data={data.streamlinedProcess} />
        )}

        {data.whatYouGain && (
          <div className="section-container">
            <WhatYouGain data={data.whatYouGain} />
          </div>
        )}

        {slug !== "UX-Audits-&-Consultation" && <LandingWork />}

        {data.whoThisIsFor && (
          <div className="section-container">
            <WhoThisIsFor data={data.whoThisIsFor} />
          </div>
        )}

        {data.recommendedNextSteps && (
          <div className="section-container pb-20">
            <RecommendedNextSteps data={data.recommendedNextSteps} />
          </div>
        )}

      </div>
    </PageWrapper>
  );
};

export default ServiceDetails;
