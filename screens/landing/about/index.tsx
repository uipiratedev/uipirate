import AboutCardAnimation from "./aboutCard";
const LandingAbout = () => {
  return (
    <>
      <div className=" container mx-auto lg:px-12 max-md:px-4  pt-32 max-md:pt-24 ">
        <div className="autoShow">
          <div className="flex flex-row  items-center justify-center mb-6 ">
            <span className="bg-[#8EF1F1] px-4 py-2 rounded-xl font-semibold border-cyan-400 border-2">
              ABOUT US
            </span>
          </div>
          <h2 className="heading-center">Who We Are</h2>
          <div className="flex flex-col items-center justify-center px-28 mb-8 mt-3 max-md:px-3">
            <p className="md:w-1/2 text-center content-center font-semibold pb-2 max-lg:px-4 max-md:px-0 font[500]">
              Your Product Design Partners for SaaS, AI, and Modern Tech
            </p>
            <p className="md:w-1/2 text-center content-center   max-lg:px-4 max-md:px-0 font[500]">
              We blend clean design, scalable systems, and intuitive UX to help
              startups and product teams bring digital products to life, faster,
              smarter, and beautifully built.
            </p>
          </div>
        </div>
      </div>{" "}
      <div
        style={{ overflowX: "hidden" }}
        className="mx-auto px-32 lg:px-20 max-md:px-4 "
      >
        <AboutCardAnimation />
      </div>
    </>
  );
};

export default LandingAbout;
