import { Metadata } from "next";

import OurProductsScreen from "@/screens/products";

export const metadata: Metadata = {
  title: "Our Products | In-House Platforms & Software Systems",
  description:
    "Explore proprietary products and platforms built and operated by UI Pirate: Alfred OS, AI Voice Caller, PirateCOS, Smart Onboarding Engine, Component Lab, and developer engineering tools.",
  keywords:
    "UI Pirate products, Alfred OS, AI Voice Caller, SaaS products, in-house platforms, PirateCOS, AI voice support, smart onboarding engine, component lab, developer tools, design systems, ready-to-deploy software",
  alternates: {
    canonical: "https://uipirate.com/products",
  },
  openGraph: {
    title: "Our Products | UI Pirate Proprietary Systems & Platforms",
    description:
      "Proprietary platforms, AI systems, and production engines designed, built, and operated by UI Pirate.",
    url: "https://uipirate.com/products",
    siteName: "UI Pirate",
    images: [
      {
        url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1779397879/Screenshot_2026-05-22_023842_sebbvi.png",
        width: 1200,
        height: 630,
        alt: "UI Pirate - Our Products & Systems",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Products | UI Pirate Proprietary Systems & Platforms",
    description:
      "Proprietary platforms, AI systems, and production engines designed, built, and operated by UI Pirate.",
  },
};

export default function ProductsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "UI Pirate Products & Platforms",
    description:
      "Proprietary software products and tools designed, engineered, and shipped by UI Pirate.",
    itemListElement: [
      {
        "@type": "SoftwareApplication",
        position: 1,
        name: "Alfred OS",
        applicationCategory: "BusinessApplication",
        description:
          "Autonomous AI Butler & 5-agent enterprise workforce platform with deterministic safety policies.",
        url: "https://alfred.uipirate.com/",
      },
      {
        "@type": "SoftwareApplication",
        position: 2,
        name: "AI Voice Caller",
        applicationCategory: "CommunicationApplication",
        description:
          "Human-grade conversational voice AI agents for appointment booking, EHR calendar sync, and front-desk triage.",
        url: "https://aicalling.uipirate.com/",
      },
      {
        "@type": "SoftwareApplication",
        position: 3,
        name: "PirateCOS",
        applicationCategory: "BusinessApplication",
        description:
          "Multi-tenant Content Operating System and AI publishing engine with Edge read APIs.",
        url: "https://uipirate.com/apps4sale/piratecos",
      },
      {
        "@type": "SoftwareApplication",
        position: 4,
        name: "Smart Onboarding Engine",
        applicationCategory: "BusinessApplication",
        description:
          "Personalized, role-based product tour and behavioral activation engine for SaaS applications.",
        url: "https://uipirate.com/apps4sale/smart-onboarding-engine",
      },
      {
        "@type": "SoftwareApplication",
        position: 5,
        name: "UI Pirate Component Lab",
        applicationCategory: "DeveloperApplication",
        description:
          "Production-grade tactile UI components and micro-interactions built with React and Tailwind.",
        url: "https://uipirate.com/componentlab",
      },
      {
        "@type": "SoftwareApplication",
        position: 6,
        name: "Frontend & GEO Engineering Tools Suite",
        applicationCategory: "DeveloperApplication",
        description:
          "Comprehensive suite of client-side engineering tools including SVG optimizer, contrast analyzer, and typography scales.",
        url: "https://uipirate.com/tools",
      },
    ],
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <OurProductsScreen />
    </>
  );
}
