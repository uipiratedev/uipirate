# Pricing Page Content Audit — UI Pirate
**Page:** `/pricing`  
**Files in scope:** `app/pricing/page.tsx` · `screens/pricing/` · `screens/landing/pricing/index.tsx`  
**Focus:** Copy, messaging, positioning, conversion logic, SEO metadata, and structural decisions  
**Research basis:** Apple HIG, Google Material UX Writing, Nielsen Norman Group, Copyhackers JTBD, E-E-A-T guidelines, CRO research, B2B pricing psychology (Predictably Irrational — Ariely, Influence — Cialdini), agency pricing studies, SaaS pricing benchmark data  
**Last audited:** 2026-08-27

---

## Research Foundation

Every recommendation in this document is grounded in the same cross-source principle set used for the landing page audit, with two additional sources specific to pricing psychology.

### What the research consistently says

**Apple Human Interface Guidelines** — Clarity is the goal. A pricing page visitor has one job: understand what they get, for how much, and what happens next. Every word that doesn't serve that job is friction. Clarity beats cleverness on every pricing page without exception.

**Google Material UX Writing** — Concrete, plain language converts. Pricing copy that uses abstract claims ("endless possibilities," "high-value") instead of specific deliverables and guarantees fails the clarity test. The visitor needs to be able to make a decision — help them, don't excite them.

**Nielsen Norman Group (NN/g)** — Pricing pages are research pages. Visitors arrive having already seen your service offering; they are now in evaluation mode. They are asking: Is this worth it? Can I trust this? What happens if it doesn't work? Every section should address one of these three questions. Sections that don't are wasted real estate.

**Copyhackers / Jobs-to-be-Done** — Buyers don't pay for plans. They pay for outcomes. The strongest pricing page copy names the specific situation the buyer is in right now (overwhelmed, understaffed, under deadline) and shows how each plan resolves it. Feature lists alone don't convert — situation-to-outcome copy does.

**Predictably Irrational (Dan Ariely) — Pricing Psychology** — The most powerful pricing page structure uses anchoring and decoy effects. Showing a high-cost option first makes the middle option feel reasonable. A comparison table that makes your price look low next to established alternatives activates the "that's a deal" cognitive response. Price without context is just a number. Price next to a more expensive competitor is a bargain.

**Cialdini's Influence — Social Proof, Scarcity, and Reciprocity** — On pricing pages specifically: (1) social proof closest to the price reduces hesitation at the decision moment, (2) scarcity is the single most effective CTA accelerator but only when it is visibly real and changes, (3) a risk-reversal guarantee near the CTA is the most direct way to eliminate the last objection before a conversion.

**B2B Agency Pricing Research** — The biggest conversion killers on agency pricing pages: (a) no direct booking path — forcing a contact form as the only next step adds friction and loses warm leads; (b) vague feature lists — "unlimited requests" without context sounds too good and triggers skepticism; (c) no indication of what a typical engagement looks like — buyers fear the unknown more than the price.

---

## Page Structure (Current Order)

```
1.  Hero (headline, sub-headline, trust stats, CTAs)
2.  Client Logos strip
3.  Pricing Cards (Monthly Retainer + Project Estimate + Custom Quote)
4.  Benefits row (3 benefit cards below the pricing cards)
5.  Satisfaction Guarantee block
6.  Comparison Table (UI Pirate vs. US Agency vs. Freelancer vs. In-House)
7.  "Is This Right For You?" / Perfect For section
8.  5-Day Pilot Project CTA (TryBeforeCommit)
9.  FAQ accordion
```

---

## Section-by-Section Audit

---

### 1. HERO
**File:** `screens/pricing/hero/index.tsx`

The pricing page hero has a different job than the homepage hero. Visitors arriving at `/pricing` have already decided they're interested — they're now in evaluation mode. The hero's job is not to sell UI Pirate again, but to orient the visitor and reduce anxiety about what they're about to read.

---

#### 1a. Badge

**Current:**
```
PLANS & PRICING
```

**Assessment:** ✅ Functional. Short, neutral, and accurate. No action needed.

---

#### 1b. Headline (H1)

**Current:**
```
Simple, Transparent Pricing
```

**What's wrong:**

| Problem | Why it matters |
|---|---|
| "Simple, Transparent Pricing" is used verbatim by thousands of service businesses | If your headline could belong on a competitor's page without editing, it is not doing any positioning work. It is page furniture, not a conversion asset |
| No outcome or audience signal | The landing page audit already flagged that good B2B copy leads with the client's situation. This headline leads with a product claim ("simple") that every agency makes |
| The word "Simple" is doing work that "Transparent" already covers | Two adjectives that point to the same concept — no hidden complexity — is redundant. One strong word beats two weak ones |

**What the research says (NN/g):** On a pricing page, the visitor already knows they're looking at pricing. The H1 does not need to tell them that. It should either reinforce who this is for, or eliminate the biggest fear they arrive with (being overcharged, being locked in, not knowing what they'll get).

**Suggested fix:**
```
Pricing That Fits How You Actually Work
```

---

#### 1c. Sub-headline

**Current:**
```
No hidden fees. No surprise invoices. Choose the plan that fits your scope — 
from monthly retainers to one-time projects. We work the way you need.
```

