# Helm — the UI Pirate Agency OS

Status: Draft v5 (phased, finance-first, modelled on current P&L sheet) · Owner: UI Pirate · Date: 2026-10-11

**Helm** is UI Pirate's operating system for running an agency — finances, payroll, contractors, clients, projects, and handovers in one place. The name borrows from the pirate metaphor (you're at the wheel) and scales across modules: *Helm Finance, Helm Clients, Helm Payroll, Helm Portal*.

**Product posture (new):** We build Helm for ourselves first, but with the explicit intent to release it as a product for other small design/dev agencies. **For the first 12 months after public launch, Helm is free** — unlimited access, no credit card — to drive adoption, gather testimonials, and prove the finance + reconciliation workflow in the wild. Paid tiers come at month 13. This decision shapes every architectural choice from day one: multi-tenant from the start, no customer-specific hacks, no "our data" shortcuts in the schema.

Source of truth for Phase 1 shape: the `Executive Financial Overview & Reconciliation` sheet (FY 2026-27, YTD ₹12.48L revenue / ₹8.18L OpEx / ₹2.32L retained after drawings). Phase 1 ships Helm Finance — a replacement for that sheet, same tiles, same monthly P&L, same client-stream + expense-category + bank-reconciliation blocks — in an encrypted, role-gated app.

> **Build order (locked):**
> - **Phase 1 — Helm Finance** (§0A). Ship this first. Encrypted, owner + accountant roles. Replaces the current P&L spreadsheet; handles revenue, expenses, payroll, contractor payouts, owner drawings, and bank/card reconciliation. **Multi-tenant from day one** (see §0C).
> - **Phase 2 — Helm Portal** (§0B). The client-facing surface: invoices (feeding Helm Finance), onboarding, handover, review flow, issues log, journey, revisions.
> - **Phase 3+ — Everything else** (§15 roadmap): support plans, agency dashboard, integrations.
>
> **Product posture:** Helm is built as a product, not a one-off internal tool. Free for 12 months after public launch, paid tiers at month 13. See §0C.
>
> Rationale: finance operations are already a daily pain for the owner/accountant and have zero external dependencies — no client needs to adopt it, so it ships value immediately. The portal MVP sits on top of (and plugs invoices into) the finance ledger built in Phase 1.

---

## 0A. Phase 1 — Helm Finance

**Audience:** agency owner + accountant + (restricted) contractors and employees. **Not visible to clients or client-facing team members.**

A private, encrypted module for running the agency itself. This is the first thing we build and ship. The shape of this module is modelled on the real spreadsheet we currently run the business on (`Executive Financial Overview & Reconciliation`, FY 2026-27), so day one it replaces that sheet without losing anything.

### 0A.1 Executive Overview (home screen)
One screen the owner opens every morning. Scoped to the active financial year (default FY April–March, India).

**Headline tiles (YTD, filterable by FY):**
- Total Revenue
- Total Operating Expenses
- Net Operating Profit (Revenue − OpEx)
- Operating Margin %
- Personal / Owner Drawings
- Net Cash Retained (Operating Profit − Drawings)
- Reconciliation status badge: `Verified & Reconciled` / `Pending Review` / `Mismatch`

**Monthly P&L table** (one row per month, YTD + full-year roll-up):
`Month | Monthly Revenue | Monthly Expenses | Net Operating Profit | Profit Margin % | Personal Drawings | Net Cash Retained | Status (Profitable | Deficit | Break-even)`
Status is derived (not stored).

### 0A.2 Revenue — Clients & Streams
Each revenue stream is a first-class entity, not just a line on an invoice.

Fields: `client/stream name, total billed, % contribution, active period (month range), billing model, currency, FX notes`.

**Billing models (enum, seeded):**
- `fixed_monthly_retainer` (e.g. Pivot Bits)
- `consulting_retainer` (e.g. Whitespace)
- `corporate_legal_retainer` (e.g. Khaitan & Co)
- `project_deliverable` (one-off project)
- `milestone_contract_usd_wire` (international, Frame / SARGE — tracks USD → INR conversion + wire fees)
- `monthly_retainer` (ongoing design/dev)

