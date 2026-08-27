import { Metadata } from "next";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const ArcCornerToggleScreen = dynamic(
  () => import("@/screens/buttons/arcCornerToggle"),
  {
    loading: () => <Loader />,
  }
);

export const metadata: Metadata = {
  title: "Arc Corner Toggle — Figma Nodes 75:5084 & 75:5131 | UI Pirate",
  description:
    "Interactive tactile Corner Arc Slider Toggle component implemented from Figma Master Button Collection (nodes 75:5084 & 75:5131). Features STANDERD light state and CLICK dark state with tactile corner slider track and sunburst dial.",
  keywords:
    "arc corner toggle, figma 75:5084, figma 75:5131, tactile slider button, corner arc switch, figma to code, react tailwind, ui pirate",
  openGraph: {
    title: "Arc Corner Toggle — Figma Nodes 75:5084 & 75:5131 | UI Pirate",
    description:
      "Interactive tactile Corner Arc Slider Toggle component with STANDERD and CLICK states, frosted glass capsule knob, and sunburst dial.",
    url: "https://uipirate.com/buttons/arc-corner-toggle",
    siteName: "UI Pirate",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/buttons/arc-corner-toggle",
  },
};

export default function Page() {
  return <ArcCornerToggleScreen />;
}
