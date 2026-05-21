import GlassBadge from "@/components/GlassBadge";

const MiniService = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 pt-4 max-md:pt-0">
      <div className="autoShow">
        <div className="flex flex-row items-center justify-center mb-6">
          <GlassBadge variant="gradient">Design & Development</GlassBadge>
        </div>
        <h2 className="heading-center mb-8">
          <span className="text-gray-900">We design world-class products.</span>
          <br className="max-md:hidden" />{" "}
          <span className="text-brand-orange ">You launch them.</span>
        </h2>
      </div>
    </div>
  );
};

export default MiniService;