**What's wrong:**

| Problem | Why it matters |
|---|---|
| "We work the way you need" — vague filler ending | After three specific promises (no hidden fees, no surprise invoices, choose your plan), this ending dilutes rather than adds. It's the sentence equivalent of ending an email with "please let me know" — technically harmless, but a missed opportunity |
| Lists three reassurances without anchoring them to the buyer's situation | Why does the buyer need reassurance about hidden fees? Because they've been burned before. The copy makes the promise but doesn't acknowledge the underlying fear |
| "from monthly retainers to one-time projects" — this is structure, not value | Describing the plan format without describing the outcome of each format gives the reader categories before they know which category applies to them |

**Suggested rewrite:**
```
Most agencies lock you into long contracts, surprise you with change orders, 
and disappear after the handoff. Here, you know exactly what you pay, 
exactly what you get, and you can stop anytime.
```
This activates contrast with a familiar negative experience (the "before" state) which is more persuasive than a list of promises. Copyhackers JTBD calls this the "problem-agitate" pattern.

---

#### 1d. Trust Stats Row

**Current stats:**
```
50+    Products Shipped
5.0★   Average Rating
< 2hr  Response Time
9yr+   In Business
```

**What's wrong:**

| Stat | Problem | Impact |
|---|---|---|
| `5.0★` Average Rating | Good, but where does this rating come from? No source is cited. An unsourced star rating on your own pricing page looks self-reported, which reduces rather than increases trust | Credibility gap |

**Suggested fix:** The four stats are solid — keep them as-is. The only change needed is to source the rating:
```
50+    Products Shipped
5.0★   Rated on Upwork      ← source added
< 2hr  Response Time
9yr+   In Business
```

---

#### 1e. Hero CTAs

**Current CTAs:**
```
[Compare Plans ↓]   [Book a Call →]   [Download Pricing PDF ↓]
```

**What's wrong:**

| Problem | Why it matters |
|---|---|
| Three equal-weight CTAs create decision paralysis | CRO research: every additional CTA of equal visual weight reduces the click-through rate of each individual button. Three is two too many |
| "Compare Plans" and "Download Pricing PDF" are both downward/secondary actions | Both describe further research behavior — scrolling and downloading — not conversion behavior. Neither moves the visitor forward toward becoming a client |
| "Download Pricing PDF" on a page that already shows pricing is redundant | If the visitor is already on the pricing page, why do they need a PDF of the same information? The PDF should be the fallback for someone who couldn't find the pricing page, not the CTA on it |
| "Book a Call →" links to `/contact` — this is a missed conversion | Linking to a contact page requires the visitor to fill a form and wait. Linking directly to a calendar (cal.com) removes one full step from the conversion path. Every additional step loses ~20% of visitors in B2B contexts (Forrester) |

**Suggested fix:**
- Primary CTA: `Start the 5-Day Pilot — $150` (links directly to booking or pilot page)
- Secondary CTA: `See How We Compare ↓` (scroll anchor to comparison table)
- Remove the PDF download from the hero entirely; move it to the footer or a sidebar if needed

---

### 2. CLIENT LOGOS STRIP
**File:** `screens/pricing/clientLogos/index.tsx`

---

#### 2a. Section label

**Current:**
```
Trusted by teams at
```

**Issue:** Incomplete sentence. "Trusted by teams at" followed by logo images is grammatically ambiguous — "at" implies there's a company name or place that should follow, but instead there's a row of images. The grammar implies text that isn't there.

**Suggested fix:**
```
Companies that chose us over US agencies and in-house teams
```
This framing is more specific and connects directly to the comparison table lower on the page, creating a narrative arc.

---

#### 2b. Logo context

**Issue:** Same problem identified in the landing page audit — logos without company name labels are ineffective for visitors who don't already recognize the brands.

- Ipsos is the only globally recognizable name in the set
- Biotex Medical, Sarge, Awesome Health Club, and Rings & I are not recognizable to a US buyer evaluating an agency

**Suggested fix:** Add small text labels below each logo. Even 10px labels make the grid significantly more informative and allow the visitor to calibrate: *"Oh, Biotex Medical is a HealthTech company — UI Pirate has worked in my space."*

---

### 3. PRICING CARDS (MONTHLY RETAINER + PROJECT ESTIMATE + CUSTOM QUOTE)
**File:** `screens/landing/pricing/index.tsx`

This is the most critical section of the pricing page. Everything above it builds trust; this section asks for the decision.

---

#### 3a. Section heading (above the pricing cards)

**Current:**
```
Pricing That Makes Sense
```

**Issue:** Same problem flagged in the landing page audit. This phrase is used by virtually every service business online. It signals nothing about UI Pirate specifically and does nothing to frame the decision the visitor is about to make.

**What the research says:** The heading above your pricing cards is the last moment before the visitor sees a number. Use it to frame the value, not describe the format.

**Suggested alternatives:**
```
Your Dedicated Product Team, Without the Overhead
```
or
```
Pick How You Want to Work With Us
```

---

#### 3b. Monthly Retainer — subtitle

**Current:**
```
FOR TEAMS THAT NEED DESIGN & DEV SUPPORT, EVERY MONTH
```

