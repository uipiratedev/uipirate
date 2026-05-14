import { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact UI Pirate | Book a Free Design Consultation",
  description:
    "Book a free 15-minute design consultation with UI Pirate. Discuss your SaaS, mobile app, or enterprise design project. Serving clients in USA, UK, Singapore, India & Australia. Typical response time: 2 hours.",
  keywords:
    "book design consultation, hire UI/UX designer, contact design agency, free design call, SaaS design consultation, enterprise design partner, product design agency contact",
  openGraph: {
    title: "Contact UI Pirate | Book a Free Design Consultation",
    description:
      "Book a free 15-minute consultation. Discuss your design project with our enterprise UI/UX team. We respond within 2 hours.",
    url: "https://uipirate.com/contact",
    siteName: "UI Pirate by Vishal Anand",
    images: [
      {
        url: "https://res.cloudinary.com/dkziil6io/image/upload/v1742919377/ui-pirate-website_amh6qb.png",
        width: 1200,
        height: 630,
        alt: "Contact UI Pirate — Book a Free Design Consultation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/contact",
  },
};

// ContactPage JSON-LD schema
const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact UI Pirate",
  description:
    "Book a free design consultation with UI Pirate's enterprise UI/UX design team.",
  url: "https://uipirate.com/contact",
  mainEntity: {
    "@type": "Organization",
    name: "UI Pirate by Vishal Anand",
    email: "vishal@uipirate.com",
    telephone: "+919708636151",
    url: "https://uipirate.com",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "vishal@uipirate.com",
      availableLanguage: "English",
      areaServed: ["US", "GB", "SG", "IN", "AU"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "22:00",
      },
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <ContactPageClient />
    </>
  );
}
