import { describe, expect, it } from "vitest";
import { normalizeContactSettings } from "../src/features/site/contact";

describe("contact settings normalization", () => {
  it("drops empty values instead of returning placeholders", () => {
    expect(
      normalizeContactSettings({
        email: "   ",
        githubUrl: "",
        linkedinUrl: "   ",
      }),
    ).toEqual({
      email: undefined,
      githubUrl: undefined,
      linkedinUrl: undefined,
    });
  });

  it("keeps valid values intact", () => {
    expect(
      normalizeContactSettings({
        email: "hans@imberg.dev",
        githubUrl: "https://github.com/imberg",
        linkedinUrl: "https://linkedin.com/in/imberg",
      }),
    ).toEqual({
      email: "hans@imberg.dev",
      githubUrl: "https://github.com/imberg",
      linkedinUrl: "https://linkedin.com/in/imberg",
    });
  });
});