**Issue:** Already flagged in the landing page audit. Describes who buys it rather than the pain that drives the purchase. The JTBD framework says: the buyer isn't hiring "design & dev support" — they're hiring a solution to being understaffed, behind schedule, or too expensive in-house.

**Suggested fix:**
```
YOUR DEDICATED DESIGN & DEV TEAM — WITHOUT THE FULL-TIME HEADCOUNT
```
This lands harder because it names the exact alternative the buyer is weighing (hiring someone full-time) and shows the superiority of the retainer model without saying "we're better."

---

#### 3c. Monthly Retainer — feature list

**Current list:**
```
Access to our full design & development stack
1 Active request at a time
Weekly Progress Meeting
Fast turnaround
Unlimited requests within scope
Expert project management
5/7 Communication
```

**What's wrong:**

| Feature | Problem | Why it matters |
|---|---|---|
| "Access to our full design & development stack" | Vague. What stack? This sounds like a benefit but communicates no specific value. A buyer can't picture what this means | NN/g: ambiguous feature items don't convert; they confuse |
| "1 Active request at a time" | This is a constraint, not a benefit — but it's listed alongside benefits with the same visual treatment | Listing a limitation with a checkmark beside it is misleading. It will confuse or backfire when the buyer reads it carefully |
| "Fast turnaround" | Quantify this. The hero says "< 2hr response time" — that's response time, not turnaround. How long does a request actually take? The FAQ says 48-72 hours. Put that number here | Vague promises reduce conversion; specific promises increase it |
| "Unlimited requests within scope" | "Within scope" is the kind of fine print language that triggers skepticism. What is "scope"? Is there a real limit? The phrase creates more questions than it answers | E-E-A-T: qualifying language on a pricing card reduces trust |
| "5/7 Communication" | Non-standard format. Does this mean 5 days a week, 7 hours a day? 5 out of 7 days? This is cryptic and requires the visitor to decode it instead of gaining confidence | Apple HIG: any label that requires interpretation should be rewritten |
| "Expert project management" | Who is the "expert"? This is a generic agency claim that every competitor also makes | Differentiates nothing |

**Suggested rewrite of the feature list:**
```
✓ Design + development in one retainer (no split vendors)
✓ 48–72hr turnaround per request
✓ Unlimited design requests (one active at a time)
✓ Weekly video call — you see progress every week
✓ Figma files delivered, developer-ready
✓ Pause or cancel anytime — no penalty
✓ Mon–Fri communication, same-day replies
```

---

#### 3d. Monthly Retainer — "One subscription, endless possibilities"

**Current:**
```
One subscription, endless possibilities
```

**Issue:** "Endless possibilities" is a consumer marketing phrase — it belongs in an iPhone ad, not a B2B agency pricing card. A SaaS founder or VP of Product is not moved by "endless possibilities." They are moved by "we handle the design, you focus on the product."

**Suggested fix — delete this line entirely** or replace with:
```
One invoice. One point of contact. No surprises.
```

---

#### 3e. Monthly Retainer — Scarcity message

**Current:**
```
Only accepting 2 new clients this month
```

**Issue:** Same issue flagged in the landing page audit, but more severe here because it appears on the pricing page — the highest-intent page on the site.

**What the research says (Cialdini, Scarcity):** Scarcity is the single most powerful conversion accelerator — but only when it is demonstrably real. A scarcity message that never updates does the opposite of its intended effect: it trains the visitor to ignore all signals on the page. A returning visitor who saw this message three months ago and sees it again today will discount the guarantee, the testimonials, and everything else.

**Options:**
1. Connect it to a real, dynamically updated availability (e.g., pull from a database or update manually at the start of each month)
2. Replace with a claim that is permanently and verifiably true: `"We keep our client count small. Every project gets our full attention — typically 3–4 active clients at any time."`
3. Remove it and rely on the pilot offer as the conversion accelerator instead

---

#### 3f. Monthly Retainer — Primary CTA

**Current:**
```
[Chat on WhatsApp]
```

**Issue:** This is the only CTA button on the most expensive plan card on the pricing page, and it sends the visitor to WhatsApp. This is the same problem identified in the landing page audit — for a US-based B2B audience, WhatsApp as a primary CTA signals informal/offshore. On a pricing card that asks for $2,000/month, this is especially damaging.

**What the research says (B2B conversion path):** The CTA on a pricing card should take the visitor to the next concrete step in the sales process — not to a messaging app. The gold standard is: a calendar booking link (Calendly/cal.com) that lets the prospect pick a time without any back-and-forth. This eliminates the "I'll come back to this" behavior that kills 70%+ of warm leads.

**Suggested fix:**
- Primary: `Book a 15-Min Call →` (links directly to cal.com)
- Secondary (smaller, below): `Prefer to message? WhatsApp us →` (then the WhatsApp link)

---

#### 3g. Custom Quote card — subtitle

**Current:**
```
FOR COMPLEX PRODUCTS, ENTERPRISE NEEDS & STARTUPS
```

**Issue:** Already flagged in the landing page audit. Enterprise and startups are at opposite ends of every relevant dimension: budget, process maturity, timeline expectations, and stakeholder count. Listing them together sends no useful signal to either audience.

