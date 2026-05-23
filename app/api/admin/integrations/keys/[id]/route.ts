import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { verifyAuth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import ApiKey from "@/models/ApiKey";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await verifyAuth();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid API key ID" },
      { status: 400 },
    );
  }

  await dbConnect();
  const tenantOid = new mongoose.Types.ObjectId(user.tenantId);

  // Hard delete or set isActive to false. Hard deleting is clean since it's fully revoked
  const result = await ApiKey.deleteOne({ _id: new mongoose.Types.ObjectId(id), tenantId: tenantOid });

  if (result.deletedCount === 0) {
    return NextResponse.json(
      { success: false, error: "API Key not found or access denied" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true });
}
