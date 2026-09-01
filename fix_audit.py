import re

with open('audits/01-landing-page.md', 'r') as f:
    text = f.read()

# Current titles in 01-landing-page.md
# 5. MINI PROCESS
# 6. BEHANCE / WORKS GALLERY
# 7. FEATURED CASE STUDY
# 8. WHO WE ARE
# 9. STATS / ABOUT CARDS
# 10. SERVICES DETAIL SECTION (BusinessHelp / ServicesSection)
# 11. PRICING SECTION
# 12. TEAM SECTION
# 13. TESTIMONIALS
# 14. FAQs

# Oh wait, let's check the current numbers in `01-landing-page.md`.
# It seems they were ALREADY in the correct visual order in 01-landing-page.md!
# Let me double check if 01-landing-page.md had them right all along.
