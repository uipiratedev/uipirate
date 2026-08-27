# Target Audience Audit — Action Checklist
**Source:** `audits/02-target-audience-audit.md`
**Purpose:** Track execution of the audit's recommendations — structure and presence only
**Last updated:** 2026-08-27

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

- [x] `/privacy-policy` → 301 redirects to `/privacy` (already implemented, `permanentRedirect`)
- [x] `/terms-of-service` → 301 redirects to `/terms` (already implemented, `permanentRedirect`)
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

- [ ] Fix **SaaS & AI Development** sharing the same URL/slug as **UX/UI Design** — both still point to `/services/SaaS-Web-&-Mobile-Apps` in `config/site.ts`. Needs its own dedicated slug/page.
- [ ] Add pricing/budget range per service page
- [ ] Add service-specific testimonials (not generic quotes)
- [ ] Add "Related case study" links from service pages

## 8. Case Studies Depth

- [~] 13 case study entries exist in `data/case-studies.json` (exceeds the audit's "5+" target numerically), but per memory several are still drafts (frytx, infinity-aquasol, designing-testdynamiz, designing-brahmastra) with indexing intentionally held — verify each has full problem → process → solution → result content before treating this as done.
- [ ] Filter by industry/service type on `/case-studies` index
- [ ] Each card shows client name, industry, service used, result metric
- [ ] Dedicated case study confirmed for each major named client (Sarge, Biotex, RevUp AI, Khaitan & Co)

## 9. Apps4Sale / Mini SaaS Apps / SaaS Apps

- [ ] `/apps4sale` — still in primary nav (audit: move to footer-only or separate domain)
- [ ] `/mini-saas-apps` — intent still unclear; not merged into `/case-studies` or `/apps4sale`
- [ ] `/saas-apps` — now appears to be `/saas-apps/ai-calling`; still needs review for duplicate content vs. other app pages

## 10. Resources Hub `/resources`

- [ ] Still a standalone page (`app/resources/page.tsx`) separate from the Resources dropdown — audit asked to either build it out properly or remove it in favor of the dropdown alone. Not yet decided/actioned.

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
| Legal page duplicates (privacy/terms) | ✅ Already resolved |
| Contact page | ✅ Already exists |
| Nav simplification (Tools, ProPirates, Apps4Sale, Works) | ❌ Not started |
| SaaS & AI Development duplicate-URL bug | ❌ Not started |
| Case study depth/filtering | ⚠️ Partial (volume is there, structure/metadata not verified) |
| Apps4Sale / Mini SaaS Apps / SaaS Apps scope decisions | ❌ Not started |
| Resources hub consolidation | ❌ Not started |
| Missing content sections (homepage, about, pricing, blogs, /process, location pages) | ❌ Not started |
