import { Metadata } from "next";

import Concepts from "@/screens/concepts";
import { listPosts } from "@/lib/pirateCOS/public-client";

// ISR: revalidate every 60s so newly published CMS concepts show up
// without a full rebuild (matches /case-studies and /blogs).
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Concepts & Proposals | UI Pirate",
  description:
    "Product concepts, technical proposals, and solution write-ups we've built for prospective clients — the problem, the proposed solution, and the tech stack, even when the project itself didn't move forward.",
  keywords:
    "product proposals, technical proposals, IoT proposal, solution architecture, tech stack write-up, UI Pirate concepts",
  openGraph: {
    title: "Concepts & Proposals | UI Pirate",
    description:
      "The problem, the proposed solution, and the tech stack behind proposals we've built — shared so the thinking isn't wasted, even on projects that didn't move forward.",
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

  return <Concepts cmsConcepts={cmsConcepts} />;
};

export default ConceptsPage;
