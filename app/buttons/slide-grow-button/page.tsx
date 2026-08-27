import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const SlideGrowScreen = dynamic(() => import("@/screens/buttons/slideGrow"), {
  loading: () => <Loader />,
});

export const metadata: Metadata = {
  title: "Swipe to Grow / Slide to Unlock Slider Button — Figma 17:1222 & 17:1240 | UI Pirate",
  description:
    "Interactive metallic capsule slider button with draggable glowing electric blue knob, illuminated neon channel fill, and dynamic masked text reveal from Figma Master Button Collection (nodes 17:1222 & 17:1240).",
  keywords:
    "slide to unlock button, swipe to grow, figma 17:1222, figma 17:1240, neon slider button, metallic capsule toggle, framer motion drag, ui pirate",
  openGraph: {
    title: "Swipe to Grow / Slide to Unlock Slider Button — Figma 17:1222 & 17:1240 | UI Pirate",
    description:
      "Interactive metallic capsule slider button with draggable glowing electric blue knob and illuminated neon channel fill.",
    url: "https://uipirate.com/buttons/slide-grow-button",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/slide-grow-button",
  },
};

export default function Page() {
  return <SlideGrowScreen />;
}
