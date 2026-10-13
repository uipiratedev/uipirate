"use client";

import type { RefObject } from "react";

import { useScroll, type MotionValue } from "framer-motion";

/**
 * 0 → 1 as `ref` travels from entering the bottom of the viewport to
 * leaving the top. Feed it into `useTransform` for scroll-linked motion
 * (parallax, pinned headline progress, hue continuum boundaries).
 *
 * `offset` accepts Framer's ScrollOffset tuple, e.g. ["start end", "end start"].
 */
export function useSectionProgress(
  ref: RefObject<HTMLElement>,
  offset: [string, string] = ["start end", "end start"],
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref,
    // Framer's ScrollOffset union is not exported consistently across
    // v11 minors; the string-edge tuple is valid at runtime.
    offset: offset as never,
  });

  return scrollYProgress;
}
