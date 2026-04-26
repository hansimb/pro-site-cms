import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";
import { isAuthenticatedAdminRequest } from "@/lib/auth/admin-session";
import { caseStudyIndexSchema } from "@/lib/content/schema";
import { saveCaseStudies } from "@/lib/content/writers";

export async function POST(request: NextRequest) {
  if (!isAuthenticatedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = caseStudyIndexSchema.parse(payload);
    await saveCaseStudies(parsed.items);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid case study payload", issues: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "Failed to save case studies" }, { status: 500 });
  }
}
