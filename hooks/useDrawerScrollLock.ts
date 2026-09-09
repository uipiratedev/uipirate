"use client";

import { useEffect } from "react";

interface ScrollLockOptions {
  enabled?: boolean;
  onClose?: () => void;
}

/**
 * Custom hook to lock body & html scrolling, pause Lenis smooth scroll,
 * and support the Escape key to close drawers or modals.
 */
export function useDrawerScrollLock({
  enabled = true,
  onClose,
}: ScrollLockOptions = {}) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const lenis = (window as any).__lenis;

    // Calculate scrollbar width to prevent page content shift
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPaddingRight = document.body.style.paddingRight;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    // Lock native scrolling
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
    document.body.classList.add("modal-open");
    document.documentElement.classList.add("modal-open");

    // Pause smooth scroll engine if active
    if (lenis && typeof lenis.stop === "function") {
      lenis.stop();
    }

    // Handle Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.paddingRight = prevBodyPaddingRight;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.classList.remove("modal-open");
      document.documentElement.classList.remove("modal-open");

      if (lenis && typeof lenis.start === "function") {
        lenis.start();
      }

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, onClose]);
}
