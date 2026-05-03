import { describe, expect, it } from "vitest";
import { compactGithubStats } from "../src/features/site/github-stats";

describe("github stats compaction", () => {
  it("omits cards with missing values", () => {
    expect(
      compactGithubStats([
        { label: "Repositories", value: "24" },
        { label: "Contributions", value: undefined },
        { label: "Hours", value: undefined },
      ]),
    ).toEqual([{ label: "Repositories", value: "24" }]);
  });

  it("returns an empty array instead of zero fallbacks", () => {
    expect(
      compactGithubStats([
        { label: "Repositories", value: undefined },
        { label: "Contributions", value: undefined },
      ]),
    ).toEqual([]);
  });
});
