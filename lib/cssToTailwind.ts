// CSS -> Tailwind utility converter.
//
// Design: every declaration resolves to Tailwind classes through three tiers,
// tried in order, so the converter always produces *something* valid:
//   1. "scale"              - matches a token in Tailwind's default scale (p-4, rounded-lg)
//   2. "arbitrary-value"    - a recognized utility with a custom value (p-[13px], bg-[#ff5b04])
//   3. "arbitrary-property" - fully unmapped CSS, passed through via Tailwind's
//                             arbitrary-property syntax ([mask-type:luminance])
// Tier 3 means there is no such thing as an "unsupported" declaration - only
// declarations that don't get a short, semantic class name.

export type ResolutionTier = "scale" | "arbitrary-value" | "arbitrary-property";

export interface ResolvedDeclaration {
  property: string;
  value: string;
  classes: string[];
  tier: ResolutionTier;
  note?: string;
}

export interface ConvertedRule {
  selector: string;
  mediaPrefix: string | null;
  mediaNote?: string;
  variantPrefix: string;
  unrecognizedPseudos: string[];
  declarations: ResolvedDeclaration[];
  classNames: string;
}

export interface ConvertResult {
  rules: ConvertedRule[];
  totals: {
    declarations: number;
    scale: number;
    arbitraryValue: number;
    arbitraryProperty: number;
  };
}

export interface ConvertOptions {
  preferScale?: boolean;
}

// ── Scale tables (token -> px / ms / unitless) ─────────────────────────────

const SPACING_SCALE: [string, number][] = [
  ["0", 0],
  ["px", 1],
  ["0.5", 2],
  ["1", 4],
  ["1.5", 6],
  ["2", 8],
  ["2.5", 10],
  ["3", 12],
  ["3.5", 14],
  ["4", 16],
  ["5", 20],
  ["6", 24],
  ["7", 28],
  ["8", 32],
  ["9", 36],
  ["10", 40],
  ["11", 44],
  ["12", 48],
  ["14", 56],
  ["16", 64],
  ["20", 80],
  ["24", 96],
  ["28", 112],
  ["32", 128],
  ["36", 144],
  ["40", 160],
  ["44", 176],
  ["48", 192],
  ["52", 208],
  ["56", 224],
  ["60", 240],
  ["64", 256],
  ["72", 288],
  ["80", 320],
  ["96", 384],
];

const RADIUS_SCALE: [string, number][] = [
  ["none", 0],
  ["sm", 2],
  ["", 4],
  ["md", 6],
  ["lg", 8],
  ["xl", 12],
  ["2xl", 16],
  ["3xl", 24],
];

const FONT_SIZE_SCALE: [string, number][] = [
  ["xs", 12],
  ["sm", 14],
  ["base", 16],
  ["lg", 18],
  ["xl", 20],
  ["2xl", 24],
  ["3xl", 30],
  ["4xl", 36],
  ["5xl", 48],
  ["6xl", 60],
  ["7xl", 72],
  ["8xl", 96],
  ["9xl", 128],
];

const BORDER_WIDTH_SCALE: [string, number][] = [
  ["0", 0],
  ["2", 2],
  ["4", 4],
  ["8", 8],
];

const DURATION_SCALE: [string, number][] = [
  ["75", 75],
  ["100", 100],
  ["150", 150],
  ["200", 200],
  ["300", 300],
  ["500", 500],
  ["700", 700],
  ["1000", 1000],
];

const TRACKING_SCALE: [string, number][] = [
  ["tighter", -0.05],
  ["tight", -0.025],
  ["normal", 0],
  ["wide", 0.025],
  ["wider", 0.05],
  ["widest", 0.1],
];

const LEADING_SCALE: [string, number][] = [
  ["none", 1],
  ["tight", 1.25],
  ["snug", 1.375],
  ["normal", 1.5],
  ["relaxed", 1.625],
  ["loose", 2],
];

const FRACTIONS: [string, number][] = [
  ["1/2", 50],
  ["1/3", 33.333],
  ["2/3", 66.667],
  ["1/4", 25],
  ["3/4", 75],
  ["1/5", 20],
  ["2/5", 40],
  ["3/5", 60],
  ["4/5", 80],
  ["1/6", 16.667],
  ["5/6", 83.333],
  ["1/12", 8.333],
  ["5/12", 41.667],
  ["7/12", 58.333],
  ["11/12", 91.667],
];

