import GlassBadge from "@/components/GlassBadge";
import RecentWorkCard from "@/screens/landing/works/workCard";

const Works = () => {
  return (
    <div className="pt-12 max-md:pt-6">
      <div className="autoShow">
        <div className="mb-6 flex flex-row items-center justify-center">
          <GlassBadge variant="gradient">works</GlassBadge>
        </div>
        <p className="heading-center">Recent Works</p>
      </div>
      <div className="px-32 max-md:px-4 overflow-x-hidden overflow-y-auto pt-48 max-md:pt-12">
        <RecentWorkCard />
      </div>
    </div>
  );
};

export default Works;
