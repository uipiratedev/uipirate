import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const GlossyGelButtonScreen = dynamic(
  () => import("@/screens/buttons/glossyGel"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Glossy Gel Glass Button — 1:1 Skeuomorphic Figma Component | UI Pirate",
  description:
    "1:1 pixel-accurate skeuomorphic glossy gel glass button directly from Figma (Node 2:2). Multi-layer inner shadows, specular blurred highlight capsule, and spring bounce.",
  keywords:
    "glossy gel button, skeuomorphic button, glass button, figma button, ui pirate, framer motion button, react tailwind button",
  openGraph: {
    title: "Glossy Gel Glass Button — 1:1 Skeuomorphic Figma Component | UI Pirate",
    description:
      "High-gloss skeuomorphic gel glass CTA button component with 4-layer optical shadows, specular capsule, and spring physics.",
    url: "https://uipirate.com/buttons/glossy-gel-button",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/glossy-gel-button",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": "Glossy Gel Glass Button",
    "programmingLanguage": "TypeScript / React",
    "runtimePlatform": "Next.js / Tailwind CSS / Framer Motion",
    "codeSampleType": "full snippet",
    "description":
      "1:1 pixel-accurate skeuomorphic glossy gel glass button directly from Figma (Node 2:2). Multi-layer inner shadows, specular blurred highlight capsule, and spring bounce.",
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
      <GlossyGelButtonScreen />
    </>
  );
}
