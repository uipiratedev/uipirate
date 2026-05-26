import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { verifyAuth } from "@/lib/pirateCOS/auth";
import { encrypt } from "@/lib/pirateCOS/encrypt";
import dbConnect from "@/lib/mongodb";
import Integration from "@/models/pirateCOS/Integration";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");
  const errorDescription = req.nextUrl.searchParams.get("error_description");

  const host = req.headers.get("host") || "localhost:3000";
  const isSubdomain =
    host.startsWith("cos.") ||
    (host.includes("localhost") && host.startsWith("cos."));
  const basePath = isSubdomain ? "" : "/pirateCOS";

  const protocol =
    host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  const requestOrigin = `${protocol}://${host}`;

  if (error) {
    return NextResponse.redirect(
      new URL(
        `${basePath}/settings/integrations?error=linkedin_oauth_failed&desc=${encodeURIComponent(
          errorDescription || error,
        )}`,
        requestOrigin,
      ),
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL(
        `${basePath}/settings/integrations?error=missing_oauth_params`,
        requestOrigin,
      ),
    );
  }

  const user = await verifyAuth();

  // Validate state matches user's tenant ID for basic CSRF/security check
  if (!user || state !== user.tenantId) {
    return NextResponse.redirect(
      new URL(
        `${basePath}/settings/integrations?error=invalid_oauth_state`,
        requestOrigin,
      ),
    );
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL(
        `${basePath}/settings/integrations?error=server_missing_secrets`,
        requestOrigin,
      ),
    );
  }

  try {
    const redirectUri =
      process.env.LINKEDIN_REDIRECT_URI ||
      `${requestOrigin}/api/oauth/linkedin/callback`;

    // 1. Exchange authorization code for access token
    const tokenRes = await fetch(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
        }),
      },
    );

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      throw new Error(
        tokenData.error_description ||
          tokenData.error ||
          "Failed to exchange OAuth token",
      );
    }

    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error("No access token returned from LinkedIn OAuth server");
    }

    // 2. Fetch member ID and profile info
    let memberId = "";

    try {
      const userinfoRes = await fetch("https://api.linkedin.com/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (userinfoRes.ok) {
        const userInfo = await userinfoRes.json();

        if (userInfo.sub) {
          memberId = userInfo.sub;
        }
      }
    } catch (e) {
      // Fall back to /v2/me if standard /v2/userinfo fails
    }

    if (!memberId) {
      const meRes = await fetch("https://api.linkedin.com/v2/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      const meData = await meRes.json();

      if (!meRes.ok) {
        throw new Error(
          meData.message || "Failed to fetch LinkedIn profile details",
        );
      }
      memberId = meData.id;
    }

    if (!memberId) {
      throw new Error("Could not resolve LinkedIn member ID");
    }

    // 3. Encrypt access token and save integration document
    await dbConnect();
    const tenantOid = new mongoose.Types.ObjectId(user.tenantId);
    const encryptedToken = encrypt(accessToken);

    let doc = await Integration.findOne({
      tenantId: tenantOid,
      platform: "linkedin",
    });

    if (!doc) {
      doc = new Integration({
        tenantId: tenantOid,
        platform: "linkedin",
        credentials: {},
        isActive: true,
      });
    }

    doc.credentials.linkedinTokenEncrypted = encryptedToken;
    doc.credentials.linkedinUserId = memberId;
    doc.credentials.linkedinPreferArticles = true;
    doc.isActive = true;
    doc.lastTestedAt = new Date();

    await doc.save();

    // Redirect to settings integrations page with success parameter
    return NextResponse.redirect(
      new URL(
        `${basePath}/settings/integrations?success=linkedin`,
        requestOrigin,
      ),
    );
  } catch (err: any) {
    return NextResponse.redirect(
      new URL(
        `${basePath}/settings/integrations?error=oauth_process_failed&desc=${encodeURIComponent(
          err.message || String(err),
        )}`,
        requestOrigin,
      ),
    );
  }
}
