import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { verifyAuth } from "@/lib/pirateCOS/auth";
import { encrypt } from "@/lib/pirateCOS/encrypt";
import dbConnect from "@/lib/mongodb";
import Integration, { SupportedPlatform } from "@/models/pirateCOS/Integration";

export async function GET() {
  const user = await verifyAuth();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (user.orgRole !== "individual" && user.orgRole !== "org-admin") {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 },
    );
  }

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(user.tenantId);

  // Fetch all integration documents for the current tenant
  const integrationsList = (await Integration.find({
    tenantId: tenantOid,
  }).lean()) as any[];

  const platforms: SupportedPlatform[] = [
    "wordpress",
    "medium",
    "ghost",
    "buffer",
    "linkedin",
  ];

  const results = platforms.map((platform) => {
    const doc = integrationsList.find((i) => i.platform === platform);

    let isConnected = false;
    let metadata: Record<string, any> = {};

    if (doc) {
      if (platform === "wordpress") {
        isConnected =
          !!doc.credentials?.wpUsername &&
          !!doc.credentials?.wpAppPasswordEncrypted;
        metadata = {
          siteUrl: doc.credentials?.siteUrl || "",
          wpUsername: doc.credentials?.wpUsername || "",
        };
      } else if (platform === "medium") {
        isConnected = !!doc.credentials?.mediumTokenEncrypted;
        metadata = {
          mediumAuthorId: doc.credentials?.mediumAuthorId || "",
        };
      } else if (platform === "ghost") {
        isConnected =
          !!doc.credentials?.ghostSiteUrl &&
          !!doc.credentials?.ghostAdminKeyEncrypted;
        metadata = {
          ghostSiteUrl: doc.credentials?.ghostSiteUrl || "",
        };
      } else if (platform === "buffer") {
        isConnected = !!doc.credentials?.bufferAccessTokenEncrypted;
        metadata = {
          bufferProfileIds: doc.credentials?.bufferProfileIds || [],
        };
      } else if (platform === "linkedin") {
        isConnected = !!doc.credentials?.linkedinTokenEncrypted;
        metadata = {
          linkedinUserId: doc.credentials?.linkedinUserId || "",
          linkedinPreferArticles:
            doc.credentials?.linkedinPreferArticles !== false,
        };
      }
    }

    return {
      platform,
      isActive: doc ? doc.isActive : false,
      isConnected,
      lastTestedAt: doc?.lastTestedAt || null,
      ...metadata,
    };
  });

  return NextResponse.json({
    success: true,
    integrations: results,
  });
}

export async function POST(req: NextRequest) {
  const user = await verifyAuth();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (user.orgRole !== "individual" && user.orgRole !== "org-admin") {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 },
    );
  }

  if (!process.env.AI_ENCRYPTION_KEY) {
    return NextResponse.json(
      {
        success: false,
        error: "AI_ENCRYPTION_KEY is not configured on the server.",
      },
      { status: 500 },
    );
  }

  const {
    platform,
    siteUrl,
    wpUsername,
    wpAppPassword,
    mediumToken,
    mediumAuthorId,
    ghostSiteUrl,
    ghostAdminKey,
    bufferAccessToken,
    bufferProfileIds,
    linkedinToken,
    linkedinUserId,
    linkedinPreferArticles,
  } = await req.json();

  if (
    !platform ||
    !["wordpress", "medium", "ghost", "buffer", "linkedin"].includes(platform)
  ) {
    return NextResponse.json(
      { success: false, error: "Invalid or missing platform" },
      { status: 400 },
    );
  }

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(user.tenantId);

  let doc = await Integration.findOne({ tenantId: tenantOid, platform });

  if (!doc) {
    doc = new Integration({
      tenantId: tenantOid,
      platform,
      credentials: {},
      isActive: true,
    });
  }

  // Update credentials based on platform
  if (platform === "wordpress") {
    if (typeof siteUrl === "string") doc.credentials.siteUrl = siteUrl.trim();
    if (typeof wpUsername === "string")
      doc.credentials.wpUsername = wpUsername.trim();
    if (typeof wpAppPassword === "string" && wpAppPassword.trim()) {
      doc.credentials.wpAppPasswordEncrypted = encrypt(wpAppPassword.trim());
    }
  } else if (platform === "medium") {
    if (typeof mediumAuthorId === "string")
      doc.credentials.mediumAuthorId = mediumAuthorId.trim();
    if (typeof mediumToken === "string" && mediumToken.trim()) {
      doc.credentials.mediumTokenEncrypted = encrypt(mediumToken.trim());
    }
  } else if (platform === "ghost") {
    if (typeof ghostSiteUrl === "string")
      doc.credentials.ghostSiteUrl = ghostSiteUrl.trim();
    if (typeof ghostAdminKey === "string" && ghostAdminKey.trim()) {
      doc.credentials.ghostAdminKeyEncrypted = encrypt(ghostAdminKey.trim());
    }
  } else if (platform === "buffer") {
    if (Array.isArray(bufferProfileIds))
      doc.credentials.bufferProfileIds = bufferProfileIds;
    if (typeof bufferAccessToken === "string" && bufferAccessToken.trim()) {
      doc.credentials.bufferAccessTokenEncrypted = encrypt(
        bufferAccessToken.trim(),
      );
    }
  } else if (platform === "linkedin") {
    if (typeof linkedinUserId === "string")
      doc.credentials.linkedinUserId = linkedinUserId.trim();
    if (typeof linkedinPreferArticles === "boolean")
      doc.credentials.linkedinPreferArticles = linkedinPreferArticles;
    if (typeof linkedinToken === "string" && linkedinToken.trim()) {
      doc.credentials.linkedinTokenEncrypted = encrypt(linkedinToken.trim());
    }
  }

  doc.isActive = true;
  await doc.save();

  return NextResponse.json({ success: true });
}
