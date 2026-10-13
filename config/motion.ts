/**
 * Motion system — single source of truth.
 *
 * Every landing-page animation reads its timing, distance, easing and
 * trigger threshold from here. Do not hard-code durations/eases in
 * components; add a token instead.
 *
 * Intensity profile: EXPRESSIVE (pinning, parallax, scroll-linked moments,
 * clip/blur reveals). Mobile + reduced-motion degrade automatically inside
 * the primitives (`components/motion/*`).
 */

export const EASE = {
  /** Default reveal ease — expo-out, long tail deceleration. */
  out: [0.16, 1, 0.3, 1],
  /** Symmetric / scroll-linked moves. */
  inOut: [0.65, 0, 0.35, 1],
  /** Gentle text. */
  soft: [0.33, 1, 0.68, 1],
} as const;

/** Seconds. */
export const DUR = {
  xs: 0.28,
  sm: 0.42,
  md: 0.6,
  lg: 0.9,
  xl: 1.4,
} as const;

/** Entrance translate distance in px (desktop). */
export const DIST = { sm: 16, md: 24, lg: 40 } as const;
/** Entrance translate distance in px (mobile — shorter, cheaper). */
export const DIST_MOBILE = { sm: 8, md: 12, lg: 18 } as const;

/** staggerChildren seconds. */
export const STAGGER = { tight: 0.05, base: 0.07, loose: 0.1 } as const;

/** Shared trigger point so every section reveals at the same visual moment. */
export const VIEWPORT = { once: true, amount: 0.2 } as const;
/** For tall sections — trigger a bit before the top edge lands. */
export const VIEWPORT_TALL = { once: true, margin: "0px 0px -15% 0px" } as const;

export type RevealVariant =
  | "up"
  | "down"
  | "left"
  | "right"
  | "fade"
  | "blur"
  | "clip"
  /** scale-up + soft blur out — the "bloom" open */
  | "bloom"
  /** punchier zoom from 0.8 with a rise */
  | "zoom";

export type DistanceToken = keyof typeof DIST;
export type StaggerToken = keyof typeof STAGGER;
