"use client";
import ProjectEstimate from "@/components/ProjectEstimate";
import Pricing from "../landing/pricing";
import CaseStudyCard from "./caseStudies";
import OurWorksHero from "./hero";
import OurProcess from "./ourProcess";
import Works from "./works";

import PageWrapper from "@/components/PageWrapper";
import GlassBadge from "@/components/GlassBadge";

const OurWorks = () => {
  return (
    <PageWrapper showFloatingButton={false}>
      <div className="mb-12">
        <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
          <OurWorksHero />
        </div>
        <Works />
        <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
          <div className="mb-12">
              <div className="autoShow">
        <div className="mb-6 flex flex-row items-center justify-center">
          <GlassBadge variant="gradient">pricing</GlassBadge>
        </div>
        <p className="heading-center">Pricing That Makes Sense</p>
      </div>
      <div className="autoShowBottom mt-6 max-md:mt-4">
        <ProjectEstimate />
        </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default OurWorks;
