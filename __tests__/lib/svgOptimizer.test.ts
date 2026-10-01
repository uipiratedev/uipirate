import { describe, expect, it } from "vitest";

import { optimizeSvg, svgToJsx } from "@/lib/svgOptimizer";

const ILLUSTRATOR_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve">
<!-- Generator: Adobe Illustrator 24.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) -->
<metadata>
  <sfw xmlns="&ns_sfw;">
    <slices></slices>
  </sfw>
</metadata>
<g>
  <g>
    <path d="M12.001,2.001 C6.478,2.001 2.001,6.478 2.001,12.001 C2.001,17.524 6.478,22.001 12.001,22.001" fill="#FF5B04"/>
  </g>
</g>
</svg>
`;

const INKSCAPE_SVG = `<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   width="24"
   height="24"
   viewBox="0 0 24 24"
   inkscape:version="0.92.4">
  <sodipodi:namedview id="base" inkscape:zoom="16" />
  <metadata id="metadata8">
    <rdf:RDF />
  </metadata>
  <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1">
    <circle cx="12.123456" cy="12.987654" r="10.500000" fill="#1F2937" />
  </g>
</svg>`;

describe("optimizeSvg", () => {
  it("removes XML comments", () => {
    const result = optimizeSvg(ILLUSTRATOR_SVG);

    expect(result.output).not.toContain("<!--");
    expect(result.stats.commentsRemoved).toBe(1);
  });

  it("removes the XML declaration prologue", () => {
    const result = optimizeSvg(ILLUSTRATOR_SVG);

    expect(result.output).not.toContain("<?xml");
  });

  it("removes <metadata> blocks", () => {
    const result = optimizeSvg(ILLUSTRATOR_SVG);

    expect(result.output).not.toContain("<metadata");
    expect(result.output).not.toContain("<sfw");
  });

  it("removes Inkscape/Sodipodi/RDF namespaced elements and attributes", () => {
    const result = optimizeSvg(INKSCAPE_SVG);

    expect(result.output).not.toContain("sodipodi:");
    expect(result.output).not.toContain("inkscape:");
    expect(result.output).not.toContain("rdf:");
    expect(result.output).not.toContain("<metadata");
  });

  it("preserves the actual drawing content (path/circle data and fill)", () => {
    const illustrator = optimizeSvg(ILLUSTRATOR_SVG);

    expect(illustrator.output).toContain("fill=\"#FF5B04\"");

    const inkscape = optimizeSvg(INKSCAPE_SVG);

    expect(inkscape.output).toContain('fill="#1F2937"');
  });

  it("collapses redundant attribute-less single-child <g> wrappers", () => {
    const result = optimizeSvg(ILLUSTRATOR_SVG);
    const gCount = (result.output.match(/<g[\s/>]/g) ?? []).length;

    // The double-nested <g><g><path/></g></g> - neither <g> carries any
    // attributes and each wraps exactly one child - should collapse down to
    // the bare <path/>.
    expect(gCount).toBe(0);
    expect(result.output).toContain("<path");
  });

  it("keeps an attribute-less <g> that wraps more than one child", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0"/><path d="M1 1"/></g></svg>`;
    const result = optimizeSvg(svg);

    expect(result.output).toContain("<g>");
    expect((result.output.match(/<path/g) ?? []).length).toBe(2);
  });

  it("keeps a <g> that carries an attribute (e.g. a transform)", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><g transform="translate(1,1)"><path d="M0 0"/></g></svg>`;
    const result = optimizeSvg(svg);

    expect(result.output).toContain("<g transform=");
  });

  it("rounds long decimal coordinates to the requested precision", () => {
    const result = optimizeSvg(INKSCAPE_SVG, { precision: 2 });

    expect(result.output).toContain('cx="12.12"');
    expect(result.output).toContain('cy="12.99"');
    expect(result.output).toContain('r="10.5"');
    expect(result.stats.numbersRounded).toBeGreaterThan(0);
  });

  it("does not touch integers or attributes outside the numeric allow-list", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" id="icon-1.5"><rect x="1.23456" width="10" /></svg>`;
    const result = optimizeSvg(svg, { precision: 2 });

    expect(result.output).toContain('width="24"');
    // "id" is not in the numeric-attribute allow-list, so its value (even
    // though it contains a decimal-looking substring) must be untouched.
    expect(result.output).toContain('id="icon-1.5"');
  });

  it("removes width/height only when a viewBox exists to size from instead", () => {
    const withViewBox = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0"/></svg>`;
    const withoutViewBox = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M0 0"/></svg>`;

    const optimizedWith = optimizeSvg(withViewBox, { removeDimensions: true });
    const optimizedWithout = optimizeSvg(withoutViewBox, { removeDimensions: true });

    expect(optimizedWith.output).not.toContain("width=");
    expect(optimizedWithout.output).toContain('width="24"');
  });

  it("strips pretty-printed indentation whitespace between tags", () => {
    const result = optimizeSvg(INKSCAPE_SVG);

    expect(result.output).not.toMatch(/>\s{2,}</);
  });

  it("preserves whitespace-sensitive text content inside <text> elements", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><text x="0" y="0">  Hello World  </text></svg>`;
    const result = optimizeSvg(svg);

    expect(result.output).toContain("Hello World");
  });

  it("reports accurate byte savings stats", () => {
    const result = optimizeSvg(ILLUSTRATOR_SVG);

    expect(result.stats.optimizedBytes).toBeLessThan(result.stats.originalBytes);
    expect(result.stats.savingsBytes).toBe(result.stats.originalBytes - result.stats.optimizedBytes);
    expect(result.stats.savingsPercent).toBeGreaterThan(0);
    expect(result.stats.savingsPercent).toBeLessThanOrEqual(100);
  });

  it("produces exactly one well-formed root <svg> element", () => {
    const result = optimizeSvg(ILLUSTRATOR_SVG);

    expect(result.output.match(/<svg[\s>]/g)?.length).toBe(1);
    expect(result.output.trim().startsWith("<svg")).toBe(true);
  });

  it("respects removeComments: false", () => {
    const result = optimizeSvg(ILLUSTRATOR_SVG, { removeComments: false });

    expect(result.output).toContain("<!--");
  });

  it("respects removeEditorData: false", () => {
    const result = optimizeSvg(INKSCAPE_SVG, { removeEditorData: false });

    expect(result.output).toContain("sodipodi:");
  });
});

describe("svgToJsx", () => {
  const SIMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.8" fill="none"><path d="M12 2L2 7"/><g class="icon-group" data-testid="my-icon"><circle cx="12" cy="12" r="4"/></g></svg>`;

  it("wraps the SVG in a default-exported React component", () => {
    const jsx = svgToJsx(SIMPLE_SVG, { componentName: "MyIcon" });

    expect(jsx).toContain("export default function MyIcon(");
    expect(jsx).toContain("return (");
  });

  it("spreads {...props} onto the root <svg> element", () => {
    const jsx = svgToJsx(SIMPLE_SVG);

    expect(jsx).toMatch(/<svg[^>]*\{\.\.\.props\}[^>]*>/);
  });

  it("camelCases kebab-case presentation attributes", () => {
    const jsx = svgToJsx(SIMPLE_SVG);

    expect(jsx).toContain('strokeWidth="1.8"');
    expect(jsx).not.toContain("stroke-width");
  });

  it("renames class to className", () => {
    const jsx = svgToJsx(SIMPLE_SVG);

    expect(jsx).toContain('className="icon-group"');
    expect(jsx).not.toContain('class="icon-group"');
  });

  it("leaves data-* and aria-* attributes untouched", () => {
    const jsx = svgToJsx(SIMPLE_SVG);

    expect(jsx).toContain('data-testid="my-icon"');
  });

  it("converts an inline style attribute into a JSX style object", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><rect style="fill:#fff;stroke-width:2;" /></svg>`;
    const jsx = svgToJsx(svg);

    expect(jsx).toMatch(/style=\{\{\s*fill: "#fff",\s*strokeWidth: "2"\s*\}\}/);
  });

  it("emits TypeScript SVGProps typing by default", () => {
    const jsx = svgToJsx(SIMPLE_SVG);

    expect(jsx).toContain("SVGProps<SVGSVGElement>");
    expect(jsx).toContain('import type { SVGProps } from "react";');
  });

  it("omits TypeScript typing when typescript: false", () => {
    const jsx = svgToJsx(SIMPLE_SVG, { typescript: false });

    expect(jsx).not.toContain("SVGProps");
    expect(jsx).toContain("export default function Icon(props) {");
  });

  it("defaults the component name to 'Icon' when none is given", () => {
    const jsx = svgToJsx(SIMPLE_SVG, { componentName: "" });

    expect(jsx).toContain("function Icon(");
  });

  it("self-closes leaf elements and produces balanced tags for parents", () => {
    const jsx = svgToJsx(SIMPLE_SVG);

    expect(jsx).toContain("<path");
    expect(jsx).toMatch(/<path[^>]*\/>/);
    expect(jsx).toContain("</g>");
  });

  it("returns an empty string for markup with no root <svg>", () => {
    expect(svgToJsx("<div>not an svg</div>")).toBe("");
  });
});
