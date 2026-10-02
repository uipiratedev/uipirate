"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { MotionConfig } from "framer-motion";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        {/* "user" makes every Framer Motion animation site-wide respect the
            OS-level prefers-reduced-motion setting automatically — animations
            still play normally for everyone else. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