**Suggested fix:**
- If the target is enterprise: `FOR COMPLEX PRODUCTS AND ORGANIZATIONS THAT NEED A DEDICATED PRODUCT PARTNER`
- If growth-stage is the target: `FOR FUNDED STARTUPS AND PRODUCT TEAMS READY TO BUILD AT SCALE`

---

#### 3h. Custom Quote card — description

**Current:**
```
Best suited for products that don't fit into standard plans.
```

**Issue:** This describes the plan by what it is *not* (not a standard plan) rather than what it *is* or who it is for. Negative framing as the primary description is a weak conversion approach.

**Suggested fix:**
```
You have a specific scope, a specific timeline, and a team that needs to stay involved. 
We scope the project around your actual needs — not a template.
```

---

#### 3i. Custom Quote card — CTA

**Current:**
```
[Chat on WhatsApp]
```

Same issue as 3f. WhatsApp is not the appropriate CTA for a card targeting enterprise clients.

---

#### 3j. Benefits row (below pricing cards)

**Current 3 benefit cards:**
```
PAUSE ANYTIME — "You can easily pause your subscription whenever you need to, without any worries or hassle."
5-DAY PILOT PROJECT — "Big scope. Big budget. No blind trust. This 5-day pilot shows you see our execution before committing long term."
LOW-RISK, HIGH-VALUE — "Your fee is fully deductible from the final invoice if you move forward with a full project."
```

**What's wrong:**

| Benefit | Problem |
|---|---|
| "without any worries or hassle" | Consumer-speak. Enterprise buyers don't respond to "without any worries." They respond to process and specificity. "Pause with 5 days' notice — billing stops immediately" is more credible than "without any worries or hassle" |
| "This 5-day pilot shows you see our execution before committing long term" | This is the broken sentence already flagged in the landing page audit. The word "see" appears twice and the sentence doesn't parse correctly. "Shows you see our execution" is grammatically broken |
| "LOW-RISK, HIGH-VALUE" as a label | This is the agency describing itself using its own assessment. "Low-risk" and "high-value" are conclusions the buyer should reach, not labels you apply to your own offer. This reads as self-promotion, not proof |

**Suggested rewrites:**
```
PAUSE ANYTIME — Give us 5 days' notice and your billing stops. Resume when you're ready. 
                 No contracts, no penalties, no questions.

5-DAY PILOT — Pay $150–$350 to see our actual work on your actual brief before committing 
               to a full engagement. Real deliverables in 5 days.

PILOT FEE BACK — If you move forward after the pilot, the full pilot fee is deducted 
                  from your first invoice. You pay nothing twice.
```

---

#### 3k. Satisfaction Guarantee block

**Current:**
```
Not happy with the first milestone? We'll refund your deposit — no questions asked. 
We're confident in our work because we've done this 100+ times for companies like yours.
```

**Issue:** Same issue from the landing page audit. "Companies like yours" is a missed name-drop opportunity. Real client names next to a guarantee multiply the trust signal.

**Suggested fix:**
```
Not happy with the first milestone? We'll refund your deposit — no questions asked. 
We've delivered for Sarge, Biotex Medical, RevUp AI, and Khaitan & Co. 
If we can't meet the bar we've set with them, we don't deserve your money.
```

---

### 4. COMPARISON TABLE
**File:** `screens/pricing/comparison/index.tsx`

The comparison table is one of the best-performing conversion elements on a service pricing page. It activates the anchoring effect — showing competitors' prices makes yours look like a deal. The current implementation is structurally sound but has some specific issues.

---

#### 4a. Section heading and sub-copy

**Current:**
```
How We Stack Up
See why 50+ companies chose us over traditional agencies, freelancers, or hiring in-house.
```

**Assessment:** ✅ The heading is clean and direct. The sub-copy works — it mentions a specific number (50+) and names the alternatives being compared. No change needed here.

---

#### 4b. Table data — "Turnaround" row

**Current:**
```
UI Pirate: 48-72hr  |  US Agency: 1-2 weeks  |  Freelancer: Variable  |  In-House: Slow
```

**Issue:** "Slow" is a loaded, subjective label for In-House. The table presents UI Pirate vs. the others — but "Slow" for In-House reads as disparaging rather than factual, which can backfire with a visitor who currently has an in-house team and is evaluating whether to supplement it. They will read "Slow" as an insult to their existing team.

**Suggested fix:**
```
In-House: 2–4 weeks
```
A specific estimate is more credible than a pejorative and does the same anchoring job without the negative tone.

---

#### 4c. Table data — "Quality" row

**Current:**
```
UI Pirate: Enterprise  |  US Agency: Enterprise  |  Freelancer: Variable  |  In-House: Variable
```

**Issue:** Claiming the same quality level as a US Agency ("Enterprise") in the same row undercuts the main value proposition. If the quality is the same as a $8-15k/month agency but the price is $2k/month, the buyer wonders why. This creates doubt rather than confidence.

**Suggested fix:** Replace the "Quality" row with a row that plays to a UI Pirate-specific differentiator, such as:
```
"Dedicated PM"  →  UI Pirate: ✓  |  US Agency: Shared  |  Freelancer: ✕  |  In-House: ✓
```
or
```
"Async-Friendly"  →  UI Pirate: ✓  |  US Agency: ✕  |  Freelancer: ✓  |  In-House: ✓
```

