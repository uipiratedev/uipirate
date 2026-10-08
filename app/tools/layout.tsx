import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Free Tools for SaaS Teams: UX Audits, Design & AI Visibility",
  description:
    "Free tools from UI Pirate: SaaS UX and website analyzers, design-system generators, and AI visibility checkers (AI bot checker, llms.txt and schema generators).",
  openGraph: {
    title: "Free Tools for SaaS Teams | UI Pirate",
    description:
      "SaaS UX and website analyzers, design-system generators, and AI visibility checkers, free from UI Pirate.",
    siteName: "UI Pirate by Vishal Anand",
    type: "website",
  },
};

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return children;
}
