"use client";
import { motion } from "framer-motion";

import GlassBadge from "@/components/GlassBadge";

// Pattern backgrounds matching service pages
const patternBackgrounds = [
  "bg-[repeating-linear-gradient(135deg,#E4F7E9,#E4F7E9_12px,#F7FFF9_12px,#F7FFF9_24px)]", // Green
  "bg-[repeating-linear-gradient(135deg,#FFF1C9,#FFF1C9_12px,#FFFBEA_12px,#FFFBEA_24px)]", // Yellow
  "bg-[repeating-linear-gradient(135deg,#EDE8FF,#EDE8FF_12px,#F7F5FF_12px,#F7F5FF_24px)]", // Purple
  "bg-[repeating-linear-gradient(135deg,#FFE8E0,#FFE8E0_12px,#FFF5F2_12px,#FFF5F2_24px)]", // Orange/Peach
];

const PERFECT_FOR = [
  {
    title: "Funded Startups",
    description:
      "Ship fast and impress investors with premium UI that stands out in competitive markets.",
    image:
      "https://res.cloudinary.com/dvk9ttiym/image/upload/v1771828331/sass_em8jqs.svg",
  },
  {
    title: "SaaS Companies",
    description:
      "Without in-house design teams, needing consistent updates and design system maintenance.",
    image:
      "https://res.cloudinary.com/dvk9ttiym/image/upload/v1771828331/tems_mhv5e9.svg",
  },
  {
    title: "Agencies",
    description:
      "White-label design support for client projects when your team is at capacity.",
    image:
      "https://res.cloudinary.com/dvk9ttiym/image/upload/v1771831381/creator_qzziot.svg",
  },
  {
    title: "Enterprise Teams",
    description:
      "Overflow design capacity without the overhead of hiring full-time designers.",
    image:
      "https://res.cloudinary.com/dvk9ttiym/image/upload/v1771831381/brand_qbdqtq.svg",
  },
];

const NOT_FOR = [
  { text: "Physical product design", icon: "📦" },
  { text: "One-off logo or branding projects", icon: "🎨" },
  { text: "24/7 instant turnaround expectations", icon: "⏰" },
];

const PricingPerfectFor = () => {
  return (
    <motion.div
      className="py-12 max-md:py-8"
      initial={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <GlassBadge variant="gradient">FIT CHECK</GlassBadge>
        </div>
        <h2 className="heading-center">Is This Right For You?</h2>
        <p className="text-gray-500 mt-2">Perfect for</p>
      </div>

      {/* Perfect For Cards - Service Page Style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 max-md:grid-cols-1 gap-5 mb-8">
        {PERFECT_FOR.map((item, index) => (
          <motion.div
            key={item.title}
            className="group flex flex-col overflow-hidden rounded-[20px] max-md:rounded-[12px] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] border border-[#0000000f] hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {/* Illustration area with pattern */}
            <div
              className={`relative h-36 ${patternBackgrounds[index % patternBackgrounds.length]}`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0,#ffffff,transparent_55%)] opacity-60" />
              <img
                alt={item.title}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-auto group-hover:scale-110 transition-transform duration-300"
                src={item.image}
              />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col px-5 py-5">
              <h3 className="text-base font-bold text-black leading-snug uppercase tracking-[0.04em]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
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
              <span className="text-gray-400 text-sm">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PricingPerfectFor;
