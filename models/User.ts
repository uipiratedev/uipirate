import mongoose, { Schema, Document, Model } from "mongoose";

import { ROLES, type Role } from "@/lib/auth/roles";
import { hashPassword, comparePassword } from "@/lib/auth/password";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  isActive: boolean;
  lastLoginAt?: Date;
  /** The website-admin who invited this account (absent for the seeded root admin). */
  createdBy?: mongoose.Types.ObjectId;
  /** Set on invite; cleared once the user changes their temp password. */
  mustChangePassword: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(plain: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {
  hashPassword(plain: string): Promise<string>;
  /** Count of active website-admins — used to block self-lockout. */
  activeAdminCount(excludeId?: string): Promise<number>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ROLES,
      default: "normal-user",
      required: true,
      index: true,
    },
    isActive: { type: Boolean, default: true, index: true },
    lastLoginAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    mustChangePassword: { type: Boolean, default: false },
    avatar: { type: String },
  },
  { timestamps: true },
);

UserSchema.methods.comparePassword = function (plain: string) {
  return comparePassword(plain, this.passwordHash);
};

UserSchema.statics.hashPassword = function (plain: string) {
  return hashPassword(plain);
};

UserSchema.statics.activeAdminCount = function (excludeId?: string) {
  const query: Record<string, unknown> = {
    role: "website-admin",
    isActive: true,
  };

  if (excludeId) query._id = { $ne: excludeId };

  return this.countDocuments(query);
};

const User = (mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema)) as unknown as IUserModel;

export default User;