Revenue entry sources:
- Manual (Phase 1).
- Auto-fed from §0B.1 invoices once the portal ships (Phase 2).
- AI statement ingestion (Phase 1.5) matches incoming credits to a client/stream.

Views: % contribution pie, concentration risk flag (any client > 40% of revenue), stream-wise trailing-12-month trend.

### 0A.3 Expenses — Categories & Nature
Each expense has a `category` and a `nature/type` (two-level taxonomy) so reports stay clean.

**Seeded categories & nature (from current sheet):**
| Category | Nature |
|---|---|
| Core Team Retainers | Fixed Team Payroll |
| Contractor Payouts (e.g. Aniket) | Contractor Payout |
| Claude AI | SaaS / AI Tools |
| Figma Seats | Design Software SaaS |
| Adobe Creative Cloud | Creative Suite License |
| GoDaddy Domain/Mail | Domain & Business Mail |
| Upwork | Freelance & Hiring Tools |
| Google Cloud / Workspace | Cloud Infrastructure & Dev |
| Wix | Web Hosting & CMS |
| Meta Ads | Client Acquisition & Ads |
| (open) | Office / Hardware / Tax / Misc |

Fields per expense: `date, vendor, category, nature, amount, currency, monthly_average (derived), receipt_url, linked_account (bank/card), linked_project?`.

Reports: Total OpEx, % of expenses per category, monthly average per category, trend by nature.

### 0A.4 Personal / Owner Drawings (separate ledger)
Drawings are **not** operating expenses. They sit in their own ledger and only subtract at the "Net Cash Retained" line.
Fields: `month, amount, note`. YTD + monthly average surfaced on the Executive Overview.

### 0A.5 Banking & Credit Card Reconciliation
Mirrors the sheet's reconciliation block.

Accounts seeded:
- HDFC Bank Account (A/C *6415 / DC *3032)
- HDFC Credit Card (CC *4769 / *9631)
- Kotak Bank Account (A/C *6953)
- Kotak Credit Card (CC *2645)
- (extensible — add account by masked identifier)

Per account, per period: `debit_count, total_debits, credit_count, total_credits, net_movement`.
All-accounts roll-up at the bottom.

Reconciliation workflow:
1. Import statement (CSV in Phase 1; AI-assisted in Phase 1.5).
2. Each row ties to either a RevenueEntry, ExpenseEntry, PayrollRun, ContractorInvoice, Drawing, or `transfer_between_own_accounts` (excluded from P&L).
3. Unmatched rows surface in a review queue.
4. Period is marked `Verified & Reconciled` only when every row is tied or explicitly excluded.

### 0A.6 Payroll (Core Team)
- Employees: `name, role, retainer_amount, cycle (monthly), components (base, bonus, reimbursements), bank_details_enc`.
- `PayrollRun` per month → generates a `Payslip` per employee; posts to Expenses under `Core Team Retainers / Fixed Team Payroll`.
- Payslip visibility: the employee sees only their own.

### 0A.7 Contractor Invoicing (Inbound)
Contractors (e.g. Aniket) submit invoices to the agency.
- Contractor portal: upload PDF + line items + currency.
- Lifecycle: `submitted → approved → paid → rejected`.
- On `paid`: auto-posts to Expenses under `Contractor Payouts / Contractor Payout` and matched against the outgoing bank row during reconciliation.

### 0A.8 Projected Revenue
Forward view, kept separate from booked revenue.
- Open invoices (sent, unpaid).
- Signed-but-unbilled milestones.
- Weighted pipeline (probability × amount).
Report: next-90-day cash-in forecast vs. known fixed costs (payroll + fixed SaaS) → runway tile.

### 0A.9 Accountant view
Read-only role scoped to:
- Monthly P&L, YTD roll-ups, Operating Margin, Drawings line.
- Expense categories + nature + totals (no vendor-specific PII beyond what tax filing needs).
- Payroll summaries + Form 16 / TDS-ready exports.
- Reconciliation status per account.
- Tax-period exports (CSV, GST-ready, FY-filtered).
No access to client portals, project data, or credential vault.

