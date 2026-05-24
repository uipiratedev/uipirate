import { NextRequest, NextResponse } from "next/server";

import { verifyAuth } from "@/lib/pirateCOS/auth";
import { getDecryptedKeys } from "@/lib/ai-config";

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
      prompt,
      engine,
      model,
      selectedText,
      surroundingContext,
    } = body;

    // Keys priority: environment vars first, then encrypted DB keys
    const envOpenai = process.env.OPENAI_API_KEY;
    const envGemini = process.env.GEMINI_API_KEY;
    const envMistral = process.env.MISTRAL_API_KEY;
    const dbKeys = await getDecryptedKeys(user.tenantId);

    const openaiApiKey = envOpenai || dbKeys.openai;
    const geminiApiKey = envGemini || dbKeys.gemini;
    const mistralApiKey = envMistral || dbKeys.mistral;

    // Determine engine: prefer the requested one, fall back to whatever has a key
    let selectedEngine =
      engine ||
      (openaiApiKey
        ? "openai"
        : geminiApiKey
          ? "gemini"
          : mistralApiKey
            ? "mistral"
            : "puter");

    if (selectedEngine === "openai" && !openaiApiKey)
      selectedEngine = geminiApiKey
        ? "gemini"
        : mistralApiKey
          ? "mistral"
          : "puter";
    if (selectedEngine === "gemini" && !geminiApiKey)
      selectedEngine = openaiApiKey
        ? "openai"
        : mistralApiKey
          ? "mistral"
          : "puter";
    if (selectedEngine === "mistral" && !mistralApiKey)
      selectedEngine = openaiApiKey
        ? "openai"
        : geminiApiKey
          ? "gemini"
          : "puter";

    let apiKey =
      selectedEngine === "openai"
        ? openaiApiKey
        : selectedEngine === "gemini"
          ? geminiApiKey
          : selectedEngine === "mistral"
            ? mistralApiKey
            : undefined;

    if (selectedEngine !== "puter" && !apiKey) {
      const engineLabel =
        selectedEngine === "openai"
          ? "OpenAI"
          : selectedEngine === "gemini"
            ? "Gemini"
            : "Mistral";

      return NextResponse.json(
        {
          success: false,
          error: `${engineLabel} API key is not configured. Add it in Admin → AI Settings.`,
        },
        { status: 500 },
      );
    }

    let systemInstructions = "";    if (action === "excerpt" || action === "metaDescription") {
      systemInstructions = `Draft a concise, high-converting SEO meta-description / excerpt (maximum 150-160 characters) summarizing the following post. Deliver ONLY the excerpt text. Do NOT wrap it in quotes, code blocks, or include introductory text. Content:\n\n${content || title}`;
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
      let contextInfo = "";

      if (selectedText) {
        contextInfo += `\n\nTARGET TEXT FOR EDITING (Rewrite, expand, improve, or format this selected text directly based on the user prompt): "${selectedText}"`;
      }
      if (surroundingContext && surroundingContext.trim()) {
        contextInfo += `\n\nSURROUNDING BLOG CONTEXT (Ensure your generated section matches this writing style, tone, and flow perfectly, without repeating existing paragraphs): \n... ${surroundingContext.trim()}`;
      }

      systemInstructions = `You are a world-class professional copywriter and technical content author. The user wants you to write content based on the following prompt: "${prompt}". The context of the post is: title: "${title || ""}", category: "${postType || "blog"}".${contextInfo}
Write a comprehensive, fully detailed, and substantial piece of content. Expand on the concepts deeply with rich explanations, multiple robust and fully-fleshed out paragraphs, structured subheadings, and thorough insights (aim for at least 300 to 600 words or a complete, deep-dive section, unless the prompt explicitly requests a short summary or brief answer). Output in standard clean HTML format (using <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote> as appropriate). Do NOT use markdown. Do NOT use <html>, <head>, or <body> tags. Deliver ONLY the raw HTML block, no backticks, no markdown formatting, and no wrapper comments.`;
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 },
      );
    }

    let text = "";

    if (selectedEngine === "openai" || selectedEngine === "mistral") {
      const isMistral = selectedEngine === "mistral";
      const apiUrl = isMistral
        ? "https://api.mistral.ai/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";
      const defaultModel = isMistral ? "mistral-large-latest" : "gpt-4o-mini";
      const selectedModel = model || defaultModel;

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
    } else if (selectedEngine === "gemini") {
      // Gemini API
      const geminiModel = model || "gemini-flash-latest";
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

        if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
          try {
            parsed = JSON.parse(text.substring(firstBracket, lastBracket + 1));
          } catch (e) {
            // fallback
          }
        }
        if (!parsed && firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
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
        // Split by newlines, commas, or semicolons to extract individual keywords
        const fallbackItems = text
          .split(/[\n,;]+/)
          .map((t) =>
            t
              .replace(/^\d+\.\s*/, "") // Remove list numbers like "1. "
              .replace(/[\[\]"']/g, "") // Remove brackets/quotes
              .trim(),
          )
          .filter((t) => t.length > 1 && t.split(/\s+/).length <= 3 && t.length <= 30)
          .slice(0, 8);

        return NextResponse.json({
          success: true,
          data: fallbackItems,
          engine: selectedEngine,
        });
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
