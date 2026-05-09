import { describe, expect, it } from "vitest";
import configPromise from "../payload.config";

describe("payload config shape", () => {
  it("registers the core collections and globals", async () => {
    const config = await configPromise;

    expect(config.collections?.map((collection) => collection.slug)).toEqual(
      expect.arrayContaining(["users", "media", "articles", "case-studies"]),
    );

    expect(config.globals?.map((global) => global.slug)).toEqual(["site-settings", "home-page"]);
  });

  it("suppresses admin hydration warnings from browser-side document mutations", async () => {
    const config = await configPromise;

    expect(config.admin.suppressHydrationWarning).toBe(true);
  });

  it("allows public read access to media files", async () => {
    const config = await configPromise;
    const media = config.collections?.find((collection) => collection.slug === "media");

    const readAccess = media?.access?.read;

    expect(readAccess).toBeTypeOf("function");
    const result = await (readAccess as NonNullable<typeof readAccess>)({
      id: undefined,
      data: undefined,
      req: {} as never,
    });

    expect(result).toBe(true);
  });

  it("uses a standardized structure for case studies", async () => {
    const config = await configPromise;
    const caseStudies = config.collections?.find(
      (collection) => collection.slug === "case-studies",
    );

    expect(caseStudies?.fields.map((field) => ("name" in field ? field.name : undefined))).toEqual(
      expect.arrayContaining([
        "title",
        "slug",
        "summary",
        "background",
        "problem",
        "solution",
        "process",
        "results",
        "whatILearned",
        "links",
        "tags",
      ]),
    );
  });

  it("exposes SEO controls in site settings", async () => {
    const config = await configPromise;
    const siteSettings = config.globals?.find((global) => global.slug === "site-settings");

    expect(siteSettings?.fields.map((field) => ("name" in field ? field.name : undefined))).toEqual(
      expect.arrayContaining(["siteTitle", "siteDescription", "contact", "seo"]),
    );
  });
});
