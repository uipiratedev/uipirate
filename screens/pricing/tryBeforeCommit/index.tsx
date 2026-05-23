"use client";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/react";

import GlassBadge from "@/components/GlassBadge";
import LetsTalkButton from "@/components/LetsTalkButton";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const PILOT_OPTIONS = [
  { type: "Design", price: "150", description: "UI/UX design sprint" },
  { type: "Development", price: "250", description: "Code implementation" },
  { type: "Design + Dev", price: "350", description: "Full-stack delivery" },
];

const TryBeforeCommit = () => {
  return (
    <motion.div
      className="mt-8"
      initial="hidden"
      variants={fadeUp}
      viewport={{ once: true, amount: 0.2 }}
      whileInView="show"
    >
      {/* Main Card - Dark Theme */}
      <Card className="rounded-[24px] max-md:rounded-[16px] bg-gradient-to-br from-[#212121] to-[#151514] border border-gray-800 shadow-xl noise-texture overflow-hidden">
        <CardBody className="p-8 max-md:p-5">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <GlassBadge className="text-white" variant="gradient">
              ZERO RISK
            </GlassBadge>
          </div>

          {/* Heading */}
          <h2 className="text-3xl max-md:text-2xl font-bold text-white text-center mb-3">
            5-Day <span className="text-brand-orange">Pilot Project</span>
          </h2>

          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-8 max-md:text-sm">
            Test our work before committing. See real results in 5 days — your
            fee is
            <span className="text-white font-semibold">
              {" "}
              fully deductible
            </span>{" "}
            from the final project invoice.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-brand-orange/20 flex items-center justify-center">
                  <span className="text-xl">🧩</span>
                </div>
                <h4 className="text-white font-semibold">
                  Low-Risk, High-Value
                </h4>
              </div>
              <p className="text-gray-400 text-sm">
                Your pilot fee is deducted from the final invoice when you
                continue with a full project.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-brand-orange/20 flex items-center justify-center">
                  <span className="text-xl">⚡</span>
                </div>
                <h4 className="text-white font-semibold">Real Deliverables</h4>
              </div>
              <p className="text-gray-400 text-sm">
                Walk away with a working mini-build or polished design — ready
                to scale.
              </p>
            </div>
          </div>

          {/* Pricing Options */}
          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4 mb-8">
            {PILOT_OPTIONS.map((option) => (
              <div
                key={option.type}
                className="bg-white/5 border border-white/10 hover:border-brand-orange/30 rounded-xl p-4 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300 bg-white/10 px-3 py-1 rounded-full">
                    {option.type}
                  </span>
                  <span className="text-2xl font-bold text-white font-jetbrains-mono">
                    <span className="text-base text-gray-400">$</span>
                    {option.price}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{option.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <LetsTalkButton className="px-8" variant="color">
              Start Your Pilot Project
            </LetsTalkButton>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Limited slots available each month
            </p>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default TryBeforeCommit;
