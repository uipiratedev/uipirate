"use client";

import { useEffect, useState } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { useIsMobile } from "@/hooks";

// LIGHT matches the body's default background so the continuum is invisible
// everywhere except the approach to / exit from a dark section.
const LIGHT = "#FFFFFF";
const DARK = "#0A0A0A";

interface Stops {
  pts: number[];
  cols: string[];
}

const FLAT: Stops = { pts: [0, 1], cols: [LIGHT, LIGHT] };

/**
 * Hue continuum — crossfades the page background between light and dark as
 * dark sections (`[data-hue="dark"]`) approach and leave, so there is no
 * hard seam at the boundary. Writes `document.body.style.backgroundColor`
 * directly (one style write per frame). Static light on mobile / reduced
 * motion. Renders nothing.
 */
export function HueBackground() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const { scrollY } = useScroll();
  const [stops, setStops] = useState<Stops>(FLAT);

  useEffect(() => {
    if (reduced || isMobile) return;

    const measure = () => {
      const vh = window.innerHeight;
      const zones = Array.from(
        document.querySelectorAll<HTMLElement>("[data-hue='dark']"),
      )
        .map((n) => {
          const r = n.getBoundingClientRect();
          const top = r.top + window.scrollY;

          return { top, bottom: top + r.height };
        })
        .sort((a, b) => a.top - b.top);

      const pts: number[] = [0];
      const cols: string[] = [LIGHT];
      const push = (p: number, c: string) => {
        if (p > pts[pts.length - 1] + 1) {
          pts.push(p);
          cols.push(c);
        }
      };

      for (const z of zones) {
        push(z.top - vh * 0.6, LIGHT);
        push(z.top + vh * 0.12, DARK);
        push(z.bottom - vh * 0.12, DARK);
        push(z.bottom + vh * 0.45, LIGHT);
      }
      push(document.documentElement.scrollHeight, LIGHT);

      setStops(pts.length >= 2 ? { pts, cols } : FLAT);
    };

    measure();

    const ro = new ResizeObserver(measure);

    ro.observe(document.body);
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduced, isMobile]);

  const color = useTransform(scrollY, stops.pts, stops.cols, { clamp: true });

  useMotionValueEvent(color, "change", (v) => {
    if (reduced || isMobile) return;
    document.body.style.backgroundColor = v as string;
  });

  useEffect(() => {
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return null;
}
