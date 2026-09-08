"use client";

import { memo } from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  /** @deprecated No longer used — the floating button was removed. Kept so existing call sites still type-check. */
  showFloatingButton?: boolean;
}

const PageWrapper = memo<PageWrapperProps>(function PageWrapper({ children }) {
  return <>{children}</>;
});

export default PageWrapper;
