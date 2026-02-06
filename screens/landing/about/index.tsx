import AboutCardAnimation from "./aboutCard";

import GlassBadge from "@/components/GlassBadge";
const LandingAbout = () => {
  return (
    <>
      <div className=" container mx-auto lg:px-12 max-md:px-4  pt-12 max-md:pt-0 ">
        <div className="autoShow">
          <div className="flex flex-row  items-center justify-center">
            <GlassBadge variant="gradient">Our journey so far</GlassBadge>
          </div>
        </div>
      </div>
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
