"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

import { DUR, EASE } from "@/config/motion";

interface CountUpProps {
  /** The display value, e.g. "$150M+", "9+", "12.8k", "3.2%". */
  value: string;
  duration?: number;
  className?: string;
}

const PARTS = /^([^\d-]*)(-?[\d,]*\.?\d+)(.*)$/;

/**
 * Rolls a number up to its target the first time it scrolls into view.
 * Preserves the prefix/suffix, decimal places and thousands separators of
 * the original string. SSR-safe (renders the final value); starts from 0
 * only after mount if not yet seen. Static under reduced motion.
 */
export function CountUp({ value, duration = DUR.lg, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.6 });

  const match = value.match(PARTS);
  const prefix = match?.[1] ?? "";
  const rawNum = match?.[2] ?? "";
  const suffix = match?.[3] ?? "";
  const target = rawNum ? parseFloat(rawNum.replace(/,/g, "")) : NaN;
  const decimals = rawNum.includes(".")
    ? rawNum.split(".")[1].length
    : 0;
  const grouped = rawNum.includes(",");

  const format = (n: number) => {
    const fixed = n.toFixed(decimals);

    if (!grouped) return fixed;
    const [int, dec] = fixed.split(".");

    return int.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (dec ? `.${dec}` : "");
  };

  const [display, setDisplay] = useState(value);

  // After mount, drop to 0 so the count is visible when scrolled to.
  useEffect(() => {
    if (reduced || Number.isNaN(target)) return;
    if (!inView) setDisplay(`${prefix}${format(0)}${suffix}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reduced || Number.isNaN(target) || !inView) return;

    const controls = animate(0, target, {
      duration,
      ease: EASE.out,
      onUpdate: (v) => setDisplay(`${prefix}${format(v)}${suffix}`),
    });

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <span ref={ref} className={className}>
      {reduced || Number.isNaN(target) ? value : display}
    </span>
  );
}
