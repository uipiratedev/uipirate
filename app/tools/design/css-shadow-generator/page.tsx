import type { Metadata } from "next";

import CssShadowGeneratorClient from "@/components/CssShadowGenerator/CssShadowGeneratorClient";

export const metadata: Metadata = {
  title: "Smooth CSS Layered Shadow Generator | UI Pirate",
  description:
    "Free tool to generate realistic, multi-layered CSS box-shadows and a synchronized xs–2xl elevation token scale, entirely in your browser.",
  alternates: {
    canonical: "https://uipirate.com/tools/design/css-shadow-generator",
  },
  openGraph: {
    title: "Smooth CSS Layered Shadow Generator | UI Pirate",
    description:
      "Generate realistic, multi-layered CSS box-shadows and elevation tokens with natural ambient light diffusion for modern UI.",
    url: "https://uipirate.com/tools/design/css-shadow-generator",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Smooth Layered CSS Box-Shadow Generator",
  url: "https://uipirate.com/tools/design/css-shadow-generator",
  description:
    "Generate realistic, multi-layered CSS box-shadows and a synchronized xs–2xl elevation token scale, entirely in your browser.",
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
      name: "Why not just use one box-shadow with a bigger blur?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A single blur value fades at a constant rate, which looks flat and can turn muddy at large sizes. Multiple layers with decreasing opacity mimic how real ambient light actually falls off — sharper near the object, softer and fainter further away.",
      },
    },
    {
      "@type": "Question",
      name: "What does negative spread do in a box-shadow?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Spread grows or shrinks the shadow's box before blurring. A small negative spread keeps large, soft shadows from reading as a blurry rectangle by pulling their edges in slightly first.",
      },
    },
    {
      "@type": "Question",
      name: "How many shadow layers should I use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "3-4 layers is plenty for small UI elements like buttons and cards. Reach for 5-6 layers on large, dramatic elevation like a modal or hero image, where the extra layers produce a noticeably smoother gradient.",
      },
    },
  ],
};

export default function CssShadowGeneratorPage() {
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
      <CssShadowGeneratorClient />
    </>
  );
}
