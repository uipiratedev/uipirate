import { describe, it, expect } from "vitest";

import { rateLimit } from "@/lib/rateLimit";

describe("rateLimit", () => {
  it("allows up to the limit, then blocks within the window", () => {
    const key = `test-${Math.random()}`;

    for (let i = 0; i < 3; i++) {
      expect(rateLimit(key, 3, 60_000).allowed).toBe(true);
    }
    expect(rateLimit(key, 3, 60_000).allowed).toBe(false);
  });

  it("resets after the window elapses", async () => {
    const key = `test-${Math.random()}`;

    expect(rateLimit(key, 1, 20).allowed).toBe(true);
    expect(rateLimit(key, 1, 20).allowed).toBe(false);
    await new Promise((r) => setTimeout(r, 30));
    expect(rateLimit(key, 1, 20).allowed).toBe(true);
  });

  it("reports remaining count", () => {
    const key = `test-${Math.random()}`;
    const first = rateLimit(key, 5, 60_000);

    expect(first.remaining).toBe(4);
  });
});
