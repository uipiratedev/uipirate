"use client";

import { memo } from "react";
import FloatingLetsTalkButton from "./FloatingLetsTalkButton";

import LandingFooter from "@/screens/landing/footer";
import VisionToLife from "@/screens/landing/visionToLife";

interface PageWrapperProps {
  children: React.ReactNode;
  showFloatingButton?: boolean;
}

const PageWrapper = memo<PageWrapperProps>(function PageWrapper({
  children,
  showFloatingButton = true,
}) {
  return (
    <>
      {children}
      <VisionToLife />
      <LandingFooter />
      {showFloatingButton && <FloatingLetsTalkButton />}
    </>
  );
});

export default PageWrapper;
