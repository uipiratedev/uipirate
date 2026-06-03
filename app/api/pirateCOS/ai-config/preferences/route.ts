import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { verifyAuth } from "@/lib/pirateCOS/auth";
import dbConnect from "@/lib/mongodb";
import BrandBrain from "@/models/pirateCOS/BrandBrain";

// GET /api/pirateCOS/ai-config/preferences
// Returns the style preferences and CTA guidelines for the authenticated tenant.
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
  });
}

// POST /api/pirateCOS/ai-config/preferences
// Upserts or updates the style preferences and CTA guidelines.
export async function POST(req: NextRequest) {
  const user = await verifyAuth();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await req.json();
  const { preferredTone, sentenceComplexity, formattingRules, defaultCTA } =
    body;

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(user.tenantId);

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

  return NextResponse.json({
    success: true,
    preferences: {
      preferredTone: brandBrain.brandVoice,
      sentenceComplexity: brandBrain.sentenceComplexity,
      formattingRules: brandBrain.formattingRules,
      defaultCTA: brandBrain.callToActionTemplate,
      learnedToneProfile: "",
    },
  });
}
