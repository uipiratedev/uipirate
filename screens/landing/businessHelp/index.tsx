import ServicesSection from "./servicesSection";

import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/motion";

const LandingBusinessHelp = () => {
  return (
    <div className="section-container">
      <Reveal variant="up">
        <SectionHeader chip="SERVICES">
          What We{" "}
          <span className="text-brand-orange"> Design, Build, & Scale</span>
        </SectionHeader>
      </Reveal>
      <ServicesSection />
    </div>
  );
};

export default LandingBusinessHelp;
