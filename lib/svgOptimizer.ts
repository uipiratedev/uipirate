// SVG optimizer and React/JSX exporter.
//
// This does real, deterministic cleanup of pasted SVG markup - no external
// service, nothing faked. It targets the specific bloat design tools
// (Figma, Illustrator, Inkscape) actually inject: editor-only namespaced
// elements/attributes, XML comments, pretty-printed indentation whitespace,
// empty wrapper groups, and unnecessarily high-precision path coordinates.
//
// The JSX exporter is a separate, composable step: it expects to run on
// already-optimized markup (the UI always chains optimize -> JSX) so it
// never has to deal with invalid-in-JSX namespaced tag names itself.

import * as cheerio from "cheerio";
import type { AnyNode, Element } from "domhandler";

export interface OptimizeOptions {
  precision: number;
  removeComments: boolean;
  removeEditorData: boolean;
  removeDimensions: boolean;
}

const DEFAULT_OPTIONS: OptimizeOptions = {
  precision: 2,
  removeComments: true,
  removeEditorData: true,
  removeDimensions: false,
};

export interface OptimizeStats {
  originalBytes: number;
  optimizedBytes: number;
  savingsBytes: number;
  savingsPercent: number;
  commentsRemoved: number;
  editorNodesRemoved: number;
  emptyGroupsRemoved: number;
  numbersRounded: number;
}

export interface OptimizeResult {
  output: string;
  stats: OptimizeStats;
}

const EDITOR_PREFIXES = ["inkscape", "sodipodi", "dc", "cc", "rdf", "adobe", "i", "a"];
const NUMERIC_ATTRS = new Set([
  "d",
  "points",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "x",
  "y",
  "x1",
  "y1",
  "x2",
  "y2",
  "width",
  "height",
  "offset",
  "stroke-width",
  "stroke-dasharray",
  "stroke-dashoffset",
  "font-size",
]);
const TEXT_BEARING_TAGS = new Set(["text", "tspan", "title", "desc", "style", "script"]);

function byteLength(s: string): number {
  return new TextEncoder().encode(s).length;
}

function roundNumbersInValue(value: string, precision: number): { result: string; count: number } {
  let count = 0;
  const result = value.replace(/-?\d+\.\d+/g, (match) => {
    // Number(x.toFixed(n)) rounds to n decimals then drops trailing zeros
    // ("1.50" -> "1.5", "2.00" -> "2"), which String() then formats cleanly.
    const rounded = Number(Number(match).toFixed(precision));
    const normalized = String(rounded);

    if (normalized !== match) count++;

    return normalized;
  });

  return { result, count };
}

function stripWhitespaceTextNodes($: cheerio.CheerioAPI, node: AnyNode): void {
  const el = node as Element;

  if (el.type !== "tag") return;

  const keepText = TEXT_BEARING_TAGS.has(el.name);

  for (const child of [...el.children]) {
    if (child.type === "text") {
      if (!keepText && /^\s*$/.test(child.data)) {
        $(child).remove();
      }
    } else if (child.type === "tag") {
      stripWhitespaceTextNodes($, child);
    }
  }
}

