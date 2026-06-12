import dbConnect from "@/lib/mongodb";
import AuditLog, { AuditAction } from "@/models/pirateCOS/AuditLog";
import { User } from "./auth";

interface AuditOptions {
  targetId?: string;
  targetType?: string;
  meta?: Record<string, unknown>;
  ip?: string;
}

export async function audit(
  user: User,
  action: AuditAction,
  opts: AuditOptions = {}
): Promise<void> {
  try {
    await dbConnect();
    await AuditLog.create({
      tenantId: user.tenantId,
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.orgRole ?? user.accountType ?? "unknown",
      action,
      targetId: opts.targetId,
      targetType: opts.targetType,
      meta: opts.meta,
      ip: opts.ip,
    });
  } catch (err) {
    // Never block the main action if audit write fails
    console.error("[audit] Failed to write audit log:", err);
  }
}
