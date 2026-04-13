import { Metadata } from "next";

import PrivacyPolicyScreen from "@/screens/privacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy | UI Pirate",
  description:
    "Read UI Pirate's Privacy Policy to understand how we collect, use, and protect your personal information. We are committed to your privacy and data security.",
  keywords:
    "privacy policy, data protection, GDPR, cookies, personal information, UI Pirate privacy",
  openGraph: {
    title: "Privacy Policy | UI Pirate",
    description:
      "Read UI Pirate's Privacy Policy. We are committed to protecting your privacy and ensuring transparency in how we handle your data.",
    url: "https://uipirate.com/privacy",
    siteName: "UI Pirate by Vishal Anand",
    images: [
      {
        url: "https://res.cloudinary.com/dkziil6io/image/upload/v1742919377/ui-pirate-website_amh6qb.png",
        width: 1200,
        height: 630,
        alt: "UI Pirate - Privacy Policy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/privacy",
  },
};

const PrivacyPage = () => {
  return (
    <div>
      <PrivacyPolicyScreen />
    </div>
  );
};

export default PrivacyPage;
