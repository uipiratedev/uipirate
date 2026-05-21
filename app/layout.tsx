import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

import { fontSans, fontJakarta, fontGeist, fontGeistMono, fontJetBrainsMono } from "@/config/fonts";
import CookieConsent from "@/components/CookieConsent";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { ConditionalNavbar } from "@/components/ConditionalNavbar";
import PageLoader from "@/components/PageLoader";
import PageTransition from "@/components/PageTransition";
import { Footer } from "@/components/footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "UI Pirate | Product Design & Development — From Idea to Shipped Product",
    template: "%s | UI Pirate",
  },
  description:
    "We turn product ideas into shipped products. Product thinking, competitive analysis, information architecture & UX/UI design for complex SaaS, AI apps & enterprise software. We simplify complexity. Angular, React, Next.js development.",
  keywords:
    "uipirate, uipirates, UI Pirate, product design agency, UI UX design agency, idea to product, product thinking, competitive analysis, information architecture, UX design, UI design, SaaS design, AI app design, dashboard UX, mobile app UI, enterprise UX design, conversion focused design, simplify complex products, Angular development, React development, Vishal Anand",
  openGraph: {
    title: "UI Pirate | Product Design — From Idea to Shipped Product",
    description:
      "Not just designs — we help you think, plan, and build your product. Product thinking, competitive analysis & conversion-focused design for complex products.",
    url: "https://uipirate.com",
    siteName: "UI Pirate",
    images: [
      {
        url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1779397879/Screenshot_2026-05-22_023842_sebbvi.png",
        width: 1200,
        height: 630,
        alt: "UI Pirate - Product Design Agency — From Idea to Shipped Product",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UI Pirate | Product Design — Idea to Shipped Product",
    description: "Product thinking, competitive analysis & conversion-focused design. We simplify complex products. 50+ shipped.",
    images: ["https://res.cloudinary.com/dvk9ttiym/image/upload/v1779397879/Screenshot_2026-05-22_023842_sebbvi.png"],
    site: "@UI_Pirate",
    creator: "@UI_Pirate",
  },
  alternates: {
    canonical: "https://uipirate.com",
  },
  icons: {
    icon: "/favicon.ico?v=2",
    apple: "/favicon.ico?v=2",
    shortcut: "/favicon.ico?v=2",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        <meta content="US, GB, SG, IN, AU" name="geo.region" />
        <meta
          content="United States, United Kingdom, Singapore, India, Australia"
          name="geo.placename"
        />
        <meta
          content="Enterprise clients, SaaS companies, Tech startups, Mobile app companies"
          name="target-audience"
        />

        {/* Structured Data — Inline JSON-LD (Google ignores linked JSON-LD files) */}
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "@id": "https://uipirate.com/#organization",
              name: "UI Pirate by Vishal Anand",
              alternateName: ["UI Pirate", "uipirate", "uipirates"],
              url: "https://uipirate.com",
              logo: "https://res.cloudinary.com/damm9iwho/image/upload/v1731044026/newfavicon_ibmap0.svg",
              image: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1779397879/Screenshot_2026-05-22_023842_sebbvi.png",
              description:
                "Product design and frontend development agency that turns ideas into shipped products. Specializing in product thinking, competitive analysis, information architecture, UX/UI design, and complex enterprise frontend development in Angular, React, and Next.js. Serving Fortune 500 companies across USA, UK, Singapore, India, and Australia. Have a conversation about your product — we carry the rest.",
              foundingDate: "2015",
              founder: {
                "@type": "Person",
                name: "Vishal Anand",
                jobTitle: "Founder & Lead UI/UX Designer",
                url: "https://www.linkedin.com/in/vishal-a-51bb49110",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+919708636151",
                email: "vishal@uipirate.com",
                contactType: "customer service",
                areaServed: ["US", "GB", "SG", "IN", "AU"],
                availableLanguage: "English",
              },
              address: { "@type": "PostalAddress", addressCountry: "IN" },
              serviceArea: [
                { "@type": "Country", name: "United States" },
                { "@type": "Country", name: "United Kingdom" },
                { "@type": "Country", name: "Singapore" },
                { "@type": "Country", name: "India" },
                { "@type": "Country", name: "Australia" },
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Enterprise Design Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "SaaS Web & Mobile App Design & Development",
                      description: "UI/UX design and frontend development in Angular, React, and Next.js for SaaS platforms, AI tools, dashboards, and mobile-first products",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Landing Pages & Business Websites",
                      description: "High-converting landing pages and corporate websites built with Angular, React, Framer, and Webflow for startups and enterprises",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Design Systems & Component Libraries",
                      description: "Scalable design systems with custom tokens, UI kits, and documented Angular/React components for enterprise teams",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Graphic Design",
                      description: "Brand identity, infographics, newsletters, and marketing visuals",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Motion Graphics & Video Editing",
                      description: "2D/3D animations, social media content, and product explainer videos",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "UX Audits & Consultation",
                      description: "Heuristic analysis, usability testing, and strategic UX recommendations",
                    },
                  },
                ],
              },
              sameAs: [
                "https://www.linkedin.com/company/ui-pirate-by-vishal-anand/",
                "https://www.linkedin.com/in/vishal-a-51bb49110",
                "https://www.behance.net/vishalanand-UI-UX",
                "https://www.behance.net/UI-Pirate",
                "https://dribbble.com/vishalanandUIUX",
                "https://www.upwork.com/agencies/1837026757439552424/",
                "https://clutch.co/profile/ui-pirate-vishal-anand",
                "https://x.com/UI_Pirate",
                "https://maps.app.goo.gl/tcp9QiMqsUmN7xoY8",
              ],
            }),
          }}
          type="application/ld+json"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://uipirate.com/#website",
              url: "https://uipirate.com",
              name: "UI Pirate",
              description: "Enterprise UI/UX design agency for SaaS & tech companies. Modern, scalable design trusted by Fortune 500.",
              publisher: { "@id": "https://uipirate.com/#organization" },
              inLanguage: "en-US",
            }),
          }}
          type="application/ld+json"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SiteNavigationElement",
              name: [
                "Services",
                "Case Studies & Portfolio",
                "About",
                "Pricing",
                "Blog",
                "Contact",
                "FAQs",
              ],
              url: [
                "https://uipirate.com/services",
                "https://uipirate.com/case-studies",
                "https://uipirate.com/about",
                "https://uipirate.com/pricing",
                "https://uipirate.com/blogs",
                "https://uipirate.com/contact",
                "https://uipirate.com/faqs",
              ],
            }),
          }}
          type="application/ld+json"
        />

        {/* AI Data Reference (kept for AI crawlers that do follow links) */}
        <link href="/ai-data.json" rel="alternate" type="application/ld+json" />
        <link href="/llms.txt" rel="alternate" type="text/plain" />

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
        <link href="https://res.cloudinary.com" rel="preconnect" />
        <link href="https://res.cloudinary.com" rel="dns-prefetch" />
        <link href="https://www.googletagmanager.com" rel="preconnect" />
        <link href="https://www.clarity.ms" rel="preconnect" />
      </head>
      <body
        className={clsx(
          "min-h-screen  font-sans antialiased bg-white",
          fontSans.variable,
          fontJakarta.variable,
          fontGeist.variable,
          fontGeistMono.variable,
          fontJetBrainsMono.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          {/* Skip Link for Keyboard Navigation */}
          <a className="skip-link sr-only focus:not-sr-only" href="#main-content">
            Skip to main content
          </a>

          <div className="relative flex flex-col min-h-screen">
            <PageTransition />
            <PageLoader>
              <ConditionalNavbar />
              <Breadcrumbs />
              <main className="flex-1 min-h-screen" id="main-content">
                {children}
              </main>
              <Footer />
            </PageLoader>
            <SpeedInsights />
            <CookieConsent />
            <StickyMobileCTA />
          </div>
        </Providers>

        {/* Google Analytics with Consent Mode - Lazy loaded for better performance */}
        <Script
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
          id="gtag-base"
          strategy="lazyOnload"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZS77RQCWYM"
          strategy="lazyOnload"
        />

        {/* Microsoft Clarity - Lazy loaded for better performance */}
        <Script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "txqkzeahh6");
            `,
          }}
          id="clarity-script"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
