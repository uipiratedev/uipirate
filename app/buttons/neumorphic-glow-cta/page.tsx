import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const NeumorphicGlowScreen = dynamic(
  () => import("@/screens/buttons/neumorphicGlow"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Neumorphic Glow CTA — Claymorphic React & Tailwind Component | UI Pirate",
  description:
    "Interactive Claymorphic & Neumorphic elevated CTA button components with glowing neon green badge depth and crystalline plus-lighter bloom.",
  keywords:
    "neumorphic glow cta, claymorphic button, neon green glow badge, tactile elevated cta, react tailwind, ui pirate",
  openGraph: {
    title: "Neumorphic Glow CTA — Claymorphic React & Tailwind Component | UI Pirate",
    description:
      "Interactive Claymorphic & Neumorphic elevated CTA button components with glowing neon green badge depth and crystalline plus-lighter bloom.",
    url: "https://uipirate.com/buttons/neumorphic-glow-cta",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/neumorphic-glow-cta",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": "Neumorphic Glow CTA Button",
    "programmingLanguage": "TypeScript / React",
    "runtimePlatform": "Next.js / Tailwind CSS / Framer Motion",
    "codeSampleType": "full snippet",
    "description":
      "Interactive Claymorphic & Neumorphic elevated CTA button components with glowing neon green badge depth and crystalline plus-lighter bloom.",
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
      <NeumorphicGlowScreen />
    </>
  );
}
