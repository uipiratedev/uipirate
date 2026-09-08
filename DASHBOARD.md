# Admin Dashboard & First-Party Analytics

A private, role-gated dashboard at **`/admin`** with a self-hosted analytics
pipeline. No third-party analytics API is involved — the site collects its own
page views, clicks, sessions and visitor journeys into MongoDB.

## Setup

1. Ensure `.env` has `MONGODB_URI` and a strong `JWT_SECRET`
   (`openssl rand -base64 32`). Optionally set `CRON_SECRET` for the rollup cron.
2. Create the first admin:

   ```bash
   ADMIN_EMAIL=you@uipirate.com ADMIN_PASSWORD='choose-a-strong-one' npm run create-admin
   ```

   Re-running is safe — it upserts by email and re-grants `website-admin`.
3. `npm run dev`, visit `/admin`, sign in. Invite the rest of the team from
   **Users & Roles** (`/admin/settings/users`).

## Roles

| Role | Sees |
|---|---|
| **website-admin** | Everything — analytics, leads, the identified visitor list & raw journeys, user management, CSV export. |
| **team-member** | Analytics + lead inbox + lead management + export. No PII visitor list, no user management. |
| **normal-user** | Read-only aggregate analytics (Overview, Traffic, Pages, Clicks, Engagement). No leads, no personal data. |

Capabilities are defined once in `lib/auth/roles.ts` (`can(role, capability)`).
Every `/api/admin/*` route and every `/admin` page re-checks server-side — the
filtered sidebar is convenience only.

## Auth

- Custom JWT (HS256) in an httpOnly `up_session` cookie, 7-day expiry.
- `lib/auth/jwt.ts` signs/verifies in Node; `lib/auth/edge.ts` verifies in
  `middleware.ts` with Web Crypto (no library) so the Edge bundle stays small.
- `middleware.ts` bounces unauthenticated `/admin/*` to `/login?next=…` and
  authenticated users away from `/login`.
- `lib/auth/session.ts` — `getSession()` reloads the user from Mongo on every
  request, so a deactivated or role-changed user loses access immediately.

## Analytics pipeline

```
components/analytics/AnalyticsTracker.tsx   (mounted once in app/layout.tsx)
  └─ lib/analytics/client.ts   queue + sendBeacon, consent-gated
       └─ POST /api/analytics/collect   enrich (hashed IP, geo, UA, bot filter)
            ├─ AnalyticsEvent     raw stream, TTL 90d
            ├─ AnalyticsSession   one per 30-min session, TTL 180d
            └─ AnalyticsVisitor   lifetime rollup per up_vid cookie
```

- **Consent-gated.** The tracker only runs when
  `localStorage["cookie-consent"].analytics === true` (the key
  `components/CookieConsent.tsx` writes). It reacts live to a
  `cookie-consent-changed` event. No consent ⇒ no cookies, no events.
- **Cookies:** `up_vid` (visitor, 1y) and `up_sid` (session, 30-min sliding).
- **Events:** `page_view`, `click` (element text / id / href / section /
  `data-analytics-id`), `page_close` (dwell + scroll depth), `ping` (15s
  heartbeat → engaged time), `form_submit`.
- **Privacy:** raw IP is never stored — only a SHA-256 hash. Bot traffic is
  dropped at ingest. Add `data-analytics-id` / `data-section` to a CTA for a
  stable label in the Clicks report.

## Lead ↔ visitor stitching

`app/api/leads/route.ts` and `app/api/estimates/route.ts` read the `up_vid`
cookie on submit and link that visitor's whole session + event history to the
new lead (`lib/analytics/stitch.ts`). The lead drawer then shows the full
pre-submission journey.

`models/Lead.ts` promotes the old inline contact-form schema and adds
`status` / `assignedTo` / `notes` / `visitorId`; `models/Estimate.ts` gains the
same fields.

## Dashboard pages

| Path | What |
|---|---|
| `/admin` | KPIs, traffic trend, top pages / clicks, sources, recent leads |
| `/admin/analytics/traffic` | Time series + channel / country / device / browser breakdowns |
| `/admin/analytics/pages` | Per-page views, unique, time on page, scroll depth, bounce, entrances/exits |
| `/admin/analytics/clicks` | Ranked elements (button / link / CTA) with CTR = clicks ÷ page views |
| `/admin/analytics/engagement` | Visit-duration histogram, scroll funnel, hour×weekday heatmap, stickiest pages |
| `/admin/leads` | Unified contact + estimate inbox; row → drawer with journey timeline + status/notes |
| `/admin/visitors` | Every tracked visitor (identified or anon) + journey drill-down — website-admin only |
| `/admin/settings/users` | Invite, role change, activate/deactivate, reset password — website-admin only |

Read APIs live under `app/api/admin/*`; aggregation is in
`lib/analytics/queries.ts` (pages/clicks/traffic/engagement) and
`lib/analytics/leads.ts` (leads + journeys). All aggregate **on read** — no
pre-aggregation required.

## Optional: daily rollup

`GET /api/analytics/rollup` (guarded by `Authorization: Bearer $CRON_SECRET`)
recomputes `AnalyticsPageDaily` for a UTC day. `vercel.json` runs it at 03:00
UTC. The dashboard does not depend on it — it's a read accelerator for wide
date ranges.

## Tests

```bash
npm test        # vitest — pure logic: enrich, ip/bot, edge JWT verify, date range, rate limit
```
