import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { verifyAuth } from "@/lib/pirateCOS/auth";
import dbConnect from "@/lib/mongodb";
import WorkflowMemory from "@/models/pirateCOS/WorkflowMemory";

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
  const memory = await WorkflowMemory.findOne({ tenantId: tenantOid }).lean();

  return NextResponse.json({
    success: true,
    preferences: memory ?? {
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

  const memory =
    (await WorkflowMemory.findOne({ tenantId: tenantOid })) ??
    new WorkflowMemory({ tenantId: tenantOid });

  if (preferredTone) memory.preferredTone = preferredTone;
  if (sentenceComplexity) memory.sentenceComplexity = sentenceComplexity;
  if (formattingRules) {
    memory.formattingRules = {
      alwaysIncludeTakeaways: !!formattingRules.alwaysIncludeTakeaways,
      alwaysIncludeFAQ: !!formattingRules.alwaysIncludeFAQ,
      autoAppendCTA: !!formattingRules.autoAppendCTA,
    };
  }
  if (typeof defaultCTA === "string") memory.defaultCTA = defaultCTA.trim();

  await memory.save();

  return NextResponse.json({
    success: true,
    preferences: memory,
  });
}
