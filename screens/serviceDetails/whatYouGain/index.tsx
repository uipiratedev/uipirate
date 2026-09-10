"use client";

import GlassBadge from "@/components/GlassBadge";
import { Reveal, RevealGroup } from "@/components/motion";

const WhatYouGain = ({ data }: { data: any }) => {
  return (
    <section>
      {/* Header */}
      <Reveal variant="up">
        <div className="autoShow text-center mb-6 md:mb-10">
          <div className="flex items-center justify-center mb-6">
            <GlassBadge variant="gradient">{data.badge}</GlassBadge>
          </div>
          <h2 className="heading-center">{data.heading}</h2>
        </div>
      </Reveal>

      {/* Cards */}
      <RevealGroup className="grid grid-cols-1 gap-5 md:grid-cols-2 autoShowBottom">
        {data.card?.map((item: any) => (
          <Reveal
            key={item.heading}
            as="article"
            className="flex h-full flex-col rounded-[20px] border border-gray-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] md:p-7 dark:border-white/10 dark:bg-[#1A1A1A]"
            variant="up"
          >
            <span className="mb-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF5B04] text-white">
              <svg
                fill="none"
                height="16"
                viewBox="0 0 24 24"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
              </svg>
            </span>
            <h3 className="text-[18px] font-semibold leading-snug tracking-tight text-slate-900 md:text-[20px] dark:text-white">
              {item.heading}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-slate-500 md:text-[15.5px] dark:text-slate-400">
              {item.description}
            </p>
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
};

export default WhatYouGain;
