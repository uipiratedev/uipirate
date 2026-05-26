import { NextRequest, NextResponse } from "next/server";

import { verifyAuth } from "@/lib/pirateCOS/auth";

export async function GET(req: NextRequest) {
  const user = await verifyAuth();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      {
        success: false,
        error: "LINKEDIN_CLIENT_ID is not configured on the server.",
      },
      { status: 500 },
    );
  }

  // Build redirect URI dynamically matching the current request host and protocol
  const origin = req.nextUrl.origin;
  const redirectUri =
    process.env.LINKEDIN_REDIRECT_URI ||
    `${origin}/api/oauth/linkedin/callback`;

  // We request openid, profile, email for standard OIDC /v2/userinfo + w_member_social to post
  const scope = "w_member_social openid profile email";
  const state = user.tenantId; // Use tenant ID for state matching and verification

  const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri,
  )}&state=${state}&scope=${encodeURIComponent(scope)}`;

  return NextResponse.redirect(linkedinAuthUrl);
}
