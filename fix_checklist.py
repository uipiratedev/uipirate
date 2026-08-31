import re

with open('audits/01-landing-page-checklist.md', 'r') as f:
    text = f.read()

# We need to reorder the sections to match:
# 5. MINI PROCESS
# 6. BEHANCE / WORKS GALLERY
# 7. FEATURED CASE STUDY
# 8. WHO WE ARE
# 9. STATS / ABOUT CARDS
# 10. SERVICES — BusinessHelp
# 11. PRICING SECTION
# 12. TEAM SECTION
# 13. TESTIMONIALS
# 14. FAQs
# 15. NEW SECTIONS — STRUCTURAL ISSUES

# Let's extract each section by its current header.
def extract_section(title_pattern):
    match = re.search(r'## \d+\. ' + title_pattern + r'(.*?)(?=\n## \d+\. |\n## Priority Summary)', text, re.DOTALL)
    return match.group(0) if match else ""

# Current titles:
# 5. SERVICES — BentoGrid
# 6. SERVICES — MiniService Heading
# 7. SERVICES — BusinessHelp / ServicesSection
# 8. WHO WE ARE
# 9. STATS / ABOUT CARDS
# 10. MINI PROCESS
# 11. BEHANCE / WORKS GALLERY
# 12. FEATURED CASE STUDY
# 13. PRICING SECTION
# 14. TEAM SECTION
# 15. TESTIMONIALS
# 16. FAQs
# 17. NEW SECTIONS

sec_bento = extract_section(r'SERVICES — BentoGrid')
sec_miniserv = extract_section(r'SERVICES — MiniService Heading')
sec_bizhelp = extract_section(r'SERVICES — BusinessHelp / ServicesSection')
sec_who = extract_section(r'WHO WE ARE')
sec_stats = extract_section(r'STATS / ABOUT CARDS')
sec_miniproc = extract_section(r'MINI PROCESS')
sec_behance = extract_section(r'BEHANCE / WORKS GALLERY')
sec_featured = extract_section(r'FEATURED CASE STUDY')
sec_pricing = extract_section(r'PRICING SECTION')
sec_team = extract_section(r'TEAM SECTION')
sec_test = extract_section(r'TESTIMONIALS')
sec_faqs = extract_section(r'FAQs')
sec_new = extract_section(r'NEW SECTIONS — STRUCTURAL ISSUES')

# Combine them in the new order
ordered_sections = [
    sec_miniproc,  # New 7? Wait, let's look at the user's requested numbering.
    # User says "How It Works section, that is, the fifth section"
    # Actually, they said BentoGrid is section 5 and MiniService is section 6 earlier? No, they said "don't miss out the mini processes section... make the changes to both the How It Works section, that is, the fifth section"
    # Wait, earlier I made Fit Check = 4. 
    # If BentoGrid/MiniService was combined or kept as 5/6, then MiniProcess would be 7. 
    # But user specifically called MiniProcess the "fifth section".
    # That means:
    # 1. Hero
    # 2. Marquee
    # 3. Fit Check
    # 4. Design & Dev (BentoGrid + MiniService)
    # 5. MiniProcess
    # 6. Behance
    # 7. Featured Case Study
    # This aligns perfectly!
]

# Let's combine BentoGrid and MiniService into section 4.
sec_bento = sec_bento.replace("## 5. SERVICES — BentoGrid (✅ Section complete)", "## 4a. SERVICES — BentoGrid")
sec_miniserv = sec_miniserv.replace("## 6. SERVICES — MiniService Heading (✅ Section complete)", "## 4b. SERVICES — MiniService Heading")
combined_4 = "## 4. DESIGN & DEVELOPMENT (✅ Section complete)\n\n" + sec_bento + "\n\n" + sec_miniserv

ordered = [
    combined_4,
    sec_miniproc,
    sec_behance,
    sec_featured,
    sec_who,
    sec_stats,
    sec_bizhelp,
    sec_pricing,
    sec_team,
    sec_test,
    sec_faqs,
    sec_new
]

# Now we need to update the section numbers in each block.
import re
new_blocks = []
current_num = 4
for block in ordered:
    # Replace the main header number
    # block could be combined_4 which has 4a and 4b, we skip renumbering the main if it's already 4.
    if current_num == 4:
        new_blocks.append(block)
    else:
        # Replace the first heading number
        block = re.sub(r'## \d+\.', f'## {current_num}.', block, count=1)
        # Also replace the item prefixes in the tables, e.g., | 10a | -> | 5a |
        old_num_match = re.search(r'\| (\d+)[a-z] \|', block)
        if old_num_match:
            old_num = old_num_match.group(1)
            block = re.sub(r'\| ' + old_num + r'([a-z]) \|', rf'| {current_num}\1 |', block)
            # Replace references in "Fixes"
            block = re.sub(r'- ' + old_num + r'([a-z]) ', rf'- {current_num}\1 ', block)
        new_blocks.append(block)
    current_num += 1

# Join everything
new_body = "\n\n---\n\n".join(new_blocks)

# Replace in the original text
start_idx = text.find("## 5. SERVICES — BentoGrid")
end_idx = text.find("## Priority Summary")
final_text = text[:start_idx] + new_body + "\n\n" + text[end_idx:]

# Additionally, the user wants me to mark MiniProcess (now Section 5) as done and Behance (Section 6) as "Needs review".
# MiniProcess updates:
final_text = final_text.replace('| 5b | Step descriptions: joined from `data/process.ts` via `.join(" ")` — review rendered text to confirm joined sentences read naturally, not like two descriptions stapled together | ⚠️ Needs check |', 
'| 5b | Step descriptions: given bespoke 1-sentence summaries instead of concatenated text | ✅ Done |')
final_text = final_text.replace('| 5c | "See the full process →" link goes to `/process` — confirm this page exists with real content before this link goes live (a 404 undermines the section\'s trust signal) | ⚠️ Needs check |',
'| 5c | "See the full process →" link goes to `/process` — confirm this page exists with real content before this link goes live | ⚠️ Needs check |')
final_text = final_text.replace('## 5. MINI PROCESS (⚠️ Needs check — 🟠 Soon)', '## 5. MINI PROCESS (✅ Section complete)')

# Behance updates:
final_text = final_text.replace('## 6. BEHANCE / WORKS GALLERY (⚠️ Needs check — 🟠 Soon)', '## 6. BEHANCE / WORKS GALLERY (⚠️ Needs to be reviewed before working on them)')
final_text = final_text.replace('| 6a | Portfolio links — still pointing to external Behance URLs (conversion leak — visitor leaves site, session lost), or updated to `/case-studies/[slug]`? | ⚠️ Needs check |',
'| 6a | Portfolio links — still pointing to external Behance URLs | ⚠️ Needs to be reviewed before working on them |')

with open('audits/01-landing-page-checklist.md', 'w') as f:
    f.write(final_text)