### 0A.10 Roles
- `agency_owner` — full access.
- `agency_accountant` — read-only finance; no client portal access.
- `agency_contractor` — can only submit own invoices + see own payment status.
- `agency_employee` — can only see own payslips.
- Everyone else — **no access**. The module is invisible from their navigation.

### 0A.11 Security — non-negotiable
- Separate database schema (`finance.*`) with row-level security; separate DB role from the main app.
- Field-level encryption at rest for sensitive numbers (amounts, salaries, account numbers, tax IDs) using AES-256-GCM; per-record data keys wrapped by KMS. Encrypt on write, decrypt only in-request for authorized roles.
- Entering the finance area requires re-auth (passkey or TOTP), scoped to a short session.
- Tamper-evident audit log (hash-chained); exports require a reason string, logged.
- No finance data in logs, Sentry breadcrumbs, analytics, or LLM prompts. Explicit redaction middleware.
- Backups encrypted with a separate key; restore requires owner + one more approver.
- 2FA mandatory for `agency_owner` and `agency_accountant`.
- No client-portal code path can query `finance.*`. Enforced at the API gateway + DB role level, not just UI.

### 0A.12 Phase 1 data model
```
finance.FinancialYear (code: "FY2026-27", startDate, endDate, status)

finance.ClientStream (name, billingModel, currency, activeFrom, activeTo?)
finance.RevenueEntry (streamId, month, amount_enc, source: manual|invoice|ingested, fxRate?, wireFee_enc?)

finance.ExpenseCategory (name, nature)   # seeded taxonomy, extensible
finance.ExpenseEntry (date, categoryId, vendor, amount_enc, currency, receiptUrl,
                      linkedAccountId, linkedProjectId?, source: manual|ingested)

finance.Employee (name, role, retainer_enc, cycle, bankDetails_enc)
finance.PayrollRun (month, status) ─< Payslip (employeeId, amount_enc, components_enc)

finance.Contractor (name, bankDetails_enc)
finance.ContractorInvoice (contractorId, status, pdfUrl, lines, amount_enc)

finance.OwnerDrawing (month, amount_enc, note)   # separate ledger, not OpEx

finance.Account (type: bank|credit_card, maskedIdentifier, bankName)
finance.StatementImport (accountId, periodStart, periodEnd, fileRef)
finance.StatementRow (importId, date, description_redacted, amount_enc, direction,
                      matchStatus: unmatched|matched|excluded,
                      matchRef: revenue|expense|payroll|contractor|drawing|transfer)
finance.ReconciliationPeriod (accountId, month, debitCount, totalDebits_enc,
                              creditCount, totalCredits_enc, netMovement_enc,
                              status: pending|verified|mismatch)

finance.ProjectedRevenue (source: invoice|milestone|pipeline, weight, amount_enc, expectedDate)

finance.AuditLog (hash-chained)
finance.Export (reason, actor, scope, fyCode)
```

### 0A.13 Phase 1 timeline (4 weeks)
- Week 1: Auth + role gating + re-auth gate; `finance.*` schema; KMS + envelope encryption; audit log skeleton; FY filter.
- Week 2: Client streams + billing-model seed; revenue entry (manual, multi-currency, USD-wire with FX); expense entry with seeded categories/nature; receipts; monthly P&L table + Executive Overview tiles.
- Week 3: Payroll (employees + payslips); contractor inbound invoice flow; owner drawings ledger; concentration-risk & runway tiles.
- Week 4: Bank/card accounts + statement CSV import + reconciliation review queue; accountant read-only view; FY-scoped exports (CSV, GST-ready); security review.

### 0A.14 Phase 1.5 — AI statement ingestion (follows Phase 1, before Phase 2)
- Upload: bank statement CSV/PDF, UPI/SMS export, payment-gateway payout CSV, credit-card statement.
- Pipeline: file → isolated bucket → parser extracts rows → LLM classifies each row (income | expense | transfer | refund) + category + likely project/client/vendor → confidence score → owner review queue.
- Only approved rows commit to `finance.*`. Nothing auto-posts.
- The LLM sees redacted rows (amount + merchant string + date), never account numbers or balances. Prompts and responses are not retained.
- Reconciliation: match ingested rows against existing invoices/expenses; flag mismatches.

