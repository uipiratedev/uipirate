# Assets & Images Audit — UIpirate Website

**Audit Date:** September 1, 2026  
**Scope:** All static assets in `/public`, all remote Cloudinary assets referenced in code, audio, video, and icons — scanned across every page and section.

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total local static assets** | 73 files |
| **Local asset total size** | ~58 MB |
| **Single heaviest file** | `bannervideo.mp4` — 18 MB |
| **Largest SVG files** | `servicesBanner.svg` (4.9 MB), `is_ethical_design.svg` (3.7 MB), `Glow=OFF.svg` / `Glow=ON.svg` (~2.4 MB each), `loop.svg` (2.3 MB), `bento1.svg` (1.4 MB), `blog-banner-default.svg` (1.5 MB) |
| **PNG files that need WebP conversion** | 12 PNGs |
| **Unused / orphaned assets** | 4 files (`/assets/right fit/*` PNGs — no code reference found) |
| **Estimated size after full optimization** | ~8 MB (~86% reduction) |
| **Cloudinary remote assets** | 30+ unique URLs (most are SVG; 2 are PNG) |

> **CAUTION:** The total local asset payload is enormous (~58 MB). The `bannervideo.mp4` alone is 18 MB and auto-plays in the hero — this is the single biggest page weight culprit.

---

## 2. Full Asset Inventory — By Page & Section

### 2.1 Landing Page (`/`)

#### Hero Section (`screens/landing/hero/index.tsx`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `rohit_vo3c4g.svg` | Reviewer avatar | Cloudinary | ~5–15 KB | SVG avatar — acceptable | Keep SVG (small icon) |
| `eden-modified_jsf37k.png` | Reviewer avatar | Cloudinary | ~30–80 KB | **PNG on Cloudinary** | Convert via Cloudinary URL: add `/f_webp,q_auto/` |
| `nipun_tqwxmz.svg` | Reviewer avatar | Cloudinary | ~5–15 KB | SVG avatar — acceptable | Keep SVG |
| `tabler-icon-star-filled_oymrgq.svg` | Star rating icon | Cloudinary | ~1–3 KB | Used **12× independently** in Hero + all Service pages | Replace with inline SVG or a single reusable React `<StarIcon>` component — eliminates 12+ HTTP requests per page |
| `up_a4rhmj.svg` | Arrow/up icon | Cloudinary | ~1–3 KB | Remote icon that could be inline | Use inline SVG or local icon component |
| `/assets/free.svg` | "Free" badge | Local | **6 KB** | Tiny — fine | OK as-is |
| `bannervideo.mp4` | Background video (hero) | Local `/public/` | **18 MB** | Enormous; auto-plays in hero | **CRITICAL: Compress to H.265/HEVC + serve WebM version. Target ≤ 3 MB. Add `<source type="video/webm">` + `<source type="video/mp4">`. Use `preload="metadata"`.** |

---

#### App Screen / Mockup Section (`screens/landing/appScreen/index.tsx`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `Frame_1984078758_tkh9ag.svg` | App mockup frame | Cloudinary | ~200–600 KB | Large complex SVG mockup | Use Cloudinary URL: `/f_webp,q_auto,w_800/` |
| `middleImage_ggzymj.svg` | App mockup center | Cloudinary | ~200–600 KB | Large complex SVG mockup | Convert to WebP on Cloudinary |
| `Ai_APp_mockup_y0mt4j.svg` | AI app mockup | Cloudinary | ~200–600 KB | Large complex SVG | Convert to WebP on Cloudinary |

---

#### Marquee / Client Logos Section (`screens/landing/marquee/index.tsx`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `image_1_hxpv8e.svg` | Client logo | Cloudinary | ~10–50 KB | SVG logo | Keep SVG |
| `logo_qpyrhf.webp` | Client logo | Cloudinary | ~10–30 KB | **Already WebP** | Perfect — no action needed |
| `logo_r097ja.png` | Client logo | Cloudinary | ~30–80 KB | **PNG** | Add `/f_webp,q_auto/` to Cloudinary URL |
| `Frame_1984078729_meav44.svg` | Client logo | Cloudinary | ~10–50 KB | SVG | Keep SVG |
| `Group-2_uduxpp.svg` | Client logo | Cloudinary | ~10–50 KB | SVG | Keep SVG |
| `728_x_90_copy_6x_uft7ai.svg` | Client logo | Cloudinary | ~10–50 KB | SVG | Keep SVG |
| `sarge_hewzwz.svg` | Client logo | Cloudinary | ~10–50 KB | SVG | Keep SVG |
| `healt_nvmdpw.svg` | Client logo | Cloudinary | ~10–50 KB | SVG | Keep SVG |
| `Rings_I_eyrgog.svg` | Client logo | Cloudinary | ~10–50 KB | SVG | Keep SVG |

