"use client";

import {
  useEffect,
  useState,
  useContext,
  createContext,
  ReactNode,
  memo,
} from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import Loader from "@/components/loader";

interface PageLoaderProps {
  children: ReactNode;
}

// Lets content below PageLoader (e.g. hero entrance animations) know once the
// loading overlay has actually finished, instead of animating in immediately
// on mount while still hidden behind it.
const PageRevealedContext = createContext(false);

export function usePageRevealed() {
  return useContext(PageRevealedContext);
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
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [loading, setLoading] = useState(true);
  const [isChangingRoute, setIsChangingRoute] = useState(false);

  // Initial load logic
  useEffect(() => {
    // If it's an admin route, we still want the initial loader but maybe shorter?
    // Actually, user said "i need loader when switing rout iside adminb"
    // which implies they also want it on initial load.

    const isClientNavigation = sessionStorage.getItem("hasLoaded") === "true";

    if (isClientNavigation && !isAdmin) {
      setLoading(false);

      return;
    }

    // Note: `hasLoaded` is written only once the timer actually completes,
    // not eagerly here. In dev, React can invoke this effect twice in quick
    // succession (mount -> cleanup -> mount); writing the flag up-front made
    // the second invocation see "already loaded" and cut the animation short
    // after ~500ms instead of the intended duration.
    const timer = setTimeout(
      () => {
        sessionStorage.setItem("hasLoaded", "true");
        setLoading(false);
      },
      isAdmin ? 800 : 1500,
    ); // Snappier for admin

    return () => clearTimeout(timer);
  }, [isAdmin]);

  // Route change logic for admin
  useEffect(() => {
    if (!isAdmin) return;

    setIsChangingRoute(true);
    const timer = setTimeout(() => {
      setIsChangingRoute(false);
    }, 600); // Brief flash of loader on route change

    return () => clearTimeout(timer);
  }, [pathname, isAdmin]);

  const showLoader =
    (!isAdmin && loading) || (isAdmin && (loading || isChangingRoute));

  return (
    <>
      {/* Loader overlay */}
      {showLoader && <Loader isAdmin={isAdmin} />}

      {/*
        Page content container:
        - For admin: Keep content visible but handle pointer events
        - For others: GPU-accelerated opacity transition
      */}
      <div
        className={clsx("page-content-wrapper", {
          "is-loaded": !showLoader || isAdmin,
          "is-loading": showLoader && !isAdmin,
          "pointer-events-none": showLoader && isAdmin,
        })}
      >
        <PageRevealedContext.Provider value={!loading}>
          {children}
        </PageRevealedContext.Provider>
      </div>
    </>
  );
});

export default PageLoader;
