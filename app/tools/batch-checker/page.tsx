import type { Metadata } from "next";
import BatchCheckerClient from "@/components/BatchChecker/BatchCheckerClient";

export const metadata: Metadata = {
  title: "Free Batch AI Crawler & GEO Score Checker | UI Pirate",
  description:
    "Audit up to 10 competitor or client domains simultaneously. Compare AI bot access, GEO Visibility scores, and robots.txt configurations in real time.",
  alternates: {
    canonical: "https://uipirate.com/tools/batch-checker",
  },
  openGraph: {
    title: "Free Batch AI Crawler & GEO Score Checker | UI Pirate",
    description:
      "Audit up to 10 competitor or client domains simultaneously. Compare AI bot access, GEO Visibility scores, and robots.txt configurations in real time.",
    url: "https://uipirate.com/tools/batch-checker",
    siteName: "UI Pirate",
    type: "website",
  },
};

export default function BatchCheckerPage() {
  return <BatchCheckerClient />;
}
