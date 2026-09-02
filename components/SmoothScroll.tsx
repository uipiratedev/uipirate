"use client";

import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

/**
 * Client-only component that initializes Lenis smooth scrolling.
 * Extracted from page.tsx so the homepage can be server-rendered for SEO.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  const initSmoothScroll = useCallback(async () => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      pathname.startsWith("/componentlab/")
    ) {
      if ((window as any).__lenis) {
        (window as any).__lenis.destroy();
        (window as any).__lenis = null;
      }
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
      });

      let rafId: number;
      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };

      rafId = requestAnimationFrame(raf);

      // Store lenis instance globally for ScrollStack and other components to use
      (window as any).__lenis = lenis;

      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
        (window as any).__lenis = null;
      };
    } catch (error) {
      console.error("Failed to initialize Lenis:", error);
    }
  }, [pathname]);

  useEffect(() => {
    const cleanupPromise = initSmoothScroll();
    return () => {
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, [initSmoothScroll]);

  return null;
}
