"use client";

import { memo, useMemo } from "react";
import { usePathname } from "next/navigation";

import { Navbar } from "@/components/navbar";

const HIDDEN_NAVBAR_PATHS = [
  "/pro-pirate",
  "/blogs/create",
  "/blogs/edit/[id]",
  "/admin/dashboard",
  "/admin/dashboard/blogs",
  "/admin/login",
] as const;

export const ConditionalNavbar = memo(function ConditionalNavbar() {
  const pathname = usePathname();

  const shouldHideNavbar = useMemo(
    () => HIDDEN_NAVBAR_PATHS.includes(pathname as typeof HIDDEN_NAVBAR_PATHS[number]),
    [pathname]
  );

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <div className="sticky top-0 z-[999999999]">
      <Navbar />
    </div>
  );
});
