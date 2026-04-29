import { describe, expect, it } from "vitest";
import { getFallbackSiteModel } from "../src/features/site/data/payload-site";

describe("site data contract", () => {
  it("provides a minimal public model while Payload content is empty", () => {
    expect(getFallbackSiteModel()).toMatchObject({
      navigation: [
        { href: "/", label: "Home" },
        { href: "/writing", label: "Writing" },
        { href: "/case-studies", label: "Case studies" },
      ],
      settings: {
        siteTitle: "Pro Site CMS",
      },
    });
  });
});
