import { Metadata } from "next";
import FrostedGelDownloadScreen from "@/screens/buttons/frostedGelDownload";

export const metadata: Metadata = {
  title: "Frosted Gel Download Button — Interactive React & Tailwind Component | UI Pirate",
  description:
    "Dual-pill split CTA button with elevated ceramic pill, frosted glass gel download tile, optical refraction rings, and volumetric blue underglow flare.",
  keywords: [
    "Frosted Glass Button",
    "Glassmorphic Button",
    "Neumorphic Button",
    "Dual Pill Button",
    "Download Button",
    "UI Pirate",
    "Tailwind CSS Button",
    "React Button Animation",
  ],
};

export default function FrostedGelDownloadPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": "Frosted Gel Dual-Pill Download Button",
    "programmingLanguage": "TypeScript / React",
    "runtimePlatform": "Next.js / Tailwind CSS / Framer Motion",
    "codeSampleType": "full snippet",
    "description":
      "Dual-pill split CTA button with elevated ceramic pill, frosted glass gel download tile, optical refraction rings, and volumetric blue underglow flare.",
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
      <FrostedGelDownloadScreen />
    </>
  );
}
