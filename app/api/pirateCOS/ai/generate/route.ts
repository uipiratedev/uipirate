import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { verifyAuth } from "@/lib/pirateCOS/auth";
import { getDecryptedKeys } from "@/lib/pirateCOS/ai-config";
import { deductCredits, CreditLimitError } from "@/lib/usage-guard";
import {
  DEFAULT_MODEL_BY_ENGINE,
  getAIEngineLabel,
  getAIKeyForEngine,
  resolveAIEngine,
  type AIEngine,
} from "@/lib/pirateCOS/ai-provider";
import BrandBrain from "@/models/pirateCOS/BrandBrain";
import dbConnect from "@/lib/mongodb";
import { getGoalConfig, getPostTypeConfig } from "@/lib/pirateCOS/postTypeConfig";
import { buildAIContext } from "@/lib/pirateCOS/ai-context-builder";
import { normalizeHTML } from "@/lib/pirateCOS/html-normalizer";
import AIGenerationLog from "@/models/pirateCOS/AIGenerationLog"; // Phase 4G-2

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      action,
      title,
      content,
      postType,
      contentGoal,
      prompt,
      engine,
      model,
      selectedText,
      surroundingContext,
      customBrandVoice,
      customAudience,
      customKeywords,
      preset, // Added Phase 4 AI Intent Preset
    } = body;

    // Keys priority: environment vars first, then encrypted DB keys
    const envOpenai = process.env.OPENAI_API_KEY;
    const envGemini = process.env.GEMINI_API_KEY;
    const envMistral = process.env.MISTRAL_API_KEY;
    const envAnthropic = process.env.ANTHROPIC_API_KEY;

    await dbConnect();
    const tenantOid = new mongoose.Types.ObjectId(user.tenantId);
    const dbKeys = await getDecryptedKeys(user.tenantId);

    // Fetch Brand Brain details if they exist for the tenant
    const brandBrain = await BrandBrain.findOne({ tenantId: tenantOid }).lean();

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
      const engineLabel = getAIEngineLabel(selectedEngine);

      return NextResponse.json(
        {
          success: false,
          error: `${engineLabel} API key is not configured. Add it in Admin → AI Settings.`,
        },
        { status: 500 },
      );
    }

    // --- ENFORCE CREDIT limits BEFORE EXECUTION ---
    let actionType: "blog" | "seo" | "enhance" = "enhance";

    if (action === "write") {
      actionType = "blog";
    } else if (action === "seo-analysis") {
      actionType = "seo";
    }

    try {
      await deductCredits(
        user.tenantId,
        actionType,
        selectedEngine !== "puter" ? selectedEngine : undefined,
      );
    } catch (guardErr: any) {
      if (guardErr instanceof CreditLimitError) {
        return NextResponse.json(
          {
            success: false,
            error: guardErr.message,
            upgradeUrl: guardErr.upgradeUrl,
            limitsReached: true,
          },
          { status: 402 }, // 402 Payment Required
        );
      }
      throw guardErr;
    }

    // Phase 4: Preset Injection Logic
    let presetDirective = "";

    if (preset && action === "write") {
      if (preset === "seo-article") {
        presetDirective = `Write a comprehensive, search-optimized SEO article. Enforce a robust H2/H3 structural layout, target a length of at least 1,500–2,500 words, provide exhaustive explanations, and include a dedicated 'Frequently Asked Questions' H2 segment at the very end.`;
      } else if (preset === "thought-leadership") {
        presetDirective = `Write an inspiring, opinionated thought leadership piece. Challenge conventional wisdom, present strong contrarian/bold viewpoints, write in a conversational yet authoritative first-person style, and detail real-world stories (aim for 800–1,500 words).`;
      } else if (preset === "linkedin-post") {
        presetDirective = `Write an algorithm-optimized LinkedIn post (200-300 words). Start with a scroll-stopping primary hook, structure with airy double line spacing, utilize short and readable sentences, include relevant emojis, and conclude with an engaging question to spark comment thread discussion.`;
      } else if (preset === "case-study") {
        presetDirective = `Write a professional customer success case study (1,000–1,800 words). Divide content clearly into four sequential sections: 1. Executive Summary, 2. The Challenge (Problem), 3. The Approach (Solution), and 4. The Results. Include placeholders for customer quotes and statistics.`;
      } else if (preset === "founder-story") {
        presetDirective = `Write an authentic, highly personal founder's journey post (1,200–2,000 words). Detail core operational struggles, high-friction startup moments, vulnerability, and lessons learned.`;
      } else if (preset === "product-launch") {
        presetDirective = `Write a benefits-driven product launch announcement (600–1,200 words). Detail core features with checkbox tables, frame offerings around audience pain points, and close with a clear CTA to sign up for early access.`;
      } else if (preset === "comparison") {
        presetDirective = `Write an objective, comprehensive comparison article (1,500–2,500 words). Frame competitors side-by-side, highlight pros/cons for each, and outline clear use-case recommendations.`;
      } else if (preset === "technical-deep-dive") {
        presetDirective = `Write a highly technical, step-by-step developer tutorial (2,000–3,500 words). Present clean, well-commented syntax-highlighted code blocks, detail configurations, and present clear structural diagrams.`;
      }
    }

    let systemInstructions = "";

    if (action === "excerpt" || action === "metaDescription") {
      systemInstructions = `Draft a concise, high-converting SEO meta-description / excerpt (maximum 150-160 characters) summarizing the following post. Deliver ONLY the excerpt text. Do NOT wrap it in quotes, code blocks, or include introductory text. Content:\n\n${content || title}`;
    } else if (action === "focusKeyword") {
      systemInstructions = `Suggest a single, high-impact focus keyword or focus phrase (2-4 words) that represents the main organic search term for a post with the title: "${title || ""}", category: "${postType || "blog"}", and content: "${content || ""}". Deliver ONLY the focus keyword text. Do NOT wrap it in quotes, code blocks, or include introductory text.`;
    } else if (action === "metaTitle") {
      systemInstructions = `Suggest a single, high-impact, highly clickable, and search-optimized alternative title for a post with the active title: "${title || ""}", category: "${postType || "blog"}", and content: "${content || ""}". Deliver ONLY the single title text. Do NOT wrap it in quotes, code blocks, or include introductory text.`;
    } else if (action === "titles") {
      systemInstructions = `Suggest 3 high-impact, highly clickable, and search-optimized alternative titles for a post with the active title: "${title || ""}", category: "${postType || "blog"}", and content: "${content || ""}". Format your response STRICTLY as a raw JSON array of strings, e.g. ["Optimized Title 1", "Optimized Title 2", "Optimized Title 3"]. Deliver ONLY the JSON array, no markdown backticks, no wrap text, and no leading/trailing spaces.`;
    } else if (action === "tags") {
      systemInstructions = `Suggest 5-8 highly relevant, lowercase, search-optimized tags / keywords for a post with the title: "${title || ""}", category: "${postType || "blog"}", and content: "${content || ""}". Format your response STRICTLY as a raw JSON array of strings, e.g. ["tech", "javascript", "react"]. Deliver ONLY the JSON array, no markdown backticks, no wrap text, and no leading/trailing spaces.`;
    } else if (action === "seo-analysis") {
      systemInstructions = `You are an expert SEO specialist. Analyze the following blog post and provide a comprehensive SEO optimization report.
      Title: "${title || ""}"
      Category: "${postType || "blog"}"
      Content: "${content || ""}"
      
      Your response must be a valid JSON object with the following structure:
      {
        "metaTitle": "A suggested meta title (max 60 chars)",
        "metaDescription": "A suggested meta description (max 160 chars)",
        "focusKeyword": "The primary target keyword",
        "semanticKeywords": ["3-5 related keywords"],
        "slug": "An SEO-friendly URL slug",
        "ogTitle": "Title for social sharing",
        "ogDescription": "Description for social sharing",
        "analysis": {
          "score": 0-100,
          "strengths": ["list of positive SEO aspects"],
          "improvements": ["list of actionable improvements"],
          "keywordGap": ["missing keywords or topics to cover"],
          "headingStructure": "Analysis of H1, H2, H3 hierarchy",
          "readability": "Readability score and analysis",
          "imageOptimization": "Review of image alt tags and suggestions"
        }
      }
      Deliver ONLY the raw JSON object, no backticks, no markdown formatting.`;
    } else if (action === "write") {
      // ========================================================================
      // PHASE 4F+: Centralized Context Builder for "write" action
      // Replaces 116 lines of duplicated context construction with ~10 lines
      // ========================================================================

      const contextResult = buildAIContext({
        action: "write",
        userMessage: prompt || "",
        selectedText,
        postType,
        contentGoal,
        postTitle: title,
        brandBrain,
        customBrandVoice,
        customAudience,
        customKeywords,
        preset,
      });

      systemInstructions = contextResult.systemInstructions;

      // Add surrounding context if provided (specific to generate route)
      if (surroundingContext && surroundingContext.trim()) {
        systemInstructions += `\n\nSURROUNDING BLOG CONTEXT (Ensure your generated section matches this writing style, tone, and flow perfectly, without repeating existing paragraphs): \n... ${surroundingContext.trim()}`;
      }
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 },
      );
    }

    let text = "";
    const selectedModel = model || DEFAULT_MODEL_BY_ENGINE[selectedEngine]; // Phase 4G-2: Hoist for logging

    if (selectedEngine === "openai" || selectedEngine === "mistral") {
      const isMistral = selectedEngine === "mistral";
      const apiUrl = isMistral
        ? "https://api.mistral.ai/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: "user", content: systemInstructions }],
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
          messages: [{ role: "user", content: systemInstructions }],
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
      // Gemini API
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
                parts: [
                  {
                    text: systemInstructions,
                  },
                ],
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
    }

    // Clean up markdown wrappers if the model returned them anyway
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

    if (action === "titles" || action === "tags" || action === "seo-analysis") {
      try {
        let parsed;
        const firstBracket = text.indexOf("[");
        const lastBracket = text.lastIndexOf("]");
        const firstBrace = text.indexOf("{");
        const lastBrace = text.lastIndexOf("}");

        if (
          firstBracket !== -1 &&
          lastBracket !== -1 &&
          lastBracket > firstBracket
        ) {
          try {
            parsed = JSON.parse(text.substring(firstBracket, lastBracket + 1));
          } catch (e) {
            // fallback
          }
        }
        if (
          !parsed &&
          firstBrace !== -1 &&
          lastBrace !== -1 &&
          lastBrace > firstBrace
        ) {
          try {
            parsed = JSON.parse(text.substring(firstBrace, lastBrace + 1));
          } catch (e) {
            // fallback
          }
        }
        if (!parsed) {
          parsed = JSON.parse(text);
        }

        return NextResponse.json({
          success: true,
          data: parsed,
          engine: selectedEngine,
        });
      } catch (jsonErr) {
        if (action === "seo-analysis") {
          throw new Error(
            "AI failed to return a valid SEO analysis JSON. Please try again.",
          );
        }
        // Fallback split parsing if model failed to return strict JSON
        const fallbackItems = text
          .split(/[\n,;]+/)
          .map((t) =>
            t
              .replace(/^\d+\.\s*/, "") // Remove list numbers like "1. "
              .replace(/[\[\]"']/g, "") // Remove brackets/quotes
              .trim(),
          )
          .filter(
            (t) => t.length > 1 && t.split(/\s+/).length <= 3 && t.length <= 30,
          )
          .slice(0, 8);

        return NextResponse.json({
          success: true,
          data: fallbackItems,
          engine: selectedEngine,
        });
      }
    }

    // ========================================================================
    // PHASE 4F+: HTML Normalization for "write" action
    // Ensures 95%+ consistency across all LLM providers
    // Only normalize HTML output (not JSON from titles/tags/seo-analysis)
    // ========================================================================

    if (action === "write") {
      text = normalizeHTML(text, postType);

      // ========================================================================
      // PHASE 4G-2: AI Generation Logging (write action only)
      // Capture full context stack for RLHF and future fine-tuning
      // ========================================================================
      try {
        const generationId = new mongoose.Types.ObjectId().toString();

        await AIGenerationLog.create({
          tenantId: new mongoose.Types.ObjectId(user.tenantId),
          generationId,
          context: {
            contentGoal,
            postType,
            brandVoice: customBrandVoice || brandBrain?.brandVoice,
            brandAudience: customAudience || brandBrain?.audienceICP,
            brandKeywords: customKeywords || brandBrain?.targetKeywords,
            preset,
            selectedText,
            surroundingContext,
            postTitle: title,
          },
          modelConfig: {
            engine: selectedEngine,
            model: selectedModel || DEFAULT_MODEL_BY_ENGINE[selectedEngine],
            temperature: 0.7,
          },
          generation: {
            action: "write",
            systemPrompt: systemInstructions,
            userPrompt: prompt || "",
            rawOutput: text,
            normalizedOutput: text,
          },
          feedback: {
            action: "pending",
          },
        });
      } catch (logError) {
        console.error("Failed to log AI generation:", logError);
        // Don't fail the request if logging fails
      }
    }

    return NextResponse.json({
      success: true,
      data: text,
      engine: selectedEngine,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "AI Generation failed" },
      { status: 500 },
    );
  }
}
