import { ImageResponse } from "next/og";
import { OGTemplate } from "../_og/template";

export const runtime = "edge";
export const alt = "About UI Pirate — Product Design Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OGTemplate
      badge="About UI Pirate"
      title="We Ship Products. Not Just Designs."
      description="Product thinking, architecture, design & development. 9+ years of experience. 50+ shipped products. We simplify complexity and design for conversion."
    />,
    { ...size }
  );
}