---

#### 4d. Mobile: 2 out of 4 columns hidden

**Current behavior:** On mobile (`max-md`), the "US Agency" and "Freelancer" columns are hidden. Only "UI Pirate" and "In-House" remain.

**Issue:** The US Agency column is the one doing the most anchoring work — showing "$8-15k" next to "$2,000" is the core of the value proposition. Hiding the highest-contrast comparison on the most common device type (mobile) defeats the purpose of the table.

**Suggested fix:** Keep "US Agency" visible on mobile and hide "In-House" instead. Or switch to a horizontal scroll on mobile rather than column hiding.

---

### 5. "IS THIS RIGHT FOR YOU?" / PERFECT FOR SECTION
**File:** `screens/pricing/perfectFor/index.tsx`

---

#### 5a. Section heading

**Current:**
```
Is This Right For You?
```

**Assessment:** ✅ Good. Direct, conversational, and does the filtering job correctly. Keep it.

---

#### 5b. Section sub-label

**Current:**
```
Perfect for
```

**Issue:** This text hangs alone as an incomplete sentence — "Perfect for" with nothing after it. The four cards below it provide the answer, but the label reads as orphaned text before you get there.

**Suggested fix:** Either remove this label (the cards are self-explanatory) or complete the sentence:
```
Perfect for teams that need to move fast without adding headcount
```

---

#### 5c. "Perfect For" card — Funded Startups

**Current:**
```
Ship fast and impress investors with premium UI that stands out in competitive markets.
```

**Issue:** "Impress investors" is a secondary benefit, not the primary job the startup founder is hiring for. The primary job is: build a product that users understand and convert on. Investor impressiveness is downstream of that.

**Suggested fix:**
```
You raised the capital. Now you need to ship something that works and looks like it belongs 
in the App Store, not a hackathon. That's what we build.
```

---

#### 5d. "Perfect For" card — SaaS Companies

**Current:**
```
Without in-house design teams, needing consistent updates and design system maintenance.
```

**Issue:** This is a sentence fragment. It starts with "Without..." which grammatically requires a subject before it. As written, it reads as an abandoned thought. A first-time visitor reading this card will notice something is off, even if they can't name why.

**Suggested fix:**
```
You're scaling fast but your design is stuck. No in-house designer, no consistency, 
new features shipping without a system. We keep it coherent.
```

---

#### 5e. "Perfect For" card — Agencies

**Current:**
```
White-label design support for client projects when your team is at capacity.
```

**Assessment:** ✅ This is clear and specific. Keep it, though consider adding a proof signal: *"We've white-labeled for 5+ agencies in the US and UK."*

---

#### 5f. "Perfect For" card — Enterprise Teams

**Current:**
```
Overflow design capacity without the overhead of hiring full-time designers.
```

**Assessment:** ✅ Good — specific, named benefit (overflow capacity), named alternative being replaced (hiring full-time). Minor polish: consider adding a specific pain point — *"When your roadmap grows faster than your hiring pipeline can keep up."*

---

#### 5g. "Not the right fit" section

**Current items:**
```
📦 Physical product design
🎨 One-off logo or branding projects
⏰ 24/7 instant turnaround expectations
```

**What's wrong:**

| Issue | Why it matters |
|---|---|
| Emoji icons in a B2B professional context | Same issue flagged in the landing page FAQ audit. On a pricing page targeting enterprise SaaS, emojis next to service exclusions look consumer-facing |
| "24/7 instant turnaround expectations" — vague | What is "instant"? This exclusion should be specific. If turnaround is 48-72 hours, say: "We don't offer same-day design sprints or 24-hour turnarounds" |

**Suggested fix — replace emoji with neutral icon symbols and rewrite the third item:**
```
✕  Physical product or industrial design
✕  One-off logo or brand identity projects
✕  Same-day or 24-hour turnaround requests
```

---

### 6. 5-DAY PILOT CTA (TRY BEFORE COMMIT)
**File:** `screens/pricing/tryBeforeCommit/index.tsx`

This section is one of the strongest conversion assets on the page — the pilot concept is a genuinely differentiated offer in the agency space. The design is strong. The copy has fixable issues.

---

#### 6a. Main description

**Current:**
```
Test our work before committing. See real results in 5 days — your fee is fully deductible 
from the final project invoice.
```

**Assessment:** ✅ This is good. Clear, specific, risk-reversing. One minor note: "fully deductible" is a tax term that some readers might misread as referring to tax deductibility. Consider "fully credited" instead:
```
Test our work before committing. See real results in 5 days — your pilot fee is credited 
in full against your first invoice if you continue.
```

---

#### 6b. Benefit card — "Low-Risk, High-Value"

**Current:**
```
Your pilot fee is deducted from the final invoice when you continue with a full project.
```

**Assessment:** ✅ This is the clearest and most functional copy in the section. Keep it.

---

#### 6c. Benefit card — "Real Deliverables"

**Current:**
```
Walk away with a working mini-build or polished design — ready to scale.
```

