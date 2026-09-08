import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getSession } from "@/lib/auth/session";
import { isAcceptablePassword } from "@/lib/auth/password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/auth/change-password — the signed-in user changes their own password. */
export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: { currentPassword?: string; newPassword?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const current = String(body.currentPassword || "");
  const next = String(body.newPassword || "");

  if (!isAcceptablePassword(next)) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters." },
      { status: 400 },
    );
  }

  await dbConnect();
  const user = await User.findById(session.id);

  if (!user)
    return NextResponse.json({ error: "User not found." }, { status: 404 });

  if (!(await user.comparePassword(current))) {
    return NextResponse.json(
      { error: "Current password is incorrect." },
      { status: 401 },
    );
  }

  user.passwordHash = await User.hashPassword(next);
  user.mustChangePassword = false;
  await user.save();

  return NextResponse.json({ ok: true });
}
