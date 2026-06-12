import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/pirateCOS/auth";
import Admin from "@/models/pirateCOS/Admin";
import Workspace from "@/models/pirateCOS/Workspace";
import BrandBrain from "@/models/pirateCOS/BrandBrain";
import ApiKey from "@/models/pirateCOS/ApiKey";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.accountType !== "organization") {
      return NextResponse.json(
        { success: false, error: "Only organization accounts have access to details" },
        { status: 403 }
      );
    }

    await dbConnect();

    const tenantId = user.tenantId;

    // 1. Fetch Owner Admin details
    const owner = await Admin.findById(tenantId).select("name email avatar isActive createdAt").lean();

    if (!owner) {
      return NextResponse.json(
        { success: false, error: "Organization owner not found" },
        { status: 404 }
      );
    }

    // 2. Fetch Workspace Details
    const workspace = await Workspace.findOne({ tenantId }).lean();

    // 3. Fetch BrandBrain Configuration details
    const brandBrain = await BrandBrain.findOne({ tenantId }).lean();

    // 4. Fetch Members of the organisation (owner and linked members)
    const members = await Admin.find({
      $or: [
        { _id: tenantId },
        { parentOrgId: tenantId }
      ]
    })
      .select("name email role accountType orgRole avatar isActive createdAt")
      .sort({ createdAt: 1 })
      .lean();

    // 5. Fetch API Keys associated with the organisation
    const apiKeys = await ApiKey.find({ tenantId })
      .select("name keyPrefix scopes isActive lastUsedAt expiresAt createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        owner,
        workspace,
        brandBrain,
        members,
        apiKeys
      }
    });

  } catch (error: any) {
    console.error("Error fetching organization details:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
