import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { requireApi } from "@/lib/auth/session";
import { isRole, ROLE_LABELS } from "@/lib/auth/roles";
import {
  generateTempPassword,
  isAcceptablePassword,
} from "@/lib/auth/password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/auth/users — list all dashboard users. */
export async function GET() {
  const guard = await requireApi("manage:users");

  if (!guard.ok) return guard.response;

  await dbConnect();
  const users = await User.find({})
    .select("name email role isActive lastLoginAt mustChangePassword createdAt")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ users });
}

/** POST /api/auth/users — invite a new user with a generated temp password. */
export async function POST(req: NextRequest) {
  const guard = await requireApi("manage:users");

  if (!guard.ok) return guard.response;

  let body: { name?: string; email?: string; role?: string; password?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const role = body.role;

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address." },
      { status: 400 },
    );
  }

  if (!isRole(role)) {
    return NextResponse.json(
      { error: `Role must be one of: ${Object.keys(ROLE_LABELS).join(", ")}` },
      { status: 400 },
    );
  }

  await dbConnect();

  if (await User.exists({ email })) {
    return NextResponse.json(
      { error: "A user with that email already exists." },
      { status: 409 },
    );
  }

  const tempPassword =
    body.password && isAcceptablePassword(body.password)
      ? String(body.password)
      : generateTempPassword();

  const user = await User.create({
    name,
    email,
    role,
    passwordHash: await User.hashPassword(tempPassword),
    isActive: true,
    mustChangePassword: true,
    createdBy: guard.user.id,
  });

  return NextResponse.json(
    {
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
      // Returned once so the admin can hand it to the invitee. Not stored anywhere.
      tempPassword,
    },
    { status: 201 },
  );
}
