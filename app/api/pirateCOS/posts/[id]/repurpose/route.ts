import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import BrandBrain from "@/models/pirateCOS/BrandBrain";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import { getDecryptedKeys } from "@/lib/pirateCOS/ai-config";
import {
  DEFAULT_MODEL_BY_ENGINE,
  getAIKeyForEngine,
  resolveAIEngine,
  type AIEngine,
} from "@/lib/pirateCOS/ai-provider";

const FORMAT_PROMPTS: Record<string, string> = {
  "linkedin-thread": `Create an engaging 10-slide LinkedIn carousel thread based on this post. 
Format strictly slide-by-slide:
- Slide 1: High-impact hook to stop the feed scroll.
- Slides 2-9: Sequential key learning points or expert tips.
- Slide 10: Clear Call-To-Action linking back to our brand.
Structure the text beautifully with line breaks and appropriate professional emojis.`,

  "twitter-thread": `Transform this post into an engaging Twitter/X thread of 8 to 12 sequential tweets.
- Tweet 1: A powerful hook to maximize thread clicks.
- Tweets 2-10: Highly engaging key takeaways, structured with clear spacing and bullet items.
- Final Tweet: Strong Call-To-Action.
Keep every tweet under 260 characters and naturally numbered (e.g., 1/, 2/).`,

  newsletter: `Format this post into a premium, friendly email newsletter.
- Add a warm, conversational intro hook.
- Summarize the core message with bulleted insights.
- End with a compelling "Read more" Call-To-Action footer.
Deliver in standard clean HTML using <p>, <h2>, <strong>, <ul>, and <li> tags. Do not use markdown markdown blocks.`,

  summary: `Provide a concise, high-impact 200-word executive summary of this post.
Immediately follow with a structured bulleted list of 3 to 5 key strategic takeaways.`,

  "seo-meta": `Suggest optimized search parameters for this content.
Return strictly a raw JSON object with the following fields:
{
  "seoTitle": "High-CTR title under 60 characters",
  "metaDescription": "Action-oriented description under 160 characters",
  "slug": "SEO-friendly URL path slug",
  "focusKeywords": ["3-5 primary target keywords"]
}
Do not wrap in markdown code blocks.`,

  "cta-blocks": `Draft 3 distinct high-converting Call-To-Action (CTA) text variants based on this article:
1. Soft CTA: Highly educational (e.g., "Check out our free resources...").
2. Medium CTA: Direct offering push (e.g., "Start your free 14-day trial today...").
3. Hard CTA: High-intent contact directive (e.g., "Schedule a 15-minute SaaS design consultation...").`,

  "faq-schema": `Create a structured FAQ section based on this post. 
Provide 4 common questions and their expert answers.
Return strictly as a raw JSON array of objects representing schema.org FAQPage:
[
  { "question": "Question 1", "answer": "Answer 1" },
  { "question": "Question 2", "answer": "Answer 2" }
]
Do not wrap in markdown code blocks.`,

  infographic: `Design a comprehensive infographic layout structure outlining this post's content.
Specify:
- Visual Hero Heading & Theme.
- A 3-section layout grid with visual recommendations (icons, charts, metrics).
- Copy scripts and summaries for each block.`,
};

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await verifyAuth();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = params;
    const body = await request.json();
    const { format, engine, model } = body;

    if (!format || !FORMAT_PROMPTS[format]) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid or missing format. Supported: ${Object.keys(FORMAT_PROMPTS).join(", ")}`,
        },
        { status: 400 },
      );
    }

    await dbConnect();
    const tenantOid = new mongoose.Types.ObjectId(user.tenantId);

    // Fetch the Post scoped strictly to the tenant
    let post = await Post.findOne({ _id: id, tenantId: tenantOid }).catch(
      () => null,
    );

    if (!post) {
      // Try by slug as fallback
      const escapedId = id.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");

      post = await Post.findOne({
        tenantId: tenantOid,
        slug: { $regex: new RegExp(`^${escapedId}$`, "i") },
      });
    }

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 },
      );
    }

    // Fetch Brand Brain details if they exist for the tenant
    const brandBrain = await BrandBrain.findOne({ tenantId: tenantOid }).lean();

    // Fetch API keys
    const envOpenai = process.env.OPENAI_API_KEY;
    const envGemini = process.env.GEMINI_API_KEY;
    const envMistral = process.env.MISTRAL_API_KEY;
    const envAnthropic = process.env.ANTHROPIC_API_KEY;
    const dbKeys = await getDecryptedKeys(user.tenantId);

    const openaiApiKey = envOpenai || dbKeys.openai;
    const geminiApiKey = envGemini || dbKeys.gemini;
    const mistralApiKey = envMistral || dbKeys.mistral;
    const anthropicApiKey = envAnthropic || dbKeys.anthropic;
    const availableKeys = {
      openai: openaiApiKey,
      gemini: geminiApiKey,
      mistral: mistralApiKey,
      anthropic: anthropicApiKey,
    };

    const selectedEngine: AIEngine = resolveAIEngine({
      requestedEngine: engine,
      defaultEngine: dbKeys.defaultEngine,
      keys: availableKeys,
    });
    const apiKey = getAIKeyForEngine(selectedEngine, availableKeys);

    if (selectedEngine !== "puter" && !apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: `${selectedEngine.toUpperCase()} API key is not configured.`,
        },
        { status: 500 },
      );
    }

    // Compile Prompt
    let prompt = `You are a world-class professional copywriter and multi-channel content marketer.