---

---

## 0C. Product strategy — "free for a year, then paid"

Helm is dogfooded by UI Pirate and simultaneously developed as a sellable product. The free-year window is a deliberate GTM move, not a hobby project.

### 0C.1 Why free for 12 months
- **Trust before price.** Agencies won't hand over payroll, bank data, and client invoices to a brand-new tool unless the stakes are low. Free removes the first objection.
- **Volume for feedback.** Finance workflows have long tails of edge cases (GST, TDS, FX wires, state-wise taxes). We need 50–200 real agencies abusing it before we can price with confidence.
- **Testimonials, case studies, screenshots.** Month-13 pricing lands on top of a wall of proof, not a cold landing page.
- **Lock-in by convenience, not contracts.** Once an agency has 12 months of reconciled books in Helm, moving out is painful — but only if they *want* to stay. If they don't, we didn't deserve them.

### 0C.2 What "free" means (and doesn't)
- **Free:** every Phase 1 + Phase 2 feature, unlimited clients, unlimited projects, unlimited team members, unlimited transactions, exports, AI statement ingestion (within fair-use token quota), full encryption.
- **Not free:**
  - Pass-through costs (payment gateway fees, SMS, email beyond fair-use).
  - White-label / custom-domain (reserved for a future paid tier).
  - Dedicated support SLAs (community support only in year 1).
- **Fair-use ceiling** on AI ingestion (per-workspace monthly token cap) so one tenant can't burn our LLM budget.

### 0C.3 Product constraints this implies from day one
Decisions we lock *now* because they are 10× harder to retrofit later:

- **Multi-tenant from day one.** `workspace_id` on every row in both `app.*` and `finance.*` schemas. Row-level security enforces isolation. No single-tenant shortcut, even for ourselves.
- **Our own workspace is just a workspace.** UI Pirate's finance data lives behind the same tenant boundary as every other agency's. No special-case bypass.
- **Per-tenant data keys.** The `finance.*` envelope-encryption scheme uses a KMS data-key per workspace, not a global one. One tenant's compromise never leaks another's.
- **Billing surface stubbed, not wired.** Build the plan/subscription/metering data model in Phase 1 even though nothing is charged. At month 13 we flip a flag, not rewrite auth.
- **No "founding team" easter eggs.** No hard-coded account IDs, no "if workspace == uipirate" branches. Treat ourselves as a customer so our tests reflect reality.
- **Portability.** "Export workspace" (full JSON + attachments ZIP) exists from v1. If someone wants to leave, we help them. This is also how we survive our own bugs.
- **Open changelog + public roadmap.** From day one, so free users feel like early investors in a product, not beta testers of a side project.

### 0C.4 Positioning
"**Helm — the agency OS.** Finance, payroll, clients, and project handover in one encrypted workspace. Free for your first year."

Target: 2–20 person design/dev/branding agencies in India + SEA + EU, who today juggle Google Sheets + Zoho/QuickBooks + WhatsApp + manual invoices. **Not** competing with full-stack ERPs (Zoho One) — competing with the gap between a spreadsheet and an ERP, where most small agencies actually live.

### 0C.5 Month-13 pricing (hypothesis, not committed)
Model shape we're designing toward — final numbers set after year-1 data:
- **Solo / Starter** — free forever (1 user, limited clients). Keeps the top of the funnel.
- **Studio** — paid monthly, per workspace, flat (not per-seat). Includes everything.
- **Agency** — higher tier for white-label, custom domain, priority support, dedicated LLM budget.
- No per-seat pricing in year 2. Agencies hate it, and it punishes exactly the growth we want to enable.

### 0C.6 Things we deliberately *do not* decide now
- Final pricing numbers.
- Whether to incorporate a separate product entity for Helm (tax / IP question for later).
- Whether to open-source any part. Candidate: the design-token / shadcn component layer.

---

## 0B. Phase 2 — Helm Portal (Client-Facing MVP)

Narrow, honest, and shippable. Only these capabilities make the client-facing release:

