import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const AnimatedSlideButtonScreen = dynamic(
  () => import("@/screens/buttons/animatedSlide"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Animated Slide-Up Button — Micro-Interactions | UI Pirate",
  description:
    "Interactive dual-text roll CTA button that smoothly translates labels vertically on hover with zero layout shift.",
  keywords:
    "animated button, slide up button, micro interaction button, react button, tailwind button, ui pirate",
  openGraph: {
    title: "Animated Slide-Up Button | UI Pirate",
    description:
      "Interactive dual-text roll CTA button with smooth vertical translateY transition.",
    url: "https://uipirate.com/buttons/animated-slide-button",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/animated-slide-button",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": "Animated Slide-Up Button",
    "programmingLanguage": "TypeScript / React",
    "runtimePlatform": "Next.js / Tailwind CSS",
    "codeSampleType": "full snippet",
    "description":
      "Interactive dual-text roll CTA button that smoothly translates labels vertically on hover with zero layout shift.",
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
      <AnimatedSlideButtonScreen />
    </>
  );
}
