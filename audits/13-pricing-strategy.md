# Pricing Strategy — Homepage Pricing Section (Discussion + Recommendation, v2)
**Scope:** `screens/landing/pricingFlip/index.tsx` (homepage book-flip pricing card)
**Status:** Strategy document only — no code changed yet. All dollar amounts marked **TBD** are placeholders that make internal sense with current published pricing; the user will confirm real numbers before implementation.
**Last updated:** 2026-09-11 (v2 — incorporates user decisions on all four open questions from v1)

---

## 1. Decisions locked in this round

| Open question (v1) | Decision |
|---|---|
| Does Fixed Scope need sub-types? | **Yes.** It becomes a guided decision-tree/stepper — "What do you want to make?" — not a single generic card. Full flow in §3. |
| What's the dev-toggle delta on the Retainer? | $499 is a deliberately cheap, design-only, limited-scope hook price. Adding development brings it to **≥$1,000/mo** (exact number TBD, but must not read as a small add-on — it's roughly a 2×+ jump). Full retainer scope limits in §2. |
| Flip mechanics for 3 tabs? | **No redesign of the interaction** — it already works as "flip to reveal, tab to switch." What needs to change is the **visual design** of the card itself: the left face should read as a physical/credit-card object (per the Kree8 reference), not a plain content block. Full direction in §4. |
| Reconcile homepage vs. `/pricing` numbers? | **Out of scope.** Homepage numbers ($499 retainer / $2,000 custom) are treated as correct as-is. Do not touch `/pricing` page numbers in this pass. |

---

## 2. Tab 1 — Monthly Retainer

### The core pricing logic
$499 is a **hook price**, not a full offering — it exists to get a prospect into a conversation, not to fund unlimited work. It must visibly be a *starter* tier so the upsell path (adding dev, adding pages, adding animation) feels natural rather than like nickel-and-diming.

**Base retainer ($499/mo TBD) includes, explicitly:**
- Design only — no front-end/back-end code delivery
- A capped number of pages/screens per month (placeholder: **up to 3 pages or screens**, TBD)
- Standard UI components and layouts — no custom illustration or motion work
- No custom animation — motion is an add-on, not baseline
- Standard turnaround (placeholder: **3–5 business day** requests, TBD)
- Async communication (matches existing "Mon–Fri, <2hr response" language already used on `/pricing`)

**Add-on toggles/steppers on the card itself** (this is the "fiddle with switches and get your price live" requirement):

| Toggle | Effect | Placeholder value |
|---|---|---|
| **Add development** | Unlocks front-end (and optionally back-end) implementation of what's designed — not just Figma files | **+$500/mo minimum**, bringing the floor to **≥$1,000/mo** (TBD — must feel like a real second tier, not a checkbox) |
| **Extra pages/screens** | Stepper, +1 page at a time, beyond the base cap | **+$100–150/page/mo** (TBD) |
| **Add animation** | Unlocks custom micro-interactions/motion work | **+$150–250/mo** flat, or per-animation (TBD — decide once dev-toggle pricing is final, since animation work compounds with dev) |

The price shown on the card's left face recalculates live as these are toggled — this must happen client-side with no page reload, mirroring the "fiddle and get exact pricing" requirement. The user does not need to contact sales to see the number for any combination of these toggles.

### Copy direction (draft — replace once real numbers are set)

**Left face (card):**
- Plan name: "Monthly Retainer"
- Eyebrow: "Starting from"
- Price: "$499/mo" → updates live as toggles are set
- Small print under price: "Design only, up to 3 pages/mo" → updates to reflect active toggles, e.g. "Design + Development, up to 5 pages/mo, with animation"

**Right face ("What's included"):**
- Base bullets: "Unlimited design requests within scope", "Up to 3 pages/screens per month", "Standard UI components, no custom motion", "Async, Mon–Fri, <2hr response"
- Toggle section, inline, each with its own switch/stepper and live price delta shown next to it:
  - "Add development — turn designs into shipped code (+$500/mo)"
  - "Extra pages — beyond your monthly cap (+$100/page)"
  - "Add animation — custom micro-interactions (+$150/mo)"
- CTA: "Get Started →" (unchanged, links to cal.com per existing pattern)

---

## 3. Tab 2 — Fixed Scope (new: guided decision tree)

This is the most structurally new part of the plan. Instead of one generic "Fixed Scope" card, the tab opens into a **short branching stepper** that narrows down what the buyer wants before showing a price — this keeps the self-serve promise (no "contact us" wall) while still being specific enough that the number feels earned, not arbitrary.

### Step 1 — "What do you want to make?"
Top-level choice, presented as large tappable option cards (not a dropdown):
1. **SaaS / Web App**
2. **Mobile App**
3. **Dashboard / Admin Panel**
4. **Website** → branches to Step 2
5. Positioning these against About/Services content: these four map directly onto UI Pirate's real service lines (SaaS & AI Development, UX/UI Design, Landing Pages & Business Websites), so the tree never promises something outside actual capability.