---

#### Works / Portfolio Section (`screens/landing/works/workCard.tsx`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `xperiti_psd_file_1_cvfkqh.svg` | Portfolio screenshot | Cloudinary | ~300–800 KB | Complex SVG screenshot | Use Cloudinary `/f_webp,q_auto,w_800/` |
| `brahma_zbxs7g.svg` | Portfolio screenshot | Cloudinary | ~300–800 KB | Complex SVG screenshot | Use Cloudinary `/f_webp,q_auto,w_800/` |
| `Image_hzwg0d.svg` | Portfolio screenshot | Cloudinary | ~300–800 KB | Complex SVG screenshot | Use Cloudinary `/f_webp,q_auto,w_800/` |

---

#### Behance Gallery Section (`screens/landing/behance/LandingBehance.tsx`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `xperiti_ptjxaa.svg` | Portfolio image | Cloudinary | ~300–800 KB | Complex SVG | Convert via Cloudinary `/f_webp,q_auto/` |
| `frytx_mo0frx.svg` | Portfolio image | Cloudinary | ~300–800 KB | Complex SVG | Convert via Cloudinary |
| `brahma_zbxs7g.svg` | Portfolio image | Cloudinary | ~300–800 KB | Complex SVG | Convert via Cloudinary |
| `olso_rgvl9a.svg` | Portfolio image | Cloudinary | ~300–800 KB | Complex SVG | Convert via Cloudinary |
| `rings_gnmm1x.svg` | Portfolio image | Cloudinary | ~300–800 KB | Complex SVG | Convert via Cloudinary |
| `ion_hhwrup.svg` | Portfolio image | Cloudinary | ~300–800 KB | Complex SVG | Convert via Cloudinary |

---

#### Why Choose Us Section (`screens/landing/whyChoosUs/index.tsx`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `Dashboard_V2_1_fct6cl.svg` | Dashboard mockup | Cloudinary | ~500 KB–2 MB | **Used 5× with the exact same URL** | Apply Cloudinary `/f_webp,q_auto/` — significant saving |
| `dashboard_pgl0ez.gif` | Animated GIF | Cloudinary | ~1–3 MB | **GIF animation** | Convert to animated WebP or `<video>` with WebM via Cloudinary `/f_webp/` or `/f_mp4/` |
| `8330154b778d772b…_esonfn.gif` | Animated GIF | Cloudinary | ~1–3 MB | **GIF animation** | Convert to animated WebP/WebM |
| `a8881425d16e3562…_n0dvqj.gif` | Animated GIF | Cloudinary | ~1–3 MB | **GIF animation** | Convert to animated WebP/WebM |
| `0287988b27a45e56…_cmxya1.gif` | Animated GIF | Cloudinary | ~1–3 MB | **GIF animation** | Convert to animated WebP/WebM |
| `88d4d7ae4f6a15a6…_zs7x5t.gif` | Animated GIF | Cloudinary | ~1–3 MB | **GIF animation** | Convert to animated WebP/WebM |

> **WARNING:** The 5 GIF animations in the "Why Choose Us" section are served from Cloudinary but still delivered as `.gif`. GIF is the worst format for animations on the web. Convert via Cloudinary URL transformation: replace `/upload/` with `/upload/f_webp/` for animated WebP, or `/upload/f_mp4/` to serve as video. Estimated 70–80% size reduction per asset.

---

#### Featured Case Study (`screens/landing/featuredCaseStudy`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `xperiti_psd_file_1_cvfkqh.svg` | Hero image (fallback) | Cloudinary | ~300–800 KB | Complex SVG screenshot | Convert via Cloudinary `/f_webp,q_auto/` |
| `xperiti_shp94q.svg` | Client logo | Cloudinary | ~10–50 KB | SVG logo | Keep SVG |

---

#### Services Section (`screens/landing/businessHelp/servicesSection.tsx`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `/assets/servicesBanner.svg` | Services banner illustration | Local | **4.9 MB** | Massive SVG — complex artwork embedded as SVG | **Convert to WebP. Estimated: ~300–500 KB after conversion. Critical fix.** |

---

