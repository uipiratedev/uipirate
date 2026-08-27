import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const MagneticPulseButtonScreen = dynamic(
  () => import("@/screens/buttons/magneticPulse"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Magnetic Pulsing Action CTA Button | UI Pirate",
  description:
    "High-energy lead capture CTA button featuring radiant ambient halo bloom, click sound trigger, and dynamic 3D depth press feedback.",
  keywords:
    "magnetic cta button, pulsing button, audio button, glowing button, lead cta, ui pirate, framer motion cta",
  openGraph: {
    title: "Magnetic Pulsing Action CTA Button | UI Pirate",
    description:
      "High-energy lead capture CTA button with pulsing ambient halo bloom and audio trigger.",
    url: "https://uipirate.com/buttons/magnetic-pulse-cta",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/magnetic-pulse-cta",
  },
};

export default function Page() {
  return <MagneticPulseButtonScreen />;
}
