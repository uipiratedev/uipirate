"use client";

import SectionHeader from "@/components/SectionHeader";
import { Reveal, RevealGroup } from "@/components/motion";

const PERFECT_FOR = [
  {
    title: "FUNDED STARTUPS",
    description:
      "You raised a round. Now you need a product that looks as good as the idea you pitched. We help you ship it.",
    image:
      "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788206604/founder_gnnfbf.svg",
  },
  {
    title: "SAAS COMPANIES",
    description:
      "You lack an in-house design team, but your product needs to keep moving. We plug in as your dedicated design and dev partner.",
    image:
      "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788206599/saascom_f00rd5.svg",
  },
  {
    title: "AGENCIES",
    description:
      "When your team reaches capacity, we step in as your white-label execution partner. We handle the design and dev so you can deliver.",
    image:
      "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788206602/agencise_z7olwt.svg",
  },
  {
    title: "ENTERPRISE TEAMS",
    description:
      "Overflow design capacity without the overhead of hiring. Plug us in when your team needs more bandwidth.",
    image:
      "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788206597/enterpriseteams_kx1dw5.svg",
  },
];

const NOT_RIGHT_FIT_RED = "#F5333F";

const NOT_FOR = [
  { text: "Physical product design", icon: "ti ti-package" },
  { text: "One-off logo or branding projects", icon: "ti ti-palette" },
  { text: "24/7 instant turnaround expectations", icon: "ti ti-hours-24" },
];

const PricingPerfectFor = () => {
  return (
    <div className="section-container">
      <Reveal variant="up">
        <SectionHeader chip="WHO IT'S FOR">
          Is This Right For <span className="text-brand-orange">You?</span>
        </SectionHeader>
      </Reveal>

      {/* Perfect For Cards */}
      <RevealGroup className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PERFECT_FOR.map((item) => (
          <Reveal
            key={item.title}
            as="article"
            className="group relative h-[240px] w-full [perspective:1000px] md:h-[280px]"
            variant="up"
          >
            <div className="relative h-full w-full rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-transform duration-500 [transform-style:preserve-3d] group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] group-hover:[transform:rotateY(180deg)] dark:group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)]">
              {/* FRONT FACE */}
              <div className="absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-[24px] border border-gray-200/80 bg-white [backface-visibility:hidden] dark:border-white/10 dark:bg-[#1A1A1A]">
                <div className="relative flex h-[180px] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#FFF5EE] to-white md:h-[220px] dark:from-[#26201D] dark:to-[#1A1A1A]">
                  <img
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={item.image}
                  />
                </div>
                <div className="flex flex-1 flex-col items-center justify-start p-3 pb-8">
                  <h3 className="text-lg font-bold uppercase tracking-tight text-slate-900 md:text-[19px] dark:text-white">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* BACK FACE */}
              <div className="absolute inset-0 flex h-full w-full flex-col items-start justify-start rounded-[24px] border border-gray-200/80 bg-white p-8 text-left [backface-visibility:hidden] [transform:rotateY(180deg)] dark:border-white/10 dark:bg-[#1A1A1A]">
                <h3 className="mb-4 mt-2 text-lg font-bold uppercase tracking-tight text-slate-900 md:text-[20px] dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm font-normal leading-relaxed text-slate-500 md:text-[14.5px] dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </RevealGroup>

      {/* Not The Right Fit Section */}
      <Reveal
        className="relative w-full overflow-hidden rounded-[20px] border border-slate-200/70 dark:border-white/[0.05]"
        variant="up"
        distance="lg"
      >
        <div className="relative z-10 flex flex-col items-start gap-10 p-8 md:p-10 lg:flex-row lg:items-center lg:gap-16">
          {/* Left Side: Title */}
          <div className="shrink-0 lg:w-2/5">
            <img
              alt=""
              src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1788348516/not_sysbyc.svg"
            />
            <h3 className="mt-8 text-[26px] font-semibold leading-tight tracking-tight text-slate-900 md:text-[30px] dark:text-white">
              <span style={{ color: NOT_RIGHT_FIT_RED }}>NOT</span> the right fit
            </h3>
            <p className="mt-3 max-w-[340px] text-[15px] font-normal leading-relaxed text-[#777777] dark:text-slate-400">
              We&apos;re a highly specialized team, not a generalist agency. If
              you need any of these, we recommend looking elsewhere.
            </p>
          </div>

          {/* Right Side: List */}
          <RevealGroup className="w-full flex-1" stagger="base">
            {NOT_FOR.map((item, index) => (
              <Reveal key={item.text} distance="sm" variant="up">
                {index > 0 && (
                  <div
                    className="h-px w-full"
                    style={{
                      background:
                        index === 2
                          ? "linear-gradient(90deg, rgba(255,150,120,0.5) 0%, rgba(203,213,225,0.45) 42%, rgba(203,213,225,0) 100%)"
                          : "linear-gradient(90deg, rgba(203,213,225,0.8) 0%, rgba(203,213,225,0.45) 55%, rgba(203,213,225,0) 100%)",
                    }}
                  />
                )}
                <div className="flex items-center gap-4 py-3">
                  <span
                    className="flex shrink-0 items-center justify-center text-base font-bold md:text-lg"
                    style={{ color: NOT_RIGHT_FIT_RED }}
                  >
                    <i className="ti ti-x" />
                  </span>
                  <span className="flex-1 text-[15px] font-medium tracking-tight text-slate-700 md:text-base dark:text-slate-200">
                    {item.text}
                  </span>
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white text-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:h-10 md:w-10 md:text-xl dark:border-white/10 dark:bg-white/[0.03]"
                    style={{ color: NOT_RIGHT_FIT_RED }}
                  >
                    <i className={item.icon} />
                  </span>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </Reveal>
    </div>
  );
};

export default PricingPerfectFor;