#### FAQs Section (`screens/landing/faqs/accordion.tsx`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `plus_dia0bt.svg` | Accordion toggle icon | Cloudinary | ~1–3 KB | Used **2× per accordion item** — unnecessary HTTP requests for a simple icon | Inline as SVG in JSX — eliminates HTTP requests |

---

#### Bento Grid Section (`screens/landing/bentoGrid/bentoGrid.tsx`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `/assets/img/bento1.svg` | Bento card illustration | Local | **1.4 MB** | Very large SVG illustration | Convert to WebP. Estimated: ~80–150 KB |
| `/assets/logos/react.svg` | Tech logo | Local | 7 KB | Small SVG logo | Keep SVG |
| `/assets/logos/next js.svg` | Tech logo | Local | 7 KB | Small SVG logo | Keep SVG |
| `/assets/logos/typescript.svg` | Tech logo | Local | 7 KB | Small SVG logo | Keep SVG |
| `/assets/logos/tailwind.svg` | Tech logo | Local | 6.5 KB | Small SVG logo | Keep SVG |
| `/assets/logos/figma.svg` | Tech logo | Local | 6 KB | Small SVG logo | Keep SVG |
| `/assets/logos/framer.svg` | Tech logo | Local | 5.7 KB | Small SVG logo | Keep SVG |
| `/assets/logos/gsap.svg` | Tech logo | Local | 11 KB | Small SVG logo | Keep SVG |
| `/assets/logos/vercel.svg` | Tech logo | Local | 5.7 KB | Small SVG logo | Keep SVG |
| `/assets/logos/angular.svg` | Tech logo | Local | 6.6 KB | Small SVG logo | Keep SVG |
| `/assets/logos/threejs.svg` | Tech logo | Local | 6.3 KB | Small SVG logo | Keep SVG |
| `/assets/logos/github.svg` | Tech logo | Local | 6.4 KB | Small SVG logo | Keep SVG |
| `/assets/logos/photoshop.svg` | Tech logo | Local | 8.7 KB | Small SVG logo | Keep SVG |
| `/assets/logos/illustrator.svg` | Tech logo | Local | 7.2 KB | Small SVG logo | Keep SVG |
| `/assets/logos/notion.svg` | Tech logo | Local | 6.9 KB | Small SVG logo | Keep SVG |

---

#### About Mini-Cards (`screens/landing/about/aboutCard.tsx`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `/assets/img/cal.svg` | Calendar icon | Local | 8 KB | Small icon | Keep SVG |
| `/assets/img/box.svg` | Box icon | Local | 5.4 KB | Small icon | Keep SVG |
| `/assets/img/badge.svg` | Badge icon | Local | 4.3 KB | Small icon | Keep SVG |
| `/assets/img/location.svg` | Location icon | Local | 3.6 KB | Small icon | Keep SVG |

---

#### GIF Animations in Pricing Preview (`screens/landing/pricing/index.tsx`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `/assets/gif/kite.gif` | Kite animation | Local | **136 KB** | GIF format | Convert to animated WebP (est. ~30–50 KB) or `<video>` with WebM |
| `/assets/gif/headquater.gif` | Headquarters animation | Local | **251 KB** | GIF format | Convert to animated WebP (est. ~60–90 KB) |

---

#### Newsletter Section (`screens/blogs/newsletter/index.tsx`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `/assets/loop.svg` | Loop/circular decoration | Local | **2.3 MB** | Large SVG decoration | Convert to WebP. Estimated: ~100–200 KB |

---

#### The Team Section (`screens/landing/theTeam/index.tsx`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `/assets/teams/vishal.svg` | Team portrait | Local | **405 KB** | SVG wrapping a raster portrait | Convert to WebP. Estimated: ~30–60 KB |
| `/assets/teams/danish.svg` | Team portrait | Local | **415 KB** | SVG wrapping a raster portrait | Convert to WebP. Estimated: ~30–60 KB |
| `/assets/teams/musaddiq.svg` | Team portrait | Local | **508 KB** | SVG wrapping a raster portrait | Convert to WebP. Estimated: ~30–60 KB |
| `/assets/teams/prayagini.svg` | Team portrait | Local | **737 KB** | SVG wrapping a raster portrait — largest | Convert to WebP. Estimated: ~50–80 KB |
| `/assets/teams/kartik.svg` | Team portrait | Local | **443 KB** | SVG wrapping a raster portrait | Convert to WebP. Estimated: ~30–60 KB |
| `/assets/teams/aniket.svg` | Team portrait | Local | **482 KB** | SVG wrapping a raster portrait | Convert to WebP. Estimated: ~30–60 KB |
| `/assets/teams/aman.svg` | Team portrait | Local | **506 KB** | SVG wrapping a raster portrait | Convert to WebP. Estimated: ~30–60 KB |
| `/assets/teams/karan.svg` | Team portrait | Local | **537 KB** | SVG wrapping a raster portrait | Convert to WebP. Estimated: ~30–60 KB |
| `/assets/teams/harsh.svg` | Team portrait | Local | **511 KB** | SVG wrapping a raster portrait | Convert to WebP. Estimated: ~30–60 KB |

