"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";

import Loader from "@/components/loader";

// Dynamically import Landing with no SSR to avoid hydration issues
const Landing = dynamic(() => import("@/screens/landing"), {
  ssr: false,
  loading: () => <Loader />,
});

const LOADER_DURATION = 600;

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  const initSmoothScroll = useCallback(async () => {
    try {
      // Initialize global Lenis for smooth scrolling across entire site
      const Lenis = (await import("lenis")).default;
      const lenis = new Lenis({
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.15,
        syncTouch: true,
        syncTouchLerp: 0.1,
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

    // Show loader for 600ms
    const timer = setTimeout(() => {
      setShowContent(true);
    }, LOADER_DURATION);

    return () => clearTimeout(timer);
  }, [initSmoothScroll]);

  return <>{showContent ? <Landing /> : <Loader />}</>;
}
