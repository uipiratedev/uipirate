"use client";

import { useEffect, useCallback } from "react";

/**
 * Client-only component that initializes Lenis smooth scrolling.
 * Extracted from page.tsx so the homepage can be server-rendered for SEO.
 */
export default function SmoothScroll() {
  const initSmoothScroll = useCallback(async () => {
    try {
      const Lenis = (await import("lenis")).default;
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.08,
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
