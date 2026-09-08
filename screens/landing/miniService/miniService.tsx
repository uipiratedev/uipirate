import SectionHeader from "@/components/SectionHeader";

const MiniService = () => {
  return (
    <div className="section-container">
      <SectionHeader chip="Design & Development" className="autoShow">
        <span className="text-gray-900">We design products that ship.</span>
        <br /> <span className="text-brand-orange ">You launch them.</span>
      </SectionHeader>
    </div>
  );
};

export default MiniService;