export function optimizeSvg(rawInput: string, userOptions: Partial<OptimizeOptions> = {}): OptimizeResult {
  const options: OptimizeOptions = { ...DEFAULT_OPTIONS, ...userOptions };
  const originalBytes = byteLength(rawInput);
  const withoutDeclaration = rawInput.replace(/<\?xml[^>]*\?>\s*/i, "");

  const $ = cheerio.load(withoutDeclaration, { xmlMode: true });

  let commentsRemoved = 0;
  let editorNodesRemoved = 0;
  let numbersRounded = 0;
  let emptyGroupsRemoved = 0;

  if (options.removeComments) {
    $.root()
      .find("*")
      .addBack()
      .contents()
      .each((_, node) => {
        if (node.type === "comment") {
          commentsRemoved++;
          $(node).remove();
        }
      });
  }

  if (options.removeEditorData) {
    $("*").each((_, node) => {
      const el = node as Element;
      const tagPrefix = el.name.includes(":") ? el.name.split(":")[0] : null;

      if (tagPrefix && EDITOR_PREFIXES.includes(tagPrefix)) {
        editorNodesRemoved++;
        $(el).remove();

        return;
      }

      for (const key of Object.keys(el.attribs)) {
        const attrPrefix = key.includes(":") ? key.split(":")[0] : null;

        if (attrPrefix && EDITOR_PREFIXES.includes(attrPrefix)) {
          delete el.attribs[key];
          editorNodesRemoved++;
        }
      }
    });
    $("metadata").each((_, el) => {
      editorNodesRemoved++;
      $(el).remove();
    });
  }

  const svgRoot = $("svg").get(0) as Element | undefined;

  if (options.removeDimensions && svgRoot && "viewBox" in svgRoot.attribs) {
    delete svgRoot.attribs.width;
    delete svgRoot.attribs.height;
  }

  $("*").each((_, node) => {
    const el = node as Element;

    for (const [key, value] of Object.entries(el.attribs)) {
      if (NUMERIC_ATTRS.has(key)) {
        const { result, count } = roundNumbersInValue(value, options.precision);

        if (count > 0) {
          el.attribs[key] = result;
          numbersRounded += count;
        }
      }
    }
  });

  if (svgRoot) stripWhitespaceTextNodes($, svgRoot);

  // Collapse redundant <g> wrappers across multiple passes, since collapsing
  // one level can make its parent newly empty/redundant too. Two cases:
  // a <g> with no attributes and NO children is pure waste (remove it); a
  // <g> with no attributes and exactly ONE child element is a no-op
  // pass-through wrapper (Illustrator/Figma commonly nest 2-3 of these
  // around a single path) - replace it with its child directly.
  for (let pass = 0; pass < 5; pass++) {
    let changedThisPass = false;

    $("g").each((_, node) => {
      const el = node as Element;
      const hasAttrs = Object.keys(el.attribs).length > 0;
      const elementChildren = el.children.filter((c) => c.type === "tag");
      const hasText = el.children.some((c) => c.type === "text" && c.data.trim().length > 0);

      if (hasAttrs || hasText) return;

      if (elementChildren.length === 0) {
        emptyGroupsRemoved++;
        $(el).remove();
        changedThisPass = true;
      } else if (elementChildren.length === 1) {
        $(el).replaceWith(elementChildren[0]);
        emptyGroupsRemoved++;
        changedThisPass = true;
      }
    });

    if (!changedThisPass) break;
  }

  const output = $.xml().trim();
  const optimizedBytes = byteLength(output);
  const savingsBytes = Math.max(0, originalBytes - optimizedBytes);

  return {
    output,
    stats: {
      originalBytes,
      optimizedBytes,
      savingsBytes,
      savingsPercent: originalBytes > 0 ? (savingsBytes / originalBytes) * 100 : 0,
      commentsRemoved,
      editorNodesRemoved,
      emptyGroupsRemoved,
      numbersRounded,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// React / JSX export
// ─────────────────────────────────────────────────────────────

function attrNameToJsx(name: string): string {
  if (name === "class") return "className";
  if (name === "for") return "htmlFor";
  if (name === "tabindex") return "tabIndex";

  if (name.includes(":")) {
    const [first, ...rest] = name.split(":");

    return first + rest.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
  }

  if (name.startsWith("aria-") || name.startsWith("data-")) return name;

  if (name.includes("-")) {
    const [first, ...rest] = name.split("-");

    return first + rest.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
  }

  return name;
}

function cssStyleToJsxObjectLiteral(styleValue: string): string {
  const declarations = styleValue
    .split(";")
    .map((d) => d.trim())
    .filter(Boolean);

  const entries = declarations
    .map((decl) => {
      const idx = decl.indexOf(":");

      if (idx === -1) return null;

      const rawProp = decl.slice(0, idx).trim();
      const value = decl.slice(idx + 1).trim().replace(/"/g, '\\"');
      const prop = rawProp.startsWith("--")
        ? `"${rawProp}"`
        : rawProp.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

      return `${prop}: "${value}"`;
    })
    .filter((x): x is string => x !== null);

  return `{{ ${entries.join(", ")} }}`;
}

function escapeAttrValue(value: string): string {
  return value.replace(/"/g, "&quot;");
}

function attrsToJsx(el: Element): string[] {
  return Object.entries(el.attribs).map(([key, value]) => {
    const jsxName = attrNameToJsx(key);

    if (jsxName === "style") return `style=${cssStyleToJsxObjectLiteral(value)}`;

    return `${jsxName}="${escapeAttrValue(value)}"`;
  });
}

function serializeChild(node: AnyNode, depth: number): string {
  const indent = "  ".repeat(depth);

  if (node.type === "text") {
    const text = node.data.trim();

    return text ? `${indent}{${JSON.stringify(text)}}\n` : "";
  }

  if (node.type !== "tag") return "";

  const el = node as Element;
  const attrs = attrsToJsx(el);
  const openTag = `<${el.name}${attrs.length ? " " + attrs.join(" ") : ""}`;
  const children = el.children.filter((c) => !(c.type === "text" && !c.data.trim()));

  if (children.length === 0) return `${indent}${openTag} />\n`;

  const inner = children.map((c) => serializeChild(c, depth + 1)).join("");

  return `${indent}${openTag}>\n${inner}${indent}</${el.name}>\n`;
}

export interface JsxOptions {
  componentName: string;
  typescript: boolean;
}

export function svgToJsx(optimizedSvg: string, userOptions: Partial<JsxOptions> = {}): string {
  const componentName = userOptions.componentName?.trim() || "Icon";
  const typescript = userOptions.typescript ?? true;

  const $ = cheerio.load(optimizedSvg, { xmlMode: true });
  const svgEl = $("svg").get(0) as Element | undefined;

  if (!svgEl) return "";

  const rootAttrs = [...attrsToJsx(svgEl), "{...props}"];
  const children = svgEl.children.filter((c) => !(c.type === "text" && !c.data.trim()));
  const inner = children.map((c) => serializeChild(c, 2)).join("");
  const rootOpenTag = `<${svgEl.name} ${rootAttrs.join(" ")}>`;
  const jsxBody = `    ${rootOpenTag}\n${inner}    </${svgEl.name}>`;

  const header = typescript ? 'import type { SVGProps } from "react";\n\n' : "";
  const signature = typescript
    ? `export default function ${componentName}(props: SVGProps<SVGSVGElement>) {`
    : `export default function ${componentName}(props) {`;

  return `${header}${signature}\n  return (\n${jsxBody}\n  );\n}\n`;
}
