import { Metadata } from "next";

import Faqs from "@/screens/faqs";
import FaqData from "@/data/faqs.json";

export const metadata: Metadata = {
  title: "FAQs | Product Design & Development Questions Answered | UI Pirate",
  description:
    "Frequently asked questions about UI Pirate's product design & development services, pricing, process, timelines, Angular/React development, and working with our team. Get answers before you book a call.",
  keywords:
    "product design FAQ, design agency questions, SaaS design process, Angular development FAQ, UI design timeline, how to hire product designer, design agency process, idea to product",
  openGraph: {
    title: "FAQs | UI Pirate — Product Design & Development Agency",
    description:
      "Get answers about our product design & development services, pricing, process, and timelines.",
    url: "https://uipirate.com/faqs",
    siteName: "UI Pirate by Vishal Anand",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/faqs",
  },
};

// Build FAQPage schema from the "general" category (most important for Google)
function buildFaqSchema() {
  const generalFaqs = (FaqData as any).general || [];
  const serviceFaqs = (FaqData as any).Services || [];

  // Combine general + services FAQs for the schema (most relevant)
  const allFaqs = [...generalFaqs, ...serviceFaqs];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map(
      (faq: { heading: string; title1: string; list: string[]; title2?: string }) => ({
        "@type": "Question",
        name: faq.heading.replace(/^[^\w]*/, "").trim(), // Remove leading emoji
        acceptedAnswer: {
          "@type": "Answer",
          text: [faq.title1, ...faq.list, faq.title2 || ""]
            .filter(Boolean)
            .join(" "),
        },
      })
    ),
  };
}

const FaqsPage = () => {
  const faqSchema = buildFaqSchema();

  return (
    <div>
      {/* FAQPage JSON-LD for Google rich results */}
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
        type="application/ld+json"
      />
      <Faqs />
    </div>
  );
};

export default FaqsPage;
