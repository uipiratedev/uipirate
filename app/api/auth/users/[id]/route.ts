import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { requireApi } from "@/lib/auth/session";
import { isRole } from "@/lib/auth/roles";
import {
  generateTempPassword,
  isAcceptablePassword,
} from "@/lib/auth/password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * PATCH /api/auth/users/[id]
 * body: { role?, isActive?, resetPassword?: true, password?: string }
 * Guards against removing the last active website-admin.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApi("manage:users");

  if (!guard.ok) return guard.response;

  if (!mongoose.isValidObjectId(params.id)) {
    return NextResponse.json({ error: "Invalid user id." }, { status: 400 });
  }

  let body: {
    role?: string;
    isActive?: boolean;
    resetPassword?: boolean;
    password?: string;
    name?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  await dbConnect();
  const user = await User.findById(params.id);

  if (!user)
    return NextResponse.json({ error: "User not found." }, { status: 404 });

  const wasProtectedAdmin = user.role === "website-admin" && user.isActive;
  const willLoseAdmin =
    wasProtectedAdmin &&
    ((body.role !== undefined && body.role !== "website-admin") ||
      body.isActive === false);

  if (willLoseAdmin && (await User.activeAdminCount(user.id)) === 0) {
    return NextResponse.json(
      { error: "Cannot demote or deactivate the last active website admin." },
      { status: 409 },
    );
  }

  let tempPassword: string | undefined;

  if (typeof body.name === "string" && body.name.trim())
    user.name = body.name.trim();

  if (body.role !== undefined) {
    if (!isRole(body.role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }
    user.role = body.role;
  }

  if (typeof body.isActive === "boolean") user.isActive = body.isActive;

  if (body.resetPassword) {
    tempPassword =
      body.password && isAcceptablePassword(body.password)
        ? String(body.password)
        : generateTempPassword();
    user.passwordHash = await User.hashPassword(tempPassword);
    user.mustChangePassword = true;
  }

  await user.save();

  return NextResponse.json({
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
    tempPassword,
  });
}

/** DELETE /api/auth/users/[id] — hard delete. Same last-admin guard. */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApi("manage:users");

  if (!guard.ok) return guard.response;

  if (!mongoose.isValidObjectId(params.id)) {
    return NextResponse.json({ error: "Invalid user id." }, { status: 400 });
  }

  if (params.id === guard.user.id) {
    return NextResponse.json(
      { error: "You cannot delete your own account." },
      { status: 409 },
    );
  }

  await dbConnect();
  const user = await User.findById(params.id);

  if (!user)
    return NextResponse.json({ error: "User not found." }, { status: 404 });

  if (
    user.role === "website-admin" &&
    user.isActive &&
    (await User.activeAdminCount(user.id)) === 0
  ) {
    return NextResponse.json(
      { error: "Cannot delete the last active website admin." },
      { status: 409 },
    );
  }

  await user.deleteOne();

  return NextResponse.json({ ok: true });
}
