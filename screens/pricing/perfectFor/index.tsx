"use client";
import { motion } from "framer-motion";

import GlassBadge from "@/components/GlassBadge";

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
    <motion.div
      className="section-container"
      initial={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="text-center mb-12 max-md:mb-8">
        <div className="flex justify-center mb-4">
          <GlassBadge variant="gradient">WHO IT'S FOR</GlassBadge>
        </div>
        <h2 className="heading-center">
          Is This Right For <span className="text-brand-orange">You?</span>
        </h2>
      </div>

      {/* Perfect For Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {PERFECT_FOR.map((item, index) => (
          <motion.div
            key={item.title}
            className="group relative h-[240px] md:h-[280px] w-full [perspective:1000px]"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] dark:group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)]">
              {/* FRONT FACE */}
              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] flex flex-col overflow-hidden rounded-[24px] bg-white dark:bg-[#1A1A1A] border border-gray-200/80 dark:border-white/10">
                <div className="relative w-full h-[180px] md:h-[220px] overflow-hidden bg-gradient-to-b from-[#FFF5EE] to-white dark:from-[#26201D] dark:to-[#1A1A1A] flex items-center justify-center">
                  <img
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={item.image}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-start items-start p-3 pb-0">
                  <h3 className="text-lg md:text-[19px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* BACK FACE */}
              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-start items-start p-8 rounded-[24px] bg-white dark:bg-[#1A1A1A] border border-gray-200/80 dark:border-white/10 text-left">
                <h3 className="text-lg md:text-[20px] font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-4 mt-2">
                  {item.title}
                </h3>
                <p className="text-sm md:text-[14.5px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Not The Right Fit Section */}
      <motion.div
        className="relative w-full overflow-hidden rounded-[20px] border border-slate-200/70 dark:border-white/[0.05]"
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="relative z-10 flex flex-col lg:flex-row p-8 md:p-10 gap-10 lg:gap-16 items-start lg:items-center">
          {/* Left Side: Title */}
          <div className="lg:w-2/5 shrink-0">
            <img src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1788348516/not_sysbyc.svg" alt="" />
            <h3 className="text-[26px] md:text-[30px] leading-tight font-semibold tracking-tight text-slate-900 dark:text-white mt-8">
              <span style={{ color: NOT_RIGHT_FIT_RED }}>NOT</span> the right
              fit
            </h3>
            <p className="mt-3 max-w-[340px] text-[#777777] dark:text-slate-400 text-[15px] font-normal leading-relaxed">
              We're a highly specialized team, not a generalist agency. If you
              need any of these, we recommend looking elsewhere.
            </p>
          </div>

          {/* Right Side: List */}
          <div className="flex-1 w-full">
            {NOT_FOR.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
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
                    className="shrink-0 flex items-center justify-center text-base md:text-lg font-bold"
                    style={{ color: NOT_RIGHT_FIT_RED }}
                  >
                    <i className="ti ti-x" />
                  </span>
                  <span className="flex-1 text-slate-700 dark:text-slate-200 text-[15px] md:text-base font-medium tracking-tight">
                    {item.text}
                  </span>
                  <span
                    className="shrink-0 inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-lg md:text-xl"
                    style={{ color: NOT_RIGHT_FIT_RED }}
                  >
                    <i className={item.icon} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PricingPerfectFor;
