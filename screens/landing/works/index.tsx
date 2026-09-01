import React from "react";

import RecentWorkCard from "./workCard";

import GlassBadge from "@/components/GlassBadge";

const LandingWork = () => {
  return (
    <div className="overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32">
        <div className="autoShow">
          <div className="flex flex-row items-center justify-center mb-6 pt-3">
            <GlassBadge variant="gradient">works</GlassBadge>
          </div>
          <h2 className="heading-center">Recent Works</h2>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32 pt-48 max-md:pt-0 autoShowBottom">
        <RecentWorkCard />
      </div>
    </div>
  );
};

export default LandingWork;
