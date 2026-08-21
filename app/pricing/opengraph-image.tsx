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
      description="No contracts. 48hr turnaround. UX/UI design + Angular.js/React/Next.js development. Save 60% vs US agencies. 100% satisfaction guarantee."
      title="$2,000/mo."
      titleHighlight="Design & Development."
    />,
    { ...size },
  );
}
