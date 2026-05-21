import AboutCardAnimation from "./aboutCard";
import GlassBadge from "@/components/GlassBadge";

const LandingAbout = () => {
  return (
    <section className="overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 pt-12 max-md:pt-8">
        <div className="autoShow">
          <div className="flex flex-row items-center justify-center">
            <GlassBadge variant="gradient">Our journey so far</GlassBadge>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 autoShowBottom">
        <AboutCardAnimation />
      </div>
    </section>
  );
};

export default LandingAbout;
