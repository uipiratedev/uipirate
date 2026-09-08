"use client";

import { forwardRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { useRevealGroup } from "./RevealGroup";

import { DUR, EASE, STAGGER, VIEWPORT } from "@/config/motion";

type Tag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

interface TextRevealProps {
  as?: Tag;
  /** Plain text — split into word-mask spans. */
  text: string;
  className?: string;
  /** Per-word stagger (s). */
  stagger?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
}

const wordVariants = {
  hidden: { y: "115%", rotate: 4 },
  visible: (i: number) => ({
    y: "0%",
    rotate: 0,
    transition: { delay: i * 0, duration: DUR.md, ease: EASE.out },
  }),
};

/**
 * Headline / line reveal: each word rises out from behind a clip, with a
 * tiny rotate for life. Standalone it wires its own `whileInView`; inside a
 * <RevealGroup> it inherits orchestration. Reduced motion → plain text.
 */
export const TextReveal = forwardRef<HTMLElement, TextRevealProps>(
  function TextReveal(
    {
      as = "span",
      text,
      className,
      stagger = STAGGER.tight,
      duration = DUR.md,
      once,
      amount,
    },
    ref,
  ) {
    const reduced = useReducedMotion();
    const { inGroup: grouped } = useRevealGroup();
    const Comp = motion[as] as React.ElementType;

    if (reduced) {
      const Plain = as as React.ElementType;

      return (
        <Plain ref={ref} className={className}>
          {text}
        </Plain>
      );
    }

    const words = text.split(" ");

    const container = {
      hidden: {},
      visible: { transition: { staggerChildren: stagger } },
    };

    const orchestration = grouped
      ? {}
      : {
          initial: "hidden" as const,
          whileInView: "visible" as const,
          viewport: {
            ...VIEWPORT,
            ...(once !== undefined ? { once } : {}),
            ...(amount !== undefined ? { amount } : {}),
          },
        };

    return (
      <Comp
        ref={ref}
        className={className}
        variants={container}
        {...orchestration}
      >
        {words.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="inline-flex overflow-hidden pb-[0.12em] align-bottom"
          >
            <motion.span
              className="inline-block will-change-transform"
              custom={i}
              transition={{ duration, ease: EASE.out }}
              variants={wordVariants}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </Comp>
    );
  },
);
