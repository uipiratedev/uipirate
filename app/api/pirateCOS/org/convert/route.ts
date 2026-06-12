import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/pirateCOS/Admin";
import BrandBrain from "@/models/pirateCOS/BrandBrain";
import Workspace from "@/models/pirateCOS/Workspace";
import Team from "@/models/pirateCOS/Team";
import { getCurrentUser } from "@/lib/pirateCOS/auth";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not configured");
  return secret;
}
const JWT_EXPIRES_IN = "30d";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const {
      orgName,
      orgDescription,
      orgWebsite,
      ICPDescription,
      primaryFocus,
      inviteEmails,
    } = await request.json();

    if (!orgName || !orgName.trim()) {
      return NextResponse.json(
        { success: false, error: "Organisation name is required" },
        { status: 400 },
      );
    }

    await dbConnect();
    const admin = await Admin.findById(user.id);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Update Admin details
    admin.accountType = "organization";
    admin.orgRole = "org-admin";
    await admin.save();

    // Check/Update Brand Brain
    let brandBrain = await BrandBrain.findOne({ tenantId: admin._id });

    if (brandBrain) {
      brandBrain.workspaceType = "team";
      brandBrain.workspaceName = orgName.trim();
      brandBrain.workspaceDescription = orgDescription?.trim() || brandBrain.workspaceDescription;
      brandBrain.companyName = orgName.trim();
      if (ICPDescription && ICPDescription.trim()) {
        brandBrain.audienceICP = ICPDescription.trim();
      }
      if (primaryFocus && primaryFocus.trim()) {
        brandBrain.products = primaryFocus.trim();
      }
      await brandBrain.save();
    } else {
      brandBrain = new BrandBrain({
        tenantId: admin._id,
        workspaceType: "team",
        workspaceName: orgName.trim(),
        workspaceDescription: orgDescription?.trim() || "",
        companyName: orgName.trim(),
        brandVoice: "Professional",
        products: primaryFocus?.trim() || "AI writing software",
        audienceICP: ICPDescription?.trim() || "General audience",
        targetKeywords: [],
        forbiddenWords: [],
      });
      await brandBrain.save();
    }

    // Check/Create Workspace
    let workspace = await Workspace.findOne({ tenantId: admin._id });

    if (!workspace) {
      workspace = new Workspace({
        name: orgName.trim(),
        owner: admin.email,
        tenantId: admin._id,
        brandBrain: brandBrain._id,
        description: orgDescription?.trim() || `Central workspace for ${orgName.trim()}`,
      });
      await workspace.save();
    } else {
      workspace.name = orgName.trim();
      workspace.description = orgDescription?.trim() || workspace.description;
      workspace.brandBrain = brandBrain._id;
      await workspace.save();
    }

    // Parse invited emails
    const emails = inviteEmails
      ? inviteEmails
          .split(/[\s,;\n]+/)
          .map((e: string) => e.trim().toLowerCase())
          .filter(Boolean)
      : [];

    // Invite existing users by linking their parentOrgId and setting organization roles
    if (emails.length > 0) {
      await Admin.updateMany(
        { email: { $in: emails }, parentOrgId: null },
        {
          $set: {
            parentOrgId: admin._id,
            accountType: "organization",
            orgRole: "editor",
          },
        },
      );
    }

    // Create a default "Marketing" Team for the workspace with the invited members
    const teamMembers = [
      { userId: admin.email, role: "admin" as const },
      ...emails.map((email: string) => ({ userId: email, role: "editor" as const })),
    ];

    await Team.create({
      name: "Marketing",
      description: `Default marketing team for ${orgName.trim()}`,
      workspace: workspace._id,
      members: teamMembers,
    });

    // Sign new JWT token reflecting updated organization admin role
    const token = jwt.sign(
      {
        userId: String(admin._id),
        email: admin.email,
        role: admin.role,
        tenantId: String(admin._id),
        plan: admin.plan || "free",
        accountType: "organization",
        orgRole: "org-admin",
        avatar: admin.avatar || "",
      },
      getJwtSecret(),
      { expiresIn: JWT_EXPIRES_IN },
    );

    const cookieStore = await cookies();

    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Successfully converted and onboarded organisation",
      user: {
        id: String(admin._id),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        tenantId: String(admin._id),
        plan: admin.plan || "free",
        accountType: "organization",
        orgRole: "org-admin",
        avatar: admin.avatar || "",
      },
      token,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
