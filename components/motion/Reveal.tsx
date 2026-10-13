"use client";

import { forwardRef, useMemo, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { useRevealGroup } from "./RevealGroup";
import { buildRevealVariants, buildScrubTargets } from "./variants";

import { useIsMobile } from "@/hooks";
import {
  DUR,
  VIEWPORT,
  type DistanceToken,
  type RevealVariant,
} from "@/config/motion";

type RevealTag =
  | "div"
  | "section"
  | "article"
  | "figure"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "span"
  | "ul"
  | "li";

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

interface RevealProps extends SafeHTMLProps {
  as?: RevealTag;
  variant?: RevealVariant;
  distance?: DistanceToken;
  duration?: number;
  delay?: number;
  amount?: number;
  once?: boolean;
  /**
   * Scroll-scrub: the reveal tracks scroll position, so it plays forward on
   * the way down and reverses on the way up. Default true on desktop; mobile
   * and reduced-motion fall back to a triggered reveal / instant.
   */
  scrub?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// ── scrubbed implementation ───────────────────────────────────────────────
interface ScrubProps {
  as: RevealTag;
  variant: RevealVariant;
  distance: DistanceToken;
  isMobile: boolean;
  className?: string;
  children?: React.ReactNode;
  rest: Record<string, unknown>;
}

const RevealScrub = forwardRef<HTMLElement, ScrubProps>(function RevealScrub(
  { as, variant, distance, isMobile, className, children, rest },
  forwardedRef,
) {
  const ref = useRef<HTMLDivElement>(null);
  const t = useMemo(
    () => buildScrubTargets(variant, distance, isMobile),
    [variant, distance, isMobile],
  );

  const { scrollYProgress } = useScroll({
    target: ref,
    // 0 only while the element is fully below the fold; 1 once its top
    // passes the viewport centre. Anything on screen above centre is always
    // fully revealed, so content can never be stranded at opacity 0.
    offset: ["start end", "start center"] as never,
  });
  // Opacity tracks raw progress (never lags → never looks "stuck").
  // The heavier transform channels are spring-smoothed.
  const p = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.4,
  });

  const opacity = useTransform(scrollYProgress, [0, 0.85], t.opacity ?? [1, 1]);
  const y = useTransform(p, [0, 1], t.y ?? [0, 0]);
  const x = useTransform(p, [0, 1], t.x ?? [0, 0]);
  const scale = useTransform(p, [0, 1], t.scale ?? [1, 1]);
  const filter = useTransform(
    p,
    [0, 1],
    t.filter ?? ["blur(0px)", "blur(0px)"],
  );
  const clipPath = useTransform(
    p,
    [0, 1],
    t.clipPath ?? ["inset(0 0 0% 0)", "inset(0 0 0% 0)"],
  );

  // Only attach the channels this variant actually animates, so an "up"
  // reveal doesn't get a constant scale()/blur() layer it never uses.
  const style: Record<string, unknown> = {};

  if (t.opacity) style.opacity = opacity;
  if (t.y) style.y = y;
  if (t.x) style.x = x;
  if (t.scale) style.scale = scale;
  if (t.filter) style.filter = filter;
  if (t.clipPath) style.clipPath = clipPath;

  const Comp = motion[as] as React.ElementType;

  return (
    <Comp
      ref={(node: HTMLDivElement | null) => {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </Comp>
  );
});

// ── public component ──────────────────────────────────────────────────────
export const Reveal = forwardRef<HTMLElement, RevealProps>(function Reveal(
  {
    as = "div",
    variant = "up",
    distance = "md",
    duration = DUR.md,
    delay = 0,
    amount,
    once,
    scrub,
    className,
    children,
    ...rest
  },
  ref,
) {
  const reduced = !!useReducedMotion();
  const isMobile = useIsMobile();
  const group = useRevealGroup();

  // Desktop default: scroll-scrubbed (scrolling up and down both drive the
  // reveal). `scrub={false}` opts back to a triggered `whileInView`.
  // Mobile / reduced-motion always use the triggered path.
  const useScrub =
    !reduced &&
    !isMobile &&
    (scrub ?? (group.inGroup ? group.scrub : true));

  const variants = useMemo(
    () =>
      buildRevealVariants({
        variant,
        distance,
        duration,
        delay: group.inGroup ? 0 : delay,
        isMobile,
        reduced,
      }),
    [variant, distance, duration, delay, group.inGroup, isMobile, reduced],
  );

  if (useScrub) {
    return (
      <RevealScrub
        ref={ref}
        as={as}
        className={className}
        distance={distance}
        isMobile={isMobile}
        rest={rest}
        variant={variant}
      >
        {children}
      </RevealScrub>
    );
  }

  const Comp = motion[as] as React.ElementType;

  // Triggered (mobile / reduced / scrub:false), or inheriting a triggered group.
  if (group.inGroup && !group.scrub) {
    return (
      <Comp ref={ref} className={className} variants={variants} {...rest}>
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      ref={ref}
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
  );
});
