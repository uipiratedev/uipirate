import { useState } from "react";
import GlassBadge from "@/components/GlassBadge";

const problemItems = [
  {
    number: 1,
    label: "PRODUCT COMPLEXITY",
    description: "Why do SaaS and AI products feel complex or hard to use?",
    answer:
      "Many SaaS and AI products feel complex or hard to use because they try to do too much at once.",
  },
  {
    number: 2,
    label: "BREAKS DURING BUILD",
    description: "Design breaks once you start building the product.",
    answer:
      "Designs break once you start building the product because they don’t account for the real data and content that will appear.",
  },
  {
    number: 3,
    label: "LOOKS VS RESULTS",
    description: "Visuals look good but don’t actually drive signups or usage.",
    answer:
      "Visuals look good but don’t actually drive signups or usage because they don’t explain anything.",
  },
  {
    number: 4,
    label: "LONG–TERM SCALE",
    description: "Hard to scale the same visual language across new features.",
    answer:
      "It’s hard to scale the same visual language across new features because most design systems are built around components, not user flows.",
  },
  {
    number: 5,
    label: "HIDDEN CHURN",
    description:
      "Users quietly drop off because nothing explains what to do next.",
    answer:
      "Users quietly drop off because nothing explains what to do next.",
  },
];

const WhyThisMatters = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <section className="pt-24 max-md:pt-20 pb-24">
      {/* Header */}
      <div className="autoShow text-center mb-10 md:mb-14">
        <div className="flex items-center justify-center mb-3">
          <GlassBadge variant="gradient">WHY THIS MATTERS</GlassBadge>
        </div>
        <h2 className="heading-center">
          Why Most Visuals Fail To Create Impact
        </h2>
        <p className="mt-1 heading-center">
          (And How We Fix It)
        </p>
      </div>

      {/* Content row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 md:gap-8 items-start">
        {/* Left column: Accordion */}
        <div className="flex flex-col gap-3">
          {problemItems.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={item.number}
                onClick={() => setActiveIndex(idx)}
                className={`group cursor-pointer w-full rounded-3xl border transition-all duration-300 flex flex-col ${
                  isActive
                    ? "bg-[#F0F0F0] border-white/8 "
                    : "bg-white border-transparent hover:bg-white/50"
                }`}
              >
                {/* Header */}
                <div className="flex items-center gap-4 bg-white rounded-full border border-black/10 p-2">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300 ${
                      isActive
                        ? "bg-[#FF5B04] text-white"
                        : " text-white bg-[#FF5B04] group-hover:text-white"
                    }`}
                  >
                    {item.number}
                  </span>
                  <span
                    className={`text-[13px] font-bold tracking-[0.12em] uppercase transition-colors duration-300 ${
                      isActive ? "text-[#0F172A]" : "text-gray-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>

                {/* Expanded Content (Accordion Body) */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isActive
                      ? "grid-rows-[1fr] opacity-100 mt-3"
                      : "grid-rows-[0fr] opacity-0 mt-0"
                  }`}
                >
                  <div className="overflow-hidden pb-4">
                    <p className="text-[15px] text-[#475569] leading-relaxed pl-[48px]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: Dynamic Content */}
        <div className="lg:sticky lg:top-24 rounded-[20px] max-md:rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] shadow-[0_20px_45px_rgba(15,23,42,0.08)] px-8 py-10 md:px-10 md:py-12 min-h-[300px] flex flex-col justify-center transition-all duration-500">
          <div key={activeIndex} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <h3 className="text-xl md:text-2xl font-bold text-[#0F172A] mb-6 leading-tight">
               {problemItems[activeIndex].description}
             </h3>
             <div className="w-12 h-1 bg-[#FF5B04] mb-6 rounded-full opacity-20" />
             <p className="text-base md:text-lg text-[#334155] leading-relaxed font-medium">
               {problemItems[activeIndex].answer}
             </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyThisMatters;
