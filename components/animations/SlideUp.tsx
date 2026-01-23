"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface SlideUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
  y?: number;
}

const createVariants = (y: number, duration: number, delay: number): Variants => ({
  hidden: { opacity: 0, y },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      delay,
      ease: "easeOut",
    },
  },
});

export function SlideUp({
  children,
  delay = 0,
  duration = 0.8,
  className = "",
  once = true,
  amount = 0.3,
  y = 100,
}: SlideUpProps) {
  return (
    <motion.div
      variants={createVariants(y, duration, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default SlideUp;

