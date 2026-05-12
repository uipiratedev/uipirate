import { redirect } from "next/navigation";

/**
 * /privacy-policy redirects to /privacy (the canonical page).
 * This fixes the "Alternative page with proper canonical tag" issue in Google Search Console.
 * Google was seeing two pages with the same content and flagging one as a duplicate.
 */
export default function PrivacyPolicyRedirect() {
  redirect("/privacy");
}
