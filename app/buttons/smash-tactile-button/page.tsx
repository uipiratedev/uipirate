import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const SmashTactileButtonScreen = dynamic(
  () => import("@/screens/buttons/smashButton"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Smash Tactile Button — Neo-Brutalist React & Tailwind Component | UI Pirate",
  description:
    "Interactive tactile neo-brutalist button featuring an outer tech enclosure frame, porcelain cooling tray, midnight obsidian slab, and neon reactor underglow bloom.",
  keywords:
    "smash button, neo brutalist button, tactile button, neon reactor button, react tailwind button, ui pirate",
  openGraph: {
    title: "Smash Tactile Button — Neo-Brutalist React & Tailwind Component | UI Pirate",
    description:
      "Interactive tactile 'Smash the button' component with tech enclosure frame, obsidian core, and glowing reactor underglow.",
    url: "https://uipirate.com/buttons/smash-tactile-button",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/smash-tactile-button",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": "Smash Tactile Button",
    "programmingLanguage": "TypeScript / React",
    "runtimePlatform": "Next.js / Tailwind CSS / Framer Motion",
    "codeSampleType": "full snippet",
    "description":
      "Interactive tactile neo-brutalist button featuring an outer tech enclosure frame, porcelain cooling tray, midnight obsidian slab, and neon reactor underglow bloom.",
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
      <SmashTactileButtonScreen />
    </>
  );
}
