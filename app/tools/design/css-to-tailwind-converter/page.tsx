import type { Metadata } from "next";

import CssToTailwindConverterClient from "@/components/CssToTailwindConverter/CssToTailwindConverterClient";

export const metadata: Metadata = {
  title: "CSS to Tailwind CSS Class Converter | UI Pirate",
  description:
    "Free tool to convert raw CSS — including shorthand, pseudo-classes, and media queries — into idiomatic Tailwind CSS utility classes, instantly in your browser.",
  alternates: {
    canonical: "https://uipirate.com/tools/design/css-to-tailwind-converter",
  },
  openGraph: {
    title: "CSS to Tailwind CSS Class Converter | UI Pirate",
    description:
      "Convert raw CSS rules and styles into clean, idiomatic Tailwind CSS utility classes instantly.",
    url: "https://uipirate.com/tools/design/css-to-tailwind-converter",
    siteName: "UI Pirate",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CSS to Tailwind CSS Class Converter",
  url: "https://uipirate.com/tools/design/css-to-tailwind-converter",
  description:
    "Convert raw CSS — including shorthand, pseudo-classes, and media queries — into idiomatic Tailwind CSS utility classes, instantly in your browser.",
  applicationCategory: "DeveloperApplication",
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
      name: "What is Tailwind's arbitrary value syntax?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Square-bracket syntax like p-[13px] or bg-[#ff5b04] lets you use a one-off CSS value with a Tailwind utility, without adding it to your config. It's an official, fully-supported part of Tailwind CSS v3 and v4.",
      },
    },
    {
      "@type": "Question",
      name: "What's the difference between arbitrary values and arbitrary properties?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Arbitrary values (p-[13px]) customize the value for a utility Tailwind already knows about. Arbitrary properties ([mask-type:luminance]) let you use a raw CSS property Tailwind has no utility for at all — both compile to real, valid CSS.",
      },
    },
    {
      "@type": "Question",
      name: "Can I paste an entire stylesheet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can, but this tool is tuned for component-level CSS — a button, a card, a nav bar. Very large stylesheets with deep nesting or hundreds of rules will still parse, but the output is easier to review in smaller chunks.",
      },
    },
  ],
};

export default function CssToTailwindConverterPage() {
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
      <CssToTailwindConverterClient />
    </>
  );
}
