import GlassBadge from "@/components/GlassBadge";

const MiniService = () => {
  return (
    <div className="section-container">
      <div className="autoShow">
        <div className="flex flex-row items-center justify-center mb-6">
          <GlassBadge variant="gradient">Design & Development</GlassBadge>
        </div>
        <h2 className="heading-center mb-8">
          <span className="text-gray-900">We design products that ship.</span>
          <br /> <span className="text-brand-orange ">You launch them.</span>
        </h2>
      </div>
    </div>
  );
};

export default MiniService;
