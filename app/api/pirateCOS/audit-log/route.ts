import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import AuditLog from "@/models/pirateCOS/AuditLog";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import { checkRole } from "@/lib/pirateCOS/require-role";

// GET /api/pirateCOS/audit-log — org-admin only, scoped to tenant
export async function GET(req: NextRequest) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const denied = checkRole(user, ["org-admin"]);
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const actorEmail = searchParams.get("actor");
  const targetId = searchParams.get("targetId");
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "50", 10), 1), 200);
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const skip = (page - 1) * limit;

  await dbConnect();

  const query: Record<string, unknown> = {
    tenantId: new mongoose.Types.ObjectId(user.tenantId),
  };

  if (action) query.action = action;
  if (actorEmail) query.actorEmail = actorEmail;
  if (targetId) query.targetId = targetId;

  const logsPromise = AuditLog.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean<Record<string, unknown>[]>();
  const totalPromise = AuditLog.countDocuments(query);
  const logs = await logsPromise;
  const total = await totalPromise;

  return NextResponse.json({
    success: true,
    data: logs,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
}
