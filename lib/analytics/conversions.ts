/**
 * Classifies a clicked link as a contact/conversion action, and derives a
 * stable id for any link.
 *
 * Pure and dependency-free so it runs in the browser tracker and is unit
 * tested. Lives apart from `enrich.ts` because that module pulls in
 * `ua-parser-js`, which has no business in the client bundle.
 *
 * Why this exists: the site has almost no form leads, because most
 * enquiries leave through WhatsApp, email, a phone link or a Cal.com booking.
 * None of those ever reached the leads count, so the dashboard reported zero
 * conversions for a site that was in fact receiving contact clicks.
 */

export type ConversionKind =
  | "whatsapp"
  | "email"
  | "phone"
  | "calendar"
  | "upwork";

export const CONVERSION_LABELS: Record<ConversionKind, string> = {
  whatsapp: "WhatsApp",
  email: "Email",
  phone: "Phone",
  calendar: "Calendar booking",
  upwork: "Upwork profile",
};

/** Order matters only for readability — the patterns do not overlap. */
const RULES: Array<{ kind: ConversionKind; re: RegExp }> = [
  { kind: "whatsapp", re: /^https?:\/\/(wa\.me|wa\.link|api\.whatsapp\.com|chat\.whatsapp\.com|(www\.)?whatsapp\.com)(\/|$)/i },
  { kind: "email", re: /^mailto:/i },
  { kind: "phone", re: /^tel:/i },
  { kind: "calendar", re: /^https?:\/\/((www\.)?cal\.com|calendly\.com|(www\.)?savvycal\.com|tidycal\.com)(\/|$)/i },
  { kind: "upwork", re: /^https?:\/\/(www\.)?upwork\.com(\/|$)/i },
];

/** The conversion a link represents, or `null` for an ordinary link. */
export function classifyConversion(
  href: string | null | undefined,
): ConversionKind | null {
  if (!href) return null;

  const h = href.trim();

  for (const r of RULES) if (r.re.test(h)) return r.kind;

  return null;
}

/**
 * A stable id for a link, derived from where it goes rather than what it says.
 *
 * Click analytics used to match elements by visible text, so changing a
 * button's copy silently started a new series. A destination does not change
 * when the wording does.
 *
 *   /contact                 -> "link:/contact"
 *   https://wa.link/abc      -> "link:wa.link"
 *   mailto:hi@x.com          -> "link:mailto"
 *   #pricing                 -> "link:#pricing"
 */
export function deriveClickId(
  href: string | null | undefined,
): string | undefined {
  if (!href) return undefined;

  const h = href.trim();

  if (!h) return undefined;
  if (/^mailto:/i.test(h)) return "link:mailto";
  if (/^tel:/i.test(h)) return "link:tel";
  if (h.startsWith("#")) return `link:${h.slice(0, 60)}`;

  if (/^https?:\/\//i.test(h)) {
    try {
      const u = new URL(h);
      const host = u.hostname.replace(/^www\./, "");

      // Same-site absolute links behave like internal ones.
      if (host === "uipirate.com") return `link:${pathOnly(u.pathname)}`;

      return `link:${host}`;
    } catch {
      return undefined;
    }
  }

  return `link:${pathOnly(h.split("?")[0].split("#")[0])}`;
}

function pathOnly(p: string): string {
  const s = p.startsWith("/") ? p : `/${p}`;

  return (s.length > 1 ? s.replace(/\/+$/, "") : s).slice(0, 80);
}