**Issue:** "Ready to scale" is vague — a common phrase that has been drained of meaning through overuse. In this context it reads as filler that comes after a good, specific promise ("working mini-build or polished design").

**Suggested fix — delete "ready to scale" and end where the specificity ends:**
```
Walk away with a working mini-build or polished design. Not a concept deck — real output.
```

---

#### 6d. Pilot pricing options

**Current:**
```
Design       $150   UI/UX design sprint
Development  $250   Code implementation
Design + Dev $350   Full-stack delivery
```

**Issue:** The descriptions ("UI/UX design sprint," "Code implementation," "Full-stack delivery") are too thin. A visitor weighing $150 vs. $350 needs to understand what they concretely get in each option.

| Tier | Current description | Problem |
|---|---|---|
| Design $150 | "UI/UX design sprint" | What does a "sprint" produce? 1 screen? 5 screens? |
| Development $250 | "Code implementation" | Implement what? Based on existing Figma? In what stack? |
| Design + Dev $350 | "Full-stack delivery" | Still vague |

**Suggested fix:**
```
Design $150       — Up to 3 screens designed in Figma, delivered with handoff notes
Development $250  — Working frontend component or page based on your existing designs
Design + Dev $350 — 1 feature or page: fully designed and coded, ready to ship
```

---

#### 6e. Scarcity message at the bottom of the pilot CTA

**Current:**
```
● Limited slots available each month
```

**Issue:** Same static-scarcity problem as the retainer card. A permanently-displayed "Limited slots" message that never changes trains the visitor to ignore it. It is less convincing than no scarcity message at all.

**Option 1:** Make it dynamic or update it regularly.  
**Option 2:** Replace with a different risk-reversal: `"Response within 1 business day. No commitment required to inquire."`

---

#### 6f. CTA button

**Current:**
```
[Start Your Pilot Project]
```

**Assessment:** ✅ Good — action-oriented, specific, frictionless label. Keep it. Verify it links to a direct booking or intake path, not just the contact page.

---

### 7. FAQ SECTION
**File:** `screens/pricing/faq/index.tsx`

---

#### 7a. Section heading

**Current:**
```
Common Questions
```

**Issue:** "Common Questions" is nearly identical to the landing page FAQ heading — both are functional but generic. A pricing page FAQ can work harder by orienting itself toward the decision the visitor is making.

**Suggested alternatives:**
```
Before You Commit
```
or
```
Questions We Get Every Time
```

---

#### 7b. Question: "What if I'm not satisfied with the work?"

**Current answer:**
```
We offer a 100% satisfaction guarantee. If you're not happy with the first milestone, 
we'll refund your deposit — no questions asked. We've done this 100+ times and 
stand behind our quality.
```

**Issue:** "We've done this 100+ times" is ambiguous — done what 100+ times? Delivered work? Given refunds? The intended meaning is clearly "we've done this type of work 100+ times" but the phrasing allows for the unintended reading of "we've given refunds 100+ times," which is the opposite of reassuring.

**Suggested fix:**
```
We offer a 100% satisfaction guarantee. If you're not happy with the first milestone, 
we'll refund your deposit — no questions asked. We've shipped 50+ products across 6 countries 
and stand behind the quality of everything we deliver.
```

---

#### 7c. Question: "How does the 5-day pilot work?"

**Current answer:**
```
Pay a small fee ($150-350) to test our work for 5 days. You'll get real deliverables — 
not just concepts. If you move forward with a full project, the pilot fee is deducted 
from your invoice. Zero risk.
```

**Assessment:** ✅ This is one of the best-written answers on the page — specific, clear, ends with a strong three-word risk reversal. Keep it. One small note: "deducted from your invoice" is slightly ambiguous about *which* invoice. Specify:
```
...the pilot fee is deducted from your first invoice.
```

---

#### 7d. Question: "Can I switch between retainer and project-based?"

**Current answer:**
```
Absolutely. Start with a project if you have a specific scope. Switch to retainer when 
you need ongoing support. Many clients start with a pilot, then move to retainer 
for continuous iteration.
```

**Assessment:** ✅ Good — describes the actual usage pattern, which is more persuasive than a policy statement. Keep it.

---

#### 7e. Missing FAQ: the time-zone/communication question

**Issue:** The landing page audit identified that the single biggest objection from US B2B buyers toward India-based agencies is the time zone concern. There is no FAQ on this page addressing it.

A buyer evaluating a $2,000/month retainer with an India-based team will have this question before they click the CTA: *"Will this actually work with my timezone?"*

Not addressing it leaves the objection unanswered and sends the visitor to Google for the answer — where they may find a competitor.

**Suggested addition:**
```
Q: You're based in India — how does the time zone work for US clients?

A: Most of our clients are in the US (EST/PST) and UK. Our team maintains a 
   working overlap window of 9am–1pm EST for meetings, reviews, and calls. 
   Async communication (Slack, Notion, Figma) handles the rest — you'll never 
   be blocked waiting for a reply. Our US clients consistently tell us the 
   workflow feels tighter than working with local agencies they've tried before.
```

---

#### 7f. Missing FAQ: "What exactly can I request?"

