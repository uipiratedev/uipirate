import { Metadata } from "next";

import CaseStudies from "@/screens/caseStudies";

export const metadata: Metadata = {
  title:
    "Case Studies | Enterprise UI/UX Design Projects & Results | UI Pirate",
  description:
    "Explore detailed case studies of our SaaS, fintech, healthcare, and AI product design projects. See real results from enterprise clients including Xperiti, Ipsos, RevUp AI, and more.",
  keywords:
    "UI/UX case studies, SaaS design case study, enterprise design portfolio, fintech UX design, AI app design case study, design agency portfolio",
  openGraph: {
    title: "Case Studies | UI Pirate — Enterprise Design Projects",
    description:
      "Detailed case studies from our work with Fortune 500 and enterprise clients across SaaS, fintech, healthcare, and AI.",
    url: "https://uipirate.com/case-studies",
    siteName: "UI Pirate by Vishal Anand",
    images: [
      {
        url: "https://res.cloudinary.com/dkziil6io/image/upload/v1742919377/ui-pirate-website_amh6qb.png",
        width: 1200,
        height: 630,
        alt: "UI Pirate Case Studies",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/case-studies",
  },
};

const CaseStudiesPage = () => {
  return <CaseStudies />;
};

export default CaseStudiesPage;
