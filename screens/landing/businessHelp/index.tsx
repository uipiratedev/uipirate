import ServicesSection from "./servicesSection";

import SectionHeader from "@/components/SectionHeader";

const LandingBusinessHelp = () => {
  return (
    <div className="section-container">
      <SectionHeader chip="SERVICES" className="autoShow">
        What We{" "}
        <span className="text-brand-orange"> Design, Build, & Scale</span>
      </SectionHeader>
      <ServicesSection />
    </div>
  );
};

export default LandingBusinessHelp;
