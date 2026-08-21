import type { Metadata } from "next";
import RobotsTxtValidatorClient from "@/components/RobotsTxtValidator/RobotsTxtValidatorClient";

export const metadata: Metadata = {
  title: "Free robots.txt Validator & Linter | UI Pirate",
  description:
    "Test and validate any robots.txt syntax against RFC 9309. Catch blocking errors, unknown directives, and accidental AI crawler bans.",
  alternates: {
    canonical: "https://uipirate.com/tools/ai/robots-txt-validator",
  },
};

export default function RobotsTxtValidatorNestedPage() {
  return <RobotsTxtValidatorClient />;
}
