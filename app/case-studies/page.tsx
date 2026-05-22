import { Metadata } from "next";

import CaseStudies from "@/screens/caseStudies";

export const metadata: Metadata = {
  title:
    "Case Studies & Portfolio | 50+ Product Design & Development Projects | UI Pirate",
  description:
    "Explore 50+ shipped products and deep-dive case studies — SaaS platforms, enterprise dashboards, AI applications, fintech, and design systems. Built with Angular, React & Next.js for clients like Xperiti, Ipsos, RevUp AI, and Bird.",
  keywords:
    "UI/UX case studies, product design portfolio, SaaS design case study, enterprise design portfolio, Angular development projects, fintech UX design, AI app design case study, design agency portfolio, shipped products",
  openGraph: {
    title: "Case Studies & Portfolio | 50+ Shipped Products | UI Pirate",
    description:
      "From SaaS platforms to fintech dashboards — 50+ products we designed and developed for enterprise clients globally, with detailed case studies on product thinking, IA, UX/UI and Angular/React development.",
    url: "https://uipirate.com/case-studies",
    siteName: "UI Pirate by Vishal Anand",
    images: [
      {
        url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1779397879/Screenshot_2026-05-22_023842_sebbvi.png",
        width: 1200,
        height: 630,
        alt: "UI Pirate — Case Studies & Portfolio",
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
