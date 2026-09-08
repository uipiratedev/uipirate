/**
 * First-party analytics tracker (browser). Framework-agnostic singleton; the
 * React glue in components/analytics/AnalyticsTracker.tsx feeds it route
 * changes. Only runs after the visitor grants analytics consent
 * (localStorage["cookie-consent"].analytics === true).
 *
 * Nothing here blocks the page: events are queued and flushed via
 * navigator.sendBeacon on a timer / size threshold / pagehide.
 */
import type { RawEvent, Utm } from "./types";

const ENDPOINT = "/api/analytics/collect";
const VID_COOKIE = "up_vid";
const SID_COOKIE = "up_sid";
const VID_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
const SESSION_IDLE_MS = 30 * 60 * 1000; // 30 min
const FLUSH_INTERVAL_MS = 5_000;
const HEARTBEAT_MS = 15_000;
const QUEUE_LIMIT = 10;
const CLICK_MIN_GAP_MS = 150;
const CLICK_SESSION_CAP = 200;
const CONSENT_KEY = "cookie-consent";

function readConsent(): boolean {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);

    if (!raw) return false;

    return JSON.parse(raw)?.analytics === true;
  } catch {
    return false;
  }
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&")}=([^;]*)`,
    ),
  );

  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAgeSec: number) {
  const secure = location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSec}; SameSite=Lax${secure}`;
}

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();

  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;

    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function parseUtm(search: string): Utm {
  const p = new URLSearchParams(search);
  const out: Utm = {};

  for (const k of [
    "source",
    "medium",
    "campaign",
    "term",
    "content",
  ] as const) {
    const v = p.get(`utm_${k}`);

    if (v) out[k] = v.slice(0, 100);
  }

  return out;
}

class Tracker {
  private started = false;
  private visitorId = "";
  private sessionId = "";
  private isNewVisitor = false;
  private queue: RawEvent[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private currentPath = "";
  private firstPageSent = false;
  private pendingReferrer: string | undefined;

  // per-page engagement state
  private pageEnteredAt = 0;
  private visibleAccumMs = 0;
  private lastVisibleAt = 0;
  private maxScrollPct = 0;
  private pageClosed = false;

  // click rate limiting
  private lastClickAt = 0;
  private clickCount = 0;

  private boundHandlers: Array<[string, EventTarget, EventListener]> = [];

  /** Idempotent. Safe to call on every mount / consent change. */
  start() {
    if (this.started) return;
    if (typeof window === "undefined" || !readConsent()) return;

    this.started = true;

    // ── identity ──────────────────────────────────────────────────────────
    const existingVid = getCookie(VID_COOKIE);

    this.visitorId = existingVid || uuid();
    this.isNewVisitor = !existingVid;
    setCookie(VID_COOKIE, this.visitorId, VID_MAX_AGE);
    this.rollSession();

    this.pendingReferrer =
      document.referrer && !document.referrer.startsWith(location.origin)
        ? document.referrer
        : document.referrer || undefined;

    // ── listeners ─────────────────────────────────────────────────────────
    this.on(document, "click", this.handleClick as EventListener, true);
    this.on(
      document,
      "visibilitychange",
      this.handleVisibility as EventListener,
    );
    this.on(window, "pagehide", this.handlePageHide as EventListener);
    this.on(
      window,
      "scroll",
      this.handleScroll as EventListener,
      { passive: true } as never,
    );

    this.lastVisibleAt =
      document.visibilityState === "visible" ? Date.now() : 0;

    this.flushTimer = setInterval(() => this.flush(false), FLUSH_INTERVAL_MS);
    this.heartbeatTimer = setInterval(() => this.heartbeat(), HEARTBEAT_MS);
  }

  stop() {
    if (!this.started) return;
    this.started = false;

    for (const [type, target, handler] of this.boundHandlers) {
      target.removeEventListener(type, handler, true);
      target.removeEventListener(type, handler);
    }
    this.boundHandlers = [];

    if (this.flushTimer) clearInterval(this.flushTimer);
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.flushTimer = this.heartbeatTimer = null;
    this.queue = [];
  }

  /** Called by the React glue on initial mount and every client navigation. */
  pageView(path: string) {
    if (!this.started || this.isExcluded(path)) return;

    // close out the previous page's engagement before switching
    if (this.currentPath && this.currentPath !== path) this.emitPageClose();

    this.rollSession();
    this.currentPath = path;
    this.pageEnteredAt = Date.now();
    this.visibleAccumMs = 0;
    this.lastVisibleAt =
      document.visibilityState === "visible" ? Date.now() : 0;
    this.maxScrollPct = this.computeScrollPct();
    this.pageClosed = false;

    const evt: RawEvent = {
      ...this.baseFields(path),
      type: "page_view",
      title: document.title.slice(0, 200),
      lang: navigator.language,
    };

    if (!this.firstPageSent) {
      if (this.pendingReferrer) evt.referrer = this.pendingReferrer;
      evt.utm = parseUtm(location.search);
      evt.isNewVisitor = this.isNewVisitor;
      this.firstPageSent = true;
    }

    this.enqueue(evt);
  }

  formSubmit(formName: string) {
    if (!this.started) return;
    this.rollSession();
    this.enqueue({
      ...this.baseFields(this.currentPath || location.pathname),
      type: "form_submit",
      formName: formName.slice(0, 80),
    });
    this.flush(true);
  }

  // ── internals ─────────────────────────────────────────────────────────────

  private isExcluded(path: string) {
    return path.startsWith("/admin") || path === "/login";
  }

  private baseFields(path: string) {
    return {
      visitorId: this.visitorId,
      sessionId: this.sessionId,
      path,
      ts: Date.now(),
      screen: { w: screen.width, h: screen.height },
      viewport: { w: window.innerWidth, h: window.innerHeight },
    };
  }

  private rollSession() {
    const now = Date.now();
    let sid = "";

    try {
      const raw = getCookie(SID_COOKIE);

      if (raw) {
        const parsed = JSON.parse(raw) as { id: string; exp: number };

        if (parsed.exp > now && parsed.id) sid = parsed.id;
      }
    } catch {
      /* fall through to new id */
    }

    if (!sid) sid = uuid();
    this.sessionId = sid;
    setCookie(
      SID_COOKIE,
      JSON.stringify({ id: sid, exp: now + SESSION_IDLE_MS }),
      Math.ceil(SESSION_IDLE_MS / 1000),
    );
  }

  private on(
    target: EventTarget,
    type: string,
    handler: EventListener,
    capture?: boolean | AddEventListenerOptions,
  ) {
    target.addEventListener(type, handler, capture as never);
    this.boundHandlers.push([type, target, handler]);
  }

  private enqueue(evt: RawEvent) {
    this.queue.push(evt);
    if (this.queue.length >= QUEUE_LIMIT) this.flush(false);
  }

  private flush(useBeacon: boolean) {
    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.queue.length);
    const body = JSON.stringify({ events: batch });

    try {
      if (useBeacon && navigator.sendBeacon) {
        navigator.sendBeacon(
          ENDPOINT,
          new Blob([body], { type: "application/json" }),
        );

        return;
      }
      void fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
        credentials: "same-origin",
      }).catch(() => {});
    } catch {
      /* swallow — analytics is best-effort */
    }
  }

  private heartbeat() {
    if (!this.started || document.visibilityState !== "visible") return;
    if (!this.currentPath || this.isExcluded(this.currentPath)) return;

    this.rollSession();
    this.enqueue({ ...this.baseFields(this.currentPath), type: "ping" });
  }

  private handleVisibility = () => {
    const now = Date.now();

    if (document.visibilityState === "hidden") {
      if (this.lastVisibleAt) this.visibleAccumMs += now - this.lastVisibleAt;
      this.lastVisibleAt = 0;
      this.emitPageClose();
      this.flush(true);
    } else {
      this.lastVisibleAt = now;
      this.pageClosed = false;
    }
  };

  private handlePageHide = () => {
    const now = Date.now();

    if (this.lastVisibleAt) this.visibleAccumMs += now - this.lastVisibleAt;
    this.lastVisibleAt = 0;
    this.emitPageClose();
    this.flush(true);
  };

  private emitPageClose() {
    if (
      !this.currentPath ||
      this.pageClosed ||
      this.isExcluded(this.currentPath)
    )
      return;
    this.pageClosed = true;

    const dwellMs =
      this.visibleAccumMs +
      (this.lastVisibleAt ? Date.now() - this.lastVisibleAt : 0);

    if (dwellMs < 250) return; // ignore instant bounces / prefetch renders

    this.enqueue({
      ...this.baseFields(this.currentPath),
      type: "page_close",
      dwellMs: Math.round(dwellMs),
      scrollDepthMax: Math.round(this.maxScrollPct),
    });
  }

  private handleScroll = () => {
    const pct = this.computeScrollPct();

    if (pct > this.maxScrollPct) this.maxScrollPct = pct;
  };

  private computeScrollPct(): number {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;

    if (scrollable <= 0) return 100;

    return Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100));
  }

  private handleClick = (e: Event) => {
    if (!this.started || !this.currentPath || this.isExcluded(this.currentPath))
      return;

    const now = Date.now();

    if (now - this.lastClickAt < CLICK_MIN_GAP_MS) return;
    if (this.clickCount >= CLICK_SESSION_CAP) return;
    this.lastClickAt = now;

    const target = e.target as Element | null;

    if (!target || !(target instanceof Element)) return;

    const el =
      target.closest(
        "a,button,[role='button'],[data-analytics-id],input[type='submit']",
      ) || target;

    if (!(el instanceof HTMLElement)) return;

    this.clickCount += 1;
    this.rollSession();

    const analyticsHost = el.closest(
      "[data-analytics-id]",
    ) as HTMLElement | null;
    const sectionEl = el.closest("[data-section]") as HTMLElement | null;
    const section =
      sectionEl?.getAttribute("data-section") ||
      el.closest("section")?.querySelector("h1,h2,h3")?.textContent ||
      undefined;

    this.enqueue({
      ...this.baseFields(this.currentPath),
      type: "click",
      element: {
        text: (el.innerText || el.getAttribute("aria-label") || "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 120),
        tag: el.tagName.toLowerCase(),
        id: el.id || undefined,
        cls:
          typeof el.className === "string"
            ? el.className.split(/\s+/)[0] || undefined
            : undefined,
        role: el.getAttribute("role") || undefined,
        href:
          el instanceof HTMLAnchorElement
            ? el.getAttribute("href") || undefined
            : undefined,
        analyticsId:
          analyticsHost?.getAttribute("data-analytics-id") || undefined,
        section: section?.replace(/\s+/g, " ").trim().slice(0, 120),
      },
    });
  };
}

let instance: Tracker | null = null;

export function getTracker(): Tracker {
  if (!instance) instance = new Tracker();

  return instance;
}

/** Fire from a form's success handler: `trackFormSubmit("contact")`. */
export function trackFormSubmit(formName: string) {
  if (typeof window === "undefined") return;
  getTracker().formSubmit(formName);
}

export { CONSENT_KEY };
