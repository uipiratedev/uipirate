import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import { Providers } from "./providers";

import {
  fontSans,
  fontJakarta,
  fontGeist,
  fontGeistMono,
  fontJetBrainsMono,
} from "@/config/fonts";
import CookieConsent from "@/components/CookieConsent";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { ThirdPartyScripts } from "@/components/analytics/ThirdPartyScripts";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { ConditionalNavbar } from "@/components/ConditionalNavbar";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import PageLoader from "@/components/PageLoader";
import Breadcrumbs from "@/components/Breadcrumbs";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  metadataBase: new URL("https://uipirate.com"),
  title: {
    default: "UI Pirate | SaaS & AI Product Design & Development Agency",
    template: "%s | UI Pirate",
  },
  description:
    "Product design & full-stack development agency. We turn SaaS and AI ideas into fully functional shipped products. UX/UI, Angular, React & Next.js. USA, UK, Singapore.",
  keywords:
    "uipirate, uipirates, UI Pirate, product design agency, product development agency, SaaS development agency, UI UX design agency, idea to product, product thinking, competitive analysis, information architecture, UX design, UI design, SaaS design, AI app design, dashboard UX, mobile app UI, enterprise UX design, conversion focused design, Angular development, React development, Next.js development, full stack agency, Vishal Anand",
  openGraph: {
    title:
      "UI Pirate | SaaS & AI Product Design & Full-Stack Development Agency",
    description:
      "Not just designs — we help you think, plan, design, build, and ship complete products. Product thinking, UX/UI, and full-stack software development in Angular, React, and Next.js.",
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
    description:
      "Product thinking, competitive analysis & conversion-focused design. We simplify complex products. 50+ shipped.",
    images: [
      "https://res.cloudinary.com/dvk9ttiym/image/upload/v1779397879/Screenshot_2026-05-22_023842_sebbvi.png",
    ],
    site: "@UI_Pirate",
    creator: "@UI_Pirate",
  },
  // Relative values resolve against `metadataBase` + the current route at build
  // time, so every page gets a correct self-referential canonical + hreflang set
  // WITHOUT a runtime `headers()` call (which would force the whole site to be
  // dynamically rendered and kill <Link> prefetch / fast navigation).
  alternates: {
    canonical: "./",
    languages: {
      "en-US": "./",
      "en-GB": "./",
      "en-SG": "./",
      "en-IN": "./",
      "en-AU": "./",
      "x-default": "./",
    },
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

// NOTE: This component must stay synchronous and free of dynamic APIs
// (`headers()`, `cookies()`, `searchParams`, `noStore()`, …). Any dynamic API
// used in the ROOT layout opts every route in the app into dynamic rendering,
// which disables static prerendering + <Link> prefetch and makes every
// navigation a full server round-trip (the "click does nothing for 2s" bug).
//
// The `cos.` subdomain shell that used to live here was gated on an `x-is-cos`
// request header that is not set anywhere in this codebase (middleware only sets
// `x-pathname`), so the branch was dead. Subdomain nav/footer stripping is
// handled client-side in ConditionalNavbar / ConditionalFooter. If a real COS
// HTML shell is needed again, put it behind a `(cos)` route group with its own
// layout, or a middleware rewrite — not a `headers()` call in the root layout.
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
              image:
                "https://res.cloudinary.com/dvk9ttiym/image/upload/v1779397879/Screenshot_2026-05-22_023842_sebbvi.png",
              description:
                "Full-service product design and development agency that turns ideas into fully functional shipped products. Specializing in product thinking, competitive analysis, information architecture, UX/UI design, and end-to-end full-stack software development in Angular, React, Next.js, Node.js, and Python. Serving Fortune 500 companies and high-growth startups across USA, UK, Singapore, India, and Australia. Have a conversation about your product — we carry the rest.",
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
                      description:
                        "UI/UX design and frontend development in Angular, React, and Next.js for SaaS platforms, AI tools, dashboards, and mobile-first products",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Landing Pages & Business Websites",
                      description:
                        "High-converting landing pages and corporate websites built with Angular, React, Framer, and Webflow for startups and enterprises",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Design Systems & Component Libraries",
                      description:
                        "Scalable design systems with custom tokens, UI kits, and documented Angular/React components for enterprise teams",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "UX Audits & Consultation",
                      description:
                        "Heuristic analysis, usability testing, and strategic UX recommendations",
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
                "https://clutch.co/profile/ui-pirate",
                "https://x.com/UI_Pirate",
                "https://www.reddit.com/user/UI-Pirate/",
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
              description:
                "Enterprise UI/UX design agency for SaaS & tech companies. Modern, scalable design trusted by Fortune 500.",
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
                "Case Studies & Portfolio",
                "About",
                "Pricing",
                "Blog",
                "Contact",
                "FAQs",
                "Free Tools",
              ],
              url: [
                "https://uipirate.com/case-studies",
                "https://uipirate.com/about",
                "https://uipirate.com/pricing",
                "https://uipirate.com/blogs",
                "https://uipirate.com/contact",
                "https://uipirate.com/faqs",
                "https://uipirate.com/tools",
              ],
            }),
          }}
          type="application/ld+json"
        />

        {/* FAQ Schema — boosts AI search visibility */}
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What types of companies does UI Pirate work with?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "UI Pirate works with SaaS startups, tech companies, and enterprise clients across USA, UK, Singapore, India, and Australia. Clients range from seed-stage startups to Fortune 500 companies in fintech, healthtech, legaltech, e-commerce, and AI.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How long does a typical project take at UI Pirate?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Landing pages and business websites typically take 2-4 weeks. SaaS and complex web applications take 1-2 months. Monthly retainers are also available for ongoing design and development support.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does UI Pirate do design only, or development too?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "UI Pirate provides end-to-end services — from product strategy and UX design to full frontend development in Angular, React, and Next.js. Designs can also be handed off to your existing development team.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What makes UI Pirate different from other design agencies?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "UI Pirate combines product thinking with design and development — helping clients think through their product, plan its architecture, design the experience, and build it. We have shipped 50+ products with a 5.0 rating and specialize in complex enterprise applications.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How do I get started with UI Pirate?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Book a free 15-minute call at https://cal.com/ui-pirate/15min or email vishal@uipirate.com. You can also submit a project estimate at https://uipirate.com/contact.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is UI Pirate's pricing?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "UI Pirate offers pay-per-project, monthly retainers, and a 5-Day Pilot option to try the team risk-free. Landing pages start from $1,500 and SaaS products from $5,000. See detailed pricing at https://uipirate.com/pricing.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does UI Pirate work with international clients?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. UI Pirate serves clients primarily in USA, UK, Singapore, India, and Australia, but works globally. All collaboration is remote-first using Figma, Notion, Slack, and video calls.",
                  },
                },
              ],
            }),
          }}
          type="application/ld+json"
        />

        {/* AI Data Reference (kept for AI crawlers that do follow links) */}
        <link href="/ai-data.json" rel="alternate" type="application/ld+json" />
        <link href="/llms.txt" rel="alternate" type="text/plain" />
        <link
          href="/llms-full.txt"
          rel="alternate"
          title="Full AI Context"
          type="text/plain"
        />

        {/* Hreflang + canonical are emitted per-route by the Metadata API via
            `metadata.alternates` above (self-referential, resolved statically at
            build time). Kept out of here so the layout needs no `headers()`. */}

        {/* Social Media and Business Profile Links for SEO */}
        <link
          href="https://www.linkedin.com/company/ui-pirate-by-vishal-anand/"
          rel="me"
        />
        <link href="https://www.behance.net/vishalanand-UI-UX" rel="me" />
        <link href="https://dribbble.com/vishalanandUIUX" rel="me" />
        <link href="https://x.com/UI_Pirate" rel="me" />
        <link
          href="https://clutch.co/profile/ui-pirate"
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
        {/* noscript fallback — ensures AI crawlers that don't execute JS see real content */}
        <noscript>
          <div
            style={{
              padding: "2rem",
              fontFamily: "sans-serif",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            <h1>UI Pirate | SaaS &amp; AI Product Design Agency</h1>
            <p>
              Product design &amp; development agency. We turn SaaS and AI ideas
              into shipped products. UX/UI design, Angular &amp; React
              development. Serving clients in USA, UK, Singapore, India, and
              Australia.
            </p>
            <h2>Services</h2>
            <ul>
              <li>
                <a href="/services/UX-UI-Design">UX/UI Design</a>
              </li>
              <li>
                <a href="/services/SaaS-&amp;-AI-Development">
                  SaaS &amp; AI Development
                </a>
              </li>
              <li>
                <a href="/services/Landing-Pages-&amp;-Business-Websites">
                  Landing Pages &amp; Business Websites
                </a>
              </li>
              <li>
                <a href="/services/UX-Audits-&amp;-Consultation">
                  UX Audits &amp; Consultation
                </a>
              </li>
            </ul>
            <h2>Navigation</h2>
            <ul>
              <li>
                <a href="/case-studies">Case Studies &amp; Portfolio</a>
              </li>
              <li>
                <a href="/pricing">Pricing</a>
              </li>
              <li>
                <a href="/blogs">Blog</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/faqs">FAQs</a>
              </li>
              <li>
                <a href="/tools">Free Tools</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
            <p>
              Founded by Vishal Anand. 50+ products shipped. 5.0 rating.{" "}
              <a href="/contact">Contact us</a>
            </p>
          </div>
        </noscript>

        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          {/* Skip Link for Keyboard Navigation */}
          <a
            className="skip-link sr-only focus:not-sr-only"
            href="#main-content"
          >
            Skip to main content
          </a>

          <div className="relative flex flex-col min-h-screen">
            <SmoothScroll />
            <PageLoader>
              <header>
                <ConditionalNavbar />
                <Breadcrumbs />
              </header>
              <main className="flex-1 min-h-screen" id="main-content">
                {children}
              </main>
              <ConditionalFooter />
            </PageLoader>
            <SpeedInsights />
            <Analytics />
            <AnalyticsTracker />
            <CookieConsent />
            <StickyMobileCTA />
          </div>
        </Providers>

        {/* GA4 + Clarity — public pages only (skips /admin, /login) */}
        <ThirdPartyScripts />
      </body>
    </html>
  );
}
