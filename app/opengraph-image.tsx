import { ImageResponse } from "next/og";
import { OGTemplate } from "./_og/template";

export const runtime = "edge";
export const alt = "UI Pirate — From Idea to Shipped Product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OGTemplate
      badge="Product Design Agency"
      title="From Idea to"
      titleHighlight="Shipped Product"
      description="Product thinking, competitive analysis & conversion-focused UX/UI design for complex SaaS, AI apps & enterprise software."
    />,
    { ...size }
  );
}