### 0B.1 Invoice sharing
- Create invoice (manual line items or from a milestone), PDF generated, shared on a stable portal URL.
- States: `draft → sent → paid → overdue`. Mark-paid manually with proof upload (gateway comes later).
- Client sees: amount due, due date, download PDF, payment instructions.
- Team sees: list across clients, outstanding total, overdue flag.

### 0B.2 Onboarding
- Magic-link invite to client after proposal signed.
- Setup: name, timezone, password/passkey, teammates.
- Contact preferences: list preferred external channels (WhatsApp / Slack / Teams / phone) as contact info only — we share links there manually.
- Short guided tour; checklist on Overview until done.

### 0B.3 Final handover
A dedicated **Handover** section per project, filled progressively, locked and date-stamped at closure.
- Scope delivered (checklist), repos, hosting, domain, DNS, env matrix, deploy runbook.
- Credentials vault (encrypted) with scoped access.
- Design files (Figma links + exported bundles).
- Docs: brand guidelines, design system, API docs, admin guide.
- "Export handover" button → single zipped package + a printable summary.

### 0B.4 Shipped / ready-for-review updates
- Each milestone or deliverable version can be marked `ready_for_review` or `shipped`, with a short note.
- Client gets a notification + a single CTA to review.
- Review action: `approve` (timestamped, binding) or `request_revision` (see §0.7).
- Overview shows the current "waiting on client" and "waiting on us" items.

### 0B.5 Bugs, requests, change requests — one log
Unified **Issues** list per project, filter by type:
- `bug` (something broken)
- `request` (small ask / feedback)
- `change_request` (out-of-scope → needs quote)
Each issue: `title, description, attachments, type, severity, status, linked_deliverable, linked_milestone, comments, time_log`.
Lifecycle: `new → triaged → in_progress → in_review → resolved → closed` (+ `on_hold`, `reopened`).
Change requests can be promoted to a mini-milestone (quote → approve → invoice) without leaving the issue.

### 0B.6 Idea → feature / design history
A per-project **Journey** timeline that captures how work evolved:
- Entries: `idea`, `decision`, `design_version`, `feature_shipped`, `revision`.
- Auto-populated from deliverable versions, milestone approvals, and resolved issues; manual entries for off-portal decisions.
- Each entry links back to the artifact (design version, PR, issue) so the "why did we build it this way?" question has one answer.

### 0B.7 Revision requests at any time
- From any deliverable / milestone / shipped item, client can click **Request revision**.
- Opens a form: what to change, references, priority.
- System auto-tags `in_scope` (adds a task to the current milestone) or `change_request` (opens a quote flow) — team confirms the tag.
- Revision thread stays attached to the specific version it was raised against, so future readers see the before/after.

### 0B.8 Out of Phase 2 MVP (explicit)
Payments gateway, support plans/SLAs/tickets, agency dashboard, health panel, templates, guest links, e-sign, Figma/GitHub integrations, in-app realtime chat (comments + email are enough for MVP). (Internal finance ops lives in Phase 1, §0A.)

### 0B.9 Minimum data model for Phase 2
```
User, Workspace, Client, Project, Member
Milestone (status + optional invoice)
Deliverable ─< Version (file[], note, state: draft/ready_for_review/approved)
Issue (type: bug|request|change_request, status, linkedTo)
JourneyEntry (type, refId, note, createdAt)
Invoice (lines, status, pdfUrl)
CredentialGroup ─< Credential (encrypted)
Comment (polymorphic: deliverable|milestone|issue|invoice)
Notification, AuditLog
```
(Phase 1 `finance.*` schema is defined separately in §0A.4 and never joins to this schema from the portal side.)

### 0B.10 Phase 2 timeline
4 weeks, solo or 1+1, starting after Phase 1 ships:
- Week 1: Auth, workspace, project, onboarding, invoice (manual, feeds Phase 1 revenue ledger).
- Week 2: Deliverables + versions + review/approve/revision flow.
- Week 3: Issues (bugs/requests/CRs) + handover section + credentials vault.
- Week 4: Journey timeline, polish, notifications, deploy.

---



Written from the agency owner's seat. The portal is not a side-tool — it is how UI Pirate runs the business: fewer status calls, cleaner approvals, faster invoicing, visible delivery, higher retention.

