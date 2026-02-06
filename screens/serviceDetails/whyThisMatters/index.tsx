import { useState } from "react";
import GlassBadge from "@/components/GlassBadge";

const problemItems = [
  {
    number: 1,
    label: "PRODUCT COMPLEXITY",
    description: "Why do SaaS and AI products feel complex or hard to use?",
  },
  {
    number: 2,
    label: "BREAKS DURING BUILD",
    description: "Design breaks once you start building the product.",
  },
  {
    number: 3,
    label: "LOOKS VS RESULTS",
    description: "Visuals look good but don’t actually drive signups or usage.",
  },
  {
    number: 4,
    label: "LONG–TERM SCALE",
    description: "Hard to scale the same visual language across new features.",
  },
  {
    number: 5,
    label: "HIDDEN CHURN",
    description:
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
        <h2 className="text-3xl md:text-[32px] font-bold text-[#0F172A] leading-tight">
          Why Most Visuals Fail To Create Impact
        </h2>
        <p className="mt-1 text-xl md:text-[22px] font-semibold text-[#0F172A]">
          (And How We Fix It)
        </p>
      </div>

      {/* Content row */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-6 md:gap-8 items-stretch">
        {/* Left column: numbered reasons */}
        <div className="space-y-3">
          {problemItems.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.number}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={
                  (isActive
                    ? "shadow-[0_18px_45px_rgba(15,23,42,0.12)] py-4 "
                    : "shadow-[0_10px_25px_rgba(15,23,42,0.06)] py-3 hover:shadow-[0_14px_30px_rgba(15,23,42,0.10)] ") +
                  "w-full rounded-[999px] bg-white border border-[#E2E8F0] px-5 flex items-center text-left transition-shadow"
                }
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF5B04] text-white text-sm font-semibold">
                    {item.number}
                  </span>
                  <span className="text-[12px] md:text-[13px] font-semibold tracking-[0.12em] text-[#0F172A] uppercase">
                    {item.label}
                  </span>
                </div>

                {isActive && (
                  <p className="md:ml-6 ml-4 text-sm md:text-[15px] text-[#111827] leading-relaxed">
                    {item.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Right column: explanation card */}
        <div className="rounded-[32px] bg-white border border-[#E2E8F0] shadow-[0_20px_45px_rgba(15,23,42,0.08)] px-7 py-10 md:px-9 md:py-12 flex flex-col justify-between">
          <p className="text-[18px] md:text-[20px] font-semibold text-[#111827] leading-relaxed mb-10">
            Because they don’t explain anything.
          </p>
          <p className="text-sm md:text-[15px] text-[#111827] leading-relaxed max-w-md">
            We design visuals that guide decisions, not just decorate screens.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyThisMatters;
