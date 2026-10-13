"use client";

import { useState } from "react";

import { brandIconUrlForHost, brandLabel } from "@/lib/analytics/brands";

/**
 * Brand mark for a referrer host, from theSVG.
 *
 * Falls back to a neutral letter tile when the host is unmapped or the icon
 * fails to load, so an unknown referrer never renders as a broken image.
 */
export default function BrandLogo({
  host,
  size = 16,
  className = "",
}: {
  host: string | null | undefined;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = brandIconUrlForHost(host);
  const label = brandLabel(host);

  if (!src || failed) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex shrink-0 items-center justify-center rounded bg-gray-100 font-semibold uppercase text-gray-500 ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.55 }}
      >
        {label.replace(/^\(|\)$/g, "").charAt(0) || "?"}
      </span>
    );
  }

  return (
    // Plain <img>, not next/image: these are tiny remote SVGs on an internal
    // page, so the optimizer would add a proxy hop for no benefit.
    <img
      alt=""
      aria-hidden="true"
      className={`inline-block shrink-0 object-contain ${className}`}
      height={size}
      loading="lazy"
      referrerPolicy="no-referrer"
      src={src}
      width={size}
      onError={() => setFailed(true)}
    />
  );
}
