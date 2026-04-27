import { beforeEach, describe, expect, it } from "vitest";
import { getGitHubConfig } from "../src/lib/env";

describe("edit mode env", () => {
  beforeEach(() => {
    delete process.env.EDIT_MODE;
    delete process.env.GITHUB_TOKEN;
    delete process.env.GITHUB_OWNER;
    delete process.env.GITHUB_REPO;
    delete process.env.GITHUB_BRANCH;
  });

  it("does not enable GitHub writes in LOCAL mode", () => {
    process.env.EDIT_MODE = "LOCAL";
    process.env.GITHUB_TOKEN = "token";
    process.env.GITHUB_OWNER = "owner";
    process.env.GITHUB_REPO = "repo";
    process.env.GITHUB_BRANCH = "main";

    expect(getGitHubConfig()).toBeNull();
  });

  it("enables GitHub writes in GITHUB mode when config is complete", () => {
    process.env.EDIT_MODE = "GITHUB";
    process.env.GITHUB_TOKEN = "token";
    process.env.GITHUB_OWNER = "owner";
    process.env.GITHUB_REPO = "repo";
    process.env.GITHUB_BRANCH = "main";

    expect(getGitHubConfig()).toEqual({
      token: "token",
      owner: "owner",
      repo: "repo",
      branch: "main",
    });
  });
});
