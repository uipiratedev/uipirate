import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import Team from "@/models/pirateCOS/Team";
import Workspace from "@/models/pirateCOS/Workspace";

// GET /api/pirateCOS/teams/[id] - Get a specific team
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const team = await Team.findById(params.id).lean();
    if (!team) {
      return NextResponse.json(
        { success: false, error: "Team not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this team's workspace
    const workspace = await Workspace.findById(team.workspace);
    if (!workspace) {
      return NextResponse.json(
        { success: false, error: "Team workspace not found" },
        { status: 404 }
      );
    }

    if (workspace.tenantId?.toString() !== user.tenantId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Enrich members data with email field for UI compatibility
    const enrichedTeam = {
      ...team,
      members: team.members.map((member: any) => ({
        ...member,
        email: member.userId, // userId contains the email
      })),
    };

    return NextResponse.json({
      success: true,
      data: { team: enrichedTeam },
    });
  } catch (error: any) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}

// PATCH /api/pirateCOS/teams/[id] - Update a team
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const team = await Team.findById(params.id);
    if (!team) {
      return NextResponse.json(
        { success: false, error: "Team not found" },
        { status: 404 }
      );
    }

    // Check if user has admin access
    const workspace = await Workspace.findById(team.workspace);
    if (!workspace || workspace.owner !== user.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, description, brandVoiceOverride, keywordsOverride } = body;

    // Update team
    if (name !== undefined) team.name = name.trim();
    if (description !== undefined) team.description = description.trim() || undefined;
    if (brandVoiceOverride !== undefined) team.brandVoiceOverride = brandVoiceOverride || undefined;
    if (keywordsOverride !== undefined) team.keywordsOverride = keywordsOverride;

    await team.save();

    return NextResponse.json({
      success: true,
      data: { team },
    });
  } catch (error: any) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update team" },
      { status: 500 }
    );
  }
}

// DELETE /api/pirateCOS/teams/[id] - Delete a team
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const team = await Team.findById(params.id);
    if (!team) {
      return NextResponse.json(
        { success: false, error: "Team not found" },
        { status: 404 }
      );
    }

    // Check if user has admin access
    const workspace = await Workspace.findById(team.workspace);
    if (!workspace || workspace.owner !== user.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    await team.deleteOne();

    return NextResponse.json({
      success: true,
      data: { message: "Team deleted successfully" },
    });
  } catch (error: any) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete team" },
      { status: 500 }
    );
  }
}
