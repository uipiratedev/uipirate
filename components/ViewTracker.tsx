"use client";

import { useEffect } from "react";

/** Fires a single view-count request after mount; renders nothing. */
export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      keepalive: true,
    }).catch(() => {});
  }, [slug]);

  return null;
}
