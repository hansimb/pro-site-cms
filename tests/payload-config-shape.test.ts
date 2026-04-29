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
});
