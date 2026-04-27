import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

async function getFilesRecursively(rootDir: string, currentDir = rootDir): Promise<string[]> {
  const entries = await readdir(currentDir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        return getFilesRecursively(rootDir, fullPath);
      }

      return [fullPath];
    }),
  );

  return files.flat();
}

export async function GET() {
  const contentRoot = path.join(process.cwd(), "content");
  const publicRoot = path.join(process.cwd(), "public", "uploads");

  try {
    const files = [
      ...(await getFilesRecursively(contentRoot)),
      ...(await getFilesRecursively(publicRoot).catch(() => [])),
    ];
    const stats = await Promise.all(files.map((filePath) => stat(filePath)));
    const version = stats.reduce((latest, item) => Math.max(latest, item.mtimeMs), 0);

    return NextResponse.json({ version });
  } catch {
    return NextResponse.json({ version: 0 });
  }
}
