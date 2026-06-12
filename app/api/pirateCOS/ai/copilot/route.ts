import { NextRequest, NextResponse } from "next/server";

import { verifyAuth } from "@/lib/pirateCOS/auth";

interface WarningItem {
  id: string;
  type: "buzzword" | "bloat" | "heading" | "passive";
  message: string;
  match: string;
  suggestion: string;
}

const BUZZWORDS = [
  { word: "synergy", alt: "collaboration or integration" },
  { word: "synergies", alt: "collaborations or integrations" },
  { word: "disrupt", alt: "innovate or pioneer" },
  { word: "disruption", alt: "innovation or breakthrough" },
  { word: "streamline", alt: "simplify or automate" },
  { word: "leverage", alt: "use, apply, or execute" },
  { word: "paradigm shift", alt: "evolution or standard shift" },
  { word: "game changer", alt: "significant advancement" },
  { word: "outside the box", alt: "creatively or uniquely" },
  { word: "holistic", alt: "comprehensive" },
  { word: "robust", alt: "stable or resilient" },
];

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { content } = await request.json();

    if (typeof content !== "string") {
      return NextResponse.json(
        { success: false, error: "Content must be a string." },
        { status: 400 },
      );
    }

    const warnings: WarningItem[] = [];
    let idCounter = 1;

    // 1. Scan for Buzzwords (case-insensitive)
    for (const b of BUZZWORDS) {
      const regex = new RegExp(`\\b${b.word}\\b`, "gi");
      const matches = content.match(regex);

      if (matches && matches.length > 0) {
        warnings.push({
          id: `copilot-warning-${idCounter++}`,
          type: "buzzword",
          message: `Buzzword '${b.word}' detected. Elite professional copy avoids vague corporate clichés to maintain authority.`,
          match: matches[0],
          suggestion: `Replace with '${b.alt}'.`,
        });
      }
    }

    // 2. Scan for Paragraph Bloat (>150 words)
    // Extract paragraphs using HTML tags or double newlines
    const plainText = content.replace(/<[^>]*>/g, " ");
    const paragraphs = content.includes("<p>")
      ? content
          .split(/<\/p>\s*<p>/gi)
          .map((p) => p.replace(/<[^>]*>/g, "").trim())
      : content.split(/\n\n+/).map((p) => p.trim());

    for (let i = 0; i < paragraphs.length; i++) {
      const pText = paragraphs[i];
      const wordCount = pText.split(/\s+/).filter(Boolean).length;

      if (wordCount > 150) {
        const excerpt = pText.slice(0, 30) + "...";

        warnings.push({
          id: `copilot-warning-${idCounter++}`,
          type: "bloat",
          message: `Paragraph starting with "${excerpt}" is too long (${wordCount} words). Reader attention drops after 150 words.`,
          match: excerpt,
          suggestion:
            "Split into two smaller paragraphs or shorten sentences to improve mobile readability.",
        });
      }
    }

    // 3. Scan for Heading Deficiencies
    // Find headings (h2 or h3)
    const headingRegex = /<(h2|h3)[^>]*>(.*?)<\/\1>/gi;
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const hText = match[2].replace(/<[^>]*>/g, "").trim();
      const hWords = hText.split(/\s+/).filter(Boolean).length;

      if (hWords < 2 && hText.length > 0) {
        warnings.push({
          id: `copilot-warning-${idCounter++}`,
          type: "heading",
          message: `Heading "${hText}" is too brief (1 word). Concise headers should still provide keyword context.`,
          match: hText,
          suggestion: `Expand to 3-6 words to make it descriptive and search-optimized.`,
        });
      } else if (hWords > 12) {
        warnings.push({
          id: `copilot-warning-${idCounter++}`,
          type: "heading",
          message: `Heading "${hText.slice(0, 30)}..." is too wordy (${hWords} words). Headlines should be punchy.`,
          match: hText.slice(0, 20),
          suggestion: `Shorten header to under 10 words. Move extra details into the following paragraph.`,
        });
      }
    }

    // 4. Scan for Passive Voice / Weak phrasing
    const passivePhrases = [
      { weak: "highly comprehensive", better: "detailed or complete" },
      {
        weak: "unmatched quality",
        better: "measurable metrics or industry-leading",
      },
      { weak: "utilize", better: "use" },
      { weak: "we believe that", better: "we ensure or our data shows" },
      { weak: "in order to", better: "to" },
    ];

    for (const p of passivePhrases) {
      const regex = new RegExp(`\\b${p.weak}\\b`, "gi");
      const matches = content.match(regex);

      if (matches && matches.length > 0) {
        warnings.push({
          id: `copilot-warning-${idCounter++}`,
          type: "passive",
          message: `Weak or wordy phrase '${p.weak}' detected. Focus on clarity and authority.`,
          match: matches[0],
          suggestion: `Replace with '${p.better}'.`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      warnings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Co-pilot parsing failed" },
      { status: 500 },
    );
  }
}
