"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useTransform } from "framer-motion";

import SectionHeader from "@/components/SectionHeader";
import { Reveal, RevealGroup, useSectionProgress } from "@/components/motion";

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const progress = useSectionProgress(sectionRef);

  // Scroll-linked connector: the line behind the 3 cards draws left→right
  // as the section transits the middle of the viewport. Desktop only.
  const lineScaleX = useTransform(progress, [0.15, 0.55], [0, 1]);

  return (
    <div ref={sectionRef} className="section-container">
      <Reveal variant="up">
        <SectionHeader chip="how it works">
          From Idea to Shipped,{" "}
          <span className="text-brand-orange">in 3 Steps</span>
        </SectionHeader>
      </Reveal>

      <div className="relative">
        {/* Connector line (behind cards) */}
        {!reduced && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-[76px] hidden h-px origin-left bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent lg:block"
            style={{ scaleX: lineScaleX }}
          />
        )}

        <RevealGroup
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          stagger="loose"
        >
          {GROUPS.map((group, i) => (
            <Reveal
              key={group.title}
              as="article"
              className={`group relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-[border-color,box-shadow] duration-300 hover:border-gray-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] ${
                i === 2
                  ? "md:col-span-2 md:mx-auto md:w-full md:max-w-md lg:col-span-1 lg:max-w-none"
                  : "md:col-span-1"
              }`}
              variant="bloom"
            >
              {/* Step watermark touching top-right */}
              <span className="pointer-events-none absolute -right-1 -top-3 select-none font-jakarta text-[72px] font-bold leading-none tracking-tight text-[#ECEEF1] md:-top-3 md:text-[84px]">
                {group.step}
              </span>

              {/* SVG Icon */}
              <div className="mb-6 flex h-12 w-12 items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <img
                  alt={group.title}
                  className="h-full w-full object-contain"
                  src={group.icon}
                />
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="mb-2 text-xl font-bold tracking-tight text-[#0F172A] md:text-[22px]">
                  {group.title}
                </h3>
                <p className="text-sm font-normal leading-relaxed text-[#64748B] md:text-[15px]">
                  {group.description}
                </p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </div>

      <Reveal className="mt-10 flex justify-center" delay={0.15} variant="fade">
        <Link
          className="flex items-center gap-1.5 text-sm font-semibold text-brand-orange transition-[gap] hover:gap-2.5 hover:underline"
          href="/process"
        >
          See the full process <span>→</span>
        </Link>
      </Reveal>
    </div>
  );
};

export default MiniProcess;
