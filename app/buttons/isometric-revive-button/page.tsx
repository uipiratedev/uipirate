import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const IsometricReviveScreen = dynamic(
  () => import("@/screens/buttons/isometricRevive"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Isometric 3D Revive Button — Figma Nodes 115:5957 & 115:6002 | UI Pirate",
  description:
    "Interactive 30° isometric 3D extruded button from Figma Master Button Collection (nodes 115:5957 STANDERD & 115:6002 HOVER). Features multi-faceted solid extrusion, glowing amber chevron, and brilliant white optical neon underglow.",
  keywords:
    "isometric 3d button, figma button 115:5957, figma button 115:6002, revive now button, isometric button react, framer motion isometric, underglow neon button, ui pirate",
  openGraph: {
    title: "Isometric 3D Revive Button — Figma Nodes 115:5957 & 115:6002 | UI Pirate",
    description:
      "Interactive 30° isometric 3D button from Figma Master Button Collection with multi-layer solid extrusion, amber chevron, and neon underglow.",
    url: "https://uipirate.com/buttons/isometric-revive-button",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/isometric-revive-button",
  },
};

export default function Page() {
  return <IsometricReviveScreen />;
}
