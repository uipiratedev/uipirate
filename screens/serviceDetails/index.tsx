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

const ServiceDetails = ({ data, slug }: { data: any; slug?: string }) => {
  if (!data) notFound();

  return (
    <PageWrapper showFloatingButton={false}>
      {/* One vertical rhythm for the whole page — identical to the landing
          page's wrapper. Each section owns its own `.section-container`;
          nothing here adds per-section padding or margin. */}
      <div className="space-y-20 max-md:space-y-16">
        {data.hero && <ServiceDetailsHero data={data.hero} />}

        {data.whatYouGet && <WhatYouGetAnimations data={data.whatYouGet} />}

        {data.whyThisMatters && <WhyThisMatters data={data.whyThisMatters} />}

        {data.streamlinedProcess && (
          <StreamlinedProcess data={data.streamlinedProcess} />
        )}

        {data.whatYouGain && <WhatYouGain data={data.whatYouGain} />}

        {slug !== "UX-Audits-&-Consultation" && <LandingWork />}

        {data.whoThisIsFor && <WhoThisIsFor data={data.whoThisIsFor} />}

        {data.recommendedNextSteps && (
          <RecommendedNextSteps data={data.recommendedNextSteps} />
        )}
      </div>
    </PageWrapper>
  );
};

export default ServiceDetails;
