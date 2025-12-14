"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import Loader from "@/components/loader";
import SplashCursor from "@/components/SplashCursor";

// FIXED: Enable SSR for better Vercel deployment
// Only disable SSR for components that absolutely need it (like GSAP ScrollTrigger)
const Landing = dynamic(() => import("@/screens/landing"), {
  ssr: true, // Changed from false to true
  loading: () => <Loader />, // Show loader while loading
}) as React.FC;

export default function Home() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Hide loader after 600ms
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div suppressHydrationWarning>
      <SplashCursor />
      {showLoader && <Loader />}
      <Landing />
    </div>
  );
}
