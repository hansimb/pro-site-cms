import { describe, expect, it } from "vitest";
import { siteThemeConfig } from "../src/features/site/theme/system";

describe("Chakra site system", () => {
  it("defines a dark-only product palette with one bright accent", () => {
    expect(siteThemeConfig.theme?.tokens?.colors?.accent).toBeDefined();
    expect(siteThemeConfig.theme?.tokens?.colors?.canvas).toBeDefined();
    expect(siteThemeConfig.theme?.tokens?.radii?.panel).toBeDefined();
  });
});
