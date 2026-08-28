import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const LedMatrixChevronScreen = dynamic(
  () => import("@/screens/buttons/ledMatrixChevron"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Expandable LED Dot Matrix Chevron Button — Cyberpunk React Component | UI Pirate",
  description:
    "Cyberpunk carbon-fiber squircle button with an expandable 7×7 LED dot matrix screen that stretches across the entire chassis on hover/click revealing 5 cascading pixel chevrons.",
  keywords:
    "led matrix button, dot matrix chevron button, cyberpunk button, pixel chevron, expandable button, react tailwind, ui pirate",
  openGraph: {
    title: "Expandable LED Dot Matrix Chevron Button — Cyberpunk React Component | UI Pirate",
    description:
      "Cyberpunk carbon-fiber squircle button with expandable 7×7 LED dot matrix screen and cascading animated pixel chevrons.",
    url: "https://uipirate.com/buttons/led-matrix-chevron",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/led-matrix-chevron",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": "Expandable LED Dot Matrix Chevron Button",
    "programmingLanguage": "TypeScript / React",
    "runtimePlatform": "Next.js / Tailwind CSS / Framer Motion",
    "codeSampleType": "full snippet",
    "description":
      "Cyberpunk carbon-fiber squircle button with an expandable 7×7 LED dot matrix screen that stretches across the entire chassis on hover/click revealing 5 cascading pixel chevrons.",
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
      <LedMatrixChevronScreen />
    </>
  );
}
