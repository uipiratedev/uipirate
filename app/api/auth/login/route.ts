import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { setSessionCookie } from "@/lib/auth/session";
import { rateLimit } from "@/lib/rateLimit";
import { ipHashFromHeaders } from "@/lib/analytics/ip";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ipHash = ipHashFromHeaders(req.headers);
  const limit = rateLimit(`login:${ipHash}`, 10, 15 * 60 * 1000);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  let body: { email?: string; password?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const password = String(body.password || "");

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  await dbConnect();
  const user = await User.findOne({ email });

  // Generic failure — never reveal whether the email exists or the account is
  // deactivated. Still run a compare on a dummy hash to keep timing even-ish.
  const DUMMY = "$2a$12$abcdefghijklmnopqrstuv0123456789012345678901234567890a";
  const valid = user
    ? await user.comparePassword(password)
    : (await import("@/lib/auth/password"))
        .comparePassword(password, DUMMY)
        .then(() => false);

  if (!user || !user.isActive || !valid) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  user.lastLoginAt = new Date();
  await user.save();

  const res = NextResponse.json({
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    },
  });

  setSessionCookie(res, {
    uid: String(user._id),
    email: user.email,
    role: user.role,
  });

  return res;
}
