import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasAuthenticatedAdminCookie } from "./admin-session";

export async function requireAdminPageAccess() {
  const cookieStore = await cookies();

  if (!hasAuthenticatedAdminCookie(cookieStore)) {
    redirect("/admin/login");
  }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return hasAuthenticatedAdminCookie(cookieStore);
}
