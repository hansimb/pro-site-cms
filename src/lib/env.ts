export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "change-me";
}

export function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH;

  if (!token || !owner || !repo || !branch) {
    return null;
  }

  return {
    branch,
    owner,
    repo,
    token,
  };
}
