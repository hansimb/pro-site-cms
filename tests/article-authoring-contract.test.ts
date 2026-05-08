import { describe, expect, it } from "vitest";
import {
  Articles,
  formatArticleSlug,
  resolvePublishedAt,
} from "../src/payload/collections/articles";

describe("article authoring contract", () => {
  it("adds evergreen SEO and citation fields to articles", () => {
    const fieldNames = Articles.fields.map((field) =>
      "name" in field ? field.name : undefined,
    );
    const slugField = Articles.fields.find(
      (field) => "name" in field && field.name === "slug",
    );
    const keywordsField = Articles.fields.find(
      (field) => "name" in field && field.name === "keywords",
    );
    const keywordsTextField = Articles.fields.find(
      (field) => "name" in field && field.name === "keywordsText",
    );

    expect(fieldNames).toEqual(
      expect.arrayContaining([
        "seoTitle",
        "seoDescription",
        "keywords",
        "keywordsText",
        "citationAuthors",
      ]),
    );
    expect(fieldNames).not.toContain("canonicalUrl");
    expect(fieldNames).not.toContain("citationTitle");
    expect(fieldNames).not.toContain("citationPublication");
    expect(
      slugField && "admin" in slugField
        ? (slugField.admin as { hidden?: boolean } | undefined)?.hidden
        : undefined,
    ).toBe(true);
    expect(
      keywordsField && "admin" in keywordsField
        ? (keywordsField.admin as { hidden?: boolean } | undefined)?.hidden
        : undefined,
    ).toBe(true);
    expect(keywordsTextField && "type" in keywordsTextField ? keywordsTextField.type : undefined).toBe(
      "text",
    );
  });

  it("expands references beyond a plain label and URL", () => {
    const referencesField = Articles.fields.find(
      (field) => "name" in field && field.name === "references",
    );

    expect(referencesField && "fields" in referencesField ? referencesField.fields.map((field) =>
      "name" in field ? field.name : undefined,
    ) : []).toEqual(
      expect.arrayContaining([
        "label",
        "url",
        "publisher",
        "publishedAt",
        "accessedAt",
      ]),
    );
  });

  it("creates stable slugs from article titles", () => {
    expect(
      formatArticleSlug(
        "AI, SaaS and the Semiconductor Cycle: A Longer-Term Technology Outlook",
      ),
    ).toBe("ai-saas-and-the-semiconductor-cycle-a-longer-term-technology-outlook");
  });

  it("sets publishedAt when an article is first published", () => {
    const now = "2026-05-08T10:00:00.000Z";

    expect(
      resolvePublishedAt({
        now,
        originalDoc: { _status: "draft" },
        status: "published",
      }),
    ).toBe(now);
  });

  it("preserves publishedAt for already published articles", () => {
    expect(
      resolvePublishedAt({
        now: "2026-05-08T10:00:00.000Z",
        originalDoc: {
          _status: "published",
          publishedAt: "2026-05-07T10:00:00.000Z",
        },
        status: "published",
      }),
    ).toBe("2026-05-07T10:00:00.000Z");
  });
});
