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
    "High-energy lead capture CTA button featuring radiant ambient glow bloom, click sound trigger, and dynamic 3D depth press feedback.",
  keywords:
    "magnetic cta button, pulsing button, audio button, glowing button, lead cta, ui pirate, framer motion cta",
  openGraph: {
    title: "Magnetic Pulsing Action CTA Button | UI Pirate",
    description:
      "High-energy lead capture CTA button with pulsing ambient radiant bloom and audio trigger.",
    url: "https://uipirate.com/buttons/magnetic-pulse-cta",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/magnetic-pulse-cta",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": "Magnetic Pulsing Action CTA Button",
    "programmingLanguage": "TypeScript / React",
    "runtimePlatform": "Next.js / Tailwind CSS / Framer Motion",
    "codeSampleType": "full snippet",
    "description":
      "High-energy lead capture CTA button featuring radiant ambient glow bloom, click sound trigger, and dynamic 3D depth press feedback.",
    "author": {
      "@type": "Organization",
      "name": "UI Pirate",
      "url": "https://uipirate.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MagneticPulseButtonScreen />
    </>
  );
}
