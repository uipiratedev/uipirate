"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { CONSENT_KEY, getTracker } from "@/lib/analytics/client";

function hasConsent(): boolean {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);

    return raw ? JSON.parse(raw)?.analytics === true : false;
  } catch {
    return false;
  }
}

// Internal surfaces — team traffic, never counted.
const PRIVATE_PREFIXES = ["/admin", "/login"];

function TrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isPrivate = PRIVATE_PREFIXES.some(
    (p) => pathname === p || pathname?.startsWith(`${p}/`),
  );

  // Start / stop with consent. `cookie-consent-changed` is dispatched by
  // components/CookieConsent.tsx; `storage` covers other tabs.
  useEffect(() => {
    const sync = () => {
      if (hasConsent()) getTracker().start();
      else getTracker().stop();
    };

    sync();
    window.addEventListener("cookie-consent-changed", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("cookie-consent-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // One page_view per committed navigation (pathname or query change).
  useEffect(() => {
    if (isPrivate || !hasConsent()) return;

    const tracker = getTracker();

    tracker.start();
    tracker.pageView(pathname || "/");
    // searchParams is included so UTM-only changes still register a view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerInner />
    </Suspense>
  );
}