> **IMPORTANT:** The team photos are SVGs that contain rasterized portrait images embedded inside the SVG wrapper. This is the worst of both worlds — raster file size with SVG parsing overhead. All 9 should be converted to WebP.  
> **Total current: ~4.5 MB → Estimated after WebP: ~350–500 KB.**

---

#### Noise Texture (Global — used in footer, cards, and components via `.noise-texture` CSS class)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `/assets/noise.png` | Noise texture | Local | **1.8 MB** | PNG — not referenced in CSS (CSS uses `.webp` version) | **Delete this file** — it's an orphan |
| `/assets/noise.webp` | Noise texture | Local | **1.7 MB** | WebP but still enormous for a subtle overlay texture | Rebuild as a small tileable noise tile (~200×200 px). Re-export at low quality. Target: **< 5 KB** |

---

#### Join Button Texture (Global button component)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `/assets/join-button-texture.png` | Button overlay texture | Local | **1.7 MB** | PNG for a button texture — extreme overweight | Convert to WebP (est. ~100–200 KB). Ideally regenerate at a much smaller resolution (e.g., 400×400) |

---

#### UIpirate Logo (Global — Navbar, ProPirate, OG)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `/assets/uipirate.svg` | Brand logo | Local | **5.4 KB** | Perfect — small SVG logo | Keep SVG |
| `logo_lcn2cq.png` | Brand logo — Navbar + OG template | Cloudinary | ~20–50 KB | **PNG logo on Cloudinary** | Add `/f_webp,q_auto,w_120/` to the Cloudinary URL |

---

### 2.2 Pricing Page (`/pricing`)

#### Hero Section

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `/assets/gif/kite.gif` | Decorative GIF | Local | **136 KB** | GIF | Convert to animated WebP or `<video>` |
| `/assets/gif/headquater.gif` | Decorative GIF | Local | **251 KB** | GIF | Convert to animated WebP or `<video>` |

#### Pricing Icons

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `pause_nod3oq.svg` | Plan feature icon | Cloudinary | ~1–5 KB | Small SVG | Keep SVG |
| `share_ljjrs4.svg` | Plan feature icon | Cloudinary | ~1–5 KB | Small SVG | Keep SVG |
| `value_jwko4r.svg` | Plan feature icon | Cloudinary | ~1–5 KB | Small SVG | Keep SVG |

#### "Perfect For" Section (`screens/pricing/perfectFor/index.tsx`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `sass_em8jqs.svg` | Illustration — Funded Startups | Cloudinary | ~50–200 KB | Complex SVG illustration | Use Cloudinary `/f_webp,q_auto,w_300/` |
| `tems_mhv5e9.svg` | Illustration — SaaS Companies | Cloudinary | ~50–200 KB | Complex SVG illustration | Use Cloudinary `/f_webp,q_auto,w_300/` |
| `creator_qzziot.svg` | Illustration — Agencies | Cloudinary | ~50–200 KB | Complex SVG illustration | Use Cloudinary `/f_webp,q_auto,w_300/` |
| `brand_qbdqtq.svg` | Illustration — Enterprise | Cloudinary | ~50–200 KB | Complex SVG illustration | Use Cloudinary `/f_webp,q_auto,w_300/` |

> **NOTE:** The `/assets/right fit/` folder contains 4 large PNGs (each ~1.6–1.7 MB) for audience segments — `agency.png`, `enterprise teams.png`, `funder startups.png`, `saas companies.png`. These are **no longer referenced in any code**. The Pricing page now uses Cloudinary SVG URLs instead. **These 4 PNG files should be deleted.** Total orphaned size: ~6.7 MB.

#### FAQ Section

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `plus_dia0bt.svg` | FAQ toggle icon | Cloudinary | ~1–3 KB | Remote HTTP request for a simple +/- icon | Inline SVG in JSX |

---

### 2.3 About Page (`/about`)

