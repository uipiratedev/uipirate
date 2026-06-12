import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "super-admin";
  isActive: boolean;
  /** Subscription tier — used to gate features and API usage */
  plan: "free" | "starter" | "pro" | "enterprise";
  /** Stripe customer ID for billing management */
  stripeCustomerId?: string;
  /** Stripe subscription ID */
  stripeSubscriptionId?: string;
  /** Stripe subscription status */
  subscriptionStatus?: "active" | "trialing" | "past_due" | "canceled";
  /** End of the current billing cycle */
  currentPeriodEnd?: Date;
  /** Credits remaining for shared AI pool generations and publishing */
  creditsRemaining: number;
  /** Rolling monthly usage counters — reset by Stripe webhook or cron */
  usageThisMonth: {
    aiRequests: number;
    distributions: number;
  };
  /** BYOK (Bring Your Own Key) Configuration Toggles */
  byokEnabled: {
    openai: boolean;
    gemini: boolean;
    mistral: boolean;
    anthropic: boolean;
    grok: boolean;
    openrouter: boolean;
  };
  /** Trial tracking counters */
  trialStartedAt?: Date;
  trialEndsAt?: Date;
  convertedFromFreeToPaidAt?: Date;
  /** Lifetime value aggregated from invoice payments */
  lifetimeValue: number;
  accountType: "individual" | "organization";
  orgRole: "individual" | "org-admin" | "admin" | "editor" | "viewer";
  parentOrgId: mongoose.Types.ObjectId | null;
  seatCount: number;
  seatLimit: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["admin", "super-admin"],
      default: "admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    plan: {
      type: String,
      enum: ["free", "starter", "pro", "enterprise"],
      default: "free",
    },
    stripeCustomerId: {
      type: String,
      default: null,
    },
    stripeSubscriptionId: {
      type: String,
      default: null,
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "trialing", "past_due", "canceled", null],
      default: null,
    },
    currentPeriodEnd: {
      type: Date,
      default: null,
    },
    creditsRemaining: {
      type: Number,
      default: 20.0, // Give new/free accounts 20 free credits initially
    },
    usageThisMonth: {
      aiRequests: { type: Number, default: 0 },
      distributions: { type: Number, default: 0 },
    },
    byokEnabled: {
      openai: { type: Boolean, default: false },
      gemini: { type: Boolean, default: false },
      mistral: { type: Boolean, default: false },
      anthropic: { type: Boolean, default: false },
      grok: { type: Boolean, default: false },
      openrouter: { type: Boolean, default: false },
    },
    trialStartedAt: {
      type: Date,
      default: null,
    },
    trialEndsAt: {
      type: Date,
      default: null,
    },
    convertedFromFreeToPaidAt: {
      type: Date,
      default: null,
    },
    lifetimeValue: {
      type: Number,
      default: 0,
    },
    accountType: {
      type: String,
      enum: ["individual", "organization"],
      default: "individual",
    },
    orgRole: {
      type: String,
      enum: ["individual", "org-admin", "admin", "editor", "viewer"],
      default: "individual",
    },
    parentOrgId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    seatCount: {
      type: Number,
      default: 1,
    },
    seatLimit: {
      type: Number,
      default: 1,
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
AdminSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Prevent model recompilation in development
const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
