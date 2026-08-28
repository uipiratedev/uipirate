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
  title: "Smash Tactile Button — Neo-Brutalist React & Tailwind Component | UI Pirate",
  description:
    "Interactive tactile neo-brutalist button featuring an outer tech enclosure frame, porcelain cooling tray, midnight obsidian slab, and neon reactor underglow bloom.",
  keywords:
    "smash button, neo brutalist button, tactile button, neon reactor button, react tailwind button, ui pirate",
  openGraph: {
    title: "Smash Tactile Button — Neo-Brutalist React & Tailwind Component | UI Pirate",
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
