import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const ScalingCapsuleButtonScreen = dynamic(
  () => import("@/screens/buttons/scalingCapsule"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Scaling Capsule Tactile Button — Figma Node 118:6091 | UI Pirate",
  description:
    "Pixel-perfect implementation of Figma Node 118:6091. Features frosted translucent halo cavity tray, multi-tier elevation drop shadows, specular bevel insets, and 26px black circle badge.",
  keywords:
    "scaling capsule button, figma button 118:6091, tactile button, ui pirate, figma to react, figma dev mode, tailwind tactile button",
  openGraph: {
    title: "Scaling Capsule Tactile Button — Figma Node 118:6091 | UI Pirate",
    description:
      "Pixel-perfect implementation of Figma Node 118:6091 tactile capsule button with frosted halo tray and multi-tier shadow stack.",
    url: "https://uipirate.com/buttons/scaling-capsule-button",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/scaling-capsule-button",
  },
};

export default function Page() {
  return <ScalingCapsuleButtonScreen />;
}
