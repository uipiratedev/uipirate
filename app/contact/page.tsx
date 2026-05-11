import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact UI Pirate | Book a Free Design Consultation",
  description:
    "Book a free 15-minute design consultation with UI Pirate. Discuss your SaaS, mobile app, or enterprise design project. Serving clients in USA, UK, Singapore, India & Australia.",
  keywords:
    "book design consultation, hire UI/UX designer, contact design agency, free design call, SaaS design consultation, enterprise design partner",
  openGraph: {
    title: "Contact UI Pirate | Book a Free Design Consultation",
    description:
      "Book a free 15-minute consultation. Discuss your design project with our enterprise UI/UX team.",
    url: "https://uipirate.com/contact",
    siteName: "UI Pirate by Vishal Anand",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/contact",
  },
};

export default function BookCall() {
  return (
    <div className="flex justify-center items-center min-h-screen  p-4">
      <iframe
        allow="camera; microphone; autoplay; encrypted-media;"
        className="rounded-2xl w-full"
        frameBorder="0"
        height="780"
        src="https://cal.com/ui-pirate/15min"
        title="Book a Call with UI Pirate"
        width="100%"
      />
    </div>
  );
}
