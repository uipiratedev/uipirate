import { Metadata } from "next";

import Sitemap from "@/screens/sitemap";

export const metadata: Metadata = {
  title: "Site Map | UI Pirate — All Pages & Services",
  description:
    "Complete sitemap of UI Pirate — product design & development agency. Browse all pages: UX/UI Design, SaaS & AI Development, Landing Pages, Graphic Design, Motion Graphics, UX Audits, 3D Animation, Pricing, Portfolio & more.",
  keywords:
    "uipirate sitemap, UI Pirate pages, product design agency services, UX UI design services list, SaaS design agency pages, site navigation, all services UI Pirate",
  alternates: {
    canonical: "https://uipirate.com/sitemap",
  },
  openGraph: {
    title: "Site Map | UI Pirate — All Pages & Services",
    description:
      "Browse all pages of UI Pirate — product design & development agency. Services, portfolio, pricing, resources & more.",
    url: "https://uipirate.com/sitemap",
    siteName: "UI Pirate",
    images: [
      {
        url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1779397879/Screenshot_2026-05-22_023842_sebbvi.png",
        width: 1200,
        height: 630,
        alt: "UI Pirate - Site Map",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://uipirate.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Site Map",
          item: "https://uipirate.com/sitemap",
        },
      ],
    },
    {
      "@type": "ItemList",
      name: "UI Pirate — All Pages",
      description:
        "Complete sitemap of UI Pirate product design & development agency",
      itemListElement: [
        { "@type": "SiteLinksSearchBox", url: "https://uipirate.com" },
        {
          "@type": "ListItem",
          position: 1,
          url: "https://uipirate.com/",
          name: "Home",
        },
        {
          "@type": "ListItem",
          position: 2,
          url: "https://uipirate.com/about",
          name: "About UI Pirate",
        },
        {
          "@type": "ListItem",
          position: 3,
          url: "https://uipirate.com/case-studies",
          name: "Case Studies & Portfolio",
        },
        {
          "@type": "ListItem",
          position: 4,
          url: "https://uipirate.com/pricing",
          name: "Pricing",
        },
        {
          "@type": "ListItem",
          position: 5,
          url: "https://uipirate.com/contact",
          name: "Contact",
        },
        {
          "@type": "ListItem",
          position: 6,
          url: "https://uipirate.com/services/SaaS-Web-&-Mobile-Apps",
          name: "UX/UI Design — SaaS, AI & Mobile Apps",
        },
        {
          "@type": "ListItem",
          position: 7,
          url: "https://uipirate.com/services/Landing-Pages-&-Business-Websites",
          name: "Landing Pages & Business Websites",
        },
        {
          "@type": "ListItem",
          position: 8,
          url: "https://uipirate.com/services/Graphic-Design",
          name: "Graphic Design",
        },
        {
          "@type": "ListItem",
          position: 9,
          url: "https://uipirate.com/services/Motion-Graphics-&-Video-Editing",
          name: "Motion Graphics & Video Editing",
        },
        {
          "@type": "ListItem",
          position: 10,
          url: "https://uipirate.com/services/UX-Audits-&-Consultation",
          name: "UX Audits & Consultation",
        },
        {
          "@type": "ListItem",
          position: 11,
          url: "https://uipirate.com/services/3D-Animation-&-Rendering",
          name: "3D Animation & Rendering",
        },
        {
          "@type": "ListItem",
          position: 12,
          url: "https://uipirate.com/blogs",
          name: "Blogs & Tutorials",
        },
        {
          "@type": "ListItem",
          position: 13,
          url: "https://uipirate.com/faqs",
          name: "FAQs",
        },
        {
          "@type": "ListItem",
          position: 14,
          url: "https://uipirate.com/community",
          name: "Community Insights",
        },
      ],
    },
  ],
};

const SitemapPage = () => {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <Sitemap />
    </>
  );
};

export default SitemapPage;
