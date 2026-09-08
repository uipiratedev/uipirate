import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/motion";

const MiniService = () => {
  return (
    <div className="section-container">
      <Reveal variant="up">
        <SectionHeader chip="Design & Development">
          <span className="text-gray-900">We design products that ship.</span>
          <br /> <span className="text-brand-orange ">You launch them.</span>
        </SectionHeader>
      </Reveal>
    </div>
  );
};

export default MiniService;
