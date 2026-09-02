import React from "react";

import RecentWorkCard from "./workCard";

import GlassBadge from "@/components/GlassBadge";

const LandingWork = () => {
  return (
    <div className="overflow-hidden">
      <div className="section-container">
        <div className="autoShow">
          <div className="flex flex-row items-center justify-center mb-6 pt-3">
            <GlassBadge variant="gradient">works</GlassBadge>
          </div>
          <h2 className="heading-center">Recent Works</h2>
        </div>
      </div>
      <div className="section-container pt-48 max-md:pt-0 autoShowBottom">
        <RecentWorkCard />
      </div>
    </div>
  );
};

export default LandingWork;
