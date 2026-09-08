"use client";

import { createContext, useContext, useMemo } from "react";
import { motion } from "framer-motion";

import { STAGGER, VIEWPORT, type StaggerToken } from "@/config/motion";

interface RevealGroupCtx {
  inGroup: boolean;
  /** children self-scrub against their own scroll position (implicit stagger
   *  from their vertical offsets) instead of a triggered staggerChildren. */
  scrub: boolean;
}

const RevealGroupContext = createContext<RevealGroupCtx>({
  inGroup: false,
  scrub: false,
});

export const useRevealGroup = () => useContext(RevealGroupContext);

/** HTML attrs minus the handlers whose signatures clash with Framer's. */
type SafeHTMLProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDrop"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
>;

type GroupTag = "div" | "section" | "ul" | "ol";

interface RevealGroupProps extends SafeHTMLProps {
  as?: GroupTag;
  stagger?: StaggerToken | number;
  delayChildren?: number;
  amount?: number;
  once?: boolean;
  /** Scroll-scrub the children instead of a triggered stagger. Opt-in. */
  scrub?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function RevealGroup({
  as = "div",
  stagger = "base",
  delayChildren = 0,
  amount,
  once,
  scrub = true,
  className,
  children,
  ...rest
}: RevealGroupProps) {
  const staggerChildren =
    typeof stagger === "number" ? stagger : STAGGER[stagger];

  const ctx = useMemo<RevealGroupCtx>(
    () => ({ inGroup: true, scrub }),
    [scrub],
  );

  const variants = useMemo(
    () => ({
      hidden: {},
      visible: { transition: { staggerChildren, delayChildren } },
    }),
    [staggerChildren, delayChildren],
  );

  const Comp = motion[as] as React.ElementType;

  // Scrub mode: plain container, each <Reveal> child drives itself.
  if (scrub) {
    const Plain = as as React.ElementType;

    return (
      <RevealGroupContext.Provider value={ctx}>
        <Plain className={className} {...rest}>
          {children}
        </Plain>
      </RevealGroupContext.Provider>
    );
  }

  return (
    <RevealGroupContext.Provider value={ctx}>
      <Comp
        className={className}
        initial="hidden"
        variants={variants}
        viewport={{
          ...VIEWPORT,
          ...(once !== undefined ? { once } : {}),
          ...(amount !== undefined ? { amount } : {}),
        }}
        whileInView="visible"
        {...rest}
      >
        {children}
      </Comp>
    </RevealGroupContext.Provider>
  );
}
