import AboutCardAnimation from "./aboutCard";

import GlassBadge from "@/components/GlassBadge";

const LandingAbout = () => {
  return (
    <section className="overflow-x-hidden">
      <div className="section-container">
        <div className="autoShow">
          <div className="flex flex-row items-center justify-center mb-6">
            <GlassBadge variant="gradient">Our journey so far</GlassBadge>
          </div>
        </div>
      </div>
      <div className="section-container autoShowBottom">
        <AboutCardAnimation />
      </div>
    </section>
  );
};

export default LandingAbout;
