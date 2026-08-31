import re

# Update checklist
with open('audits/01-landing-page-checklist.md', 'r') as f:
    text = f.read()

text = text.replace('## 9. STATS / ABOUT CARDS (❌ Most sub-labels still wrong — 🟠 Soon)', '## 9. STATS / ABOUT CARDS (⚠️ Pending for now)')
# If they exist in Priority Summary, I should maybe update their status there too, or just leave them since they are not done. Let's change the status in the table to "Pending for now"
text = text.replace('| 9a | 9+ Years | `From MVPs to complex dashboards, shipped across 6 countries` (L11) | Belongs to the 6 Locations card | ❌ Not done |',
                    '| 9a | 9+ Years | `From MVPs to complex dashboards, shipped across 6 countries` (L11) | Belongs to the 6 Locations card | ⚠️ Pending for now |')
text = text.replace('| 9c | $150M+ | `SaaS, EdTech, FinTech, HealthTech, LegalTech, Creator Economy, and more` (L31) | Lists industries, not what "$150M+ Made by our clients" actually means | ❌ Not done |',
                    '| 9c | $150M+ | `SaaS, EdTech, FinTech, HealthTech, LegalTech, Creator Economy, and more` (L31) | Lists industries, not what "$150M+ Made by our clients" actually means | ⚠️ Pending for now |')
text = text.replace('| 9d | 6 Locations | `Built for scale, speed, and seamless handoff to developers` (L40) | Describes product quality, not geography | ❌ Not done |',
                    '| 9d | 6 Locations | `Built for scale, speed, and seamless handoff to developers` (L40) | Describes product quality, not geography | ⚠️ Pending for now |')

with open('audits/01-landing-page-checklist.md', 'w') as f:
    f.write(text)

# Update audit
with open('audits/01-landing-page.md', 'r') as f:
    text2 = f.read()

text2 = text2.replace('**Status:** ⚠️ **Not fixed from v1.** "Shipped across 6 countries" belongs to the **6 Locations** card, not the **Years of Experience** card.',
                      '**Status:** ⚠️ **Pending for now.** (Section skipped per user request, will address later).')
text2 = text2.replace('**Status:** ⚠️ **Not fixed from v1.** The core problem remains: "Made by our clients" is undefined. Made how? Revenue? Funding raised? GMV? The sub-label still lists industries instead of explaining what the number means.',
                      '**Status:** ⚠️ **Pending for now.** (Section skipped per user request, will address later).')
text2 = text2.replace('**Status:** ⚠️ **Not fixed from v1.** This sub-label describes product quality — completely unrelated to geographic reach. The stat is "6 locations" and the copy should name those locations.',
                      '**Status:** ⚠️ **Pending for now.** (Section skipped per user request, will address later).')

text2 = text2.replace('| 19 | Stats | Fix "9+ Years of Experience" sub-label — cross-references wrong card `[v1]` | `about/aboutCard.tsx` | 🟡 Consider |',
                      '| 19 | Stats | Fix "9+ Years of Experience" sub-label — cross-references wrong card `[v1]` | `about/aboutCard.tsx` | ⚠️ Pending for now |')
text2 = text2.replace('| 20 | Stats | Clarify "$150M+ Made by clients" — specify what "made" means `[v1]` | `about/aboutCard.tsx` | 🟡 Consider |',
                      '| 20 | Stats | Clarify "$150M+ Made by clients" — specify what "made" means `[v1]` | `about/aboutCard.tsx` | ⚠️ Pending for now |')
text2 = text2.replace('| 21 | Stats | Fix "6 Client Locations" sub-label — list the actual locations `[v1]` | `about/aboutCard.tsx` | 🟡 Consider |',
                      '| 21 | Stats | Fix "6 Client Locations" sub-label — list the actual locations `[v1]` | `about/aboutCard.tsx` | ⚠️ Pending for now |')

with open('audits/01-landing-page.md', 'w') as f:
    f.write(text2)

