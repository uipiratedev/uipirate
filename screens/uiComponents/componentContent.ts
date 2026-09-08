/**
 * Long-form, hand-written editorial content for each Component Lab entry.
 *
 * This is the SEO / grounding layer: every /componentlab/[slug] page renders
 * this copy server-side so each URL carries unique, self-contained, verifiable
 * information instead of 20 near-identical dashboard shells.
 *
 * Keep each entry original and specific to the component — no boilerplate,
 * no keyword stuffing (Bing Webmaster Guidelines #6, #11, #13, #15, #17, #18).
 */

export interface ComponentFaq {
  q: string;
  a: string;
}

export interface ComponentContent {
  /** 2-3 sentences: what it is and the core visual/interaction idea. */
  overview: string;
  /** Concrete, real-world placements where this component is the right call. */
  whenToUse: string[];
  /** How the effect is built — the actual technique, in plain language. */
  howItWorks: string;
  /** Accessibility and performance notes a developer needs before shipping. */
  accessibility: string;
  /** Questions a developer realistically asks before dropping this in. */
  faqs: ComponentFaq[];
}

export const COMPONENT_CONTENT: Record<string, ComponentContent> = {
  "isometric-revive-button": {
    overview:
      "The Isometric 3D Revive Button is a call-to-action rendered on a true 30° isometric axis, so the button face, the bevelled side walls and the cast shadow all read as a single solid object. On press it depresses along the isometric plane with a spring curve, and an amber indicator flare plus a neon underglow fire to confirm the action.",
    whenToUse: [
      "A single hero action on a landing page where the CTA needs to feel physical and expensive rather than flat",
      "Re-activation or 'revive' flows — restore account, resume subscription, wake device — where the amber flare reinforces a state change",
      "Product pages for hardware, gaming or developer tools whose brand already leans into a technical, 3D aesthetic",
    ],
    howItWorks:
      "The extrusion is pure CSS: the visible depth is a stack of layered box-shadows and a skewed pseudo-element wall rather than a real 3D transform, which keeps it crisp at every zoom level. The press uses a cubic-bezier spring on translate and shadow-height so the button appears to sink into its own base, and the underglow is a blurred, colour-matched copy of the face sitting behind it at reduced opacity.",
    accessibility:
      "Renders as a native <button> with a visible focus ring and full keyboard activation. The amber flare and underglow are decorative — the label alone communicates the action — and all motion is gated behind prefers-reduced-motion, falling back to a simple opacity change. Contrast of the label against the face meets WCAG AA in every bundled theme.",
    faqs: [
      {
        q: "Does the isometric angle break on mobile?",
        a: "No. The depth is capped in pixels rather than scaled, so on narrow screens the button keeps a shallow but still-legible extrusion instead of overflowing its container.",
      },
      {
        q: "Can I change the indicator colour away from amber?",
        a: "Yes — the theme prop swaps the flare, underglow and rim colour together (amber, cyan, violet, emerald, gold and the UI Pirate magma preset ship by default).",
      },
      {
        q: "Is the underglow expensive to render?",
        a: "It is one blurred layer with a static blur radius, so it composites on the GPU and does not repaint during the press animation.",
      },
    ],
  },

  "tactile-pill-button": {
    overview:
      "The Tactile 3D Pill Button sits in a recessed cavity slot, like a physical key dropped into a machined housing. Pressing it tilts the pill on a short spring axis, specular highlights sweep across the bevel, and a small status beacon glows to show the control is live.",
    whenToUse: [
      "Primary actions inside dark dashboards and control panels where the UI is meant to feel like hardware",
      "Toggle-style commands — arm, deploy, connect — where the glowing beacon doubles as a state indicator",
      "Any surface that already uses inset / neumorphic styling and needs a button that matches the recessed language",
    ],
    howItWorks:
      "The cavity is an inset box-shadow pair (dark top-left, light bottom-right) carved into the parent surface. The pill itself is a separate layer with its own outset shadow, and on press a small rotateX plus translateY runs on a spring easing so it reads as tilting into the slot. The beacon is a radial-gradient dot with a blurred halo that pulses on a low-frequency keyframe.",
    accessibility:
      "The control is a real <button>; the beacon state is mirrored with aria-pressed where it acts as a toggle so screen readers announce on/off. Focus is shown with an outline offset outside the cavity so it is never clipped. Tilt and pulse animation respect prefers-reduced-motion.",
    faqs: [
      {
        q: "What is the difference between this and the Elevated Underglow button?",
        a: "This one presses down into a slot; the Elevated Underglow button lifts up off the page. Use this for a hardware-panel feel and that one for a floating, glowing CTA.",
      },
      {
        q: "Can the status beacon be hidden?",
        a: "Yes, the dot is optional via the variant prop for cases where the button is a plain action rather than a stateful control.",
      },
      {
        q: "Does it work on a light background?",
        a: "The recessed effect needs some surface contrast to read; it is designed for mid-to-dark surfaces and a stealth-midnight variant is included for that.",
      },
    ],
  },

  "frosted-gel-download-button": {
    overview:
      "The Frosted Gel Download Button is a split control: an elevated ceramic pill for the primary label sits beside a frosted-glass gel tile that carries the download icon. Optical refraction rings and a volumetric blue underglow give the glass tile real depth without a background image.",
    whenToUse: [
      "Download or export actions where you want to separate the verb ('Export') from the format or trigger icon",
      "Pricing and asset pages that need a premium, Apple-adjacent glass aesthetic",
      "Places where a single button would be ambiguous and a two-part control makes the primary and secondary intent explicit",
    ],
    howItWorks:
      "The gel tile stacks a backdrop-filter blur, a semi-transparent fill, an inner highlight ring and an outer 1px border sheen. The refraction rings are concentric radial gradients at low opacity. The underglow is a blurred blue ellipse behind the tile that brightens on hover via an opacity transition, so nothing re-lays-out.",
    accessibility:
      "Both halves are inside one <button> with a single accessible name, so assistive tech does not announce two separate targets. The glass relies on translucency, so a solid fallback colour is applied when backdrop-filter is unsupported. Hover brightening is opacity-only and safe under reduced-motion.",
    faqs: [
      {
        q: "Does backdrop-filter hurt performance?",
        a: "One blurred element is inexpensive. Avoid stacking many of these on a single scrolling view; a handful on a page is fine.",
      },
      {
        q: "Can I make it a single pill instead of split?",
        a: "The split is the point of this component — for a one-piece frosted button use the Glossy Gel Glass Button instead.",
      },
      {
        q: "What themes are available?",
        a: "Titanium-gold and a cool blue ship by default, and the underglow colour is theme-driven so it stays consistent with the tile tint.",
      },
    ],
  },

  "elevated-underglow-cta": {
    overview:
      "The Elevated Underglow 3D Button is a tactile pill that lifts roughly 13px on hover to reveal a glowing electric-blue sub-chassis underneath, plus a bottom reflection rim and a soft claymorphic shadow. At rest it looks like an ordinary pill; on hover it becomes a floating object with light spilling out from beneath it.",
    whenToUse: [
      "The single most important CTA on a page — 'Book a call', 'Get started', 'Start free trial' — where the lift draws the eye on hover",
      "Dark hero sections where the underglow can actually be seen against the background",
      "Contact and demo-booking pages that pair well with the default phone / calendar icons",
    ],
    howItWorks:
      "Hover triggers a translateY on the pill and an opacity ramp on the sub-chassis and its blurred glow, all on a springy cubic-bezier so it overshoots slightly before settling. The lift distance is a single prop (liftAmount) so the physics can be tuned per placement. The reflection rim is a thin gradient border on the base that only becomes visible once the pill has moved off it.",
    accessibility:
      "It is a native <button>; the lift and glow are hover/focus affordances, not the only signal, and the label always carries the meaning. The whole animation is disabled under prefers-reduced-motion, leaving a static pill with a normal focus ring. Label contrast meets AA on all six themes (electric blue, magma, emerald, violet, crimson, obsidian).",
    faqs: [
      {
        q: "Why does the button not lift on tap on mobile?",
        a: "Touch devices have no hover state, so on tap it fires the click immediately rather than showing the lift; the glow still flashes briefly as press feedback.",
      },
      {
        q: "Can I change how high it rises?",
        a: "Yes — set liftAmount (in pixels). The default of 13 matches the reference design; 6-8 reads as subtle, 20+ as dramatic.",
      },
      {
        q: "Which icons are built in?",
        a: "phone, calendar, arrow, sparkle and mail, plus a text-only option. Pass icon=\"none\" to drop the glyph.",
      },
    ],
  },

  "led-matrix-chevron": {
    overview:
      "The LED Dot Matrix Chevron Button is a carbon-fibre squircle with a 7×7 LED grid embedded in its face. On hover or click the matrix stretches across the full width of the chassis and animates five cascading pixel chevrons, like a departure-board arrow telling you to move forward.",
    whenToUse: [
      "'Next', 'Continue' and 'Proceed' actions in multi-step flows where the animated chevrons literally point the way",
      "Cyberpunk, gaming or hardware-brand interfaces that want a retro-display motif",
      "Feature sections where one showpiece button is meant to be played with",
    ],
    howItWorks:
      "The grid is a CSS grid of small radial-gradient dots; 'lit' dots are just brighter cells driven by a keyframe timeline. The expansion is a width transition on the matrix container clipped by the chassis border-radius. Chevron travel is a staggered animation-delay across five arrow shapes so they ripple rather than move in unison. Step speed is exposed as a prop.",
    accessibility:
      "The button has a static text label for assistive tech even though the visible content is the animated matrix. The animation is decorative and fully suppressed under prefers-reduced-motion, which leaves a single static chevron. Interaction mode (hover, click or both) is configurable so it can be made keyboard/click-only.",
    faqs: [
      {
        q: "Can I slow the chevron animation down?",
        a: "Yes, stepSpeedMs controls the per-step delay; raise it for a calmer cascade or lower it for a fast strobe.",
      },
      {
        q: "Does the 7×7 grid mean 49 DOM nodes?",
        a: "Yes, 49 small divs. That is cheap for one or two buttons; do not render dozens on the same screen.",
      },
      {
        q: "Is there a click-only mode?",
        a: "Set interactionMode to \"click\" so the matrix only expands on activation, which is better for touch and for keyboard users.",
      },
    ],
  },

  "slide-grow-button": {
    overview:
      "The Swipe to Grow / Slide Button is a metallic capsule with a glowing electric-blue knob you drag from left to right. As the knob travels, a neon channel fills behind it and a masked label is progressively revealed, so completion is both a gesture and a visual fill.",
    whenToUse: [
      "Deliberate or destructive confirmations — 'slide to delete', 'slide to publish', 'slide to pay' — where an accidental tap would be costly",
      "Onboarding 'slide to begin' moments that set a tactile tone",
      "Mobile-first flows where a swipe is more natural than a checkbox plus button",
    ],
    howItWorks:
      "The knob is a pointer-driven draggable element clamped to the track width; drag progress (0-1) drives both the channel fill width and a background-clip mask on the label. Releasing before the threshold springs the knob back; crossing it fires onComplete and locks the filled state. Interaction mode allows drag, click, hover or any combination.",
    accessibility:
      "The control exposes role=\"slider\" with aria-valuenow so keyboard users can complete it with arrow keys and Enter, not just a pointer drag. A visible focus ring sits on the knob. Under prefers-reduced-motion the spring-back is instant and the fill does not animate.",
    faqs: [
      {
        q: "Can it be completed with a keyboard?",
        a: "Yes. It is a real slider — arrow keys move the knob and Enter/Space at the end fires onComplete.",
      },
      {
        q: "What happens if the user lets go halfway?",
        a: "If the knob has not passed the completion threshold it springs back to the start and onComplete does not fire.",
      },
      {
        q: "Is there a click fallback for people who don't want to drag?",
        a: "Yes, set interactionMode to include \"click\" so a single tap on the track also completes it.",
      },
    ],
  },

  "vintage-leather-cta": {
    overview:
      "The Vintage Leather & Brass Button is an embossed heritage control: a stitched leather face raised on a 6px brass bevel lip, seated in a recessed enclosure tray, with filigree scrollwork in the corners. It is designed to look like hardware off a luxury travel case.",
    whenToUse: [
      "Premium, heritage or craft brands — spirits, leather goods, private clubs, boutique hotels — where flat UI would feel cheap",
      "'Reserve', 'Enquire' or 'Join' actions that should feel exclusive and considered",
      "Editorial or storytelling pages where the button is part of the art direction",
    ],
    howItWorks:
      "The leather grain is a tiled noise texture with a soft inner shadow for the emboss; the brass lip is a gradient border with a bright top edge and dark underside. The tray is an inset shadow in the parent. On press the face drops the height of the lip so the brass 'disappears' and the button meets the tray. Corner flourishes are optional inline SVG.",
    accessibility:
      "Native <button> with an accessible label; the ornamental scrollwork is aria-hidden. Contrast of the engraved label against the leather meets AA in the bundled themes. The press is a short translate that is reduced to a colour change under prefers-reduced-motion.",
    faqs: [
      {
        q: "Can I turn off the corner scrollwork?",
        a: "Yes, showOrnaments toggles the filigree for a cleaner, more restrained look.",
      },
      {
        q: "Does the leather texture load an image?",
        a: "No, the grain is generated with CSS gradients and noise, so there is no extra network request.",
      },
      {
        q: "What colourways ship with it?",
        a: "Classic tan/brass plus darker oxblood and black-leather variants selectable through the theme prop.",
      },
    ],
  },

  "neumorphic-glow-cta": {
    overview:
      "The Neumorphic Glow CTA is a pair of claymorphic buttons that appear extruded from the surface itself, with multi-tier drop shadows and a glowing neon-green depth badge. The 'plus-lighter' blend on the glow makes the light feel additive rather than painted on.",
    whenToUse: [
      "Primary / secondary action pairs — 'Get started' next to 'Learn more' — on soft, light-surface marketing pages",
      "Settings and preference screens already using neumorphic cards and inputs",
      "Fintech and wellness products where a soft, calm, tactile aesthetic fits the brand",
    ],
    howItWorks:
      "Each button uses the classic dual box-shadow (light source top-left, shadow bottom-right) to fake extrusion, layered two or three deep for a rounder edge. The glow badge is a separate element with a blurred green copy behind it and mix-blend-mode: plus-lighter so overlapping light sums. On press the shadows invert to read as depressed.",
    accessibility:
      "Neumorphism is notoriously low-contrast, so this component ships with a stronger label colour and a visible focus outline rather than relying on shadow alone. Both buttons are native controls. The glow and shadow inversion are disabled under prefers-reduced-motion.",
    faqs: [
      {
        q: "Isn't neumorphism bad for accessibility?",
        a: "It can be when the only affordance is a soft shadow. This build keeps AA-contrast text and a real focus ring so the control is still perceivable.",
      },
      {
        q: "Does it work on dark backgrounds?",
        a: "The effect depends on a light, slightly-off-white surface. On dark surfaces use the Tactile Pill or Smash button instead.",
      },
      {
        q: "What is the neon badge for?",
        a: "It is a depth/status accent — you can map it to a live state (e.g. 'new') or leave it purely decorative.",
      },
    ],
  },

  "smash-tactile-button": {
    overview:
      "The Tactile 'Smash' Button is a neo-brutalist assembly: an outer enclosure frame, a cushion cooling tray, an obsidian core slab and a neon reactor underglow. It is built to be hit — the press throws the core down into the tray with a hard stop.",
    whenToUse: [
      "High-energy, single-purpose actions — 'Launch', 'Deploy', 'Smash to start' — in developer tools, gaming and hackathon-style products",
      "Moments meant to feel satisfying and consequential rather than routine",
      "Dark, technical interfaces with an industrial visual language",
    ],
    howItWorks:
      "The layers are stacked divs with hard 1-2px borders and no border-radius softening, in the brutalist style. Press runs a fast translateY with a stiff spring (little overshoot) so it feels like it bottoms out. The reactor underglow is a blurred, saturated layer behind the core that spikes in brightness on the down-stroke then eases back.",
    accessibility:
      "Native <button>, keyboard-activatable, with a focus outline on the outer frame. The heavy press animation collapses to an instant colour swap under prefers-reduced-motion. The underglow is decorative and aria-hidden.",
    faqs: [
      {
        q: "Can I soften the press?",
        a: "The stiff, hard-stop feel is intentional. For a springier lift use Elevated Underglow; for a gentle sink use the Tactile Pill.",
      },
      {
        q: "Does it come in lighter colours?",
        a: "It is dark-first by design. A couple of accent variants change the reactor colour but the chassis stays obsidian.",
      },
      {
        q: "Is the multi-layer chassis heavy in the DOM?",
        a: "It is four or five divs — negligible. The only cost is the one blurred underglow layer.",
      },
    ],
  },

  "scaling-capsule-button": {
    overview:
      "The Scaling Capsule Tactile Button is a recessed capsule with a frosted translucent tray and an obsidian cap that carries a circular apex emblem badge. On interaction the cap scales slightly within its housing, so it feels seated and spring-loaded rather than free-floating.",
    whenToUse: [
      "Brand or identity actions where the circular emblem slot can hold a logo mark",
      "Dashboards and app shells that need a compact, premium button with a badge affordance",
      "Secondary CTAs that should feel substantial without shouting",
    ],
    howItWorks:
      "The tray is a frosted layer (blur + translucency) with an inset shadow; the cap sits above it with its own outset shadow and a subtle transform: scale on press/hover, clamped so it never breaks the capsule outline. The apex emblem is an inline SVG badge centred on the cap with its own tiny highlight.",
    accessibility:
      "One native <button> with a single accessible name; the emblem is decorative unless you give it a title. Focus ring sits outside the capsule. Scale animation respects prefers-reduced-motion and degrades to a colour change.",
    faqs: [
      {
        q: "Can I put my own logo in the emblem slot?",
        a: "Yes, the badge accepts a custom icon; keep it monochrome so it reads on the obsidian cap.",
      },
      {
        q: "How is this different from the Tactile Pill button?",
        a: "The Pill tilts into a slot; this one scales in place and has a dedicated circular badge area.",
      },
      {
        q: "Does the frosted tray need backdrop-filter?",
        a: "It looks best with it, but there is a solid translucent fallback when the property is unsupported.",
      },
    ],
  },

  "magnetic-pulse-cta": {
    overview:
      "The Magnetic Pulsing CTA is a glowing action button that emits an ambient radiant pulse at rest, presses in with 3D depth feedback, and exposes a hook for a click sound. The pulse is meant to pull attention the way a notification dot does, but for a primary action.",
    whenToUse: [
      "The one action you most want clicked on a quiet page — the resting pulse creates motion where there would otherwise be none",
      "Launch, waitlist and 'notify me' buttons where a little urgency is on-brand",
      "Interactive demos where the optional click sound adds to the feedback",
    ],
    howItWorks:
      "The pulse is a pseudo-element ring that scales up and fades out on a loop (transform + opacity only, so it stays on the compositor). Press applies a small translateZ-style shadow collapse for depth. The audio is opt-in via a callback so no sound file loads unless you wire one up.",
    accessibility:
      "Native <button> with a clear label. The looping pulse is paused entirely under prefers-reduced-motion, since continuous ambient motion is a common vestibular trigger. Any click sound must be user-initiated and should never be the only feedback — the visual press covers that.",
    faqs: [
      {
        q: "Is a constantly-pulsing button distracting?",
        a: "It can be if you use more than one per screen. Reserve it for a single primary action, and note it stops moving under reduced-motion.",
      },
      {
        q: "Does it play a sound by default?",
        a: "No. It exposes an onClick audio hook but ships silent; you provide and trigger the sound if you want it.",
      },
      {
        q: "Can I change the pulse colour?",
        a: "Yes, pulseColor drives the ring and the resting glow together.",
      },
    ],
  },

  "animated-slide-button": {
    overview:
      "The Animated Slide-Up Button holds two lines of text stacked vertically inside a clipped window. On hover the pair rolls up so the second label replaces the first with a smooth vertical translate, like a split-flap board with two states.",
    whenToUse: [
      "Service and pricing cards where the button can say 'View plan' at rest and 'Get started →' on hover",
      "High-conversion CTAs that benefit from a micro-moment of motion without a colour change",
      "Grids of cards where a consistent, restrained hover treatment keeps the layout calm",
    ],
    howItWorks:
      "Two text spans sit in a fixed-height, overflow-hidden container. Hover moves the inner track by exactly one line-height with a transform transition, revealing the second span. Because it is transform-only and the container height never changes, there is zero layout shift and the animation runs on the GPU.",
    accessibility:
      "Both labels are in the DOM, so screen readers get the full text; the visual swap is purely presentational. The primary label is what is announced. Under prefers-reduced-motion the second label simply cross-fades or is hidden, with no vertical motion.",
    faqs: [
      {
        q: "Will the hidden second line be read out twice?",
        a: "Set the secondary label to aria-hidden if it is redundant; otherwise both are available and the primary is the accessible name.",
      },
      {
        q: "Does it cause layout shift?",
        a: "No. The container has a fixed height and only the inner track translates, so CLS is unaffected.",
      },
      {
        q: "Can I use it without a hover (touch)?",
        a: "On touch it just behaves as a normal button with the primary label; the roll is a hover enhancement only.",
      },
    ],
  },

  "arc-corner-toggle": {
    overview:
      "The Arc Corner Slider Toggle is a light/dark switch where the knob travels along a 90° circular track tucked into the corner of a panel. A sunken sunburst dial sits under the knob and a magenta laser beam sweeps the arc as it moves between states.",
    whenToUse: [
      "Theme switchers placed in a panel or card corner where a straight toggle would waste space",
      "Playful or high-craft settings surfaces where the switch itself is a feature",
      "Anywhere a binary state maps naturally to a dial or rotation metaphor",
    ],
    howItWorks:
      "The knob position is an angle (0-90°) rather than an x-offset; it is placed with a rotate around the arc's centre and a fixed radius. The beam is a conic-gradient segment masked to the track. Toggling animates the angle with a configurable duration; the sunburst dial is a static repeating-conic-gradient underneath.",
    accessibility:
      "Exposes role=\"switch\" with aria-checked so it is announced and operable as a standard toggle regardless of the circular visuals. Keyboard: Space/Enter flips it. The arc sweep and beam are suppressed under prefers-reduced-motion, leaving an instant state change.",
    faqs: [
      {
        q: "Is it actually usable, or just decorative?",
        a: "It is a real switch with role=\"switch\" and keyboard support; the arc is only how the thumb is positioned.",
      },
      {
        q: "Can I control the animation speed?",
        a: "Yes, the duration prop sets how long the knob takes to travel the 90° arc.",
      },
      {
        q: "Does it support system theme detection?",
        a: "themeMode can be set to auto to follow prefers-color-scheme, or pinned to light/dark.",
      },
    ],
  },

  "glass-badge": {
    overview:
      "The Glassmorphic Badge is a frosted pill for labels, section eyebrows and status chips. It layers a backdrop blur, a translucent fill, a faint border sheen and lightly glowing type so it lifts off the background without a hard container.",
    whenToUse: [
      "Section eyebrow labels above headings ('New', 'Featured', 'Beta')",
      "Status chips on cards — 'Live', 'Sold out', 'In progress' — over a photo or gradient",
      "Any small label that needs to sit on a busy background and stay readable",
    ],
    howItWorks:
      "A single element with backdrop-filter: blur, a low-alpha background, a 1px semi-transparent border and an inset highlight along the top edge. The text gets a subtle text-shadow glow. Sizes are driven by a size prop that scales padding and font together.",
    accessibility:
      "Purely visual — it renders as a <span>. If the badge conveys status that is not otherwise in the text, add an accessible label or visually-hidden text. A solid fallback fill is used where backdrop-filter is unavailable so contrast is preserved.",
    faqs: [
      {
        q: "Can I use it as a button?",
        a: "It is a label component. For a frosted action, use the Glossy Gel or Frosted Gel button instead.",
      },
      {
        q: "Why is my badge invisible on a white background?",
        a: "Glassmorphism needs some texture or colour behind it to read. Over flat white, switch to a solid variant.",
      },
      {
        q: "What sizes are available?",
        a: "Small, medium and large presets via the size prop, plus a variant prop for tint.",
      },
    ],
  },

  "glass-surface": {
    overview:
      "The Glass Surface Container is a deep frosted card you drop other content into. It combines a heavy backdrop blur, a moving specular sheen, rounded corners, optional noise texture and an ambient light reflection along one edge.",
    whenToUse: [
      "Feature cards, stat panels and modals layered over a colourful or photographic background",
      "Overlay UI on video or 3D scenes where a solid card would feel heavy",
      "Design systems that want one consistent 'glass panel' primitive instead of ad-hoc blur styles",
    ],
    howItWorks:
      "The container sets backdrop-filter, a translucent fill and a large border-radius, then adds a gradient 'sheen' pseudo-element positioned along the top-left and an optional SVG/PNG noise overlay at very low opacity to kill banding. borderRadius and blur are exposed as props so the same component covers subtle and extreme looks.",
    accessibility:
      "It is a presentational wrapper — children keep their own semantics. Ensure any text placed inside still meets AA against the effective (blurred) background; a min-contrast solid fallback is applied when backdrop-filter is unsupported. No animation by default, so nothing to gate.",
    faqs: [
      {
        q: "How many of these can I put on one page?",
        a: "Backdrop-filter is the cost. A few are fine; a long scrolling list of them will stress lower-end GPUs, so consider a solid style for list items.",
      },
      {
        q: "Can I control the blur strength?",
        a: "Yes, the blur prop maps directly to the backdrop-filter radius, and borderRadius controls the corner rounding.",
      },
      {
        q: "What is the noise texture for?",
        a: "Heavy blur can produce visible colour banding; a faint noise layer masks it and adds a tactile, film-like quality.",
      },
    ],
  },

  "tactile-neumorphic-toggle": {
    overview:
      "The Tactile Neumorphic Pill Toggle is a debossed switch: the track is a five-layer inset groove carved into the surface, and the thumb is a brushed-metal slug with specular bevels that slides between two etched status glyphs.",
    whenToUse: [
      "Settings rows on soft, light-surface apps already using neumorphic inputs",
      "On/off controls where you want the switch to feel like a physical rocker",
      "Interfaces where the etched icons (check / cross, sun / moon) should live in the track itself",
    ],
    howItWorks:
      "The groove stacks several inset box-shadows of decreasing spread to fake real carved depth. The thumb has an outset shadow plus a linear-gradient 'brushed' fill and a bright bevel edge. Toggling translates the thumb and swaps which etched glyph is lit. The glyphs are always present, just dimmed on the inactive side.",
    accessibility:
      "role=\"switch\" with aria-checked; fully keyboard operable with Space/Enter. Because neumorphic contrast is low, the active glyph uses a stronger colour and there is a real focus ring around the whole control. Thumb travel is instant under prefers-reduced-motion.",
    faqs: [
      {
        q: "How is this different from the Dual-Dome Switch?",
        a: "This is a flat sliding pill with etched glyphs in the track. The Dual-Dome Switch is more photorealistic, with a sculpted two-bump thumb and an illuminated channel.",
      },
      {
        q: "Can I hide the icons?",
        a: "showIcons toggles the etched glyphs off for a plain track.",
      },
      {
        q: "Does it work in dark mode?",
        a: "There is a dark theme, but neumorphism reads best on light surfaces; test contrast if you invert it.",
      },
    ],
  },

  "glossy-gel-button": {
    overview:
      "The Glossy Gel Glass Button is a skeuomorphic candy-gel CTA built straight from a design spec. It uses multi-layer inner shadows for depth, a soft blurred specular highlight capsule near the top, and a crisp drop shadow on the label so text stays legible over the gloss.",
    whenToUse: [
      "Playful consumer products, kids' apps and games where a glossy Web 2.0-revival look is on-brand",
      "A standout primary button on an otherwise flat page, used sparingly",
      "Loading-aware actions — it has a built-in isLoading state",
    ],
    howItWorks:
      "The body is a rounded rect with a vertical gradient, an inset top highlight and an inset bottom shadow to fake curvature. The 'shine' is a separate blurred white capsule at partial opacity. The label carries its own text-shadow. isLoading swaps the label for a spinner without resizing the button.",
    accessibility:
      "Native <button>; the loading state sets aria-busy and disables activation. Label contrast is checked against the mid-tone of the gel gradient, not the lightest point. No looping motion; the only animation is the optional spinner, which is a simple rotate.",
    faqs: [
      {
        q: "Isn't glossy gel dated?",
        a: "It is a deliberate aesthetic choice. Used once as a hero button on a flat page it reads as intentional and fun rather than accidental.",
      },
      {
        q: "How does the loading state behave?",
        a: "Pass isLoading and the label is replaced by a spinner, the button sets aria-busy, and clicks are ignored until it clears.",
      },
      {
        q: "What themes ship with it?",
        a: "Several gel tints via the theme prop; the highlight and inner shadows recolour to match each one.",
      },
    ],
  },

  "tactile-neumorphic-switch": {
    overview:
      "The Tactile Neumorphic Dual-Dome Switch is a photorealistic toggle: an outer recessed bevel cavity, a deep carved shadow trench, an illuminated emerald photon channel, and a sculpted thumb with two domes that gives your thumb something to 'grip' visually.",
    whenToUse: [
      "Hero or showcase toggles where the switch itself is a demo piece",
      "Hardware-style control panels and IoT dashboards",
      "Any single high-value on/off — 'Enable protection', 'Go live' — that deserves emphasis",
    ],
    howItWorks:
      "The cavity and trench are layered inset shadows; the photon channel is a gradient strip that lights up (opacity + colour) when the switch is on. The dual-dome thumb is built from stacked radial gradients for the two bumps plus a specular highlight, and it translates across the trench on a spring. stateMode allows interactive, standard or hover-preview behaviour.",
    accessibility:
      "role=\"switch\" with aria-checked; Space/Enter toggles it; focus ring wraps the outer cavity. The channel colour change is paired with the thumb position so state is not conveyed by colour alone. Spring motion is removed under prefers-reduced-motion.",
    faqs: [
      {
        q: "Can I show it in an 'on' state without it being interactive?",
        a: "Yes, stateMode: standard renders a fixed visual state for use in marketing shots or read-only summaries.",
      },
      {
        q: "Why emerald?",
        a: "The default photon channel is emerald; the theme prop recolours it (and there is a grid overlay option via showGrid).",
      },
      {
        q: "Is it heavier than the pill toggle?",
        a: "Slightly — more gradient layers for the domes — but still just CSS. Use the pill toggle for dense settings lists and this for a feature moment.",
      },
    ],
  },

  "luminous-shelf-card": {
    overview:
      "The Luminous Shelf Card is a dark product card with an under-shelf light that switches on when you hover. A volumetric cone washes up the back wall, the shelf's front edge glows like a hot filament, and the pinned object is lit from below while casting a soft shadow upward.",
    whenToUse: [
      "Product and feature cards where you want a single dramatic hover payoff",
      "Portfolio or 'featured work' grids on dark sites",
      "Landing-page cards that need to feel premium and physical rather than flat tiles",
    ],
    howItWorks:
      "At rest the card is nearly unlit. On hover, opacity ramps on three stacked layers: a conic/linear 'cone' gradient on the wall, a bright blurred line on the shelf edge, and an up-cast shadow behind the pinned element. Everything is opacity/transform, so the card never re-lays-out. Optional flicker adds a short randomised opacity jitter to the filament.",
    accessibility:
      "The card is a normal link/article; the lighting is a hover/focus enhancement and all information is present in the unlit state. focus-visible triggers the same light-on treatment so keyboard users see it too. flicker and the light ramp are disabled under prefers-reduced-motion.",
    faqs: [
      {
        q: "Does the effect work on touch devices?",
        a: "There is no hover on touch, so the card shows its lit state on focus/tap instead; the content is fully readable unlit.",
      },
      {
        q: "Can I turn off the filament flicker?",
        a: "Yes, flicker is a boolean and defaults to a calm, steady glow when off.",
      },
      {
        q: "Is it expensive to animate in a grid?",
        a: "Only the hovered card animates, and it is opacity-only, so a grid of these is fine.",
      },
    ],
  },

  "join-tactile-button": {
    overview:
      "The Join Tactile 3D Button is a lightweight rebuild of the site footer's 'LETS VENTURE' key: a grey frame, a recessed silver-bezel socket, and a black cap sitting on a visible 3D base with a backlit magma glow behind the label. It uses nested elements and container-query units instead of a filter-heavy SVG.",
    whenToUse: [
      "Newsletter, community and waitlist 'Join' actions that should match the footer key styling",
      "Anywhere the older SVG version was too expensive to render or hard to theme",
      "Dark sections where the magma backlight behind the label can be seen",
    ],
    howItWorks:
      "The keycap is a stack of divs: outer frame, inset socket (inset shadow), and a raised black cap with an outset shadow forming the visible base. The label glow is a blurred magma-coloured copy behind the text. Sizing uses container-query units (cqi) so the whole key scales with its container rather than needing media queries.",
    accessibility:
      "Native <button> with a clear label and focus ring on the cap. showArrow adds an optional trailing chevron. The press is a short translate reduced to a colour change under prefers-reduced-motion. The magma glow is decorative and aria-hidden.",
    faqs: [
      {
        q: "Why rebuild the footer key as a component?",
        a: "The original was a filter-heavy SVG that was costly to paint and awkward to recolour. This version is plain nested divs, so it is cheaper and themeable.",
      },
      {
        q: "What are container-query units doing here?",
        a: "cqi sizing means the key scales relative to its parent's width, so one component works in the footer, a card, or a hero without breakpoints.",
      },
      {
        q: "Can I remove the arrow?",
        a: "Yes, showArrow is off by default; turn it on for 'Join →' style CTAs.",
      },
    ],
  },
};
