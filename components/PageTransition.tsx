"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

const BAR_COUNT = 12;
const STAGGER = 0.08; // seconds between each pair of bars

/**
 * PageTransition — Bars cover screen on link click, stay until route changes,
 * then flip away to reveal the new page.
 *
 * Also adds `data-transitioning="true"` to <body> so page animations
 * (hero, etc.) can wait until the transition finishes.
 */
export default function PageTransition() {
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

      // Small delay so new page DOM is in place behind bars
      const t = setTimeout(() => setPhase("reveal"), 150);
      return () => clearTimeout(t);
    }

    if (phase === "idle") {
      prevPathname.current = pathname;
    }
  }, [pathname, phase]);

  // --- When reveal starts, go idle after the animation finishes ---
  useEffect(() => {
    if (phase === "reveal") {
      const duration = 1200 + BAR_COUNT * STAGGER * 1000 + 200; // animation + stagger + buffer
      const t = setTimeout(() => setPhase("idle"), duration);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // --- Safety: if route never changes (slow load), force reveal after 5s ---
  useEffect(() => {
    if (phase === "cover") {
      safetyRef.current = setTimeout(() => {
        prevPathname.current = pathname; // sync up
        setPhase("reveal");
      }, 5000);

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

      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        anchor.getAttribute("target") === "_blank" ||
        href === pathname
      ) return;

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

  // --- Render ---
  if (phase === "idle") return null;

  return (
    <div className="page-transition-wrapper">
      <div className="page-transition-container">
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <div
            key={i}
            className={`page-transition-bar ${phase}`}
            style={{ animationDelay: `${Math.floor(i / 2) * STAGGER}s` }}
          />
        ))}
      </div>
    </div>
  );
}
