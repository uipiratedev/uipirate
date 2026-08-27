import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const ButtonShowcaseScreen = dynamic(
  () => import("@/screens/buttons"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Master Tactile 3D Buttons — Figma Dev Mode Implementation | UI Pirate",
  description:
    "Interactive 3D tactile button component implemented from Figma Master Button Collection (nodes 75:1201 and 75:1206). Features spring tilt physics, realistic recessed tray shadows, specular bevels, and status dot glows.",
  keywords:
    "tactile buttons, 3D button, figma to code, figma buttons, recessed button, neumorphism button, ui pirate, framer motion button, react tailwind button",
  openGraph: {
    title: "Master Tactile 3D Buttons — Figma Implementation | UI Pirate",
    description:
      "Interactive 3D tactile button component with spring tilt physics, recessed slot shadows, and glowing indicators.",
    url: "https://uipirate.com/buttons",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons",
  },
};

export default function ButtonsPage() {
  return <ButtonShowcaseScreen />;
}
