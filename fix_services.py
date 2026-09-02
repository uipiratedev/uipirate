import re

with open('audits/01-landing-page-checklist.md', 'r') as f:
    text = f.read()

# Update Section 10
text = text.replace('## 10. SERVICES — BusinessHelp / ServicesSection (❌ All items still open)', '## 10. SERVICES — BusinessHelp / ServicesSection (✅ Section complete)')
text = text.replace('| 10a | Service list — wrong casing | `Saas & AI Development` (L64) | ❌ Not done | 🔴 Fix now |',
                    '| 10a | Service list — wrong casing | `Saas & AI Development` (L64) | ✅ Done | 🔴 Fix now |')
text = text.replace('| 10b | Orange banner header — wrong casing + filler phrase | `AI Apps, Saas, Websites & More` (L152) | ❌ Not done | 🔴 Fix now |',
                    '| 10b | Orange banner header — wrong casing + filler phrase | `AI Apps, Saas, Websites & More` (L152) | ✅ Done | 🔴 Fix now |')
text = text.replace('| 10c | Black card heading — generic agency phrase | `One-stop shop for all your essentials` (L191) | ❌ Not done | 🟡 Consider |',
                    '| 10c | Black card heading — generic agency phrase | `One-stop shop for all your essentials` (L191) | ✅ Done | 🟡 Consider |')
text = text.replace('| 10d | Bottom CTA — vague, no action described | `Let\'s Talk` (L228) | ❌ Not done | 🟡 Consider |',
                    '| 10d | Bottom CTA — vague, no action described | `Let\'s Talk` (L228) | ✅ Done | 🟡 Consider |')

# Remove from Priority Summary
text = text.replace('| `servicesSection.tsx` L64 | `Saas & AI Development` → `SaaS & AI Development` |\n', '')
text = text.replace('| `servicesSection.tsx` L152 | `AI Apps, Saas, Websites & More` → `AI Apps, SaaS & Business Websites` |\n', '')
text = text.replace('| `servicesSection.tsx` L191 | Replace "One-stop shop for all your essentials" heading |\n', '')
text = text.replace('| `servicesSection.tsx` L228 | Replace "Let\'s Talk" CTA with "Tell Us What You Need →" |\n', '')

with open('audits/01-landing-page-checklist.md', 'w') as f:
    f.write(text)


with open('audits/01-landing-page.md', 'r') as f:
    text2 = f.read()

# Update table items
text2 = text2.replace('| 7 | Services | "Saas" → "SaaS" in service list | `servicesSection.tsx` L64 | 🔴 Fix now |',
                      '| 7 | Services | "Saas" → "SaaS" in service list | `servicesSection.tsx` L64 | ✅ Done |')
text2 = text2.replace('| 8 | Services | "Saas" → "SaaS" in orange banner | `servicesSection.tsx` L152 | 🔴 Fix now |',
                      '| 8 | Services | "Saas" → "SaaS" in orange banner | `servicesSection.tsx` L152 | ✅ Done |')
text2 = text2.replace('| 9 | Services | "One-stop shop..." heading is generic agency phrase | `servicesSection.tsx` L191 | 🟡 Consider |',
                      '| 9 | Services | "One-stop shop..." heading is generic agency phrase | `servicesSection.tsx` L191 | ✅ Done |')
text2 = text2.replace('| 10 | Services | "Let\'s Talk" CTA is vague — use "Tell Us What You Need" | `servicesSection.tsx` L228 | 🟡 Consider |',
                      '| 10 | Services | "Let\'s Talk" CTA is vague — use "Tell Us What You Need" | `servicesSection.tsx` L228 | ✅ Done |')

with open('audits/01-landing-page.md', 'w') as f:
    f.write(text2)

