"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Reports a 404 hit, anonymously, so the dashboard can list broken URLs and
 * who is linking to them. Renders nothing.
 */
export default function NotFoundBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      fetch("/api/analytics/not-found", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname || window.location.pathname,
          referrer: document.referrer || "",
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* never let logging break the 404 page */
    }
  }, [pathname]);

  return null;
}
