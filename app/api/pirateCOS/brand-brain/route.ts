import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { verifyAuth } from "@/lib/pirateCOS/auth";
import dbConnect from "@/lib/mongodb";
import BrandBrain from "@/models/pirateCOS/BrandBrain";

/**
 * GET /api/pirateCOS/brand-brain
 * Fetch the active Brand Brain profile for the verified tenant.
 */
export async function GET(request: NextRequest) {
  try {
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
      brandBrain: brandBrain || null, // Returns null to signal onboarding is needed
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch brand brain profile",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/pirateCOS/brand-brain
 * Upsert (create or update) the Brand Brain profile for the verified tenant.
 */
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
      companyName,
      brandVoice,
      products,
      audienceICP,
      targetKeywords,
      forbiddenWords,
      callToActionTemplate,
      presetInstructions,
      sentenceComplexity,
      formattingRules,
    } = body;

    // Validate required fields
    if (!companyName || !companyName.trim()) {
      return NextResponse.json(
        { success: false, error: "Company name is required" },
        { status: 400 },
      );
    }
    if (!brandVoice || !brandVoice.trim()) {
      return NextResponse.json(
        { success: false, error: "Brand voice/tone description is required" },
        { status: 400 },
      );
    }
    if (!products || !products.trim()) {
      return NextResponse.json(
        { success: false, error: "Products/services description is required" },
        { status: 400 },
      );
    }
    if (!audienceICP || !audienceICP.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Audience/ICP profile description is required",
        },
        { status: 400 },
      );
    }

    await dbConnect();
    const tenantOid = new mongoose.Types.ObjectId(user.tenantId);

    // Clean up arrays: split strings or map lists securely
    const cleanKeywords = Array.isArray(targetKeywords)
      ? targetKeywords.map((k: string) => k.trim()).filter(Boolean)
      : typeof targetKeywords === "string"
        ? targetKeywords
            .split(",")
            .map((k: string) => k.trim())
            .filter(Boolean)
        : [];

    const cleanForbidden = Array.isArray(forbiddenWords)
      ? forbiddenWords.map((w: string) => w.trim()).filter(Boolean)
      : typeof forbiddenWords === "string"
        ? forbiddenWords
            .split(",")
            .map((w: string) => w.trim())
            .filter(Boolean)
        : [];

    // Find and update, or create if not exists
    const brandBrain = await BrandBrain.findOneAndUpdate(
      { tenantId: tenantOid },
      {
        companyName: companyName.trim(),
        brandVoice: brandVoice.trim(),
        products: products.trim(),
        audienceICP: audienceICP.trim(),
        targetKeywords: cleanKeywords,
        forbiddenWords: cleanForbidden,
        callToActionTemplate: (callToActionTemplate || "").trim(),
        presetInstructions: presetInstructions || {},
        sentenceComplexity: sentenceComplexity || "moderate",
        formattingRules: {
          alwaysIncludeTakeaways: !!formattingRules?.alwaysIncludeTakeaways,
          alwaysIncludeFAQ: !!formattingRules?.alwaysIncludeFAQ,
          autoAppendCTA: !!formattingRules?.autoAppendCTA,
        },
      },
      {
        new: true,
        upsert: true, // creates the document if none matches the tenantId
        runValidators: true,
      },
    );

    return NextResponse.json({
      success: true,
      data: brandBrain,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to save brand brain profile",
      },
      { status: 500 },
    );
  }
}
