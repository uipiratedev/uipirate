import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const ElevatedUnderglowScreen = dynamic(
  () => import("@/screens/buttons/elevatedUnderglow"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Elevated Underglow 3D Button — Figma Nodes 55:37 & 55:40 | UI Pirate",
  description:
    "Interactive 3D tactile elevated button from Figma Master Button Collection (nodes 55:37 & 55:40). Features 13px spring lift physics, glowing electric blue 3D extrusion, and bottom reflection rim.",
  keywords:
    "elevated 3d button, figma button 55:37, figma button 55:40, underglow button, tactile pill button, book a call button, react tailwind button, framer motion elevation, ui pirate",
  openGraph: {
    title: "Elevated Underglow 3D Button — Figma Nodes 55:37 & 55:40 | UI Pirate",
    description:
      "Interactive 3D tactile elevated button from Figma Master Button Collection with glowing electric blue 3D base extrusion and spring lift elevation.",
    url: "https://uipirate.com/buttons/elevated-underglow-cta",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/elevated-underglow-cta",
  },
};

export default function Page() {
  return <ElevatedUnderglowScreen />;
}
