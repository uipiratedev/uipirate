# Tools Technical Architecture & Backend Roadmap — UI Pirate

**Focus:** Complete technical breakdown of all 28 tools in UI Pirate, deep-dive backend requirements, client vs. server division, advanced enhancement blueprints, and step-by-step engineering roadmap.  
**Related Audit:** [`audits/06-tools-page.md`](file:///d:/ui-pirate/uipirate/audits/06-tools-page.md)  
**Registry Reference:** [`components/SuggestedTools.tsx`](file:///d:/ui-pirate/uipirate/components/SuggestedTools.tsx) → `ALL_TOOLS_REGISTRY`  
**Last Updated:** 2026-08-29  

---

## 1. Executive Summary & Architectural Philosophy

The UI Pirate Tools suite serves as a **primary top-of-funnel conversion engine**, designed to capture high-intent SaaS founders, product managers, and design engineers through organic search (SEO) and Generative Engine Optimization (GEO).

To achieve maximum conversion and domain authority, tools must balance two principles:
1. **Zero-Latency Client Computation:** Tools that do not require external network requests (e.g., color ramps, token studios, CSS generators) must execute 100% in-browser with reactive state and instant clipboard/file exports.
2. **Deterministic Server Verification:** Audit and scanning tools must avoid mock heuristics (such as domain length string math) and utilize **real server-side scraping, DOM parsing, and Lighthouse/AI analysis** to build genuine trust and deliver actionable diagnostics.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          UI PIRATE TOOL SUITE MATRIX                        │
├───────────────────────────────┬───────────────────────────────┬─────────────┤
│ 🔴 Tier 1: Backend Required   │ 🟢 Tier 2: Pure Client-Side   │ 🟣 Tier 3:  │
│ (Scraping, APIs, Lighthouse)  │ (Math, CSS AST, Token Studio) │ Hybrid + AI │
├───────────────────────────────┼───────────────────────────────┼─────────────┤
│ • Landing Page Analyzer       │ • Design Token Studio         │ • AI UX     │
│ • SaaS UX & Friction Audit    │ • WCAG & APCA Contrast        │   Teardowns │
│ • Homepage SEO Checker        │ • 10-Shade Palette Generator  │ • PDF Lead  │
│ • Website Readability         │ • 8pt Grid & Figma Spacing    │   Reports   │
│ • Core Web Vitals Score       │ • Modular Typography Scales   │ • Competitor│
│ • Batch AI Crawler Auditor    │ • CSS to Tailwind Converter   │   Matrix    │
│ • SaaS Marketing Audit        │ • Squircle & Radius Studio    │             │
│ • CTA Button Analyzer         │ • robots/llms.txt Generators  │             │
└───────────────────────────────┴───────────────────────────────┴─────────────┘
```

---

## 2. Complete Tool Categorization Matrix

Every tool in `ALL_TOOLS_REGISTRY` is mapped below according to its execution requirements, data pipeline, and required tech stack.

### Category 1: AI & GEO Visibility (8 Tools)

| Tool Slug | Current State | Execution Model | Required Backend Support & Dependencies |
|---|---|---|---|
| `/tools/ai/ai-bot-checker` | **Live** | 🔴 **Backend Required** | Exists: `app/api/check-ai-bots/route.ts` (Fetches `robots.txt`, `llms.txt`, WAF headers, parses RFC 9309). |
| `/tools/ai/batch-checker` | **Live** | 🔴 **Backend Required** | Calls `/api/check-ai-bots` concurrently. Needs Redis/in-memory rate limiting and queueing for 10+ batch domains. |
| `/tools/ai/geo-competitor-checker` | **Coming Soon** | 🔴 **Backend Required** | Scrapes 2–5 competitor domains simultaneously, parsing structured JSON-LD graphs, `llms.txt`, and AI crawler access. |
| `/tools/ai/bot-directory` | **Live** | 🟢 **Pure Client-Side** | Static search & comparison matrix over 26+ crawler User-Agents. |
| `/tools/ai/llms-txt-generator` | **Live** | 🟢 **Pure Client-Side** | Form-based standard markdown generator with download/copy triggers. |
| `/tools/ai/robots-txt-generator` | **Live** | 🟢 **Pure Client-Side** | Preset rules builder for AI search vs. training scrapers. |
| `/tools/ai/robots-txt-validator` | **Live** | 🟢 **Pure Client-Side** | Client-side tokenizer checking RFC 9309 syntax errors. |
| `/tools/ai/schema-generator` | **Live** | 🟢 **Pure Client-Side** | Form-based schema studio with Schema.org JSON-LD output. |

---

### Category 2: Website & Conversion (6 Tools)

| Tool Slug | Current State | Execution Model | Required Backend Support & Dependencies |
|---|---|---|---|
| `/tools/website/landing-page-analyzer` | **Preview** (Mock) | 🔴 **Backend Required** | Server-side HTML fetcher + Cheerio parser to inspect H1–H3 headlines, CTA button contrast/verbs, social proof badges, and image weights. |
| `/tools/website/homepage-seo-checker` | **Coming Soon** | 🔴 **Backend Required** | Scrapes target URL to validate OpenGraph metadata, Twitter cards, canonical tags, heading structure, and broken asset links. |
| `/tools/website/website-readability-checker` | **Coming Soon** | 🔴 **Backend Required** | Fetches page body text, strips scripts/tags, and executes mathematical readability algorithms (Flesch-Kincaid, Gunning Fog). |
| `/tools/website/website-performance-score` | **Coming Soon** | 🔴 **Backend Required** | Integrates Google PageSpeed Insights REST API to measure LCP, INP, CLS, TTFB, and server response time. |
| `/tools/website/saas-website-audit` | **Coming Soon** | 🔴 **Backend Required** | Scrapes B2B marketing pages for self-serve vs. demo funnel markers, enterprise security badges, and pricing links. |
| `/tools/website/cta-analyzer` | **Coming Soon** | 🔴 **Backend Required** | Extracts all `<button>` and `<a role="button">` nodes, analyzing action verb strength, visual contrast, and above-the-fold placement. |

---

### Category 3: SaaS & Product UX (4 Tools)

| Tool Slug | Current State | Execution Model | Required Backend Support & Dependencies |
|---|---|---|---|
| `/tools/saas/saas-ux-audit` | **Preview** (Mock) | 🔴 **Backend Required** | Server route to inspect authentication redirects, dashboard navigation depth, form field count, and mobile viewport adaptability. |
| `/tools/saas/pricing-page-analyzer` | **Preview** (Mock) | 🔴 **Backend Required** | Scrapes pricing tables, detecting monthly/annual billing toggles, tier count, feature differentiation, and objection handling. |
| `/tools/saas/dashboard-analyzer` | **Coming Soon** | 🔴 **Backend Required** | Evaluates information density, table structure, filter accessibility, and chart responsiveness from a URL. |
| `/tools/saas/saas-onboarding-analyzer` | **Coming Soon** | 🔴 **Backend Required** | Analyzes signup flow length, social login availability, and progressive disclosure patterns. |

---

### Category 4: Design Systems & Code (10 Tools)

| Tool Slug | Current State | Execution Model | Client Architecture & Export Capabilities |
|---|---|---|---|
| `/tools/design/design-tokens` | **Preview** | 🟢 **Pure Client-Side** | Interactive token matrix: export to Tailwind v3/v4 config, CSS variables, and Figma JSON tokens. |
| `/tools/design/color-palette-generator` | **Coming Soon** | 🟢 **Pure Client-Side** | Generates 10-shade ramps (50–950) in OKLCH/HSL color space with automated WCAG AA/AAA pass/fail flags. |
| `/tools/design/contrast-checker` | **Coming Soon** | 🟢 **Pure Client-Side** | Relative luminance math ($L = 0.2126R + 0.7152G + 0.0722B$) + APCA perceptual contrast algorithm. |
| `/tools/design/figma-spacing-calculator` | **Coming Soon** | 🟢 **Pure Client-Side** | 8pt/4pt layout calculations, auto-layout container padding variables. |
| `/tools/design/css-shadow-generator` | **Coming Soon** | 🟢 **Pure Client-Side** | Multi-layer realistic shadow stack builder (ambient + key light) with CSS export. |
| `/tools/design/border-radius-generator` | **Coming Soon** | 🟢 **Pure Client-Side** | Concentric nested padding/radius math ($R_{outer} = R_{inner} + Padding$) and iOS superellipse squircle curves. |
| `/tools/design/typography-scale-generator` | **Coming Soon** | 🟢 **Pure Client-Side** | Modular ratios (Major Third, Golden Ratio) and fluid `clamp(min, preferred, max)` CSS generator. |
| `/tools/design/css-to-tailwind-converter` | **Coming Soon** | 🟢 **Pure Client-Side** | AST-based CSS parser converting declaration blocks to utility classes. |
| `/tools/design/svg-optimizer` | **Coming Soon** | 🟢 **Pure Client-Side** (or WASM) | Strips unnecessary XML metadata and exports clean React JSX using in-browser SVGO. |
| `/tools/design/breakpoint-generator` | **Coming Soon** | 🟢 **Pure Client-Side** | Synchronized media query tokens, container queries, and aspect-ratio CSS. |

---

## 3. Deep-Dive: Backend Architecture & Implementation Details

To power the Tier 1 tools without creating monolithic infrastructure, implement a modular **Next.js Route Handler architecture** in `/app/api/`.

```
app/api/
├── check-ai-bots/route.ts      [Active]  → Fetches robots.txt, llms.txt, WAF headers
├── analyze-website/route.ts    [Planned] → Universal HTML scraper & Cheerio DOM parser
├── lighthouse-score/route.ts   [Planned] → Google PageSpeed Insights REST integration
├── generate-pdf-report/route.ts[Planned] → Renders branded PDF audit reports
└── ai-teardown/route.ts        [Planned] → Structured LLM heuristics via Gemini/Claude
```

### 3.1 Universal Website Scraper API (`/api/analyze-website`)

**Purpose:** Provide real data for Landing Page Analyzer, Homepage SEO Checker, Readability Checker, and CTA Analyzer in a single, cached network request.

```typescript
// app/api/analyze-website/route.ts
import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");
  if (!urlParam) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  const normalizedUrl = urlParam.startsWith("http") ? urlParam : `https://${urlParam}`;
  const targetUrl = new URL(normalizedUrl);

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; UIPirateAuditor/1.0; +https://uipirate.com)",
        "Accept": "text/html,application/xhtml+xml,application/xml",
      },
      signal: AbortSignal.timeout(9000),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch page: ${response.status}` }, { status: 400 });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 1. Headings & Typography Hierarchy
    const h1s = $("h1").map((_, el) => $(el).text().trim()).get();
    const h2s = $("h2").map((_, el) => $(el).text().trim()).get();
    const h3s = $("h3").map((_, el) => $(el).text().trim()).get();

    // 2. Metadata & SEO Signals
    const title = $("title").text().trim();
    const metaDescription = $('meta[name="description"]').attr("content") || null;
    const ogImage = $('meta[property="og:image"]').attr("content") || null;
    const ogTitle = $('meta[property="og:title"]').attr("content") || null;
    const canonical = $('link[rel="canonical"]').attr("href") || null;

    // 3. CTA & Action Discovery
    const buttons = $("button, a.btn, a[class*='button'], a[class*='cta'], [role='button']")
      .map((_, el) => ({
        text: $(el).text().trim().replace(/\s+/g, " "),
        href: $(el).attr("href") || null,
        tag: el.tagName.toLowerCase(),
      }))
      .get()
      .filter((b) => b.text.length > 0 && b.text.length < 50);

    // 4. Raw Text & Readability Extraction
    $("script, style, svg, noscript, nav, footer").remove();
    const cleanBodyText = $("body").text().replace(/\s+/g, " ").trim();
    const wordCount = cleanBodyText.split(" ").filter(Boolean).length;

    return NextResponse.json({
      domain: targetUrl.hostname,
      url: targetUrl.toString(),
      seo: {
        title,
        metaDescription,
        ogImage,
        ogTitle,
        canonical,
        h1Count: h1s.length,
        h1s,
        h2s: h2s.slice(0, 10),
      },
      conversion: {
        buttons,
        primaryCtaDetected: buttons[0] || null,
        hasSocialProof: Boolean(
          $("*:contains('Review'), *:contains('Rating'), *:contains('Trusted by'), [class*='testimonial']").length
        ),
      },
      content: {
        wordCount,
        sampleText: cleanBodyText.slice(0, 500),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

---

### 3.2 Real Readability Algorithms (Flesch-Kincaid & Gunning Fog)

To replace guesswork, implement deterministic mathematical scoring:

$$\text{Flesch-Kincaid Grade Level} = 0.39 \left(\frac{\text{total words}}{\text{total sentences}}\right) + 11.8 \left(\frac{\text{total syllables}}{\text{total words}}\right) - 15.59$$

- **Target Grade for High-Converting B2B SaaS:** Grade 6.0 – 8.5 (plain language, immediate clarity).
- **Flagged Issues:** Jargon density $> 12\%$, sentences $> 25$ words.

---

### 3.3 Core Web Vitals Engine via Google PageSpeed REST API

**Purpose:** Powers `/tools/website/website-performance-score` with Google Lighthouse metrics:

```typescript
// app/api/lighthouse-score/route.ts
const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
  targetUrl
)}&category=PERFORMANCE&category=ACCESSIBILITY&category=SEO&strategy=mobile&key=${apiKey}`;

const res = await fetch(endpoint);
const data = await res.json();
const metrics = {
  performanceScore: Math.round(data.lighthouseResult.categories.performance.score * 100),
  lcp: data.lighthouseResult.audits["largest-contentful-paint"].displayValue,
  cls: data.lighthouseResult.audits["cumulative-layout-shift"].displayValue,
  inp: data.lighthouseResult.audits["interaction-to-next-paint"]?.displayValue || "N/A",
  fcp: data.lighthouseResult.audits["first-contentful-paint"].displayValue,
};
```

