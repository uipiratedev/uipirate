"use client";

import { useEffect, useState, ReactNode } from "react";
import Loader from "@/components/loader";

interface PageLoaderProps {
  children: ReactNode;
}

export default function PageLoader({ children }: PageLoaderProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loader only on initial page load (hard reload)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []); // Empty dependency — runs only once on mount

  return (
    <>
      {/* Loader overlay — only on initial page load */}
      {loading && <Loader />}

      {/*
        Page content container:
        - Use opacity only (not visibility) to allow CSS animations to run
        - pointer-events: none prevents interaction while loading
        - position: relative maintains layout flow
        - CSS animations will fire and complete during loading period
      */}
      <div
        style={{
          opacity: loading ? 0 : 1,
          pointerEvents: loading ? "none" : "auto",
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        {children}
      </div>
    </>
  );
}

