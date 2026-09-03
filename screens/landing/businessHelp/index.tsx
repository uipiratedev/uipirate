import ServicesSection from "./servicesSection";

import GlassBadge from "@/components/GlassBadge";

const LandingBusinessHelp = () => {
  return (
    <div className="section-container">
      <div className="autoShow">
        <div className="flex flex-row items-center justify-center mb-6">
          <GlassBadge variant="gradient">SERVICES</GlassBadge>
        </div>
        <h2 className="heading-center">
          What We{" "}
          <span className="text-brand-orange"> Design, Build, & Scale</span>
        </h2>
      </div>
      <div className="autoShowBottom">
        <ServicesSection />
      </div>
    </div>
  );
};

export default LandingBusinessHelp;
