import GlassBadge from "@/components/GlassBadge";
import ServicesSection from "./servicesSection";
const LandingBusinessHelp = () => {
  return (
    <>
      <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
        <div className="autoShow">
          <div className="flex flex-row items-center justify-center mb-6">
            <GlassBadge variant="gradient">SERVICES</GlassBadge>
          </div>
          <h2 className="heading-center">What We Design, Build, & Scale</h2>
        </div>
        <ServicesSection />
      </div>
    </>
  );
};

export default LandingBusinessHelp;
