import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";
import { getCurrentUser } from "@/lib/pirateCOS/auth";
import LandingPageClient from "./LandingPageClient";

export const metadata: Metadata = {
  title: "pirateCOS | The Content Production & Distribution Operating System",
  description: "Stop copy-pasting content. Connect your brand brains, refine drafts with a precise AI editor, and publish to WordPress, Ghost, Medium, and LinkedIn in one click.",
  openGraph: {
    title: "pirateCOS | The Content Production & Distribution Operating System",
    description: "Connect your brand brains, refine drafts with a precise AI editor, and publish to WordPress, Ghost, Medium, and LinkedIn in one click.",
    url: "https://cos.uipirate.com",
    siteName: "pirateCOS",
    images: [
      {
        url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1779397879/Screenshot_2026-05-22_023842_sebbvi.png",
        width: 1200,
        height: 630,
        alt: "pirateCOS Workspace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "pirateCOS | The Content Production & Distribution Operating System",
    description: "Stop copy-pasting content. Refine drafts with a precise AI editor, and publish in one click.",
    images: ["https://res.cloudinary.com/dvk9ttiym/image/upload/v1779397879/Screenshot_2026-05-22_023842_sebbvi.png"],
  },
};

export default async function PirateCOSEntryPage() {
  const user = await getCurrentUser();
  const host = (await headers()).get("host") || "";
  const isSubdomain = host.startsWith("cos.") || host === "cos.uipirate.com";

  if (user) {
    redirect(isSubdomain ? "/dashboard" : "/pirateCOS/dashboard");
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "pirateCOS",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Stop copy-pasting content. Connect your brand brains, refine drafts with a precise AI editor, and publish to WordPress, Ghost, Medium, and LinkedIn in one click."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPageClient isSubdomain={isSubdomain} />
    </>
  );
}


