import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About UI Pirate | Product Design Agency — From Idea to Shipped Product",
  description:
    "We turn product ideas into shipped products. Product thinking, competitive analysis, information architecture & conversion-focused UX/UI design. We simplify complex SaaS, AI apps & enterprise software. 9+ years, 50+ products shipped. EST/PST timezone friendly for US clients.",
  keywords:
    "uipirate, uipirates, UI Pirate, about UI Pirate, product design agency USA, idea to product, product thinking agency, competitive analysis design, information architecture, conversion focused UX, simplify complex products, SaaS product design, AI app design, enterprise UX design, hire product designer USA, Vishal Anand",
  openGraph: {
    title: "About UI Pirate | Product Design — From Idea to Shipped Product",
    description:
      "Not just designs — we help you think, plan, and ship your product. Product thinking, competitive analysis & conversion-focused design. 50+ products shipped. EST/PST timezone friendly.",
    url: "https://uipirate.com/about",
    siteName: "UI Pirate",
    images: [
      {
        url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1779397879/Screenshot_2026-05-22_023842_sebbvi.png",
        width: 1200,
        height: 630,
        alt: "About UI Pirate - Product Design Agency — From Idea to Shipped Product",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About UI Pirate | Product Design — Idea to Shipped Product",
    description: "Product thinking, competitive analysis & conversion-focused design. 50+ products shipped. US timezone friendly.",
    images: ["https://res.cloudinary.com/dvk9ttiym/image/upload/v1779397879/Screenshot_2026-05-22_023842_sebbvi.png"],
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
