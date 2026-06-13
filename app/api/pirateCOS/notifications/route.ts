import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import { verifyAuth } from "@/lib/pirateCOS/auth";
import Notification from "@/models/pirateCOS/Notification";

// GET /api/pirateCOS/notifications — fetch latest 30 notifications for the current user
export async function GET() {
  try {
    const user = await verifyAuth();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    const notifications = await Notification.find({ userId: new mongoose.Types.ObjectId(user.id) })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const unreadCount = await Notification.countDocuments({
      userId: new mongoose.Types.ObjectId(user.id),
      read: false,
    });

    return NextResponse.json({ success: true, notifications, unreadCount });
  } catch (error) {
    console.error("GET /notifications error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch notifications" }, { status: 500 });
  }
}

// PATCH /api/pirateCOS/notifications — mark notifications as read
// Body: { ids: string[] }  — specific IDs, or omit to mark all read
export async function PATCH(req: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    const body = await req.json().catch(() => ({}));
    const userOid = new mongoose.Types.ObjectId(user.id);

    if (body.ids && Array.isArray(body.ids) && body.ids.length > 0) {
      const oids = body.ids.map((id: string) => new mongoose.Types.ObjectId(id));
      await Notification.updateMany({ _id: { $in: oids }, userId: userOid }, { read: true });
    } else {
      await Notification.updateMany({ userId: userOid, read: false }, { read: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /notifications error:", error);
    return NextResponse.json({ success: false, error: "Failed to update notifications" }, { status: 500 });
  }
}
