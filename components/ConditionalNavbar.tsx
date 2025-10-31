"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();

  // Don't show navbar on pro-pirate page
  if (pathname === "/pro-pirate") {
    return null;
  }

  return (
    <div className="sticky top-0" style={{ zIndex: 999999999 }}>
      <Navbar />
    </div>
  );
}

