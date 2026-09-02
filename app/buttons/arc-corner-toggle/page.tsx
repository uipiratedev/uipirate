import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const ArcCornerToggleScreen = dynamic(
  () => import("@/screens/buttons/arcCornerToggle"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Arc Corner Slider Toggle — Interactive React & Tailwind Component | UI Pirate",
  description:
    "Interactive corner arc slider toggle with light and dark mode states, rotating capsule knob along a 90° circular track, sunken sunburst dial, and glowing laser beam.",
  keywords:
    "arc corner toggle, tactile slider button, corner arc switch, react component, tailwind toggle, interactive ui, ui pirate",
  openGraph: {
    title: "Arc Corner Slider Toggle — Interactive React & Tailwind Component | UI Pirate",
    description:
      "Interactive corner arc slider toggle with light and dark mode states, rotating capsule knob along a 90° circular track, and sunburst dial.",
    url: "https://uipirate.com/buttons/arc-corner-toggle",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/arc-corner-toggle",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": "Arc Corner Slider Toggle",
    "programmingLanguage": "TypeScript / React",
    "runtimePlatform": "Next.js / Tailwind CSS / Framer Motion",
    "codeSampleType": "full snippet",
    "description":
      "Interactive corner arc slider toggle with light and dark mode states, rotating capsule knob along a 90° circular track, sunken sunburst dial, and glowing laser beam.",
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
      <ArcCornerToggleScreen />
    </>
  );
}
