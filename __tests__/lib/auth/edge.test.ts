import { createHmac } from "node:crypto";

import { describe, it, expect, beforeAll } from "vitest";

const SECRET = "test-secret-value-1234567890";

process.env.JWT_SECRET = SECRET;

// Import after the env var is set (edge.ts reads it lazily inside the fn, but be safe).
let verifySessionEdge: typeof import("@/lib/auth/edge").verifySessionEdge;

beforeAll(async () => {
  ({ verifySessionEdge } = await import("@/lib/auth/edge"));
});

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signHS256(payload: Record<string, unknown>, secret = SECRET): string {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify(payload));
  const sig = b64url(
    createHmac("sha256", secret).update(`${header}.${body}`).digest(),
  );

  return `${header}.${body}.${sig}`;
}

const base = {
  uid: "u1",
  email: "a@b.com",
  role: "website-admin",
  iss: "uipirate",
  aud: "uipirate-admin",
  exp: Math.floor(Date.now() / 1000) + 3600,
};

describe("verifySessionEdge", () => {
  it("accepts a well-formed, correctly signed token", async () => {
    const out = await verifySessionEdge(signHS256(base));

    expect(out).toEqual({ uid: "u1", email: "a@b.com", role: "website-admin" });
  });

  it("rejects a tampered payload", async () => {
    const token = signHS256(base);
    const [h, , s] = token.split(".");
    const forged = `${h}.${b64url(JSON.stringify({ ...base, role: "normal-user" }))}.${s}`;

    expect(await verifySessionEdge(forged)).toBeNull();
  });

  it("rejects a token signed with the wrong secret", async () => {
    expect(await verifySessionEdge(signHS256(base, "wrong-secret"))).toBeNull();
  });

  it("rejects an expired token", async () => {
    expect(
      await verifySessionEdge(
        signHS256({ ...base, exp: Math.floor(Date.now() / 1000) - 10 }),
      ),
    ).toBeNull();
  });

  it("rejects wrong issuer / audience", async () => {
    expect(
      await verifySessionEdge(signHS256({ ...base, iss: "evil" })),
    ).toBeNull();
    expect(
      await verifySessionEdge(signHS256({ ...base, aud: "evil" })),
    ).toBeNull();
  });

  it("rejects malformed input", async () => {
    expect(await verifySessionEdge(undefined)).toBeNull();
    expect(await verifySessionEdge("not.a.jwt.at.all")).toBeNull();
    expect(await verifySessionEdge("")).toBeNull();
  });
});