const FONT_WEIGHT_MAP: Record<string, string> = {
  "100": "thin",
  "200": "extralight",
  "300": "light",
  "400": "normal",
  "500": "medium",
  "600": "semibold",
  "700": "bold",
  "800": "extrabold",
  "900": "black",
  normal: "normal",
  bold: "bold",
};

const BORDER_STYLE_KEYWORDS = new Set([
  "solid",
  "dashed",
  "dotted",
  "double",
  "none",
  "hidden",
  "groove",
  "ridge",
  "inset",
  "outset",
]);

const BREAKPOINTS: [string, number][] = [
  ["sm", 640],
  ["md", 768],
  ["lg", 1024],
  ["xl", 1280],
  ["2xl", 1536],
];

const PSEUDO_VARIANTS: Record<string, string> = {
  hover: "hover:",
  focus: "focus:",
  "focus-visible": "focus-visible:",
  "focus-within": "focus-within:",
  active: "active:",
  disabled: "disabled:",
  enabled: "enabled:",
  checked: "checked:",
  required: "required:",
  "read-only": "read-only:",
  visited: "visited:",
  target: "target:",
  empty: "empty:",
  "first-child": "first:",
  "last-child": "last:",
  "first-of-type": "first:",
  "last-of-type": "last:",
  "only-child": "only:",
  before: "before:",
  after: "after:",
  placeholder: "placeholder:",
  selection: "selection:",
};

// ── Value helpers ───────────────────────────────────────────────────────────

function toPx(rawValue: string): number | null {
  const v = rawValue.trim();

  if (v === "0") return 0;
  if (/^-?\d*\.?\d+px$/.test(v)) return parseFloat(v);
  if (/^-?\d*\.?\d+rem$/.test(v)) return parseFloat(v) * 16;
  if (/^-?\d*\.?\d+em$/.test(v)) return parseFloat(v) * 16;

  return null;
}

function toUnitless(rawValue: string): number | null {
  const v = rawValue.trim();

  return /^-?\d*\.?\d+$/.test(v) ? parseFloat(v) : null;
}

function matchScaleToken(
  px: number,
  scale: [string, number][],
  tolerance = 0.05,
): string | null {
  const abs = Math.abs(px);
  const hit = scale.find(([, v]) => Math.abs(v - abs) < tolerance);

  if (!hit) return null;

  return px < 0 ? `-${hit[0]}` : hit[0];
}

function matchFraction(percent: number): string | null {
  const hit = FRACTIONS.find(([, v]) => Math.abs(v - percent) < 0.05);

  return hit ? hit[0] : null;
}

function bracket(value: string): string {
  return `[${value.trim().replace(/\s+/g, "_")}]`;
}

function withImportant(cls: string, important: boolean): string {
  return important ? `!${cls}` : cls;
}

function stripImportant(rawValue: string): { value: string; important: boolean } {
  const match = rawValue.match(/^(.*?)\s*!\s*important\s*$/i);

  return match
    ? { value: match[1].trim(), important: true }
    : { value: rawValue.trim(), important: false };
}

function splitShorthandValues(value: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";

  for (const ch of value.trim()) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (/\s/.test(ch) && depth === 0) {
      if (current) parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current) parts.push(current);

  return parts;
}

function expandBox(value: string): {
  top: string;
  right: string;
  bottom: string;
  left: string;
} {
  const parts = splitShorthandValues(value);

  if (parts.length === 1)
    return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
  if (parts.length === 2)
    return { top: parts[0], bottom: parts[0], right: parts[1], left: parts[1] };
  if (parts.length === 3)
    return { top: parts[0], right: parts[1], left: parts[1], bottom: parts[2] };

  return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
}

// CSS border-radius shorthand order is TL/TR/BR/BL (clockwise from top-left) -
// not the physical top/right/bottom/left order used by padding/margin.
function expandCorners(value: string): {
  tl: string;
  tr: string;
  br: string;
  bl: string;
} {
  const parts = splitShorthandValues(value);

  if (parts.length === 1)
    return { tl: parts[0], tr: parts[0], br: parts[0], bl: parts[0] };
  if (parts.length === 2)
    return { tl: parts[0], br: parts[0], tr: parts[1], bl: parts[1] };
  if (parts.length === 3)
    return { tl: parts[0], tr: parts[1], bl: parts[1], br: parts[2] };

  return { tl: parts[0], tr: parts[1], br: parts[2], bl: parts[3] };
}

