import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import Team from "@/models/pirateCOS/Team";
import Admin from "@/models/pirateCOS/Admin";
import { requireOrgRole } from "@/lib/pirateCOS/require-role";

// POST /api/pirateCOS/teams/[id]/members - Add a member to team
export async function POST(
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

    if (!requireOrgRole(user, ["org-admin", "admin"])) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { email, role } = body;

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const team = await Team.findById(params.id);
    if (!team) {
      return NextResponse.json(
        { success: false, error: "Team not found" },
        { status: 404 }
      );
    }

    // Check if user exists in the system
    const memberExists = await Admin.findOne({ email: email.trim() });
    if (!memberExists) {
      return NextResponse.json(
        { success: false, error: "User not found. They must register first." },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const alreadyMember = team.members.some(
      (m: any) => m.userId === email.trim()
    );
    if (alreadyMember) {
      return NextResponse.json(
        { success: false, error: "User is already a member of this team" },
        { status: 400 }
      );
    }

    // Add member
    team.members.push({
      userId: email.trim(),
      role: role || "editor",
    });

    await team.save();

    return NextResponse.json({
      success: true,
      data: { team },
    });
  } catch (error: any) {
    console.error("Error adding member:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add member" },
      { status: 500 }
    );
  }
}

// DELETE /api/pirateCOS/teams/[id]/members - Remove a member from team
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

    if (!requireOrgRole(user, ["org-admin", "admin"])) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const team = await Team.findById(params.id);
    if (!team) {
      return NextResponse.json(
        { success: false, error: "Team not found" },
        { status: 404 }
      );
    }

    // Remove member
    team.members = team.members.filter((m: any) => m.userId !== userId);

    await team.save();

    return NextResponse.json({
      success: true,
      data: { team },
    });
  } catch (error: any) {
    console.error("Error removing member:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove member" },
      { status: 500 }
    );
  }
}
