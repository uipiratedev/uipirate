import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBillingEvent extends Document {
  tenantId: mongoose.Types.ObjectId;
  event:
    | "subscription.created"
    | "subscription.updated"
    | "subscription.deleted"
    | "invoice.paid"
    | "payment_failed"
    | "credit.topup";
  stripeEventId: string;
  amount?: number;
  currency?: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

const BillingEventSchema: Schema<IBillingEvent> = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },
    event: {
      type: String,
      enum: [
        "subscription.created",
        "subscription.updated",
        "subscription.deleted",
        "invoice.paid",
        "payment_failed",
        "credit.topup",
      ],
      required: true,
    },
    stripeEventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    amount: {
      type: Number,
      default: null,
    },
    currency: {
      type: String,
      default: null,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const BillingEvent: Model<IBillingEvent> =
  (mongoose.models.BillingEvent as Model<IBillingEvent>) ||
  mongoose.model<IBillingEvent>("BillingEvent", BillingEventSchema);

export default BillingEvent;
