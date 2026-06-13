import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import { checkRole } from "@/lib/pirateCOS/require-role";
import { audit } from "@/lib/pirateCOS/audit";
import { notifyByEmail } from "@/lib/pirateCOS/notify";
import Admin from "@/models/pirateCOS/Admin";

// POST /api/pirateCOS/org/members — invite an existing user into the organisation
export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const denied = checkRole(user, ["org-admin"]);
    if (denied) return denied;

    const { email, role } = await req.json();

    if (!email || !email.trim()) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const validRoles = ["admin", "editor", "viewer"];
    const assignedRole = validRoles.includes(role) ? role : "editor";

    await dbConnect();

    const member = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (!member) {
      return NextResponse.json(
        { success: false, error: "No account found with that email. They must register first." },
        { status: 404 }
      );
    }

    if (member._id.toString() === user.tenantId) {
      return NextResponse.json(
        { success: false, error: "You cannot add yourself as a member." },
        { status: 400 }
      );
    }

    if (member.parentOrgId && member.parentOrgId.toString() === user.tenantId) {
      return NextResponse.json(
        { success: false, error: "This user is already a member of your organisation." },
        { status: 400 }
      );
    }

    await Admin.findByIdAndUpdate(member._id, {
      parentOrgId: user.tenantId,
      accountType: "organization",
      orgRole: assignedRole,
    });

    await audit(user, "org.member_invite", {
      targetId: member._id.toString(),
      targetType: "admin",
      meta: { email: email.trim().toLowerCase(), role: assignedRole },
    });

    await notifyByEmail(email.trim().toLowerCase(), {
      type: "org_invite",
      title: "You've been added to an organisation",
      message: `${user.name || user.email} added you to their organisation as ${assignedRole}.`,
      href: "/pirateCOS/profile",
    });

    return NextResponse.json({
      success: true,
      message: `${email.trim()} has been added to your organisation as ${assignedRole}.`,
      member: {
        id: member._id.toString(),
        name: member.name,
        email: member.email,
        orgRole: assignedRole,
      },
    });
  } catch (error: any) {
    console.error("Error adding org member:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/pirateCOS/org/members — remove a member from the organisation
export async function DELETE(req: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const denied = checkRole(user, ["org-admin"]);
    if (denied) return denied;

    const { memberId } = await req.json();
    if (!memberId) {
      return NextResponse.json({ success: false, error: "memberId is required" }, { status: 400 });
    }

    await dbConnect();

    const member = await Admin.findOne({ _id: memberId, parentOrgId: user.tenantId });
    if (!member) {
      return NextResponse.json(
        { success: false, error: "Member not found in your organisation." },
        { status: 404 }
      );
    }

    await Admin.findByIdAndUpdate(member._id, {
      parentOrgId: null,
      accountType: "individual",
      orgRole: "individual",
    });

    await audit(user, "org.member_remove", {
      targetId: member._id.toString(),
      targetType: "admin",
      meta: { email: member.email },
    });

    return NextResponse.json({ success: true, message: "Member removed from organisation." });
  } catch (error: any) {
    console.error("Error removing org member:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
