"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  once?: boolean;
  amount?: number;
  staggerDelay?: number;
  delayChildren?: number;
}

const createContainerVariants = (
  staggerDelay: number,
  delayChildren: number
): Variants => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function StaggerContainer({
  children,
  className = "",
  once = true,
  amount = 0.3,
  staggerDelay = 0.1,
  delayChildren = 0.1,
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={createContainerVariants(staggerDelay, delayChildren)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Helper component for stagger items
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
}

export default StaggerContainer;

