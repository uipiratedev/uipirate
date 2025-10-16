"use client";
import React from "react";
import FluidSimulation from "fluid-simulation-react";

const MyComponent = () => {
  const customConfig = {
    textureDownsample: 2,
    densityDissipation: 0.8,
  };
  const customColors = [
    [1, 1, 0], // Yellow
    [1, 1, 0], // Cyan
  ];
  return (
    <>
      <FluidSimulation config={customConfig} color={customColors} />
    </>
  );
};

export default MyComponent;
