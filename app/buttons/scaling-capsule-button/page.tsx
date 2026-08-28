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
  title: "Scaling Capsule Tactile Button — Interactive React Component | UI Pirate",
  description:
    "Interactive capsule button featuring a frosted translucent glass cavity tray, multi-tier elevation drop shadows, specular bevel insets, and circular apex emblem badge.",
  keywords:
    "scaling capsule button, tactile button, ui pirate, react tailwind button, multi shadow capsule",
  openGraph: {
    title: "Scaling Capsule Tactile Button — Interactive React Component | UI Pirate",
    description:
      "Interactive tactile capsule button with frosted glass tray and multi-tier shadow stack.",
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
