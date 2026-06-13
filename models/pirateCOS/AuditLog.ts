import mongoose, { Schema, Document, Model } from "mongoose";

export type AuditAction =
  | "post.publish"
  | "post.unpublish"
  | "post.delete"
  | "post.create"
  | "post.update"
  | "post.approve"
  | "post.reject"
  | "post.request_review"
  | "team.member_add"
  | "team.member_remove"
  | "team.member_role_change"
  | "team.create"
  | "team.delete"
  | "billing.checkout"
  | "billing.portal"
  | "ai_config.update"
  | "org.convert"
  | "member.role_change";

export interface IAuditLog extends Document {
  tenantId: mongoose.Types.ObjectId;
  actorId: string;       // user email or id
  actorEmail: string;
  actorRole: string;
  action: AuditAction;
  targetId?: string;     // affected resource id
  targetType?: string;   // "post" | "team" | "member" etc.
  meta?: Record<string, unknown>;
  ip?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    tenantId: { type: Schema.Types.ObjectId, required: true, index: true },
    actorId: { type: String, required: true },
    actorEmail: { type: String, required: true },
    actorRole: { type: String, default: "unknown" },
    action: { type: String, required: true },
    targetId: { type: String },
    targetType: { type: String },
    meta: { type: Schema.Types.Mixed },
    ip: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

AuditLogSchema.index({ tenantId: 1, createdAt: -1 });
AuditLogSchema.index({ tenantId: 1, action: 1, createdAt: -1 });

const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

export default AuditLog;
