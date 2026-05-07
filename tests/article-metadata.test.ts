import { describe, expect, it } from "vitest";
import type { SiteArticle } from "../src/features/site/data/payload-site";
import { getFallbackSiteModel } from "../src/features/site/data/payload-site";
import { buildArticleMetadata } from "../src/features/site/metadata";

describe("article metadata", () => {
  it("prefers article SEO overrides and canonical URLs", () => {
    const site = getFallbackSiteModel();
    const article: SiteArticle = {
      canonicalUrl: "https://example.com/canonical",
      citationAuthors: "H. Imberg",
      content: null,
      excerpt: "Plain excerpt",
      keywords: ["macro", "software"],
      publishedAt: "2026-05-07T00:00:00.000Z",
      references: [],
      seoDescription: "SEO description",
      seoTitle: "SEO title",
      title: "Plain title",
      topic: "markets",
      updatedAt: "2026-05-08T00:00:00.000Z",
    };

    const metadata = buildArticleMetadata(site, article);

    expect(metadata.title).toBe("SEO title");
    expect(metadata.description).toBe("SEO description");
    expect(metadata.alternates?.canonical).toBe("https://example.com/canonical");
    expect(metadata.openGraph).toMatchObject({
      title: "SEO title",
      description: "SEO description",
      type: "article",
    });
  });
});
