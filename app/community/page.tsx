import { Metadata } from "next";

import Community from "@/screens/community";

export const metadata: Metadata = {
  title: "Community Insights | Coming Soon",
  description: "Join the UiPirate community of creators and designers. Coming soon.",
  // Thin "coming soon" page — keep out of the index until real content ships.
  robots: { index: false, follow: true },
};

const CommunityPage = () => {
  return <Community />;
};

export default CommunityPage;