#### Tech Stack Logos

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `/assets/logos/angular.svg` | Tech logo | Local | 6.6 KB | Small SVG | Keep SVG |
| `/assets/logos/react.svg` | Tech logo | Local | 7.2 KB | Small SVG | Keep SVG |
| `/assets/logos/next js.svg` | Tech logo | Local | 6.9 KB | Small SVG | Keep SVG |
| `/assets/logos/typescript.svg` | Tech logo | Local | 7.3 KB | Small SVG | Keep SVG |
| `/assets/logos/tailwind.svg` | Tech logo | Local | 6.6 KB | Small SVG | Keep SVG |
| `/assets/logos/framer.svg` | Tech logo | Local | 5.7 KB | Small SVG | Keep SVG |
| `/assets/logos/figma.svg` | Tech logo | Local | 6.4 KB | Small SVG | Keep SVG |
| `/assets/logos/gsap.svg` | Tech logo | Local | 11 KB | Small SVG | Keep SVG |
| `/assets/logos/pivotbits.png` | Partner logo | Local | **2.2 KB** | PNG — tiny, minimal impact | Convert to WebP or keep (acceptable) |

#### Client Logos (Cloudinary — same set as marquee section)

Same Cloudinary logos apply — `logo_r097ja.png` is the only PNG, same recommendation: add `/f_webp,q_auto/`.

---

### 2.4 Services Pages (`/services/[id]`)

#### Hero Section (`screens/serviceDetails/hero/index.tsx`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `tabler-icon-star-filled_oymrgq.svg` | Star rating icon | Cloudinary | ~1 KB | Used **12× per service page** | Replace with reusable inline SVG `<StarIcon>` component |
| `whatsapp_zssebt.svg` | WhatsApp CTA icon | Cloudinary | ~5–10 KB | External icon for a CTA | Inline SVG or local icon |
| `/assets/free.svg` | "Free" badge | Local | **6 KB** | Small | Keep SVG |

#### Recommended Next Steps (`screens/serviceDetails/recommendedNextSteps/index.tsx`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `/assets/servicesBanner.svg` | Services banner illustration | Local | **4.9 MB** | Same huge SVG, used again on every service page | **Convert to WebP — Priority 1** |

---

### 2.5 Blog Pages (`/blogs`, `/blogs/[slug]`)

#### Blog List & Detail Fallback

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `/assets/blog-banner-default.svg` | Default fallback banner | Local | **1.5 MB** | Large SVG used whenever no blog image is available | Convert to WebP. Estimated: ~80–150 KB |

#### Blog Thumbnail Images (`/assets/blogs/`)

| Asset | Used In | Current Size | Format | Issue | Estimated WebP Size |
|-------|---------|-------------|--------|-------|---------------------|
| `hire_agency.png` | Blog thumbnail | **782 KB** | PNG | Heavy PNG | ~60–100 KB |
| `idea_to_product.png` | Blog thumbnail | **573 KB** | PNG | Heavy PNG | ~50–80 KB |
| `is_ethical_design.svg` | Blog thumbnail | **3.7 MB** | SVG (complex) | Enormous SVG blog image | ~100–200 KB |
| `product_thinking.png` | Blog thumbnail | **547 KB** | PNG | Heavy PNG | ~50–80 KB |
| `ui_ux_cost.png` | Blog thumbnail | **620 KB** | PNG | Heavy PNG | ~55–90 KB |
| `xperiti_case_study.png` | Blog thumbnail | **869 KB** | PNG | Heavy PNG | ~70–110 KB |

> **Current total for blog thumbnails: ~7.1 MB → Estimated after WebP: ~400–650 KB. A ~90% saving.**

#### OG Image (Blogs page + Contact)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `Screenshot_2026-05-22_023842_sebbvi.png` | OG social preview image | Cloudinary | ~200 KB–1 MB | **PNG OG image** | Add `/f_webp,q_auto/` to Cloudinary URL |
| `newfavicon_ibmap0.svg` | Favicon (used in OG template?) | Cloudinary | ~5 KB | SVG | Keep SVG |

---

### 2.6 Case Studies Page (`/case-studies`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `/assets/blog-banner-default.svg` | Default fallback thumbnail | Local | **1.5 MB** | Same large fallback | Convert to WebP |
| Cloudinary client logos (same set as marquee) | Client logos | Cloudinary | — | `logo_r097ja.png` is PNG | Add `/f_webp,q_auto/` |
| `tabler-icon-star-filled_oymrgq.svg` | Star rating in hero | Cloudinary | ~1 KB | Multiple requests | Inline SVG component |

---

