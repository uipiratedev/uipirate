import { Metadata } from "next";

import Sitemap from "@/screens/sitemap";

export const metadata: Metadata = {
  title: "Site Map | UI Pirate - Navigate All Pages",
  description:
    "Complete sitemap of UI Pirate. Find all pages including services, portfolio, pricing, resources, and contact information. Easy navigation to all sections of our website.",
  keywords:
    "sitemap, site navigation, UI Pirate pages, website structure, all pages, services list, portfolio navigation",
  openGraph: {
    title: "Site Map | UI Pirate",
    description:
      "Navigate through all pages and sections of UI Pirate. Find everything you need quickly and easily.",
    url: "https://uipirate.com/sitemap",
    siteName: "UI Pirate by Vishal Anand",
    images: [
      {
        url: "https://res.cloudinary.com/dkziil6io/image/upload/v1742919377/ui-pirate-website_amh6qb.png",
        width: 1200,
        height: 630,
        alt: "UI Pirate - Site Map",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const SitemapPage = () => {
  return (
    <div>
      <Sitemap />
    </div>
  );
};

export default SitemapPage;
