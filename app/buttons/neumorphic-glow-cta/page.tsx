import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const NeumorphicGlowScreen = dynamic(
  () => import("@/screens/buttons/neumorphicGlow"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Neumorphic Glow CTA — Figma Nodes 14:642 & 14:669 | UI Pirate",
  description:
    "Interactive Claymorphic & Neumorphic elevated CTA button components with glowing neon green badge depth and crystalline plus-lighter bloom from Figma Master Button Collection (nodes 14:642 & 14:669).",
  keywords:
    "neumorphic glow cta, figma 14:642, figma 14:669, claymorphic button, neon green glow badge, tactile elevated cta, ui pirate",
  openGraph: {
    title: "Neumorphic Glow CTA — Figma Nodes 14:642 & 14:669 | UI Pirate",
    description:
      "Interactive Claymorphic & Neumorphic elevated CTA button components with glowing neon green badge depth and crystalline plus-lighter bloom.",
    url: "https://uipirate.com/buttons/neumorphic-glow-cta",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/neumorphic-glow-cta",
  },
};

export default function Page() {
  return <NeumorphicGlowScreen />;
}
