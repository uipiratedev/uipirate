import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { verifyAuth } from "@/lib/pirateCOS/auth";

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Missing required Cloudinary environment variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate MIME type
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/webm"
    ];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Unsupported file type. Allowed formats: images (JPEG, PNG, GIF, WEBP, SVG) and videos (MP4, MPEG, MOV, WEBM)." },
        { status: 400 }
      );
    }

    // Validate size (10MB limit)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size exceeds limit of 10MB" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert upload to a promise
    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `pirateCOS/${user.tenantId}`,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
    });
  } catch (error: any) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