function spacingClass(
  prefix: string,
  rawValue: string,
  opts: {
    allowAuto?: boolean;
    allowFull?: boolean;
    allowFraction?: boolean;
    allowScreen?: "w" | "h";
    preferScale: boolean;
  },
): string {
  const value = rawValue.trim();
  const lower = value.toLowerCase();

  if (opts.allowAuto && lower === "auto") return `${prefix}-auto`;
  if (opts.allowScreen === "w" && lower === "100vw") return "w-screen";
  if (opts.allowScreen === "h" && lower === "100vh") return "h-screen";
  if (lower === "fit-content") return `${prefix}-fit`;
  if (lower === "max-content") return `${prefix}-max`;
  if (lower === "min-content") return `${prefix}-min`;
  if (opts.allowFull && lower === "100%") return `${prefix}-full`;
  if (opts.allowFraction && value.endsWith("%")) {
    const frac = matchFraction(parseFloat(value));

    if (frac) return `${prefix}-${frac}`;
  }
  if (opts.preferScale) {
    const px = toPx(value);

    if (px !== null) {
      const token = matchScaleToken(px, SPACING_SCALE);

      if (token !== null) {
        return token.startsWith("-")
          ? `-${prefix}-${token.slice(1)}`
          : `${prefix}-${token}`;
      }
    }
  }

  return `${prefix}-${bracket(value)}`;
}

function colorClass(prefix: string, rawValue: string): string {
  const value = rawValue.trim();
  const lower = value.toLowerCase();

  if (lower === "transparent") return `${prefix}-transparent`;
  if (lower === "currentcolor") return `${prefix}-current`;
  if (lower === "inherit") return `${prefix}-inherit`;

  return `${prefix}-${bracket(value)}`;
}

function radiusClass(prefix: string, rawValue: string, preferScale: boolean): string {
  const value = rawValue.trim();
  const lower = value.toLowerCase();

  if (lower === "50%" || lower === "9999px") return `${prefix}-full`;

  if (preferScale) {
    const px = toPx(value);

    if (px !== null) {
      const token = matchScaleToken(px, RADIUS_SCALE);

      if (token !== null) return token ? `${prefix}-${token}` : prefix;
    }
  }

  return `${prefix}-${bracket(value)}`;
}

