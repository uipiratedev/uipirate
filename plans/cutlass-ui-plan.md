# Cutlass UI — Component Library Plan

**Agency:** UIPirate.com
**Status:** Planning (2026-10-11)
**Owner:** uipiratedev@gmail.com

---

## 1. Name

**Recommended: `Cutlass`** — the short, curved sword pirates actually carried. Sharp, fast, close-quarters. Reads well as a product name (`cutlass-ui`, `@uipirate/cutlass`), works as a verb ("cutlass it"), and the metaphor fits a component library: a single tool, kept sharp, used daily.

**Shortlist (alternatives):**

| Name       | Why it works                                 | Why it might not                  |
|------------|-----------------------------------------------|-----------------------------------|
| **Cutlass**  | Sharp, short, pirate-authentic, available    | Weapon connotation                |
| **Corsair**  | Elegant, implies speed, premium feel         | Already a hardware brand          |
| **Rigging**  | The ropes holding a ship together — great UI metaphor | Less punchy as a product name |
| **Spyglass** | Focus, clarity, UI-adjacent                   | Longer, more utility-sounding     |
| **Plunder**  | Bold, memorable, on-brand                     | Aggressive tone                   |
| **Doubloon** | Treasure, value, playful                      | Harder to say/type                |

Decision: ship as **Cutlass UI**, published as `@uipirate/cutlass-*`, domain `cutlass.uipirate.com` (docs).

---

## 2. Vision

A **beautiful, motion-first, framework-agnostic** component library — Tailwind plugin for the visual layer, small vanilla-TS controllers for the interactive layer, Motion One as the default animation engine, GSAP as an opt-in layer for delight surfaces.

Inspired by Ripple UI's class-based API, but built clean-room so UIPirate owns the design language, the motion grammar, and the roadmap.

**Three promises:**
1. **Drop in anywhere** — Angular, React, plain HTML, email previews, Astro, Storybook. No framework runtime.
2. **Beautiful by default** — considered tokens, elevation, focus states, dark mode. Not just functional.
3. **Motion as a first-class citizen** — every interactive component has designed enter/exit, respects reduced-motion, and uses a shared easing/duration vocabulary.

---

## 3. Positioning

| Library          | What it is                           | What Cutlass does differently              |
|------------------|---------------------------------------|---------------------------------------------|
| Ripple UI        | Tailwind plugin, class-based, flat    | Add real motion + a11y baseline             |
| DaisyUI          | Tailwind plugin, broad, utilitarian   | Narrower, more opinionated, more polish     |
| shadcn/ui        | Copy-paste React components           | Framework-agnostic, class-based             |
| Flowbite         | Tailwind + JS, Bootstrap-ish          | Less corporate, more design-forward         |
| Linear/Vercel UI | Internal, not public                  | Public version of that aesthetic            |

Target feel: **Linear's restraint × Arc's playfulness × Vercel's typography**.

---

## 4. Technical Foundation

