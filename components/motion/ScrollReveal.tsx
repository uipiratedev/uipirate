"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { useIsMobile } from "@/hooks";

type Tag = "div" | "section" | "figure" | "article";

interface ScrollRevealProps {
  as?: Tag;
  className?: string;
  children?: React.ReactNode;
  /** Container edge where the reveal begins (Framer offset syntax). */
  start?: string;
  /** Container edge where it completes. */
  end?: string;
  /** Starting vertical offset (px). */
  y?: number;
  /** Starting scale (the "bloom" open). */
  scale?: number;
  /** Starting blur (px). Desktop only. */
  blur?: number;
}

/**
 * Scroll-scrubbed reveal — instead of firing once, the element blooms open
 * (fade + rise + scale + de-blur) *as you scroll* it through the given
 * window. Spring-smoothed so it isn't glued to the wheel. Mobile drops the
 * blur + scale; reduced motion renders it plainly.
 */
export function ScrollReveal({
  as = "div",
  className,
  children,
  start = "start 0.9",
  end = "start 0.45",
  y = 48,
  scale = 0.92,
  blur = 8,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [start, end] as never,
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  const opacity = useTransform(p, [0, 1], [0, 1]);
  const ty = useTransform(p, [0, 1], [y, 0]);
  const sc = useTransform(p, [0, 1], [scale, 1]);
  const fl = useTransform(p, [0, 1], [`blur(${blur}px)`, "blur(0px)"]);

  const Comp = motion[as] as React.ElementType;

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Comp ref={ref} className={className} style={{ opacity, y: ty }}>
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      ref={ref}
      className={className}
      style={{ opacity, y: ty, scale: sc, filter: fl }}
    >
      {children}
    </Comp>
  );
}
