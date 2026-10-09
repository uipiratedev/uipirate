import { Metadata } from "next";

import OurProductsScreen from "@/screens/products";

export const metadata: Metadata = {
  title: "Our Products | In-House Platforms & Software Systems",
  description:
    "Explore proprietary products and platforms built and operated by UI Pirate: Alfred OS, AI Voice Caller, cometCOS, Component Lab, and developer engineering tools.",
  keywords:
    "UI Pirate products, Alfred OS, AI Voice Caller, SaaS products, in-house platforms, cometCOS, content operating system, AI voice support, component lab, developer tools, design systems, ready-to-deploy software",
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
          "Multi-agent AI platform: five specialist agents with a rules-based policy engine that answer customers from your own information and act only when allowed. Embeddable on any website, API-first, and self-hostable.",
        url: "https://alfred.uipirate.com/",
      },
      {
        "@type": "SoftwareApplication",
        position: 2,
        name: "AI Voice Caller",
        applicationCategory: "CommunicationApplication",
        description:
          "AI voice agents that answer calls, book appointments, answer patient questions, and handle reschedules 24/7. Healthcare agent live with Epic, Cerner, Athenahealth, Google, and Outlook sync; English and Spanish; HIPAA and SOC2 ready.",
        url: "https://aicalling.uipirate.com/",
      },
      {
        "@type": "SoftwareApplication",
        position: 3,
        name: "cometCOS",
        applicationCategory: "BusinessApplication",
        description:
          "The multi-tenant AI content operating system: a real writing studio with an AI side panel, chapter-aware ebook workspace, scrubbable version history, BYOK multi-LLM engine with 0% token markup, and 1-click publishing to WordPress, Ghost, Medium, LinkedIn, and Buffer.",
        url: "https://cos.uipirate.com/",
      },
      {
        "@type": "SoftwareApplication",
        position: 4,
        name: "MedJourney",
        applicationCategory: "HealthcareApplication",
        description:
          "Patient support program (PSP) healthcare platform connecting telecallers, doctors, labs, pharmacies, and pharma teams on one unified timeline with automated refill alerts, 9 roles (111 privileges), and HIPAA & DISHA compliance.",
        url: "https://psp.dev.uipirate.com/",
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
