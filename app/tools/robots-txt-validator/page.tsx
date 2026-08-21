import type { Metadata } from "next";
import RobotsTxtValidatorClient from "@/components/RobotsTxtValidator/RobotsTxtValidatorClient";

export const metadata: Metadata = {
  title: "Free robots.txt Validator & Linter | UI Pirate",
  description:
    "Test and validate any robots.txt file. Catch syntax errors, wildcard disallows, and accidental AI crawler blocks.",
  alternates: {
    canonical: "https://uipirate.com/tools/robots-txt-validator",
  },
  openGraph: {
    title: "Free robots.txt Validator & Linter | UI Pirate",
    description:
      "Test and validate any robots.txt file. Catch syntax errors, wildcard disallows, and accidental AI crawler blocks.",
    url: "https://uipirate.com/tools/robots-txt-validator",
    siteName: "UI Pirate",
    type: "website",
  },
};

export default function RobotsTxtValidatorPage() {
  return <RobotsTxtValidatorClient />;
}
