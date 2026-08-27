import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const TactilePillButtonScreen = dynamic(
  () => import("@/screens/buttons/tactilePill"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Tactile 3D Pill Button — Figma Dev Mode Implementation | UI Pirate",
  description:
    "Interactive 3D tactile pill button component implemented from Figma Master Button Collection (nodes 75:1201 and 75:1206). Features spring tilt physics, recessed slot shadows, and glowing indicators.",
  keywords:
    "tactile buttons, 3D button, figma to code, figma buttons, recessed button, neumorphism button, ui pirate, framer motion button, react tailwind button",
  openGraph: {
    title: "Tactile 3D Pill Button — Figma Implementation | UI Pirate",
    description:
      "Interactive 3D tactile button component with spring tilt physics, recessed slot shadows, and glowing indicators.",
    url: "https://uipirate.com/buttons/tactile-pill-button",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/tactile-pill-button",
  },
};

export default function Page() {
  return <TactilePillButtonScreen />;
}
