import { ImageResponse } from "next/og";
import { OGTemplate } from "../_og/template";

export const runtime = "edge";
export const alt = "UI Pirate Pricing — $2,000/mo Unlimited Design";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OGTemplate
      badge="Transparent Pricing"
      title="$2,000/mo."
      titleHighlight="Unlimited Design."
      description="No contracts. 48hr turnaround. Save 60% vs US agencies. Or try a $350 5-day pilot first. 100% satisfaction guarantee."
    />,
    { ...size }
  );
}
