import { redirect } from "next/navigation";

/**
 * /terms-of-service redirects to /terms (the canonical page).
 * This ensures that requests to /terms-of-service are seamlessly redirected to the correct, SEO-optimized terms page.
 */
export default function TermsOfServiceRedirect() {
  redirect("/terms");
}
