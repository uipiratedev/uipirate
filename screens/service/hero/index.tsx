"use client";

import { motion } from "framer-motion";

const ServiceHero = () => {
  // Container animation for staggered appearance
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  // Fade up for text
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  // Icon entrance + subtle floating animation
  const iconMotion = (delay = 0) => ({
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    show: {
      opacity: 1,
      y: [0, -6, 0],
      scale: 1,
      transition: {
        opacity: { duration: 0.6, delay },
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 0.5, delay },
      },
    },
  });

  const icons = [
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760602433/heroimg1_mhagbz.svg",
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760717024/Shopping_Website_wfxxl7.png",
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760717023/img3_epoumw.png",
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760602434/heroimg4_ffm4ip.svg",
    "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760602415/heroimg5_dolrel.svg",
  ];

  return (
    <motion.section
      className="relative pt-16 md:pt-24 flex flex-col items-center text-center overflow-hidden"
      initial="hidden"
      variants={container}
      viewport={{ once: true, amount: 0.4 }}
      whileInView="show"
    >
      {/* Floating & animated icons */}
      <div className="flex justify-center items-center gap-6 max-md:gap-3 mb-6 relative z-10">
        {icons.map((src, i) => (
          <motion.img
            key={i}
            alt={`icon-${i + 1}`}
            className={`w-12 md:w-32 ${
              i === 2 ? "-mt-8" : i === 1 || i === 3 ? "-mt-4" : ""
            }`}
            src={src}
            variants={iconMotion(i * 0.2)}
          />
        ))}
      </div>

      {/* Badge */}
      <motion.div
        className="p-2 px-4 rounded-xl bg-[#8EF1F1] border-cyan-400 border-2 mb-6 shadow-sm"
        variants={fadeUp}
      >
        <p className="text-center uppercase text-xs max-md:text-[10px] font-medium tracking-wider">
          7 CORE SERVICES. 1 SEAMLESS WORKFLOW
        </p>
      </motion.div>

      {/* Heading */}
      <motion.h1
        className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-4 text-gray-900"
        variants={fadeUp}
      >
        Design + Development Services for SaaS, Tech & AI Products
      </motion.h1>

      {/* Subheading */}
      <motion.p
        className="reveal-text-anim-1 lg:w-3/4 text-center text-lg max-md:text-sm mb-8 px-40 max-md:px-4 font-sans leading-[25.2px]"
        variants={fadeUp}
      >
        Scalable design, clean code, and polished visuals, all under one roof.
      </motion.p>
    </motion.section>
  );
};

export default ServiceHero;
