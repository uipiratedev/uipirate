import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Process | From Idea to Shipped Product — UI Pirate",
  description:
    "How UI Pirate takes a product from idea to shipped: Listen, Think, Plan, Design, Build, Ship & Scale. See exactly what working with us looks like before you reach out.",
  keywords:
    "uipirate, uipirates, UI Pirate, product design process, UX design process, agency engagement model, product development process, idea to shipped product",
  openGraph: {
    title: "Our Process | From Idea to Shipped Product — UI Pirate",
    description:
      "How we take a product from idea to shipped: Listen, Think, Plan, Design, Build, Ship & Scale.",
    url: "https://uipirate.com/process",
    siteName: "UI Pirate",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Process | UI Pirate",
    description:
      "How we take a product from idea to shipped: Listen, Think, Plan, Design, Build, Ship & Scale.",
  },
  alternates: {
    canonical: "https://uipirate.com/process",
  },
};

export default function ProcessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
