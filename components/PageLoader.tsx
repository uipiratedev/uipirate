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

      {/* Page content — hidden while loading to prevent footer flash */}
      <div
        style={{
          opacity: loading ? 0 : 1,
          visibility: loading ? "hidden" : "visible",
          transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out",
        }}
      >
        {children}
      </div>
    </>
  );
}

