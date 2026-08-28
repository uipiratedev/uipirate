import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const VintageLeatherScreen = dynamic(
  () => import("@/screens/buttons/vintageLeather"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Vintage Leather & Brass Heritage Button — Luxury Tactile Component | UI Pirate",
  description:
    "Luxury Victorian & leather goods embossed tactile button with 3D bottom bevel lip, recessed enclosure tray, and filigree scrollwork corner ornaments.",
  keywords:
    "vintage leather button, brass heritage button, luxury embossed cta, tactile bevel button, victorian filigree, react tailwind, ui pirate",
  openGraph: {
    title: "Vintage Leather & Brass Heritage Button — Luxury Tactile Component | UI Pirate",
    description:
      "Luxury Victorian & leather goods embossed tactile button with 3D bottom bevel lip and filigree scrollwork corner ornaments.",
    url: "https://uipirate.com/buttons/vintage-leather-cta",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/vintage-leather-cta",
  },
};

export default function Page() {
  return <VintageLeatherScreen />;
}
