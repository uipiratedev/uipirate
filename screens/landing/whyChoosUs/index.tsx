"use client";

import GlassBadge from "@/components/GlassBadge";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import {
  VisualSaaSComplexity,
  VisualDesignHandoff,
  VisualAIFirstUX,
  VisualScaleConvert,
  VisualFastDelivery,
} from "./WhyChooseUsVisuals";

const WhyChooseUs = () => {
  return (
    <section className="w-full py-8 pb-0 min-h-screen section-container">
      <div className="mb-0">
        <div className="mb-6 flex flex-row items-center justify-center">
          <GlassBadge variant="gradient">WHY CHOOSE US</GlassBadge>
        </div>
        <h2 className="heading-center mb-10">
          Why SaaS & AI Teams{" "}
          <span className="text-brand-orange">Choose UI Pirate</span>?
        </h2>
      </div>

      <div className="w-full">
        <ScrollStack useWindowScroll={true}>
          <ScrollStackItem itemClassName="bg-[#1E1B4B] text-white">
            <div className="flex flex-row max-md:flex-col justify-between h-full items-center gap-6 max-md:gap-4">
              <div className="flex flex-col justify-between h-full w-[55%] max-md:w-full">
                <div className="flex flex-col h-full">
                  <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4 tracking-tight leading-tight">
                    Simplifying SaaS Complexity
                  </h3>
                  <p className="text-sm sm:text-base md:text-base lg:text-lg opacity-90 leading-relaxed">
                    We understand data-heavy workflows, permissions, onboarding,
                    multi-roles, and enterprise behaviour patterns.
                  </p>
                </div>
                <p className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold max-md:absolute max-md:top-4 max-md:right-6">
                  1
                </p>
              </div>
              <div className="w-[42%] max-md:w-full flex items-center justify-center flex-shrink-0 mt-4 md:mt-0">
                <div className="w-full max-w-[320px] lg:max-w-[360px] h-[200px] sm:h-[220px] md:h-[240px] rounded-2xl overflow-hidden bg-black/20 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center">
                  <VisualSaaSComplexity />
                </div>
              </div>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="bg-[#111111] text-white">
            <div className="flex flex-row max-md:flex-col justify-between h-full items-center gap-6 max-md:gap-4">
              <div className="flex flex-col justify-between h-full w-[55%] max-md:w-full">
                <div className="flex flex-col h-full">
                  <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4 tracking-tight leading-tight">
                    Premium UI + Precise Handoff
                  </h3>
                  <p className="text-sm sm:text-base md:text-base lg:text-lg opacity-90 leading-relaxed">
                    Documentation, tokens, spacing, states — developers love
                    working with us.
                  </p>
                </div>
                <p className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold max-md:absolute max-md:top-4 max-md:right-6">
                  2
                </p>
              </div>
              <div className="w-[42%] max-md:w-full flex items-center justify-center flex-shrink-0 mt-4 md:mt-0">
                <div className="w-full max-w-[320px] lg:max-w-[360px] h-[200px] sm:h-[220px] md:h-[240px] rounded-2xl overflow-hidden bg-black/20 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center">
                  <VisualDesignHandoff />
                </div>
              </div>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="bg-[#2563EB] text-white">
            <div className="flex flex-row max-md:flex-col justify-between h-full items-center gap-6 max-md:gap-4">
              <div className="flex flex-col justify-between h-full w-[55%] max-md:w-full">
                <div className="flex flex-col h-full">
                  <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4 tracking-tight leading-tight">
                    AI-First UX Expertise
                  </h3>
                  <p className="text-sm sm:text-base md:text-base lg:text-lg opacity-90 leading-relaxed">
                    We design predictable, trustworthy AI interactions — prompt
                    flows, confidence UI, output validation and more.
                  </p>
                </div>
                <p className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold max-md:absolute max-md:top-4 max-md:right-6">
                  3
                </p>
              </div>
              <div className="w-[42%] max-md:w-full flex items-center justify-center flex-shrink-0 mt-4 md:mt-0">
                <div className="w-full max-w-[320px] lg:max-w-[360px] h-[200px] sm:h-[220px] md:h-[240px] rounded-2xl overflow-hidden bg-black/20 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center">
                  <VisualAIFirstUX />
                </div>
              </div>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="bg-[#E40063] text-white">
            <div className="flex flex-row max-md:flex-col justify-between h-full items-center gap-6 max-md:gap-4">
              <div className="flex flex-col justify-between h-full w-[55%] max-md:w-full">
                <div className="flex flex-col h-full">
                  <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4 tracking-tight leading-tight">
                    Designs that scale & convert
                  </h3>
                  <p className="text-sm sm:text-base md:text-base lg:text-lg opacity-90 leading-relaxed">
                    We deliver clean, documented systems that reduce dev effort
                    by 30–40%.
                  </p>
                </div>
                <p className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold max-md:absolute max-md:top-4 max-md:right-6">
                  4
                </p>
              </div>
              <div className="w-[42%] max-md:w-full flex items-center justify-center flex-shrink-0 mt-4 md:mt-0">
                <div className="w-full max-w-[320px] lg:max-w-[360px] h-[200px] sm:h-[220px] md:h-[240px] rounded-2xl overflow-hidden bg-black/20 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center">
                  <VisualScaleConvert />
                </div>
              </div>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="bg-[#FF5B04] text-white">
            <div className="flex flex-row max-md:flex-col justify-between h-full items-center gap-6 max-md:gap-4">
              <div className="flex flex-col justify-between h-full w-[55%] max-md:w-full">
                <div className="flex flex-col h-full">
                  <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4 tracking-tight leading-tight">
                    Fast & Structured Delivery
                  </h3>
                  <p className="text-sm sm:text-base md:text-base lg:text-lg opacity-90 leading-relaxed">
                    Weekly milestones, clean communication, and consistent
                    delivery make your product move 2× faster.
                  </p>
                </div>
                <p className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold max-md:absolute max-md:top-4 max-md:right-6">
                  5
                </p>
              </div>
              <div className="w-[42%] max-md:w-full flex items-center justify-center flex-shrink-0 mt-4 md:mt-0">
                <div className="w-full max-w-[320px] lg:max-w-[360px] h-[200px] sm:h-[220px] md:h-[240px] rounded-2xl overflow-hidden bg-black/20 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center">
                  <VisualFastDelivery />
                </div>
              </div>
            </div>
          </ScrollStackItem>
        </ScrollStack>
      </div>
    </section>
  );
};

export default WhyChooseUs;
