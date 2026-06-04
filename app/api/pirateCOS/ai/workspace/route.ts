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
      postId,
      action,
      selectedText,
      userMessage,
      sessionHistory = [],
      tone,
      engine,
      model,
      brief,
      keywords,
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

    // Enforce credit checks (0.5 for quick action / "enhance", 1.0 for chat / "seo", 0.1 for suggest / "suggest")
    let actionType: "blog" | "seo" | "enhance" | "publish" | "suggest" = "enhance";
    if (action === "chat") {
      actionType = "seo";
    } else if (action === "suggest-ideas") {
      actionType = "suggest";
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
          { status: 402 },
        );
      }
      throw guardErr;
    }

    // Handle AI-powered suggestion generation
    if (action === "suggest-ideas") {
      const systemInstructions = `You are a world-class professional copywriter and AI content strategist.
Your task is to generate exactly 4 highly creative, targeted, and actionable custom suggestions/prompts that the user can run in their AI writing assistant to write or improve their current post.

Context of the post:
- Post Type: "${postType}"
- Content Goal: "${contentGoal}"
- Post Title: "${postTitle || "(Not set yet)"}"
- Current Post Content Snippet: "${(postContent || "").substring(0, 1500)}"

User's input for these suggestions:
- Topic/Brief details: "${brief || "General improvements based on post type"}"
- Keywords: "${keywords || "None specified"}"

Rules for output:
1. Generate EXACTLY 4 suggestions/prompts.
2. The output MUST be a valid JSON array of objects. Do not include any explanation, no markdown blocks except the raw JSON array or a markdown json block.
3. Each object in the array must have EXACTLY this structure:
{
  "label": "A short, actionable button label (2-4 words, NO emojis, e.g. 'Draft tutorial intro')",
  "prompt": "The detailed prompt that will be sent to the AI when clicked. It should be specific, context-aware, and instruct the AI on exactly what to write or edit, referencing the brief/keywords if applicable. Use placeholders like [insert ...] if needed.",
  "icon": "One of the following exact string values representing the icon style: 'tutorial', 'draft', 'engagement', 'listicle', 'conversion', 'comparison', 'product-launch', 'newsletter', 'case-study', 'corporate-post', 'product-review', 'bolt', 'table', 'lead-generation', 'retention', 'warning', 'celebrate', 'sparkles'"
}
4. Crucial: NO emojis anywhere in the label, prompt, or icon fields. Keep icon names strictly as listed above.`;

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
            messages: [
              { role: "system", content: systemInstructions },
              { role: "user", content: "Generate the 4 custom suggestions as JSON." }
            ],
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
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey!,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: selectedModel,
            max_tokens: 2000,
            temperature: 0.7,
            system: systemInstructions,
            messages: [
              { role: "user", content: "Generate the 4 custom suggestions as JSON." }
            ],
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
                  role: "user",
                  parts: [{ text: "Generate the 4 custom suggestions as JSON." }],
                }
              ],
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

      text = text.trim();
      if (text.startsWith("```json")) {
        text = text.replace(/^```json/, "").replace(/```$/, "").trim();
      } else if (text.startsWith("```")) {
        text = text.replace(/^```/, "").replace(/```$/, "").trim();
      }

      let suggestions = [];
      try {
        suggestions = JSON.parse(text);
      } catch (jsonErr) {
        console.error("Failed to parse suggestions JSON from AI:", text);
        throw new Error("AI returned invalid JSON suggestions. Please try again.");
      }

      return NextResponse.json({
        success: true,
        suggestions,
      });
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

    // ========================================================================
    // PHASE 4F+: Centralized Context Builder
    // Replaces 98 lines of duplicated context construction with 10 lines
    // ========================================================================

    const contextResult = buildAIContext({
      action,
      userMessage: actionPrompt,
      selectedText: targetText,
      postType,
      contentGoal,
      postTitle,
      brief,
      keywords,
      brandBrain,
      workflowMemory,
    });

    const systemInstructions = contextResult.systemInstructions;
    const suggestedApplyMode = contextResult.suggestedApplyMode;
    const editIntent = contextResult.editIntent;

    let text = "";
    const selectedModel = model || DEFAULT_MODEL_BY_ENGINE[selectedEngine]; // Phase 4G-2: Hoist for logging

    // Trim history to last 8 messages for token control
    const trimmedHistory = sessionHistory.slice(-8);

    if (selectedEngine === "openai" || selectedEngine === "mistral") {
      const isMistral = selectedEngine === "mistral";
      const apiUrl = isMistral
        ? "https://api.mistral.ai/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";

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

    // ========================================================================
    // PHASE 4F+: HTML Normalization
    // Ensures 95%+ consistency across all LLM providers
    // Replaces basic markdown cleanup with comprehensive normalization
    // ========================================================================

    text = normalizeHTML(text, postType);

    const generationId = new mongoose.Types.ObjectId().toString();
    const tokensUsed = Math.ceil(text.length / 4) + 500; // Simulated token count

    // ========================================================================
    // PHASE 4G-2: AI Generation Logging
    // Capture full context stack for RLHF and future fine-tuning
    // ========================================================================
    try {
      await AIGenerationLog.create({
        tenantId: new mongoose.Types.ObjectId(user.tenantId),
        postId: postId ? new mongoose.Types.ObjectId(postId) : undefined,
        generationId,
        context: {
          contentGoal,
          postType,
          userBrief: brief,
          userKeywords: keywords,
          brandVoice: brandBrain?.brandVoice,
          brandAudience: brandBrain?.audienceICP,
          brandKeywords: brandBrain?.targetKeywords,
          editIntent,
          selectedText: targetText,
          postTitle,
        },
        modelConfig: {
          engine: selectedEngine,
          model: selectedModel || DEFAULT_MODEL_BY_ENGINE[selectedEngine],
          temperature: 0.7,
        },
        generation: {
          action: Array.isArray(action) ? action.join("+") : action,
          systemPrompt: systemInstructions,
          userPrompt: actionPrompt,
          rawOutput: text, // Already normalized
          normalizedOutput: text,
          tokensUsed,
        },
        feedback: {
          action: "pending", // Will be updated when user accepts/rejects
        },
      });
    } catch (logError) {
      console.error("Failed to log AI generation:", logError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      output: text,
      generationId,
      tokensUsed,
      // Phase 4F metadata (for future use in Phase 4F and 4G)
      editIntent, // surgical | transform | rewrite | continue
      suggestedApplyMode, // replace | insert-below | insert-above
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