### Step 2 — only if "Website" is chosen: "What kind of website?"
1. **Landing Page**
2. **Business Website**
3. **Portfolio**
4. **Personal Site**

### Step 3 — result card + customization
Once a leaf is selected (SaaS/Web App, Mobile App, Dashboard/Admin Panel, or one of the four website types), the card resolves to a base price + relevant add-on toggles for *that* category. Not every category needs the same toggles — this is deliberate, matching how Kree8 varies its add-ons by service type rather than using one universal set:

| Category | Base price (TBD) | Relevant toggles |
|---|---|---|
| Landing Page | **from $1,500** (matches existing FAQ figure) | Add development (+TBD), extra pages (+$/page TBD), animations (+$/animation TBD) |
| Business Website | **from $2,500** (TBD) | Add development, extra pages, animations, CMS integration (TBD) |
| Portfolio | **from $1,200** (TBD) | Extra pages, animations |
| Personal Site | **from $800** (TBD) | Extra pages |
| SaaS / Web App | **from $5,000** (matches existing FAQ figure) | Add development (may be bundled by default here, since SaaS rarely ships design-only), number of core flows/screens, AI/LLM integration add-on |
| Mobile App | **from $5,000** (TBD, align with SaaS tier since build complexity is comparable) | Platform count (iOS / Android / both), add development |
| Dashboard / Admin Panel | **from $3,500** (TBD) | Add development, number of data views/modules |

All dollar values above are placeholders sized to stay consistent with numbers already published on `/pricing` (landing page $1,500, SaaS $5,000) — final numbers to be confirmed by the user before build.

### Interaction requirements
- The stepper must be a real multi-step UI component (state machine: category → sub-category if applicable → result), not a static form.
- Back/change-selection must be trivial (a "change" link or breadcrumb at the top of the result card), since buyers will want to compare categories.
- Once resolved to a leaf category, that category's card behaves like the Retainer card: toggles update price live, no page reload, no "contact us" required to see a number.
- If a buyer's need doesn't fit any leaf cleanly, the result card should still end with a lightweight "Not seeing your project? Book a call" fallback — this is the release valve that keeps the tree from ever feeling like a dead end.

### Copy direction (draft)
- Tab label: "Fixed Scope"
- Intro line above Step 1: "Tell us what you're building — we'll show you a price."
- Step 1 prompt: "What do you want to make?"
- Step 2 prompt (Website branch): "What kind of website?"
- Result card left face: "[Category name]" / "Starting from" / live price
- Result card right face: "What's included" bullets specific to that category + toggle switches with inline price deltas, same pattern as the Retainer
- CTA: "Get Started →" if price is fully resolved via toggles, or "Book a Discovery Call →" if they hit the fallback

---

## 4. Tab 3 — Custom (unchanged in substance)

Kept as-is conceptually: undefined-scope engagements (multi-phase builds, ongoing SaaS partnerships beyond a single fixed deliverable, enterprise engagements). No price math on this tab — capability bullets + "Book a Discovery Call →" CTA only. Starting figure stays **$2,000**, per the homepage-numbers-are-correct decision in §1.

No new copy needed here beyond what already exists, unless the team wants the "What's included" bullets to explicitly cross-reference the About page's industry list (SaaS & Enterprise, FinTech, HealthTech, LegalTech, AI Products) to reinforce why this tier is undefined-scope by nature.

---

## 5. Visual direction — the card itself

Current implementation (`screens/landing/pricingFlip/index.tsx`) already has the right flip *mechanic* (front/back leaf, `rotateY` spring flip, one tab = one flip target) — that stays. What changes is the **visual treatment of the left face**, per the Kree8 reference screenshot the user provided.

### Reference breakdown (Kree8's left card face)

- **Tab switcher above the card**: pill-shaped container, two segments ("Monthly $X" / "Custom Starts from $X"), active segment on a white rounded-rect pulled slightly forward with a soft shadow, inactive segment flat on the grey pill background. This matches what the homepage tab switcher already does — no change needed there, just confirming the pattern.
- **Card silhouette reads as a ticket/subscription-card stub**, not a plain rounded rectangle: the top-left and bottom-right corners are **diagonally die-cut** (cut at ~45°, like a torn ticket corner), while the other two corners stay square/rounded. This diagonal-cut detail is the single biggest contributor to the "membership card" feeling and should be replicated.
- **Background texture**: a large, low-contrast wordmark/logomark watermark bleeds diagonally across the card in a slightly darker grey than the card's base fill — decorative only, never competing with the price for attention.
- **Plan name**: large, bold, two-line label top-left of the card (e.g. "Monthly Subs") in near-black, sitting on the textured card surface.
- **Price block**, bottom-left of the card: a colored (brand-orange, matching UI Pirate's existing accent rather than Kree8's red) `$` glyph immediately before a large bold number, with "Per month" / "Billed monthly" (or the UI Pirate equivalent, e.g. "Starting from" / billing cadence) as two lines of small grey caption text directly beneath.
- **A vertical "stub" indicator**, bottom-right of the card: a short stack of horizontal grey bars suggesting a barcode/ticket-perforation detail, reinforcing the physical-card metaphor. Small, decorative, not interactive.
- **A thin vertical divider** separates the card (left face) from the content column (right face) — both sit inside one shared outer rounded container with a single soft drop shadow, so the two halves read as one object (a card lying open next to its details), not two separate boxes.

