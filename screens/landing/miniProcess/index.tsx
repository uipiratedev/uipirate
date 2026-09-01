"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import GlassBadge from "@/components/GlassBadge";

const GROUPS = [
  {
    step: "01",
    title: "Listen & Think",
    description:
      "We start by understanding your vision, analyzing competitors, and defining the product strategy that will set you apart.",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788205201/listen_ylvngt.svg",
  },
  {
    step: "02",
    title: "Plan & Design",
    description:
      "From user flows to high-fidelity prototypes, we design intuitive interfaces focused on driving user engagement.",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788205201/plan_mhuu0h.svg",
  },
  {
    step: "03",
    title: "Build & Ship",
    description:
      "We deliver production-ready code and handle deployment, ensuring your product scales seamlessly as you grow.",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788205201/build_nq0h2a.svg",
  },
];

const MiniProcess = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 xl:px-32 pt-16 pb-20 max-md:pt-10 max-md:pb-12">
      <div className="text-center mb-12 max-md:mb-8">
        <div className="flex justify-center mb-4">
          <GlassBadge variant="gradient">how it works</GlassBadge>
        </div>
        <h2 className="heading-center">From Idea to Shipped, <span className="text-brand-orange">in 3 Steps</span></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {GROUPS.map((group, i) => (
          <motion.div
            key={group.title}
            className={`group relative bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:border-gray-300 transition-all duration-300 overflow-hidden flex flex-col justify-between ${i === 2
                ? "md:col-span-2 lg:col-span-1 md:max-w-md md:mx-auto md:w-full lg:max-w-none"
                : "md:col-span-1"
              }`}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {/* Step watermark touching top-right */}
            <span className="absolute -top-3 md:-top-3 -right-1 text-[72px] md:text-[84px] font-bold text-[#ECEEF1] select-none leading-none tracking-tight font-jakarta pointer-events-none">
              {group.step}
            </span>

            {/* SVG Icon */}
            <div className="w-12 h-12 mb-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img
                alt={group.title}
                className="w-full h-full object-contain"
                src={group.icon}
              />
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-xl md:text-[22px] font-bold text-[#0F172A] mb-2 tracking-tight">
                {group.title}
              </h3>
              <p className="text-[#64748B] font-normal text-sm md:text-[15px] leading-relaxed">
                {group.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Link
          className="text-brand-orange font-semibold text-sm hover:underline flex items-center gap-1.5 transition-all hover:gap-2.5"
          href="/process"
        >
          See the full process <span>→</span>
        </Link>
      </div>
    </div>
  );
};

export default MiniProcess;
