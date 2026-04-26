import { createHash } from "node:crypto";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { NextRequest } from "next/server";
import { getAdminPassword } from "../env";

export const ADMIN_SESSION_COOKIE = "pro-site-cms-admin";

export function createAdminSessionValue(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export function hasValidAdminSessionValue(value: string | undefined) {
  if (!value) {
    return false;
  }

  return value === createAdminSessionValue(getAdminPassword());
}

export function isAuthenticatedAdminRequest(request: NextRequest) {
  return hasValidAdminSessionValue(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

export function hasAuthenticatedAdminCookie(cookieStore: ReadonlyRequestCookies) {
  return hasValidAdminSessionValue(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}
