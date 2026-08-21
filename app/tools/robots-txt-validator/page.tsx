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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "robots.txt Validator & Linter",
  "url": "https://uipirate.com/tools/robots-txt-validator",
  "description":
    "Test, parse, and validate your robots.txt syntax against standard RFC 9309 and AI bot crawling specifications.",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "provider": {
    "@type": "Organization",
    "name": "UI Pirate",
    "url": "https://uipirate.com",
  },
};

export default function RobotsTxtValidatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RobotsTxtValidatorClient />
    </>
  );
}
