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
import WorkflowMemory from "@/models/pirateCOS/WorkflowMemory";
import Post from "@/models/Post";
import dbConnect from "@/lib/mongodb";
import { getGoalConfig, getPostTypeConfig } from "@/lib/pirateCOS/postTypeConfig";

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
      postId,
      action,
      selectedText,
      userMessage,
      sessionHistory = [],
      tone,
      engine,
      model,
    } = body;

    await dbConnect();
    const tenantOid = new mongoose.Types.ObjectId(user.tenantId);
    
    // Fetch Brand Brain & Workflow Memory
    const brandBrain = await BrandBrain.findOne({ tenantId: tenantOid }).lean();
    const workflowMemory = await WorkflowMemory.findOne({ tenantId: tenantOid }).lean();

    // Fetch Post metadata if postId is provided
    let postType = body.postType || "blog";
    let contentGoal = body.contentGoal || "traffic";
    let postTitle = body.title || "";
    let postContent = body.content || "";

    if (postId) {
      const post = await Post.findOne({ _id: postId, tenantId: tenantOid }).lean();
      if (post) {
        postType = post.postType || postType;
        contentGoal = post.contentGoal || contentGoal;
        postTitle = post.title || postTitle;
        postContent = post.content || postContent;
      }
    }

    // Keys priority: environment vars first, then encrypted DB keys
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
      const engineLabel = getAIEngineLabel(selectedEngine);
      return NextResponse.json(
        {
          success: false,
          error: `${engineLabel} API key is not configured. Add it in Admin → AI Settings.`,
        },
        { status: 500 },
      );
    }

    // Enforce credit checks (0.5 for quick action / "enhance", 1.0 for chat / "seo")
    const actionType = action === "chat" ? "seo" : "enhance";
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
          { status: 402 },
        );
      }
      throw guardErr;
    }

    // Formulate Quick Action directives
    const targetText = selectedText || postContent || "";
    let actionPrompt = "";

    const actionList = Array.isArray(action) ? action : [action];

    if (actionList.includes("chat")) {
      actionPrompt = userMessage || "";
    } else {
      let promptParts: string[] = [];
      for (const act of actionList) {
        if (act === "improve") {
          promptParts.push("Improve the writing, making it more engaging, clear, and professional.");
        } else if (act === "shorten") {
          promptParts.push("Shorten the text by approximately 40%, keeping it concise and punchy while retaining all key information.");
        } else if (act === "expand") {
          promptParts.push("Elaborate and expand on the text by adding more detail, explanations, or context to make it a more comprehensive section.");
        } else if (act === "change-tone") {
          promptParts.push(`Rewrite the text in a "${tone || "Professional"}" tone.`);
        } else if (act === "continue") {
          promptParts.push("Continue writing naturally from the end of the text, maintaining the same flow, style, and tone.");
        } else if (act === "seo-optimize") {
          const keyword = seoDataText(brandBrain, workflowMemory);
          promptParts.push(`Optimize the text for search engines, focusing on keyword density and structure. Focus Keyword: "${keyword || "content operations"}".`);
        } else if (act === "generate-cta") {
          promptParts.push("Generate a compelling, high-converting Call-To-Action (CTA) block based on this context.");
        } else if (act === "rewrite-linkedin") {
          promptParts.push("Rewrite the text into an engaging, algorithm-optimized LinkedIn post layout. Include scroll-stopping hooks, double line spacing, short sentences, relevant emojis, and conclude with an engaging question.");
        }
      }

      if (promptParts.length > 0) {
        actionPrompt = `${promptParts.join(" Also, ")} ${
          userMessage ? `Additionally, follow these custom directions: "${userMessage}".` : ""
        } Apply these changes to this text: "${targetText}"`;
      } else {
        actionPrompt = userMessage || "";
      }
    }

    let systemInstructions = "";
    const contextInfo = targetText ? `\n\nTARGET CONTEXT: "${targetText.substring(0, 3000)}"` : "";

    if (postType === "social-post") {
      systemInstructions = `You are a world-class professional copywriter and social media content writer. The user wants you to write content based on the following instructions: "${actionPrompt}". The context of the post is: title: "${postTitle}", category: "social-post".${contextInfo}
Write a concise, engaging, and highly readable update. Ensure it is formatted perfectly for social feeds with short, punchy paragraphs and no long blocks of text. Limit the length to be extremely concise (typically 1-3 short paragraphs, under 250 words total). Do NOT include headings (h1, h2, h3), lists, blockquotes, or dividers. Output in simple HTML format (using <p>, <strong>, <em>, and <br> tags). Do NOT use markdown. Deliver ONLY the raw HTML block, no backticks, no markdown formatting, and no wrapper comments.`;
    } else {
      systemInstructions = `You are a world-class professional copywriter and technical content author. The user wants you to write content based on the following instructions: "${actionPrompt}". The context of the post is: title: "${postTitle}", category: "${postType}".${contextInfo}
Write a comprehensive, fully detailed, and substantial piece of content. Expand on the concepts deeply with rich explanations, multiple robust and fully-fleshed out paragraphs, structured subheadings, and thorough insights (aim for at least 150 to 450 words, unless the prompt explicitly requests a short summary or brief answer). Output in standard clean HTML format (using <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote> as appropriate). Do NOT use markdown. Do NOT use <html>, <head>, or <body> tags. Deliver ONLY the raw HTML block, no backticks, no markdown formatting, and no wrapper comments.`;
    }

    // Strategy goal and archetype presets
    const goalConfig = contentGoal ? getGoalConfig(contentGoal) : null;
    const typeConfig = postType ? getPostTypeConfig(postType) : null;
    let contentContextPrompt = "";

    if (goalConfig) {
      contentContextPrompt += `\n\n# CONTENT STRATEGY GOAL: ${goalConfig.label}\n${goalConfig.aiPriorityPrompt}\n`;
    }
    if (typeConfig) {
      const brandPresetMap = brandBrain?.presetInstructions as any;
      let activeHint = typeConfig.templateHint;
      if (brandPresetMap) {
        const customPrompt = typeof brandPresetMap.get === "function"
          ? brandPresetMap.get(postType)
          : brandPresetMap[postType];
        if (customPrompt && typeof customPrompt === "string" && customPrompt.trim()) {
          activeHint = customPrompt.trim();
        }
      }
      contentContextPrompt += `\n\n# CONTENT ARCHETYPE: ${typeConfig.label}\n${activeHint}\n`;
    }

    if (contentContextPrompt) {
      systemInstructions = `${contentContextPrompt}\n${systemInstructions}`;
    }

    // Inject Brand Brain & Workflow Memory rules
    let brandContext = "";
    const activeName = brandBrain?.companyName || "Our Brand";
    const activeVoice = brandBrain?.brandVoice;
    const activeProducts = brandBrain?.products;
    const activeAudience = brandBrain?.audienceICP;
    const activeKeywords = brandBrain?.targetKeywords || [];
    const forbiddenWords = brandBrain?.forbiddenWords || [];
    const activeCta = brandBrain?.callToActionTemplate;

    if (brandBrain) {
      brandContext += `\n\n[STRICT BRAND WRITING IDENTITY RULES]:`;
      brandContext += `\n- Company/Brand Name: "${activeName}"`;
      if (activeVoice) {
        brandContext += `\n- Tone & Brand Voice: Write in a style that is ${activeVoice.trim()}.`;
      }
      if (activeProducts) {
        brandContext += `\n- Brand Products / Core Services: "${activeProducts.trim()}"`;
      }
      if (activeAudience) {
        brandContext += `\n- Target ICP / Audience Profile: Focus content appeal directly towards: "${activeAudience.trim()}"`;
      }
      if (activeKeywords.length > 0) {
        brandContext += `\n- Focus Keywords: Proactively integrate and emphasize these search terms when contextually appropriate: ${activeKeywords.join(", ")}`;
      }
      if (forbiddenWords.length > 0) {
        brandContext += `\n- FORBIDDEN VOCABULARY: Under NO circumstances are you allowed to use any of these words or variants in your generated output: ${forbiddenWords.join(", ")}. Filter them out completely.`;
      }

      const sentenceComplexity = workflowMemory?.sentenceComplexity || brandBrain?.sentenceComplexity || "moderate";
      brandContext += `\n\n[WORKFLOW MEMORY & PREFERENCES]:`;
      brandContext += `\n- Sentence Complexity: Generate text targeted at a "${sentenceComplexity}" readability level.`;
      if (
        (workflowMemory?.formattingRules?.alwaysIncludeTakeaways || brandBrain?.formattingRules?.alwaysIncludeTakeaways) &&
        action === "chat"
      ) {
        brandContext += `\n- Formatting Constraint: Proactively begin the text block with a 3-sentence "Key Takeaways" summary block.`;
      }
      if (
        (workflowMemory?.formattingRules?.alwaysIncludeFAQ || brandBrain?.formattingRules?.alwaysIncludeFAQ) &&
        action === "chat"
      ) {
        brandContext += `\n- Formatting Constraint: Always append a structured, comprehensive "Frequently Asked Questions" Q&A segment at the end of the post content.`;
      }

      const ctaTemplate = workflowMemory?.defaultCTA || activeCta;
      if (ctaTemplate && action !== "chat") {
        brandContext += `\n- Footer CTA Guidance: When appropriate, guide the reader in this Call-To-Action style: "${ctaTemplate.trim()}"`;
      }
    }

    if (brandContext) {
      systemInstructions = `${systemInstructions}\n${brandContext}`;
    }

    let text = "";
    // Trim history to last 8 messages for token control
    const trimmedHistory = sessionHistory.slice(-8);

    if (selectedEngine === "openai" || selectedEngine === "mistral") {
      const isMistral = selectedEngine === "mistral";
      const apiUrl = isMistral
        ? "https://api.mistral.ai/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";
      const selectedModel = model || DEFAULT_MODEL_BY_ENGINE[selectedEngine];

      const messages = [
        { role: "system", content: systemInstructions },
        ...trimmedHistory.map((m: any) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      ];

      // If it's a quick action (not chat), append the action prompt as user message
      if (action !== "chat") {
        messages.push({ role: "user", content: actionPrompt });
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`${isMistral ? "Mistral" : "OpenAI"} API Error: ${errText}`);
      }

      const data = await response.json();
      text = data.choices?.[0]?.message?.content || "";
    } else if (selectedEngine === "anthropic") {
      const selectedModel = model || DEFAULT_MODEL_BY_ENGINE.anthropic;

      const messages = trimmedHistory.map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }));

      if (action !== "chat") {
        messages.push({ role: "user", content: actionPrompt });
      }

      // Anthropic does not allow empty messages, ensure at least one
      if (messages.length === 0) {
        messages.push({ role: "user", content: actionPrompt || "Hello" });
      }

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
          system: systemInstructions,
          messages,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Claude API Error: ${errText}`);
      }

      const data = await response.json();
      text = data.content?.map((part: any) => part.type === "text" ? part.text || "" : "").join("") || "";
    } else if (selectedEngine === "gemini") {
      const geminiModel = model || DEFAULT_MODEL_BY_ENGINE.gemini;

      const contents = trimmedHistory.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      if (action !== "chat") {
        contents.push({
          role: "user",
          parts: [{ text: actionPrompt }],
        });
      }

      if (contents.length === 0) {
        contents.push({
          role: "user",
          parts: [{ text: actionPrompt || "Hello" }],
        });
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": apiKey!,
          },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemInstructions }],
            },
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

    // Clean up markdown code block wrappers if generated
    text = text.trim();
    if (text.startsWith("```html")) {
      text = text.replace(/^```html/, "").replace(/```$/, "").trim();
    } else if (text.startsWith("```")) {
      text = text.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const generationId = new mongoose.Types.ObjectId().toString();

    return NextResponse.json({
      success: true,
      output: text,
      generationId,
      tokensUsed: Math.ceil(text.length / 4) + 500, // Simulated token count
    });

  } catch (error: any) {
    console.error("AI Workspace API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "AI Workspace execution failed" },
      { status: 500 },
    );
  }
}

function seoDataText(brandBrain: any, workflowMemory: any) {
  if (brandBrain?.targetKeywords && brandBrain.targetKeywords.length > 0) {
    return brandBrain.targetKeywords[0];
  }
  return "content operations";
}
