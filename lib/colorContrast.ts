// WCAG 2.1 and APCA (Accessible Perceptual Contrast Algorithm) color
// contrast math.
//
// WCAG's contrast ratio formula (the one browsers, DevTools, and most linters
// use today) is a simple luminance ratio. It's well understood but known to
// be inaccurate at the extremes - it can rate light-gray-on-white as "AA
// compliant" while it's nearly unreadable, and can fail some genuinely
// readable dark-mode combinations.
//
// APCA is the perceptually-calibrated successor designed for WCAG 3 and
// implemented here from the reference "SAPC/APCA-W3" algorithm (Myndex),
// reproduced faithfully (constants and formula structure) rather than
// approximated, since an approximated contrast algorithm is worse than none.

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function clamp255(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

export function parseColor(input: string): RGB | null {
  const value = input.trim();

  const hexMatch = value.match(/^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);

  if (hexMatch) {
    let hex = hexMatch[1];

    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    return { r, g, b };
  }

  const rgbMatch = value.match(
    /^rgba?\(\s*(\d{1,3})\s*,?\s*(\d{1,3})\s*,?\s*(\d{1,3})\s*(?:[,/]\s*[\d.]+\s*)?\)$/i,
  );

  if (rgbMatch) {
    return {
      r: clamp255(Number(rgbMatch[1])),
      g: clamp255(Number(rgbMatch[2])),
      b: clamp255(Number(rgbMatch[3])),
    };
  }

  const hslMatch = value.match(
    /^hsla?\(\s*([\d.]+)\s*,?\s*([\d.]+)%\s*,?\s*([\d.]+)%\s*(?:[,/]\s*[\d.]+\s*)?\)$/i,
  );

  if (hslMatch) {
    return hslToRgb(Number(hslMatch[1]), Number(hslMatch[2]), Number(hslMatch[3]));
  }

  return null;
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  const hue = ((h % 360) + 360) % 360;
  const sat = s / 100;
  const light = l / 100;

  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = light - c / 2;

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (hue < 60) [r1, g1, b1] = [c, x, 0];
  else if (hue < 120) [r1, g1, b1] = [x, c, 0];
  else if (hue < 180) [r1, g1, b1] = [0, c, x];
  else if (hue < 240) [r1, g1, b1] = [0, x, c];
  else if (hue < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];

  return {
    r: clamp255((r1 + m) * 255),
    g: clamp255((g1 + m) * 255),
    b: clamp255((b1 + m) * 255),
  };
}

export function rgbToHsl({ r, g, b }: RGB): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l: l * 100 };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;

  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
  else if (max === gn) h = ((bn - rn) / d + 2) * 60;
  else h = ((rn - gn) / d + 4) * 60;

  return { h, s: s * 100, l: l * 100 };
}

export function rgbToHex({ r, g, b }: RGB): string {
  return `#${[r, g, b].map((c) => clamp255(c).toString(16).padStart(2, "0")).join("")}`;
}

// ─────────────────────────────────────────────────────────────
// WCAG 2.1 contrast
// ─────────────────────────────────────────────────────────────

function srgbChannelToLinear(c: number): number {
  const cs = c / 255;

  return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
}

export function wcagRelativeLuminance({ r, g, b }: RGB): number {
  return (
    0.2126 * srgbChannelToLinear(r) +
    0.7152 * srgbChannelToLinear(g) +
    0.0722 * srgbChannelToLinear(b)
  );
}

