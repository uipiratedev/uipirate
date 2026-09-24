import { ImageResponse } from "next/og";

import { getBotById } from "@/data/bots";

import { OGTemplate } from "../../../../_og/template";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateImageMetadata({ params }: { params: { id: string } }) {
  const bot = getBotById(params.id);

  return [
    {
      id: params.id,
      alt: bot
        ? `${bot.name} (${bot.company}) Crawler Profile | UI Pirate`
        : "AI Bot Directory | UI Pirate",
    },
  ];
}

export default function Image({ params }: { params: { id: string } }) {
  const bot = getBotById(params.id);

  const badge = bot?.categoryLabel ?? "AI Bot Directory";
  const title = bot?.name ?? "AI Bot Directory";
  const description =
    bot?.description ??
    "User-Agent tokens, robots.txt rules, and SEO impact for every major AI crawler.";

  return new ImageResponse(
    (
      <OGTemplate
        badge={badge}
        description={description}
        title={title}
        titleHighlight={bot?.company}
      />
    ),
    { ...size },
  );
}
