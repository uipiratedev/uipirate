import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const LedMatrixChevronScreen = dynamic(
  () => import("@/screens/buttons/ledMatrixChevron"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Expandable LED Dot Matrix Chevron Button — Figma 19:6101 & 19:6495 | UI Pirate",
  description:
    "Cyberpunk carbon-fiber squircle button with an expandable 7×7 LED dot matrix screen that stretches across the entire chassis on hover/click to reveal 5 cascading animated pixel chevrons from Figma Master Button Collection (nodes 19:6101 & 19:6495).",
  keywords:
    "led matrix button, dot matrix chevron button, figma 19:6101, figma 19:6495, cyberpunk button, pixel chevron, expandable button, ui pirate",
  openGraph: {
    title: "Expandable LED Dot Matrix Chevron Button — Figma 19:6101 & 19:6495 | UI Pirate",
    description:
      "Cyberpunk carbon-fiber squircle button with expandable 7×7 LED dot matrix screen and cascading animated pixel chevrons.",
    url: "https://uipirate.com/buttons/led-matrix-chevron",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/led-matrix-chevron",
  },
};

export default function Page() {
  return <LedMatrixChevronScreen />;
}
