"use client";
import React from "react";

import { ClientLogosGrid } from "@/components/ClientLogos";
import { Reveal } from "@/components/motion";

const LandingMarquee = () => {
  return (
    <div className="relative overflow-hidden bg-white py-6 max-md:py-6">
      {/* Subtle grid background - much softer, fades at edges, almost invisible */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
          opacity: 0.5,
        }}
      />

      <div className="container relative z-10 mx-auto flex flex-col items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-32">
        {/* Section heading */}
        <Reveal
          className="mx-auto mb-12 max-w-4xl px-8 text-center max-md:mb-8 max-md:px-0"
          variant="up"
        >
          <h2 className="heading-center">
            Trusted by product teams
            <br />{" "}
            <span className="text-gray-900">
              across the USA, UK, Singapore & India
            </span>
          </h2>
        </Reveal>

        {/* Global Client Logos Grid */}
        <ClientLogosGrid />
      </div>
    </div>
  );
};

export default LandingMarquee;
