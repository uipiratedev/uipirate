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
        url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1779397879/Screenshot_2026-05-22_023842_sebbvi.png",
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