---

## 4. Blueprints to Make the Tools 10x More Advanced

### 4.1 LLM-Powered AI UX & Copy Teardown (Personalized Insights)
- **Problem:** Static rules output generic advice like *"Improve your headline"*.
- **Advanced Solution:** Pass scraped headings and CTAs to an LLM with strict Zod JSON schema validation:
  ```json
  {
    "headlineCritique": "Your H1 'Next-Gen Cloud Orchestration' is feature-dense and abstract.",
    "suggestedAlternatives": [
      "Deploy multi-cloud Kubernetes clusters in under 60 seconds",
      "Cut cloud infrastructure overhead by 40% with automated orchestration"
    ],
    "ctaRecommendation": "Change 'Explore Docs' to 'Start Free Cluster (No CC)'"
  }
  ```

---

### 4.2 Interactive UI Component Sandbox (Design System Studio)
Instead of static hex codes or abstract tables, the Design Token and Color Palette tools will feature an **embedded live component playground**:
- Real rendered components: Primary Button, Secondary Ghost Button, Alert Banner, Multi-select Badge, Dark/Light Mode SaaS Dashboard card.
- Sliders dynamically mutate CSS custom properties on the container (`--color-primary`, `--radius-card`, `--spacing-base`), allowing instant visual verification.
- **1-Click Export Bar:**
  - `Copy Tailwind v4 @theme CSS`
  - `Export tailwind.config.js`
  - `Download Figma Tokens JSON (Tokens Studio compatible)`
  - `Export CSS Variables (:root)`

