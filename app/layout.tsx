import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

import { fontSans, fontJakarta } from "@/config/fonts";
import CookieConsent from "@/components/CookieConsent";
import { ConditionalNavbar } from "@/components/ConditionalNavbar";

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
        {/* Bing Webmaster Tools Verification */}
        <meta content="367497DBA609A56C845E2A1D4ECC5F42" name="msvalidate.01" />

        {/* AI Crawler Meta Tags */}
        <meta
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          name="robots"
        />
        <meta content="ai-assisted" name="ai-content-declaration" />
        <meta content="text/html; charset=utf-8" name="content-type" />
        <meta content="English" name="language" />
        <meta content="Vishal Anand - UI Pirate" name="author" />
        <meta
          content="UI/UX Design Services, SaaS Design, AI Application Design"
          name="subject"
        />
        <meta content="Business, Design, Technology" name="classification" />
        <meta
          content="UI design, UX design, UI development, graphic design, motion graphics, design systems, AI SaaS app design, mobile app design, enterprise design, USA UK Singapore India Australia, enterprise clients, startup design, tech company design, Vishal Anand, UI Pirate"
          name="keywords"
        />
        <meta content="US, GB, SG, IN, AU" name="geo.region" />
        <meta
          content="United States, United Kingdom, Singapore, India, Australia"
          name="geo.placename"
        />
        <meta
          content="Enterprise clients, SaaS companies, Tech startups, Mobile app companies"
          name="target-audience"
        />

        {/* AI Data Reference */}
        <link href="/ai-data.json" rel="alternate" type="application/ld+json" />
        <link
          href="/enterprise-schema.json"
          rel="alternate"
          type="application/ld+json"
        />

        {/* Hreflang for international targeting */}
        <link href="https://uipirate.com/" hrefLang="en-us" rel="alternate" />
        <link href="https://uipirate.com/" hrefLang="en-gb" rel="alternate" />
        <link href="https://uipirate.com/" hrefLang="en-sg" rel="alternate" />
        <link href="https://uipirate.com/" hrefLang="en-in" rel="alternate" />
        <link href="https://uipirate.com/" hrefLang="en-au" rel="alternate" />
        <link
          href="https://uipirate.com/"
          hrefLang="x-default"
          rel="alternate"
        />

        {/* Social Media and Business Profile Links for SEO */}
        <link
          href="https://www.linkedin.com/company/ui-pirate-by-vishal-anand/"
          rel="me"
        />
        <link href="https://www.behance.net/vishalanand-UI-UX" rel="me" />
        <link href="https://dribbble.com/vishalanandUIUX" rel="me" />
        <link href="https://x.com/UI_Pirate" rel="me" />
        <link
          href="https://clutch.co/profile/ui-pirate-vishal-anand"
          rel="me"
        />

        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.clarity.ms" />
      </head>
      <body
        className={clsx(
          "min-h-screen  font-sans antialiased bg-[#F5F5F5]",
          fontSans.variable,
          fontJakarta.variable
        )}
      >
        {/* Skip Link for Keyboard Navigation */}
        <a href="#main-content" className="skip-link sr-only focus:not-sr-only">
          Skip to main content
        </a>

        <div className="relative flex flex-col">
          <ConditionalNavbar />
          <main id="main-content" className="">
            {children}
          </main>
          <SpeedInsights />
          <CookieConsent />
        </div>

        {/* Google Analytics with Consent Mode - Lazy loaded for better performance */}
        <Script
          id="gtag-base"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'wait_for_update': 500
              });
              gtag('js', new Date());
              gtag('config', 'G-ZS77RQCWYM', {
                'anonymize_ip': true
              });
            `,
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZS77RQCWYM"
          strategy="lazyOnload"
        />

        {/* Microsoft Clarity - Lazy loaded for better performance */}
        <Script
          id="clarity-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "txqkzeahh6");
            `,
          }}
        />
      </body>
    </html>
  );
}