function isSimpleColorToken(value: string): boolean {
  const v = value.trim();

  if (/^#[0-9a-f]{3,8}$/i.test(v)) return true;
  if (/^(rgb|rgba|hsl|hsla)\(/i.test(v)) return true;
  if (/^[a-z]+$/i.test(v) && !["none", "auto"].includes(v.toLowerCase())) return true;

  return false;
}

// ── Property resolution ─────────────────────────────────────────────────────

function resolveDeclaration(
  property: string,
  rawValue: string,
  preferScale: boolean,
): ResolvedDeclaration {
  const { value, important } = stripImportant(rawValue);
  const prop = property.trim().toLowerCase();

  const scale = (classes: string[], note?: string): ResolvedDeclaration => ({
    property: prop,
    value,
    classes: classes.map((c) => withImportant(c, important)),
    tier: "scale",
    note,
  });
  const arbitraryValue = (classes: string[], note?: string): ResolvedDeclaration => ({
    property: prop,
    value,
    classes: classes.map((c) => withImportant(c, important)),
    tier: "arbitrary-value",
    note,
  });
  const arbitraryProperty = (note?: string): ResolvedDeclaration => ({
    property: prop,
    value,
    classes: [withImportant(`${bracket(`${prop}:${value}`)}`, important)],
    tier: "arbitrary-property",
    note,
  });

  const spacing = (
    prefix: string,
    opts?: Omit<Parameters<typeof spacingClass>[2], "preferScale">,
  ): ResolvedDeclaration => {
    const cls = spacingClass(prefix, value, { preferScale, ...opts });

    return cls.includes("[") ? arbitraryValue([cls]) : scale([cls]);
  };

  const color = (prefix: string): ResolvedDeclaration => {
    const cls = colorClass(prefix, value);

    return cls.includes("[") ? arbitraryValue([cls]) : scale([cls]);
  };

  const keyword = (map: Record<string, string>): ResolvedDeclaration | null => {
    const cls = map[value.toLowerCase()];

    return cls ? scale([cls]) : null;
  };

  switch (prop) {
    // Layout & display
    case "display":
      return (
        keyword({
          flex: "flex",
          grid: "grid",
          block: "block",
          "inline-block": "inline-block",
          inline: "inline",
          "inline-flex": "inline-flex",
          "inline-grid": "inline-grid",
          none: "hidden",
          "list-item": "list-item",
          table: "table",
          "flow-root": "flow-root",
          contents: "contents",
        }) ?? arbitraryProperty()
      );
    case "position":
      return (
        keyword({
          static: "static",
          relative: "relative",
          absolute: "absolute",
          fixed: "fixed",
          sticky: "sticky",
        }) ?? arbitraryProperty()
      );
    case "box-sizing":
      return (
        keyword({ "border-box": "box-border", "content-box": "box-content" }) ??
        arbitraryProperty()
      );
    case "overflow":
    case "overflow-x":
    case "overflow-y": {
      const suffix = prop === "overflow" ? "" : `-${prop.split("-")[1]}`;

      return (
        keyword({
          visible: `overflow${suffix}-visible`,
          hidden: `overflow${suffix}-hidden`,
          scroll: `overflow${suffix}-scroll`,
          auto: `overflow${suffix}-auto`,
          clip: `overflow${suffix}-clip`,
        }) ?? arbitraryProperty()
      );
    }
    case "top":
    case "right":
    case "bottom":
    case "left":
      return spacing(prop, { allowAuto: true, allowFull: true, allowFraction: true });
    case "inset":
      return spacing("inset", { allowAuto: true, allowFull: true });
    case "z-index": {
      if (value.toLowerCase() === "auto") return scale(["z-auto"]);
      const n = toUnitless(value);

      if (n !== null && [0, 10, 20, 30, 40, 50].includes(n)) return scale([`z-${n}`]);

      return arbitraryValue([`z-${bracket(value)}`]);
    }

    // Sizing
    case "width":
      return spacing("w", { allowAuto: true, allowFull: true, allowFraction: true, allowScreen: "w" });
    case "height":
      return spacing("h", { allowAuto: true, allowFull: true, allowFraction: true, allowScreen: "h" });
    case "min-width":
      return spacing("min-w", { allowFull: true, allowFraction: true });
    case "min-height":
      return spacing("min-h", { allowFull: true, allowFraction: true });
    case "max-width":
      if (value.toLowerCase() === "none") return scale(["max-w-none"]);

      return spacing("max-w", { allowFull: true, allowFraction: true });
    case "max-height":
      return spacing("max-h", { allowFull: true, allowFraction: true });

    // Spacing
    case "padding": {
      const b = expandBox(value);

      if (b.top === b.right && b.right === b.bottom && b.bottom === b.left)
        return spacing("p", { allowFull: false });
      if (b.top === b.bottom && b.right === b.left) {
        const py = spacingClass("py", b.top, { preferScale });
        const px = spacingClass("px", b.right, { preferScale });

        return [py, px].some((c) => c.includes("["))
          ? arbitraryValue([py, px])
          : scale([py, px]);
      }
      const classes = [
        spacingClass("pt", b.top, { preferScale }),
        spacingClass("pr", b.right, { preferScale }),
        spacingClass("pb", b.bottom, { preferScale }),
        spacingClass("pl", b.left, { preferScale }),
      ];

      return classes.some((c) => c.includes("["))
        ? arbitraryValue(classes)
        : scale(classes);
    }
    case "padding-top":
      return spacing("pt");
    case "padding-right":
      return spacing("pr");
    case "padding-bottom":
      return spacing("pb");
    case "padding-left":
      return spacing("pl");
    case "margin": {
      const b = expandBox(value);

      if (b.top === b.right && b.right === b.bottom && b.bottom === b.left)
        return spacing("m", { allowAuto: true });
      if (b.top === b.bottom && b.right === b.left) {
        const my = spacingClass("my", b.top, { preferScale, allowAuto: true });
        const mx = spacingClass("mx", b.right, { preferScale, allowAuto: true });

        return [my, mx].some((c) => c.includes("["))
          ? arbitraryValue([my, mx])
          : scale([my, mx]);
      }
      const classes = [
        spacingClass("mt", b.top, { preferScale, allowAuto: true }),
        spacingClass("mr", b.right, { preferScale, allowAuto: true }),
        spacingClass("mb", b.bottom, { preferScale, allowAuto: true }),
        spacingClass("ml", b.left, { preferScale, allowAuto: true }),
      ];

      return classes.some((c) => c.includes("["))
        ? arbitraryValue(classes)
        : scale(classes);
    }
    case "margin-top":
      return spacing("mt", { allowAuto: true });
    case "margin-right":
      return spacing("mr", { allowAuto: true });
    case "margin-bottom":
      return spacing("mb", { allowAuto: true });
    case "margin-left":
      return spacing("ml", { allowAuto: true });
    case "gap":
      return spacing("gap");
    case "row-gap":
      return spacing("gap-y");
    case "column-gap":
      return spacing("gap-x");

    // Flexbox / Grid
    case "flex-direction":
      return (
        keyword({
          row: "flex-row",
          "row-reverse": "flex-row-reverse",
          column: "flex-col",
          "column-reverse": "flex-col-reverse",
        }) ?? arbitraryProperty()
      );
    case "flex-wrap":
      return (
        keyword({ wrap: "flex-wrap", nowrap: "flex-nowrap", "wrap-reverse": "flex-wrap-reverse" }) ??
        arbitraryProperty()
      );
    case "justify-content":
      return (
        keyword({
          "flex-start": "justify-start",
          start: "justify-start",
          "flex-end": "justify-end",
          end: "justify-end",
          center: "justify-center",
          "space-between": "justify-between",
          "space-around": "justify-around",
          "space-evenly": "justify-evenly",
        }) ?? arbitraryProperty()
      );
    case "align-items":
      return (
        keyword({
          "flex-start": "items-start",
          start: "items-start",
          "flex-end": "items-end",
          end: "items-end",
          center: "items-center",
          baseline: "items-baseline",
          stretch: "items-stretch",
        }) ?? arbitraryProperty()
      );
    case "align-content":
      return (
        keyword({
          "flex-start": "content-start",
          "flex-end": "content-end",
          center: "content-center",
          "space-between": "content-between",
          "space-around": "content-around",
          "space-evenly": "content-evenly",
        }) ?? arbitraryProperty()
      );
    case "align-self":
      return (
        keyword({
          auto: "self-auto",
          "flex-start": "self-start",
          "flex-end": "self-end",
          center: "self-center",
          stretch: "self-stretch",
          baseline: "self-baseline",
        }) ?? arbitraryProperty()
      );
    case "justify-self":
      return (
        keyword({
          auto: "justify-self-auto",
          start: "justify-self-start",
          end: "justify-self-end",
          center: "justify-self-center",
          stretch: "justify-self-stretch",
        }) ?? arbitraryProperty()
      );
    case "flex-grow": {
      const n = toUnitless(value);

      if (n === 0) return scale(["grow-0"]);
      if (n === 1) return scale(["grow"]);

      return arbitraryValue([`grow-${bracket(value)}`]);
    }
    case "flex-shrink": {
      const n = toUnitless(value);

      if (n === 0) return scale(["shrink-0"]);
      if (n === 1) return scale(["shrink"]);

      return arbitraryValue([`shrink-${bracket(value)}`]);
    }
    case "flex":
      return (
        keyword({ "1": "flex-1", "1 1 0%": "flex-1", auto: "flex-auto", none: "flex-none", initial: "flex-initial" }) ??
        arbitraryProperty()
      );
    case "order": {
      const n = toUnitless(value);

      if (value.toLowerCase() === "first") return scale(["order-first"]);
      if (value.toLowerCase() === "last") return scale(["order-last"]);
      if (n !== null && n >= 1 && n <= 12) return scale([`order-${n}`]);

      return arbitraryValue([`order-${bracket(value)}`]);
    }
    case "grid-template-columns": {
      const repeatMatch = value.match(/^repeat\(\s*(\d+)\s*,/i);

      if (repeatMatch) return scale([`grid-cols-${repeatMatch[1]}`]);

      return arbitraryProperty(
        "Complex grid-template-columns tracks aren't decomposed automatically.",
      );
    }
    case "grid-column": {
      const spanMatch = value.match(/^span\s+(\d+)/i);

      if (spanMatch) return scale([`col-span-${spanMatch[1]}`]);

      return arbitraryProperty();
    }
    case "grid-row": {
      const spanMatch = value.match(/^span\s+(\d+)/i);

      if (spanMatch) return scale([`row-span-${spanMatch[1]}`]);

      return arbitraryProperty();
    }

    // Typography
    case "font-size": {
      const px = toPx(value);

      if (px !== null) {
        const token = matchScaleToken(px, FONT_SIZE_SCALE);

        if (token !== null) return scale([`text-${token}`]);
      }

      return arbitraryValue([`text-${bracket(value)}`]);
    }
    case "font-weight": {
      const cls = FONT_WEIGHT_MAP[value.toLowerCase()];

      if (cls) return scale([`font-${cls}`]);

      return arbitraryValue([`font-${bracket(value)}`]);
    }
    case "font-style":
      return keyword({ italic: "italic", normal: "not-italic" }) ?? arbitraryProperty();
    case "font-family": {
      const v = value.toLowerCase();

      if (v.includes("monospace")) return scale(["font-mono"]);
      if (v.includes("serif") && !v.includes("sans-serif")) return scale(["font-serif"]);
      if (v.includes("sans-serif")) return scale(["font-sans"]);

      return arbitraryProperty(
        "Custom font stack - map this to a fontFamily token in tailwind.config.js instead.",
      );
    }
    case "line-height": {
      const n = toUnitless(value);

      if (n !== null) {
        const hit = LEADING_SCALE.find(([, v]) => Math.abs(v - n) < 0.01);

        if (hit) return scale([`leading-${hit[0]}`]);
      }

      return arbitraryValue([`leading-${bracket(value)}`]);
    }
    case "letter-spacing": {
      const v = value.trim();
      const emMatch = v.match(/^(-?\d*\.?\d+)em$/);

      if (emMatch) {
        const em = parseFloat(emMatch[1]);
        const hit = TRACKING_SCALE.find(([, val]) => Math.abs(val - em) < 0.002);

        if (hit) return scale([`tracking-${hit[0]}`]);
      }

      return arbitraryValue([`tracking-${bracket(value)}`]);
    }
    case "text-align":
      return (
        keyword({ left: "text-left", center: "text-center", right: "text-right", justify: "text-justify", start: "text-start", end: "text-end" }) ??
        arbitraryProperty()
      );
    case "text-transform":
      return (
        keyword({ uppercase: "uppercase", lowercase: "lowercase", capitalize: "capitalize", none: "normal-case" }) ??
        arbitraryProperty()
      );
    case "text-decoration":
    case "text-decoration-line":
      return (
        keyword({ underline: "underline", "line-through": "line-through", overline: "overline", none: "no-underline" }) ??
        arbitraryProperty()
      );
    case "text-overflow":
      return keyword({ ellipsis: "text-ellipsis", clip: "text-clip" }) ?? arbitraryProperty();
    case "white-space":
      return (
        keyword({
          normal: "whitespace-normal",
          nowrap: "whitespace-nowrap",
          pre: "whitespace-pre",
          "pre-line": "whitespace-pre-line",
          "pre-wrap": "whitespace-pre-wrap",
        }) ?? arbitraryProperty()
      );
    case "vertical-align":
      return (
        keyword({
          baseline: "align-baseline",
          top: "align-top",
          middle: "align-middle",
          bottom: "align-bottom",
          "text-top": "align-text-top",
          "text-bottom": "align-text-bottom",
        }) ?? arbitraryProperty()
      );
    case "color":
      return color("text");

    // Backgrounds / borders / effects
    case "background-color":
      return color("bg");
    case "background":
      if (isSimpleColorToken(value.trim())) return color("bg");

      return arbitraryProperty(
        "Shorthand background with images/gradients is preserved as-is rather than decomposed.",
      );
    case "border-radius": {
      const corners = expandCorners(value);

      if (corners.tl === corners.tr && corners.tr === corners.br && corners.br === corners.bl)
        return (() => {
          const cls = radiusClass("rounded", corners.tl, preferScale);

          return cls.includes("[") ? arbitraryValue([cls]) : scale([cls]);
        })();

      const classes = [
        radiusClass("rounded-tl", corners.tl, preferScale),
        radiusClass("rounded-tr", corners.tr, preferScale),
        radiusClass("rounded-br", corners.br, preferScale),
        radiusClass("rounded-bl", corners.bl, preferScale),
      ];

      return classes.some((c) => c.includes("["))
        ? arbitraryValue(classes)
        : scale(classes);
    }
    case "border": {
      const tokens = splitShorthandValues(value);
      const classes: string[] = [];
      let widthToken: string | null = null;
      let colorToken: string | null = null;
      let styleToken: string | null = null;

      tokens.forEach((t) => {
        const lower = t.toLowerCase();

        if (BORDER_STYLE_KEYWORDS.has(lower)) styleToken = lower;
        else if (toPx(t) !== null) widthToken = t;
        else colorToken = t;
      });

      if (styleToken) {
        const styleMap: Record<string, string> = {
          solid: "border-solid",
          dashed: "border-dashed",
          dotted: "border-dotted",
          double: "border-double",
          none: "border-none",
          hidden: "border-hidden",
        };

        classes.push(styleMap[styleToken] ?? `[border-style:${styleToken}]`);
      }
      if (widthToken) {
        const px = toPx(widthToken);

        if (px === 1) classes.push("border");
        else if (px !== null) {
          const token = matchScaleToken(px, BORDER_WIDTH_SCALE);

          classes.push(token !== null ? `border-${token}` : `border-${bracket(widthToken)}`);
        }
      } else if (!styleToken || styleToken !== "none") {
        classes.push("border");
      }
      if (colorToken) classes.push(colorClass("border", colorToken));

      return classes.some((c) => c.includes("["))
        ? arbitraryValue(classes)
        : scale(classes);
    }
    case "border-width":
      return spacing("border", { allowFull: false });
    case "border-color":
      return color("border");
    case "border-style": {
      const styleMap: Record<string, string> = {
        solid: "border-solid",
        dashed: "border-dashed",
        dotted: "border-dotted",
        double: "border-double",
        none: "border-none",
        hidden: "border-hidden",
      };

      return styleMap[value.toLowerCase()]
        ? scale([styleMap[value.toLowerCase()]])
        : arbitraryProperty();
    }
    case "box-shadow":
      return value.toLowerCase() === "none"
        ? scale(["shadow-none"])
        : arbitraryValue([`shadow-${bracket(value)}`]);
    case "opacity": {
      const n = toUnitless(value);
      const percent = n !== null ? (n <= 1 ? n * 100 : n) : null;

      if (percent !== null) {
        const rounded = Math.round(percent / 5) * 5;

        if (Math.abs(rounded - percent) < 0.5 && rounded >= 0 && rounded <= 100)
          return scale([`opacity-${rounded}`]);
      }

      return arbitraryValue([`opacity-${bracket(value)}`]);
    }
    case "outline": {
      if (value.toLowerCase() === "none") return scale(["outline-none"]);

      return arbitraryProperty();
    }
    case "cursor": {
      const known = new Set([
        "pointer",
        "default",
        "not-allowed",
        "wait",
        "grab",
        "grabbing",
        "text",
        "move",
        "help",
        "zoom-in",
        "zoom-out",
        "progress",
        "crosshair",
        "auto",
        "none",
      ]);

      return known.has(value.toLowerCase())
        ? scale([`cursor-${value.toLowerCase()}`])
        : arbitraryValue([`cursor-${bracket(value)}`]);
    }
    case "visibility":
      return keyword({ visible: "visible", hidden: "invisible", collapse: "collapse" }) ?? arbitraryProperty();
    case "pointer-events":
      return keyword({ none: "pointer-events-none", auto: "pointer-events-auto" }) ?? arbitraryProperty();
    case "user-select":
      return (
        keyword({ none: "select-none", text: "select-text", all: "select-all", auto: "select-auto" }) ??
        arbitraryProperty()
      );
    case "list-style-type":
      return keyword({ none: "list-none", disc: "list-disc", decimal: "list-decimal" }) ?? arbitraryProperty();
    case "object-fit":
      return (
        keyword({ contain: "object-contain", cover: "object-cover", fill: "object-fill", none: "object-none", "scale-down": "object-scale-down" }) ??
        arbitraryProperty()
      );
    case "resize":
      return (
        keyword({ none: "resize-none", both: "resize", horizontal: "resize-x", vertical: "resize-y" }) ??
        arbitraryProperty()
      );

    // Transitions
    case "transition-property":
      return (
        keyword({
          all: "transition-all",
          none: "transition-none",
          opacity: "transition-opacity",
          transform: "transition-transform",
          color: "transition-colors",
          "background-color": "transition-colors",
          "border-color": "transition-colors",
        }) ?? arbitraryProperty()
      );
    case "transition-duration": {
      const ms = value.toLowerCase().endsWith("ms")
        ? parseFloat(value)
        : parseFloat(value) * 1000;
      const token = matchScaleToken(ms, DURATION_SCALE);

      return token !== null ? scale([`duration-${token}`]) : arbitraryValue([`duration-${bracket(value)}`]);
    }
    case "transition-delay": {
      const ms = value.toLowerCase().endsWith("ms")
        ? parseFloat(value)
        : parseFloat(value) * 1000;
      const token = matchScaleToken(ms, DURATION_SCALE);

      return token !== null ? scale([`delay-${token}`]) : arbitraryValue([`delay-${bracket(value)}`]);
    }
    case "transition-timing-function":
      return (
        keyword({
          linear: "ease-linear",
          "ease-in": "ease-in",
          "ease-out": "ease-out",
          "ease-in-out": "ease-in-out",
        }) ?? arbitraryValue([`ease-${bracket(value)}`])
      );

    default:
      return arbitraryProperty();
  }
}

// ── Selector / at-rule parsing ──────────────────────────────────────────────

function extractVariants(selector: string): {
  variantPrefix: string;
  unrecognizedPseudos: string[];
} {
  const withoutFunctions = selector.replace(/\([^)]*\)/g, "");
  const matches = [...withoutFunctions.matchAll(/::?([a-zA-Z-]+)/g)].map((m) => m[1]);

  let variantPrefix = "";
  const unrecognizedPseudos: string[] = [];

  matches.forEach((pseudo) => {
    const mapped = PSEUDO_VARIANTS[pseudo];

    if (mapped) variantPrefix += mapped;
    else unrecognizedPseudos.push(pseudo);
  });

  return { variantPrefix, unrecognizedPseudos };
}

function extractMediaPrefix(header: string): { prefix: string; note?: string } {
  const minMatch = header.match(/min-width:\s*(\d+)px/);
  const maxMatch = header.match(/max-width:\s*(\d+)px/);

  if (minMatch) {
    const px = parseInt(minMatch[1], 10);
    const hit = [...BREAKPOINTS].reverse().find(([, v]) => v <= px);

    if (hit) return { prefix: `${hit[0]}:` };
  }
  if (maxMatch) {
    const px = parseInt(maxMatch[1], 10);
    const hit = BREAKPOINTS.find(([, v]) => v - 1 <= px);

    if (hit) return { prefix: `max-${hit[0]}:` };
  }

  return {
    prefix: "",
    note: `Media query "${header}" doesn't map to a default Tailwind breakpoint - kept ungrouped.`,
  };
}

// ── Block splitting (brace-depth aware, so nested @media works) ────────────

interface RawBlock {
  header: string;
  body: string;
}

function splitBlocks(css: string): RawBlock[] {
  const blocks: RawBlock[] = [];
  let depth = 0;
  let headerStart = 0;
  let bodyStart = -1;

  for (let i = 0; i < css.length; i++) {
    const ch = css[i];

    if (ch === "{") {
      if (depth === 0) bodyStart = i + 1;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && bodyStart !== -1) {
        const header = css.slice(headerStart, bodyStart - 1).trim();
        const body = css.slice(bodyStart, i);

        if (header) blocks.push({ header, body });
        headerStart = i + 1;
        bodyStart = -1;
      }
    }
  }

  return blocks;
}

function parseDeclarations(body: string): { property: string; value: string }[] {
  return body
    .split(";")
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => {
      const idx = d.indexOf(":");

      if (idx === -1) return null;

      return { property: d.slice(0, idx).trim(), value: d.slice(idx + 1).trim() };
    })
    .filter((d): d is { property: string; value: string } => d !== null);
}

