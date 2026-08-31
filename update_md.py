import re

def update_checklist():
    with open('audits/01-landing-page-checklist.md', 'r') as f:
        content = f.read()
    
    # Extract PricingPerfectFor items from Section 16
    fit_check_items = """## 4. FIT CHECK / PRICING PERFECT FOR (❌ All items still open — 🟠 Soon)

**File:** `screens/pricing/perfectFor/index.tsx`

| # | Item | Status | Priority |
|---|------|--------|----------|
| 4a | Move `PricingPerfectFor` to after Marquee | ❌ Not done | 🟠 Soon |
| 4b | "FIT CHECK" badge too casual for enterprise buyers; replace with "WHO IT'S FOR" | ❌ Not done | 🟡 Consider |
| 4c | Audience card descriptions need rewriting | ❌ Not done | 🟠 Soon |
| 4d | Emoji icons in "Not the right fit" strip (📦 🎨 ⏰); replace with clean × or dash icons | ❌ Not done | 🟠 Soon |

---

"""
    
    # Remove these items from Section 16 (now 17)
    content = content.replace('| 16a | `PricingPerfectFor` placed before Services — visitor sees audience filter before they\'ve seen what UI Pirate does. Move to after BentoGrid or MiniProcess | ❌ Not moved | 🟠 Soon |\n', '')
    content = content.replace('| 16b | `PricingPerfectFor` — "FIT CHECK" badge too casual for enterprise buyers; replace with "WHO IT\'S FOR" | ❌ Not done | 🟡 Consider |\n', '')
    content = content.replace('| 16c | `PricingPerfectFor` — Audience card descriptions need rewriting (see `01-landing-page.md` Section 3b for full copy) | ❌ Not done | 🟠 Soon |\n', '')
    content = content.replace('| 16d | `PricingPerfectFor` — Emoji icons in "Not the right fit" strip (📦 🎨 ⏰); replace with clean × or dash icons | ❌ Not done | 🟠 Soon |\n', '')
    
    # We will increment sections 4-16 by 1.
    def shift_headers(m):
        num = int(m.group(1))
        if 4 <= num <= 16:
            return f"## {num+1}."
        return m.group(0)
    content = re.sub(r'^## (\d+)\.', shift_headers, content, flags=re.MULTILINE)
    
    def shift_table_ids(m):
        num = int(m.group(1))
        if 4 <= num <= 16:
            return f"| {num+1}{m.group(2)} |"
        return m.group(0)
    content = re.sub(r'^\| (\d+)([a-z]) \|', shift_table_ids, content, flags=re.MULTILINE)
    
    def shift_fixes(m):
        num = int(m.group(1))
        if 4 <= num <= 16:
            return f"- {num+1}{m.group(2)} "
        return m.group(0)
    content = re.sub(r'^- (\d+)([a-z]) ', shift_fixes, content, flags=re.MULTILINE)
    
    # Insert Fit Check after Section 3
    parts = content.split("## 5. SERVICES — BentoGrid")
    new_content = parts[0] + fit_check_items + "## 5. SERVICES — BentoGrid" + parts[1]
    
    # Update Priority Summary item numbers for 17e/f which used to be 16e/f
    new_content = new_content.replace('17e', '17a').replace('17f', '17b')
    
    with open('audits/01-landing-page-checklist.md', 'w') as f:
        f.write(new_content)

def update_audit():
    with open('audits/01-landing-page.md', 'r') as f:
        content = f.read()
    
    # It already has PricingPerfectFor as section 3! Let's just check its structure.
    # We might not need to do heavy edits if it's already Section 3.
    # Let's just save for now.
    pass

update_checklist()
update_audit()