---

## 1. Why we are building this

Today the agency runs on scattered Google Docs, Figma links, WhatsApp, email, and manual invoices. The cost:

- **Approval drag:** sign-offs happen in chat; nothing is dated or binding.
- **Payment leakage:** invoices chase delivery instead of being coupled to it.
- **Scope creep:** change requests arrive as DMs and quietly become unpaid work.
- **Support chaos:** post-launch bugs land in inboxes, lost between projects.
- **No retention loop:** once a project ends, the client relationship goes cold.

The portal fixes those five, in that order. Everything else is secondary.

## 2. Business outcomes we are optimizing for

| Outcome | How the portal moves it |
|---|---|
| Faster cash collection | Milestones trigger invoices; approval → invoice is one click |
| Protected scope | Every change request is a tracked artifact with a quote |
| Lower delivery overhead | Clients self-serve status, files, credentials — fewer "any update?" pings |
| Higher retention | Support plans + health dashboard keep us in the client's stack after launch |
| Reusable IP | Templated projects (branding, design system, web, SaaS) compound across clients |
| Hiring leverage | Any new team member sees the full project state on day one |

Every feature choice below is justified against this list. If it doesn't move one of these, it is phase 3+.

## 3. The engagement lifecycle (what the portal models)

```
Lead  →  Proposal  →  Project (Active)  →  Launch  →  Support  →  Renewal / Upsell
                           ↑                                            ↓
                           └────────────────── Repeat ──────────────────┘
```

The portal has a surface for each stage, and the stages share one data model so a client never "starts over."

## 4. Core surfaces

### 4.1 Agency dashboard (internal)
- Pipeline (leads + proposals), active projects by phase, revenue (booked / invoiced / collected / outstanding), utilization per team member, overdue approvals, SLA-breach tickets, renewals in next 60 days.
- One screen the owner opens every morning.

### 4.2 Project workspace (client + team)
Tabs, in order of client use:
1. **Overview** — status, team, next milestone, outstanding actions on client.
2. **Plan** — phases → milestones → tasks; dates, dependencies, progress.
3. **Deliverables** — brand, design system, dev artifacts, docs; versioned.
4. **Links** — Figma, repos, staging, production, drive.
5. **Credentials** — encrypted vault, scoped access.
6. **Chat** — in-app, project-scoped.
7. **Tickets** — post-launch support (hidden until launch milestone).
8. **Payments** — invoices + status.
9. **Activity** — full audit trail.

### 4.3 Templates (internal)
- Project templates per service: Brand Identity, Design System, Marketing Site, Web App, SaaS Build, Mobile App.
- Each template seeds phases, milestones, deliverable slots, credential groups, standard SOW clauses. Starting a new project is 2 minutes, not 2 hours.

## 5. Milestone spine

Everything hangs off milestones.

A milestone owns: `title, phase, deliverables[], due_date, status, amount, invoice_id, approval, dependencies[]`.

Status flow: `planned → in_progress → in_review → approved → invoiced → paid`.

- `in_review` pings client with a single CTA ("Review design system v1.2").
- `approved` is binding (timestamp + optional e-sign on high-value milestones).
- `approved` auto-generates an invoice draft; team hits send.
- `paid` closes the loop; next milestone unlocks per dependencies.

This single flow drives the whole business engine.

## 6. Deliverables (how we actually share work)

| Type | Primary view | Source | Notes |
|---|---|---|---|
| Brand identity | Rendered page: logo variants, usage, colors, type | uploaded assets + MDX | Download bundle on demand |
| Design system | Live preview page: tokens, components, states | token JSON + MDX | Also exports Style Dictionary |
| Figma handoff | Embedded Figma frame + link | Figma URL | Version-pinned snapshots |
| Dev handoff | Repos, staging, env matrix, deploy notes | links + MDX | |
| Docs | Research, strategy, SOW, UX notes | PDF / MDX | |
| Credentials | Grouped secrets by category | encrypted vault | |

Every deliverable has `versions[]`. Approvals bind to a specific version. Clients see "Latest" by default; dropdown shows history.

