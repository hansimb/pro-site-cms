import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("legacy custom CMS removal", () => {
  it("does not keep the old admin and custom content runtime in source", () => {
    expect(existsSync("src/app/admin")).toBe(false);
    expect(existsSync("src/app/api/admin")).toBe(false);
    expect(existsSync("src/app/api/content")).toBe(false);
    expect(existsSync("src/features/admin")).toBe(false);
    expect(existsSync("src/features/site/drafts")).toBe(false);
    expect(existsSync("src/lib/content")).toBe(false);
  });
});
