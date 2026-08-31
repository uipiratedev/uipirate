import re

with open('audits/01-landing-page-checklist.md', 'r') as f:
    text = f.read()

# Update Section 14
text = text.replace('## 14. FAQs (❌ All items still open — 🟠 Soon)', '## 14. FAQs (✅ Section complete)')
text = text.replace('| 14a | Replace first 4 questions with buyer-blocker questions (see audit NC2 for exact text) | ❌ Not done | 🟠 Soon |',
                    '| 14a | Replace first 4 questions with buyer-blocker questions (see audit NC2 for exact text) | ✅ Done | 🟠 Soon |')
text = text.replace('| 14b | Remove 📍 emoji labels in answers, replace with bold text | ❌ Not done | 🟠 Soon |',
                    '| 14b | Remove 📍 emoji labels in answers, replace with bold text | ✅ Done | 🟠 Soon |')
text = text.replace('| 14c | Remove WhatsApp references in "How do we get started?" and point to email/cal.com | ❌ Not done | 🟠 Soon |',
                    '| 14c | Remove WhatsApp references in "How do we get started?" and point to email/cal.com | ✅ Done | 🟠 Soon |')


with open('audits/01-landing-page-checklist.md', 'w') as f:
    f.write(text)


with open('audits/01-landing-page.md', 'r') as f:
    text2 = f.read()

text2 = text2.replace('| 9 | FAQs | Replace first 4 questions with buyer-blocker questions (Q&A text in NC2 above) | `faqs/accordion.tsx` | 🟠 Soon | ✓ |',
                      '| 9 | FAQs | Replace first 4 questions with buyer-blocker questions (Q&A text in NC2 above) | `faqs/accordion.tsx` | ✅ Done | ✓ |')
text2 = text2.replace('| 10 | FAQs | Remove 📍 emoji labels, replace with bold text | `faqs/accordion.tsx` | 🟠 Soon | ✓ |',
                      '| 10 | FAQs | Remove 📍 emoji labels, replace with bold text | `faqs/accordion.tsx` | ✅ Done | ✓ |')
text2 = text2.replace('| 11 | FAQs | Remove WhatsApp reference from "How do we get started?" | `faqs/accordion.tsx` L147–150 | 🟠 Soon | ✓ |',
                      '| 11 | FAQs | Remove WhatsApp reference from "How do we get started?" | `faqs/accordion.tsx` L147–150 | ✅ Done | ✓ |')


with open('audits/01-landing-page.md', 'w') as f:
    f.write(text2)