Change requests are promoted from comments → tagged `in_scope` (adds a task to the current milestone) or `scope_change` (spawns a new mini-milestone with its own quote + invoice). This is the main scope-creep defense.

## 7. Post-launch support

After the launch milestone is approved, Support mode activates: Tickets tab appears, support plan clock starts.

- **Plans:** Warranty (free, 30d, bugs only), Retainer (monthly hours), AMC (annual, bundled).
- **Tickets:** severity P1–P4, lifecycle `new → triaged → in_progress → in_review → resolved → closed`, SLA timers per plan, time logged per ticket.
- **Scope guard:** each ticket tagged in-scope or change-request (same CR flow as §6).
- **Health panel:** uptime, last deploy, SSL/domain expiry, error-rate snapshot, credential rotation reminders.
- **Monthly report:** auto-generated — tickets, hours used, SLA adherence, uptime, upcoming expiries.
- **Renewals:** 30/14/7-day reminders before plan ends; one-click renew → invoice.

Support is the retention engine. The portal makes it a product, not a favor.

## 8. Payments

- Invoices are milestone-driven. No invoice exists without a milestone.
- Gateways: Razorpay (India) first, Stripe (international) phase 2.
- Portal shows: total contract value, invoiced, paid, outstanding, next due.
- Auto reconciliation via gateway webhooks; manual-mark-paid for bank transfer with proof upload.
- GST / tax config per workspace.

## 9. Communication

Portal = source of truth. Communication layers are kept deliberately thin.

- **In-app chat** (primary): project-scoped room, pin to milestone/deliverable/ticket, link unfurls, searchable.
- **Comments:** per deliverable / milestone / ticket for review-style feedback.
- **Email notifications:** default on; reply-to writes back a comment.
- **External channels (opt-in, manual):** Client lists preferred contact — WhatsApp, Slack, Teams, Telegram, phone. Team manually shares portal links there for quick nudges. No bots, no inbound mirroring in MVP.
- **Phase 2:** optional outbound WhatsApp / Slack notifications if a client specifically asks.

Rule: anything decided outside the portal must land back in a comment or milestone before it counts.

## 10. Onboarding (client)

Target: signed proposal → ready to collaborate in under 10 minutes.

1. Magic-link email to `client_admin`.
2. Account setup: name, photo, timezone, passkey/password.
3. Contact preferences: pick which external channels to list (opt-in, manual).
4. Notification matrix: event-category × channel; sensible defaults pre-filled.
5. Invite teammates (`client_viewer` seats).
6. Credential handshake (optional): paste anything they want us to have into the vault.
7. 4-slide guided tour.
8. Welcome email + first project overview in preferred channel.

Checklist persists on Overview until complete; team sees who is stuck where.

## 11. Permissions

Roles: `owner`, `team`, `client_admin`, `client_viewer`, `guest`.

- Credentials: owner/team/client_admin only; others see masked or "available on request."
- Guest links (phase 2): one deliverable, expiring, optional password.
- Full audit log on credential reads, approvals, invoice access.

## 12. Data model (sketch)

```
Workspace, User, Role, Membership
Client
Project ─< Phase ─< Milestone ─< Task
Milestone ─< Deliverable (polymorphic) ─< Version ─< Asset
Project ─< CredentialGroup ─< Credential (encrypted)
Project ─< Link
Milestone ─< Invoice ─< Payment
Project ─< Approval, Comment, ChatMessage
Project ─< SupportPlan ─< Ticket ─< TimeEntry
Notification, AuditLog
Template (project blueprint)
```

## 13. Tech stack

