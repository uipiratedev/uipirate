import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const IsometricReviveScreen = dynamic(
  () => import("@/screens/buttons/isometricRevive"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Isometric 3D Revive Button — Interactive React & Framer Motion Component | UI Pirate",
  description:
    "Interactive 30° isometric 3D extruded button featuring dynamic spring depression, obsidian bevel walls, amber indicator flare, and brilliant white optical neon underglow.",
  keywords:
    "isometric 3d button, revive now button, isometric button react, framer motion isometric, underglow neon button, ui pirate",
  openGraph: {
    title: "Isometric 3D Revive Button — Interactive React & Framer Motion Component | UI Pirate",
    description:
      "Interactive 30° isometric 3D button with multi-layer solid extrusion, amber chevron, and neon underglow.",
    url: "https://uipirate.com/buttons/isometric-revive-button",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/isometric-revive-button",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": "Isometric 3D Revive Button",
    "programmingLanguage": "TypeScript / React",
    "runtimePlatform": "Next.js / Tailwind CSS / Framer Motion",
    "codeSampleType": "full snippet",
    "description":
      "Interactive 30° isometric 3D extruded button featuring dynamic spring depression, obsidian bevel walls, amber indicator flare, and brilliant white optical neon underglow.",
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
      <IsometricReviveScreen />
    </>
  );
}
