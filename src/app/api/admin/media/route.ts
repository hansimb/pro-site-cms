import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { isAuthenticatedAdminRequest } from "@/lib/auth/admin-session";
import { upsertGitHubBinaryFile } from "@/lib/github/commits";
import { createSafeUploadFileName, validateImageFile } from "@/lib/media/validation";

export async function POST(request: NextRequest) {
  if (!isAuthenticatedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    validateImageFile(file);

    const safeName = createSafeUploadFileName(file.name);
    const relativePath = `public/uploads/${safeName}`;
    const publicPath = `/uploads/${safeName}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const wroteToGitHub = await upsertGitHubBinaryFile(
      relativePath,
      bytes,
      `content: upload image ${safeName}`,
    );

    if (!wroteToGitHub) {
      const filePath = path.join(process.cwd(), relativePath);
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, bytes);
    }

    return NextResponse.json({ ok: true, path: publicPath });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }
}