### 2.7 Tool Pages — AI Voice Caller

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `/assets/ai_voice_caller_hero.png` | Tool hero — dark mode | Local | **594 KB** | Heavy PNG — no code reference found | Convert to WebP (est. ~50–90 KB). If unused, delete. |
| `/assets/ai_voice_caller_hero_light.png` | Tool hero — light mode | Local | **485 KB** | Heavy PNG — no code reference found | Convert to WebP (est. ~40–70 KB). If unused, delete. |

---

### 2.8 Global Shared Components

#### Project Estimate Component (`components/ProjectEstimate.tsx`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `/assets/gif/filter.gif` | UI filter animation | Local | **105 KB** | GIF — loaded **2× in same component** | Convert to animated WebP (~25–40 KB) |

#### Join Button Icon (`components/JoinButtonIcon.tsx`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `/assets/join-button-texture.png` | Button overlay texture | Local | **1.7 MB** | PNG background for a button | Convert to WebP (est. ~100–200 KB). Regenerate at lower resolution. |

#### Click Sound Hook (`hooks/useClickSound.ts`)

| Asset | Type | Location | Current Size | Issue | Recommendation |
|-------|------|----------|-------------|-------|----------------|
| `/assets/mouseClick.mp3` | UI click sound | Local | **11 KB** | MP3 audio | Acceptable size. Add OGG fallback for Firefox. |

---

### 2.9 Tools Section — AI Model Logos (`/assets/logos/ai/`)

| Asset | Size | Recommendation |
|-------|------|----------------|
| `claude-ai-icon.svg` | 2.4 KB | Keep SVG |
| `google-gemini-icon.svg` | 8.5 KB | Keep SVG |
| `mistral-ai-icon.svg` | 953 bytes | Keep SVG |
| `openai-light.svg` | 1.3 KB | Keep SVG |
| `openai.svg` | 1.3 KB | Keep SVG |
| `openrouter.svg` | 542 bytes | Keep SVG |
| `puter.svg` | 1.7 KB | Keep SVG |
| `xai-grok.svg` | 1 KB | Keep SVG |

---

### 2.10 Miscellaneous / Root-Level Assets

| Asset | Location | Size | Issue | Recommendation |
|-------|----------|------|-------|----------------|
| `/assets/img/Glow=ON.svg` | Local | **2.4 MB** | No code reference found — potentially orphaned | Confirm usage; if illustration → convert to WebP |
| `/assets/img/Glow=OFF.svg` | Local | **2.4 MB** | No code reference found — potentially orphaned | Same as above |
| `/assets/img/user.svg` | Local | 4 KB | Small icon | Keep SVG |
| `/assets/img/project.svg` | Local | 5.4 KB | Small icon | Keep SVG |
| `/public/fxemoji_rocket.svg` | Root public | 7.4 KB | Unclear usage | Confirm or delete |
| `/public/favicon.ico` | Root public | 15 KB | Standard favicon | OK — also add a PNG favicon for modern browsers |
| `/assets/uipirate.svg` | Local | 5.4 KB | Brand logo | Keep SVG |

---

### 2.11 All Tool Logos in `/assets/logos/` — Size Reference

| Asset | Size | Status |
|-------|------|--------|
| `lotte.svg` | **43 KB** | Largest logo — if rarely shown, convert to WebP |
| `xmind.svg` | 21 KB | Confirm usage |
| `canva.svg` | 20 KB | Likely used in About |
| `react native.svg` | 17 KB | Likely used |
| `procreate.svg` | 16 KB | Likely used |
| `spline.svg` | 15 KB | Likely used |
| `affinity.svg` | 13 KB | Likely used |
| `gsap.svg` | 11 KB | Used in Bento |
| `photoshop.svg` | 8.7 KB | Used in Bento |
| `after effects.svg` | 8.3 KB | Confirm usage |
| `jira.svg` | 7.8 KB | Confirm usage |
| `react.svg` | 7.2 KB | Used in Bento |
| `illustrator.svg` | 7.2 KB | Used in Bento |
| `typescript.svg` | 7.3 KB | Used in Bento |
| `notion.svg` | 6.9 KB | Used in Bento |
| `next js.svg` | 6.9 KB | Used in Bento |
| `vs code.svg` | 6.6 KB | Confirm usage |
| `angular.svg` | 6.6 KB | Used in Bento |
| `tailwind.svg` | 6.6 KB | Used in Bento |
| `github.svg` | 6.4 KB | Used in Bento |
| `figma.svg` | 6.4 KB | Used in Bento |
| `threejs.svg` | 6.3 KB | Used in Bento |
| `fresco.svg` | 6 KB | Confirm usage |
| `vercel.svg` | 5.7 KB | Used in Bento |
| `framer.svg` | 5.7 KB | Used in Bento |

