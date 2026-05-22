"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";

import { Footer } from "@/components/footer";

export const ConditionalFooter = memo(function ConditionalFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Footer />;
});
