import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title:
    "UI Pirate | Enterprise UI/UX Design & Development | USA, UK, Singapore, India, Australia",
  description:
    "Leading UI/UX design agency serving enterprise clients globally. Specializing in UI development, graphic design, motion graphics, design systems, AI/SaaS apps, and mobile applications. Trusted by Fortune 500 companies across USA, UK, Singapore, India, and Australia.",
  keywords:
    "enterprise UI design, UI development, graphic design, motion graphics, design systems, AI SaaS app design, mobile app design, enterprise clients USA UK Singapore India Australia, Fortune 500 design, startup design agency, Vishal Anand, UI Pirate",
  openGraph: {
    title: "UI Pirate | Global Enterprise UI/UX Design & Development Agency",
    description:
      "Transform your business with world-class UI/UX design and development. Serving enterprise clients across USA, UK, Singapore, India & Australia. Specializing in AI/SaaS apps, mobile design, and design systems.",
    url: "https://uipirate.com",
    siteName: "UI Pirate by Vishal Anand",
    images: [
      {
        url: "https://res.cloudinary.com/dkziil6io/image/upload/v1742919377/ui-pirate-website_amh6qb.png",
        width: 1200,
        height: 630,
        alt: "UI Pirate - Global Enterprise Design Agency",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UI Pirate | Enterprise Design Agency - Global Services",
    description:
      "World-class UI/UX design & development for enterprise clients. AI/SaaS apps, mobile design, motion graphics. Serving USA, UK, Singapore, India, Australia.",
    images: [
      "https://res.cloudinary.com/dkziil6io/image/upload/v1742919377/ui-pirate-website_amh6qb.png",
    ],
    site: "@UI_Pirate",
    creator: "@UI_Pirate",
  },
  alternates: {
    canonical: "https://uipirate.com",
  },
  icons: {
    icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1731044026/newfavicon_ibmap0.svg", // Path for the favicon.ico file
    apple:
      "https://res.cloudinary.com/damm9iwho/image/upload/v1731044026/newfavicon_ibmap0.svg", // For Apple devices, if available
    shortcut:
      "https://res.cloudinary.com/damm9iwho/image/upload/v1731044026/newfavicon_ibmap0.svg", // For older browsers
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <meta name="msvalidate.01" content="367497DBA609A56C845E2A1D4ECC5F42" />

        {/* AI Crawler Meta Tags */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="ai-content-declaration" content="ai-assisted" />
        <meta name="content-type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="author" content="Vishal Anand - UI Pirate" />
        <meta
          name="subject"
          content="UI/UX Design Services, SaaS Design, AI Application Design"
        />
        <meta name="classification" content="Business, Design, Technology" />
        <meta
          name="keywords"
          content="UI design, UX design, UI development, graphic design, motion graphics, design systems, AI SaaS app design, mobile app design, enterprise design, USA UK Singapore India Australia, enterprise clients, startup design, tech company design, Vishal Anand, UI Pirate"
        />
        <meta name="geo.region" content="US, GB, SG, IN, AU" />
        <meta
          name="geo.placename"
          content="United States, United Kingdom, Singapore, India, Australia"
        />
        <meta
          name="target-audience"
          content="Enterprise clients, SaaS companies, Tech startups, Mobile app companies"
        />

        {/* AI Data Reference */}
        <link rel="alternate" type="application/ld+json" href="/ai-data.json" />
        <link
          rel="alternate"
          type="application/ld+json"
          href="/enterprise-schema.json"
        />

        {/* Hreflang for international targeting */}
        <link rel="alternate" hrefLang="en-us" href="https://uipirate.com/" />
        <link rel="alternate" hrefLang="en-gb" href="https://uipirate.com/" />
        <link rel="alternate" hrefLang="en-sg" href="https://uipirate.com/" />
        <link rel="alternate" hrefLang="en-in" href="https://uipirate.com/" />
        <link rel="alternate" hrefLang="en-au" href="https://uipirate.com/" />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://uipirate.com/"
        />

        {/* Social Media and Business Profile Links for SEO */}
        <link
          rel="me"
          href="https://www.linkedin.com/company/ui-pirate-by-vishal-anand/"
        />
        <link rel="me" href="https://www.behance.net/vishalanand-UI-UX" />
        <link rel="me" href="https://dribbble.com/vishalanandUIUX" />
        <link rel="me" href="https://x.com/UI_Pirate" />
        <link
          rel="me"
          href="https://clutch.co/profile/ui-pirate-vishal-anand"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body
        className={clsx(
          "min-h-screen  font-sans antialiased bg-[#F5F5F5]",
          fontSans.variable
        )}
      >
        <div className="relative flex flex-col">
          <div className="sticky top-0  " style={{ zIndex: 999999999 }}>
            <Navbar />
          </div>
          <main className="">{children}</main>
          <SpeedInsights />
        </div>
      </body>
    </html>
  );
}