---

## 3. Format Decision Guide

### Keep SVG When:
- The asset is a pure vector logo or icon (< 20 KB)
- The asset must scale at any resolution (brand logos)
- The asset has simple paths with no embedded raster images

### Convert SVG → WebP When:
- SVG is > 200 KB (complex artwork, portraits embedded in SVG, screenshot exports from Figma)
- SVG is a decorative illustration that does not need to scale infinitely
- SVG contains embedded base64 raster images inside it (the team photos are a prime example)

### Convert PNG → WebP (Always):
- PNG should never be served on the web when WebP is available
- WebP is **25–60% smaller** than PNG with the same quality
- WebP supports full alpha transparency — no functionality loss
- All 12 local PNG files and any PNG on Cloudinary should be converted

### Convert GIF → Animated WebP or `<video>` (Always):
- GIF is the oldest and most inefficient animation format
- Animated WebP is **60–80% smaller** than GIF
- `<video autoplay loop muted playsinline>` with WebM is even smaller and hardware-accelerated
- Cloudinary makes this easy — just change `/f_gif/` to `/f_webp/` in the URL, or use `/f_mp4/` for video delivery

---

## 4. Cloudinary Optimization Reference

Cloudinary URL transformations can optimize remote assets **without re-uploading** — just modify the URL:

```
# Standard optimization (auto-format, auto-quality)
BEFORE: .../upload/v1234/image_name.svg
AFTER:  .../upload/f_auto,q_auto/v1234/image_name.svg

# Width-constrained WebP (for mockup/portfolio images)
AFTER:  .../upload/f_webp,q_auto,w_800/v1234/image_name.svg

# Convert GIF to animated WebP
BEFORE: .../upload/v1234/animation.gif
AFTER:  .../upload/f_webp,q_auto/v1234/animation.gif

# Convert GIF to MP4 video
AFTER:  .../upload/f_mp4,q_auto/v1234/animation.gif

# Convert PNG logo to WebP with width constraint
BEFORE: .../upload/v1234/logo.png
AFTER:  .../upload/f_webp,q_auto,w_200/v1234/logo.png
```

---

## 5. Prioritized Action Plan

### Priority 1 — Critical (Fix Immediately)

| # | Action | Files Affected | Estimated Saving |
|---|--------|----------------|-----------------|
| 1 | **Compress `bannervideo.mp4`** → target ≤ 3 MB. Re-encode to H.265. Add WebM source. Set `preload="metadata"`. | `bannervideo.mp4` | **~15 MB** |
| 2 | **Convert `servicesBanner.svg`** (4.9 MB) to WebP | `servicesBanner.svg` (used in 2 places) | **~4.5 MB** |
| 3 | **Convert all 5 Cloudinary GIFs** in "Why Choose Us" to animated WebP via Cloudinary URL | `dashboard_pgl0ez.gif` + 4 others | **~70-80% per GIF** |
| 4 | **Convert all 9 team portrait SVGs** to WebP | `/assets/teams/*.svg` | **~4 MB** |
| 5 | **Rebuild noise texture** — replace `noise.webp` (1.7 MB) with a small tileable noise tile (target < 5 KB). Delete `noise.png`. | `noise.webp`, `noise.png` | **~3.5 MB** |

### Priority 2 — High (This Sprint)

| # | Action | Files Affected | Estimated Saving |
|---|--------|----------------|-----------------|
| 6 | **Convert `join-button-texture.png`** to WebP | `join-button-texture.png` | **~1.5 MB** |
| 7 | **Convert all 6 blog thumbnail PNGs** in `/assets/blogs/` to WebP | 6 files, total ~3.4 MB | **~2.8 MB** |
| 8 | **Convert `is_ethical_design.svg`** (3.7 MB) to WebP | `blogs/is_ethical_design.svg` | **~3.5 MB** |
| 9 | **Convert `bento1.svg`** (1.4 MB) to WebP | `img/bento1.svg` | **~1.2 MB** |
| 10 | **Convert `blog-banner-default.svg`** (1.5 MB) to WebP | `blog-banner-default.svg` (used in 3 places) | **~1.3 MB** |
| 11 | **Convert `loop.svg`** (2.3 MB) to WebP | `loop.svg` | **~2.1 MB** |
| 12 | **Convert `Glow=ON.svg` and `Glow=OFF.svg`** (2.4 MB each) to WebP | 2 files | **~4.6 MB** |

