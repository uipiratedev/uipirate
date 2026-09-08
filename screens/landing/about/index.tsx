import AboutCardAnimation from "./aboutCard";

import SectionHeader from "@/components/SectionHeader";

const LandingAbout = () => {
  return (
    <section className="overflow-x-hidden">
      <div className="section-container">
        <SectionHeader chip="Our journey so far" className="autoShow">
          What We{" "}
          <span className="text-brand-orange"> Design, Build, & Scale</span>
        </SectionHeader>
      </div>
      <div className="section-container">
        <AboutCardAnimation />
      </div>
    </section>
  );
};

export default LandingAbout;
