import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSessionValue } from "@/lib/auth/admin-session";
import { getAdminPassword } from "@/lib/env";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as { password?: string };

  if (!payload.password || payload.password !== getAdminPassword()) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSessionValue(payload.password),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
