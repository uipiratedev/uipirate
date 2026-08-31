import re

with open('audits/01-landing-page.md', 'r') as f:
    text = f.read()

# Replace the specific markdown table and issues
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

# And in the Priority summary table at the end
text = text.replace('| 4 | Who We Are | "products that ships faster" — grammar error in animated large type | `whoWeAre/index.tsx` L79 | 🔴 Fix now | ✓ |',
                    '| 4 | Who We Are | "products that ships faster" — grammar error in animated large type | `whoWeAre/index.tsx` L79 | ✅ Done | ✓ |')
text = text.replace('| 5 | Who We Are | "Studio" → "agency" identity inconsistency | `whoWeAre/index.tsx` L79 | 🔴 Fix now | ✓ |',
                    '| 5 | Who We Are | "Studio" → "agency" identity inconsistency | `whoWeAre/index.tsx` L79 | ✅ Done | ✓ |')
text = text.replace('| 6 | Who We Are | "global" overclaim — no evidence of global office/team | `whoWeAre/index.tsx` L79 | 🔴 Fix now | ✓ |',
                    '| 6 | Who We Are | "global" overclaim — no evidence of global office/team | `whoWeAre/index.tsx` L79 | ✅ Done | ✓ |')
text = text.replace('| 26 | Who We Are | Add primary keyword `product design and development agency` to rewritten text | `whoWeAre/index.tsx` | 🟡 Consider | ✓ |',
                    '| 26 | Who We Are | Add primary keyword `product design and development agency` to rewritten text | `whoWeAre/index.tsx` | ✅ Done | ✓ |')

with open('audits/01-landing-page.md', 'w') as f:
    f.write(text)

