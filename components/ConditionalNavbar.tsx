"use client";

import { memo, useMemo } from "react";
import { usePathname } from "next/navigation";

import { Navbar } from "@/components/navbar";

const HIDDEN_NAVBAR_PATHS = ["/pro-pirate"] as const;

export const ConditionalNavbar = memo(function ConditionalNavbar() {
  const pathname = usePathname();

  const shouldHideNavbar = useMemo(
    () =>
      pathname.startsWith("/admin") ||
      HIDDEN_NAVBAR_PATHS.includes(
        pathname as (typeof HIDDEN_NAVBAR_PATHS)[number],
      ),
    [pathname],
  );

  if (shouldHideNavbar) return null;

  return <Navbar />;
});
