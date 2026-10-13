"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useTransform } from "framer-motion";

import { useSectionProgress } from "./useSectionProgress";

import { useIsMobile } from "@/hooks";

interface SectionHandoffProps {
  className?: string;
  /** Exit drift distance (%). */
  amount?: number;
  children?: React.ReactNode;
}

/**
 * As the wrapped section leaves the top of the viewport it drifts up a few
 * percent — so the next section (rising in via <Reveal>) reads as taking
 * its place rather than just appearing under a static block. Desktop only.
 */
export function SectionHandoff({
  className,
  amount = 3,
  children,
}: SectionHandoffProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const progress = useSectionProgress(ref);
  const y = useTransform(progress, [0.8, 1], ["0%", `${-amount}%`]);

  if (reduced || isMobile) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
