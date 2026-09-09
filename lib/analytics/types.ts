/** Wire + storage shapes shared by the client tracker, ingest API, and models. */

export type AnalyticsEventType =
  | "page_view"
  | "click"
  | "page_close"
  | "ping"
  | "form_submit";

export type ReferrerType =
  | "direct"
  | "organic"
  | "social"
  | "referral"
  | "paid"
  | "email"
  | "internal";

export interface Utm {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

export interface ClickElement {
  /** Visible text label, trimmed to 120 chars. */
  text?: string;
  tag?: string;
  id?: string;
  /** First class token — a coarse selector hint. */
  cls?: string;
  role?: string;
  href?: string;
  /** value of the nearest [data-analytics-id] ancestor, if any */
  analyticsId?: string;
  /** nearest [data-section] value or closest <section> heading text */
  section?: string;
}

export interface Dimensions {
  w: number;
  h: number;
}

/** One event as sent by the browser. Server adds ipHash / geo / device / isBot. */
export interface RawEvent {
  type: AnalyticsEventType;
  visitorId: string;
  sessionId: string;
  path: string;
  /** epoch ms on the client */
  ts: number;
  isNewVisitor?: boolean;
  referrer?: string;
  title?: string;
  lang?: string;
  tz?: string;
  utm?: Utm;
  screen?: Dimensions;
  viewport?: Dimensions;
  element?: ClickElement;
  /** page_close only */
  dwellMs?: number;
  scrollDepthMax?: number;
  /** form_submit only */
  formName?: string;
}

export interface CollectPayload {
  events: RawEvent[];
}

export const MAX_EVENTS_PER_BATCH = 50;
export const MAX_TEXT_LEN = 120;
export const MAX_PATH_LEN = 512;
