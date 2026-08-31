import re

with open('audits/01-landing-page-checklist.md', 'r') as f:
    text = f.read()

# Update Featured Case Study section
text = text.replace('## 7. FEATURED CASE STUDY (❌ Not done — 🟡 Consider)', '## 7. FEATURED CASE STUDY (✅ Section complete)')
text = text.replace('| 7a | Add client industry tag + logo to the featured case study card | ❌ Not done | `featuredCaseStudy/index.tsx` |',
                    '| 7a | Add client industry tag + logo to the featured case study card | ✅ Done | `featuredCaseStudy/index.tsx` |')

# And remove it from the Priority Summary
text = text.replace('| `featuredCaseStudy/index.tsx` | Add client industry tag + logo to the featured case study card |\n', '')

with open('audits/01-landing-page-checklist.md', 'w') as f:
    f.write(text)

