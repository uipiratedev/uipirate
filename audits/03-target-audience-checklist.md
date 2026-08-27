# Target Audience Audit — Action Checklist
**Source:** `audits/02-target-audience-audit.md`
**Purpose:** Track execution of the audit's recommendations — structure and presence only
**Last updated:** 2026-08-28

Legend: `[x]` done · `[~]` partially done / needs verification · `[ ]` not started

---

## 1. Service Category Cleanup (Homepage, Nav, Footer, Service Pages)

- [x] Remove **Graphic Design** from Services nav dropdown (`config/site.ts`)
- [x] Remove **Motion Graphics & Video Editing** from Services nav dropdown
- [x] Remove **3D Animation & Rendering** / "3D Assets & Animation" from Services nav dropdown
- [x] Remove all three from Footer Services column (`components/footer.tsx`)
- [x] Remove all three from homepage Bento Grid / mini-service section (`screens/landing/bentoGrid/bentoGrid.tsx`)
- [x] Remove all three from homepage Business Help / Services detail cards (`screens/landing/businessHelp/servicesSection.tsx`)
- [x] Delete the three full service detail pages/data entries (`data/sericesDetailsList.json`, `data/servicesTopList.json`) — routes now 404 naturally via `generateStaticParams`
- [x] Clean cross-link "What Most Clients Require Next" references to the removed services in remaining service entries
- [x] Remove from SEO/structured data: `app/layout.tsx` JSON-LD offers + noscript list, `app/services/[id]/opengraph-image.tsx`, `app/services/[id]/page.tsx` SEO meta, `app/sitemap.ts`, `app/sitemap/page.tsx`, `screens/sitemap/index.tsx`, `components/Breadcrumbs.tsx`
- [x] Remove from FAQs (`data/faqs.json`), lead forms (`LeadCaptureForm.tsx`, `ProjectEstimate.tsx`), blog/FAQ category filters, terms & conditions services list
- [x] Remove from crawler-facing files: `public/ai-data.json`, `public/llms.txt`, `public/llms-full.txt`, `public/.well-known/ai-plugin.json`
- **Result:** Services dropdown is now 4 items (UX/UI Design, SaaS & AI Development, Landing Pages & Business Websites, UX Audits & Consultation) — matches the audit's target state exactly.

## 2. Community Insights `/community`

- [x] Remove "Community Insights" from Resources nav dropdown
- [x] Remove from Footer Resources column
- [x] Remove from HTML sitemap (`screens/sitemap/index.tsx`) and sitemap JSON-LD (`app/sitemap/page.tsx`)
- [x] Delete the stub page and screen (`app/community/`, `screens/community/`)
- [x] Remove dead breadcrumb label for the `community` segment
- **Note:** audit suggested "remove from nav, deprioritize page" — we went further and deleted the page outright per follow-up instruction.

## 3. `/ourWorks` Duplicate Page

- [x] Remove `/ourWorks` from all navigation/sitemap/doc references
- [x] Delete the route entirely
- **Note:** audit recommended a 301 redirect to `/case-studies`; a redirect was implemented first, then removed per explicit follow-up instruction ("no redirect nothing"). Current state: `/ourWorks` 404s. The reusable hero UI was preserved and moved to `screens/caseStudies/hero/index.tsx` (renamed `CaseStudiesHero`) since it's still used on the live `/case-studies` page.

## 4. Duplicate Legal Pages

- [x] `/privacy-policy` and `/terms-of-service` deleted entirely — per explicit instruction ("i dont need redirect"), not redirected. Fixed the one live link that still pointed to `/privacy-policy` (`components/CookieConsent.tsx` → now `/privacy`) and removed dead breadcrumb/README references.
- [x] Sitemap (`app/sitemap.ts`) only lists the canonical `/privacy` and `/terms`

## 5. Navigation Simplification

- [x] Services dropdown trimmed to 4 items
- [x] Community removed from Resources dropdown
- [x] Move **Tools** out of top-level navbar — removed as a standalone item; "Free Tools" remains in Resources dropdown only
- [x] Remove **ProPirates** from primary nav — moved to Footer Quick Links instead of dropped entirely
- [x] Remove **Apps4Sale** from primary nav — already existed in Footer Resources column, now footer-only
- [x] Add **Works** (`/case-studies`) as a top-level desktop nav item in `config/site.ts` `navItems` (mobile menu already had it via `navMenuItems`)

