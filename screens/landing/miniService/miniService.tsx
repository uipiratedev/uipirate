import GlassBadge from "@/components/GlassBadge";

const MiniService = () => {
  return (
    <>
      <div className=" container mx-auto lg:px-0 max-md:px-4  pt-4 max-md:pt-0 ">
        <div className="autoShow">
          <div className="flex flex-row  items-center justify-center mb-6  ">
            <GlassBadge variant="gradient">Design & Development</GlassBadge>
          </div>
          <h2 className="heading-center">
            We design world-class products.
            <br />
            <span className="text-brand-orange">You launch them.</span>
          </h2>
        </div>
      </div>{" "}
    </>
  );
};

export default MiniService;
