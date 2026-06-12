import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/pirateCOS/Admin";
import { getCurrentUser } from "@/lib/pirateCOS/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();
    const admin = await Admin.findById(user.id).select("-password").lean();

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      profile: admin,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { name, avatar, currentPassword, newPassword } = await request.json();

    await dbConnect();
    const admin = await Admin.findById(user.id).select("+password");

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Update name
    if (name && name.trim()) {
      admin.name = name.trim();
    }

    // Update avatar
    if (avatar !== undefined) {
      admin.avatar = avatar;
    }

const COMMON_PASSWORDS = new Set([
  "password", "12345678", "password123", "piratecos", "qwertyui", "admin123", "welcome123", "123456789"
]);

    // Update password if requested
    if (currentPassword && newPassword) {
      const isPasswordValid = await admin.comparePassword(currentPassword);

      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, error: "Invalid current password" },
          { status: 400 },
        );
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { success: false, error: "New password must be at least 8 characters" },
          { status: 400 },
        );
      }

      if (COMMON_PASSWORDS.has(newPassword.toLowerCase().trim())) {
        return NextResponse.json(
          { success: false, error: "New password is too common. Please choose a more secure password." },
          { status: 400 },
        );
      }

      admin.password = newPassword;
    }

    await admin.save();

    const updatedAdmin = await Admin.findById(user.id).select("-password").lean();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedAdmin,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
