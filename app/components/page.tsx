import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const UIComponentsScreen = dynamic(
  () => import("@/screens/uiComponents"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "UI Components Library & Design System | UI Pirate",
  description:
    "Handcrafted React, Tailwind, and Framer Motion UI components engineered with Figma Dev Mode pixel accuracy, 3D tactile physics, and rich micro-interactions.",
  keywords:
    "ui components, react components, tactile buttons, 3d button, glassmorphism, figma to code, figma components, design system, tailwind ui",
  openGraph: {
    title: "UI Components Library & Design System | UI Pirate",
    description:
      "Handcrafted React, Tailwind, and Framer Motion UI components engineered with Figma Dev Mode pixel accuracy, 3D tactile physics, and rich micro-interactions.",
    url: "https://uipirate.com/components",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/components",
  },
};

export default function ComponentsHubPage() {
  return <UIComponentsScreen />;
}
