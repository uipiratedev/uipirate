import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const SlideGrowScreen = dynamic(() => import("@/screens/buttons/slideGrow"), {
  loading: () => <Loader />,
});

export const metadata: Metadata = {
  title: "Swipe to Grow / Slide to Unlock Slider Button — Interactive React Component | UI Pirate",
  description:
    "Interactive metallic capsule slider button with draggable glowing electric blue knob, illuminated neon channel fill, and dynamic masked text reveal.",
  keywords:
    "slide to unlock button, swipe to grow, neon slider button, metallic capsule toggle, framer motion drag, ui pirate",
  openGraph: {
    title: "Swipe to Grow / Slide to Unlock Slider Button — Interactive React Component | UI Pirate",
    description:
      "Interactive metallic capsule slider button with draggable glowing electric blue knob and illuminated neon channel fill.",
    url: "https://uipirate.com/buttons/slide-grow-button",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/slide-grow-button",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": "Swipe to Grow / Slide to Unlock Slider Button",
    "programmingLanguage": "TypeScript / React",
    "runtimePlatform": "Next.js / Tailwind CSS / Framer Motion",
    "codeSampleType": "full snippet",
    "description":
      "Interactive metallic capsule slider button with draggable glowing electric blue knob, illuminated neon channel fill, and dynamic masked text reveal.",
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
      <SlideGrowScreen />
    </>
  );
}
