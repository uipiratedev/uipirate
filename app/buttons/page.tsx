import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const ButtonShowcaseScreen = dynamic(
  () => import("@/screens/buttons"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Interactive 3D & Tactile Button Library | UI Pirate",
  description:
    "Production-ready React, Tailwind CSS, and Framer Motion interactive button collection with live customization sandboxes, copy-paste code, and theme presets.",
  keywords:
    "ui components, react buttons, tactile buttons, 3d button, glassmorphism button, isometric button, neumorphic button, ui pirate, framer motion button, tailwind button",
  openGraph: {
    title: "Interactive 3D & Tactile Button Library | UI Pirate",
    description:
      "Production-ready React, Tailwind CSS, and Framer Motion interactive button collection with live customization sandboxes and copy-ready code.",
    url: "https://uipirate.com/buttons",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons",
  },
};

export default function ButtonsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Interactive 3D & Tactile Button Library",
    "description":
      "Production-ready React, Tailwind CSS, and Framer Motion interactive button collection with live customization sandboxes, copy-paste code, and theme presets.",
    "url": "https://uipirate.com/buttons",
    "publisher": {
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
      <ButtonShowcaseScreen />
    </>
  );
}
