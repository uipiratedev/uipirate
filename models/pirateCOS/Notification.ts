import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  /** Recipient user ID */
  userId: mongoose.Types.ObjectId;
  type: "org_invite" | "post_assigned" | "post_approved" | "post_rejected" | "mention";
  title: string;
  message: string;
  read: boolean;
  /** Optional link to navigate to on click */
  href?: string;
  /** Related entity id (post id, team id, etc.) */
  relatedId?: string;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Admin", required: true, index: true },
    type: {
      type: String,
      enum: ["org_invite", "post_assigned", "post_approved", "post_rejected", "mention"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
    href: { type: String },
    relatedId: { type: String },
  },
  { timestamps: true },
);

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

const Notification: Model<INotification> =
  (mongoose.models.Notification as Model<INotification>) ||
  mongoose.model<INotification>("Notification", NotificationSchema, "notifications");

export default Notification;
