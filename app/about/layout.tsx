import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About UI Pirate — Product Design & Development Agency",
  description:
    "UI Pirate is a product design and development agency — 50+ products shipped across SaaS, AI, FinTech and HealthTech. US timezone friendly. From first wireframe to working software.",
  keywords:
    "uipirate, uipirates, UI Pirate, about UI Pirate, product design agency USA, idea to product, product thinking agency, competitive analysis design, information architecture, conversion focused UX, simplify complex products, SaaS product design, AI app design, enterprise UX design, hire product designer USA, Vishal Anand, product design and development agency, hire Next.js agency, AI product design agency",
  openGraph: {
    title: "About UI Pirate | Product Design — From Idea to Shipped Product",
    description:
      "Not just designs — we help you think, plan, and ship your product. Product thinking, competitive analysis & conversion-focused design. 50+ products shipped. EST/PST timezone friendly.",
    url: "https://uipirate.com/about",
    siteName: "UI Pirate",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About UI Pirate | Product Design — Idea to Shipped Product",
    description:
      "Product thinking, competitive analysis & conversion-focused design. 50+ products shipped. US timezone friendly.",
  },
  alternates: {
    canonical: "https://uipirate.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
