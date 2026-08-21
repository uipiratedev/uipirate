import { Metadata } from "next";

import Apps4Sale from "@/screens/apps4sale";

export const metadata: Metadata = {
  title: "Apps 4 Sale | Ready-to-Launch Product Systems",
  description:
    "Production-ready micro apps and platforms — AI voice support, onboarding engines, and PirateCOS, our multi-tenant content platform. Plug them into your workflow and launch without building from scratch.",
  alternates: {
    canonical: "https://uipirate.com/apps4sale",
  },
  openGraph: {
    title: "Apps 4 Sale | UI Pirate",
    description:
      "Production-ready micro apps and platforms built for real products — plug them in, customize, and launch.",
    url: "https://uipirate.com/apps4sale",
    type: "website",
  },
};

const Apps4SalePage = () => {
  return <Apps4Sale />;
};

export default Apps4SalePage;