Please transform the following post content into the target format: "${format.toUpperCase()}".

[POST INFORMATION]
Title: "${post.title}"
Excerpt: "${post.excerpt || ""}"
Tags: "${(post.tags || []).join(", ")}"
Content:
"${post.content.replace(/<[^>]*>/g, "")}"

[TRANSFORMATION DIRECTIVES]
${FORMAT_PROMPTS[format]}
`;

    if (brandBrain) {
      prompt += `\n\n[STRICT BRAND WRITING IDENTITY RULES]:`;
      prompt += `\n- Company/Brand Name: "${brandBrain.companyName}"`;
      prompt += `\n- Tone & Brand Voice: Write in a style that is ${brandBrain.brandVoice.trim()}.`;
      if (brandBrain.products) {
        prompt += `\n- Brand Products / Core Services: "${brandBrain.products.trim()}"`;
      }
      if (brandBrain.audienceICP) {
        prompt += `\n- Target ICP / Audience Profile: Focus appeal directly towards: "${brandBrain.audienceICP.trim()}"`;
      }
      if (brandBrain.forbiddenWords?.length > 0) {
        prompt += `\n- FORBIDDEN VOCABULARY: Under NO circumstances are you allowed to use any of these words: ${brandBrain.forbiddenWords.join(", ")}`;
      }
    }

    let text = "";

    if (selectedEngine === "openai" || selectedEngine === "mistral") {
      const isMistral = selectedEngine === "mistral";
      const apiUrl = isMistral
        ? "https://api.mistral.ai/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";
      const selectedModel = model || DEFAULT_MODEL_BY_ENGINE[selectedEngine];

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();

        throw new Error(
          `${isMistral ? "Mistral" : "OpenAI"} API Error: ${errText}`,
        );
      }

      const data = await response.json();

      text = data.choices?.[0]?.message?.content || "";
    } else if (selectedEngine === "anthropic") {
      const selectedModel = model || DEFAULT_MODEL_BY_ENGINE.anthropic;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: selectedModel,
          max_tokens: 4096,
          temperature: 0.7,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();

        throw new Error(`Claude API Error: ${errText}`);
      }

      const data = await response.json();

      text =
        data.content
          ?.map((part: { type: string; text?: string }) =>
            part.type === "text" ? part.text || "" : "",
          )
          .join("") || "";
    } else if (selectedEngine === "gemini") {
      const geminiModel = model || DEFAULT_MODEL_BY_ENGINE.gemini;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": apiKey!,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        const errText = await response.text();

        throw new Error(`Gemini API Error: ${errText}`);
      }

      const data = await response.json();

      text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } else {
      // Puter fallback (simulated / mock response)
      text = `[Puter AI repurposing simulator for format: ${format}]\n\nHeadline: ${post.title}\n\nSummary takeaway script of the article. Premium multi-channel syndication active!`;
    }

    // Clean up markdown wrappers
    text = text.trim();
    if (text.startsWith("```json")) {
      text = text
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
    } else if (text.startsWith("```html")) {
      text = text
        .replace(/^```html/, "")
        .replace(/```$/, "")
        .trim();
    } else if (text.startsWith("```")) {
      text = text.replace(/^```/, "").replace(/```$/, "").trim();
    }

    return NextResponse.json({
      success: true,
      data: text,
      engine: selectedEngine,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Transformation failed" },
      { status: 500 },
    );
  }
}
