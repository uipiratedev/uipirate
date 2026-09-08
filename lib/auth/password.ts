import bcrypt from "bcryptjs";

const COST = 12;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, COST);
}

export function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * Minimum bar for an invited user's password. Kept deliberately simple —
 * invited accounts get a generated temp password and are told to change it.
 */
export function isAcceptablePassword(plain: string): boolean {
  return typeof plain === "string" && plain.length >= 8 && plain.length <= 200;
}

/** Generates a readable one-time password for freshly invited users. */
export function generateTempPassword(): string {
  const words = [
    "harbor",
    "anchor",
    "compass",
    "rudder",
    "beacon",
    "cargo",
    "tide",
    "sail",
  ];
  const w = words[Math.floor(Math.random() * words.length)];
  const n = Math.floor(1000 + Math.random() * 9000);
  const sym = "!@#$%".charAt(Math.floor(Math.random() * 5));

  return `${w.charAt(0).toUpperCase()}${w.slice(1)}-${n}${sym}`;
}
