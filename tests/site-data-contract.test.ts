import { describe, expect, it } from "vitest";
import {
  getFallbackSiteModel,
  isPublishedArticleStatus,
} from "../src/features/site/data/payload-site";

describe("site data contract", () => {
  it("provides a minimal public model while Payload content is empty", () => {
    expect(getFallbackSiteModel()).toMatchObject({
      navigation: [
        { href: "/", label: "Home" },
        { href: "/writing", label: "Writing" },
        { href: "/case-studies", label: "Case studies" },
      ],
      settings: {
        siteTitle: "imberg.dev",
        seo: {
          metaDescription:
            "Developer portfolio focused on software, systems thinking, and business-aware technical work.",
          metaTitle: "imberg.dev",
        },
      },
    });
  });

  it("provides empty optional contact and social settings in the fallback model", () => {
    expect(getFallbackSiteModel().settings).toMatchObject({
      contact: {
        email: undefined,
        githubUrl: undefined,
        linkedinUrl: undefined,
      },
    });
  });

  it("treats only published articles as public content", () => {
    expect(isPublishedArticleStatus("published")).toBe(true);
    expect(isPublishedArticleStatus("draft")).toBe(false);
    expect(isPublishedArticleStatus(undefined)).toBe(false);
  });
});
