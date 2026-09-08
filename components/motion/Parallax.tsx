"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { useIsMobile } from "@/hooks";

interface ParallaxProps {
  /** Fraction of travel, 0.12 = 12%. Negative flips direction. */
  speed?: number;
  axis?: "x" | "y";
  /** Hard cap on translate magnitude (%). Keeps raster area small. */
  clampPct?: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Scroll-linked translate tied to the element's transit through the
 * viewport. Renders a plain <div> (no motion value) on mobile and under
 * reduced motion.
 */
export function Parallax({
  speed = 0.12,
  axis = "y",
  clampPct = 12,
  className,
  children,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const mag =
    Math.min(Math.abs(speed) * 100, clampPct) * (speed < 0 ? -1 : 1);
  const value = useTransform(scrollYProgress, [0, 1], [`${mag}%`, `${-mag}%`]);

  if (reduced || isMobile) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={axis === "y" ? { y: value } : { x: value }}
    >
      {children}
    </motion.div>
  );
}
