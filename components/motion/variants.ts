import type { Variants } from "framer-motion";

import {
  DIST,
  DIST_MOBILE,
  DUR,
  EASE,
  type DistanceToken,
  type RevealVariant,
} from "@/config/motion";

interface BuildOpts {
  variant: RevealVariant;
  distance?: DistanceToken;
  duration?: number;
  delay?: number;
  isMobile?: boolean;
  reduced?: boolean;
}

/**
 * Build the hidden/visible Framer variant pair for a <Reveal>.
 *
 * - `visible` only resets the keys `hidden` actually sets, so an "up" reveal
 *   never gets a stray `filter`/`clipPath` layer.
 * - Mobile downgrades blur/clip (expensive) to a plain fade + short slide.
 * - Reduced motion collapses to an instant opacity swap.
 */
export function buildRevealVariants({
  variant,
  distance = "md",
  duration = DUR.md,
  delay = 0,
  isMobile = false,
  reduced = false,
}: BuildOpts): Variants {
  if (reduced) {
    return {
      hidden: { opacity: 1 },
      visible: { opacity: 1, transition: { duration: 0 } },
    };
  }

  const d = (isMobile ? DIST_MOBILE : DIST)[distance];

  const table: Record<RevealVariant, Record<string, number | string>> = {
    up: { opacity: 0, y: d },
    down: { opacity: 0, y: -d },
    left: { opacity: 0, x: d },
    right: { opacity: 0, x: -d },
    fade: { opacity: 0 },
    blur: { opacity: 0, filter: "blur(8px)" },
    clip: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
    bloom: { opacity: 0, scale: 0.9, filter: "blur(6px)" },
    zoom: { opacity: 0, scale: 0.8, y: d },
  };

  // Mobile can't afford per-frame blur/clip raster, and scale on a large
  // text/image subtree re-rasters — degrade the heavy variants to a fade+slide.
  const heavyOnMobile =
    variant === "blur" ||
    variant === "clip" ||
    variant === "bloom" ||
    variant === "zoom";
  const hidden =
    isMobile && heavyOnMobile ? { opacity: 0, y: d } : table[variant];

  const visible: Record<string, number | string> = {};

  for (const key of Object.keys(hidden)) {
    if (key === "opacity") visible.opacity = 1;
    else if (key === "y" || key === "x") visible[key] = 0;
    else if (key === "scale") visible.scale = 1;
    else if (key === "filter") visible.filter = "blur(0px)";
    else if (key === "clipPath") visible.clipPath = "inset(0 0 0% 0)";
  }

  return {
    hidden,
    visible: {
      ...visible,
      transition: { duration, delay, ease: EASE.out },
    },
  };
}

export interface ScrubTargets {
  opacity?: [number, number];
  y?: [number, number];
  x?: [number, number];
  scale?: [number, number];
  filter?: [string, string];
  clipPath?: [string, string];
}

/**
 * The same variants expressed as [from, to] pairs for scroll-scrubbed use:
 * a single progress 0→1 drives them, so they reverse as you scroll back up.
 */
export function buildScrubTargets(
  variant: RevealVariant,
  distance: DistanceToken = "md",
  isMobile = false,
): ScrubTargets {
  const d = (isMobile ? DIST_MOBILE : DIST)[distance];
  const slide: ScrubTargets = { opacity: [0, 1], y: [d, 0] };

  switch (variant) {
    case "up":
      return { opacity: [0, 1], y: [d, 0] };
    case "down":
      return { opacity: [0, 1], y: [-d, 0] };
    case "left":
      return { opacity: [0, 1], x: [d, 0] };
    case "right":
      return { opacity: [0, 1], x: [-d, 0] };
    case "fade":
      return { opacity: [0, 1] };
    case "blur":
      return isMobile
        ? slide
        : { opacity: [0, 1], filter: ["blur(8px)", "blur(0px)"] };
    case "clip":
      return isMobile
        ? slide
        : {
            opacity: [0, 1],
            clipPath: ["inset(0 0 100% 0)", "inset(0 0 0% 0)"],
          };
    case "bloom":
      return isMobile
        ? slide
        : {
            opacity: [0, 1],
            scale: [0.9, 1],
            filter: ["blur(6px)", "blur(0px)"],
          };
    case "zoom":
      return isMobile ? slide : { opacity: [0, 1], scale: [0.8, 1], y: [d, 0] };
    default:
      return slide;
  }
}
