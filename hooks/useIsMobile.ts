import { useState, useLayoutEffect } from "react";

/**
 * Custom hook to detect if the viewport is mobile size
 * @param breakpoint - Pixel width to consider as mobile (default: 768)
 * @returns boolean indicating if viewport is mobile
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    // Set initial value
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth <= breakpoint);
    }

    // Handle resize
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return isMobile;
}
