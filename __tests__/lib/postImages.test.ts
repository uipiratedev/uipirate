import { describe, expect, it } from "vitest";

import {
  isDataUri,
  isImageKind,
  parseImageDataUri,
  postImageUrl,
  proxyIfDataUri,
  versionOf,
} from "@/lib/cometCOS/images";

// 1x1 transparent PNG.
const PNG_B64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
const PNG_URI = `data:image/png;base64,${PNG_B64}`;

describe("parseImageDataUri", () => {
  it("decodes a base64 png", () => {
    const r = parseImageDataUri(PNG_URI)!;

    expect(r.mime).toBe("image/png");
    // PNG magic number.
    expect([...r.bytes.subarray(0, 4)]).toEqual([0x89, 0x50, 0x4e, 0x47]);
  });

  it("normalises image/jpg to image/jpeg", () => {
    expect(parseImageDataUri(`data:image/jpg;base64,${PNG_B64}`)!.mime).toBe(
      "image/jpeg",
    );
  });

  it("accepts extra parameters and mixed case", () => {
    expect(
      parseImageDataUri(`data:IMAGE/PNG;charset=utf-8;base64,${PNG_B64}`),
    ).not.toBeNull();
  });

  it("refuses SVG — it can carry script", () => {
    expect(
      parseImageDataUri(
        "data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9ImFsZXJ0KDEpIj48L3N2Zz4=",
      ),
    ).toBeNull();
  });

  it("refuses non-image types", () => {
    expect(parseImageDataUri("data:text/html;base64,PGgxPng8L2gxPg==")).toBeNull();
    expect(
      parseImageDataUri("data:application/javascript;base64,YWxlcnQoMSk="),
    ).toBeNull();
  });

  it("refuses non-base64 payloads", () => {
    expect(parseImageDataUri("data:image/png,%89PNG")).toBeNull();
  });

  it("refuses malformed or empty input", () => {
    expect(parseImageDataUri("data:image/png;base64,")).toBeNull();
    expect(parseImageDataUri("data:image/png;base64")).toBeNull();
    expect(parseImageDataUri("https://x.co/a.png")).toBeNull();
    expect(parseImageDataUri(undefined)).toBeNull();
    expect(parseImageDataUri(42)).toBeNull();
  });
});

describe("proxyIfDataUri", () => {
  it("rewrites a data uri to a short proxy path", () => {
    const out = proxyIfDataUri(PNG_URI, "nxvoy-case", "featured", "1700000000000");

    expect(out).toBe("/api/post-image/nxvoy-case/featured/1700000000000");
    // The whole point: the page no longer carries the payload.
    expect(out!.length).toBeLessThan(80);
  });

  it("leaves hosted urls, asset paths and undefined alone", () => {
    expect(proxyIfDataUri("https://res.cloudinary.com/a.png", "s", "banner", "1")).toBe(
      "https://res.cloudinary.com/a.png",
    );
    expect(proxyIfDataUri("/assets/blogs/x.png", "s", "banner", "1")).toBe(
      "/assets/blogs/x.png",
    );
    expect(proxyIfDataUri(undefined, "s", "banner", "1")).toBeUndefined();
  });
});

describe("postImageUrl", () => {
  it("puts the version in the path, sanitised", () => {
    expect(postImageUrl("a", "logo", "12/../34")).toBe(
      "/api/post-image/a/logo/1234",
    );
  });

  it("encodes the slug and defaults a missing version", () => {
    expect(postImageUrl("a b", "banner", undefined)).toBe(
      "/api/post-image/a%20b/banner/0",
    );
  });
});

describe("versionOf", () => {
  it("turns a timestamp into a stable number string", () => {
    expect(versionOf("2026-10-08T00:00:00.000Z")).toBe("1791417600000");
  });

  it("falls back to 0 for junk", () => {
    expect(versionOf("not a date")).toBe("0");
    expect(versionOf(undefined)).toBe("0");
  });
});

describe("small guards", () => {
  it("isDataUri", () => {
    expect(isDataUri(PNG_URI)).toBe(true);
    expect(isDataUri("/x.png")).toBe(false);
    expect(isDataUri(null)).toBe(false);
  });

  it("isImageKind only accepts the three kinds", () => {
    expect(isImageKind("featured")).toBe(true);
    expect(isImageKind("logo")).toBe(true);
    expect(isImageKind("../etc")).toBe(false);
  });
});
