import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";
import { isAuthenticatedAdminRequest } from "@/lib/auth/admin-session";
import { publishDraftPayloadSchema } from "@/lib/content/draft-schema";
import { publishDraftPayload } from "@/lib/content/publish";
import { getEditMode } from "@/lib/env";

export async function POST(request: NextRequest) {
  if (!isAuthenticatedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (getEditMode() !== "GITHUB") {
    return NextResponse.json({ error: "Publish is only available in GITHUB mode" }, { status: 400 });
  }

  try {
    const payload = publishDraftPayloadSchema.parse(await request.json());
    await publishDraftPayload(payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid publish payload", issues: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to publish draft" },
      { status: 500 },
    );
  }
}
