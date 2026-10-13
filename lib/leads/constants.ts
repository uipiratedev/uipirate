/**
 * Lead status vocabulary — kept in a mongoose-free module so client components
 * (LeadsClient, LeadDrawer) can import it without pulling mongoose into the
 * browser bundle. `models/Lead.ts` re-exports these.
 */
export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
];
