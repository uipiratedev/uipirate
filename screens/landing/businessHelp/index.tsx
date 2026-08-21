import ServicesSection from "./servicesSection";

import GlassBadge from "@/components/GlassBadge";

const LandingBusinessHelp = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32">
      <div className="autoShow">
        <div className="flex flex-row items-center justify-center mb-6">
          <GlassBadge variant="gradient">SERVICES</GlassBadge>
        </div>
        <h2 className="heading-center">What We Design, Build, & Scale</h2>
      </div>
      <div className="autoShowBottom">
        <ServicesSection />
      </div>
    </div>
  );
};

export default LandingBusinessHelp;