- **Frontend:** Next.js (App Router) + Tailwind + shadcn/ui. Reuses the design system we already run on the marketing site.
- **Backend:** Node (NestJS or Fastify) — shared TS types with frontend.
- **DB:** Postgres + Prisma (or Drizzle).
- **Auth:** Clerk (passkey + magic link + SSO path).
- **Storage:** Cloudflare R2 (cheap egress) with signed URLs.
- **Vault:** per-project data key, AES-256-GCM, wrapped by KMS.
- **Payments:** Razorpay first, Stripe phase 2.
- **Email:** Resend. **Realtime chat:** Ably or Pusher (buy, don't build).
- **Hosting:** Vercel (frontend) + Fly.io/Render (API) + managed Postgres (Neon or Supabase).
- **Observability:** Sentry, Axiom (logs), UptimeRobot.

## 14. Repo decision — new repo

**Recommendation: new repo** (`helm`), not inside `uipirate` (the marketing site).

Reasons:
- **Different product, different cadence.** Marketing site deploys on content changes; portal deploys on feature work. Mixing them makes CI slower and risk higher.
- **Different risk profile.** Portal holds client credentials, invoices, encrypted vault — stricter access control, separate secrets, separate audit. Keeping it alongside a public marketing site is a liability.
- **Different auth surface.** Marketing site is anonymous public. Portal is authenticated SaaS. Routing, middleware, headers all differ.
- **Different scaling story.** Portal needs a backend + DB + realtime; marketing site is static-first on Vercel.
- **Easier to open-source or sell later.** If we ever productize the portal (sell to other agencies, per §15), a clean repo is a prerequisite.

**What we keep shared** (via a lightweight monorepo or published npm packages):
- Design tokens / Tailwind preset.
- shadcn component library overrides.
- Brand assets.

Suggested shape:
```
helm/                       # new repo
  apps/
    web/                    # Next.js frontend
    api/                    # Node backend
  packages/
    ui/                     # shared components (mirrors marketing site's)
    tokens/                 # design tokens
    config/                 # tsconfig, eslint, tailwind preset
```
Turborepo or pnpm workspaces. Keep the marketing site where it is; later, pull `packages/ui` and `packages/tokens` out into their own repo if a third product shows up.

## 15. Roadmap

### MVP — ship in 4–6 weeks
Scope cut to the five pains in §1:
- Auth, workspace, clients, projects.
- Templates (3 to start: Brand, Design System, Web).
- Plan + milestones + approvals.
- Deliverables with versioning (brand page + design-system renderer + file uploads + Figma embed).
- Links.
- Credential vault (basic).
- In-app chat + comments + email notifications.
- Payments (manual invoice entry + mark-paid; no gateway yet).
- Activity feed.
- Onboarding flow.

### Phase 2 — 6–10 weeks after MVP
- Razorpay integration + webhooks.
- Tickets + support plans + SLA timers.
- Health panel.
- Agency dashboard (pipeline + revenue + utilization).
- Guest share links.
- Monthly support reports.
- Figma API: auto-snapshot versioning.

### Phase 3 — opportunistic
- Stripe (international clients).
- E-signature on milestones.
- GitHub app for dev handoff status.
- Mobile PWA polish.
- Multi-tenant hardening for selling to other agencies.
- Zapier/webhook outbound.

## 16. Risks & how we handle them

| Risk | Mitigation |
|---|---|
| Over-scoping — building a SaaS instead of a portal | Hard MVP gate on §1's five pains |
| Client adoption — they ignore the portal and keep using WhatsApp | Onboarding tour + email reply-to-comment + manual link-sharing habit for team |
| Credential vault bugs | Use a battle-tested lib (libsodium); audit before any credential ships; consider 1Password Connect as fallback |
| Realtime chat complexity | Buy (Ably/Pusher), do not build |
| Data loss | Daily Postgres backups + R2 versioning + export-project feature |
| Running the portal becomes a second job | Treat it as a product with its own backlog, not an internal tool |

## 17. Open questions

- Razorpay vs Stripe first — depends on next 3 clients' geography.
- Vault: build with libsodium, or integrate 1Password Connect / Doppler?
- Templates: Style Dictionary as the token schema, or custom?
- Multi-tenant from day one, or single-tenant and refactor if we sell it?
- Clerk vs Auth.js vs WorkOS for auth?

## 18. Next step

1. Confirm repo decision (§14) and MVP scope (§15).
2. Decide on §17 questions.
3. Spin up `uipirate-portal` repo with the monorepo skeleton.
4. Wireframes: Agency dashboard, Project Overview, Plan, Deliverables (design-system view), Payments, Onboarding.
5. Prisma schema v0 from §12.
6. 2-week sprint plan to MVP milestone 1 (auth + workspace + project + plan).