Target navbar per audit: `Services ▾ | Works | Pricing | About | Resources ▾ | [Let's Talk]` — **reached.** `config/site.ts` `navItems` now matches exactly; the unused legacy `navMenuItems` array (not referenced by `navbar.tsx`) still lists ProPirates but has no effect on the rendered UI.

## 6. Contact Page

- [x] Real `/contact` page exists (`app/contact/page.tsx`, `ContactPageClient.tsx`, `app/contact/success/page.tsx`) — audit's "no real contact page" finding is now outdated/resolved.

## 7. Service Page Fixes

- [x] Fix **SaaS & AI Development** sharing the same URL/slug as **UX/UI Design** — added a new dedicated entry (`data/sericesDetailsList.json` slug `SaaS-&-AI-Development`) with its own hero, process, and content focused on full-stack/AI engineering (distinct from the UX/UI Design entry's design-focused content). Updated all references: nav (`config/site.ts`), footer, HTML sitemap screen, XML sitemap (`app/sitemap.ts`), sitemap JSON-LD (`app/sitemap/page.tsx`), SEO meta (`app/services/[id]/page.tsx`), OG image map (`opengraph-image.tsx`), and breadcrumbs.
- [x] Renamed the old `SaaS-Web-&-Mobile-Apps` slug to `UX-UI-Design` to match what that page actually is now that SaaS & AI Development is split out. Updated every reference (nav, footer, both sitemaps, breadcrumbs, SEO meta, OG image, `case-studies.json` `relatedServices`, `llms.txt`). No redirect from the old URL — per explicit instruction, it now 404s.
- [ ] Add pricing/budget range per service page
- [ ] Add service-specific testimonials (not generic quotes)
- [ ] Add "Related case study" links from service pages

## 8. Case Studies Depth

- [~] 13 case study entries exist in `data/case-studies.json` (exceeds the audit's "5+" target numerically), but per memory several are still drafts (frytx, infinity-aquasol, designing-testdynamiz, designing-brahmastra) with indexing intentionally held — verify each has full problem → process → solution → result content before treating this as done.
- [ ] Filter by industry/service type on `/case-studies` index
- [ ] Each card shows client name, industry, service used, result metric
- [ ] Dedicated case study confirmed for each major named client (Sarge, Biotex, RevUp AI, Khaitan & Co)

## 9. Apps4Sale / Mini SaaS Apps / SaaS Apps

- [x] `/apps4sale` — already footer-only (removed from primary nav during nav simplification, section 5). Real marketplace with 3 actual product listings (AI Voice Support System, Smart Onboarding Engine, PirateCOS) in `data/apps4sale.json` — no further action needed.
- [x] `/mini-saas-apps` — was a zero-content "Coming Soon" stub (identical template to the old Community Insights placeholder). Deleted the page/screen and its footer, breadcrumb, and HTML-sitemap references — same treatment as Community Insights.
- [x] `/saas-apps/ai-calling` — deleted entirely per explicit instruction (route, screen, and its breadcrumb segment labels). No `/saas-apps` hub ever existed, and nothing else in the codebase linked to it, so removal was clean — no dangling references.

## 10. Resources Hub `/resources`

- [x] Removed the standalone `/resources` stub entirely (`app/resources/page.tsx`, which only did `redirect("/blogs")`). Nothing in the site links to it — the navbar's Resources dropdown (`config/site.ts`) already points straight at `/blogs`, `/case-studies`, `/faqs`, `/tools` — and it wasn't in `app/sitemap.ts`. Deleted outright with no redirect, consistent with this project's no-redirect policy for deprecated pages, rather than keeping the old permanent-redirect stub.

## 12. Dead Code Cleanup (post-removal sweep)

- [x] Verified with a full production build (`npm run build`) — route manifest directly confirms none of the removed routes exist and the 5 correct service pages generate. Repo-wide grep sweep for every removed term found only accepted exceptions (a real employee's "Graphic Designer" job title in `app/about/page.tsx` and `screens/landing/theTeam/index.tsx`).
- [x] Removed 12 fully unused SVG components from `components/visuals/index.tsx` (`VisualAssets`, `VisualAnimations`, `VisualModeling`, `VisualIntegration`, `VisualUI`, `VisualLottie`, `VisualWeb`, `VisualDev`, `VisualBrand`, `VisualWebsiteProduct`, `VisualInfo`, `VisualMulti`) — leftover "What You Get" card visuals from the three deleted service categories, never referenced by the current `VISUAL_MAPPING` in `whatYouGetAnimations/index.tsx`. File shrank from 1981 to 968 lines.
- [x] Fixed the stale `{/* Left: Motion Graphic feature card */}` comment in `screens/serviceDetails/recommendedNextSteps/index.tsx` → `{/* Left: Featured service card */}` (component is fully data-driven, not hardcoded).
- [x] Confirmed clean with both `tsc --noEmit` and a full `next build` after the dead-code removal.

## 13. Remove Hardcoded Case Studies (no hardcoded case studies/blogs/articles at all)

- [x] Archived all 13 hardcoded case studies from `data/case-studies.json` to `data/case-studies-archive.md` (full content preserved as source material if any need re-authoring in the CMS) before deleting the JSON.
- [x] Deleted `data/case-studies.json`.
- [x] `screens/caseStudies/index.tsx` — removed the `staticCaseStudies` import/merge; the case studies listing is now sourced 100% from the CMS (`cmsCaseStudies` via `listPosts({ postType: "case-study" })`).
- [x] `app/case-studies/[slug]/page.tsx` — rewritten to be CMS-only: removed the JSON import, `getStudy()`, the hardcoded metadata branch, and the entire hardcoded problem/approach/solution/results/metrics/testimonial render branch. `generateStaticParams` now calls `listPostSlugs({ postType: "case-study" })` against the live CMS instead of mapping static JSON slugs.
- [x] `lib/pirateCOS/public-client.ts` — added an optional `postType` filter to `listPostSlugs()` so the case-studies route only statically generates actual case-study posts (backward-compatible; `/[slug]`'s existing unfiltered call is unaffected).
- [x] `app/sitemap.ts` — removed the `case-studies.json` import and the static `caseStudyEntries` block; case study URLs in the sitemap now come exclusively from the existing CMS-driven `cmsCaseStudyEntries`.
- [x] Verified with a full `next build`: `/case-studies/[slug]` now statically generates 11 real case studies pulled live from the CMS (previously these weren't pre-generated at all — the old code only statically built the 13 hardcoded JSON slugs and left CMS case studies to render on-demand).
- **Confirmed:** blogs/articles were already 100% CMS-driven (`app/blogs`, `app/[slug]` via `lib/pirateCOS/public-client.ts`) — no hardcoded `data/blog*.json` or similar exists. Case studies were the only remaining hardcoded content source; nothing hardcoded remains for case studies, blogs, or articles anywhere in the codebase.

## 11. Other Missing Items (Not Started)

- [ ] Homepage: target-audience callout near hero
- [ ] Homepage: featured case study with a result metric (not just gallery)
- [ ] Homepage: "Process in 3 steps" timeline strip
- [ ] Homepage: Clutch/G2/Upwork rating badge near CTA
- [ ] About: founder story / origin paragraph
- [ ] About: Clutch profile link or embedded rating widget
- [ ] About: "Who we work best with" callout
- [ ] About: trim industries list from 8 to 4–5 core industries
- [ ] About: fix stat inconsistency ("40+ businesses" vs "50+ products")
- [ ] Pricing: direct Calendly/Stripe booking link on page
- [ ] Pricing: testimonial from a retainer-model client
- [ ] Pricing: "what's included" deliverables checklist per tier
- [ ] Blogs: author bio with credibility signals
- [ ] Blogs: category filter (Design, Development, SaaS, AI)
- [ ] `/process` page
- [ ] Location-based SEO pages (e.g. `/product-design-agency-new-york`)

---

## Summary

| Area | Status |
|---|---|
| Graphic Design / Motion Graphics / 3D Animation removal | ✅ Done |
| Community Insights removal | ✅ Done |
| `/ourWorks` removal | ✅ Done (deleted, not redirected — per updated instruction) |
| Legal page duplicates (privacy/terms) | ✅ Done (deleted, not redirected — per updated instruction) |
| Contact page | ✅ Already exists |
| Nav simplification (Tools, ProPirates, Apps4Sale, Works) | ✅ Done |
| SaaS & AI Development duplicate-URL bug | ✅ Done (own slug + renamed old slug to `UX-UI-Design`) |
| Case study depth/filtering | ⚠️ Partial (volume is there, structure/metadata not verified) |
| Apps4Sale / Mini SaaS Apps / SaaS Apps scope decisions | ✅ Done (Apps4Sale kept footer-only; Mini SaaS Apps + AI Calling deleted as stubs/orphans) |
| Resources hub consolidation | ✅ Done (deleted the unlinked `/resources` redirect stub; dropdown alone covers it) |
| Dead code sweep (post-removal) | ✅ Done (12 unused SVG components + 1 stale comment removed, verified via full build) |
| Missing content sections (homepage, about, pricing, blogs, /process, location pages) | ❌ Not started |
