import { describe, expect, it } from "vitest";
import { buildReferenceHref, formatArticleCitation, linkCitationText } from "../src/features/site/article-citations";

describe("article citation helpers", () => {
  it("formats a copyable citation string with fallbacks", () => {
    expect(
      formatArticleCitation({
        articleUrl: "https://imberg.dev/writing/tech/outlook",
        citationAuthors: "H. Imberg",
        citationPublication: "imberg.dev",
        citationTitle: "Tech & Economics Outlook",
        publishedAt: "2026-05-07T00:00:00.000Z",
        siteTitle: "imberg.dev",
        title: "Fallback title",
      }),
    ).toContain('H. Imberg, "Tech & Economics Outlook," imberg.dev, May 7, 2026. [Online]. Available: https://imberg.dev/writing/tech/outlook');
  });

  it("converts valid IEEE markers into reference anchors", () => {
    expect(linkCitationText("Claim [1] and another [2].", 2)).toEqual([
      { type: "text", value: "Claim " },
      { index: 1, type: "citation" },
      { type: "text", value: " and another " },
      { index: 2, type: "citation" },
      { type: "text", value: "." },
    ]);
  });

  it("leaves broken markers as plain text", () => {
    expect(linkCitationText("Missing [3].", 2)).toEqual([
      { type: "text", value: "Missing " },
      { type: "text", value: "[3]" },
      { type: "text", value: "." },
    ]);
  });

  it("builds stable reference anchors", () => {
    expect(buildReferenceHref(4)).toBe("#reference-4");
  });
});
