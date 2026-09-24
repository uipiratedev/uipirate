import { ImageResponse } from "next/og";

import products from "@/data/apps4sale.json";

import { OGTemplate } from "../../_og/template";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateImageMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const product = products.find((p) => p.slug === params.slug);

  return [
    {
      id: params.slug,
      alt: product ? `${product.title} | Apps 4 Sale` : "Apps 4 Sale | UI Pirate",
    },
  ];
}

export default function Image({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

  const badge = product?.category ?? "Apps 4 Sale";
  const title = product?.title ?? "Apps 4 Sale";
  const description =
    product?.subtitle ??
    product?.description ??
    "Ready-to-deploy, production-grade apps and systems by UI Pirate.";

  return new ImageResponse(
    (
      <OGTemplate
        badge={badge}
        description={description}
        title={title}
        titleHighlight="Ready to Deploy"
      />
    ),
    { ...size },
  );
}