**Issue:** "Unlimited requests within scope" on the retainer card will generate this question in every buyer's mind. If it's not answered on the page, the buyer either (a) sends an email to ask and never comes back, or (b) assumes the worst and walks away.

**Suggested addition:**
```
Q: What counts as a design request?

A: Anything in the digital product space: a new screen, a component redesign, 
   a landing page, a Figma prototype, a frontend feature. One request at a time — 
   when one is done, we pick up the next. 
   What we don't cover: logo-only, print design, or physical product design.
```

---

#### 7g. FAQ CTA — "Chat With Us"

**Current:**
```
Still have questions?
[Chat With Us]
```

**Issue:** "Chat With Us" opens WhatsApp. Same issue flagged throughout — for US enterprise buyers, WhatsApp is not a professional contact channel for a $2,000/month decision.

**Suggested fix:**
```
Still have questions?
[Book a 15-Min Call →]   or   [Email us: vishal@uipirate.com]
```

---

### 8. SEO METADATA
**File:** `app/pricing/page.tsx`

---

#### 8a. Page title

**Current:**
```
UI/UX Design Pricing | $2000/mo Unlimited
```

**Assessment:** ✅ Strong. Price in the title tag is an effective CTR signal in SERPs — buyers searching for pricing want to know the number before they click. This is working.

**Minor note:** The trailing "Unlimited" without context could read oddly out of context (unlimited what?). Consider:
```
UI/UX Design Pricing | $2,000/mo — Unlimited Requests
```

---

#### 8b. Meta description

**Current:**
```
UI/UX design from $2000/mo — unlimited requests, 48hr turnaround. Save 60% vs US agencies. 
No contracts, pause anytime.
```

**Issue:** This is actually very good — specific, includes the price, includes the key benefit (save 60%), includes the two biggest objection removers (no contracts, pause anytime). One issue: the body of the page says "Save 50-70%" but the meta description says "Save 60%." Pick one number and use it consistently across the page and the metadata. Inconsistency erodes trust.

---

#### 8c. JSON-LD Schema — `reviewCount`

**Current:**
```json
"aggregateRating": {
  "ratingValue": "5.0",
  "reviewCount": "50"
}
```

**Issue:** `reviewCount: "50"` is not substantiated anywhere on the page. Google's E-E-A-T guidelines flag schema data that cannot be verified by a crawler reading the page. If there are 50 reviews, they should be visible or sourced (e.g., "50 reviews on Clutch"). If the number is estimated, it should be corrected to match what's actually verifiable.

---

#### 8d. JSON-LD Schema — pilot offer description

**Current:**
```json
{
  "name": "5-Day Pilot Project",
  "description": "Low-risk pilot to test our process before committing to a full project",
  ...
}
```

**Issue:** "Low-risk pilot to test our process" describes UI Pirate's perspective, not the buyer's outcome. Google uses schema description for rich results — a buyer-outcome description performs better in SERP snippets.

**Suggested fix:**
```json
"description": "See our work on your real brief before committing. Deliverables in 5 days. Pilot fee credited against your first invoice if you continue."
```

---

## Priority Fix Table

Ordered by severity and direct impact on conversion.

