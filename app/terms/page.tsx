import { Metadata } from "next";

import TermsAndConditionsScreen from "@/screens/termsAndConditions";

export const metadata: Metadata = {
  title: "Terms and Conditions | UI Pirate",
  description:
    "Read UI Pirate's Terms and Conditions. Understand your rights and responsibilities when using our website and engaging with our design and development services.",
  keywords:
    "terms and conditions, terms of service, legal, user agreement, UI Pirate terms",
  openGraph: {
    title: "Terms and Conditions | UI Pirate",
    description:
      "Review UI Pirate's Terms and Conditions for using our website and engaging with our premium UI/UX design and development services.",
    url: "https://uipirate.com/terms",
    siteName: "UI Pirate by Vishal Anand",
    images: [
      {
        url: "https://res.cloudinary.com/dkziil6io/image/upload/v1742919377/ui-pirate-website_amh6qb.png",
        width: 1200,
        height: 630,
        alt: "UI Pirate - Terms and Conditions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/terms",
  },
};

const TermsPage = () => {
  return (
    <div>
      <TermsAndConditionsScreen />
    </div>
  );
};

export default TermsPage;
