"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import GlassBadge from "@/components/GlassBadge";
import { PROCESS_STEPS } from "@/data/process";

// Condensed 3-step view of the real 6-step process (data/process.ts) — same
// content, grouped, so the homepage and /process never say different things.
const GROUPS = [
  {
    title: "Listen & Think",
    steps: [PROCESS_STEPS[0], PROCESS_STEPS[1]],
  },
  {
    title: "Plan & Design",
    steps: [PROCESS_STEPS[2], PROCESS_STEPS[3]],
  },
  {
    title: "Build & Ship",
    steps: [PROCESS_STEPS[4], PROCESS_STEPS[5]],
  },
];

const MiniProcess = () => {
  return (
    <div className="container mx-auto px-32 lg:px-20 max-md:px-4">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <GlassBadge variant="gradient">how it works</GlassBadge>
        </div>
        <h2 className="heading-center">From Idea to Shipped, in 3 Steps</h2>
      </div>

      <div className="grid grid-cols-3 max-md:grid-cols-1 gap-6">
        {GROUPS.map((group, i) => (
          <motion.div
            key={group.title}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-brand-orange/40 hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-orange/10 text-brand-orange font-mono font-bold text-sm mb-4">
              0{i + 1}
            </span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {group.title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {group.steps.map((s) => s.description).join(" ")}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Link
          className="text-brand-orange font-semibold text-sm hover:underline"
          href="/process"
        >
          See the full process →
        </Link>
      </div>
    </div>
  );
};

export default MiniProcess;
