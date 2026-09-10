"use client";

import { notFound } from "next/navigation";

import ServiceDetailsHero from "./hero";
import StreamlinedProcess from "./streamlinedProcess";
import WhoThisIsFor from "./whoThisIsFor";
import RecommendedNextSteps from "./recommendedNextSteps";
import WhyThisMatters from "./whyThisMatters";
import WhatYouGetAnimations from "./whatYouGetAnimations";
import WhatYouGain from "./whatYouGain";
import FeaturedCaseStudy from "@/screens/landing/featuredCaseStudy";

import PageWrapper from "@/components/PageWrapper";

const xperitiCaseStudy = {
  slug: "xperiti",
  client: "Xperiti",
  title: "Platform Redesign and Development",
  excerpt:
    "Xperiti needed a market research enterprise SaaS platform serving researchers, coordinators, clients, and experts, without anyone feeling completely overlooked.",
  heroImage:
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788348051/xperiti_gkefw0.svg",
  highlights: [
    "UI/UX",
    "Market Research SaaS",
    "Multi-role enterprise SaaS",
    "Angular and Tailwind",
  ],
  clientLogo:
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760593625/xperiti_shp94q.svg",
  industry: "Research SaaS",
};

const ServiceDetails = ({ data, slug }: { data: any, slug?: string }) => {
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

        <FeaturedCaseStudy study={xperitiCaseStudy} />

        {data.whoThisIsFor && <WhoThisIsFor data={data.whoThisIsFor} />}

        {data.recommendedNextSteps && (
          <RecommendedNextSteps data={data.recommendedNextSteps} />
        )}
      </div>
    </PageWrapper>
  );
};

export default ServiceDetails;
