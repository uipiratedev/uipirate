import re

with open('audits/01-landing-page-checklist.md', 'r') as f:
    text = f.read()

# Update Section 11
text = text.replace('## 11. PRICING SECTION (❌ All items still open — 🔴–🟡)', '## 11. PRICING SECTION (✅ Section complete)')
text = text.replace('| 11a | Section heading "Pricing That Makes Sense" — replace with outcome-focused heading | ❌ Not done | 🟠 Soon |',
                    '| 11a | Section heading "Pricing That Makes Sense" — replace with outcome-focused heading | ✅ Done | 🟠 Soon |')
text = text.replace('| 11b | Monthly Retainer subtitle — lead with the pain, not the feature | ❌ Not done | 🟠 Soon |',
                    '| 11b | Monthly Retainer subtitle — lead with the pain, not the feature | ✅ Done | 🟠 Soon |')
text = text.replace('| 11c | 5-Day Pilot — fix broken sentence "shows you see our execution" | ❌ Not done | 🔴 Fix now |',
                    '| 11c | 5-Day Pilot — fix broken sentence "shows you see our execution" | ✅ Done | 🔴 Fix now |')
text = text.replace('| 11d | Scarcity message "Only accepting 2 new clients this month" — make real or replace | ❌ Not done | 🟠 Soon |',
                    '| 11d | Scarcity message "Only accepting 2 new clients this month" — make real or replace | ✅ Done | 🟠 Soon |')
text = text.replace('| 11e | Custom Quote audience — "enterprise needs & startups" — pick one specific audience | ❌ Not done | 🟠 Soon |',
                    '| 11e | Custom Quote audience — "enterprise needs & startups" — pick one specific audience | ✅ Kept as-is (per user request) | 🟠 Soon |')
text = text.replace('| 11f | Satisfaction Guarantee — replace "companies like yours" with actual client names | ❌ Not done | 🟡 Consider |',
                    '| 11f | Satisfaction Guarantee — replace "companies like yours" with actual client names | ✅ Done | 🟡 Consider |')

# Remove from Priority Summary
text = text.replace('| `pricing/index.tsx` | "shows you see our execution" — broken sentence |\n', '')

with open('audits/01-landing-page-checklist.md', 'w') as f:
    f.write(text)


with open('audits/01-landing-page.md', 'r') as f:
    text2 = f.read()

# I won't do deep replace in the text body because the pricing section has a ton of them and it's also in 03-pricing-page.md.
# I'll just change the main priority table at the end of 01-landing-page.md if any.
# Let's check if there are any pricing items in the priority table of 01-landing-page.md that we fixed.
text2 = text2.replace('| 11 | Pricing | "shows you see our execution" — broken sentence | `pricing/index.tsx` L66 | 🔴 Fix now |',
                      '| 11 | Pricing | "shows you see our execution" — broken sentence | `pricing/index.tsx` L66 | ✅ Done |')
text2 = text2.replace('| 12 | Pricing | "Pricing That Makes Sense" H2 — still generic | `pricing/index.tsx` L89 | 🟠 Soon |',
                      '| 12 | Pricing | "Pricing That Makes Sense" H2 — still generic | `pricing/index.tsx` L89 | ✅ Done |')
text2 = text2.replace('| 13 | Pricing | Monthly Retainer subtitle — pain, not feature | `pricing/index.tsx` L119 | 🟠 Soon |',
                      '| 13 | Pricing | Monthly Retainer subtitle — pain, not feature | `pricing/index.tsx` L119 | ✅ Done |')
text2 = text2.replace('| 14 | Pricing | Scarcity: "Only accepting 2 new clients this month" | `pricing/index.tsx` L165 | 🟠 Soon |',
                      '| 14 | Pricing | Scarcity: "Only accepting 2 new clients this month" | `pricing/index.tsx` L165 | ✅ Done |')
text2 = text2.replace('| 15 | Pricing | Custom Quote subtitle — "enterprise needs & startups" | `pricing/index.tsx` L212 | 🟠 Soon |',
                      '| 15 | Pricing | Custom Quote subtitle — "enterprise needs & startups" | `pricing/index.tsx` L212 | ✅ Kept |')
text2 = text2.replace('| 29 | Pricing | Fix remaining pricing section copy issues (see `03-pricing-page.md`) | `pricing/index.tsx` | 🟡 Consider | — |',
                      '| 29 | Pricing | Fix remaining pricing section copy issues (see `03-pricing-page.md`) | `pricing/index.tsx` | ✅ Done | — |')

with open('audits/01-landing-page.md', 'w') as f:
    f.write(text2)