### Priority 3 — Medium (Next Sprint)

| # | Action | Files Affected |
|---|--------|----------------|
| 13 | **Delete orphaned `/assets/right fit/` PNGs** — 4 files, ~6.7 MB, no code references them | `agency.png`, `enterprise teams.png`, `funder startups.png`, `saas companies.png` |
| 14 | **Convert `ai_voice_caller_hero.png` and `_light.png`** to WebP (or delete if orphaned) | 2 files |
| 15 | **Convert all 3 local GIFs** in `/assets/gif/` to animated WebP | `filter.gif`, `kite.gif`, `headquater.gif` |
| 16 | **Add Cloudinary `/f_webp,q_auto/`** to all Cloudinary PNG URLs: `logo_lcn2cq.png`, `logo_r097ja.png`, OG screenshot PNG, `eden-modified_jsf37k.png` | 4 Cloudinary URLs |
| 17 | **Create reusable `<StarIcon>` inline SVG component** — replace 12+ repeated Cloudinary HTTP requests per page | `tabler-icon-star-filled_oymrgq.svg` (all usages) |
| 18 | **Inline `plus_dia0bt.svg`** as JSX in FAQ accordions (3 pages) | FAQ + Pricing FAQ |

### Priority 4 — Low (Housekeeping)

| # | Action |
|---|--------|
| 19 | Delete `noise.png` — unused (CSS references `.webp` version) |
| 20 | Delete or investigate `Glow=ON.svg` and `Glow=OFF.svg` — no code reference found |
| 21 | Delete `/public/fxemoji_rocket.svg` if not referenced anywhere |
| 22 | Add `width` and `height` attributes to all `<img>` tags to prevent Cumulative Layout Shift (CLS) |
| 23 | Migrate all local PNG/WebP `<img>` tags to Next.js `<Image>` component (with `priority` on above-fold images) |
| 24 | Add `loading="lazy"` to all below-the-fold `<img>` tags |
| 25 | Configure `next.config.js` `images.remotePatterns` for `res.cloudinary.com` to allow Next.js `<Image>` to optimize Cloudinary images |
| 26 | Add OGG format fallback alongside `mouseClick.mp3` for Firefox compatibility |
| 27 | Audit `lotte.svg` (43 KB) — if it's a complex logo, convert to WebP |

---

## 6. Total Size Savings Summary

| Category | Current Size | After Optimization | Saving |
|----------|-------------|-------------------|--------|
| Video (`bannervideo.mp4`) | 18 MB | ~3 MB | **~15 MB** |
| SVG illustrations → WebP (local) | ~16 MB | ~1.5 MB | **~14.5 MB** |
| Team photos (9 SVG → WebP) | ~4.5 MB | ~400 KB | **~4.1 MB** |
| Blog PNG images → WebP | ~3.4 MB | ~500 KB | **~2.9 MB** |
| Noise texture rebuild | 3.5 MB | ~10 KB | **~3.5 MB** |
| Button texture PNG → WebP | 1.7 MB | ~150 KB | **~1.6 MB** |
| GIFs → animated WebP | ~500 KB | ~150 KB | **~350 KB** |
| Orphaned files (delete) | ~6.7 MB | 0 | **~6.7 MB** |
| Cloudinary GIF → WebP (remote) | ~5–10 MB | ~1–2 MB | **~4–8 MB** |
| **Total (local)** | **~58 MB** | **~8 MB** | **≈86% reduction** |

---

## 7. Next.js Implementation Notes

- **Use `next/image` (`<Image>`)** for all local PNG/WebP files. It handles automatic WebP delivery, lazy loading, and `srcset` generation out of the box.
- **Set `priority={true}`** on above-the-fold images (hero images, LCP candidates).
- **Use the `sizes` prop** on `<Image>` to generate proper responsive srcsets for different breakpoints.
- **Cloudinary + Next.js `<Image>`**: Add `res.cloudinary.com` as a `remotePattern` in `next.config.js` to allow proxying and optimisation:

```js
// next.config.js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'res.cloudinary.com' }
  ]
}
```

- **Video best practice**: Replace `<video src="/bannervideo.mp4">` with:

```html
<video autoplay loop muted playsinline preload="metadata">
  <source src="/bannervideo.webm" type="video/webm" />
  <source src="/bannervideo.mp4" type="video/mp4" />
</video>
```

---

*Audit generated from static analysis of `/public`, `/app`, `/screens`, `/components`, and `/hooks` directories — September 2026.*
