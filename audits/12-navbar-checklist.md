# Navbar Audit Checklist

This document tracks the progress of all content, performance, and structural changes on the Navbar component.
Synced to **`05-navbar.md` v2 (2026-09-01)**.

**Files in scope:**
- `components/navbar.tsx`
- `components/NavbarDropdown.tsx`
- `components/ConditionalNavbar.tsx`
- `config/site.ts`

---

## How to read this

- ✅ **Done** — verified in source code
- ❌ **Not done** — confirmed still wrong in source code
- ⚠️ **Partially done** — in progress or needs further work
- 🔴 **Fix now** — errors actively damaging UX, trust, or SEO
- 🟠 **Soon** — positioning or consistency improvements
- 🟡 **Consider** — code polish and performance

---

## 1. BRAND LOGO (🔴 CLS Issue)

**File:** `components/navbar.tsx` ~L242

| # | Item | Status |
|---|------|--------|
| 1a | `alt` text is descriptive ("Enterprise UI/UX Design Agency") | ✅ Keep as-is |
| 1b | `<img>` lacks `width` and `height` — causes Cumulative Layout Shift on every page load | ✅ Done |
| 1c | Replace `<img>` with `<Image>` from `next/image` with `priority={true}` | ✅ Done |

---

## 2. CTA BUTTON (🟡 Unused Attributes)

**File:** `components/navbar.tsx` ~L314

| # | Item | Status |
|---|------|--------|
| 2a | Routes correctly to `/contact` | ✅ Keep as-is |
| 2b | `data-front="Have an Idea?"` and `data-back="Let's Talk"` attributes are present but no CSS/JS consumes them — confirm flip animation works or remove the attributes | ❌ Not done |

---

## 3. DROPDOWN CARDS — SERVICES (🔴 No Flip, No Back Content)

**File:** `components/NavbarDropdown.tsx`, `config/site.ts`

### Card Inventory

| # | Card | Image | Icon | Destination |
|---|------|-------|------|-------------|
| 1 | UX/UI Design | `ux_vyujds.svg` | `uxui_qjw76q.svg` | `/services/UX-UI-Design` |
| 2 | SaaS & AI Development | `ChatGPT_Image...uyvn6s.svg` | `code_h8gq63.svg` | `/services/SaaS-&-AI-Development` |
| 3 | Landing Pages & Business Websites | `image_239_guz7zd.svg` | `landing_jirsl5.svg` | `/services/Landing-Pages-&-Business-Websites` |
| 4 | UX Audits & Consultation | `ChatGPT_Image...p1spkb.svg` | `ux_biqghx.svg` | `/services/UX-Audits-&-Consultation` |

### Issues & Actions

| # | Item | Status |
|---|------|--------|
| 3a | Card front shows image + title only — no context | ❌ Not done |
| 3b | No 3D flip animation on hover exists for large cards | ❌ Not done |
| 3c | Implement back face for Card 1 — UX/UI Design | ❌ Not done |
| 3d | Implement back face for Card 2 — SaaS & AI Development | ❌ Not done |
| 3e | Implement back face for Card 3 — Landing Pages & Business Websites | ❌ Not done |
| 3f | Implement back face for Card 4 — UX Audits & Consultation | ❌ Not done |

### Back Face Copy (add a `description` field to each item in `config/site.ts`)

| Card | Icon | Title | Subtext |
|------|------|-------|---------|
| UX/UI Design | `uxui_qjw76q.svg` | UX/UI Design | From first sketch to Figma handoff — IA, user flows, and high-fidelity UI for SaaS and enterprise products. |
| SaaS & AI Development | `code_h8gq63.svg` | SaaS & AI Development | Design and code under one roof. React, Next.js, and Angular — no hand-off gaps, no lost design intent. |
| Landing Pages & Business Websites | `landing_jirsl5.svg` | Landing Pages | Pages built around one action. Every section placed where conversion research says it belongs. |
| UX Audits & Consultation | `ux_biqghx.svg` | UX Audits | Already have a product? We find where users drop off and give you a prioritised fix list — not just a report. |

---

## 4. DROPDOWN CARDS — RESOURCES (🔴 No Flip, Emoji Icons)

**File:** `components/NavbarDropdown.tsx`, `config/site.ts`

### Card Inventory

| # | Card | Image | Icon (current) | Destination |
|---|------|-------|------|-------------|
| 1 | Blog & Tutorials | `blog_v5hfmy.svg` | ✍️ emoji | `/blogs` |
| 2 | Case Studies | `casestudy_czsny0.svg` | 📊 emoji | `/case-studies` |
| 3 | Tools | `tools_q1fxyd.svg` | 🛠️ emoji | `/tools` |
| 4 | Component Lab | `componentlab_warfka.svg` | 🧩 emoji | `/componentlab` |

### Issues & Actions

| # | Item | Status |
|---|------|--------|
| 4a | No 3D flip animation on hover exists for large cards | ❌ Not done |
| 4b | Emoji icons — inconsistent with SVG icons used in Services dropdown | ❌ Not done |
| 4c | Implement back face for Card 1 — Blog & Tutorials | ❌ Not done |
| 4d | Implement back face for Card 2 — Case Studies | ❌ Not done |
| 4e | Implement back face for Card 3 — Tools | ❌ Not done |
| 4f | Implement back face for Card 4 — Component Lab | ❌ Not done |

### Back Face Copy

| Card | Icon | Title | Subtext |
|------|------|-------|---------|
| Blog & Tutorials | SVG pen icon (replace ✍️) | Blog & Tutorials | Practical articles on product design and SaaS UX — written by the team that ships the work, not a content agency. |
| Case Studies | SVG chart icon (replace 📊) | Case Studies | The full story of how we worked. Real briefs, real constraints, real shipped products — with before and after. |
| Tools | SVG wrench icon (replace 🛠️) | Free Tools | Calculators and generators we built for our own projects — now free for anyone who finds them useful. |
| Component Lab | SVG grid icon (replace 🧩) | Component Lab | Live, interactive React components. Copy the code, test the interactions, drop them into your project. |

---

## 5. DROPDOWN POSITIONING & STRUCTURE (🟠 Brittle)

**File:** `components/NavbarDropdown.tsx`

| # | Item | Status |
|---|------|--------|
| 5a | 150ms mouseLeave delay prevents accidental menu closure | ✅ Keep as-is |
| 5b | `createPortal` prevents overflow/stacking context issues | ✅ Keep as-is |
| 5c | Hardcoded `top-[68px]` portal offset — verify it aligns with navbar bottom on all breakpoints | ❌ Not done |
| 5d | Heavy inline gradient styles (`background: linear-gradient(...)` etc.) — move to CSS class | ❌ Not done |

---

## 6. SCROLL & ACCESSIBILITY (🟡 Performance Polish)

**File:** `components/navbar.tsx`

| # | Item | Status |
|---|------|--------|
| 6a | `aria-live` region announces menu closure to screen readers | ✅ Keep as-is |
| 6b | Escape key closes mobile menu | ✅ Keep as-is |
| 6c | iOS Safari scroll lock (`position: fixed` + saved scrollY) | ✅ Keep as-is |
| 6d | Scroll listener fires state updates without throttling — wrap in `requestAnimationFrame` | ❌ Not done |
