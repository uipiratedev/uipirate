import { ImageResponse } from "next/og";

import { ALL_DASHBOARD_COMPONENTS } from "@/screens/uiComponents/dashboardComponents";

import { OGTemplate } from "../../_og/template";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateImageMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const component = ALL_DASHBOARD_COMPONENTS.find((c) => c.id === params.slug);

  return [
    {
      id: params.slug,
      alt: component
        ? `${component.name} — Component Lab | UI Pirate`
        : "Component Lab | UI Pirate",
    },
  ];
}

export default function Image({ params }: { params: { slug: string } }) {
  const component = ALL_DASHBOARD_COMPONENTS.find((c) => c.id === params.slug);

  const badge = component?.categoryLabel ?? "Component Lab";
  const title = component?.name ?? "Component Lab";
  const description =
    component?.description ??
    "Interactive, copy-paste-ready React & Tailwind components by UI Pirate.";

  return new ImageResponse(
    (
      <OGTemplate
        badge={badge}
        description={description}
        title={title}
        titleHighlight="Component Lab"
      />
    ),
    { ...size },
  );
}
