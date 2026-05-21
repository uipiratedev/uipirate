import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About UI Pirate | US-Based Design Agency for Startups & SaaS — Our Story",
  description:
    "We turn product ideas into shipped products. Trusted by 50+ US startups and SaaS companies. Product thinking, UX/UI design & React/Next.js development. EST/PST timezone friendly. Save 50-70% vs US agencies.",
  keywords:
    "about UI Pirate, design agency for US startups, SaaS design partner, product design agency USA, hire UI designer America, enterprise UX agency, React development agency, startup design partner, offshore design team USA",
  openGraph: {
    title: "About UI Pirate | Design Agency for US Startups & SaaS",
    description:
      "Not just designs — we help you think, plan, and ship your product. Trusted by 50+ US companies. EST/PST hours, 2hr response time.",
    url: "https://uipirate.com/about",
    siteName: "UI Pirate by Vishal Anand",
    images: [
      {
        url: "https://res.cloudinary.com/dkziil6io/image/upload/v1742919377/ui-pirate-website_amh6qb.png",
        width: 1200,
        height: 630,
        alt: "About UI Pirate - Design Agency for US Startups",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About UI Pirate | Design Agency for US Startups",
    description: "We turn ideas into shipped products. 50+ US clients. EST/PST timezone friendly.",
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
