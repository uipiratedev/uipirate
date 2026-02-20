import React from "react";

import RecentWorkCard from "./workCard";
import GlassBadge from "@/components/GlassBadge";

const LandingWork = () => {
  return (
    <div className="overflow-hidden">
      <div className="container mx-auto px-32 lg:px-20 max-md:px-4 ">
        <div className="autoShow">
          <div className="flex flex-row items-center justify-center mb-6 pt-3">
            <GlassBadge variant="gradient">works</GlassBadge>
          </div>
          <p className="heading-center">Recent Works</p>
          
        </div>
      </div>
      <div className="container mx-auto px-32 lg:px-20 max-md:px-4 pt-48 max-md:pt-12">
        <RecentWorkCard />
      </div>
    </div>
  );
};

export default LandingWork;
