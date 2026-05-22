import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, title, content, postType, prompt, engine, model, selectedText, surroundingContext } = body;

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    // Determine engine: default to 'openai' if key exists, otherwise 'gemini'
    let selectedEngine = engine || (openaiApiKey ? "openai" : "gemini");

    if (selectedEngine === "openai" && !openaiApiKey) {
      selectedEngine = "gemini";
    }

    let apiKey = selectedEngine === "openai" ? openaiApiKey : geminiApiKey;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: `${selectedEngine === "openai" ? "OpenAI" : "Gemini"} API Key is not configured.` },
        { status: 500 }
      );
    }

    let systemInstructions = "";
    if (action === "excerpt") {
      systemInstructions = `Draft a concise, high-converting SEO meta-description / excerpt (maximum 150-160 characters) summarizing the following post. Deliver ONLY the excerpt text. Do NOT wrap it in quotes, code blocks, or include introductory text. Content:\n\n${content || title}`;
    } else if (action === "titles") {
      systemInstructions = `Suggest 3 high-impact, highly clickable, and search-optimized alternative titles for a post with the active title: "${title || ""}", category: "${postType || "blog"}", and content: "${content || ""}". Format your response STRICTLY as a raw JSON array of strings, e.g. ["Optimized Title 1", "Optimized Title 2", "Optimized Title 3"]. Deliver ONLY the JSON array, no markdown backticks, no wrap text, and no leading/trailing spaces.`;
    } else if (action === "tags") {
      systemInstructions = `Suggest 5-8 highly relevant, lowercase, search-optimized tags / keywords for a post with the title: "${title || ""}", category: "${postType || "blog"}", and content: "${content || ""}". Format your response STRICTLY as a raw JSON array of strings, e.g. ["tech", "javascript", "react"]. Deliver ONLY the JSON array, no markdown backticks, no wrap text, and no leading/trailing spaces.`;
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
        { status: 400 }
      );
    }

    let text = "";

    if (selectedEngine === "openai") {
      const openaiModel = model || "gpt-4o-mini";
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: openaiModel,
          messages: [
            {
              role: "user",
              content: systemInstructions,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI API Error: ${errText}`);
      }

      const data = await response.json();
      text = data.choices?.[0]?.message?.content || "";
    } else {
      // Gemini API
      const geminiModel = model || "gemini-flash-latest";
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": apiKey,
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
        }
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
      text = text.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (text.startsWith("```html")) {
      text = text.replace(/^```html/, "").replace(/```$/, "").trim();
    } else if (text.startsWith("```")) {
      text = text.replace(/^```/, "").replace(/```$/, "").trim();
    }

    if (action === "titles" || action === "tags") {
      try {
        const parsed = JSON.parse(text);
        return NextResponse.json({ success: true, data: parsed, engine: selectedEngine });
      } catch (jsonErr) {
        // Fallback split parsing if model failed to return strict JSON
        const fallbackItems = text
          .split("\n")
          .map((t) => t.replace(/^\d+\.\s*/, "").replace(/[\[\]"']/g, "").trim())
          .filter((t) => t.length > 1)
          .slice(0, 8);
        return NextResponse.json({ success: true, data: fallbackItems, engine: selectedEngine });
      }
    }

    return NextResponse.json({ success: true, data: text, engine: selectedEngine });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "AI Generation failed" },
      { status: 500 }
    );
  }
}
