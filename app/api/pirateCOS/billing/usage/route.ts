import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { verifyAuth } from "@/lib/pirateCOS/auth";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/pirateCOS/Admin";
import AIConfig from "@/models/pirateCOS/AIConfig";

export async function GET() {
  try {
    const user = await verifyAuth();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();
    const admin = await Admin.findById(user.tenantId).lean();

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Admin context not found" },
        { status: 404 },
      );
    }

    // Retrieve database AI key presence
    const tenantOid = new mongoose.Types.ObjectId(user.tenantId);
    const cfg = await AIConfig.findOne({ tenantId: tenantOid }).lean();

    const openaiEnv = !!process.env.OPENAI_API_KEY;
    const geminiEnv = !!process.env.GEMINI_API_KEY;
    const mistralEnv = !!process.env.MISTRAL_API_KEY;
    const anthropicEnv = !!process.env.ANTHROPIC_API_KEY;
    const grokEnv = !!(process.env.XAI_API_KEY || process.env.GROK_API_KEY);
    const openaiDb = !!cfg?.openaiKeyEncrypted;
    const geminiDb = !!cfg?.geminiKeyEncrypted;
    const mistralDb = !!cfg?.mistralKeyEncrypted;
    const anthropicDb = !!cfg?.anthropicKeyEncrypted;
    const grokDb = !!cfg?.grokKeyEncrypted;

    return NextResponse.json({
      success: true,
      plan: admin.plan || "free",
      creditsRemaining: admin.creditsRemaining ?? 20.0,
      usageThisMonth: admin.usageThisMonth || {
        aiRequests: 0,
        distributions: 0,
      },
      byokEnabled: {
        openai: admin.byokEnabled?.openai || false,
        gemini: admin.byokEnabled?.gemini || false,
        mistral: admin.byokEnabled?.mistral || false,
        anthropic: admin.byokEnabled?.anthropic || false,
        grok: (admin.byokEnabled as any)?.grok || false,
      },
      stripeCustomerId: admin.stripeCustomerId || null,
      stripeSubscriptionId: (admin as any).stripeSubscriptionId || null,
      subscriptionStatus: (admin as any).subscriptionStatus || null,
      currentPeriodEnd: (admin as any).currentPeriodEnd || null,
      hasKeys: {
        openai: openaiEnv || openaiDb,
        gemini: geminiEnv || geminiDb,
        mistral: mistralEnv || mistralDb,
        anthropic: anthropicEnv || anthropicDb,
        grok: grokEnv || grokDb,
      },
    });
  } catch (err: any) {
    console.error("Usage route GET error:", err);

    return NextResponse.json(
      { success: false, error: err.message || "Failed to query usage metrics" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { byokEnabled } = await req.json();

    if (!byokEnabled) {
      return NextResponse.json(
        { success: false, error: "Missing byokEnabled object" },
        { status: 400 },
      );
    }

    await dbConnect();
    const admin = await Admin.findById(user.tenantId);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Admin context not found" },
        { status: 404 },
      );
    }

    // Set properties
    if (typeof byokEnabled.openai === "boolean")
      admin.byokEnabled.openai = byokEnabled.openai;
    if (typeof byokEnabled.gemini === "boolean")
      admin.byokEnabled.gemini = byokEnabled.gemini;
    if (typeof byokEnabled.mistral === "boolean")
      admin.byokEnabled.mistral = byokEnabled.mistral;
    if (typeof byokEnabled.anthropic === "boolean")
      admin.byokEnabled.anthropic = byokEnabled.anthropic;
    if (typeof byokEnabled.grok === "boolean")
      (admin.byokEnabled as any).grok = byokEnabled.grok;

    await admin.save();

    return NextResponse.json({
      success: true,
      byokEnabled: admin.byokEnabled,
    });
  } catch (err: any) {
    console.error("Usage route POST error:", err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to update BYOK configuration",
      },
      { status: 500 },
    );
  }
}
