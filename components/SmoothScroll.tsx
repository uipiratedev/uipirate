"use client";

import { useEffect, useCallback } from "react";

/**
 * Client-only component that initializes Lenis smooth scrolling.
 * Extracted from page.tsx so the homepage can be server-rendered for SEO.
 */
export default function SmoothScroll() {
  const initSmoothScroll = useCallback(async () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    try {
      const Lenis = (await import("lenis")).default;
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        // syncTouch (JS-driven fake touch momentum) removed: it's a known
        // mobile-jank source and fights the native scroll position that
        // CSS `animation-timeline: view()` reveals rely on. Touch devices
        // now use native momentum scroll; Lenis only smooths wheel input.
      });

      const raf = (time: number) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };

      requestAnimationFrame(raf);

      // Store lenis instance globally for ScrollStack and other components to use
      (window as any).__lenis = lenis;
    } catch (error) {
      console.error("Failed to initialize Lenis:", error);
    }
  }, []);

  useEffect(() => {
    initSmoothScroll();
  }, [initSmoothScroll]);

  return null;
}
