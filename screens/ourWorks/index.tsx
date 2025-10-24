"use client";
import CaseStudyCard from "./caseStudies";
import OurWorksHero from "./hero";
import OurProcess from "./ourProcess";
import Works from "./works";

const OurWorks = () => {
  return (
    <div className="mb-12">
      <div className="container mx-auto xl:px-32 max-md:px-4 max-xl:px-4 max-2xl:px-0">
        <OurWorksHero />
      </div>
      <Works />
      <div className="container mx-auto xl:px-32 max-md:px-4 max-xl:px-4 max-2xl:px-0">
        <OurProcess />
        <CaseStudyCard />
      </div>
    </div>
  );
};

export default OurWorks;
