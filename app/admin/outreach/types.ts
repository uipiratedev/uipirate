export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  category: string;
  city: string;
  state: string;
  website: string;
  pitch: string;
  whatsappDraft: string;
  emailSubjectDraft?: string;
  emailDraft?: string;
  hasWebsite: string;
  batch: string;
  status: string;
  callCount: number;
  lastCalledAt: string | null;
  whatsappCount: number;
  lastWhatsappAt: string | null;
  emailCount: number;
  lastEmailAt: string | null;
  extra: Record<string, string>;
  touches: Array<{
    channel: "call" | "whatsapp" | "email";
    at: string;
    byName?: string;
    message?: string;
  }>;
  notes: Array<{ id: string; byName?: string; at: string; text: string }>;
  activities: Array<{
    type: "status" | "website" | "outreach" | "draft";
    at: string;
    byName?: string;
    summary: string;
  }>;
  createdAt: string;
}

export type Channel = "call" | "whatsapp" | "email";

export const digits = (v: string) => v.replace(/\D/g, "");

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const DEFAULT_WA_DRAFT =
  "Hi {{name}} team, this is UI Pirate. We build fast, modern websites for packaging companies and had an idea for you. Do you have a few minutes to chat?";

export const DEFAULT_EMAIL_SUBJECT = "Quick idea for {{name}}";

export const DEFAULT_EMAIL_DRAFT =
  "Hi {{name}} team,\n\nI was looking at {{website}} and had a few ideas to help improve modern user experience and conversion.\n\nWould you have a few minutes this week to connect?\n\nBest regards,\nUI Pirate";

/** Fill {{name}} / {{city}} / {{website}} / {{company}} placeholders. */
export const fillDraft = (text: string, c: Contact) =>
  (text || "")
    .replace(/\{\{\s*name\s*\}\}/gi, c.name || "")
    .replace(/\{\{\s*city\s*\}\}/gi, c.city || "")
    .replace(/\{\{\s*company\s*\}\}/gi, c.company || c.name || "")
    .replace(/\{\{\s*website\s*\}\}/gi, c.website || "");

/** The WhatsApp text that will be sent (drafted, saved or default). */
export const waMessage = (c: Contact, draft?: string) =>
  fillDraft(draft?.trim() || c.whatsappDraft || DEFAULT_WA_DRAFT, c);

/** wa.me link carrying the drafted message (or the default one). */
export const waHref = (c: Contact, draft?: string) =>
  `https://wa.me/${digits(c.phone)}?text=${encodeURIComponent(waMessage(c, draft))}`;

export const emailSubject = (c: Contact, draft?: string) =>
  fillDraft(draft?.trim() || c.emailSubjectDraft || DEFAULT_EMAIL_SUBJECT, c);

export const emailBody = (c: Contact, draft?: string) =>
  fillDraft(draft?.trim() || c.emailDraft || DEFAULT_EMAIL_DRAFT, c);

export const mailHref = (c: Contact, subject?: string, body?: string) => {
  const s = emailSubject(c, subject);
  const b = emailBody(c, body);

  return `mailto:${c.email}?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(b)}`;
};

export const canWhatsapp = (c: Contact) => digits(c.phone).length >= 8;
