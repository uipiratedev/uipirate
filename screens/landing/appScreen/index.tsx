"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const LandingAppScreen = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress within the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Transform scroll progress to animation values
  // Left image: rotate from -6deg to 0deg
  const leftRotate = useTransform(scrollYProgress, [0, 1], [-6, 0]);

  // Right image: rotate from 6deg to 0deg
  const rightRotate = useTransform(scrollYProgress, [0, 1], [6, 0]);

  // Center image: paddingTop from 160px (pt-40) to 0
  const centerPaddingTop = useTransform(scrollYProgress, [0, 1], [160, 0]);

  return (
    <>
      <div
        ref={containerRef}
        className="flex flex-row items-center justify-center gap-8 mt-4 appTrigger container mx-auto max-md:gap-4"
      >
        <motion.img
          alt="app"
          className="max-md:w-[40%]"
          loading="lazy"
          src="https://res.cloudinary.com/damm9iwho/image/upload/v1729768861/Frame_1984078758_tkh9ag.svg"
          style={{ rotate: leftRotate }}
        />
        <motion.img
          alt="app"
          className="max-lg:hidden"
          loading="lazy"
          src="https://res.cloudinary.com/damm9iwho/image/upload/v1731054843/middleImage_ggzymj.svg"
          style={{ paddingTop: centerPaddingTop }}
        />
        <motion.img
          alt="app"
          className="max-md:w-[40%]"
          loading="lazy"
          src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753847870/Ai_APp_mockup_y0mt4j.svg"
          style={{ rotate: rightRotate }}
        />
      </div>
    </>
  );
};

export default LandingAppScreen;
