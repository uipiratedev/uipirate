"use client";

import { memo, useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";

import { Footer } from "@/components/footer";

export const ConditionalFooter = memo(function ConditionalFooter() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shouldHideFooter = useMemo(() => {
    const baseHide =
      pathname.startsWith("/pirateCOS") || pathname.startsWith("/admin");

    if (!mounted) {
      return baseHide;
    }

    const isSubdomain =
      typeof window !== "undefined" &&
      (window.location.hostname.startsWith("cos.") ||
        window.location.hostname === "cos.uipirate.com");

    return isSubdomain || baseHide;
  }, [pathname, mounted]);

  if (shouldHideFooter) {
    return null;
  }

  return <Footer />;
});
