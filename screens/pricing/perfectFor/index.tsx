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
      "No in-house design team, but a product that needs to keep moving. We plug in as your design and dev partner.",
    image:
      "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788206599/saascom_f00rd5.svg",
  },
  {
    title: "AGENCIES",
    description:
      "Your team is at capacity. We work as a white-label partner on client projects — no handoff friction, full execution.",
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

const NOT_FOR = [
  { text: "Physical product design", icon: "✕" },
  { text: "One-off logo or branding projects", icon: "✕" },
  { text: "24/7 instant turnaround expectations", icon: "✕" },
];

const PricingPerfectFor = () => {
  return (
    <motion.div
      className="py-12 max-md:py-8 container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32"
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
        <h2 className="heading-center">Is This Right For You?</h2>
      </div>

      {/* Perfect For Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {PERFECT_FOR.map((item, index) => (
          <motion.div
            key={item.title}
            className="group flex flex-col overflow-hidden rounded-[24px] bg-white border border-[#E5E7EB] shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {/* Top 3D Illustration Area */}
            <div className="relative w-full h-[180px] md:h-[195px] overflow-hidden bg-gradient-to-b from-[#FFF5EE] to-white flex items-center justify-center">
              <img
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src={item.image}
              />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6 pt-5">
              <h3 className="text-lg md:text-[19px] font-bold text-[#0F172A] uppercase tracking-tight mb-2.5">
                {item.title}
              </h3>
              <p className="text-sm md:text-[14.5px] text-[#64748B] font-normal leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Not For Section - Premium Dark Card */}
      <motion.div
        className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-gray-800 rounded-2xl p-6 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {/* Subtle glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/5 blur-3xl pointer-events-none" />

        <p className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-5 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-[10px]">
            ✕
          </span>
          Not the right fit
        </p>

        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4">
          {NOT_FOR.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 hover:bg-white/[0.05] transition-colors"
              initial={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-base flex-shrink-0">
                {item.icon}
              </span>
              <span className="text-gray-500 text-sm">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PricingPerfectFor;
