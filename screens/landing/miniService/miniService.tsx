import GlassBadge from "@/components/GlassBadge";

const MiniService = () => {
  return (
    <>
      <div className=" container mx-auto lg:px-0 max-md:px-4  pt-4 max-md:pt-0 ">
        <div className="autoShow">
          <div className="flex flex-row  items-center justify-center mb-6 ">
            <GlassBadge variant="gradient">Design & Development</GlassBadge>
          </div>
          <h2 className="heading-center">
            We design world-class products.
            <br />
            <span className="text-brand-orange">You launch them.</span>
          </h2>
          <div className="flex flex-col items-center justify-center px-0 mb-8 mt-3 max-md:px-3">
            <p className=" text-center content-center max-lg:px-4 max-md:px-0 font-[500] text-[#777777]">
              From strategic UX to scalable frontend architecture, we are the
              product team you wish you had in-house.
            </p>
          </div>
        </div>
      </div>{" "}
      <div
        className="mx-auto px-32 lg:px-20 max-md:px-4 "
        style={{ overflowX: "hidden" }}
      ></div>
    </>
  );
};

export default MiniService;
