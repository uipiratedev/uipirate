import RecentWorkCard from "./workCard";

import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/motion";

const LandingWork = () => {
  return (
    <div className="overflow-hidden">
      <div className="section-container">
        <Reveal variant="up">
          <SectionHeader chip="works">Recent Works</SectionHeader>
        </Reveal>
      </div>
      <div className="section-container">
        <RecentWorkCard />
      </div>
    </div>
  );
};

export default LandingWork;
