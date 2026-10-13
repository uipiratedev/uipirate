import { describe, it, expect } from "vitest";

import { convertCss } from "@/lib/cssToTailwind";

describe("convertCss", () => {
  it("converts a bare declaration block with no selector", () => {
    const result = convertCss(`
      display: flex;
      padding: 16px;
      background-color: #FF5B04;
      border-radius: 8px;
    `);

    expect(result.rules).toHaveLength(1);
    expect(result.rules[0].classNames).toContain("flex");
    expect(result.rules[0].classNames).toContain("p-4");
    expect(result.rules[0].classNames).toContain("bg-[#FF5B04]");
    expect(result.rules[0].classNames).toContain("rounded-lg");
  });

  it("expands padding/margin shorthand correctly (1/2/3/4 values)", () => {
    const one = convertCss(".a { padding: 16px; }");

    expect(one.rules[0].classNames).toBe("p-4");

    const two = convertCss(".a { padding: 8px 16px; }");

    expect(two.rules[0].classNames).toBe("py-2 px-4");

    const four = convertCss(".a { margin: 4px 8px 12px 16px; }");

    expect(four.rules[0].classNames).toBe("mt-1 mr-2 mb-3 ml-4");
  });

  it("expands border-radius corners in TL/TR/BR/BL order", () => {
    const result = convertCss(".a { border-radius: 4px 8px 12px 16px; }");

    expect(result.rules[0].classNames).toBe(
      "rounded-tl rounded-tr-lg rounded-br-xl rounded-bl-2xl",
    );
  });

  it("falls back to arbitrary value syntax for off-scale spacing", () => {
    const result = convertCss(".a { padding: 13px; }");

    expect(result.rules[0].classNames).toBe("p-[13px]");
    expect(result.rules[0].declarations[0].tier).toBe("arbitrary-value");
  });

  it("falls back to arbitrary property syntax for fully unmapped properties", () => {
    const result = convertCss(".a { mask-type: luminance; }");

    expect(result.rules[0].classNames).toBe("[mask-type:luminance]");
    expect(result.rules[0].declarations[0].tier).toBe("arbitrary-property");
  });

  it("handles negative margins", () => {
    const result = convertCss(".a { margin-top: -8px; }");

    expect(result.rules[0].classNames).toBe("-mt-2");
  });

  it("converts percentage widths to Tailwind fractions", () => {
    const result = convertCss(".a { width: 50%; }");

    expect(result.rules[0].classNames).toBe("w-1/2");
  });

  it("maps pseudo-class selectors to Tailwind variants", () => {
    const result = convertCss(".btn:hover { background-color: #000; }");

    expect(result.rules[0].classNames).toBe("hover:bg-[#000]");
  });

  it("maps media queries to responsive breakpoint prefixes", () => {
    const result = convertCss(`
      @media (min-width: 768px) {
        .card { display: flex; }
      }
    `);

    expect(result.rules[0].classNames).toBe("md:flex");
    expect(result.rules[0].mediaPrefix).toBe("md:");
  });

  it("combines media + pseudo-class prefixes", () => {
    const result = convertCss(`
      @media (min-width: 1024px) {
        .btn:hover { color: red; }
      }
    `);

    expect(result.rules[0].classNames).toBe("lg:hover:text-[red]");
  });

  it("expands the border shorthand into style + width + color", () => {
    const result = convertCss(".a { border: 1px solid #E5E7EB; }");

    expect(result.rules[0].classNames).toBe("border-solid border border-[#E5E7EB]");
  });

  it("handles !important by prefixing classes with !", () => {
    const result = convertCss(".a { color: red !important; }");

    expect(result.rules[0].classNames).toBe("!text-[red]");
  });

  it("respects the preferScale=false option and always emits arbitrary values", () => {
    const result = convertCss(".a { padding: 16px; }", { preferScale: false });

    expect(result.rules[0].classNames).toBe("p-[16px]");
  });

  it("computes totals across tiers", () => {
    const result = convertCss(`
      .a {
        display: flex;
        padding: 13px;
        mask-type: luminance;
      }
    `);

    expect(result.totals.declarations).toBe(3);
    expect(result.totals.scale).toBe(1);
    expect(result.totals.arbitraryValue).toBe(1);
    expect(result.totals.arbitraryProperty).toBe(1);
  });

  it("handles multiple comma-separated selectors as independent rules", () => {
    const result = convertCss(".a, .b { display: block; }");

    expect(result.rules).toHaveLength(2);
    expect(result.rules[0].selector).toBe(".a");
    expect(result.rules[1].selector).toBe(".b");
  });

  it("converts font-size, font-weight, and line-height", () => {
    const result = convertCss(".a { font-size: 20px; font-weight: 700; line-height: 1.5; }");

    expect(result.rules[0].classNames).toBe("text-xl font-bold leading-normal");
  });
});
