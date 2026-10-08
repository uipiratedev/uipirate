import { describe, expect, it } from "vitest";

import { classifyConversion, deriveClickId } from "@/lib/analytics/conversions";

describe("classifyConversion", () => {
  it.each([
    ["https://wa.link/i35lma", "whatsapp"],
    ["https://wa.me/919999999999", "whatsapp"],
    ["https://api.whatsapp.com/send?phone=1", "whatsapp"],
    ["mailto:hello@uipirate.com", "email"],
    ["MAILTO:hello@uipirate.com", "email"],
    ["tel:+919999999999", "phone"],
    ["https://cal.com/ui-pirate/15min", "calendar"],
    ["https://calendly.com/x/30", "calendar"],
    ["https://www.upwork.com/freelancers/~010b0f5459bfcf5ed8/", "upwork"],
  ])("%s -> %s", (href, kind) => {
    expect(classifyConversion(href)).toBe(kind);
  });

  it.each([
    "/contact",
    "https://www.linkedin.com/company/ui-pirate",
    "https://twitter.com/ui_pirate",
    "https://notcal.com/x",
    // Look-alike hosts must not match.
    "https://evilwa.me/x",
    "https://upwork.com.evil.io/x",
    "",
    null,
    undefined,
  ])("ordinary link %s is not a conversion", (href) => {
    expect(classifyConversion(href as string | null | undefined)).toBeNull();
  });
});

describe("deriveClickId", () => {
  it("uses the destination, not the label", () => {
    expect(deriveClickId("/contact")).toBe("link:/contact");
    expect(deriveClickId("/contact?utm_source=x#top")).toBe("link:/contact");
    expect(deriveClickId("/pricing/")).toBe("link:/pricing");
  });

  it("collapses external links to their host", () => {
    expect(deriveClickId("https://wa.link/i35lma")).toBe("link:wa.link");
    expect(deriveClickId("https://www.linkedin.com/company/x")).toBe(
      "link:linkedin.com",
    );
  });

  it("treats same-site absolute links as internal", () => {
    expect(deriveClickId("https://uipirate.com/pricing")).toBe("link:/pricing");
  });

  it("handles mailto, tel and anchors", () => {
    expect(deriveClickId("mailto:a@b.co")).toBe("link:mailto");
    expect(deriveClickId("tel:+1")).toBe("link:tel");
    expect(deriveClickId("#pricing")).toBe("link:#pricing");
  });

  it("is undefined when there is no href", () => {
    expect(deriveClickId(undefined)).toBeUndefined();
    expect(deriveClickId("")).toBeUndefined();
  });
});
