"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import Loader from "@/components/loader";

// Dynamically import Landing with no SSR to avoid hydration issues
const Landing = dynamic(() => import("@/screens/landing"), {
  ssr: false,
}) as React.FC;

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Initialize LocomotiveScroll
    const initLocomotiveScroll = async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;

      new LocomotiveScroll();
    };

    initLocomotiveScroll();

    // Show loader for 600ms
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return <>{showContent ? <Landing /> : <Loader />}</>;
}