### Right face (content column) — reference breakdown
- **"What's Included" pill badge** at the top: small, outlined, rounded-full, black text/border on white — a section label, not a button.
- **Checklist below it**: each row = a filled/outlined circular checkmark icon + label text, rows separated by a thin dashed horizontal rule (not solid), generous vertical spacing per row. This is the pattern to reuse for the Retainer's toggle rows and the Fixed Scope's included-features rows.
- **CTA button** pinned at the bottom of the content column: full-width, solid black/dark-fill, white bold label + trailing arrow icon, large corner radius. Matches UI Pirate's existing CTA language ("Get Started →" / "Book a Discovery Call →") — just needs this visual weight (full-width, dark-fill, bottom-anchored) rather than however it currently sits.

### How this applies across our 3 tabs
- The die-cut card + watermark + price-block treatment applies to **all three tabs' left faces** (Retainer, Fixed Scope, Custom) for visual consistency — only the plan name, price, and caption text change per tab.
- On the **Retainer** and **Fixed Scope** right faces, the toggle/stepper rows (add development, extra pages, add animation, or the category picker) should adopt the same dashed-divider checklist rhythm shown here, with the interactive control (switch/stepper) replacing or sitting alongside the static checkmark for rows that are toggleable rather than fixed-included.
- On the **Custom** right face, since there's no price math, the checklist stays static (matches the reference exactly) with a single "Book a Discovery Call →" CTA.
- Because the right face now needs to hold more (steppers, live-updating line items, possibly the Fixed Scope category picker), **the overall card's width/height should grow to accommodate this** rather than cramming it into the current footprint. Exact sizing is an implementation-time decision once the toggle/stepper components are designed.
- Mobile behavior (currently a cross-fade stack under `md` breakpoint instead of the 3D flip) should carry the same die-cut-card / content-column split, just stacked vertically instead of side-by-side.

Color treatment should use UI Pirate's existing brand palette (brand-orange accent, near-black text, light-grey card fill) rather than copying Kree8's red — the *structure and materiality* of the reference is what's being adopted, not its color scheme.

---

## 6. What's still open

1. **All dollar amounts** in §2 and §3 marked TBD — user will confirm final numbers before implementation begins. Nothing here should be treated as final pricing.
2. **Exact page/screen caps and turnaround times** on the base Retainer (currently placeholder "3 pages, 3–5 day turnaround") — needs confirmation.
3. ~~Visual spec for the card redesign~~ — resolved in §5 using the Kree8 reference screenshot (die-cut card corners, watermark texture, price block, dashed-divider checklist, full-width dark CTA). Colors to use UI Pirate's own brand palette, not Kree8's.
4. **Component/state-machine design** for the Fixed Scope stepper — once content here is approved, this becomes a proper implementation plan (component structure, state shape for category → sub-category → toggles → price) rather than prose.
5. **Whether "Add development" is bundled by default for SaaS/Web App and Dashboard categories** in Fixed Scope (flagged in §3 table) — since those rarely ship as design-only, worth confirming whether it should be a default-on toggle instead of opt-in.

---

## 7. Sources carried over from v1 (still the basis for the 3-tab / productized-add-on structure)

- [ManyPixels — Design Agency Pricing: Rates, Models & What to Budget (2026)](https://www.manypixels.co/blog/get-a-designer/design-agency-pricing)
- [ManyRequests — Agency Pricing Models: Which One Scales a Productized Agency (2026)](https://manyrequests.com/blog/agency-pricing-models)
- [ManyRequests — 13 Productized Agency Examples with Pricing and Mechanics (2026)](https://www.manyrequests.com/blog/productized-agency-examples)
- [usequeue.com — How to Price Your Productized Services](https://www.usequeue.com/blogs/how-to-price-your-productized-services)
- [GetMonetizely — The Anchoring Effect in SaaS Pricing](https://www.getmonetizely.com/articles/the-anchoring-effect-in-saas-pricing-using-high-prices-to-drive-sales)
- [Atticus Li — How To Use Price Anchoring On SaaS Pricing Pages Without Tricking Buyers](https://atticusli.com/blog/posts/how-to-use-price-anchoring-on-saas-pricing-pages-without-tricking-buyers/)
- [Digital Applied — Pricing Page Psychology 2026: A SaaS Decision Framework](https://www.digitalapplied.com/blog/subscription-pricing-page-psychology-decision-framework-2026)
- kree8.studio (direct product inspection — card visual reference pending user screenshot)

---

## 8. Not decided yet

This remains a strategy/content document, not an implementation plan. Before code changes: (a) user confirms real dollar amounts throughout, (b) this document gets translated into a component-level implementation plan for `screens/landing/pricingFlip/index.tsx` covering the new stepper state machine, toggle components, and card redesign.
