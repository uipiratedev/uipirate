import dbConnect from "@/lib/mongodb";
import Admin from "@/models/pirateCOS/Admin";
import Notification from "@/models/pirateCOS/Notification";

interface NotifyPayload {
  type: "org_invite" | "post_assigned" | "post_approved" | "post_rejected" | "mention";
  title: string;
  message: string;
  href?: string;
  relatedId?: string;
}

/** Create an in-app notification for the user identified by email. Silently swallows errors so callers never fail. */
export async function notifyByEmail(email: string, payload: NotifyPayload): Promise<void> {
  try {
    await dbConnect();
    const recipient = await Admin.findOne({ email: email.trim().toLowerCase() }).lean();
    if (!recipient) return;

    await Notification.create({
      userId: recipient._id,
      ...payload,
    });
  } catch {
    // notifications are best-effort — never block the main action
  }
}
