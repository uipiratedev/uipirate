"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Loader from "@/components/loader";

interface PageLoaderProps {
  children: ReactNode;
}

export default function PageLoader({ children }: PageLoaderProps) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loader on path change
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Loader overlay */}
      {loading && <Loader />}

      {/* Page content - hidden while loading to prevent footer flash */}
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
