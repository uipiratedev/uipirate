"use client";

import { useEffect, useState, useRef, useCallback, memo } from "react";
import { usePathname } from "next/navigation";

// Reduced bar count for better performance (fewer GPU layers)
const BAR_COUNT = 6;
const STAGGER = 0.04; // Faster stagger for snappier feel

/**
 * PageTransition — Optimized bars cover screen on link click, stay until route changes,
 * then slide away to reveal the new page.
 *
 * Performance optimizations:
 * - Reduced bar count from 12 to 6
 * - Uses translateX instead of rotateY (avoids 3D transforms)
 * - Shorter animation duration (600ms vs 1200ms)
 * - Memoized component to prevent unnecessary re-renders
 */
const PageTransition = memo(function PageTransition() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "cover" | "reveal">("idle");
  const prevPathname = useRef(pathname);
  const safetyRef = useRef<NodeJS.Timeout | null>(null);

  // --- Body attribute: tells page content whether transition is active ---
  useEffect(() => {
    if (phase !== "idle") {
      document.body.setAttribute("data-transitioning", "true");
    } else {
      document.body.removeAttribute("data-transitioning");
    }
  }, [phase]);

  // --- When pathname changes while covered, start the reveal ---
  useEffect(() => {
    if (phase === "cover" && pathname !== prevPathname.current) {
      prevPathname.current = pathname;

      // Reduced delay for snappier transition (100ms vs 150ms)
      const t = setTimeout(() => setPhase("reveal"), 100);
      return () => clearTimeout(t);
    }

    if (phase === "idle") {
      prevPathname.current = pathname;
    }
  }, [pathname, phase]);

  // --- When reveal starts, go idle after the animation finishes ---
  useEffect(() => {
    if (phase === "reveal") {
      // Shorter total duration: 600ms animation + stagger + small buffer
      const duration = 600 + BAR_COUNT * STAGGER * 1000 + 100;
      const t = setTimeout(() => setPhase("idle"), duration);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // --- Safety: if route never changes (slow load), force reveal after 3s (reduced from 5s) ---
  useEffect(() => {
    if (phase === "cover") {
      safetyRef.current = setTimeout(() => {
        prevPathname.current = pathname;
        setPhase("reveal");
      }, 3000);

      return () => {
        if (safetyRef.current) clearTimeout(safetyRef.current);
      };
    }
  }, [phase, pathname]);

  // --- Intercept internal link clicks to start cover instantly ---
  const handleLinkClick = useCallback(
    (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Skip external links, hash links, same page, etc.
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        anchor.getAttribute("target") === "_blank" ||
        href === pathname
      ) return;

      // Skip if it's an admin route
      if (href.startsWith("/admin")) return;

      // Skip if modifier keys are pressed
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      if (phase !== "idle") return;

      setPhase("cover");
    },
    [pathname, phase],
  );

  useEffect(() => {
    document.addEventListener("click", handleLinkClick, true);
    return () => document.removeEventListener("click", handleLinkClick, true);
  }, [handleLinkClick]);

  // --- Render nothing when idle (unmount completely for performance) ---
  if (phase === "idle") return null;

  return (
    <div className="page-transition-wrapper" aria-hidden="true">
      <div className="page-transition-container">
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <div
            key={i}
            className={`page-transition-bar ${phase}`}
            style={{
              // Use CSS custom property for stagger to avoid inline style recalculation
              ["--stagger-delay" as string]: `${i * STAGGER}s`
            }}
          />
        ))}
      </div>
    </div>
  );
});

export default PageTransition;