---

### 4.3 Automated PDF Audit Generation & Lead-Gen Gate
- Users receive an immediate on-screen summary (0–100 score + top 3 findings).
- To unlock the comprehensive 8-page breakdown with wireframe recommendations, provide a **Lead Capture Gate**:
  - *"Email me the complete PDF Audit Report"*
  - Backend renders high-resolution PDF via `@react-pdf/renderer` or serverless Chromium.
  - Automatically records lead in database and displays an immediate bridge: *"Want our senior design engineers to fix this? Book a Free 15-min Discovery Call."*

---

## 5. Phased Implementation Roadmap

```
PHASE 1: Foundation & SEO Cleanup (Immediate)
├── Add app/tools/layout.tsx with metadata & OpenGraph tags
├── Inject ItemList & WebApplication JSON-LD schema
├── Reconcile orphaned routes (/type-scale, /8pt-grid, /geo-visibility)
└── Collapse or hide thin "Coming Soon" cards from search index

PHASE 2: Universal Scraper & Analysis Backend
├── Implement app/api/analyze-website/route.ts (Cheerio HTML extraction)
├── Connect LandingPageAnalyzerClient.tsx to real live DOM data
└── Implement real Flesch-Kincaid readability scoring

PHASE 3: Flagship Client-Side Studios
├── Complete Accessible Color Palette Generator (OKLCH + WCAG/APCA)
├── Complete WCAG & APCA Contrast Checker with live preview
├── Complete Fluid Typography Scale Generator with clamp() output
└── Add Figma Variables & Tailwind v4 export to Design Tokens Studio

PHASE 4: Performance & AI Heuristics
├── Add Google PageSpeed API integration for Web Vitals score
├── Implement AI Copy Teardown via structured LLM prompt
└── Build Side-by-Side GEO Competitor Benchmark

PHASE 5: Conversion Funnel & PDF Lead Engine
├── Implement @react-pdf/renderer for downloadable executive audits
└── Connect tool CTAs directly to Cal.com booking workflow
```

---

## 6. Recommended Action Plan

1. **Step 1:** Add the missing `app/tools/layout.tsx` to fix the critical SEO metadata gap identified in [`audits/06-tools-page.md`](file:///d:/ui-pirate/uipirate/audits/06-tools-page.md).
2. **Step 2:** Build `/app/api/analyze-website/route.ts` to upgrade `LandingPageAnalyzerClient` and `SaasUxAuditClient` from mock math to live URL analysis.
3. **Step 3:** Deploy the remaining pure client-side design utilities (Color Palette, Contrast Checker, Typography Scale).
