import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { verifyAuth } from "@/lib/pirateCOS/auth";
import dbConnect from "@/lib/mongodb";
import BrandBrain from "@/models/pirateCOS/BrandBrain";
import WorkflowMemory from "@/models/pirateCOS/WorkflowMemory";

// GET /api/pirateCOS/ai-config/preferences
// Returns the style preferences, CTA guidelines, snippet library, and UI preferences for the authenticated tenant.
export async function GET() {
  const user = await verifyAuth();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(user.tenantId);
  const brandBrain = await BrandBrain.findOne({ tenantId: tenantOid }).lean();
  const workflowMemory = await WorkflowMemory.findOne({ tenantId: tenantOid }).lean();

  return NextResponse.json({
    success: true,
    preferences: brandBrain
      ? {
          preferredTone: brandBrain.brandVoice,
          sentenceComplexity: brandBrain.sentenceComplexity ?? "moderate",
          formattingRules: brandBrain.formattingRules ?? {
            alwaysIncludeTakeaways: false,
            alwaysIncludeFAQ: false,
            autoAppendCTA: false,
          },
          defaultCTA: brandBrain.callToActionTemplate ?? "",
          learnedToneProfile: "",
        }
      : {
          preferredTone: "Professional & Authoritative",
          sentenceComplexity: "moderate",
          formattingRules: {
            alwaysIncludeTakeaways: false,
            alwaysIncludeFAQ: false,
            autoAppendCTA: false,
          },
          defaultCTA: "",
          learnedToneProfile: "",
        },
    workflowMemory: workflowMemory || {
      snippetLibrary: [],
      uiPreferences: {
        panelWidth: 288,
        showHistory: true,
        quickActionsOrder: [],
      },
    },
  });
}

// POST /api/pirateCOS/ai-config/preferences
// Upserts or updates style preferences, snippets, and UI preferences.
export async function POST(req: NextRequest) {
  const user = await verifyAuth();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await req.json();
  const {
    preferredTone,
    sentenceComplexity,
    formattingRules,
    defaultCTA,
    uiPreferences,
    snippetLibrary,
    action, // custom action: "add-snippet" or "delete-snippet"
    snippet, // the snippet string
  } = body;

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(user.tenantId);

  // Update BrandBrain
  let brandBrain = await BrandBrain.findOne({ tenantId: tenantOid });
  if (!brandBrain) {
    brandBrain = new BrandBrain({
      tenantId: tenantOid,
      companyName: "Our Brand",
      brandVoice: preferredTone || "Professional & Authoritative",
      products: "Our products and services",
      audienceICP: "Our ideal customers",
    });
  }

  if (preferredTone) brandBrain.brandVoice = preferredTone;
  if (sentenceComplexity) brandBrain.sentenceComplexity = sentenceComplexity;
  if (formattingRules) {
    brandBrain.formattingRules = {
      alwaysIncludeTakeaways: !!formattingRules.alwaysIncludeTakeaways,
      alwaysIncludeFAQ: !!formattingRules.alwaysIncludeFAQ,
      autoAppendCTA: !!formattingRules.autoAppendCTA,
    };
  }
  if (typeof defaultCTA === "string") {
    brandBrain.callToActionTemplate = defaultCTA.trim();
  }
  await brandBrain.save();

  // Update WorkflowMemory
  let workflowMemory = await WorkflowMemory.findOne({ tenantId: tenantOid });
  if (!workflowMemory) {
    workflowMemory = new WorkflowMemory({
      tenantId: tenantOid,
      preferredTone: preferredTone || "Professional & Authoritative",
      sentenceComplexity: sentenceComplexity || "moderate",
      formattingRules: formattingRules || {
        alwaysIncludeTakeaways: false,
        alwaysIncludeFAQ: false,
        autoAppendCTA: false,
      },
      defaultCTA: defaultCTA || "",
      snippetLibrary: [],
      uiPreferences: {
        panelWidth: 288,
        showHistory: true,
        quickActionsOrder: [],
      },
    });
  }

  // Handle updates to uiPreferences
  if (uiPreferences) {
    workflowMemory.uiPreferences = {
      ...workflowMemory.uiPreferences,
      ...uiPreferences,
    };
  }

  // Handle snippet library updates
  if (!workflowMemory.snippetLibrary) {
    workflowMemory.snippetLibrary = [];
  }

  if (snippetLibrary) {
    workflowMemory.snippetLibrary = snippetLibrary;
  } else if (action === "add-snippet" && snippet) {
    if (!workflowMemory.snippetLibrary.includes(snippet)) {
      workflowMemory.snippetLibrary.push(snippet);
    }
  } else if (action === "delete-snippet" && snippet) {
    workflowMemory.snippetLibrary = workflowMemory.snippetLibrary.filter(
      (s) => s !== snippet
    );
  }

  await workflowMemory.save();

  return NextResponse.json({
    success: true,
    preferences: {
      preferredTone: brandBrain.brandVoice,
      sentenceComplexity: brandBrain.sentenceComplexity,
      formattingRules: brandBrain.formattingRules,
      defaultCTA: brandBrain.callToActionTemplate,
      learnedToneProfile: "",
    },
    workflowMemory,
  });
}
