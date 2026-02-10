"use client";

import { useState, useCallback, useEffect, useRef, memo } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import NextLink from "next/link";
import { useIsMobile } from "@/hooks";
import { AnimatedButton } from "@/components/AnimatedButton";
import LetsTalkButton from "@/components/LetsTalkButton";

const data = [
  {
    heading: "heading 1",
    subtitle: "subtitle 1",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025336/xperiti_ptjxaa.svg",
  },
  {
    heading: "heading 2",
    subtitle: "subtitle 2",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025188/frytx_mo0frx.svg",
  },
  {
    heading: "heading 3",
    subtitle: "subtitle 3",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025189/brahma_zbxs7g.svg",
  },
  {
    heading: "heading 3",
    subtitle: "subtitle 3",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025336/olso_rgvl9a.svg",
  },
  {
    heading: "heading 3",
    subtitle: "subtitle 3",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025333/rings_gnmm1x.svg",
  },
  {
    heading: "heading 2",
    subtitle: "subtitle 2",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025332/ion_hhwrup.svg",
  },
];

interface BehanceImageProps {
  item: (typeof data)[0];
  index: number;
  isMobile: boolean;
  containerScrollProgress: MotionValue<number>;
}

// Animation configuration per row
const getRowConfig = (index: number, isMobile: boolean) => {
  const isEven = index % 2 === 0;
  const row = Math.floor(index / 2);

  // X movement: left images go left, right images go right
  const xTarget = isMobile
    ? isEven
      ? "-90%"
      : "90%"
    : isEven
      ? "-70%"
      : "70%";

  // Y movement varies by row
  const yTargets = isMobile
    ? ["-20%", "-20%", "-20%"]
    : ["90%", "40%", "-60%"];
  const yTarget = yTargets[row] || "-20%";

  // Rotation: only on desktop
  const rotateTarget = isMobile ? 0 : isEven ? -45 : 45;

  // Staggered scroll ranges for smooth "flower blooming" effect
  // Rows overlap slightly for smoother transition
  // Row 0: 0.00 - 0.50
  // Row 1: 0.20 - 0.70
  // Row 2: 0.40 - 0.90
  const staggerDelay = 0.20; // 20% delay between each row starting
  const animationDuration = 0.50; // Each row animates over 50% of scroll (slower)

  const scrollStart = row * staggerDelay;
  const scrollEnd = scrollStart + animationDuration;

  return { xTarget, yTarget, rotateTarget, scrollStart, scrollEnd };
};

const BehanceImage = memo(function BehanceImage({
  item,
  index,
  isMobile,
  containerScrollProgress,
}: BehanceImageProps) {
  const { xTarget, yTarget, rotateTarget, scrollStart, scrollEnd } = getRowConfig(index, isMobile);

  // Transform scroll progress to animation values
  const x = useTransform(containerScrollProgress, [scrollStart, scrollEnd], ["0%", xTarget]);
  const y = useTransform(containerScrollProgress, [scrollStart, scrollEnd], ["0%", yTarget]);
  const rotate = useTransform(containerScrollProgress, [scrollStart, scrollEnd], [0, rotateTarget]);

  return (
    <div
      className="relative w-full h-full"
      style={{ pointerEvents: "none", zIndex: 1 }}
    >
      <motion.img
        alt={item.heading}
        className="w-full h-full object-fill rounded-[30px] grayscale-[25%] box-shadow"
        src={item.img}
        style={{ x, y, rotate }}
      />
    </div>
  );
});

const LandingBehanceFramor = memo(function LandingBehanceFramor() {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleData, setVisibleData] = useState(data.slice(0, 6));

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 99%", "end 0%"],
  });

  const updateVisibleData = useCallback(() => {
    const isMobileCheck = window.innerWidth <= 768;
    setVisibleData(isMobileCheck ? data.slice(0, 4) : data.slice(0, 6));
  }, []);

  useEffect(() => {
    updateVisibleData();
    window.addEventListener("resize", updateVisibleData);
    return () => window.removeEventListener("resize", updateVisibleData);
  }, [updateVisibleData]);

  return (
    <div className="relative">
      {/* Centered Info */}
      <div
        className="absolute inset-1 flex flex-col items-center justify-center text-center z-[1]"
        id="info"
      >
        <p className="heading-center px-12 max-md:px-4 max-lg:px-12 mb-6 mt-6 w-1/2 max-md:text-xl autoShow">
          Recent Works
        </p>
        <p className="text-center text-lg px-32 font-[500] max-md:px-0 max-lg:px-12 mb-12  w-1/2 max-md:text-lg autoShow">
          Explore our diverse portfolio of projects that highlight our
          creativity and craftsmanship.
        </p>
        <div className="autoShow">
    
        <LetsTalkButton fullWidth variant="dark" children="Explore All Work" href="/ourWorks"/>
        </div>
      </div>

      {/* Image Grid with Overlap */}
      <div
        ref={containerRef}
        className="relative grid grid-cols-2 gap-12 max-md:gap-4 overflow-x-hidden overflow-y-auto py-20 pb-0 max-md:py-12 max-lg:py-40 max-md:grid-cols-1 hide-scrollbar px-32 max-md:px-4"
      >
        {visibleData.map((item, index) => (
          <BehanceImage
            key={index}
            item={item}
            index={index}
            isMobile={isMobile}
            containerScrollProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
});

export default LandingBehanceFramor;
