import type { Metadata } from "next";

import ContrastCheckerClient from "@/components/ContrastChecker/ContrastCheckerClient";

export const metadata: Metadata = {
  title: "WCAG & APCA Color Contrast Checker",
  description:
    "Free tool to check text and background color pairs against WCAG 2.1 AA/AAA contrast ratios and the newer perceptual APCA (Lc) algorithm, computed live from the exact published formulas.",
  alternates: {
    canonical: "https://uipirate.com/tools/design/contrast-checker",
  },
  openGraph: {
    title: "WCAG & APCA Color Contrast Checker | UI Pirate",
    description:
      "Check any text/background color pair against WCAG 2.1 AA/AAA and the perceptually-calibrated APCA algorithm.",
    url: "https://uipirate.com/tools/design/contrast-checker",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WCAG & APCA Color Contrast Checker",
  url: "https://uipirate.com/tools/design/contrast-checker",
  description:
    "Check text and background color pairs against WCAG 2.1 AA/AAA contrast ratios and the newer perceptual APCA (Lc) algorithm.",
  applicationCategory: "DesignApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Which number should I actually use to ship a design?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For legal/compliance purposes, WCAG 2.1 AA (4.5:1 normal text, 3:1 large text) is what auditors and lawsuits currently reference. Use APCA's Lc as an additional perceptual sanity check, especially for grays and dark mode.",
      },
    },
    {
      "@type": "Question",
      name: "Why did swapping my two colors change the APCA number so much?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "APCA models text-on-light and light-on-text perception differently on purpose, unlike WCAG's single symmetric ratio. Always pass the actual text color as the foreground.",
      },
    },
    {
      "@type": "Question",
      name: "What counts as large text for the lower 3:1 WCAG threshold?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "18pt (24px) or larger at regular weight, or 14pt (about 19px) or larger at bold weight.",
      },
    },
  ],
};

export default function ContrastCheckerPage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        type="application/ld+json"
      />
      <ContrastCheckerClient />
    </>
  );
}
