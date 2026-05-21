"use client";

import GlassBadge from "@/components/GlassBadge";
import React, { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

// Animation variants for the badge
const badgeVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.33, 1, 0.68, 1], // power3.out
    },
  },
};

// Word component that animates based on scroll progress
const AnimatedWord = ({
  word,
  index,
  totalWords,
  scrollProgress,
}: {
  word: string;
  index: number;
  totalWords: number;
  scrollProgress: MotionValue<number>;
}) => {
  // Calculate when this word should start and complete its reveal
  const wordThreshold = index / totalWords;
  const wordEndThreshold = (index + 1) / totalWords;

  // Transform scroll progress to color interpolation (gray to black)
  const color = useTransform(
    scrollProgress,
    [wordThreshold, wordEndThreshold],
    ["rgb(209, 213, 219)", "rgb(17, 24, 39)"]
  );

  // Transform scroll progress to opacity
  const opacity = useTransform(
    scrollProgress,
    [wordThreshold - 0.05, wordEndThreshold],
    [0.35, 1]
  );

  return (
    <motion.span
      style={{
        color,
        opacity,
        display: "inline-block",
        marginRight: "0.25em",
        willChange: "color, opacity",
      }}
      className="transition-none"
    >
      {word}
    </motion.span>
  );
};

const LandingWhoWeAre = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Use Framer Motion's useScroll for better performance
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ["start 0.85", "start 0.35"],
  });

  const text =
    "UI Pirate is a global UI/UX Design & Development Studio, helping SaaS founders & enterprise teams build high-performing products that ships faster, looks premium, and scales without design debt.";

  // Memoize word splitting to prevent unnecessary recalculations
  const words = useMemo(() => text.split(" "), []);
  const totalWords = words.length;

  return (
    <section
      ref={containerRef}
      className="relative py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      {/* Subtle background gradient for depth */}
      <div className="absolute inset-0 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24 relative z-10">
        {/* Badge with Framer Motion animation */}
        <motion.div
          className="flex justify-center mb-10 md:mb-14 lg:mb-16"
          variants={badgeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <GlassBadge variant="gradient">
            WHO WE ARE
          </GlassBadge>
        </motion.div>

        {/* Animated text container */}
        <div
          ref={textRef}
          className="max-w-5xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16"
        >
          <h2
            className="
              text-center font-semibold tracking-tight leading-snug
              text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[42px]
              md:leading-[1.35] lg:leading-[1.4] xl:leading-[1.35]
            "
          >
            {words.map((word, index) => (
              <AnimatedWord
                key={index}
                word={word}
                index={index}
                totalWords={totalWords}
                scrollProgress={scrollYProgress}
              />
            ))}
          </h2>
        </div>

        {/* Decorative elements for enterprise feel */}
        <motion.div
          className="flex justify-center mt-12 md:mt-16 lg:mt-20"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <div className="h-[2px] w-16 md:w-24 bg-gradient-to-r from-transparent via-brand-orange/40 to-transparent rounded-full" />
        </motion.div>
      </div>
    </section>
  );
};

export default LandingWhoWeAre;
