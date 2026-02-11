import React from "react";

import RecentWorkCard from "./workCard";
import GlassBadge from "@/components/GlassBadge";

const LandingWork = () => {
  return (
    <>
      <div className="container mx-auto xl:px-40 2xl:px-48 max-md:px-4 pt-32 max-md:pt-24 max-xl:px-4 max-2xl:px-0">
        <div className="autoShow">
          <div className="flex flex-row items-center justify-center mb-6">
            <GlassBadge variant="gradient">works</GlassBadge>
          </div>
          <p className="heading-center">Recent Works</p>
          
        </div>
      </div>
      <div className="px-32 max-md:px-4 overflow-x-hidden overflow-y-auto pt-48 max-md:pt-12">
        <RecentWorkCard />
      </div>

    </>
  );
};

export default LandingWork;
