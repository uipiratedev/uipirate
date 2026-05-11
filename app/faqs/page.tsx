import { Metadata } from "next";

import Faqs from "@/screens/faqs";

export const metadata: Metadata = {
  title: "FAQs | UI/UX Design Agency Questions Answered | UI Pirate",
  description:
    "Frequently asked questions about UI Pirate's design services, pricing, process, timelines, and working with our enterprise UI/UX design team. Get answers before you book a call.",
  keywords:
    "UI/UX design FAQ, design agency questions, SaaS design process, UI design timeline, how to hire UI designer, design agency process",
  openGraph: {
    title: "FAQs | UI Pirate — UI/UX Design Agency",
    description:
      "Get answers about our design services, pricing, process, and timelines.",
    url: "https://uipirate.com/faqs",
    siteName: "UI Pirate by Vishal Anand",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/faqs",
  },
};

const FaqsPage = () => {
  return (
    <div>
      <Faqs />
    </div>
  );
};

export default FaqsPage;
