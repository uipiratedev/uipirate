import re

with open('audits/01-landing-page-checklist.md', 'r') as f:
    text = f.read()

# Update Section 13
text = text.replace('## 13. TESTIMONIALS (❌ Most items still open — 🟠 Soon)', '## 13. TESTIMONIALS (✅ UI Done, Data Pending)')
text = text.replace('| 13a | No section heading above testimonial cards — add "What Clients Say" H2 | ❌ Not done | 🟠 Soon |',
                    '| 13a | No section heading above testimonial cards — add "What Clients Say" H2 | ✅ Done | 🟠 Soon |')
text = text.replace('| 13b | No star ratings on testimonial cards (stars only appear in hero tooltip) — add ★★★★★ to each card | ❌ Not done | 🟠 Soon |',
                    '| 13b | No star ratings on testimonial cards (stars only appear in hero tooltip) — add ★★★★★ to each card | ✅ Done | 🟠 Soon |')
text = text.replace('| 13c | Verify `occupation` and `company` fields in `testimonials.json` for Eden Hazani, Priyanka Padhye, Rohit Kumar Jha — hero tooltip shows correct data; confirm source JSON also matches | ⚠️ Needs check | 🟠 Soon |',
                    '| 13c | Verify `occupation` and `company` fields in `testimonials.json` for Eden Hazani, Priyanka Padhye, Rohit Kumar Jha — hero tooltip shows correct data; confirm source JSON also matches | ✅ Done (verified) | 🟠 Soon |')
text = text.replace('| 13d | Kyle Drucker (YouTuber / "BBallExplained") testimonial — inconsistent with enterprise B2B positioning | ❌ Not done | 🟡 Consider |',
                    '| 13d | Kyle Drucker (YouTuber / "BBallExplained") testimonial — inconsistent with enterprise B2B positioning | ⚠️ Pending for now | 🟡 Consider |')
text = text.replace('| 13e | 3 generic one-liner testimonials with no P-S-O structure — request expanded versions or deprioritize in grid | ❌ Not done | 🟡 Consider |',
                    '| 13e | 3 generic one-liner testimonials with no P-S-O structure — request expanded versions or deprioritize in grid | ⚠️ Pending for now | 🟡 Consider |')

# Remove from Priority Summary
text = text.replace('| `testimonialCards.tsx` | Add "What Clients Say" H2 above testimonial grid |\n', '')
text = text.replace('| `testimonialCards.tsx` | Add ★★★★★ star ratings to each card |\n', '')

with open('audits/01-landing-page-checklist.md', 'w') as f:
    f.write(text)


with open('audits/01-landing-page.md', 'r') as f:
    text2 = f.read()

text2 = text2.replace('| 21 | Testimonials | Add "What Clients Say" H2 above grid | `testimonials/testimonialCards.tsx` | 🟠 Soon |',
                      '| 21 | Testimonials | Add "What Clients Say" H2 above grid | `testimonials/testimonialCards.tsx` | ✅ Done |')
text2 = text2.replace('| 22 | Testimonials | Add ★★★★★ star ratings to cards | `testimonials/testimonialCards.tsx` | 🟠 Soon |',
                      '| 22 | Testimonials | Add ★★★★★ star ratings to cards | `testimonials/testimonialCards.tsx` | ✅ Done |')
text2 = text2.replace('| 23 | Testimonials | Verify testimonials.json occupation/company fields | `data/testimonials.json` | 🟠 Soon |',
                      '| 23 | Testimonials | Verify testimonials.json occupation/company fields | `data/testimonials.json` | ✅ Done |')
text2 = text2.replace('| 24 | Testimonials | Remove or reposition Kyle Drucker (YouTuber) testimonial | `data/testimonials.json` | 🟡 Consider |',
                      '| 24 | Testimonials | Remove or reposition Kyle Drucker (YouTuber) testimonial | `data/testimonials.json` | ⚠️ Pending for now |')

with open('audits/01-landing-page.md', 'w') as f:
    f.write(text2)

