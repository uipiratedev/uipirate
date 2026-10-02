import { Metadata } from "next";

import Concepts from "@/screens/concepts";
import { listPosts } from "@/lib/pirateCOS/public-client";
import { CONCEPT_DETAILS } from "@/screens/concepts/details";

// ISR: revalidate every 60s so newly published CMS concepts show up
// without a full rebuild (matches /case-studies and /blogs).
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Concepts: AI and API-Driven Product Ideas | UI Pirate",
  description:
    "Technical concept breakdowns for AI and API-driven products: the problem, the market, the phased solution, the tech stack, and what production actually needs beyond a prototype.",
  keywords:
    "AI product concepts, AI voice agent, CRM AI agent, HIPAA AI, Microsoft 365 AI agents, usage-based billing, technical proposals, UI Pirate concepts",
  openGraph: {
    title: "Concepts: AI and API-Driven Product Ideas | UI Pirate",
    description:
      "How we think through a product idea: who has the problem, what to build in what order, and what separates a prototype from a production-ready application.",
    url: "https://uipirate.com/concepts",
    siteName: "UI Pirate by Vishal Anand",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/concepts",
  },
};

const ConceptsPage = async () => {
  const cmsConcepts = await listPosts({
    postType: "concept",
    limit: 50,
  });

  return (
    <Concepts
      cmsConcepts={cmsConcepts}
      detailSlugs={Object.keys(CONCEPT_DETAILS)}
    />
  );
};

export default ConceptsPage;
