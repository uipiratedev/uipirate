"use client";

import { memo } from "react";
import FloatingLetsTalkButton from "./FloatingLetsTalkButton";



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
      {showFloatingButton && <FloatingLetsTalkButton />}
    </>
  );
});

export default PageWrapper;