function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

// ── Orchestration ───────────────────────────────────────────────────────────

function buildRule(
  selector: string,
  body: string,
  mediaPrefix: string | null,
  mediaNote: string | undefined,
  preferScale: boolean,
): ConvertedRule {
  const { variantPrefix, unrecognizedPseudos } = extractVariants(selector);
  const declarations = parseDeclarations(body).map((d) =>
    resolveDeclaration(d.property, d.value, preferScale),
  );
  const prefix = `${mediaPrefix ?? ""}${variantPrefix}`;
  const classNames = declarations
    .flatMap((d) => d.classes)
    .map((c) => `${prefix}${c}`)
    .join(" ");

  return {
    selector: selector.trim(),
    mediaPrefix,
    mediaNote,
    variantPrefix,
    unrecognizedPseudos,
    declarations,
    classNames,
  };
}

export function convertCss(input: string, options: ConvertOptions = {}): ConvertResult {
  const preferScale = options.preferScale ?? true;
  const cleaned = stripComments(input).trim();
  const wrapped = cleaned.includes("{") ? cleaned : `.element {\n${cleaned}\n}`;
  const topBlocks = splitBlocks(wrapped);
  const rules: ConvertedRule[] = [];

  topBlocks.forEach((block) => {
    if (/^@media/i.test(block.header)) {
      const { prefix, note } = extractMediaPrefix(block.header);
      const innerBlocks = splitBlocks(block.body);

      innerBlocks.forEach((inner) => {
        inner.header.split(",").forEach((sel) => {
          rules.push(buildRule(sel.trim(), inner.body, prefix || null, note, preferScale));
        });
      });

      return;
    }

    block.header.split(",").forEach((sel) => {
      rules.push(buildRule(sel.trim(), block.body, null, undefined, preferScale));
    });
  });

  const totals = { declarations: 0, scale: 0, arbitraryValue: 0, arbitraryProperty: 0 };

  rules.forEach((rule) => {
    rule.declarations.forEach((d) => {
      totals.declarations++;
      if (d.tier === "scale") totals.scale++;
      else if (d.tier === "arbitrary-value") totals.arbitraryValue++;
      else totals.arbitraryProperty++;
    });
  });

  return { rules, totals };
}
