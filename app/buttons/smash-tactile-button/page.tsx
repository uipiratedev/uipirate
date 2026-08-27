import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const SmashTactileButtonScreen = dynamic(
  () => import("@/screens/buttons/smashButton"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Smash Tactile Button — Figma Node 17:1480 | UI Pirate",
  description:
    "Interactive tactile 'Smash the button' component implemented from Figma Master Button Collection (node 17:1480). Features tech enclosure frame, porcelain cushion tray, obsidian slab, and neon reactor underglow bloom.",
  keywords:
    "smash button, figma button 17:1480, tactile button, neon reactor button, figma to code, react tailwind button, ui pirate",
  openGraph: {
    title: "Smash Tactile Button — Figma Node 17:1480 | UI Pirate",
    description:
      "Interactive tactile 'Smash the button' component with tech enclosure frame, obsidian core, and glowing reactor underglow.",
    url: "https://uipirate.com/buttons/smash-tactile-button",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/smash-tactile-button",
  },
};

export default function Page() {
  return <SmashTactileButtonScreen />;
}
