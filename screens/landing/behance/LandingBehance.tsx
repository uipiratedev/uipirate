"use client";

import { useState, useCallback, useEffect, useRef, memo } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

import { useIsMobile } from "@/hooks";
import LetsTalkButton from "@/components/LetsTalkButton";

const data = [
  {
    heading: "heading 1",
    subtitle: "subtitle 1",
    img: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788377123/sarge_ubnqrv.svg",
  },
  {
    heading: "heading 2",
    subtitle: "subtitle 2",
    img: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788377114/asia_hxumos.svg",
  },
  {
    heading: "heading 3",
    subtitle: "subtitle 3",
    img: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788377122/nxvoy_up1xur.svg",
  },
  {
    heading: "heading 3",
    subtitle: "subtitle 3",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025333/rings_gnmm1x.svg",
  },
  {
    heading: "heading 3",
    subtitle: "subtitle 3",
    img: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1788377123/psp_msjchp.svg",
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
  const yTargets = isMobile ? ["-20%", "-20%", "-20%"] : ["90%", "40%", "-60%"];
  const yTarget = yTargets[row] || "-20%";

  // Rotation: only on desktop
  const rotateTarget = isMobile ? 0 : isEven ? -45 : 45;

  // Mobile animates faster so images clear out quickly, revealing the text below
  // Desktop keeps the slower "flower blooming" stagger
  const staggerDelay = isMobile ? 0.1 : 0.2;
  const animationDuration = isMobile ? 0.25 : 0.5;

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
  const { xTarget, yTarget, rotateTarget, scrollStart, scrollEnd } =
    getRowConfig(index, isMobile);

  // Transform scroll progress to animation values
  const x = useTransform(
    containerScrollProgress,
    [scrollStart, scrollEnd],
    ["0%", xTarget],
  );
  const y = useTransform(
    containerScrollProgress,
    [scrollStart, scrollEnd],
    ["0%", yTarget],
  );
  const rotate = useTransform(
    containerScrollProgress,
    [scrollStart, scrollEnd],
    [0, rotateTarget],
  );

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

  // MOBILE (<=768px): the absolute-overlay "images bloom away to reveal the
  // centred CTA" mechanic doesn't work without the scroll transforms — the
  // stacked images just sit on top of the CTA and hide it. Render a plain
  // document-flow layout instead, with a lightweight in-view entrance
  // animation per element. Web/tablet is untouched (the `else` branch is the
  // original markup verbatim).
  if (isMobile) {
    return (
      <div className="flex flex-col items-center px-4 py-10 text-center">
        <motion.h2
          className="heading-center mb-3 text-2xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.6 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Recent <span className="text-brand-orange">Works</span>
        </motion.h2>

        <motion.p
          className="mb-8 max-w-md text-base font-[500]"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.6 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Explore our diverse portfolio of projects that highlight our
          creativity and craftsmanship.
        </motion.p>

        <div className="mb-8 grid w-full grid-cols-1 gap-4">
          {visibleData.map((item, index) => (
            <motion.img
              key={index}
              alt={item.heading}
              className="w-full h-auto object-cover rounded-[20px] grayscale-[25%] box-shadow"
              initial={{ opacity: 0, y: 30 }}
              src={item.img}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.2 }}
              whileInView={{ opacity: 1, y: 0 }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.8 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <LetsTalkButton fullWidth href="/case-studies" variant="dark">
            Explore All Work
          </LetsTalkButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative 3xl:container 3xl:mx-auto">
      {/* Centered Info - absolutely centered on both mobile and desktop */}
      <div
        className="absolute inset-1 flex flex-col items-center justify-center text-center z-[1]"
        id="info"
      >
        {/* Revealed progressively by the images blooming away on scroll —
            no separate entrance animation here (it would play while the
            images still cover this block). */}
        <h2 className="heading-center mb-4 max-md:text-2xl">
          Recent <span className="text-brand-orange">Works</span>
        </h2>
        <p className="text-center text-lg px-32 font-[500] max-md:px-0 max-lg:px-12 mb-12 w-1/2  max-md:text-base">
          Explore our diverse portfolio of projects that highlight our
          creativity and craftsmanship.
        </p>
        <div>
          <LetsTalkButton fullWidth href="/case-studies" variant="dark">
            Explore All Work
          </LetsTalkButton>
        </div>
      </div>

      {/* Image Grid with Overlap */}
      <div
        ref={containerRef}
        className="relative grid grid-cols-2 gap-12 max-md:gap-4 overflow-x-hidden overflow-y-auto py-20 pb-0 max-md:py-4 max-lg:py-40 max-md:grid-cols-1 hide-scrollbar px-32 max-md:px-4"
      >
        {visibleData.map((item, index) => (
          <BehanceImage
            key={index}
            containerScrollProgress={scrollYProgress}
            index={index}
            isMobile={isMobile}
            item={item}
          />
        ))}
      </div>
    </div>
  );
});

export default LandingBehanceFramor;
