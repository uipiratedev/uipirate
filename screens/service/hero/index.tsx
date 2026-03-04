"use client";

import { motion } from "framer-motion";
import GlassSurface from "@/components/GlassSurface";

const ServiceHero = () => {
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
    <div className="flex flex-row items-center justify-center py-6 w-full max-md:py-0 max-md:pt-1 relative ">
      {/* Subtle Grid Background Pattern */}
      <div
        className="absolute pointer-events-none -mt-20 "
        style={{
          backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
            `,
          backgroundSize: "40px 40px",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          marginLeft: "calc(-50vw + 50%)",
        }}
      />
      {/* Layered gradient with gentle mist animation */}
      <div
        className="absolute pointer-events-none -mt-20 "
        style={{
          backgroundImage: `
              linear-gradient(to top, rgba(250, 250, 250, 1), transparent 10%),
              linear-gradient(to top, rgba(250, 250, 250, 1) 0%, transparent 35%)
            `,
          animation: "gentle-mist 8s ease-in-out infinite",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          marginLeft: "calc(-50vw + 50%)",
        }}
      />
      <div
        className="flex flex-col items-center justify-center w-full relative z-10 container mx-auto "
        style={{ overflow: "visible" }}
      >
        {/* Floating & animated icons */}
        <motion.div
          className="flex justify-center items-center gap-6 max-md:gap-3 mb-6 relative z-10"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
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
        </motion.div>

        {/* Badge with GlassSurface */}
        <GlassSurface
          backgroundOpacity={0.1}
          blueOffset={20}
          blur={11}
          borderRadius={12}
          borderWidth={0.01}
          brightness={50}
          className="md:my-9 max-md:my-5 !flex !flex-row !items-center !gap-3 isolate overflow-visible p-2 px-4 max-md:mx-2"
          displace={0.5}
          distortionScale={-180}
          forceLightMode={true}
          greenOffset={10}
          height="auto"
          opacity={0.93}
          redOffset={0}
          saturation={1}
          style={{
            animation: "trustBadgeUp 0.5s ease-out forwards",
            animationDelay: "0.1s",
            opacity: 0,
            transform: "translateY(20px) scale(0.95)",
          }}
          width="auto"
        >
          {/* Text */}
          <p className="badge-text relative z-10 max-md:text-xs uppercase font-semibold tracking-wider">
            7 CORE SERVICES. 1 SEAMLESS WORKFLOW
          </p>
        </GlassSurface>

        {/* Headline */}
        <div className="relative z-10 w-full">
          <h1 className="text-[40px] 3xl:text-[80px] 2xl:text-[74px] xl:text-[61px] lg:text-[48px] px-4 text-center font-[700] max-md:font-[600] max-md:leading-[1.08] max-md:px-1 tracking-[-1.5px] leading-[1.1] relative reveal-text-anim">
            <span className="text-black">Design + Development Services for </span>
            <span className="text-[#FF5B04]">SaaS, Tech & AI Products</span>
          </h1>
        </div>

        {/* Subheading */}
        <p className="reveal-text-anim-1 max-w-[820px] 2xl:max-w-[1000px] text-center text-lg 2xl:text-xl max-md:text-sm mt-4 md:my-4 2xl:px-3 px-4 leading-[25.2px] 2xl:leading-[32px] text-gray-600">
          Scalable design, clean code, and polished visuals, all under one roof.
        </p>
      </div>
    </div>
  );
};

export default ServiceHero;
