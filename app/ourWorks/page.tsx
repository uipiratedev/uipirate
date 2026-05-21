import { redirect } from "next/navigation";

// /ourWorks merged into /case-studies (single canonical URL for portfolio +
// case studies). Permanent redirect preserves link equity from existing
// inbound links and tells Google to consolidate the signal on /case-studies.
export default function OurWorksPage() {
  redirect("/case-studies");
}
