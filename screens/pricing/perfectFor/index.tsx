"use client";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/react";
import GlassBadge from "@/components/GlassBadge";
import { CheckIcon } from "@/components/icons";

const PERFECT_FOR = [
  {
    title: "Funded Startups",
    description: "Ship fast and impress investors with premium UI",
  },
  {
    title: "SaaS Companies",
    description: "Without in-house design, needing consistent updates",
  },
  {
    title: "Agencies",
    description: "White-label design support for client projects",
  },
  {
    title: "Enterprise Teams",
    description: "Overflow design capacity without hiring",
  },
];

const NOT_FOR = [
  "Physical product design",
  "One-off logo or branding projects",
  "24/7 instant turnaround expectations",
];

const PricingPerfectFor = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="py-12 max-md:py-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <GlassBadge variant="gradient">FIT CHECK</GlassBadge>
        </div>
        <h2 className="heading-center">
          Is This Right For You?
        </h2>
      </div>

      {/* Main Card - Dark Theme */}
      <Card className="rounded-[20px] max-md:rounded-[12px] bg-gradient-to-br from-[#212121] to-[#151514] border border-gray-800 shadow-lg noise-texture">
        <CardBody className="p-8 max-md:p-5">
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6">
            {/* Perfect For */}
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center">
                  <CheckIcon />
                </span>
                Perfect for
              </h4>
              <ul className="space-y-3">
                {PERFECT_FOR.map((item, index) => (
                  <motion.li
                    key={item.title}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-brand-orange mt-1 flex-shrink-0">
                      <CheckIcon />
                    </span>
                    <div>
                      <p className="text-white font-medium text-sm">{item.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{item.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Not For */}
            <div>
              <h4 className="text-gray-400 font-semibold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-gray-500 text-xs">
                  ✕
                </span>
                Not ideal for
              </h4>
              <ul className="space-y-3">
                {NOT_FOR.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3 text-gray-500 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default PricingPerfectFor;
