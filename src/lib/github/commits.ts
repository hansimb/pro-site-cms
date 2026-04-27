import { getGitHubConfig } from "@/lib/env";
import {
  createGitHubCommit,
  createGitHubTree,
  deleteGitHubFile,
  getGitHubBranchHead,
  getGitHubCommit,
  getGitHubFileSha,
  putGitHubFile,
  updateGitHubBranchHead,
} from "./client";

function toBase64(input: string | Uint8Array) {
  if (typeof input === "string") {
    return Buffer.from(input, "utf8").toString("base64");
  }

  return Buffer.from(input).toString("base64");
}

export async function upsertGitHubTextFile(filePath: string, content: string, message: string) {
  const config = getGitHubConfig();

  if (!config) {
    return false;
  }

  const sha = await getGitHubFileSha(filePath);
  await putGitHubFile({
    branch: config.branch,
    contentBase64: toBase64(content),
    filePath,
    message,
    sha,
  });

  return true;
}

export async function upsertGitHubBinaryFile(
  filePath: string,
  content: Uint8Array,
  message: string,
) {
  const config = getGitHubConfig();

  if (!config) {
    return false;
  }

  const sha = await getGitHubFileSha(filePath);
  await putGitHubFile({
    branch: config.branch,
    contentBase64: toBase64(content),
    filePath,
    message,
    sha,
  });

  return true;
}

export async function removeGitHubFile(filePath: string, message: string) {
  const config = getGitHubConfig();

  if (!config) {
    return false;
  }

  const sha = await getGitHubFileSha(filePath);

  if (!sha) {
    return true;
  }

  await deleteGitHubFile({
    branch: config.branch,
    filePath,
    message,
    sha,
  });

  return true;
}

export async function commitGitHubFileMap(
  fileMap: Record<string, string | null>,
  message: string,
) {
  const config = getGitHubConfig();

  if (!config) {
    throw new Error("GitHub config is not available.");
  }

  const parentCommitSha = await getGitHubBranchHead(config.branch);
  const parentCommit = await getGitHubCommit(parentCommitSha);
  const baseTreeSha = parentCommit.tree?.sha;

  if (!baseTreeSha) {
    throw new Error("Base tree SHA is missing.");
  }

  const entries = Object.entries(fileMap).map(([path, content]) =>
    content === null ? { path, sha: null as null } : { content, path },
  );

  const tree = await createGitHubTree({
    baseTree: baseTreeSha,
    entries,
  });

  if (!tree.sha) {
    throw new Error("Created GitHub tree SHA is missing.");
  }

  const commit = await createGitHubCommit({
    message,
    parent: parentCommitSha,
    tree: tree.sha,
  });

  if (!commit.sha) {
    throw new Error("Created GitHub commit SHA is missing.");
  }

  await updateGitHubBranchHead(config.branch, commit.sha);
}
