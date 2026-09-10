"use client";

import SectionHeader from "@/components/SectionHeader";
import { Reveal, RevealGroup } from "@/components/motion";

const PLACEHOLDER_IMAGE =
  "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788206604/founder_gnnfbf.svg";

const WhoThisIsFor = ({ data }: { data: any }) => {
  return (
    <section className="section-container">
      <Reveal variant="up">
        <SectionHeader chip={data.badge}>{data.heading}</SectionHeader>
      </Reveal>

      {/* Cards */}
      <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.card?.map((item: any) => (
          <Reveal
            key={item.heading}
            as="article"
            className="group relative h-[240px] w-full [perspective:1000px] md:h-[280px]"
            variant="up"
          >
            <div className="relative h-full w-full rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-transform duration-500 [transform-style:preserve-3d] group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] group-hover:[transform:rotateY(180deg)] dark:group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)]">
              {/* FRONT FACE */}
              <div className="absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-[24px] border border-gray-200/80 bg-white [backface-visibility:hidden] dark:border-white/10 dark:bg-[#1A1A1A]">
                <div className="relative flex h-[180px] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#FFF5EE] to-white md:h-[220px] dark:from-[#26201D] dark:to-[#1A1A1A]">
                  <img
                    alt={item.heading}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={PLACEHOLDER_IMAGE}
                  />
                </div>
                <div className="flex flex-1 flex-col items-center justify-start p-3 pb-8">
                  <h3 className="text-lg font-bold uppercase tracking-tight text-slate-900 md:text-[19px] dark:text-white text-center">
                    {item.heading}
                  </h3>
                </div>
              </div>

              {/* BACK FACE */}
              <div className="absolute inset-0 flex h-full w-full flex-col items-start justify-start rounded-[24px] border border-gray-200/80 bg-white p-8 text-left [backface-visibility:hidden] [transform:rotateY(180deg)] dark:border-white/10 dark:bg-[#1A1A1A]">
                <h3 className="mb-4 mt-2 text-lg font-bold uppercase tracking-tight text-slate-900 md:text-[20px] dark:text-white">
                  {item.heading}
                </h3>
                <p className="text-sm font-normal leading-relaxed text-slate-500 md:text-[14.5px] dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
};

export default WhoThisIsFor;
