# SaaS Architecture Planner: Build Plan

Free tool at `/tools/saas/saas-architecture-planner`. The user describes their SaaS idea and gets a suggested architecture, module list, timeline and cost range. It works as a lead magnet for UI Pirate's SaaS and AI product design and development service.

## 1. Goals
- Prove enterprise SaaS depth (roles, tenancy, integrations, compliance) in one interactive page.
- Capture qualified leads: the full plan travels with the lead into `/api/leads`.
- Rank for "SaaS architecture planner", "SaaS cost estimator", "MVP scope calculator".
- Stay consistent with the existing `/tools/saas/*` pattern, with no new heavy dependencies.

## 2. Target users
Founders, product managers and CTOs at early-stage and enterprise SaaS companies who are scoping a build and need a defensible starting point before talking to an agency.

## 3. User flow
1. **Landing:** hero, one-line promise, "Start planning" button.
2. **Wizard (5 steps, with progress bar and back/next):**
   1. Product basics
   2. Users and roles
   3. Features and modules
   4. Integrations and compliance
   5. Scale and team
3. **Result page:** generated plan with tabs, a summary card and the CTA.
4. **Actions:** copy as Markdown, copy Markdown, share link, book a call, "get this built".

## 4. Wizard inputs

| Step | Fields |
|---|---|
| Basics | Product name (optional), product type (B2B SaaS, marketplace, AI app, fintech, healthtech, legaltech, edtech, proptech, internal tool), one-line description, stage (idea, MVP, scaling, rebuild) |
| Users and roles | Number of roles (preset chips: Admin, Manager, Analyst, End user, Customer, Vendor, Custom), multi-tenant or single-tenant, custom permissions (yes/no), SSO needs |
| Features | Checklist: auth, dashboards, reporting, notifications, billing and subscriptions, file uploads, search, workflow engine, audit log, admin panel, public API, webhooks, AI assistant, real-time collaboration, mobile app |
| Integrations and compliance | Integrations (Stripe, Slack, Salesforce, HubSpot, Google, Microsoft 365, Twilio, custom), compliance (SOC2, HIPAA, GDPR, none), data residency |
| Scale and team | Expected users (under 1k, 1k to 50k, 50k+), data volume, uptime expectation, team (none, 1 to 3 devs, 4+), launch window |

## 5. Output: the generated plan
All tabs are produced by a deterministic rules engine (see section 6).

1. **Summary:** product type, complexity score (1 to 10), recommended approach.
2. **Architecture:** layered diagram (client, API, services, data, infrastructure) with the reasoning for each choice.
3. **Tech stack:** table of layer, recommendation and why. Defaults follow UI Pirate's stack: Next.js or Angular (Angular for dense enterprise dashboards), Node or FastAPI, Postgres or MongoDB, AWS.
4. **Modules and roadmap:** features grouped into MVP, V1 and V2 with a suggested build order.
5. **Data model:** key entities and relationships (tenant, user, role, plus domain entities).
6. **Security and compliance:** a checklist driven by the selected compliance needs.
7. **Timeline and cost:** phase breakdown, total weeks and a cost range (low to high) with the assumptions listed.
8. **Risks:** the top five risks for the selected inputs and how to mitigate each.

## 6. Logic design
- **Rules engine:** a pure TypeScript function `generatePlan(input): Plan`. No AI call in v1, so results are instant, free and testable.
- **Scoring:** each feature, role count, integration and compliance option adds weighted complexity points. The total maps to a tier (Simple, Standard, Complex, Enterprise).
- **Estimates:** tier plus module weights give base weeks. Multipliers apply for compliance, integrations and tenancy. Show a range (for example 0.8x to 1.3x), never a single number.
- **Pricing source (real website pricing, `screens/landing/pricingFlip/index.tsx`):**
  - Monthly retainer: from $499/month (one active request at a time)
  - Custom project: from $2K (scoped quote)
  - 5-day pilot: $350, deductible from the final invoice
  - Keep these as constants in `lib/saasPlanner/pricing.ts` so they match the site and are easy to update.
  - Cost output: Simple and Standard tiers map to the retainer (months x $499, with the figure shown as "starting from"); Complex and Enterprise tiers show "Custom project, starting from $2K" and push the user to a discovery call. Do not invent per-feature dollar prices.
- **Stack rules:** a lookup table keyed by product type and constraints (for example, HIPAA leads to an encrypted-at-rest database and an audit log marked mandatory).
- **Phase 2 (optional):** an AI "refine my plan" step that accepts free-text and uses an LLM to polish the summary and risks.

## 7. Lead capture
- The plan is fully visible without signup, with no gate.
- Gate only "Email me this plan" behind `LeadCaptureForm`.
- Send the plan JSON with the lead to `/api/leads`. Check the `Lead` model for a notes or metadata field before deciding whether to extend it.
- A persistent CTA reads "Get this built by UI Pirate", linking to `https://cal.com/ui-pirate/15min`.

## 8. Files to create

```
app/tools/saas/saas-architecture-planner/page.tsx    metadata, JSON-LD, FAQ schema
components/SaasArchitecturePlanner/
  SaasArchitecturePlannerClient.tsx                  wizard state and layout
  steps/ (5 step components)
  PlanResult.tsx                                     tabs
  ArchitectureDiagram.tsx                            inline SVG or CSS layers
  CostTimeline.tsx
lib/saasPlanner/
  types.ts
  rules.ts                                           weights and lookups
  generatePlan.ts
  toMarkdown.ts
__tests__/lib/saasPlanner.test.ts                    vitest, rules coverage
```

## 9. Files to update
- `app/tools/saas/page.tsx`: add the tool to the SaaS tools list.
- `components/SuggestedTools.tsx`: register the tool.
- `app/sitemap.ts`: add the URL.
- `public/llms.txt` and `public/llms-full.txt`: add the tool description.
- Navbar tools dropdown, if tools are listed there.

## 10. SEO
- Title: "Free SaaS Architecture Planner and Cost Estimator | UI Pirate"
- Canonical `https://uipirate.com/tools/saas/saas-architecture-planner`
- JSON-LD: `WebApplication` plus `FAQPage`
- Content below the tool: how the estimate works, assumptions and 5 to 6 FAQs.
- Follow the metadata pattern in `app/tools/design/color-palette-generator/page.tsx`.

## 11. UX and design
- Use the existing HeroUI, GlassSurface and Framer Motion components.
- Mobile-first, one question group per screen, keyboard accessible.
- Persist wizard answers in `localStorage` (wrapped in try/catch) so a refresh doesn't lose progress.
- Smooth Lenis scroll: no special handling needed, since there is no canvas.

## 12. Out of scope for v1
- Accounts or saved plans in the database
- Live AI generation
- Editable diagrams
- Multi-language support

## 13. Build order
1. `lib/saasPlanner` types, rules, `generatePlan` and tests
2. Wizard UI and state
3. Result tabs and `toMarkdown`
4. Lead capture and copy/share actions
5. `page.tsx` with SEO and registration in all listed files
6. Polish, responsive pass, vitest and a build check

## 14. Open questions
- Decided: use the real website pricing (above), not the pricing PDF.
- Decided: no PDF export. Output options are copy as Markdown, share link and email the plan.
- Decided: estimates in USD only, matching the site.
