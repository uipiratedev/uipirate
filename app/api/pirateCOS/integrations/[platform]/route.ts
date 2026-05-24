import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { verifyAuth } from "@/lib/pirateCOS/auth";
import { decrypt } from "@/lib/encrypt";
import dbConnect from "@/lib/mongodb";
import Integration, { SupportedPlatform } from "@/models/Integration";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> },
) {
  const { platform } = await params;
  const user = await verifyAuth();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!["wordpress", "medium", "ghost", "buffer"].includes(platform)) {
    return NextResponse.json(
      { success: false, error: "Invalid platform" },
      { status: 400 },
    );
  }

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(user.tenantId);

  const doc = await Integration.findOne({ tenantId: tenantOid, platform });

  if (doc) {
    doc.isActive = false;
    // Clear all encrypted/sensitive fields
    if (doc.credentials) {
      doc.credentials.wpAppPasswordEncrypted = undefined;
      doc.credentials.mediumTokenEncrypted = undefined;
      doc.credentials.ghostAdminKeyEncrypted = undefined;
      doc.credentials.bufferAccessTokenEncrypted = undefined;
    }
    await doc.save();
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> },
) {
  const { platform } = await params;
  const user = await verifyAuth();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!["wordpress", "medium", "ghost", "buffer"].includes(platform)) {
    return NextResponse.json(
      { success: false, error: "Invalid platform" },
      { status: 400 },
    );
  }

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(user.tenantId);

  const doc = await Integration.findOne({ tenantId: tenantOid, platform });

  if (!doc || !doc.isActive) {
    return NextResponse.json(
      { success: false, error: "Integration is not active or credentials missing" },
      { status: 400 },
    );
  }

  let message = "Connected successfully";

  try {
    if (platform === "wordpress") {
      const siteUrl = doc.credentials.siteUrl || "";
      const username = doc.credentials.wpUsername || "";
      const appPassword = doc.credentials.wpAppPasswordEncrypted
        ? decrypt(doc.credentials.wpAppPasswordEncrypted)
        : "";

      if (!siteUrl || !username || !appPassword) {
        return NextResponse.json(
          { success: false, error: "Missing WordPress connection settings" },
          { status: 400 },
        );
      }

      let url = siteUrl.startsWith("http://") || siteUrl.startsWith("https://") ? siteUrl : `https://${siteUrl}`;
      url = url.replace(/\/$/, "") + "/wp-json/wp/v2/users/me";

      const wpRes = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Basic ${Buffer.from(`${username}:${appPassword}`).toString("base64")}`,
        },
      });

      const data = await wpRes.json();
      if (!wpRes.ok) {
        return NextResponse.json(
          { success: false, error: data.message || `WordPress Error: ${wpRes.statusText}` },
          { status: 400 },
        );
      }

      message = `Connected successfully to WordPress as @${data.slug || username}`;
    } else if (platform === "medium") {
      const token = doc.credentials.mediumTokenEncrypted
        ? decrypt(doc.credentials.mediumTokenEncrypted)
        : "";

      if (!token) {
        return NextResponse.json(
          { success: false, error: "Missing Medium token" },
          { status: 400 },
        );
      }

      const medRes = await fetch("https://api.medium.com/v1/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await medRes.json();
      if (!medRes.ok) {
        return NextResponse.json(
          { success: false, error: data.errors?.[0]?.message || `Medium Error: ${medRes.statusText}` },
          { status: 400 },
        );
      }

      const authorId = data.data?.id;
      const username = data.data?.username;

      if (authorId && doc.credentials.mediumAuthorId !== authorId) {
        doc.credentials.mediumAuthorId = authorId;
      }

      message = `Connected successfully to Medium as @${username} (Author ID: ${authorId})`;
    } else if (platform === "ghost") {
      const siteUrl = doc.credentials.ghostSiteUrl || "";
      const adminKey = doc.credentials.ghostAdminKeyEncrypted
        ? decrypt(doc.credentials.ghostAdminKeyEncrypted)
        : "";

      if (!siteUrl || !adminKey) {
        return NextResponse.json(
          { success: false, error: "Missing Ghost connection settings" },
          { status: 400 },
        );
      }

      const parts = adminKey.split(":");
      if (parts.length !== 2) {
        return NextResponse.json(
          { success: false, error: "Invalid Ghost Admin API Key format — expected id:secret." },
          { status: 400 },
        );
      }

      const [id, secret] = parts;
      const jwtToken = jwt.sign({}, Buffer.from(secret, "hex"), {
        keyid: id,
        algorithm: "HS256",
        expiresIn: "5m",
        audience: "/admin/",
      });

      let url = siteUrl.startsWith("http://") || siteUrl.startsWith("https://") ? siteUrl : `https://${siteUrl}`;
      url = url.replace(/\/$/, "") + "/ghost/api/admin/site/";

      const ghRes = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Ghost ${jwtToken}`,
        },
      });

      const data = await ghRes.json();
      if (!ghRes.ok) {
        return NextResponse.json(
          { success: false, error: data.errors?.[0]?.message || `Ghost Error: ${ghRes.statusText}` },
          { status: 400 },
        );
      }

      message = `Connected successfully to Ghost: "${data.site?.title || "Site"}" (v${data.site?.version || "unknown"})`;
    } else if (platform === "buffer") {
      const token = doc.credentials.bufferAccessTokenEncrypted
        ? decrypt(doc.credentials.bufferAccessTokenEncrypted)
        : "";

      if (!token) {
        return NextResponse.json(
          { success: false, error: "Missing Buffer access token" },
          { status: 400 },
        );
      }

      const bufRes = await fetch("https://api.bufferapp.com/1/profiles.json", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profiles = await bufRes.json();
      if (!bufRes.ok) {
        return NextResponse.json(
          { success: false, error: profiles.message || `Buffer Error: ${bufRes.statusText}` },
          { status: 400 },
        );
      }

      const count = Array.isArray(profiles) ? profiles.length : 0;

      if (Array.isArray(profiles) && count > 0) {
        doc.credentials.bufferProfileIds = profiles.map((p: any) => p.id);
      }

      message = `Connected successfully to Buffer with ${count} active social profiles`;
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: `Connection probe failed: ${err.message || err}` },
      { status: 400 },
    );
  }

  doc.lastTestedAt = new Date();
  await doc.save();

  return NextResponse.json({
    success: true,
    message,
  });
}
