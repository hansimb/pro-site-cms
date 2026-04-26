import { getGitHubConfig } from "@/lib/env";
import { deleteGitHubFile, getGitHubFileSha, putGitHubFile } from "./client";

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
