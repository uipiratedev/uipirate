import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const ElevatedUnderglowScreen = dynamic(
  () => import("@/screens/buttons/elevatedUnderglow"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Elevated Underglow 3D Button — Interactive React & Tailwind Component | UI Pirate",
  description:
    "Interactive 3D tactile elevated button featuring 13px spring lift physics, glowing electric blue 3D sub-chassis, and bottom reflection rim.",
  keywords:
    "elevated 3d button, underglow button, tactile pill button, book a call button, react tailwind button, framer motion elevation, ui pirate",
  openGraph: {
    title: "Elevated Underglow 3D Button — Interactive React & Tailwind Component | UI Pirate",
    description:
      "Interactive 3D tactile elevated button featuring glowing electric blue 3D base extrusion and spring lift elevation.",
    url: "https://uipirate.com/buttons/elevated-underglow-cta",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/elevated-underglow-cta",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": "Elevated Underglow 3D Button",
    "programmingLanguage": "TypeScript / React",
    "runtimePlatform": "Next.js / Tailwind CSS / Framer Motion",
    "codeSampleType": "full snippet",
    "description":
      "Interactive 3D tactile elevated button featuring 13px spring lift physics, glowing electric blue 3D sub-chassis, and bottom reflection rim.",
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
      <ElevatedUnderglowScreen />
    </>
  );
}
