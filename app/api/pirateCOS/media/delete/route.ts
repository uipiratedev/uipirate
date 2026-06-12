import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import { checkRole } from "@/lib/pirateCOS/require-role";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dvk9ttiym",
  api_key: process.env.CLOUDINARY_API_KEY || "457587266721653",
  api_secret: process.env.CLOUDINARY_API_SECRET || "tuZ9mM2fgeOgicBUXh3zXTfZ9fw",
  secure: true,
});

function getPublicIdFromUrl(url: string): string | null {
  if (!url || !url.includes("/image/upload/")) return null;
  const parts = url.split("/image/upload/");
  if (parts.length < 2) return null;

  const pathParts = parts[1].split("/");
  // If the first part starts with 'v' and is followed by digits, it's the version prefix, so skip it
  if (pathParts.length > 0 && /^v\d+$/.test(pathParts[0])) {
    pathParts.shift();
  }

  const joined = pathParts.join("/");
  const lastDotIndex = joined.lastIndexOf(".");
  const publicId = lastDotIndex === -1 ? joined : joined.substring(0, lastDotIndex);
  return publicId;
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const denied = checkRole(user, ["org-admin", "admin"]);
    if (denied) return denied;

    const { urls } = await req.json();
    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { success: false, error: "Invalid urls array" },
        { status: 400 }
      );
    }

    const publicIds = urls
      .map(getPublicIdFromUrl)
      .filter((id): id is string => id !== null);

    if (publicIds.length === 0) {
      return NextResponse.json({ success: true, message: "No valid Cloudinary URLs to delete" });
    }

    // Delete the media in parallel
    const deletePromises = publicIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId)
    );
    const results = await Promise.allSettled(deletePromises);

    console.log("Cloudinary deletion results:", results);

    return NextResponse.json({
      success: true,
      results: results.map((r) => r.status),
    });
  } catch (error: any) {
    console.error("Error deleting from Cloudinary:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