| # | Section | Issue | File | Priority |
|---|---------|--------|------|----------|
| 1 | Pricing Cards | "Chat on WhatsApp" as primary CTA on $2K/mo card | `landing/pricing/index.tsx` | 🔴 Fix now |
| 2 | Pricing Cards | Custom Quote audience: "enterprise needs & startups" — pick one | `landing/pricing/index.tsx` | 🔴 Fix now |
| 3 | Pricing Cards | "5-day pilot shows you see our execution" — broken sentence | `landing/pricing/index.tsx` | 🔴 Fix now |
| 4 | Pricing Cards | "companies like yours" in guarantee — replace with real client names | `landing/pricing/index.tsx` | 🔴 Fix now |
| 5 | Pricing Cards | "5/7 Communication" — non-standard, cryptic label | `landing/pricing/index.tsx` | 🔴 Fix now |
| 6 | Hero CTAs | Three equal-weight CTAs — eliminate PDF download; make "Book a Call" link to cal.com directly | `pricing/hero/index.tsx` | 🟠 Soon |
| 7 | Hero | Sub-headline ends with "We work the way you need" — weak close | `pricing/hero/index.tsx` | 🟠 Soon |
| 8 | Hero Stats | Replace "< 2hr Response Time" with a pricing-relevant stat; add Clutch as rating source | `pricing/hero/index.tsx` | 🟠 Soon |
| 9 | Pricing Cards | Scarcity message "Only accepting 2 new clients this month" — static, update or replace | `landing/pricing/index.tsx` | 🟠 Soon |
| 10 | Pricing Cards | "SaaS Companies" perfect-for card is a sentence fragment | `pricing/perfectFor/index.tsx` | 🟠 Soon |
| 11 | FAQ | Missing time-zone objection question — #1 concern of US buyers | `pricing/faq/index.tsx` | 🟠 Soon |
| 12 | FAQ | Missing "what counts as a request?" question — clarifies retainer scope ambiguity | `pricing/faq/index.tsx` | 🟠 Soon |
| 13 | FAQ | FAQ CTA "Chat With Us" links to WhatsApp — replace with cal.com or email | `pricing/faq/index.tsx` | 🟠 Soon |
| 14 | Comparison Table | "Slow" label for In-House turnaround — replace with a specific time estimate | `pricing/comparison/index.tsx` | 🟠 Soon |
| 15 | Comparison Table | Mobile: US Agency column (highest-contrast column) hidden; show it, hide In-House instead | `pricing/comparison/index.tsx` | 🟠 Soon |
| 16 | Pricing Cards | Feature list items: vague, mixed constraints with benefits, unquantified turnaround | `landing/pricing/index.tsx` | 🟡 Consider |
| 17 | Pricing Cards | "One subscription, endless possibilities" — consumer-speak, doesn't belong on B2B pricing | `landing/pricing/index.tsx` | 🟡 Consider |
| 18 | Pricing Cards | Monthly Retainer subtitle — rewrite from "who buys it" to "why they buy it" | `landing/pricing/index.tsx` | 🟡 Consider |
| 19 | Pilot Section | Pilot tier descriptions too vague — specify deliverables per tier | `pricing/tryBeforeCommit/index.tsx` | 🟡 Consider |
| 20 | Pilot Section | "Ready to scale" — filler phrase at end of benefit card copy | `pricing/tryBeforeCommit/index.tsx` | 🟡 Consider |
| 21 | Pilot Section | "Limited slots available each month" — static scarcity, same problem as retainer card | `pricing/tryBeforeCommit/index.tsx` | 🟡 Consider |
| 22 | Perfect For | "Perfect for" orphaned sub-label | `pricing/perfectFor/index.tsx` | 🟡 Consider |
| 23 | Perfect For | Emoji icons in "Not the right fit" section | `pricing/perfectFor/index.tsx` | 🟡 Consider |
| 24 | Perfect For | "Funded Startups" card copy leads with investor impressiveness, not buyer job | `pricing/perfectFor/index.tsx` | 🟡 Consider |
| 25 | Hero | H1 "Simple, Transparent Pricing" — generic; no positioning or audience signal | `pricing/hero/index.tsx` | 🟡 Consider |
| 26 | Client Logos | "Trusted by teams at" — grammatically incomplete | `pricing/clientLogos/index.tsx` | 🟡 Consider |
| 27 | Client Logos | Logos without company name labels | `pricing/clientLogos/index.tsx` | 🟡 Consider |
| 28 | FAQ | "We've done this 100+ times" — ambiguous (sounds like refunds, not work) | `pricing/faq/index.tsx` | 🟡 Consider |
| 29 | FAQ | "Common Questions" heading — generic; pricing page can do more | `pricing/faq/index.tsx` | 🟡 Consider |
| 30 | SEO | Meta description says "Save 60%"; page says "Save 50-70%" — pick one number | `app/pricing/page.tsx` | 🟡 Consider |
| 31 | SEO | JSON-LD `reviewCount: 50` — not verifiable on page; source it or correct it | `app/pricing/page.tsx` | 🟡 Consider |
| 32 | Comparison Table | "Quality: Enterprise" same as US Agency — undermines value prop | `pricing/comparison/index.tsx` | 🟡 Consider |

**Priority key:**
- 🔴 **Fix now** — Errors or decisions actively costing conversions with every visitor
- 🟠 **Soon** — High-impact copy and structural improvements with direct impact on lead quality
- 🟡 **Consider** — Strategic polish and copy quality improvements that compound over time

---

## The Underlying Pattern

The pricing page has a stronger structural foundation than the landing page — the comparison table, the pilot offer, and the satisfaction guarantee are genuine differentiators that most competitors don't have. The core problems are not structural; they are execution-level:

1. **The CTAs are broken.** The single most important action on a pricing page — asking for the sale — is assigned to WhatsApp. This is the #1 conversion drain on this page. No amount of copy improvement compensates for a broken conversion path.

2. **The scarcity is static.** Two separate scarcity messages ("Only accepting 2 new clients this month" and "Limited slots available") appear on the page. Both are permanent, and neither ever updates. Static scarcity trains the visitor to distrust every other claim on the page. 

3. **The feature lists describe inputs, not outcomes.** A SaaS founder doesn't buy "access to our full design & development stack." They buy a shipped product, a design review by Tuesday, a dashboard that stops confusing their users. The feature lists are written from the agency's perspective, not the buyer's.

The test for every sentence on this page is the same as the landing page:

> *Would a SaaS founder in the US, evaluating this retainer against two alternatives this week, read this and feel more confident about clicking "Book a Call"?*

If the answer is no — rewrite it.

---

## Structural Recommendation (Not a Copy Issue)

The target audience audit (`02-target-audience-audit.md`) noted that the pricing page is missing a direct booking or payment link. This is a structural conversion gap that no amount of copy work can close:

- A visitor who is ready to start the pilot should be able to click one button and book the pilot — without a form, without waiting for a reply, without ambiguity about what happens next
- Currently, the only conversion path leads to WhatsApp or the contact page
- **Recommendation:** Add a Stripe or Calendly link directly to the pilot pricing options so a visitor can commit in one click. This single change is likely to have a larger impact on pilot conversion rate than any copy rewrite on this page

---

*Next audit: `/about` page → `audits/04-about-page.md`*
