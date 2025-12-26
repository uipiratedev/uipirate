import GlassBadge from "@/components/GlassBadge";
import AboutCardAnimation from "./aboutCard";
const LandingAbout = () => {
  return (
    <>
      <div className=" container mx-auto lg:px-12 max-md:px-4  pt-12 max-md:pt-0 ">
        <div className="autoShow">
          <div className="flex flex-row  items-center justify-center mb-6 ">
            <GlassBadge variant="gradient">our achievements</GlassBadge>
          </div>
          <h2 className="heading-center">
            <span className="text-brand-orange">Our journey</span>
            so far
          </h2>
        </div>
      </div>{" "}
      <div
        className="mx-auto px-32 lg:px-20 max-md:px-4 "
        style={{ overflowX: "hidden" }}
      >
        <AboutCardAnimation />
      </div>
    </>
  );
};

export default LandingAbout;
