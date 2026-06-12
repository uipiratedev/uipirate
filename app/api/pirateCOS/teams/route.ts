import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import Team from "@/models/pirateCOS/Team";
import Workspace from "@/models/pirateCOS/Workspace";

// GET /api/pirateCOS/teams - List all teams for the user's workspace
export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get or create shared "UI Pirate" workspace scoped to tenant
    let workspace = await Workspace.findOne({ tenantId: user.tenantId });
    if (!workspace) {
      // Auto-create UI Pirate organization workspace
      workspace = await Workspace.create({
        owner: user.email,
        name: "UI Pirate",
        tenantId: user.tenantId,
        description: "Central workspace for UI Pirate organization",
      });
      console.log(`✅ Auto-created UI Pirate workspace for tenant ${user.tenantId}`);
    }

    // Get all teams for this workspace
    const teams = await Team.find({ workspace: workspace._id })
      .sort({ createdAt: -1 })
      .lean();

    // Enrich members data with email field for UI compatibility
    const enrichedTeams = teams.map((team: any) => ({
      ...team,
      members: team.members.map((member: any) => ({
        ...member,
        email: member.userId, // userId contains the email
      })),
    }));

    return NextResponse.json({
      success: true,
      data: { teams: enrichedTeams },
    });
  } catch (error: any) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

// POST /api/pirateCOS/teams - Create a new team
export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get or create shared "UI Pirate" workspace scoped to tenant
    let workspace = await Workspace.findOne({ tenantId: user.tenantId });
    if (!workspace) {
      // Auto-create UI Pirate organization workspace
      workspace = await Workspace.create({
        owner: user.email,
        name: "UI Pirate",
        tenantId: user.tenantId,
        description: "Central workspace for UI Pirate organization",
      });
      console.log(`✅ Auto-created UI Pirate workspace for tenant ${user.tenantId}`);
    }

    const body = await req.json();
    const { name, description, brandVoiceOverride, keywordsOverride } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Team name is required" },
        { status: 400 }
      );
    }

    // Create new team
    const team = await Team.create({
      name: name.trim(),
      description: description?.trim() || undefined,
      workspace: workspace._id,
      brandVoiceOverride: brandVoiceOverride || undefined,
      keywordsOverride: keywordsOverride || undefined,
      members: [
        {
          userId: user.email,
          role: "admin",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: { team },
    });
  } catch (error: any) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create team" },
      { status: 500 }
    );
  }
}
