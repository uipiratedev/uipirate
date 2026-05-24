"use client";

import { memo, useMemo, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { Navbar } from "@/components/navbar";

const HIDDEN_NAVBAR_PATHS = ["/pro-pirate"] as const;

export const ConditionalNavbar = memo(function ConditionalNavbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shouldHideNavbar = useMemo(() => {
    const baseHide =
      pathname.startsWith("/pirateCOS") ||
      pathname.startsWith("/admin") ||
      HIDDEN_NAVBAR_PATHS.includes(
        pathname as (typeof HIDDEN_NAVBAR_PATHS)[number],
      );

    if (!mounted) {
      return baseHide;
    }

    const isSubdomain = typeof window !== "undefined" && 
      (window.location.hostname.startsWith("cos.") || window.location.hostname === "cos.uipirate.com");
    return isSubdomain || baseHide;
  }, [pathname, mounted]);

  if (shouldHideNavbar) return null;

  return <Navbar />;
});
