import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import dbConnect from "@/lib/mongodb";
import Admin from "@/models/pirateCOS/Admin";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}
const JWT_EXPIRES_IN = "30d"; // 30 days

const COMMON_PASSWORDS = new Set([
  "password", "12345678", "password123", "piratecos", "qwertyui", "admin123", "welcome123", "123456789"
]);

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { name, email, password } = await request.json();

    // 1. Validate Input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters long",
        },
        { status: 400 },
      );
    }

    if (COMMON_PASSWORDS.has(password.toLowerCase().trim())) {
      return NextResponse.json(
        {
          success: false,
          message: "Password is too common. Please choose a more secure password.",
        },
        { status: 400 },
      );
    }

    // 2. Check if user already exists
    const existingUser = await Admin.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is already registered. Please sign in instead.",
        },
        { status: 400 },
      );
    }

    // 3. Create brand new Admin / Tenant
    const admin = new Admin({
      name,
      email,
      password,
      role: "admin",
      isActive: true,
      plan: "free",
      creditsRemaining: 20.0,
      usageThisMonth: { aiRequests: 0, distributions: 0 },
      byokEnabled: {
        openai: false,
        gemini: false,
        mistral: false,
        anthropic: false,
      },
      lifetimeValue: 0,
    });

    await admin.save();

    // 4. Generate JWT Token (matching login structure)
    const token = jwt.sign(
      {
        userId: String(admin._id),
        email: admin.email,
        role: admin.role,
        tenantId: String(admin._id), // each Admin is their own tenant
        plan: admin.plan || "free",
        accountType: admin.accountType || "individual",
        orgRole: admin.orgRole || "individual",
        avatar: admin.avatar || "",
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    // 5. Set HTTP-Only Cookie
    const cookieStore = await cookies();

    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      path: "/",
    });

    // 6. Return Success Response
    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        id: String(admin._id),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        tenantId: String(admin._id),
        plan: admin.plan || "free",
        accountType: admin.accountType || "individual",
        orgRole: admin.orgRole || "individual",
        avatar: admin.avatar || "",
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error during registration",
      },
      { status: 500 },
    );
  }
}
