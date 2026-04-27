import { getGitHubConfig } from "@/lib/env";

function getGitHubHeaders() {
  const config = getGitHubConfig();

  if (!config) {
    throw new Error("GitHub config is not available.");
  }

  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${config.token}`,
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function getContentsUrl(filePath: string) {
  const config = getGitHubConfig();

  if (!config) {
    throw new Error("GitHub config is not available.");
  }

  return `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}`;
}

function getGitUrl(pathname: string) {
  const config = getGitHubConfig();

  if (!config) {
    throw new Error("GitHub config is not available.");
  }

  return `https://api.github.com/repos/${config.owner}/${config.repo}${pathname}`;
}

export async function getGitHubFileSha(filePath: string) {
  const config = getGitHubConfig();

  if (!config) {
    return null;
  }

  const response = await fetch(`${getContentsUrl(filePath)}?ref=${config.branch}`, {
    headers: getGitHubHeaders(),
    method: "GET",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to read GitHub file metadata for ${filePath}.`);
  }

  const payload = (await response.json()) as { sha?: string };
  return payload.sha ?? null;
}

export async function putGitHubFile(options: {
  branch: string;
  contentBase64: string;
  filePath: string;
  message: string;
  sha?: string | null;
}) {
  const response = await fetch(getContentsUrl(options.filePath), {
    method: "PUT",
    headers: getGitHubHeaders(),
    body: JSON.stringify({
      branch: options.branch,
      content: options.contentBase64,
      message: options.message,
      sha: options.sha ?? undefined,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to write ${options.filePath} to GitHub.`);
  }

  return response.json();
}

export async function deleteGitHubFile(options: {
  branch: string;
  filePath: string;
  message: string;
  sha: string;
}) {
  const response = await fetch(getContentsUrl(options.filePath), {
    method: "DELETE",
    headers: getGitHubHeaders(),
    body: JSON.stringify({
      branch: options.branch,
      message: options.message,
      sha: options.sha,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete ${options.filePath} from GitHub.`);
  }

  return response.json();
}

export async function getGitHubBranchHead(branch: string) {
  const response = await fetch(getGitUrl(`/git/ref/heads/${branch}`), {
    headers: getGitHubHeaders(),
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to read branch head for ${branch}.`);
  }

  const payload = (await response.json()) as { object?: { sha?: string } };
  const sha = payload.object?.sha;

  if (!sha) {
    throw new Error(`Branch head SHA for ${branch} is missing.`);
  }

  return sha;
}

export async function getGitHubCommit(commitSha: string) {
  const response = await fetch(getGitUrl(`/git/commits/${commitSha}`), {
    headers: getGitHubHeaders(),
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to read commit ${commitSha}.`);
  }

  return (await response.json()) as { tree?: { sha?: string } };
}

export async function createGitHubTree(options: {
  baseTree: string;
  entries: Array<{
    content?: string;
    path: string;
    sha: null;
  } | {
    content: string;
    path: string;
  }>;
}) {
  const tree = options.entries.map((entry) => {
    if ("sha" in entry) {
      return {
        mode: "100644",
        path: entry.path,
        sha: null,
        type: "blob",
      };
    }

    return {
      content: entry.content,
      mode: "100644",
      path: entry.path,
      type: "blob",
    };
  });

  const response = await fetch(getGitUrl("/git/trees"), {
    method: "POST",
    headers: getGitHubHeaders(),
    body: JSON.stringify({
      base_tree: options.baseTree,
      tree,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create GitHub tree.");
  }

  return (await response.json()) as { sha?: string };
}

export async function createGitHubCommit(options: {
  message: string;
  parent: string;
  tree: string;
}) {
  const response = await fetch(getGitUrl("/git/commits"), {
    method: "POST",
    headers: getGitHubHeaders(),
    body: JSON.stringify({
      message: options.message,
      parents: [options.parent],
      tree: options.tree,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create GitHub commit.");
  }

  return (await response.json()) as { sha?: string };
}

export async function updateGitHubBranchHead(branch: string, commitSha: string) {
  const response = await fetch(getGitUrl(`/git/refs/heads/${branch}`), {
    method: "PATCH",
    headers: getGitHubHeaders(),
    body: JSON.stringify({
      force: false,
      sha: commitSha,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update branch ${branch}.`);
  }

  return response.json();
}
