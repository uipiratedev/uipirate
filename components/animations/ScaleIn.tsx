"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
  scale?: number;
}

const createVariants = (scale: number, duration: number, delay: number): Variants => ({
  hidden: { opacity: 0, scale },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration,
      delay,
      ease: "easeOut",
    },
  },
});

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.6,
  className = "",
  once = true,
  amount = 0.3,
  scale = 0.8,
}: ScaleInProps) {
  return (
    <motion.div
      variants={createVariants(scale, duration, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default ScaleIn;

