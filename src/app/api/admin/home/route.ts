import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";
import { isAuthenticatedAdminRequest } from "@/lib/auth/admin-session";
import { homeDocumentSchema } from "@/lib/content/schema";
import { saveHomeDocument } from "@/lib/content/writers";

export async function POST(request: NextRequest) {
  if (!isAuthenticatedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const document = homeDocumentSchema.parse(payload);
    await saveHomeDocument(document);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid home document", issues: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "Failed to save home document" }, { status: 500 });
  }
}
