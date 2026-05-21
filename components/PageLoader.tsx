"use client";

import { useEffect, useState, ReactNode, memo } from "react";
import Loader from "@/components/loader";

interface PageLoaderProps {
  children: ReactNode;
}

/**
 * PageLoader — Shows initial loading spinner on hard refresh only.
 *
 * Performance optimizations:
 * - Memoized to prevent unnecessary re-renders
 * - Uses CSS class instead of inline styles for better performance
 * - Reduced loading time from 2000ms to 1500ms
 * - Content is always rendered (for SEO), just visually hidden
 */
const PageLoader = memo(function PageLoader({ children }: PageLoaderProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if this is a client-side navigation (skip loader)
    const isClientNavigation = sessionStorage.getItem("hasLoaded") === "true";

    if (isClientNavigation) {
      setLoading(false);
      return;
    }

    // Mark as loaded for future navigations
    sessionStorage.setItem("hasLoaded", "true");

    // Shorter initial load time for snappier feel
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Loader overlay — only on initial page load (hard refresh) */}
      {loading && <Loader />}

      {/*
        Page content container:
        - Uses CSS class for GPU-accelerated opacity transition
        - Content is always in DOM for SEO crawlers
        - pointer-events prevents interaction during load
      */}
      <div
        className={`page-content-wrapper ${loading ? "is-loading" : "is-loaded"}`}
      >
        {children}
      </div>
    </>
  );
});

export default PageLoader;

