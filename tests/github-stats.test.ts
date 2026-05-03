import { describe, expect, it } from "vitest";
import { compactGithubStats } from "../src/features/site/github-stats";

describe("github stats compaction", () => {
  it("omits cards with missing values", () => {
    expect(
      compactGithubStats([
        { key: "publicRepos", label: "Repositories", value: "24" },
        { key: "contributions", label: "Contributions", value: undefined },
        { key: "codingTime", label: "Hours", value: undefined },
      ]),
    ).toEqual([{ key: "publicRepos", label: "Repositories", value: "24" }]);
  });

  it("returns an empty array instead of zero fallbacks", () => {
    expect(
      compactGithubStats([
        { key: "publicRepos", label: "Repositories", value: undefined },
        { key: "contributions", label: "Contributions", value: undefined },
      ]),
    ).toEqual([]);
  });
});
