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
  title: "Tactile 3D Pill Button — Interactive Spring Tilt Component | UI Pirate",
  description:
    "Interactive 3D tactile pill button featuring recessed cavity slot shadows, specular bevels, spring tilt physics, and glowing status beacon.",
  keywords:
    "tactile buttons, 3D button, recessed button, neumorphic button, ui pirate, framer motion button, react tailwind button",
  openGraph: {
    title: "Tactile 3D Pill Button — Interactive Spring Tilt Component | UI Pirate",
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
