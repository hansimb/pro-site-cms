import { ZodError, z } from "zod";
import { NextResponse, type NextRequest } from "next/server";
import { isAuthenticatedAdminRequest } from "@/lib/auth/admin-session";
import { navigationSchema, siteSettingsSchema } from "@/lib/content/schema";
import { saveNavigation, saveSiteSettings } from "@/lib/content/writers";

const settingsPayloadSchema = z.object({
  navigation: navigationSchema.optional(),
  siteSettings: siteSettingsSchema,
});

export async function POST(request: NextRequest) {
  if (!isAuthenticatedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = settingsPayloadSchema.parse(await request.json());
    await saveSiteSettings(payload.siteSettings);

    if (payload.navigation) {
      await saveNavigation(payload.navigation);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid site settings payload", issues: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "Failed to save site settings" }, { status: 500 });
  }
}
