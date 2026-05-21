import { ImageResponse } from "next/og";
import { OGTemplate } from "../_og/template";

export const runtime = "edge";
export const alt = "About UI Pirate — Product Design Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OGTemplate
      badge="Design & Development Agency"
      title="We Design, Build &"
      titleHighlight="Ship Products."
      description="Product thinking, UX/UI design & development. 9+ years, 50+ products shipped. From idea to production. We simplify complexity and design for conversion."
    />,
    { ...size }
  );
}
