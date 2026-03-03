import GlassBadge from "@/components/GlassBadge";
import RecentWorkCard from "@/screens/landing/works/workCard";
import CaseStudyGrid from "./workCard";
import WhyChooseUs from "@/screens/landing/whyChoosUs";

const Works = () => {
  return (
    <div className="pt-12 max-md:pt-6">
      <div className="autoShow">
        <div className="mb-6 flex flex-row items-center justify-center">
          <GlassBadge variant="gradient">works</GlassBadge>
        </div>
        <p className="heading-center">Recent Works</p>
      </div>
      <div className="container mx-auto px-32 lg:px-20 max-md:px-4 mt-6 max-md:mt-4">
        {/* <RecentWorkCard /> */}
        <CaseStudyGrid />
        <WhyChooseUs />
      </div>
    </div>
  );
};

export default Works;
