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

  const initLocomotiveScroll = useCallback(async () => {
    try {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      new LocomotiveScroll();
    } catch (error) {
      console.error("Failed to initialize LocomotiveScroll:", error);
    }
  }, []);

  useEffect(() => {
    initLocomotiveScroll();

    // Show loader for 600ms
    const timer = setTimeout(() => {
      setShowContent(true);
    }, LOADER_DURATION);

    return () => clearTimeout(timer);
  }, [initLocomotiveScroll]);

  return <>{showContent ? <Landing /> : <Loader />}</>;
}