- **Core:** Tailwind CSS v4 plugin registering component classes (`.cl-btn`, `.cl-card`, …). Prefix `cl-` to avoid collisions.
- **Headless:** Small vanilla-TS controllers for stateful components (`new Modal(el)`, `new Drawer(el)`), auto-init via `data-cl-*` attributes.
- **Motion:** [Motion One](https://motion.dev) as default engine (~4kb, WAAPI-based, free). Framework-agnostic, perfect fit.
- **Delight motion (opt-in):** GSAP + ScrollTrigger for landing/marketing surfaces, loaded only where needed.
- **Route transitions:** View Transitions API, with Motion One fallback.
- **Progressive enhancement:** CSS `@starting-style` + `transition-behavior: allow-discrete` where supported.
- **Icons:** separate `@uipirate/cutlass-icons` package, SVG exports as TS modules.
- **Docs:** Astro site at `cutlass.uipirate.com`, HTML source + live preview + copy button, Linear-style sidebar.

---

## 5. Design System

### 5.1 Tokens
- **Color:** 12-step scales per hue (gray, brand, accent, success, warning, danger, info). Light + dark modes tuned independently, not inverted.
- **Typography:** 8-step type scale, line-height tuned per size, letter-spacing on display sizes. Primary: Inter or Geist Sans. Mono: Geist Mono or JetBrains Mono.
- **Spacing:** 4px grid, 12-step scale.
- **Radius:** 5-step scale (sm → full), mapped by component (buttons/inputs: `md`, cards: `lg`, modals: `xl`).
- **Elevation:** 6-step shadow scale. Light mode = layered shadows (ambient + key). Dark mode = borders + subtle glows, not shadows.
- **Focus ring:** two-tone (background offset + brand ring), 2px offset, consistent across all interactive components.

### 5.2 Motion
- **Easing:** 6 named curves — `cl-emphasized`, `cl-standard`, `cl-decelerate`, `cl-accelerate`, `cl-spring-soft`, `cl-spring-snappy`.
- **Duration:** `100 / 150 / 250 / 400 / 600 / 900ms`, mapped to intent (micro / small / medium / large / page / hero).
- **Reduced motion:** `prefers-reduced-motion: reduce` disables all non-essential motion, keeps opacity-only transitions for state clarity.
- **Dark mode:** class-based (`.dark`), toggleable via JS helper + persisted to `localStorage`.

---

## 6. v1 Component Scope

**10 components, done beautifully.** No padding the catalog.

| Component  | CSS classes | Motion                                   | A11y notes                     |
|------------|-------------|-------------------------------------------|---------------------------------|
| Button     | ✓          | Press (scale), hover (lift), loading spin | ARIA pressed/disabled states    |
| Input      | ✓          | Label float, focus ring expand            | Associated label, error live    |
| Select     | ✓          | Dropdown enter/exit, option fade-in       | Combobox pattern, keyboard nav  |
| Card       | ✓          | Hover lift, optional parallax             | Semantic landmarks              |
| Modal      | TS          | Backdrop fade, dialog scale + fade        | Focus trap, Escape, scroll lock |
| Drawer     | TS          | Slide + overdrag spring                   | Focus trap, swipe to dismiss    |
| Tabs       | TS          | Indicator slide (FLIP), content crossfade | Roving tabindex, arrow keys     |
| Toast      | TS          | Stack enter from edge, swipe to dismiss   | Live region, auto-dismiss pause |
| Dropdown   | TS          | Popover enter (scale + fade), arrow       | Menu pattern, keyboard nav      |
| Tooltip    | TS          | Delay-in, instant-out, follow cursor opt  | ARIA described-by, hover intent |

**v2 adds:** Accordion, Table, Pagination, Breadcrumb, Avatar, Badge, Alert, Checkbox, Radio, Switch, Slider, Progress, Skeleton, Command Menu.

---

## 7. Repo Layout (separate repo)

```
cutlass-ui/
├── packages/
│   ├── core/            # Tailwind plugin + tokens (@uipirate/cutlass-core)
│   ├── headless/        # TS controllers (@uipirate/cutlass-headless)
│   ├── icons/           # SVG icon set (@uipirate/cutlass-icons)
│   └── motion/          # Motion presets + GSAP wrappers (@uipirate/cutlass-motion)
├── apps/
│   ├── docs/            # Astro docs site (cutlass.uipirate.com)
│   └── playground/      # Vite sandbox for component dev
├── examples/
│   ├── angular/
│   ├── react/
│   └── html/
├── .changeset/          # Versioning
└── pnpm-workspace.yaml
```

**Tooling:** pnpm workspaces, Changesets for releases, Vitest + Playwright for tests, Biome for lint/format, GitHub Actions for CI, npm (public) + GitHub Packages (backup).

---

## 8. Milestones

### M1 — Foundations (Week 1–2)
- Repo + pnpm workspace scaffold
- Token layer: colors, type, spacing, radius, elevation, motion
- Tailwind plugin skeleton registering `cl-*` classes
- Dark mode strategy wired
- Docs site shell (Astro + layout + MDX)

### M2 — Static Six (Week 3–4)
- Button, Input, Card, Badge, Alert, Avatar
- All CSS-only, no TS yet
- Docs pages with copy-paste HTML examples
- Light + dark variants shipped

### M3 — Motion Four (Week 5–7)
- Headless package scaffolding
- Modal, Drawer, Dropdown, Tooltip
- Motion One integration
- Focus trap utility, scroll lock utility
- Reduced-motion fallbacks

### M4 — Interactive Finish (Week 8–9)
- Select (combobox), Tabs, Toast
- Keyboard nav polish
- a11y audit (axe + manual)

### M5 — Launch (Week 10)
- Docs site live at cutlass.uipirate.com
- v0.1.0 published to npm
- Launch post, Twitter/X thread, Product Hunt prep
- helm Angular apps migrated to Cutlass internally (dogfood)

---

## 9. Success Criteria

- **Internal:** every helm app ([[helm-plan]]) uses only Cutlass components by end of M5. No one-off UI code.
- **External:** 500 GitHub stars in first 90 days; 50 npm installs/day by day 90.
- **Quality:** 100% of v1 components pass axe-core with zero violations; Lighthouse a11y 100 on docs site.
- **Performance:** core CSS < 15kb gzipped; headless JS < 8kb gzipped (tree-shakeable).
- **Agency:** at least 2 UIPirate client projects shipped on Cutlass by month 6.

---

## 10. Open Questions

1. **License:** MIT (max adoption) vs source-available with commercial-use clause (protects agency positioning)?
2. **Framework wrappers:** do we ship `@uipirate/cutlass-angular` and `@uipirate/cutlass-react` thin wrappers in v1, or wait for demand?
3. **Figma library:** mirror Cutlass as a Figma component kit from day one, or after v1 ships?
4. **Pricing:** free forever, or free core + paid "Pro" components (Command Menu, Data Grid, Charts) later?
5. **Branding:** does Cutlass get its own identity, or inherit UIPirate's visual language directly?

---

## 11. Next Actions

- [ ] Lock the name (Cutlass vs alternatives) — decision owner: founder
- [ ] Reserve npm scope `@uipirate` and package names
- [ ] Register `cutlass.uipirate.com` subdomain
- [ ] Create `cutlass-ui` GitHub repo (public, MIT by default — revisit in Q10)
- [ ] Draft token JSON (colors + type + spacing) — M1 blocker
- [ ] Pick primary + mono typefaces
- [ ] Design the Cutlass logo (ties into UIPirate CIP work)
