import type { Metadata } from "next";
import BatchCheckerClient from "@/components/BatchChecker/BatchCheckerClient";

export const metadata: Metadata = {
  title: "Free Batch AI Crawler & GEO Score Checker | UI Pirate",
  description:
    "Audit up to 10 competitor or client domains simultaneously. Compare GEO scores and crawler permissions side-by-side.",
  alternates: {
    canonical: "https://uipirate.com/tools/ai/batch-checker",
  },
};

export default function BatchCheckerNestedPage() {
  return <BatchCheckerClient />;
}
