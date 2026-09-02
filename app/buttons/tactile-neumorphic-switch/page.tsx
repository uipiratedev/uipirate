import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const TactileNeumorphicSwitchScreen = dynamic(
  () => import("@/screens/buttons/tactileNeumorphicSwitch"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Tactile Neumorphic Dual-Dome Switch (Figma 1:7 & 1:8) | UI Pirate",
  description:
    "1:1 Figma Master implementation of the photorealistic 3D neumorphic toggle switch with sculpted dual-dome tactile thumb, deep trench slot, and illuminated emerald channel.",
  keywords:
    "neumorphic switch, tactile switch, skeuomorphic toggle, figma 3d switch, react switch component, framer motion toggle, tailwind toggle button",
  openGraph: {
    title: "Tactile Neumorphic Dual-Dome Switch | UI Pirate",
    description:
      "1:1 Figma Master implementation of the photorealistic 3D neumorphic toggle switch with sculpted dual-dome tactile thumb and illuminated emerald channel.",
    url: "https://uipirate.com/buttons/tactile-neumorphic-switch",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/tactile-neumorphic-switch",
  },
};

export default function TactileNeumorphicSwitchPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": "Tactile Neumorphic Dual-Dome Switch",
    "description":
      "Photorealistic 3D neumorphic toggle switch featuring an outer recessed bevel cavity, deep carved shadow trench, illuminated emerald photon channel, and dual-dome sculpted tactile thumb.",
    "codeRepository": "https://github.com/uipirate/uipirate",
    "programmingLanguage": ["TypeScript", "React", "Tailwind CSS", "Framer Motion"],
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
      <TactileNeumorphicSwitchScreen />
    </>
  );
}
