import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const UIComponentsScreen = dynamic(
  () => import("@/screens/uiComponents"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Component Lab & Design System | UI Pirate",
  description:
    "Handcrafted React, Tailwind, and Framer Motion UI components engineered with dev-mode pixel accuracy, 3D tactile physics, and rich micro-interactions.",
  keywords:
    "component lab, ui components, react components, tactile buttons, 3d button, glassmorphism, design to code, design system components, design system, tailwind ui, framer motion components",
  openGraph: {
    title: "Component Lab & Design System | UI Pirate",
    description:
      "Handcrafted React, Tailwind, and Framer Motion UI components engineered with dev-mode pixel accuracy, 3D tactile physics, and rich micro-interactions.",
    url: "https://uipirate.com/componentlab",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/componentlab",
  },
};

export default function ComponentLabPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Component Lab & Design System",
    "description":
      "Handcrafted React, Tailwind, and Framer Motion UI components engineered with dev-mode pixel accuracy, 3D tactile physics, and rich micro-interactions.",
    "url": "https://uipirate.com/componentlab",
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
      <UIComponentsScreen />
    </>
  );
}
