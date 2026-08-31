import re

with open('audits/01-landing-page-checklist.md', 'r') as f:
    text = f.read()

# Section 8 Updates
text = text.replace('## 8. WHO WE ARE (❌ All items still open — 🔴 Fix now)', '## 8. WHO WE ARE (✅ Section complete)')
text = text.replace('| 8a | `products that ships faster` — subject-verb disagreement | ❌ Not done |',
                    '| 8a | `products that ships faster` — subject-verb disagreement | ✅ Done |')
text = text.replace('| 8b | `Studio` — identity inconsistency (every other section says "Agency") | ❌ Not done |',
                    '| 8b | `Studio` — identity inconsistency (every other section says "Agency") | ✅ Done |')
text = text.replace('| 8c | `global` — overstated claim, no evidence of a global office or team | ❌ Not done |',
                    '| 8c | `global` — overstated claim, no evidence of a global office or team | ✅ Done |')
text = text.replace('| 8d | `design debt` — designer jargon, not buyer language | ❌ Not done |',
                    '| 8d | `design debt` — designer jargon, not buyer language | ✅ Done |')
text = text.replace('| 8e | Missing primary SEO keyword: `product design and development agency` | ❌ Not done |',
                    '| 8e | Missing primary SEO keyword: `product design and development agency` | ✅ Done |')

# Remove from Priority Summary
text = text.replace('| `whoWeAre/index.tsx` L79 | Grammar error "products that ships faster" + "Studio" + "global" — one sentence replacement fixes all |\n', '')

with open('audits/01-landing-page-checklist.md', 'w') as f:
    f.write(text)