export function wcagContrastRatio(a: RGB, b: RGB): number {
  const l1 = wcagRelativeLuminance(a);
  const l2 = wcagRelativeLuminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export interface WcagVerdict {
  ratio: number;
  aaNormal: boolean;
  aaaNormal: boolean;
  aaLarge: boolean;
  aaaLarge: boolean;
  aaUiComponent: boolean;
}

// "Large text" per WCAG 2.1 SC 1.4.3 is >=18pt (~24px) regular, or >=14pt
// (~18.66px) bold. SC 1.4.11 (non-text contrast) sets a 3:1 floor for UI
// components and graphical objects.
export function evaluateWcag(ratio: number): WcagVerdict {
  return {
    ratio,
    aaNormal: ratio >= 4.5,
    aaaNormal: ratio >= 7,
    aaLarge: ratio >= 3,
    aaaLarge: ratio >= 4.5,
    aaUiComponent: ratio >= 3,
  };
}

// ─────────────────────────────────────────────────────────────
// APCA (SAPC-APCA reference algorithm, reproduced faithfully)
// ─────────────────────────────────────────────────────────────

const SA98G = {
  mainTRC: 2.4,
  sRco: 0.2126729,
  sGco: 0.7151522,
  sBco: 0.072175,
  normBG: 0.56,
  normTXT: 0.57,
  revTXT: 0.62,
  revBG: 0.65,
  blkThrs: 0.022,
  blkClmp: 1.414,
  scaleBoW: 1.14,
  scaleWoB: 1.14,
  loBoWoffset: 0.027,
  loWoBoffset: 0.027,
  deltaYmin: 0.0005,
  loClip: 0.1,
};

export function apcaY({ r, g, b }: RGB): number {
  const exp = (chan: number) => Math.pow(chan / 255, SA98G.mainTRC);

  return SA98G.sRco * exp(r) + SA98G.sGco * exp(g) + SA98G.sBco * exp(b);
}

// text = foreground/text color, bg = background color. Polarity matters:
// swapping the two arguments is not the same as negating the result, which
// is why APCA deliberately returns an asymmetric signed value.
export function apcaContrast(textRgb: RGB, bgRgb: RGB): number {
  let txtY = apcaY(textRgb);
  let bgY = apcaY(bgRgb);

  txtY = txtY > SA98G.blkThrs ? txtY : txtY + Math.pow(SA98G.blkThrs - txtY, SA98G.blkClmp);
  bgY = bgY > SA98G.blkThrs ? bgY : bgY + Math.pow(SA98G.blkThrs - bgY, SA98G.blkClmp);

  if (Math.abs(bgY - txtY) < SA98G.deltaYmin) return 0;

  let sapc: number;
  let outputContrast: number;

  if (bgY > txtY) {
    sapc = (Math.pow(bgY, SA98G.normBG) - Math.pow(txtY, SA98G.normTXT)) * SA98G.scaleBoW;
    outputContrast = sapc < SA98G.loClip ? 0 : sapc - SA98G.loBoWoffset;
  } else {
    sapc = (Math.pow(bgY, SA98G.revBG) - Math.pow(txtY, SA98G.revTXT)) * SA98G.scaleWoB;
    outputContrast = sapc > -SA98G.loClip ? 0 : sapc + SA98G.loWoBoffset;
  }

  return outputContrast * 100;
}

export interface ApcaVerdict {
  lc: number;
  absLc: number;
  polarity: "text-on-light" | "text-on-dark" | "none";
  recommendedUse: string;
}

// Thresholds from the APCA "Conformant Font Use Table" (Bronze Simple Mode
// guidance): each Lc level is a minimum for a category of use, not a
// pass/fail cliff the way WCAG's 4.5:1 is.
export function evaluateApca(lc: number): ApcaVerdict {
  const absLc = Math.abs(lc);
  let recommendedUse: string;

  if (absLc >= 90) recommendedUse = "Body text at any reasonable weight/size";
  else if (absLc >= 75) recommendedUse = "Fluent body text (16px+ regular)";
  else if (absLc >= 60) recommendedUse = "Larger text (24px+) or bold sub-headings";
  else if (absLc >= 45) recommendedUse = "Large text only (36px+) or non-text UI components";
  else if (absLc >= 30) recommendedUse = "Spot text / decorative text only - avoid for content";
  else recommendedUse = "Not usable for text at any size";

  return {
    lc,
    absLc,
    polarity: lc === 0 ? "none" : lc > 0 ? "text-on-light" : "text-on-dark",
    recommendedUse,
  };
}

export interface ContrastComparison {
  foreground: RGB;
  background: RGB;
  wcag: WcagVerdict;
  apca: ApcaVerdict;
}

export function compareContrast(foreground: RGB, background: RGB): ContrastComparison {
  return {
    foreground,
    background,
    wcag: evaluateWcag(wcagContrastRatio(foreground, background)),
    apca: evaluateApca(apcaContrast(foreground, background)),
  };
}
